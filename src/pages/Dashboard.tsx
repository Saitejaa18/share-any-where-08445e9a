
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { LogOut, Plus, User } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { FileUploadResult } from "@/services/fileService";
import { toast } from "@/hooks/use-toast";
// Removed import: import { NearbyDevices } from "@/components/NearbyDevices";

const pastelGradient = "bg-gradient-to-br from-[#e5defc] to-[#fbc2eb]";
const glassCard = "backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl shadow-xl";

const Dashboard = () => {
  const [files, setFiles] = useState<FileUploadResult[]>([]);
  const { user, signOut } = useAuth();

  const handleFileUpload = (fileData: FileUploadResult) => {
    setFiles(prevFiles => [fileData, ...prevFiles]);
    toast({
      title: "File uploaded successfully",
      description: "Your file is now available for sharing",
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)" }}>
      <header className="bg-gradient-to-r from-brand-purple to-brand-purple-dark shadow-md py-4 rounded-b-2xl glassCard">
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
      
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-brand-purple-dark">Your Files (This Session)</h1>
          <div className="flex gap-3">
            <Button 
              onClick={() => document.getElementById("file-upload-button")?.click()} 
              className="shadow-lg bg-brand-purple text-white hover:bg-brand-purple-dark"
            >
              <Plus className="mr-2 h-4 w-4" /> Upload New File
            </Button>
          </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-[1fr_350px]">
          <div className={`${glassCard} p-8`}>
            <FileList 
              files={files} 
              isLoading={false} 
            />
          </div>
          
          <div className={`${glassCard} p-8`}>
            <h2 className="text-xl font-semibold mb-4 text-brand-purple-dark">Upload a File</h2>
            <FileUploader onFileUpload={handleFileUpload} />
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t rounded-t-2xl glassCard">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 ShareAnyWhere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
