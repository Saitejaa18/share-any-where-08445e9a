import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileUp, Download, Shield, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

const pastelGradient = "bg-gradient-to-br from-[#d3e4fd] to-[#fbc2eb]";
const glassCard = "backdrop-blur-xl bg-white/50 border border-white/20 rounded-2xl shadow-xl";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b glassCard">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center">
            <FileUp className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold">ShareAnyWhere</span>
          </div>
          <div className="space-x-4">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className={`${pastelGradient} text-brand-purple-dark py-24`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-2xl">Beautiful. Simple. Secure.<br/> File Sharing for Everyone</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-brand-purple-dark/90">
            Upload your files and get a shareable link instantly. No complicated setup, just simple and secure file sharing for all.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button size="lg" className="bg-white text-brand-purple-dark shadow-lg hover:bg-white/90" asChild>
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started - It's Free"}
              </Link>
            </Button>
            {isAuthenticated ? (
              <Button
                size="lg"
                variant="outline"
                className="text-brand-purple-dark border-brand-purple-dark hover:bg-brand-purple-light/20"
                asChild
              >
                <Link to="/dashboard">Upload Another File</Link>
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="text-brand-purple-dark border-brand-purple-dark hover:bg-brand-purple-light/20"
                asChild
              >
                <Link to="/login">Already have an account?</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why ShareAnyWhere?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`${glassCard} p-6 text-center`}>
              <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-4">
                <FileUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Upload</h3>
              <p className="text-muted-foreground">
                Drag and drop your files or select them from your device. Supports files up to 2GB.
              </p>
            </div>
            
            <div className={`${glassCard} p-6 text-center`}>
              <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Sharing</h3>
              <p className="text-muted-foreground">
                Get a unique link immediately after uploading. Share via email, messaging apps, or social media.
              </p>
            </div>
            
            <div className={`${glassCard} p-6 text-center`}>
              <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Access</h3>
              <p className="text-muted-foreground">
                Recipients can download files without creating an account. Your uploads are protected.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="bg-brand-gray-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start sharing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Create your free account now and start sharing files in seconds.
          </p>
          <Button size="lg" asChild>
            <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
              {isAuthenticated ? "Go to Dashboard" : "Get Started - It's Free"}
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white py-12 border-t mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <FileUp className="h-5 w-5 text-primary mr-2" />
                <span className="font-bold">ShareAnyWhere</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Simple file sharing for everyone.
              </p>
            </div>
            
            <div className="flex gap-8">
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
                  <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
                  <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link></li>
                  <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 ShareAnyWhere. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
