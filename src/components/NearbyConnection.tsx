
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { transferFile } from "@/utils/fileUtils";

// Import refactored components
import { QRCodeTab } from "./nearby/QRCodeTab";
import { PinCodeTab } from "./nearby/PinCodeTab";
import { ConnectionStatus } from "./nearby/ConnectionStatus";
import { FileTransferDialog } from "./nearby/FileTransferDialog";

export const NearbyConnection = () => {
  const [activeTab, setActiveTab] = useState<"qrcode" | "pin">("qrcode");
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileShareOpen, setFileShareOpen] = useState<boolean>(false);
  const [transferProgress, setTransferProgress] = useState<number>(0);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [connectedDeviceId, setConnectedDeviceId] = useState<string>("");

  const handlePinSubmit = () => {
    if (enteredPin.length === 6) {
      // In a real implementation, you would validate the entered PIN against a server
      setIsConnected(true);
      setConnectedDeviceId(`device-${Math.floor(Math.random() * 10000)}`);
      toast({
        title: "Connected successfully!",
        description: "You are now connected with the nearby device. Ready to share files.",
      });
    }
  };

  const simulateConnection = () => {
    setIsConnected(true);
    setConnectedDeviceId(`device-${Math.floor(Math.random() * 10000)}`);
    toast({
      title: "Connected successfully!",
      description: "Simulated connection established. Ready to share files.",
    });
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

    // Check if file is too large (over 2GB)
    if (selectedFile.size > 2 * 1024 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Maximum file size is 2GB.",
      });
      return;
    }

    setFileShareOpen(true);
    setIsTransferring(true);
    setTransferProgress(0);

    // Calculate chunks based on the file size
    // Larger files will have more chunks for smoother visual progress
    const chunkSize = 1024 * 1024; // 1MB chunks
    const totalChunks = Math.max(Math.ceil(selectedFile.size / chunkSize), 20);
    let currentChunk = 0;

    const chunkInterval = setInterval(() => {
      currentChunk++;
      const newProgress = (currentChunk / totalChunks) * 100;
      setTransferProgress(Math.min(newProgress, 99)); // Cap at 99% until complete
      
      if (currentChunk >= totalChunks) {
        clearInterval(chunkInterval);
        
        // Actually attempt to transfer file
        transferFile(selectedFile, connectedDeviceId)
          .then((success) => {
            setTransferProgress(100);
            setTimeout(() => {
              setIsTransferring(false);
              if (success) {
                toast({
                  title: "File transferred successfully!",
                  description: `${selectedFile.name} has been sent to the connected device.`,
                });
                setSelectedFile(null); // Clear the file selection after successful transfer
              } else {
                toast({
                  variant: "destructive",
                  title: "Transfer failed",
                  description: "The file transfer was unsuccessful. Please try again.",
                });
              }
            }, 500);
          })
          .catch(() => {
            setIsTransferring(false);
            toast({
              variant: "destructive",
              title: "Transfer error",
              description: "An error occurred during file transfer.",
            });
          });
      }
    }, 100);
  };

  const generateNewCode = () => {
    setIsConnected(false);
    setSelectedFile(null);
    setConnectedDeviceId("");
    setEnteredPin("");
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
          
          <TabsContent value="qrcode">
            <QRCodeTab simulateConnection={simulateConnection} />
          </TabsContent>
          
          <TabsContent value="pin">
            <PinCodeTab 
              onPinSubmit={handlePinSubmit} 
              enteredPin={enteredPin} 
              setEnteredPin={setEnteredPin} 
            />
          </TabsContent>
        </Tabs>

        <ConnectionStatus 
          isConnected={isConnected}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          startFileTransfer={startFileTransfer}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="secondary"
          onClick={generateNewCode}
        >
          Generate New {activeTab === "qrcode" ? "Code" : "PIN"}
        </Button>
      </CardFooter>

      <FileTransferDialog 
        open={fileShareOpen}
        onOpenChange={setFileShareOpen}
        selectedFile={selectedFile}
        transferProgress={transferProgress}
        isTransferring={isTransferring}
      />
    </Card>
  );
};

export default NearbyConnection;
