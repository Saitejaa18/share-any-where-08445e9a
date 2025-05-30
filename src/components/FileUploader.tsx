import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { uploadFile, FileUploadResult } from "@/services/fileService";

interface FileUploaderProps {
  onFileUpload: (file: FileUploadResult) => void;
}

export const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<FileUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      const errorMessage = `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds the maximum allowed size of 50MB`;
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "File too large",
        description: errorMessage
      });
      return;
    }
    
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      const fileData = await uploadFile(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setUploadedFile(fileData);
      onFileUpload(fileData);
      setShowSuccessDialog(true);
    } catch (error: any) {
      setError(error.message || "An error occurred during upload");
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "An error occurred during upload"
      });
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (uploadedFile?.shareableLink) {
      navigator.clipboard.writeText(uploadedFile.shareableLink);
      toast({
        title: "Link copied!",
        description: "Shareable link copied to clipboard.",
      });
    }
  };

  return (
    <>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          id="file-upload-button"
          type="file"
          className="sr-only"
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-muted p-3">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">
              <span className="text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum file size: 50MB
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Select File
          </Button>
        </div>
        
        {uploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6">
            <p className="text-sm font-medium mb-2">Uploading...</p>
            <Progress value={progress} className="w-full max-w-xs mb-2" />
            <p className="text-xs text-muted-foreground">{progress}%</p>
          </div>
        )}

        {error && !uploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6">
            <div className="flex items-center text-destructive mb-2">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p className="text-sm font-medium">Upload Error</p>
            </div>
            <p className="text-xs text-muted-foreground text-center mb-4">{error}</p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setError(null)}
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              File Uploaded Successfully!
            </DialogTitle>
            <DialogDescription>
              Your file has been uploaded. Share it with the link below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">File Name</p>
              <p className="text-sm text-muted-foreground">{uploadedFile?.name}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Shareable Link</p>
              <div className="flex gap-2">
                <Input 
                  value={uploadedFile?.shareableLink || ""} 
                  readOnly 
                  className="text-xs"
                />
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  Copy
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
