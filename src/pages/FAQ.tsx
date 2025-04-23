
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="flex items-center">
            <HelpCircle className="h-6 w-6 text-primary mr-2" />
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
            <h1 className="text-3xl font-bold mb-8 text-center text-brand-purple-dark">Frequently Asked Questions</h1>
            
            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold mb-3 text-brand-purple">1. How can I share files using this app?</h3>
                <p>You can upload files through our interface, and the app will generate a secure, shareable link that you can send to anyone.</p>
              </section>
              
              <hr />
              
              <section>
                <h3 className="text-xl font-semibold mb-3 text-brand-purple">2. Do I need to sign in to use this app?</h3>
                <p>Some features may require sign-in, such as tracking shared files, managing your upload history, or setting expiration dates. Basic sharing may be available without signing in.</p>
              </section>
              
              <hr />
              
              <section>
                <h3 className="text-xl font-semibold mb-3 text-brand-purple">3. What types of files can I share?</h3>
                <p>You can share most common file types—documents, images, videos, audio, and more. Certain file types may be restricted for security reasons.</p>
              </section>
              
              <hr />
              
              <section>
                <h3 className="text-xl font-semibold mb-3 text-brand-purple">4. Is my data secure?</h3>
                <p>Yes. Files are securely stored using Supabase Storage. All file access is protected via secure, time-limited URLs.</p>
              </section>
              
              <hr />
              
              <section>
                <h3 className="text-xl font-semibold mb-3 text-brand-purple">6. How long are files stored?</h3>
                <p>You can set an expiration time during upload. After this time, the file will automatically be deleted. If no time is set, files may be retained based on your account plan.</p>
              </section>
              
              <hr />
              
              <section>
                <h3 className="text-xl font-semibold mb-3 text-brand-purple">7. Who can access my shared link?</h3>
                <p>Anyone with the link can access your file. We recommend sharing links only with trusted individuals.</p>
              </section>
              
              <hr />
              
              <section>
                <h3 className="text-xl font-semibold mb-3 text-brand-purple">8. What happens if my file upload fails?</h3>
                <p>Check your internet connection and file type. If the problem persists, contact support for help.</p>
              </section>
              
              <hr />
              
              <section>
                <h3 className="text-xl font-semibold mb-3 text-brand-purple">10. How can I contact support?</h3>
                <p>You can reach out via email at <a href="mailto:rapellisaiteja999@gmail.com" className="text-primary font-medium">rapellisaiteja999@gmail.com</a>.</p>
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

export default FAQ;
