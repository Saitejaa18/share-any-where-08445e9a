
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Download, FileText, File, Image, Music, Video, AlertTriangle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { getFileByShareId } from "@/services/fileService";
import { toast } from "@/hooks/use-toast";

const DownloadPage = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [linkExpired, setLinkExpired] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      
      try {
        if (!fileId) {
          throw new Error("File ID is required");
        }
        
        const fileData = await getFileByShareId(fileId);
        setFile(fileData);
      } catch (err: any) {
        console.error("Error fetching file:", err);
        
        // Check if the error is due to an expired link
        if (err.message.includes("not found") || err.message.includes("expired")) {
          setLinkExpired(true);
          setError("This download link has expired or has already been used");
        } else {
          setError(err.message || "An error occurred while fetching the file");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchFile();
  }, [fileId]);

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File className="h-16 w-16 text-gray-500" />;
    if (fileType.startsWith("image/")) return <Image className="h-16 w-16 text-blue-500" />;
    if (fileType.startsWith("video/")) return <Video className="h-16 w-16 text-red-500" />;
    if (fileType.startsWith("audio/")) return <Music className="h-16 w-16 text-purple-500" />;
    if (fileType.includes("pdf")) return <FileText className="h-16 w-16 text-orange-500" />;
    return <File className="h-16 w-16 text-gray-500" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownload = () => {
    if (file?.url) {
      setDownloadStarted(true);
      
      // Show a toast to notify the user that this is a one-time link
      toast({
        title: "File download started",
        description: "Note: This is a one-time download link and will expire after use.",
      });
      
      window.open(file.url, "_blank");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-purple to-brand-purple-dark shadow-md py-4">
        <div className="container mx-auto px-4">
          <Link to="/">
            <Logo />
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center p-8">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full bg-muted h-16 w-16 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ) : linkExpired || error ? (
              <div className="text-center p-8">
                <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-destructive">{error}</h3>
                <p className="text-muted-foreground mt-2">
                  {linkExpired 
                    ? "This download link has expired or has already been used." 
                    : "The file you're looking for doesn't exist or has been removed."}
                </p>
              </div>
            ) : (
              <div className="text-center p-6">
                <div className="mx-auto mb-4 bg-muted rounded-full p-4 inline-flex">
                  {getFileIcon(file?.type)}
                </div>
                <h2 className="text-xl font-semibold mb-2">{file?.name}</h2>
                <p className="text-muted-foreground mb-6">
                  {formatFileSize(file?.size)}
                </p>
                
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <p className="text-sm">
                    This file was shared with you via ShareAnyWhere. This is a one-time download link.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          
          {!loading && !error && !linkExpired && (
            <CardFooter className="flex justify-center pb-6">
              <Button 
                size="lg" 
                onClick={handleDownload} 
                className="w-full"
                disabled={downloadStarted}
              >
                <Download className="mr-2 h-4 w-4" />
                {downloadStarted ? "Download Started..." : "Download File"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 ShareAnyWhere. All rights reserved.</p>
          <div className="mt-2">
            <Link to="/" className="text-sm text-primary hover:underline">
              Share your own files
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DownloadPage;
