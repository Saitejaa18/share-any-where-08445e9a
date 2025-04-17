
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, File, FileText, Image, Music, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface FileListProps {
  files: any[];
}

export const FileList = ({ files }: FileListProps) => {
  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied!",
      description: "Shareable link copied to clipboard.",
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="h-5 w-5 text-blue-500" />;
    if (fileType.startsWith("video/")) return <Video className="h-5 w-5 text-red-500" />;
    if (fileType.startsWith("audio/")) return <Music className="h-5 w-5 text-purple-500" />;
    if (fileType.includes("pdf")) return <FileText className="h-5 w-5 text-orange-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (files.length === 0) {
    return (
      <div className="text-center p-12">
        <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No files uploaded yet</h3>
        <p className="text-muted-foreground mt-2">
          Upload your first file to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <Card key={file.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <div className="mr-4 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{file.name}</p>
                  <Badge variant="outline" className="ml-2">
                    {formatFileSize(file.size)}
                  </Badge>
                </div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span>Uploaded {formatDistanceToNow(new Date(file.uploadedAt))} ago</span>
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(file.shareableLink)}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
