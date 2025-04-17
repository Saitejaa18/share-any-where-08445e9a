
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { LogOut, Plus, User } from "lucide-react";
import { Logo } from "@/components/Logo";

const Dashboard = () => {
  const [files, setFiles] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
    }
    
    // In a real app, we would fetch files from an API
    const mockFiles = localStorage.getItem("uploadedFiles");
    if (mockFiles) {
      setFiles(JSON.parse(mockFiles));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleFileUpload = (file: File) => {
    // Create a unique ID for the file
    const fileId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    // Create a file URL (in a real app, this would be a URL to the file stored on a server)
    const fileUrl = `/file/${fileId}`;
    
    // Create a shareable link
    const shareableLink = `${window.location.origin}/download/${fileId}`;
    
    const newFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: fileUrl,
      shareableLink,
      uploadedAt: new Date().toISOString(),
    };
    
    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    
    // In a real app, we would upload the file to a server
    // For now, just store it in localStorage
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    
    return newFile;
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-purple to-brand-purple-dark shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <User size={20} />
              <span>User</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white hover:bg-white/10">
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Files</h1>
          <Button onClick={() => document.getElementById("file-upload-button")?.click()}>
            <Plus className="mr-2 h-4 w-4" /> Upload New File
          </Button>
        </div>
        
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          {/* File list */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <FileList files={files} />
          </div>
          
          {/* Upload widget */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Upload a File</h2>
            <FileUploader onFileUpload={handleFileUpload} />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 ShareAnyWhere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
