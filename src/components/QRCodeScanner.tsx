
import { useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

// We'll use the new BarcodeDetector API if available, fallback: user uploads photo
export interface QRCodeScannerProps {
  onResult: (text: string) => void;
  onClose: () => void;
}

export const QRCodeScanner = ({ onResult, onClose }: QRCodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      if ("BarcodeDetector" in window) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            // @ts-ignore
            const detector = new window.BarcodeDetector({ formats: ["qr_code"] });

            const scan = async () => {
              if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
                try {
                  const barcodes = await detector.detect(videoRef.current);
                  if (barcodes.length > 0) {
                    onResult(barcodes[0].rawValue || barcodes[0].value || "");
                    onClose();
                    return;
                  }
                } catch (err) {
                  // ignore each frame errors, barcode not detected
                }
                requestAnimationFrame(scan);
              }
            };
            scan();
          }
        } catch (err) {
          toast({
            title: "Cannot access camera",
            description: "Camera access was denied or not available.",
            variant: "destructive",
          });
          onClose();
        }
      } else {
        toast({
          title: "QR scanning not supported",
          description: "Please use Chrome/Edge for built-in QR scanning, or type the device code.",
          variant: "destructive",
        });
        onClose();
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [onResult, onClose]);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-full h-48 bg-black rounded border mb-4" />
      <p className="text-sm text-muted-foreground">Point your camera at a device QR code</p>
      <button onClick={onClose} className="mt-4 px-4 py-2 bg-brand-purple text-white rounded">Cancel</button>
    </div>
  );
};
