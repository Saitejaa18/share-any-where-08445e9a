
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { LogOut, Plus, User, Share2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { getUserFiles, FileUploadResult } from "@/services/fileService";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [files, setFiles] = useState<FileUploadResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        const userFiles = await getUserFiles();
        setFiles(userFiles);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching files",
          description: error.message || "Failed to load your files"
        });
        console.error("Error fetching files:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleFileUpload = (fileData: FileUploadResult) => {
    setFiles(prevFiles => [fileData, ...prevFiles]);
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
              <span>{user?.user_metadata?.full_name || user?.email}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut} className="text-white hover:bg-white/10">
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Files</h1>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/nearby" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Nearby Share
              </Link>
            </Button>
            <Button onClick={() => document.getElementById("file-upload-button")?.click()}>
              <Plus className="mr-2 h-4 w-4" /> Upload New File
            </Button>
          </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          {/* File list */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <FileList files={files} isLoading={isLoading} />
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
