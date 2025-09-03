import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { generatePDF } from "@/lib/pdf-generator";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chat } from "@/components/ui/chat";
import { DocumentPreview } from "@/components/ui/document-preview";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Download } from "lucide-react";
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

export default function Generator() {
  const { type } = useParams<{ type: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<Document | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

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

  useEffect(() => {
    if (type && !sessionId) {
      createSessionMutation.mutate(type);
    }
  }, [type]);

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
      // PDF generation is handled in the frontend
      // This is now completely free - no payment required
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
    switch (type) {
      case "privacy-policy":
        return "Privacy Policy";
      case "terms-of-service":
        return "Terms of Service";
      case "cookie-consent":
        return "Cookie Consent";
      default:
        return "Legal Document";
    }
  };

  if (createSessionMutation.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Starting AI assistant...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Top Banner Ad Space */}
      <div className="w-full bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Top Banner Ad (728x90)</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2" id="generator-heading">
            {getDocumentTypeTitle(type || "")} Generator
          </h1>
          <p className="text-muted-foreground" aria-describedby="generator-heading">
            Let our AI assistant help you create a customized legal document for your business.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar Ad */}
          <div className="lg:block hidden">
            <div className="sticky top-8">
              <div className="h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-8">
                <div className="text-center">
                  <span className="text-gray-500 text-sm block">Vertical Ad</span>
                  <span className="text-gray-400 text-xs">(160x600)</span>
                </div>
              </div>
              <div className="h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-gray-500 text-sm block">Square Ad</span>
                  <span className="text-gray-400 text-xs">(300x250)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2 grid lg:grid-cols-2 gap-8">
          {/* Chat Interface */}
          <Card className="h-[600px] flex flex-col" role="region" aria-labelledby="chat-heading">
            <CardHeader>
              <CardTitle id="chat-heading" className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2" aria-label="AI assistant is online"></div>
                AI Legal Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              {session ? (
                <Chat
                  messages={session.messages}
                  onSendMessage={handleSendMessage}
                  isLoading={sendMessageMutation.isPending}
                  isCompleted={session.isCompleted}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Preview and Actions */}
          <Card className="h-[600px] flex flex-col" role="region" aria-labelledby="preview-heading">
            <CardHeader>
              <CardTitle id="preview-heading" className="flex items-center">
                <FileText className="mr-2 h-5 w-5" aria-hidden="true" />
                Document Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              {generatedDocument ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-4">
                    <DocumentPreview document={generatedDocument} />
                  </div>
                  <div className="space-y-3 flex-shrink-0">
                    <Button
                      onClick={handleDownload}
                      className="w-full"
                      size="lg"
                      aria-label="Download your free legal document as a PDF"
                    >
                      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                      Download PDF - Free
                    </Button>

                  </div>
                </div>
              ) : session?.isCompleted ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Generate</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    You've provided all the necessary information. Click below to generate your document.
                  </p>
                  {generateDocumentMutation.isPending && generationProgress > 0 && (
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-primary font-medium">Generating Document...</span>
                        <span className="text-primary">{Math.round(generationProgress)}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                      <p className="text-xs text-white/70 text-center">
                        AI is analyzing your business information and creating your custom legal document
                      </p>
                    </div>
                  )}
                  <Button
                    onClick={handleGenerateDocument}
                    disabled={generateDocumentMutation.isPending}
                    size="lg"
                    aria-label={generateDocumentMutation.isPending ? "Generating your legal document, please wait" : "Generate your legal document"}
                  >
                    {generateDocumentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                        Generate Document
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Document Preview</h3>
                    <p className="text-muted-foreground">
                      Your generated document will appear here once you complete the chat.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          </div>
          
          {/* Right Sidebar Ad */}
          <div className="lg:block hidden">
            <div className="sticky top-8">
              <div className="h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-8">
                <div className="text-center">
                  <span className="text-gray-500 text-sm block">Vertical Ad</span>
                  <span className="text-gray-400 text-xs">(160x600)</span>
                </div>
              </div>
              <div className="h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-gray-500 text-sm block">Square Ad</span>
                  <span className="text-gray-400 text-xs">(300x250)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Ad Space */}
        <div className="mt-16">
          <div className="h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Bottom Banner Ad (728x90)</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
