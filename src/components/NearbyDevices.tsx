
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { QRCodeScanner } from "./QRCodeScanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search,
  QrCode,
} from "lucide-react";

interface NearbyDevicesProps {
  onDeviceSelected?: (device: BluetoothDevice) => void;
}

export const NearbyDevices = ({ onDeviceSelected }: NearbyDevicesProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);

  // New state for QR scanning and user input
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState("");      // for both QR or text input
  const [highlightedDeviceId, setHighlightedDeviceId] = useState<string | null>(null);

  useEffect(() => {
    // Check if Bluetooth is available in this browser
    if (navigator.bluetooth) {
      setIsBluetoothAvailable(true);
    } else {
      setIsBluetoothAvailable(false);
      console.log("Bluetooth API is not available");
    }
  }, []);

  useEffect(() => {
    // When deviceFilter changes, see if we have a matching device
    if (deviceFilter) {
      const found = devices.find(
        (dev) =>
          dev.name?.toLowerCase() === deviceFilter.toLowerCase() ||
          dev.id?.toLowerCase() === deviceFilter.toLowerCase()
      );
      if (found) {
        setHighlightedDeviceId(found.id);
        toast({
          title: "Device matched",
          description: `Found device: ${found.name || found.id.substring(0,6)}`,
        });
      } else {
        setHighlightedDeviceId(null);
      }
    } else {
      setHighlightedDeviceId(null);
    }
  }, [deviceFilter, devices]);

  const scanForDevices = async () => {
    if (!navigator.bluetooth) {
      toast({
        title: "Bluetooth not supported",
        description: "Your browser doesn't support the Web Bluetooth API",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsScanning(true);

      toast({
        title: "Scanning for devices",
        description: "Looking for nearby Bluetooth devices...",
      });

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });

      if (device) {
        setDevices(prev => {
          // Only add device if it's not already in the list
          if (!prev.some(d => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });
        toast({
          title: "Device found",
          description: `Found ${device.name || "Unnamed device"}`,
        });
      }
    } catch (error) {
      console.error("Error scanning for Bluetooth devices:", error);
      toast({
        title: "Scan failed",
        description: "Failed to scan for devices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      const server = await device.gatt?.connect();
      if (server) {
        toast({
          title: "Connected",
          description: `Connected to ${device.name || "device"}`,
        });
        if (onDeviceSelected) {
          onDeviceSelected(device);
        }
      }
    } catch (error) {
      console.error("Error connecting to device:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to device",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Bluetooth state icon */}
          <span className={isBluetoothAvailable ? "text-brand-purple" : "text-gray-400"}>
            {isBluetoothAvailable ? (
              <span>&#9679;</span>
            ) : (
              <span>&#9675;</span>
            )}
          </span>
          <h3 className="text-md font-medium">Nearby Devices</h3>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={scanForDevices} disabled={!isBluetoothAvailable || isScanning}>
            {isScanning ? "Scanning..." : "Scan for Devices"}
          </Button>
          {/* QR Scanner trigger */}
          <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
            <DialogTrigger asChild>
              <Button size="icon" variant="outline" className="flex items-center" title="Scan QR for device">
                <QrCode />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Scan Device QR Code</DialogTitle>
                <DialogDescription>
                  Point your camera at the device's QR code. If successful, we'll focus that device in the list.
                </DialogDescription>
              </DialogHeader>
              <QRCodeScanner
                onResult={(val: string) => setDeviceFilter(val)}
                onClose={() => setShowQRDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-brand-purple" />
        <Input
          placeholder="Device Name or ID"
          value={deviceFilter}
          onChange={(e) => setDeviceFilter(e.target.value)}
          className="w-[220px]"
        />
      </div>

      {!isBluetoothAvailable && (
        <div className="text-sm text-muted-foreground bg-red-50 p-3 rounded-md">
          Bluetooth is not available in your browser. Try using Chrome or Edge on desktop for this feature.
        </div>
      )}

      <ScrollArea className="h-[150px] rounded-md border">
        {devices.length > 0 ? (
          <div className="p-4">
            <ul className="space-y-2">
              {devices.map((device) => {
                const isHighlighted =
                  highlightedDeviceId === device.id ||
                  (!highlightedDeviceId &&
                    !!deviceFilter &&
                    (device.name?.toLowerCase().includes(deviceFilter.toLowerCase()) ||
                      device.id?.toLowerCase().includes(deviceFilter.toLowerCase()))
                  );
                return (
                  <li
                    key={device.id}
                    className={
                      "flex items-center justify-between p-2 rounded-md " +
                      (isHighlighted
                        ? "bg-brand-purple/10 border border-brand-purple/40"
                        : "hover:bg-gray-100")
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          background: isHighlighted ? "#7E69AB" : "#DDD"
                        }}
                      />
                      <span>{device.name || `Device (${device.id.substring(0, 6)})`}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => connectToDevice(device)}>
                      Connect
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
            <p>No devices found</p>
            <p className="text-xs">Click "Scan for Devices" to discover nearby devices</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
