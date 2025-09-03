import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { generatePDF } from "@/lib/pdf-generator";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chat } from "@/components/ui/chat";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Shield, Cookie } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  documentType: string;
  messages: ChatMessage[];
  businessInfo: Record<string, any>;
  isCompleted: boolean;
}

interface Document {
  id: string;
  type: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

export default function Home() {
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<Document | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);

  const documentTypes = [
    { 
      id: "privacy-policy", 
      name: "Privacy Policy", 
      icon: Shield,
      description: "GDPR, CCPA compliant privacy policies"
    },
    { 
      id: "terms-of-service", 
      name: "Terms of Service", 
      icon: FileText,
      description: "Comprehensive terms that protect your business"
    },
    { 
      id: "cookie-consent", 
      name: "Cookie Consent", 
      icon: Cookie,
      description: "GDPR-compliant cookie consent banners"
    }
  ];

  // Create or get existing chat session
  const createSessionMutation = useMutation({
    mutationFn: async (documentType: string) => {
      const response = await apiRequest("POST", "/api/chat/session", { documentType });
      return response.json();
    },
    onSuccess: (data) => {
      setSessionId(data.sessionId);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start chat session. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Get chat session data
  const { data: session, refetch: refetchSession } = useQuery<ChatSession>({
    queryKey: ["/api/chat/session", sessionId],
    enabled: !!sessionId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ sessionId, message }: { sessionId: string; message: string }) => {
      const response = await apiRequest("POST", "/api/chat/message", { sessionId, message });
      return response.json();
    },
    onSuccess: () => {
      refetchSession();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate document mutation
  const generateDocumentMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      // Start progress simulation
      setGenerationProgress(0);
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90; // Stop at 90% until completion
          }
          return prev + Math.random() * 15; // Random increments
        });
      }, 1000);

      try {
        const response = await apiRequest("POST", "/api/documents/generate", { sessionId });
        clearInterval(progressInterval);
        setGenerationProgress(100);
        return response.json();
      } catch (error) {
        clearInterval(progressInterval);
        setGenerationProgress(0);
        throw error;
      }
    },
    onSuccess: (data) => {
      setTimeout(() => {
        setGeneratedDocument(data.document);
        setGenerationProgress(0);
        queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
        toast({
          title: "Success",
          description: "Document generated successfully!",
        });
      }, 500);
    },
    onError: () => {
      setGenerationProgress(0);
      toast({
        title: "Error",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDocumentTypeSelect = (docType: string) => {
    setSelectedDocType(docType);
    createSessionMutation.mutate(docType);
  };

  const handleSendMessage = (message: string) => {
    if (sessionId) {
      sendMessageMutation.mutate({ sessionId, message });
    }
  };

  const handleGenerateDocument = () => {
    if (sessionId) {
      generateDocumentMutation.mutate(sessionId);
    }
  };

  const handleDownload = () => {
    if (generatedDocument) {
      try {
        generatePDF(generatedDocument);
        toast({
          title: "✅ Download Started",
          description: "Your free legal document PDF is being downloaded to your device.",
          className: "bg-primary text-primary-foreground border-primary/20",
        });
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "There was an error generating your PDF. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getDocumentTypeTitle = (type: string) => {
    const doc = documentTypes.find(d => d.id === type);
    return doc ? doc.name : "Legal Document";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Generate Legal Documents
            <span className="text-primary"> For Free</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-3xl mx-auto">
            AI-powered legal document generation for privacy policies, terms of service, and GDPR compliance. 
            Professional-grade documents in just minutes - completely free.
          </p>
        </div>

        {/* Main Chat Interface */}
        <div className="max-w-4xl mx-auto">
          {/* Chat Interface */}
          <Card className="h-[600px] flex flex-col bg-muted/50 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                AI Legal Assistant {selectedDocType ? `- ${getDocumentTypeTitle(selectedDocType)}` : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              {!selectedDocType ? (
                /* Document Type Selection Inside Chat */
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%] border border-primary/20 shadow-md mb-4">
                      <p className="text-sm text-primary font-medium">
                        Hi! I'm your AI Legal Assistant. I can help you create professional legal documents for your website. 
                        Which type of document do you need?
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    {documentTypes.map((doc) => {
                      const IconComponent = doc.icon;
                      return (
                        <Card 
                          key={doc.id} 
                          className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] bg-primary/5 border-primary/30 hover:border-primary/50"
                          onClick={() => handleDocumentTypeSelect(doc.id)}
                        >
                          <CardContent className="p-4 flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-1">{doc.name}</h3>
                              <p className="text-white/70 text-sm">{doc.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : session ? (
                <Chat
                  messages={session.messages}
                  onSendMessage={handleSendMessage}
                  isLoading={sendMessageMutation.isPending}
                  isCompleted={session.isCompleted}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Back to document selection */}
        {selectedDocType && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedDocType(null);
                setSessionId(null);
                setGeneratedDocument(null);
              }}
              className="text-primary border-primary hover:bg-primary hover:text-white"
            >
              Choose Different Document Type
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}