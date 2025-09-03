import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, FileText, Shield, Download } from "lucide-react";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const CheckoutForm = ({ document }: { document: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success?documentId=${document.id}`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getDocumentPrice = (type: string) => {
    return 9.99; // All documents are now $9.99
  };

  const price = getDocumentPrice(document?.type || "");

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-primary mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold">{document?.title}</h3>
              <p className="text-sm text-muted-foreground">
                Professional {document?.type.replace('-', ' ')} document
              </p>
            </div>
            <span className="font-semibold">${price}</span>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Processing Fee</span>
              <span>$0</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${price}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-sm">What's Included:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <Shield className="h-4 w-4 text-green-500 mr-2" />
                Legally compliant document
              </li>
              <li className="flex items-center">
                <Download className="h-4 w-4 text-green-500 mr-2" />
                Instant PDF download
              </li>
              <li className="flex items-center">
                <FileText className="h-4 w-4 text-green-500 mr-2" />
                Customized for your business
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement 
              options={{
                layout: 'tabs',
                fields: {
                  billingDetails: {
                    name: 'auto',
                    email: 'auto',
                    phone: 'auto',
                    address: {
                      line1: 'auto',
                      line2: 'auto',
                      city: 'auto',
                      state: 'auto',
                      postalCode: 'auto',
                      country: 'auto',
                    },
                  },
                },
                terms: {
                  card: 'auto',
                },
              }}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={!stripe || !elements}
            >
              Complete Purchase - ${price}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Your payment is secured by Stripe. We don't store your payment information.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Checkout() {
  const { documentId } = useParams<{ documentId: string }>();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  // Get document details
  const { data: document, isLoading: documentLoading } = useQuery({
    queryKey: ["/api/documents", documentId],
    enabled: !!documentId,
  });

  useEffect(() => {
    if (documentId && document && !paymentIntent) {
      // Create PaymentIntent only once
      apiRequest("POST", "/api/create-payment-intent", { 
        documentId,
        amount: 9.99 // All documents are now $9.99
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setPaymentIntent(data.clientSecret);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
        });
    }
  }, [documentId, document, paymentIntent]);

  if (documentLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading document details...</p>
          </div>
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
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading document details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!stripePublicKey) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-secondary mb-4">Payment Configuration Required</h1>
            <p className="text-muted-foreground mb-8">
              Payment processing is not yet configured. Please set up your Stripe keys to enable checkout.
            </p>
            <div className="bg-muted rounded-lg p-6 text-left max-w-md mx-auto">
              <h3 className="font-semibold mb-2">Document: {document?.title || 'Legal Document'}</h3>
              <p className="text-sm text-muted-foreground mb-4">Price: $9.99</p>
              <p className="text-sm">Payment will be available once Stripe keys are configured.</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Preparing checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#dc2626',
        fontFamily: 'system-ui, sans-serif',
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-muted-foreground">
            Secure payment powered by Stripe
          </p>
        </div>

        {stripePromise && clientSecret && (
          <Elements key={clientSecret} stripe={stripePromise} options={stripeOptions}>
            <CheckoutForm document={document} />
          </Elements>
        )}
      </div>

      <Footer />
    </div>
  );
}
