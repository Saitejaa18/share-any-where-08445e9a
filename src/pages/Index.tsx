
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileUp, Download, Shield, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center">
            <FileUp className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold">ShareAnyWhere</span>
          </div>
          <div className="space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="outline" asChild>
                  <Link to="/nearby" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" /> Nearby Share
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </>
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
      <section className="bg-gradient-to-br from-brand-purple-light to-brand-purple-dark text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Share files with anyone, anywhere</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Upload your files and get a shareable link instantly. No complicated setup, just simple file sharing for everyone.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started - It's Free"}
              </Link>
            </Button>
            {isAuthenticated ? (
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                <Link to="/nearby">Share with Nearby Devices</Link>
              </Button>
            ) : (
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                <Link to="/login">Already have an account?</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple file sharing in seconds</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-4">
                <FileUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Upload</h3>
              <p className="text-muted-foreground">
                Drag and drop your files or select them from your device. Supports files up to 2GB.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Sharing</h3>
              <p className="text-muted-foreground">
                Get a unique link immediately after uploading. Share via email, messaging apps, or social media.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Nearby Sharing</h3>
              <p className="text-muted-foreground">
                Connect and share files with nearby devices using QR codes or PIN codes. No internet required!
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
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
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Features</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Pricing</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">About</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Blog</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</a></li>
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
