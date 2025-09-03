import { GoogleGenAI } from "@google/genai";

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateLegalDocumentWithAI(
  documentType: string,
  businessInfo: Record<string, any>
): Promise<string> {
  try {
    const prompt = createDetailedDocumentPrompt(documentType, businessInfo);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    return response.text || "Error generating document content";
  } catch (error) {
    console.error("Error generating document with Gemini AI:", error);
    throw new Error("Failed to generate legal document with AI");
  }
}

function createDetailedDocumentPrompt(
  documentType: string,
  businessInfo: Record<string, any>
): string {
  const businessName = businessInfo.businessName || "Your Business";
  const website = businessInfo.website || "your-website.com";
  const contactEmail = businessInfo.contactEmail || "contact@your-business.com";
  const jurisdiction = businessInfo.jurisdiction || "United States";

  switch (documentType) {
    case "privacy-policy":
      return createPrivacyPolicyPrompt(businessInfo, businessName, website, contactEmail, jurisdiction);
    case "terms-of-service":
      return createTermsOfServicePrompt(businessInfo, businessName, website, contactEmail, jurisdiction);
    case "cookie-consent":
      return createCookieConsentPrompt(businessInfo, businessName, website, jurisdiction);
    default:
      throw new Error("Unsupported document type");
  }
}

function createPrivacyPolicyPrompt(
  businessInfo: Record<string, any>,
  businessName: string,
  website: string,
  contactEmail: string,
  jurisdiction: string
): string {
  return `Generate a comprehensive Privacy Policy for ${businessName}. Use the following business information:

BUSINESS DETAILS:
- Business Name: ${businessName}
- Website: ${website}
- Business Type: ${businessInfo.businessType || "General business"}
- Contact Email: ${contactEmail}
- Jurisdiction: ${jurisdiction}

DATA COLLECTION:
- Collects Personal Data: ${businessInfo.collectsPersonalData || "Yes"}
- Data Types Collected: ${businessInfo.dataTypes || "Email addresses, names, contact information"}
- Uses Analytics: ${businessInfo.usesAnalytics || "Yes"}
- Uses Cookies: ${businessInfo.usesCookies || "Yes"}
- Shares Data with Third Parties: ${businessInfo.sharesDataWithThirdParties || "No"}

REQUIREMENTS:
1. Include all standard privacy policy sections
2. Make it GDPR compliant with proper legal basis for processing
3. Include CCPA compliance where applicable
4. Add clear data subject rights section
5. Include cookie policy information
6. Add contact information for privacy inquiries
7. Use professional legal language but keep it understandable
8. Include effective date as today's date
9. Add proper legal disclaimers
10. Ensure compliance with ${jurisdiction} privacy laws

Generate a complete, professional privacy policy document that covers all these requirements.`;
}

function createTermsOfServicePrompt(
  businessInfo: Record<string, any>,
  businessName: string,
  website: string,
  contactEmail: string,
  jurisdiction: string
): string {
  return `Generate comprehensive Terms of Service for ${businessName}. Use the following business information:

BUSINESS DETAILS:
- Business Name: ${businessName}
- Website: ${website}
- Business Type: ${businessInfo.businessType || "General business"}
- Contact Email: ${contactEmail}
- Jurisdiction: ${jurisdiction}

SERVICE DETAILS:
- Has User Accounts: ${businessInfo.hasUserAccounts || "Yes"}
- Product Type: ${businessInfo.productType || "Digital services"}
- Payment Method: ${businessInfo.paymentMethod || "Credit card"}
- Refund Policy: ${businessInfo.refundPolicy || "Standard refund policy applies"}
- User Rules: ${businessInfo.userRules || "Standard acceptable use policy"}

REQUIREMENTS:
1. Include acceptance of terms section
2. Add description of services
3. Include user account and registration terms
4. Add payment and billing terms
5. Include refund and cancellation policy
6. Add prohibited uses section
7. Include intellectual property rights
8. Add limitation of liability
9. Include termination clause
10. Add dispute resolution and governing law
11. Include modification of terms
12. Add contact information
13. Use professional legal language
14. Ensure compliance with ${jurisdiction} laws

Generate a complete, professional terms of service document.`;
}

