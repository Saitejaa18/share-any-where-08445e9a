
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FilePlus, FileText } from "lucide-react";
import { formatFileSize } from "@/utils/fileUtils";
import { toast } from "@/hooks/use-toast";

interface FileSelectionProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

export const FileSelection = ({ selectedFile, setSelectedFile }: FileSelectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size (2GB limit)
      const maxSize = 2 * 1024 * 1024 * 1024; // 2GB in bytes
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "The maximum file size is 2GB. Please select a smaller file.",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Select a file to share:</Label>
      <div className="flex flex-col gap-3">
        <input 
          type="file" 
          className="sr-only" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleFileSelection}
        >
          <FilePlus size={16} /> {selectedFile ? "Change File" : "Select File"}
        </Button>
        
        {selectedFile && (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
            <FileText size={20} className="text-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
        )}
        <p className="text-xs text-muted-foreground">Maximum file size: 2GB</p>
      </div>
    </div>
  );
};
