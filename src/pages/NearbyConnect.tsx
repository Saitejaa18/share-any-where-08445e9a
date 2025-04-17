
import NearbyConnection from "@/components/NearbyConnection";

const NearbyConnect = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple-light to-brand-purple-dark p-4">
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto mb-8">
          <h1 className="text-3xl font-bold text-white text-center mb-4">Connect Nearby</h1>
          <p className="text-white/80 text-center">
            Share files securely with nearby devices using QR codes or PIN codes
          </p>
        </div>
        <NearbyConnection />
      </div>
    </div>
  );
};

export default NearbyConnect;