function createCookieConsentPrompt(
  businessInfo: Record<string, any>,
  businessName: string,
  website: string,
  jurisdiction: string
): string {
  return `Generate a Cookie Policy and consent banner configuration for ${businessName}. Use the following information:

BUSINESS DETAILS:
- Business Name: ${businessName}
- Website: ${website}
- Jurisdiction: ${jurisdiction}

COOKIE USAGE:
- Cookie Types: ${businessInfo.cookieTypes || "Essential, Analytics, Marketing"}
- Uses Analytics: ${businessInfo.usesAnalytics || "Yes"}
- Uses Advertising: ${businessInfo.usesAdvertising || "No"}
- Uses Social Media: ${businessInfo.usesSocialMedia || "No"}
- Consent Type: ${businessInfo.consentType || "Granular consent options"}

REQUIREMENTS:
1. Generate a complete cookie policy document
2. Include cookie categories and purposes
3. Add information about specific cookies used
4. Include user rights regarding cookies
5. Add contact information
6. Create cookie banner text for website
7. Include granular consent options if requested
8. Ensure GDPR Article 7 compliance
9. Add instructions for managing cookie preferences
10. Include legal basis for cookie processing
11. Make it compliant with ${jurisdiction} laws

Generate both a detailed cookie policy document AND suggested cookie banner implementation text.`;
}

export async function generateChatResponse(
  documentType: string,
  conversationHistory: Array<{ role: string; content: string }>,
  userMessage: string,
  businessInfo: Record<string, any> = {}
): Promise<{ response: string; extractedInfo: Record<string, any>; isCompleted: boolean }> {
  try {
    const docTypeDisplay = documentType.replace('-', ' ');
    
    // Build conversation context
    const conversationContext = conversationHistory.length > 0 
      ? `\nConversation history:\n${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
      : "";

    // Current business info context
    const currentInfo = Object.keys(businessInfo).length > 0 
      ? `\nCurrent business information collected:\n${Object.entries(businessInfo).map(([key, value]) => `- ${key}: ${value}`).join('\n')}`
      : "";

    const systemPrompt = `You are a helpful AI assistant helping create ${docTypeDisplay} documents. Be conversational and friendly.

Current conversation:${conversationContext}
Business info collected so far:${currentInfo}

User just said: "${userMessage}"

Respond naturally and helpfully. If they gave you business information, acknowledge it. If you need more details for the ${docTypeDisplay}, ask friendly questions.

For ${docTypeDisplay}, you typically need:
${getRequiredFields(documentType)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: systemPrompt,
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    // Try to parse JSON, but if it fails, treat as plain text
    try {
      const parsed = JSON.parse(responseText);
      return {
        response: parsed.response || responseText,
        extractedInfo: parsed.extractedInfo || {},
        isCompleted: parsed.isCompleted || false
      };
    } catch (parseError) {
      console.error("AI response was not JSON, using as plain text:", parseError);
      // Extract basic business info from the text if possible
      const extractedInfo: Record<string, any> = {};
      const lowerText = responseText.toLowerCase();
      
      // Simple extraction patterns
      if (lowerText.includes('business name') || lowerText.includes('company')) {
        // Look for business name mentions
        const businessMatch = responseText.match(/business name[:\s]*([\w\s]+)/i);
        if (businessMatch) {
          extractedInfo.businessName = businessMatch[1].trim();
        }
      }
      
      return {
        response: responseText,
        extractedInfo,
        isCompleted: false
      };
    }

  } catch (error) {
    console.error("Error generating chat response:", error);
    // Provide a specific response based on document type
    const docTypeDisplay = documentType.replace('-', ' ');
    return {
      response: `I'm here to help you create your ${docTypeDisplay}! To get started, could you tell me about your business? I'll need details like your business name, website, and what type of services you provide.`,
      extractedInfo: {},
      isCompleted: false
    };
  }
}

function getRequiredFields(documentType: string): string {
  switch (documentType) {
    case "privacy-policy":
      return `- Business name and website
- Contact email
- Types of personal data collected
- Whether you use cookies and analytics
- If you share data with third parties
- Your business location/jurisdiction`;
    
    case "terms-of-service":
      return `- Business name and website
- Contact email  
- Description of your services/products
- Whether users create accounts
- Payment and refund policies
- Your business location/jurisdiction`;
    
    case "cookie-consent":
      return `- Business name and website
- Types of cookies used (essential, analytics, marketing)
- Analytics tools used (Google Analytics, etc.)
- Whether you use advertising cookies
- Your business location/jurisdiction`;
    
    default:
      return "- Basic business information including name, website, and contact details";
  }
}
