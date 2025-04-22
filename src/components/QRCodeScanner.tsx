
import { useRef, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface QRCodeScannerProps {
  onResult: (text: string) => void;
  onClose: () => void;
}

export const QRCodeScanner = ({ onResult, onClose }: QRCodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [manualCode, setManualCode] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [scanningSupported, setScanningSupported] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);
  const [scannerActive, setScannerActive] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let scanActive = true;

    async function setupCamera() {
      if ("BarcodeDetector" in window) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            
            // @ts-ignore
            const detector = new window.BarcodeDetector({ formats: ["qr_code"] });

            const scan = async () => {
              if (!scannerActive || !scanActive) return;
              
              if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
                try {
                  const barcodes = await detector.detect(videoRef.current);
                  if (barcodes.length > 0) {
                    const qrValue = barcodes[0].rawValue || barcodes[0].value || "";
                    if (qrValue) {
                      console.log("QR code detected:", qrValue);
                      // Prevent multiple scans of the same code
                      scanActive = false;
                      setScannerActive(false);
                      onResult(qrValue);
                      return;
                    }
                  }
                } catch (err) {
                  // ignore each frame errors, barcode not detected
                }
                if (scanActive) {
                  requestAnimationFrame(scan);
                }
              }
            };
            
            scan();
          }
        } catch (err) {
          console.error("Camera access error:", err);
          setHasPermission(false);
          setScanningSupported(false);
          setIsScanning(false);
          toast({
            title: "Cannot access camera",
            description: "Camera access was denied or not available.",
            variant: "destructive",
          });
        }
      } else {
        setScanningSupported(false);
        setIsScanning(false);
        toast({
          title: "QR scanning not supported",
          description: "Please use Chrome/Edge for built-in QR scanning, or type the device code.",
          variant: "destructive",
        });
      }
    }

    if (isScanning && scannerActive) {
      setupCamera();
    }

    return () => {
      scanActive = false;
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [onResult, isScanning, scannerActive]);

  const handleManualCodeSubmit = () => {
    if (manualCode.trim()) {
      onResult(manualCode.trim());
    } else {
      toast({
        title: "Empty code",
        description: "Please enter a device code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {isScanning && scanningSupported && hasPermission && scannerActive ? (
        <>
          <video ref={videoRef} className="w-full h-48 bg-black rounded border mb-1" />
          <p className="text-sm text-muted-foreground">Point your camera at a device QR code</p>
        </>
      ) : (
        <div className="p-4 rounded-md bg-muted w-full">
          <p className="text-sm mb-4 text-center">
            {!scanningSupported 
              ? "QR scanning is not supported in this browser. Please enter the device code manually."
              : !hasPermission
                ? "Camera access denied. Please enter the device code manually."
                : "QR scanning disabled. Enter the device code manually."}
          </p>
          <div className="flex flex-col gap-2">
            <Input 
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter device code"
              className="w-full"
            />
            <Button onClick={handleManualCodeSubmit}>Submit Code</Button>
          </div>
        </div>
      )}
      
      <div className="flex justify-between w-full">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        {scanningSupported && hasPermission && (
          <Button 
            variant="outline" 
            onClick={() => {
              setIsScanning(!isScanning);
              setScannerActive(isScanning ? false : true);
            }}
          >
            {isScanning ? "Enter Code Manually" : "Try Camera Scan"}
          </Button>
        )}
      </div>
    </div>
  );
};
