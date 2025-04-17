
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { formatFileSize } from "@/utils/fileUtils";

interface FileTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFile: File | null;
  transferProgress: number;
  isTransferring: boolean;
}

export const FileTransferDialog = ({
  open,
  onOpenChange,
  selectedFile,
  transferProgress,
  isTransferring
}: FileTransferDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transferring File</DialogTitle>
          <DialogDescription>
            Sending the selected file to the connected device.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {selectedFile && (
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-blue-500" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(transferProgress)}%</span>
            </div>
            <Progress value={transferProgress} className="h-2" />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isTransferring}>
            {isTransferring ? "Transferring..." : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
