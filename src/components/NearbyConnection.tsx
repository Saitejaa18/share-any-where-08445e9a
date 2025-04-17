
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, Scan } from "lucide-react";

export const NearbyConnection = () => {
  const [activeTab, setActiveTab] = useState<"qrcode" | "pin">("qrcode");
  const [connectionId, setConnectionId] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

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
  };

  const generateNewPin = () => {
    // Generate a 6-digit PIN
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    setPin(newPin);
    setIsConnected(false);
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="secondary"
          onClick={activeTab === "qrcode" ? generateNewConnectionId : generateNewPin}
        >
          Generate New {activeTab === "qrcode" ? "Code" : "PIN"}
        </Button>
        
        {isConnected && (
          <Button>
            Start Sharing
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NearbyConnection;
