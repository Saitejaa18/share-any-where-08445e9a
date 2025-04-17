
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface QRCodeTabProps {
  simulateConnection: () => void;
}

export const QRCodeTab = ({ simulateConnection }: QRCodeTabProps) => {
  const [connectionId, setConnectionId] = useState<string>("");

  useEffect(() => {
    generateNewConnectionId();
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
  );
};
