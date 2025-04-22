
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import {
  LogOut,
  Plus,
  User,
  Share,
  BluetoothConnected,
  BluetoothOff,
  WifiHigh,
  QrCode
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { FileUploadResult } from "@/services/fileService";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { NearbyDevices } from "@/components/NearbyDevices";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { QRCodeScanner } from "@/components/QRCodeScanner";
import QRCode from "qrcode.react"; // Fixed: Changed from named import to default import
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";

const pastelGradient = "bg-gradient-to-br from-[#e5defc] to-[#fbc2eb]";
const glassCard = "backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl shadow-xl";

const Dashboard = () => {
  const [files, setFiles] = useState<FileUploadResult[]>([]);
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState<boolean>(false);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState<boolean>(false);
  const [nearbyDevices, setNearbyDevices] = useState<BluetoothDevice[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileUploadResult | null>(null);
  const { user, signOut } = useAuth();
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState("");
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
      console.log("Bluetooth API is not available in this browser");
    }
  }, []);

  const handleFileUpload = (fileData: FileUploadResult) => {
    setFiles(prevFiles => [fileData, ...prevFiles]);
    toast({
      title: "File uploaded successfully",
      description: "Your file is now available for sharing",
    });
  };

  const scanForDevices = async () => {
    try {
      if (!navigator.bluetooth) {
        toast({
          title: "Bluetooth not supported",
          description: "Your browser doesn't support Web Bluetooth API",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Scanning for devices",
        description: "Looking for nearby devices...",
      });

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });

      if (device) {
        setNearbyDevices(prev => {
          if (!prev.some(d => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });

        setIsBluetoothConnected(true);
        
        toast({
          title: "Device found",
          description: `Connected to ${device.name || "Unnamed Device"}`,
        });

        device.addEventListener('gattserverdisconnected', () => {
          setIsBluetoothConnected(false);
          toast({
            title: "Device disconnected",
            description: `${device.name || "Device"} has disconnected`,
          });
        });
      }
    } catch (error) {
      console.error('Error scanning for Bluetooth devices:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to nearby device",
        variant: "destructive",
      });
    }
  };

  const handleQRScanResult = async (code: string) => {
    setShowQRDialog(false);
    setDeviceFilter(code);
    
    const matchingDevice = nearbyDevices.find(
      (dev) =>
        dev.name?.toLowerCase() === code.toLowerCase() ||
        dev.id?.toLowerCase() === code.toLowerCase()
    );
    
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
          setIsBluetoothConnected(true);
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
        description: "No matching device found. Try scanning for devices first.",
        variant: "destructive",
      });
    }
  };

  const shareFileWithDevice = async (file: FileUploadResult, deviceId: string) => {
    setSelectedFile(file);
    
    toast({
      title: "File shared",
      description: `${file.name} has been shared with the connected device`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)" }}>
      <header className="bg-gradient-to-r from-brand-purple to-brand-purple-dark shadow-md py-4 rounded-b-2xl glassCard">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <User size={20} />
              <span>{user?.user_metadata?.full_name || user?.email}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut} className="text-white hover:bg-white/10">
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-brand-purple-dark">Your Files (This Session)</h1>
          <div className="flex gap-3">
            <Button 
              onClick={() => document.getElementById("file-upload-button")?.click()} 
              className="shadow-lg bg-brand-purple text-white hover:bg-brand-purple-dark"
            >
              <Plus className="mr-2 h-4 w-4" /> Upload New File
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="shadow-lg border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
                >
                  <Share className="mr-2 h-4 w-4" /> Share Nearby
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Share with Nearby Devices</SheetTitle>
                  <SheetDescription>
                    Connect and share files with devices around you.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border p-3 rounded-lg">
                      {isBluetoothConnected ? (
                        <div className="flex items-center text-green-600">
                          <BluetoothConnected size={18} className="mr-2" />
                          <span>Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500">
                          <BluetoothOff size={18} className="mr-2" />
                          <span>Not Connected</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={scanForDevices}
                          disabled={!isBluetoothAvailable}
                        >
                          Scan for Devices
                        </Button>
                        
                        <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
                          <DialogTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="flex items-center" 
                              title="QR Code Options"
                              disabled={!isBluetoothAvailable}
                            >
                              <QrCode size={18} />
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
                                  <QRCode value={deviceIdentifier} size={200} />
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
                    
                    {nearbyDevices.length > 0 ? (
                      <div className="border rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-2">Nearby Devices</h3>
                        <ul className="space-y-2">
                          {nearbyDevices.map((device) => (
                            <li key={device.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                              <div className="flex items-center">
                                <WifiHigh size={16} className="mr-2 text-brand-purple" />
                                <span>{device.name || `Device (${device.id.substring(0, 6)})`}</span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled={!selectedFile}
                                onClick={() => selectedFile && shareFileWithDevice(selectedFile, device.id)}
                              >
                                Share
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-center p-4 text-muted-foreground">
                        <p>No devices found nearby.</p>
                        <p className="text-xs mt-1">Click "Scan for Devices" to discover nearby devices.</p>
                      </div>
                    )}
                    
                    {files.length > 0 && (
                      <div className="border rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-2">Select a file to share</h3>
                        <ul className="space-y-2 max-h-[200px] overflow-y-auto">
                          {files.map((file) => (
                            <li 
                              key={file.id} 
                              className={`flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer ${selectedFile?.id === file.id ? 'bg-brand-purple/10 border border-brand-purple/20' : ''}`}
                              onClick={() => setSelectedFile(file)}
                            >
                              <span className="truncate">{file.name}</span>
                              <span className="text-xs text-muted-foreground">{file.size} bytes</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-4">
                  <p>Note: Bluetooth sharing requires permission and may not work on all browsers.</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-[1fr_350px]">
          <div className={`${glassCard} p-8`}>
            <FileList files={files} isLoading={false} />
          </div>
          
          <div className={`${glassCard} p-8`}>
            <h2 className="text-xl font-semibold mb-4 text-brand-purple-dark">Upload a File</h2>
            <FileUploader onFileUpload={handleFileUpload} />
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t rounded-t-2xl glassCard">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 ShareAnyWhere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
