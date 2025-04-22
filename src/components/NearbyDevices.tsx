
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

// Define a type for stored device info
interface StoredDeviceInfo {
  id: string;
  name: string;
  timestamp: number;
}

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

  // Load stored devices on mount
  useEffect(() => {
    try {
      // Load stored device identifier
      const storedId = localStorage.getItem("device-identifier");
      if (storedId) {
        setDeviceIdentifier(storedId);
      } else {
        const newId = `${navigator.userAgent.substring(0, 8)}-${Math.random().toString(36).substring(2, 8)}`;
        localStorage.setItem("device-identifier", newId);
        setDeviceIdentifier(newId);
      }

      // Check Bluetooth availability
      if (navigator.bluetooth) {
        setIsBluetoothAvailable(true);
      } else {
        setIsBluetoothAvailable(false);
        console.log("Bluetooth API is not available in this browser");
      }
    } catch (error) {
      console.error("Error initializing NearbyDevices:", error);
    }
  }, []);

  // Filter devices when search term changes
  useEffect(() => {
    if (deviceFilter) {
      const found = devices.find(
        (dev) =>
          dev.name?.toLowerCase().includes(deviceFilter.toLowerCase()) ||
          dev.id?.toLowerCase().includes(deviceFilter.toLowerCase())
      );
      
      if (found) {
        setHighlightedDeviceId(found.id);
        toast({
          title: "Device matched",
          description: `Found device: ${found.name || found.id.substring(0,6)}`,
        });
      } else {
        // Try to match against stored devices
        try {
          const deviceMap = JSON.parse(localStorage.getItem("discovered-devices") || "{}");
          const storedDeviceKeys = Object.keys(deviceMap);
          let matchFound = false;
          
          for (const key of storedDeviceKeys) {
            const storedDevice = deviceMap[key];
            if (
              storedDevice.id.toLowerCase().includes(deviceFilter.toLowerCase()) ||
              (storedDevice.name && storedDevice.name.toLowerCase().includes(deviceFilter.toLowerCase()))
            ) {
              toast({
                title: "Stored device matched",
                description: `Found device in history: ${storedDevice.name}. Please scan for devices to reconnect.`,
              });
              matchFound = true;
              break;
            }
          }
          
          if (!matchFound) {
            toast({
              title: "No matching device",
              description: "No devices match your search. Try scanning for devices first.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Error matching against stored devices:", error);
        }
        
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
        // Store device identifier in local storage
        const deviceMap = JSON.parse(localStorage.getItem("discovered-devices") || "{}");
        deviceMap[device.id] = {
          id: device.id,
          name: device.name || `Device-${device.id.substring(0, 6)}`,
          timestamp: Date.now()
        };
        localStorage.setItem("discovered-devices", JSON.stringify(deviceMap));

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
      
      // More user-friendly error message handling
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (errorMessage.includes("cancelled")) {
        toast({
          title: "Scan cancelled",
          description: "You cancelled the device selection.",
        });
      } else {
        toast({
          title: "Scan failed",
          description: "Failed to scan for devices. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      toast({
        title: "Connecting",
        description: `Trying to connect to ${device.name || "device"}...`,
      });
      
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
        description: "Failed to connect to device. Make sure it's nearby and discoverable.",
        variant: "destructive",
      });
    }
  };

  const findDeviceByCode = (code: string): BluetoothDevice | null => {
    // Check currently scanned devices first
    const device = devices.find(
      (dev) =>
        dev.name?.toLowerCase().includes(code.toLowerCase()) ||
        dev.id?.toLowerCase().includes(code.toLowerCase()) ||
        code.includes(dev.id.substring(0, 6))  // Match partial device ID
    );
    
    if (device) return device;
    
    // If no match in current devices, return null
    // (We already checked stored devices in the useEffect)
    return null;
  };

  const handleQRScanResult = async (val: string) => {
    console.log("QR scan result:", val);
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
          description: "Failed to connect to device. Make sure it's nearby and Bluetooth is enabled.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Device not found",
        description: "No matching device found. Please scan for devices first by clicking 'Scan for Devices'.",
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
          <Button 
            size="sm" 
            onClick={scanForDevices} 
            disabled={!isBluetoothAvailable || isScanning}
            className="bg-brand-purple hover:bg-brand-purple-dark"
          >
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
          <p className="font-semibold">Bluetooth is not available in your browser</p> 
          <p>Try using Chrome or Edge on desktop, or check if your device supports Web Bluetooth.</p>
          <p className="mt-2 text-xs">Note: Web Bluetooth is still an experimental technology and may not work on all devices.</p>
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
