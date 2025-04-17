
import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, Scan, FileUp, Send, FilePlus, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export const NearbyConnection = () => {
  const [activeTab, setActiveTab] = useState<"qrcode" | "pin">("qrcode");
  const [connectionId, setConnectionId] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileShareOpen, setFileShareOpen] = useState<boolean>(false);
  const [transferProgress, setTransferProgress] = useState<number>(0);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate a new connection ID and PIN on component mount or when tab changes
  useEffect(() => {
    if (activeTab === "qrcode") {
      generateNewConnectionId();
    } else {
      generateNewPin();
    }
  }, [activeTab]);

  const generateNewConnectionId = () => {
    const newId = uuidv4();
    setConnectionId(newId);
    setIsConnected(false);
    setSelectedFile(null);
  };

  const generateNewPin = () => {
    // Generate a 6-digit PIN
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    setPin(newPin);
    setIsConnected(false);
    setSelectedFile(null);
  };

  const handlePinSubmit = () => {
    if (enteredPin === pin) {
      setIsConnected(true);
      toast({
        title: "Connected successfully!",
        description: "You are now connected with the nearby device.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "The PIN you entered is incorrect. Please try again.",
      });
    }
  };

  const copyToClipboard = (text: string, itemType: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${itemType} copied!`,
      description: `${itemType} has been copied to clipboard.`,
    });
  };

  const simulateConnection = () => {
    setIsConnected(true);
    toast({
      title: "Connected successfully!",
      description: "Simulated connection established.",
    });
  };

  const handleFileSelection = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const startFileTransfer = () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to share.",
      });
      return;
    }

    setFileShareOpen(true);
    setIsTransferring(true);
    setTransferProgress(0);

    // Simulate file transfer
    const interval = setInterval(() => {
      setTransferProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsTransferring(false);
            toast({
              title: "File transferred successfully!",
              description: `${selectedFile.name} has been sent to the connected device.`,
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect Nearby Devices</CardTitle>
        <CardDescription>
          Share files securely with nearby devices using QR code or PIN
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "qrcode" | "pin")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            <TabsTrigger value="pin">PIN Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="qrcode" className="space-y-4 mt-4">
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
          </TabsContent>
          
          <TabsContent value="pin" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="bg-muted p-6 rounded-md text-center">
                <h3 className="text-lg font-medium mb-2">Your PIN Code</h3>
                <div className="text-3xl font-bold tracking-widest">{pin}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Share this PIN with the nearby device
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => copyToClipboard(pin, "PIN")}
              >
                <Copy size={16} /> Copy PIN
              </Button>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Label htmlFor="enter-pin">Or enter received PIN:</Label>
                <div className="flex gap-2">
                  <Input
                    id="enter-pin"
                    placeholder="Enter 6-digit PIN..."
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    maxLength={6}
                  />
                  <Button onClick={handlePinSubmit}>
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isConnected && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Connected to nearby device
            </div>
            
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
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="secondary"
          onClick={activeTab === "qrcode" ? generateNewConnectionId : generateNewPin}
        >
          Generate New {activeTab === "qrcode" ? "Code" : "PIN"}
        </Button>
        
        {isConnected && (
          <Button onClick={startFileTransfer} disabled={!selectedFile} className="flex items-center gap-2">
            <Send size={16} /> 
            Share File
          </Button>
        )}
      </CardFooter>

      <Dialog open={fileShareOpen} onOpenChange={setFileShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transferring File</DialogTitle>
            <DialogDescription>
              Sending the selected file to the connected device.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-blue-500" />
              <div>
                <p className="font-medium">{selectedFile?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedFile && formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(transferProgress)}%</span>
              </div>
              <Progress value={transferProgress} className="h-2" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setFileShareOpen(false)} disabled={isTransferring}>
              {isTransferring ? "Transferring..." : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default NearbyConnection;
