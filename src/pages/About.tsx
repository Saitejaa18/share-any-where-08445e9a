import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="flex items-center">
            <Info className="h-6 w-6 text-primary mr-2" />
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
            <h1 className="text-3xl font-bold mb-8 text-center text-brand-purple-dark">About Me</h1>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <span className="text-6xl">ST</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-brand-purple">Sai Teja Rapelli</h2>
                  <p className="text-lg text-muted-foreground mb-4">Engineering Student</p>
                  <p className="mb-4">
                    I'm an Engineering student pursuing my 4th-year in Computer Science Engineering with specialization in Internet of Things.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/contact">Contact Me</Link>
                  </Button>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple">About ShareAnyWhere</h2>
                <p className="mb-4">
                  ShareAnyWhere was created as a solution to the common problem of sharing files quickly and securely. 
                  I wanted to build something that was easy to use, secure, and didn't require complicated setup or accounts.
                </p>
                <p>
                  This project showcases my skills in modern web development, focusing on security, user experience, and 
                  efficient backend architecture using technologies like React, Tailwind CSS, and Supabase.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple">My Vision</h2>
                <p className="mb-4">
                  I believe that technology should simplify our lives, not complicate them. File sharing should be a seamless
                  experience that just works, without hidden fees, confusing interfaces, or privacy concerns.
                </p>
                <p>
                  Through ShareAnyWhere, I'm working to create a platform that respects users' privacy, provides an intuitive
                  interface, and makes sharing files as simple as possible.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-brand-purple">Skills & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Tailwind CSS", "Supabase", "Node.js", "IoT", "UI/UX Design", "Data Structures", "Cloud Computing"].map(skill => (
                    <span key={skill} className="bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
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

export default About;
