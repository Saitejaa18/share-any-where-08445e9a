import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { QRCodeScanner } from "./QRCodeScanner";
import { DeviceList } from "./DeviceList";
import { DeviceConnectionStatus } from "./DeviceConnectionStatus";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger
} from "@/components/ui/dialog";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Search,
  QrCode,
  Smartphone,
} from "lucide-react";

interface NearbyDevicesProps {
  onDeviceSelected?: (device: BluetoothDevice) => void;
}

export const NearbyDevices = ({ onDeviceSelected }: NearbyDevicesProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);

  const [showQRDialog, setShowQRDialog] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState("");
  const [highlightedDeviceId, setHighlightedDeviceId] = useState<string | null>(null);
  const [deviceIdentifier, setDeviceIdentifier] = useState("");

  useEffect(() => {
    const storedId = localStorage.getItem("device-identifier");
    if (storedId) {
      setDeviceIdentifier(storedId);
    } else {
      const newId = `${navigator.userAgent.substring(0, 8)}-${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem("device-identifier", newId);
      setDeviceIdentifier(newId);
    }
  }, []);

  useEffect(() => {
    if (navigator.bluetooth) {
      setIsBluetoothAvailable(true);
    } else {
      setIsBluetoothAvailable(false);
      console.log("Bluetooth API is not available");
    }
  }, []);

  useEffect(() => {
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

  const findDeviceByCode = (code: string) => {
    return devices.find(
      (dev) =>
        dev.name?.toLowerCase() === code.toLowerCase() ||
        dev.id?.toLowerCase() === code.toLowerCase()
    );
  };

  const handleQRScanResult = async (val: string) => {
    setDeviceFilter(val);
    setShowQRDialog(false);

    const matchingDevice = findDeviceByCode(val);
    if (matchingDevice) {
      toast({
        title: "Device matched",
        description: `Found device: ${matchingDevice.name || matchingDevice.id.substring(0, 6)}. Connecting...`,
      });
      try {
        const server = await matchingDevice.gatt?.connect();
        if (server) {
          toast({
            title: "Connected",
            description: `Connected to ${matchingDevice.name || "device"}`,
          });
          if (onDeviceSelected) {
            onDeviceSelected(matchingDevice);
          }
        }
      } catch (error) {
        console.error("Error connecting via QR:", error);
        toast({
          title: "Connection failed",
          description: "Failed to connect to device",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Device not found",
        description: "No matching device found. Make sure the device has been scanned or try scanning again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <DeviceConnectionStatus isBluetoothAvailable={isBluetoothAvailable} />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={scanForDevices} disabled={!isBluetoothAvailable || isScanning}>
            {isScanning ? "Scanning..." : "Scan for Devices"}
          </Button>
          <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
            <DialogTrigger asChild>
              <Button size="icon" variant="outline" className="flex items-center" title="QR Code Options">
                <QrCode size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>QR Code Options</DialogTitle>
                <DialogDescription>
                  You can scan a QR code from another device or show your device's code for others to scan.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="scan" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
                  <TabsTrigger value="show">Show My QR Code</TabsTrigger>
                </TabsList>
                
                <TabsContent value="scan" className="py-4">
                  {("BarcodeDetector" in window) ? (
                    <QRCodeScanner
                      onResult={handleQRScanResult}
                      onClose={() => setShowQRDialog(false)}
                    />
                  ) : (
                    <div className="p-4 text-center bg-red-100 rounded-md text-red-700">
                      <p className="font-semibold">QR scanning not supported</p>
                      <p className="text-sm mt-2">Please use Chrome/Edge for built-in QR scanning, or type the device code.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="show" className="flex flex-col items-center gap-4 py-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG value={deviceIdentifier} size={200} />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Your Device Code</p>
                    <p className="text-xs text-muted-foreground break-all">{deviceIdentifier}</p>
                    <p className="text-sm mt-2">Scan this code with another device to connect</p>
                  </div>
                </TabsContent>
              </Tabs>
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
        <DeviceList
          devices={devices}
          highlightedDeviceId={highlightedDeviceId}
          deviceFilter={deviceFilter}
          connectToDevice={connectToDevice}
        />
      </ScrollArea>
    </div>
  );
};
