import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, FileText, Home, Mail } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";

interface Document {
  id: string;
  type: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

export default function Success() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/success");
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    // Get documentId from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('documentId');
    if (docId) {
      setDocumentId(docId);
    }
  }, []);

  // Get document details
  const { data: document, isLoading } = useQuery<Document>({
    queryKey: ["/api/documents", documentId],
    enabled: !!documentId,
  });

  const handleDownloadPDF = () => {
    if (document) {
      generatePDF(document);
    }
  };

  const getDocumentTypeTitle = (type: string) => {
    switch (type) {
      case "privacy-policy":
        return "Privacy Policy";
      case "terms-of-service":
        return "Terms of Service";
      case "cookie-consent":
        return "Cookie Consent Policy";
      default:
        return "Legal Document";
    }
  };

  const getDocumentDescription = (type: string) => {
    switch (type) {
      case "privacy-policy":
        return "A comprehensive privacy policy that complies with GDPR, CCPA, and other data protection regulations.";
      case "terms-of-service":
        return "Professional terms of service that protect your business and set clear expectations for users.";
      case "cookie-consent":
        return "GDPR-compliant cookie policy and consent banner configuration for your website.";
      default:
        return "Your custom legal document is ready for use.";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[600px]">
          <Card className="max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
              <p className="text-muted-foreground mb-6">
                We couldn't find the document you're looking for.
              </p>
              <Button onClick={() => navigate("/")} className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 success-checkmark">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your {getDocumentTypeTitle(document.type).toLowerCase()} has been generated and is ready for download.
          </p>
        </div>

        {/* Document Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Your Document is Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">{document.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {getDocumentDescription(document.type)}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Document Type:</span>
                    <span className="font-medium">{getDocumentTypeTitle(document.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Generated:</span>
                    <span className="font-medium">
                      {new Date(document.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-green-600">Purchased</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleDownloadPDF}
                  className="w-full"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF
                </Button>
                
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">What's Next?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Download your document as a PDF</li>
                    <li>• Review the content carefully</li>
                    <li>• Add it to your website or app</li>
                    <li>• Keep a copy for your records</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate("/generator/privacy-policy")}
            className="w-full"
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Another
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.open("mailto:support@powered-legal.com?subject=Document Support")}
            className="w-full"
          >
            <Mail className="mr-2 h-4 w-4" />
            Get Support
          </Button>
        </div>

        {/* Important Information */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-amber-800 mb-3">Important Legal Notice</h3>
            <div className="text-sm text-amber-700 space-y-2">
              <p>
                This document was generated using AI technology and is intended for informational purposes only. 
                While we strive for accuracy and compliance, we recommend:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Reviewing the document carefully before implementation</li>
                <li>Consulting with a qualified attorney for complex legal situations</li>
                <li>Updating the document as your business or applicable laws change</li>
                <li>Keeping records of when and how you implement these policies</li>
              </ul>
              <p className="mt-3">
                Powered Legal provides tools to help businesses stay compliant, but we do not provide legal advice. 
                For specific legal questions, please consult with an attorney.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Support */}
        <div className="text-center mt-12">
          <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is here to help you implement your legal documents successfully.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" onClick={() => window.open("mailto:support@powered-legal.com")}>
              <Mail className="mr-2 h-4 w-4" />
              Email Support
            </Button>
            <Button variant="outline" onClick={() => window.open("https://help.powered-legal.com")}>
              Help Center
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
