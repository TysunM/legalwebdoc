import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Heart } from "lucide-react";
import logoImage from "@assets/LegalWebDoc.com_20250829_162750_0000_1756510107031.png";

export function Header() {
  const [isFreeDialogOpen, setIsFreeDialogOpen] = useState(false);

  return (
    <header className="bg-transparent border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-48">
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="Legal Web Doc Logo" 
                className="h-50 w-50 object-contain"
                style={{width: '200px', height: '200px'}}
              />
            </Link>
          </div>
          
          {/* Free Button */}
          <nav className="flex items-center">
            <Dialog open={isFreeDialogOpen} onOpenChange={setIsFreeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                  Free
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" aria-describedby="free-dialog-description">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <Heart className="h-6 w-6 text-red-500" aria-hidden="true" />
                    TysunMic - Free Forever
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p id="free-dialog-description" className="text-lg font-medium text-center text-primary">
                    Freeware for all, all the time, and everytime.
                  </p>
                  <p className="text-muted-foreground text-center">
                    Use a TysunMic website and its guaranteed to be free.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-center">
                      If you have any questions, concerns, and if there is something not working on the site:
                    </p>
                    <p className="text-center font-medium text-primary mt-2">
                      Tserver@internetclock.com
                    </p>
                  </div>
                  <Button 
                    onClick={() => setIsFreeDialogOpen(false)} 
                    className="w-full"
                  >
                    Amazing! Let's Generate Documents
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      </div>
    </header>
  );
}