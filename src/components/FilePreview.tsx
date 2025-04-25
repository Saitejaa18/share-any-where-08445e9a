
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileUploadResult } from "@/services/fileService";
import { FileText, Image, File, Music, Video } from "lucide-react";

interface FilePreviewProps {
  file: FileUploadResult;
  isOpen: boolean;
  onClose: () => void;
}

export const FilePreview = ({ file, isOpen, onClose }: FilePreviewProps) => {
  const getPreviewContent = () => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="w-full max-h-[80vh] flex items-center justify-center">
          <img src={file.url} alt={file.name} className="max-w-full max-h-full object-contain" />
        </div>
      );
    }

    if (file.type.startsWith('video/')) {
      return (
        <video controls className="w-full max-h-[80vh]">
          <source src={file.url} type={file.type} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (file.type.startsWith('audio/')) {
      return (
        <div className="p-8">
          <audio controls className="w-full">
            <source src={file.url} type={file.type} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    // For other file types, show a generic preview
    return (
      <div className="flex flex-col items-center justify-center p-8">
        {getFileIcon(file.type)}
        <p className="mt-4 text-lg font-medium">{file.name}</p>
        <p className="text-sm text-muted-foreground">
          This file type cannot be previewed directly.
        </p>
      </div>
    );
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="h-16 w-16 text-blue-500" />;
    if (fileType.startsWith("video/")) return <Video className="h-16 w-16 text-red-500" />;
    if (fileType.startsWith("audio/")) return <Music className="h-16 w-16 text-purple-500" />;
    if (fileType.includes("pdf")) return <FileText className="h-16 w-16 text-orange-500" />;
    return <File className="h-16 w-16 text-gray-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl w-[90vw]">
        {getPreviewContent()}
      </DialogContent>
    </Dialog>
  );
};
