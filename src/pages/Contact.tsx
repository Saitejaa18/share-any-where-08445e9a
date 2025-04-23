
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="flex items-center">
            <Mail className="h-6 w-6 text-primary mr-2" />
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
            <h1 className="text-3xl font-bold mb-8 text-center text-brand-purple-dark">Contact Us</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-6 text-brand-purple">Get In Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-brand-purple mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <a href="mailto:rapellisaiteja999@gmail.com" className="text-primary hover:underline">
                        rapellisaiteja999@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-brand-purple mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <a href="tel:+918919363234" className="text-primary hover:underline">
                        +91 8919363234
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-brand-purple">Send a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      placeholder="What would you like to tell us?"
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
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

export default Contact;
