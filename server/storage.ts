import { type User, type InsertUser, type Document, type InsertDocument, type ChatSession, type InsertChatSession, type Payment, type InsertPayment } from "@shared/schema";
import { randomUUID } from "crypto";
import { addMessageToSession } from "./services/document-generator";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Document methods
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocumentStatus(id: string, status: string): Promise<Document | undefined>;

  // Chat session methods
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  addChatMessage(sessionId: string, userMessage: string): Promise<ChatSession>;
  updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined>;

  // Payment methods
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(stripePaymentIntentId: string, status: string): Promise<Payment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private documents: Map<string, Document>;
  private chatSessions: Map<string, ChatSession>;
  private payments: Map<string, Payment>;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.chatSessions = new Map();
    this.payments = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Document methods
  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const now = new Date();
    const document: Document = {
      ...insertDocument,
      id,
      userId: null,
      status: "draft",
      metadata: insertDocument.metadata || {},
      createdAt: now,
      updatedAt: now,
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocumentStatus(id: string, status: string): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (document) {
      const updated = { ...document, status, updatedAt: new Date() };
      this.documents.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Chat session methods
  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const now = new Date();
    const session: ChatSession = {
      ...insertSession,
      id,
      userId: null,
      documentId: null,
      messages: insertSession.messages || [],
      businessInfo: insertSession.businessInfo || {},
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async addChatMessage(sessionId: string, userMessage: string): Promise<ChatSession> {
    const session = this.chatSessions.get(sessionId);
    if (!session) {
      throw new Error("Chat session not found");
    }

    // Use the document generator service to handle the conversation
    const updatedSession = await addMessageToSession(session, userMessage);
    
    // Update the session in storage
    const updated = { ...updatedSession, updatedAt: new Date() };
    this.chatSessions.set(sessionId, updated);
    return updated;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (session) {
      const updated = { ...session, ...updates, updatedAt: new Date() };
      this.chatSessions.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Payment methods
  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      ...insertPayment,
      id,
      userId: null,
      documentId: insertPayment.documentId || null,
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePaymentStatus(stripePaymentIntentId: string, status: string): Promise<Payment | undefined> {
    const payment = Array.from(this.payments.values()).find(
      p => p.stripePaymentIntentId === stripePaymentIntentId
    );
    
    if (payment) {
      const updated = { ...payment, status };
      this.payments.set(payment.id, updated);
      return updated;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
