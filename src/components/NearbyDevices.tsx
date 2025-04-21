
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WifiHigh, Bluetooth, BluetoothConnected, BluetoothOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NearbyDevicesProps {
  onDeviceSelected?: (device: BluetoothDevice) => void;
}

export const NearbyDevices = ({ onDeviceSelected }: NearbyDevicesProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);

  useEffect(() => {
    // Check if Bluetooth is available in this browser
    if (navigator.bluetooth) {
      setIsBluetoothAvailable(true);
    } else {
      setIsBluetoothAvailable(false);
      console.log("Bluetooth API is not available");
    }
  }, []);

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
      // Attempt to connect to the GATT server
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
          {isBluetoothAvailable ? (
            <BluetoothConnected className="text-brand-purple h-5 w-5" />
          ) : (
            <BluetoothOff className="text-gray-400 h-5 w-5" />
          )}
          <h3 className="text-md font-medium">Nearby Devices</h3>
        </div>
        
        <Button 
          size="sm" 
          onClick={scanForDevices} 
          disabled={!isBluetoothAvailable || isScanning}
        >
          {isScanning ? "Scanning..." : "Scan for Devices"}
        </Button>
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
              {devices.map((device) => (
                <li 
                  key={device.id} 
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <WifiHigh className="h-4 w-4 text-brand-purple" />
                    <span>{device.name || `Device (${device.id.substring(0, 6)})`}</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => connectToDevice(device)}>
                    Connect
                  </Button>
                </li>
              ))}
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
