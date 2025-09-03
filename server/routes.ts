import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { generateLegalDocument } from "./services/document-generator";
import { insertChatSessionSchema, insertDocumentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat session routes
  app.post("/api/chat/session", async (req, res) => {
    try {
      const { documentType } = req.body;
      
      if (!documentType) {
        return res.status(400).json({ message: "Document type is required" });
      }

      // Create initial AI message
      const getInitialMessage = (docType: string): string => {
        const docDisplay = docType.replace('-', ' ');
        return `Hi! I'm here to help you create a professional ${docDisplay} for your business. To get started, could you tell me about your business? Business name, what your role is in the company (eg. founder/owner, manager etc), and your businesses website url, if you have one.`;
      };

      const session = await storage.createChatSession({
        documentType,
        messages: [
          {
            role: "assistant",
            content: getInitialMessage(documentType),
            timestamp: Date.now()
          }
        ],
        businessInfo: {},
      });

      res.json({ sessionId: session.id });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating chat session: " + error.message });
    }
  });

  app.get("/api/chat/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getChatSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching chat session: " + error.message });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    try {
      const { sessionId, message } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ message: "Session ID and message are required" });
      }

      const updatedSession = await storage.addChatMessage(sessionId, message);
      res.json(updatedSession);
    } catch (error: any) {
      res.status(500).json({ message: "Error processing message: " + error.message });
    }
  });

  // Document generation routes
  app.post("/api/documents/generate", async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      const session = await storage.getChatSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      const document = await generateLegalDocument(session);
      const savedDocument = await storage.createDocument({
        type: session.documentType,
        title: document.title,
        content: document.content,
        metadata: session.businessInfo as Record<string, any>,
      });

      res.json({ document: savedDocument });
    } catch (error: any) {
      res.status(500).json({ message: "Error generating document: " + error.message });
    }
  });

  app.get("/api/documents/:documentId", async (req, res) => {
    try {
      const { documentId } = req.params;
      const document = await storage.getDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json(document);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching document: " + error.message });
    }
  });

  // Free document download route - no payment required
  app.get("/api/documents/:documentId/download", async (req, res) => {
    try {
      const { documentId } = req.params;
      const document = await storage.getDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Mark document as downloaded for analytics
      await storage.updateDocumentStatus(documentId, "downloaded");

      res.json({ 
        success: true, 
        document: document,
        message: "Document ready for download" 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error preparing download: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
