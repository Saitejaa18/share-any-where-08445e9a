
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileSelection } from "./FileSelection";

interface ConnectionStatusProps {
  isConnected: boolean;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  startFileTransfer: () => void;
}

export const ConnectionStatus = ({
  isConnected,
  selectedFile,
  setSelectedFile,
  startFileTransfer
}: ConnectionStatusProps) => {
  if (!isConnected) return null;

  return (
    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium mb-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        Connected to nearby device
      </div>
      
      <FileSelection 
        selectedFile={selectedFile} 
        setSelectedFile={setSelectedFile} 
      />

      <div className="mt-4">
        <Button 
          onClick={startFileTransfer} 
          disabled={!selectedFile} 
          className="w-full flex items-center justify-center gap-2"
        >
          <Send size={16} /> Send File
        </Button>
      </div>
    </div>
  );
};
