import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { articles } from "@/content/articles";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            In-depth articles and guides to help you navigate the legal landscape of the internet.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
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
      </main>
      <Footer />
    </div>
  );
}
