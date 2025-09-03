import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Shield, Heart, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            About Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our mission is to make legal compliance simple, accessible, and free for everyone.
          </p>
        </div>

        <div className="space-y-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                LegalWebDoc was founded with a simple yet powerful idea: that everyone should have access to high-quality legal documents without the high cost. We saw too many small businesses, startups, and creators struggling with the complexities and expenses of legal compliance. So, we decided to do something about it.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Powered by TysunMic, we are committed to a "Free Forever" model, ensuring that our core services will always be available at no cost. We believe that by removing the financial barriers to legal protection, we can empower a new generation of innovators and entrepreneurs.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/assets/LegalWebDoc.com_20250829_162750_0000_1756510107031.png"
                alt="LegalWebDoc Logo"
                className="rounded-lg shadow-lg w-64 h-64 object-contain"
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Accessibility</h3>
                <p className="text-muted-foreground">
                  We are committed to making legal documents accessible to everyone, regardless of their financial resources or legal expertise.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trust</h3>
                <p className="text-muted-foreground">
                  We strive to be a trusted resource for our users by providing high-quality, reliable, and up-to-date legal document templates.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We are constantly exploring new ways to leverage technology to make legal compliance simpler, faster, and more efficient for our users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
