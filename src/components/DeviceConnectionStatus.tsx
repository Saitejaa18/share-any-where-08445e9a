
import { BluetoothConnected, BluetoothOff } from "lucide-react";

interface DeviceConnectionStatusProps {
  isBluetoothAvailable: boolean;
}

export const DeviceConnectionStatus = ({ isBluetoothAvailable }: DeviceConnectionStatusProps) => (
  <div className={`flex items-center gap-2 ${isBluetoothAvailable ? "text-brand-purple" : "text-gray-400"}`}>
    {isBluetoothAvailable ? (
      <>
        <BluetoothConnected size={16} />
        <span className="text-sm">Bluetooth Available</span>
      </>
    ) : (
      <>
        <BluetoothOff size={16} />
        <span className="text-sm">Bluetooth Not Available</span>
      </>
    )}
  </div>
);
