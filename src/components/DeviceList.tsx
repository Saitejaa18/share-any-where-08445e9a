
import { Button } from "@/components/ui/button";

interface DeviceListProps {
  devices: BluetoothDevice[];
  highlightedDeviceId: string | null;
  deviceFilter: string;
  connectToDevice: (device: BluetoothDevice) => void;
}

export const DeviceList = ({
  devices,
  highlightedDeviceId,
  deviceFilter,
  connectToDevice
}: DeviceListProps) => {
  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
        <p>No devices found</p>
        <p className="text-xs">Click "Scan for Devices" to discover nearby devices</p>
      </div>
    );
  }

  return (
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
  );
};
