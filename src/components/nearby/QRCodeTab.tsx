
import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, Camera, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface QRCodeTabProps {
  simulateConnection: () => void;
}

export const QRCodeTab = ({ simulateConnection }: QRCodeTabProps) => {
  const [connectionId, setConnectionId] = useState<string>("");
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const scanIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    generateNewConnectionId();
  }, []);

  useEffect(() => {
    // Clean up scanner when component unmounts
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      stopCamera();
    };
  }, []);

  const generateNewConnectionId = () => {
    const newId = uuidv4();
    setConnectionId(newId);
  };

  const copyToClipboard = (text: string, itemType: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${itemType} copied!`,
      description: `${itemType} has been copied to clipboard.`,
    });
  };

  const startCamera = async () => {
    try {
      if (!videoRef.current) return;

      const constraints = {
        video: {
          facingMode: "environment",
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      setScanning(true);

      scanIntervalRef.current = window.setInterval(() => {
        scanQRCode();
      }, 500) as unknown as number;
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        variant: "destructive",
        title: "Camera access error",
        description: "Could not access your camera. Please check permissions.",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    setScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context || video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // In a real implementation, you would use a QR code scanning library here
      // For this demo, we'll simulate a successful scan after 3 seconds
      setTimeout(() => {
        if (scanning) {
          const scannedId = uuidv4(); // Simulate finding a QR code
          console.log("QR code scanned:", scannedId);
          stopCamera();
          setIsCameraOpen(false);
          simulateConnection();
          toast({
            title: "QR Code Scanned!",
            description: "Connection successful.",
          });
        }
      }, 3000);
    } catch (error) {
      console.error("QR scanning error:", error);
    }
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  const handleCloseCamera = () => {
    stopCamera();
    setIsCameraOpen(false);
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-md">
          <QRCodeSVG 
            value={connectionId} 
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Scan this QR code with another device to connect
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => copyToClipboard(connectionId, "Connection ID")}
        >
          <Copy size={16} /> Copy Connection ID
        </Button>
      </div>
      <Separator className="my-4" />
      <div className="space-y-4">
        <Label>Connect with QR Code:</Label>
        <div className="space-y-2">
          <Button 
            onClick={handleOpenCamera} 
            className="w-full flex items-center justify-center gap-2"
          >
            <Camera size={16} /> Scan QR Code with Camera
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <Label htmlFor="scan-qr">Or enter a connection ID:</Label>
          <div className="flex gap-2">
            <Input
              id="scan-qr"
              placeholder="Paste connection ID here..."
              className="flex-1"
            />
            <Button onClick={simulateConnection}>
              Connect
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-md" onInteractOutside={handleCloseCamera}>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <div className="relative flex flex-col items-center">
            <div className="w-full aspect-video bg-black rounded-md overflow-hidden relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-[2px] border-white/30 rounded-md pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-500 rounded-tl-md"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-green-500 rounded-tr-md"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-green-500 rounded-bl-md"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-500 rounded-br-md"></div>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <p className="text-center text-sm mt-2 text-muted-foreground">
              {scanning ? "Scanning for QR code..." : "Camera not active"}
            </p>
            <Button 
              onClick={handleCloseCamera} 
              variant="outline" 
              className="mt-4"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
