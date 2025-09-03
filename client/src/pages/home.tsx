import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chat } from "@/components/ui/chat";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Shield, Cookie, BookOpen, FileWarning, Handshake, EyeOff, UserCheck, Truck, Copyright, Landmark, UserPlus, HeartPulse } from "lucide-react";
import { articles } from "@/content/articles";
import { Link } from "wouter";

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
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);

  const documentTypes = [
    { id: "privacy-policy", name: "Privacy Policy", icon: Shield, description: "For websites and apps that collect user data." },
    { id: "terms-of-service", name: "Terms of Service", icon: FileText, description: "Set the rules for using your service." },
    { id: "cookie-consent", name: "Cookie Policy", icon: Cookie, description: "Inform users about the cookies your site uses." },
    { id: "disclaimer", name: "Disclaimer", icon: FileWarning, description: "Limit your legal liability for the information on your site." },
    { id: "acceptable-use-policy", name: "Acceptable Use Policy", icon: UserCheck, description: "Define acceptable behavior for users." },
    { id: "refund-policy", name: "Refund Policy", icon: Handshake, description: "Outline your terms for refunds and returns." },
    { id: "eula", name: "EULA", icon: BookOpen, description: "License your software or mobile app to users." },
    { id: "affiliate-agreement", name: "Affiliate Agreement", icon: Handshake, description: "Set the terms for your affiliate program." },
    { id: "nda", name: "NDA", icon: EyeOff, description: "Protect your confidential business information." },
    { id: "service-agreement", name: "Service Agreement", icon: FileText, description: "For freelancers and service-based businesses." },
    { id: "independent-contractor-agreement", name: "Independent Contractor Agreement", icon: UserCheck, description: "For hiring freelancers and contractors." },
    { id: "shipping-policy", name: "Shipping Policy", icon: Truck, description: "Provide clarity on your shipping logistics." },
    { id: "dmca-policy", name: "DMCA Policy", icon: Copyright, description: "Address copyright infringement claims." },
    { id: "impressum", name: "Impressum", icon: Landmark, description: "A legal requirement for sites in German-speaking countries." },
    { id: "guest-blogger-agreement", name: "Guest Blogger Agreement", icon: UserPlus, description: "For websites that accept guest posts." },
    { id: "health-disclaimer", name: "Health Disclaimer", icon: HeartPulse, description: "For sites with health or medical information." },
  ];

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

  const { data: session, refetch: refetchSession } = useQuery<ChatSession>({
    queryKey: ["/api/chat/session", sessionId],
    enabled: !!sessionId,
  });

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

  const handleDocumentTypeSelect = (docType: string) => {
    setSelectedDocType(docType);
    createSessionMutation.mutate(docType);
  };

  const handleSendMessage = (message: string) => {
    if (sessionId) {
      sendMessageMutation.mutate({ sessionId, message });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Document</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {documentTypes.map((doc) => {
              const IconComponent = doc.icon;
              return (
                <Link key={doc.id} href={`/generator/${doc.id}`}>
                  <a className="block">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                          <IconComponent className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{doc.name}</h3>
                        <p className="text-white/70 text-sm">{doc.description}</p>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">From Our Blog</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`}>
                <a className="block">
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                      <p className="text-muted-foreground">
                        {article.description}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline">Read More Articles</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
