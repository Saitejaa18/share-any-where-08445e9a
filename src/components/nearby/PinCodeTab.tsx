
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PinCodeTabProps {
  onPinSubmit: () => void;
  enteredPin: string;
  setEnteredPin: (pin: string) => void;
}

export const PinCodeTab = ({ onPinSubmit, enteredPin, setEnteredPin }: PinCodeTabProps) => {
  const [pin, setPin] = useState<string>("");

  useEffect(() => {
    generateNewPin();
  }, []);

  const generateNewPin = () => {
    // Generate a 6-digit PIN
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    setPin(newPin);
  };

  const copyToClipboard = (text: string, itemType: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${itemType} copied!`,
      description: `${itemType} has been copied to clipboard.`,
    });
  };

  const handlePinSubmit = () => {
    if (enteredPin.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid PIN",
        description: "Please enter a valid 6-digit PIN.",
      });
      return;
    }
    
    onPinSubmit();
    toast({
      title: "Connected!",
      description: "Successfully connected to the other device. Ready to receive files.",
    });
  };

  return (
    <div className="space-y-4 mt-4">
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
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <Button onClick={handlePinSubmit}>
              Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
