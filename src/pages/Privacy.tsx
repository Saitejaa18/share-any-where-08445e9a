
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="flex items-center">
            <Shield className="h-6 w-6 text-primary mr-2" />
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
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-brand-purple-dark">Privacy Policy</h1>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-brand-purple">1. What Information We Collect</h2>
              <p className="mb-4">We may collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>File metadata (file name, size, type)</li>
                <li>Your email and login details (if you create an account)</li>
                <li>IP address and browser/device info for security and analytics</li>
              </ul>
              <p className="mt-4">We do <strong>not</strong> collect the contents of your files unless necessary for storage and delivery.</p>
            </section>
            
            <hr className="my-8" />
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-brand-purple">2. How We Use Your Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Store and deliver uploaded files securely</li>
                <li>Authenticate users and manage accounts</li>
                <li>Improve app performance and user experience</li>
                <li>Ensure secure access to files</li>
              </ul>
            </section>
            
            <hr className="my-8" />
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-brand-purple">3. File Storage & Retention</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Files are stored securely using Supabase Storage.</li>
                <li>Files are retained for the duration you select (if expiration is enabled), or as defined in your plan.</li>
                <li>You may delete your files manually from your dashboard.</li>
              </ul>
            </section>
            
            <hr className="my-8" />
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-brand-purple">4. Third-Party Services</h2>
              <p>We use <strong>Supabase</strong> for backend services including file storage, authentication, and analytics. Your data is governed by their privacy and security policies as well.</p>
            </section>
            
            <hr className="my-8" />
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-brand-purple">5. Data Security</h2>
              <p>We use encryption (HTTPS) for all file uploads and downloads. Access to shared links is time-limited and unguessable.</p>
            </section>
            
            <hr className="my-8" />
            
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-brand-purple">6. Contact Us</h2>
              <p>If you have any questions about your data or this policy, contact us at:</p>
              <p className="mt-2 font-semibold">📧 <a href="mailto:rapellisaiteja999@gmail.com" className="text-primary">rapellisaiteja999@gmail.com</a></p>
            </section>
          </div>
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

export default Privacy;
