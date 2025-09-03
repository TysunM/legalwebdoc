import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  type: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

interface DocumentPreviewProps {
  document: Document;
  className?: string;
}

export function DocumentPreview({ document, className }: DocumentPreviewProps) {
  const formatDocumentContent = (content: string) => {
    // Split content into sections and format for better readability
    const sections = content.split('\n\n');
    
    return sections.map((section, index) => {
      // Check if section is a heading (starts with uppercase and is short)
      const isHeading = section.length < 100 && section === section.toUpperCase() && section.trim().length > 0;
      
      if (isHeading) {
        return (
          <h3 key={index} className="font-semibold text-lg mb-3 text-foreground">
            {section}
          </h3>
        );
      }
      
      // Check if section starts with a number (numbered list)
      const isNumberedItem = /^\d+\./.test(section.trim());
      
      if (isNumberedItem) {
        return (
          <div key={index} className="mb-3">
            <p className="text-sm text-foreground leading-relaxed">{section}</p>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-sm text-foreground leading-relaxed mb-4">
          {section}
        </p>
      );
    });
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="p-0 h-full">
        <div className="bg-muted/30 p-4 border-b">
          <h2 className="font-semibold text-lg">{document.title}</h2>
          <p className="text-sm text-muted-foreground">
            Generated on {new Date(document.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <ScrollArea className="h-[calc(100%-80px)]">
          <div className="p-6 bg-white">
            <div className="max-w-none prose prose-sm">
              {formatDocumentContent(document.content)}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
