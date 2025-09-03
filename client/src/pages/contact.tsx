import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Shield } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question, feedback, or need support, we're here to help.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Get in Touch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">General Inquiries</h3>
                <p className="text-muted-foreground mb-4">
                  For general questions, feedback, or support, please email us at:
                </p>
                <a
                  href="mailto:Tserver@internetclock.com"
                  className="text-primary font-medium hover:underline"
                >
                  Tserver@internetclock.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Our Commitment</h3>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-primary mr-2 mt-1" />
                  <p className="text-muted-foreground">
                    As a TysunMic service, we are committed to providing a 100% free service. We will never charge for our legal document generator.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
