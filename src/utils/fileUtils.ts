
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
    
    // Simulate chunked file transfer for large files
    // This would involve dividing the file into smaller pieces
    // and transmitting them sequentially
    
    const totalSize = file.size;
    const chunkSize = 1024 * 1024; // 1MB chunks
    const totalChunks = Math.ceil(totalSize / chunkSize);
    
    console.log(`File will be sent in ${totalChunks} chunks`);
    
    // In an actual implementation, you would create a loop to read and send each chunk
    // For simulation, we'll just wait a bit longer for larger files
    
    const transferTime = Math.min(3000 + Math.floor(file.size / (1024 * 1024)), 10000); 
    
    setTimeout(() => {
      console.log(`File transfer complete: ${file.name}`);
      resolve(true);
    }, transferTime);
  });
};
