
interface DeviceConnectionStatusProps {
  isBluetoothAvailable: boolean;
}

export const DeviceConnectionStatus = ({ isBluetoothAvailable }: DeviceConnectionStatusProps) => (
  <span className={isBluetoothAvailable ? "text-brand-purple" : "text-gray-400"}>
    {isBluetoothAvailable ? (
      <span>&#9679;</span>
    ) : (
      <span>&#9675;</span>
    )}
  </span>
);
