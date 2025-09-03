import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Generator from "@/pages/generator";

function Router() {
  return (
    <div role="main">
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div id="main-content">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/generator/:type" component={Generator} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground" lang="en">
          {/* Accessibility announcements */}
          <div id="accessibility-announcements" aria-live="polite" className="sr-only"></div>
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
