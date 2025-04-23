
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="flex items-center">
            <FileText className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold">ShareAnyWhere</span>
          </Link>
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-4 text-brand-purple-dark">How We Built a Fast & Secure File Sharing App with Supabase</h1>
              <div className="text-sm text-muted-foreground">
                <span>Published on: April 23, 2025</span>
                <span className="mx-2">•</span>
                <span>Author: Sai Teja</span>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple flex items-center">
                  <span className="mr-2">🚀</span> Introduction
                </h2>
                <p className="mb-4">
                  Ever had trouble sending a large file to someone? Most platforms require logins, have tight limits, or feel unnecessarily complicated. That's why we built ShareAnyWhere — a fast, privacy-first file sharing app that lets you send files with just a link. No downloads, no friction, just smooth sharing.
                </p>
                <p>
                  In this blog, we'll walk you through how we built it, why we chose Supabase, and what makes our platform special.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple flex items-center">
                  <span className="mr-2">🔧</span> The Problem We Wanted to Solve
                </h2>
                <p className="mb-4">We noticed that:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Most file-sharing tools are either bloated or limited</li>
                  <li>Some platforms have ads, pop-ups, or require users to sign in</li>
                  <li>Users want a simple way to upload a file and just share a link</li>
                </ul>
                <p>Our mission was to create a tool that felt:</p>
                <ul className="mb-4">
                  <li>✅ Lightweight</li>
                  <li>✅ Secure</li>
                  <li>✅ Easy to use</li>
                  <li>✅ Developer-friendly on the backend</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple flex items-center">
                  <span className="mr-2">🛠️</span> Why We Chose Supabase
                </h2>
                <p className="mb-4">Supabase was the perfect fit for our backend. Here's why:</p>
                <ul className="mb-4">
                  <li>📂 Storage: Handles file uploads with built-in buckets</li>
                  <li>🔐 Auth: User sign-in with email/password, social providers, or magic links</li>
                  <li>💾 Database: Postgres with real-time support (great for tracking file metadata)</li>
                  <li>🛡️ Row-level security: We control who sees what — critical for privacy</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple flex items-center">
                  <span className="mr-2">🔗</span> How File Sharing Works in Our App
                </h2>
                <p className="mb-4">The core workflow is simple:</p>
                <ol className="list-decimal pl-6 mb-4">
                  <li>User uploads a file through our web interface</li>
                  <li>The file is stored securely in Supabase Storage</li>
                  <li>We generate a secure link using Supabase's signed URLs</li>
                  <li>The user shares that link with anyone they choose</li>
                  <li>The link can be set to expire after a time or deleted anytime</li>
                </ol>
                <p className="mb-4">We also store:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>File metadata (name, size, type)</li>
                  <li>Upload time</li>
                  <li>Optional expiration date</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple flex items-center">
                  <span className="mr-2">⚡</span> What Makes Our App Special
                </h2>
                <ul className="mb-4">
                  <li>✅ No login required for quick sharing</li>
                  <li>✅ Optional sign-in for file management</li>
                  <li>✅ Encrypted file links</li>
                  <li>✅ Set expiration time for uploads</li>
                  <li>✅ Modern, clean interface</li>
                </ul>
                <p>
                  We're continuing to improve performance and exploring things like preview support for documents and image files right inside the browser.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple flex items-center">
                  <span className="mr-2">🧪</span> What We Learned
                </h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>Supabase's SDK is powerful but still evolving—pay attention to CORS configs!</li>
                  <li>Users want simplicity first. Features like analytics can wait.</li>
                  <li>Handling large files needs smart chunking (coming soon 🚧)</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple flex items-center">
                  <span className="mr-2">🙌</span> Thank You for Supporting Us
                </h2>
                <p className="mb-4">
                  We built this because file sharing shouldn't be hard. With the power of Supabase and a vision for simplicity, we're just getting started.
                </p>
                <p>
                  Try it out now 👉 <a href="https://share-any-where.lovable.app" className="text-primary font-medium">share-any-where.lovable.app</a>
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 ShareAnyWhere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
