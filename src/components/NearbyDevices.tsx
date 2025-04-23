
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Wifi, Users, AlertCircle, RefreshCw, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FileUploadResult } from "@/services/fileService";
import {
  discoverDevices,
  sendFileToPeer,
  connectUsingCode,
  generateShareableCode,
  isWebRTCSupported,
  getDeviceName,
  initWebRTC,
} from "@/utils/webRTCUtils";
import { toast } from "@/hooks/use-toast";

interface NearbyDevicesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFile: FileUploadResult | null;
}

interface Device {
  deviceId: string;
  deviceName: string;
}

export const NearbyDevices = ({ open, onOpenChange, selectedFile }: NearbyDevicesProps) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [shareCode, setShareCode] = useState<string>("");
  const [inputCode, setInputCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("nearby");
  const [transferProgress, setTransferProgress] = useState<number>(0);
  const [transferState, setTransferState] = useState<string>("");
  const [webRTCSupported, setWebRTCSupported] = useState<boolean>(true);

  // Initialize WebRTC and check browser support
  useEffect(() => {
    if (open) {
      setWebRTCSupported(isWebRTCSupported());
      if (isWebRTCSupported()) {
        initWebRTC();
        setShareCode(generateShareableCode());
        searchDevices();
      }
    }
  }, [open]);

  // Listen for file transfer completion event
  useEffect(() => {
    const handleTransferComplete = (e: CustomEvent) => {
      toast({
        title: "File received",
        description: `Successfully received ${e.detail.file.name}`
      });
      
      // Close the sheet after successful transfer
      setTransferState("complete");
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    };

    window.addEventListener('file-transfer-complete', handleTransferComplete as EventListener);
    return () => {
      window.removeEventListener('file-transfer-complete', handleTransferComplete as EventListener);
    };
  }, [onOpenChange]);

  const searchDevices = async () => {
    if (!isWebRTCSupported()) return;
    
    setIsLoading(true);
    try {
      const nearbyDevices = await discoverDevices();
      setDevices(nearbyDevices);
    } catch (error) {
      console.error("Error discovering devices:", error);
      toast({
        variant: "destructive",
        title: "Discovery failed",
        description: "Could not find nearby devices"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWithCode = async () => {
    if (!inputCode || inputCode.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter a valid 6-character share code"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await connectUsingCode(inputCode);
      
      if (!success) {
        toast({
          variant: "destructive",
          title: "Connection failed",
          description: "Could not connect to the device with this code"
        });
      } else if (selectedFile) {
        // If file is selected and connection is established, send the file
        sendFile({ deviceId: "code-connection", deviceName: "Connected Device" });
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Failed to establish connection"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendFile = async (device: Device) => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to share"
      });
      return;
    }

    setTransferState("sending");
    setTransferProgress(0);

    try {
      // Convert the URL to a Blob, then to a File object
      const response = await fetch(selectedFile.url);
      const blob = await response.blob();
      const file = new File([blob], selectedFile.name, { type: selectedFile.type });

      const success = await sendFileToPeer(
        file,
        device.deviceId,
        (status, progress) => {
          if (status === "progress" && progress) {
            setTransferProgress(progress.percentage);
          } else if (status === "complete") {
            setTransferState("complete");
            setTransferProgress(100);
            
            toast({
              title: "Transfer complete",
              description: `${selectedFile.name} was sent successfully`
            });
            
            setTimeout(() => {
              onOpenChange(false);
            }, 2000);
          } else if (status === "error") {
            setTransferState("error");
            toast({
              variant: "destructive",
              title: "Transfer failed",
              description: "Could not send the file"
            });
          }
        }
      );

      if (!success) {
        throw new Error("Transfer failed");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setTransferState("error");
      toast({
        variant: "destructive",
        title: "Transfer failed",
        description: "Error sending file"
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Share with Nearby Devices</SheetTitle>
          <SheetDescription>
            Send files directly to devices on your network
          </SheetDescription>
        </SheetHeader>

        {!webRTCSupported ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="font-semibold text-lg">WebRTC Not Supported</h3>
              <p className="text-muted-foreground">
                Your browser doesn't support direct device sharing.
                Try using Chrome, Firefox, or Edge.
              </p>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : transferState === "sending" ? (
          <div className="space-y-4 py-8">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Sending {selectedFile?.name}</h3>
              <p className="text-muted-foreground mb-4">Transfer in progress...</p>
            </div>
            <Progress value={transferProgress} className="w-full h-2" />
            <p className="text-center text-sm text-muted-foreground">
              {transferProgress}% complete
            </p>
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : transferState === "complete" ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
            <div className="bg-green-100 text-green-700 rounded-full p-2">
              <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Transfer Complete</h3>
              <p className="text-muted-foreground">
                {selectedFile?.name} was sent successfully
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="nearby">
                  <Wifi className="mr-2 h-4 w-4" />
                  Nearby
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Users className="mr-2 h-4 w-4" />
                  Share Code
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="nearby" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Available Devices</h3>
                  <Button variant="outline" size="sm" onClick={searchDevices} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center p-3 rounded-md border animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : devices.length === 0 ? (
                  <div className="text-center py-6 border rounded-md bg-muted/10">
                    <Users className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No devices found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Make sure devices are on the same network
                    </p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={searchDevices}>
                      Search again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                    {devices.map((device) => (
                      <div 
                        key={device.deviceId} 
                        className="flex items-center justify-between p-3 rounded-md border hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => sendFile(device)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{device.deviceName}</p>
                            <p className="text-xs text-muted-foreground">Click to send file</p>
                          </div>
                        </div>
                        <Send className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="code" className="space-y-6 mt-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Your share code</h3>
                  <div className="flex items-center space-x-2">
                    <div className="border rounded-md p-4 bg-muted/10 text-center flex-1">
                      <p className="text-2xl font-mono tracking-widest">{shareCode}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Share this code with others
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(shareCode);
                        toast({
                          title: "Copied to clipboard",
                          description: "Share code copied"
                        });
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This is your device: {getDeviceName()}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Connect with code</h3>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Enter 6-digit code"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="text-center text-lg tracking-wider"
                    />
                    <Button 
                      onClick={connectWithCode} 
                      disabled={isLoading || inputCode.length < 6}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!transferState && (
          <SheetFooter className="mt-4">
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
