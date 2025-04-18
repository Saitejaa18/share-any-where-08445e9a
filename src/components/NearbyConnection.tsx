
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
    // In a real implementation, you would validate the entered PIN
    setIsConnected(true);
    setConnectedDeviceId(`device-${Math.floor(Math.random() * 10000)}`);
    toast({
      title: "Connected successfully!",
      description: "You are now connected with the nearby device.",
    });
  };

  const simulateConnection = () => {
    setIsConnected(true);
    setConnectedDeviceId(`device-${Math.floor(Math.random() * 10000)}`);
    toast({
      title: "Connected successfully!",
      description: "Simulated connection established.",
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

    setFileShareOpen(true);
    setIsTransferring(true);
    setTransferProgress(0);

    // Simulate real file transfer with chunking
    const chunks = Math.ceil(selectedFile.size / (1024 * 1024));
    const totalChunks = Math.max(chunks, 10); // At least 10 chunks for visual feedback
    let currentChunk = 0;

    const chunkInterval = setInterval(() => {
      currentChunk++;
      const newProgress = (currentChunk / totalChunks) * 100;
      setTransferProgress(newProgress);
      
      if (currentChunk >= totalChunks) {
        clearInterval(chunkInterval);
        // Actually attempt to transfer file
        transferFile(selectedFile, connectedDeviceId)
          .then((success) => {
            setIsTransferring(false);
            if (success) {
              toast({
                title: "File transferred successfully!",
                description: `${selectedFile.name} has been sent to the connected device.`,
              });
            } else {
              toast({
                variant: "destructive",
                title: "Transfer failed",
                description: "The file transfer was unsuccessful. Please try again.",
              });
            }
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
    }, 300);
  };

  const generateNewCode = () => {
    setIsConnected(false);
    setSelectedFile(null);
    setConnectedDeviceId("");
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
