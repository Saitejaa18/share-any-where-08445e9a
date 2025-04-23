
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Terms = () => {
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
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-brand-purple-dark">Terms of Service</h1>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple">1. Acceptance of Terms</h2>
                <p>By accessing or using ShareAnyWhere, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple">2. Description of Service</h2>
                <p>ShareAnyWhere is a file sharing service that allows users to upload files and share them with others through generated links.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple">3. User Responsibilities</h2>
                <p className="mb-4">You are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All activity that occurs under your account</li>
                  <li>Ensuring you have the right to upload and share any content</li>
                  <li>Complying with all applicable laws and regulations</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple">4. Prohibited Uses</h2>
                <p className="mb-4">You may not use ShareAnyWhere to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Upload illegal, harmful, threatening, abusive, or otherwise objectionable content</li>
                  <li>Violate any intellectual property rights</li>
                  <li>Distribute malware or other harmful software</li>
                  <li>Attempt to gain unauthorized access to our systems or networks</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple">5. Termination</h2>
                <p>We reserve the right to terminate or suspend your account at our discretion, without notice, if we believe you have violated these Terms or for any other reason.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple">6. Changes to Terms</h2>
                <p>We may modify these Terms at any time. Your continued use of the Service after such changes constitutes your agreement to the new Terms.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple">7. Contact</h2>
                <p>If you have any questions about these Terms, please contact us at <a href="mailto:rapellisaiteja999@gmail.com" className="text-primary">rapellisaiteja999@gmail.com</a>.</p>
              </section>
            </div>
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

export default Terms;
