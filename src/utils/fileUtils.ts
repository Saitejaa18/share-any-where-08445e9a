
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const transferFile = async (file: File, targetDevice: string): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`Transferring file ${file.name} (${formatFileSize(file.size)}) to device ${targetDevice}`);
    
    // In a real implementation, here you would use WebRTC, Web Bluetooth, 
    // or other technologies to transfer the file to another device
    
    // Simulate successful transfer after some time
    // In reality, this would involve chunking the file,
    // establishing a connection, and monitoring transfer progress
    setTimeout(() => {
      console.log(`File transfer complete: ${file.name}`);
      resolve(true);
    }, 3000);
  });
};
