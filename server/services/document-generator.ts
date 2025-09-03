import { ChatSession } from "@shared/schema";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface BusinessInfo {
  businessName?: string;
  businessType?: string;
  website?: string;
  collectsPersonalData?: boolean;
  dataTypes?: string[];
  usesAnalytics?: boolean;
  usesCookies?: boolean;
  sharesDataWithThirdParties?: boolean;
  jurisdiction?: string;
  contactEmail?: string;
  [key: string]: any;
}

// Legacy question system - no longer used with AI chat
// Keeping for reference but the AI now handles conversation intelligently

export async function addMessageToSession(session: ChatSession, userMessage: string): Promise<ChatSession> {
  const messages = Array.isArray(session.messages) ? session.messages : [];
  const businessInfo = session.businessInfo || {};
  
  // Add user message
  const userMsg: ChatMessage = {
    role: "user",
    content: userMessage,
    timestamp: Date.now()
  };
  
  const updatedMessages = [...messages, userMsg];
  
  // Use Gemini AI for intelligent conversation
  const { generateChatResponse } = await import("./gemini");
  
  try {
    const aiResult = await generateChatResponse(
      session.documentType,
      messages, // Pass existing conversation history
      userMessage,
      businessInfo
    );
    
    // Merge extracted information with existing business info
    const updatedBusinessInfo = {
      ...businessInfo,
      ...aiResult.extractedInfo
    };
    
    const aiMsg: ChatMessage = {
      role: "assistant", 
      content: aiResult.response,
      timestamp: Date.now()
    };
    
    return {
      ...session,
      messages: [...updatedMessages, aiMsg],
      businessInfo: updatedBusinessInfo,
      isCompleted: aiResult.isCompleted
    };
    
  } catch (error) {
    console.error("Error in AI conversation:", error);
    
    // Fallback response
    const fallbackMsg: ChatMessage = {
      role: "assistant",
      content: "I'm having trouble processing your message. Could you please tell me about your business? I'll need details like your business name, website, and what type of services you provide.",
      timestamp: Date.now()
    };
    
    return {
      ...session,
      messages: [...updatedMessages, fallbackMsg],
      businessInfo,
      isCompleted: false
    };
  }
}

// Legacy question mapping - no longer needed with AI extraction

export async function generateLegalDocument(session: ChatSession): Promise<{ title: string; content: string }> {
  const businessInfo = session.businessInfo as BusinessInfo;
  
  const prompt = createDocumentPrompt(session.documentType, businessInfo);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });
    
    const content = response.text || "Error generating document content";
    const title = getDocumentTitle(session.documentType, businessInfo.businessName || "Your Business");
    
    return { title, content };
  } catch (error) {
    console.error("Error generating document:", error);
    throw new Error("Failed to generate legal document");
  }
}

function createDocumentPrompt(documentType: string, businessInfo: BusinessInfo): string {
  const basePrompt = `Generate a comprehensive and legally compliant ${documentType.replace('-', ' ')} document based on the following business information:

Business Information:
${Object.entries(businessInfo).map(([key, value]) => `${key}: ${value}`).join('\n')}

Requirements:
- The document must be professional and legally sound
- Include all necessary sections for ${documentType.replace('-', ' ')}
- Use clear, understandable language
- Include specific details based on the business information provided
- Ensure GDPR compliance where applicable
- Include proper legal disclaimers
- Format the document with clear sections and headings
- Make it ready for use by the business

Please generate a complete, professional ${documentType.replace('-', ' ')} document.`;

  return basePrompt;
}

function getDocumentTitle(documentType: string, businessName: string): string {
  switch (documentType) {
    case "privacy-policy":
      return `Privacy Policy - ${businessName}`;
    case "terms-of-service":
      return `Terms of Service - ${businessName}`;
    case "cookie-consent":
      return `Cookie Policy - ${businessName}`;
    default:
      return `Legal Document - ${businessName}`;
  }
}
