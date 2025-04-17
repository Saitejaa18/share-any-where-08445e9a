
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FilePlus, FileText } from "lucide-react";
import { formatFileSize } from "@/utils/fileUtils";

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
      setSelectedFile(e.target.files[0]);
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
      </div>
    </div>
  );
};
