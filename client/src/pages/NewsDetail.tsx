import React from "react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, ArrowLeft, Calendar } from "lucide-react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  isFeatured?: boolean;
  publishedAt: string;
}

export default function NewsDetail({ id: propId }: { id?: string } = {}) {
  const [match, params] = useRoute("/news/:id");
  const [, navigate] = useLocation();
  const newsId = propId || params?.id || null;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!newsId) {
      setIsLoading(false);
      setError("Invalid news ID provided in the URL.");
      return;
    }

    let aborted = false;
    setIsLoading(true);
    setError(null);

    const fetchArticle = async () => {
      try {
        // Use the same relative path so API_BASE logic in queryClient applies
        const apiUrl = `/api/news/${newsId}`;
        const res = await fetch(apiUrl, { credentials: "include" });

        // If server returned html (e.g., index.html) the content-type will reflect it
        const contentType = res.headers.get("content-type") || "";

        if (!res.ok) {
          // try to read text body for debugging — might be HTML error page
          const bodyText = await res.text().catch(() => "");
          console.error(`GET ${apiUrl} failed:`, res.status, bodyText);
          if (res.status === 404) {
            setError("News article not found (404).");
          } else {
            setError(`Server error (${res.status}). Check server logs.`);
          }
          return;
        }

        // If back-end returns HTML (content-type text/html) it's not JSON
        if (contentType.includes("text/html")) {
          const bodyText = await res.text().catch(() => "");
          console.error(`Unexpected HTML response for ${apiUrl}:`, bodyText);
          setError("Server returned HTML instead of JSON. Check API base URL and server routes.");
          return;
        }

        // Expect JSON
        const data = await res.json();
        if (!aborted) {
          setArticle(data as NewsArticle);
          setError(null);
        }
      } catch (e: any) {
        console.error("Error fetching news article:", e);
        setError(
          e?.message
            ? `Could not load news article: ${e.message}`
            : "Could not load news article. Please check the API connection."
        );
      } finally {
        if (!aborted) setIsLoading(false);
      }
    };

    fetchArticle();

    return () => {
      aborted = true;
    };
  }, [newsId, propId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen -mt-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="ml-4 text-xl text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center p-20 bg-gray-50">
        <h1 className="text-4xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-xl text-gray-600">{error || "News article not found."}</p>
        <div className="mt-8">
          <Button onClick={() => navigate("/news")} className="bg-primary hover:bg-primary/90">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} - NRSA News</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/news")}
            className="mb-8 text-primary hover:bg-primary/10 transition-all duration-300 font-semibold"
            data-testid="button-back-to-news"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
          </Button>

          <Card className="p-8 md:p-12 shadow-2xl rounded-xl">
            {article.imageUrl && (
              <div className="w-full h-96 mb-8 rounded-lg overflow-hidden relative">
                <OptimizedImage
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  fallbackSrc="https://placehold.co/800x400/009739/ffffff?text=News"
                />
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              {article.isFeatured && (
                <Badge className="bg-destructive text-destructive-foreground text-sm px-3 py-1">Featured</Badge>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{article.publishedAt ? format(new Date(article.publishedAt), "MMMM dd, yyyy") : "No date"}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{article.excerpt}</p>

            <div className="prose max-w-none text-foreground">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            <div className="mt-8">
              <Button onClick={() => navigate("/news")} className="mt-8 bg-primary hover:bg-primary/90">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
