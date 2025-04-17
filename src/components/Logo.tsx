
import { FileUp } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-3 rounded-xl shadow-md">
        <FileUp className="h-8 w-8 text-primary" />
      </div>
      <span className="ml-2 text-2xl font-bold text-white">ShareAnyWhere</span>
    </div>
  );
};
