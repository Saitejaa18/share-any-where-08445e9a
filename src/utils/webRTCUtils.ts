
import { supabase } from "@/integrations/supabase/client";
import { FileUploadResult } from "@/services/fileService";
import { toast } from "@/hooks/use-toast";

interface PeerConnection {
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  deviceId: string;
}

interface TransferProgress {
  total: number;
  received: number;
  percentage: number;
}

type TransferStatusCallback = (status: string, progress?: TransferProgress) => void;

const connections: Record<string, PeerConnection> = {};
const chunkSize = 16384; // 16KB chunks for file transfer

let localDeviceId: string | null = null;

// Generate a unique device ID for the current browser
export const getLocalDeviceId = (): string => {
  if (localDeviceId) return localDeviceId;
  
  const storedId = localStorage.getItem('deviceId');
  if (storedId) {
    localDeviceId = storedId;
    return storedId;
  }
  
  const newId = Math.random().toString(36).substring(2, 10);
  localStorage.setItem('deviceId', newId);
  localDeviceId = newId;
  return newId;
};

// Generate a friendly device name
export const getDeviceName = (): string => {
  const browserInfo = navigator.userAgent;
  let deviceName = 'Unknown Device';
  
  if (browserInfo.includes('iPhone') || browserInfo.includes('iPad')) {
    deviceName = browserInfo.includes('iPhone') ? 'iPhone' : 'iPad';
  } else if (browserInfo.includes('Android')) {
    deviceName = 'Android Device';
  } else if (browserInfo.includes('Mac')) {
    deviceName = 'Mac';
  } else if (browserInfo.includes('Windows')) {
    deviceName = 'Windows PC';
  } else if (browserInfo.includes('Linux')) {
    deviceName = 'Linux Device';
  }
  
  return `${deviceName} (${getLocalDeviceId()})`;
};

// Initialize WebRTC and Supabase Realtime signaling
export const initWebRTC = async () => {
  const channel = supabase.channel(`webrtc-signaling-${getLocalDeviceId()}`, {
    config: {
      broadcast: { self: true }
    }
  });

  channel
    .on('broadcast', { event: 'offer' }, async (payload) => {
      if (payload.payload.targetDeviceId !== getLocalDeviceId()) return;
      
      console.log('Received offer', payload);
      const { offer, senderDeviceId } = payload.payload;
      await handleOffer(offer, senderDeviceId);
    })
    .on('broadcast', { event: 'answer' }, async (payload) => {
      if (payload.payload.targetDeviceId !== getLocalDeviceId()) return;
      
      console.log('Received answer', payload);
      const { answer, senderDeviceId } = payload.payload;
      await handleAnswer(answer, senderDeviceId);
    })
    .on('broadcast', { event: 'ice-candidate' }, async (payload) => {
      if (payload.payload.targetDeviceId !== getLocalDeviceId()) return;
      
      console.log('Received ICE candidate', payload);
      const { candidate, senderDeviceId } = payload.payload;
      await handleIceCandidate(candidate, senderDeviceId);
    })
    .on('broadcast', { event: 'device-announcement' }, (payload) => {
      console.log('Device announced itself:', payload.payload.deviceName);
      // This event is just for device discovery
    })
    .subscribe();

  // Announce this device to the network
  await channel.send({
    type: 'broadcast',
    event: 'device-announcement',
    payload: {
      deviceId: getLocalDeviceId(),
      deviceName: getDeviceName(),
      timestamp: new Date().toISOString()
    }
  });

  return channel;
};

// Create a WebRTC peer connection to a target device
export const createPeerConnection = async (targetDeviceId: string): Promise<RTCPeerConnection> => {
  // Create a new peer connection if one doesn't exist
  if (!connections[targetDeviceId]) {
    const connection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });
    
    connections[targetDeviceId] = {
      connection,
      deviceId: targetDeviceId
    };
    
    // Set up ICE candidate handling
    connection.onicecandidate = async (event) => {
      if (event.candidate) {
        // Send ICE candidate to peer
        await supabase.channel(`webrtc-signaling-${targetDeviceId}`).send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: {
            senderDeviceId: getLocalDeviceId(),
            targetDeviceId,
            candidate: event.candidate
          }
        });
      }
    };
    
    // Connection state changes
    connection.onconnectionstatechange = () => {
      console.log(`Connection state changed: ${connection.connectionState}`);
    };
  }
  
  return connections[targetDeviceId].connection;
};

// Handle incoming WebRTC offer
export const handleOffer = async (offer: RTCSessionDescriptionInit, senderDeviceId: string) => {
  const peerConnection = await createPeerConnection(senderDeviceId);
  
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  
  // Send answer back to peer
  await supabase.channel(`webrtc-signaling-${senderDeviceId}`).send({
    type: 'broadcast',
    event: 'answer',
    payload: {
      senderDeviceId: getLocalDeviceId(),
      targetDeviceId: senderDeviceId,
      answer
    }
  });
  
  // Set up data channel for receiving
  peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;
    connections[senderDeviceId].dataChannel = dataChannel;
    setupDataChannelListeners(dataChannel, senderDeviceId);
  };
};

// Handle incoming WebRTC answer
export const handleAnswer = async (answer: RTCSessionDescriptionInit, senderDeviceId: string) => {
  const peerConnection = connections[senderDeviceId]?.connection;
  if (peerConnection) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }
};

// Handle incoming ICE candidate
export const handleIceCandidate = async (candidate: RTCIceCandidateInit, senderDeviceId: string) => {
  const peerConnection = connections[senderDeviceId]?.connection;
  if (peerConnection) {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }
};

// Discover nearby devices using Supabase Realtime
export const discoverDevices = async (): Promise<{ deviceId: string; deviceName: string }[]> => {
  const devices: { deviceId: string; deviceName: string }[] = [];
  const localId = getLocalDeviceId();
  
  // Create a channel for device discovery
  const discoveryChannel = supabase.channel('device-discovery', {
    config: {
      broadcast: { self: false }
    }
  });
  
  // Create a promise to wait for responses
  const discoveryPromise = new Promise<{ deviceId: string; deviceName: string }[]>((resolve) => {
    // Set a timeout to resolve after a reasonable discovery period
    setTimeout(() => {
      discoveryChannel.unsubscribe();
      resolve(devices);
    }, 5000);
    
    // Listen for device announcements
    discoveryChannel
      .on('broadcast', { event: 'device-discovery-response' }, (payload) => {
        const { deviceId, deviceName } = payload.payload;
        if (deviceId !== localId) {
          devices.push({ deviceId, deviceName });
        }
      })
      .subscribe();
  });
  
  // Send a discovery request
  await discoveryChannel.send({
    type: 'broadcast',
    event: 'device-discovery-request',
    payload: { requesterId: localId }
  });
  
  // Listen for discovery requests and respond
  const responseChannel = supabase.channel('device-discovery-response', {
    config: {
      broadcast: { self: false }
    }
  });
  
  responseChannel
    .on('broadcast', { event: 'device-discovery-request' }, async (payload) => {
      const requesterId = payload.payload.requesterId;
      if (requesterId !== localId) {
        await responseChannel.send({
          type: 'broadcast',
          event: 'device-discovery-response',
          payload: {
            deviceId: localId,
            deviceName: getDeviceName()
          }
        });
      }
    })
    .subscribe();
  
  return discoveryPromise;
};

// Initialize connection to a peer for sending a file
export const initiateSendFile = async (targetDeviceId: string): Promise<RTCDataChannel> => {
  const peerConnection = await createPeerConnection(targetDeviceId);
  
  // Create a data channel
  const dataChannel = peerConnection.createDataChannel(`file-transfer-${Date.now()}`);
  connections[targetDeviceId].dataChannel = dataChannel;
  
  setupDataChannelListeners(dataChannel, targetDeviceId);
  
  // Create and send offer
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  
  await supabase.channel(`webrtc-signaling-${targetDeviceId}`).send({
    type: 'broadcast',
    event: 'offer',
    payload: {
      senderDeviceId: getLocalDeviceId(),
      targetDeviceId,
      offer
    }
  });
  
  return dataChannel;
};

// Set up event listeners for a data channel
const setupDataChannelListeners = (dataChannel: RTCDataChannel, peerId: string) => {
  let receivedSize = 0;
  let fileSize = 0;
  let fileName = '';
  let fileType = '';
  let fileChunks: Blob[] = [];
  let onStatusCallback: TransferStatusCallback | null = null;
  
  dataChannel.onopen = () => {
    console.log(`Data channel is open to ${peerId}`);
  };
  
  dataChannel.onclose = () => {
    console.log(`Data channel is closed to ${peerId}`);
  };
  
  dataChannel.onerror = (error) => {
    console.error(`Data channel error: ${error}`);
    if (onStatusCallback) {
      onStatusCallback('error', undefined);
    }
  };
  
  dataChannel.onmessage = (event) => {
    const data = event.data;
    
    if (typeof data === 'string') {
      // This is metadata
      const metadata = JSON.parse(data);
      if (metadata.type === 'file-info') {
        fileSize = metadata.size;
        fileName = metadata.name;
        fileType = metadata.fileType;
        receivedSize = 0;
        fileChunks = [];
        
        if (onStatusCallback) {
          onStatusCallback('started', {
            total: fileSize,
            received: 0,
            percentage: 0
          });
        }
      } else if (metadata.type === 'file-complete') {
        // All chunks received, reconstruct the file
        const file = new File(fileChunks, fileName, { type: fileType });
        const url = URL.createObjectURL(file);
        
        if (onStatusCallback) {
          onStatusCallback('complete', {
            total: fileSize,
            received: receivedSize,
            percentage: 100
          });
        }
        
        // Create a file object similar to FileUploadResult for consistency
        const fileResult: FileUploadResult = {
          id: `local-${Date.now()}`,
          name: fileName,
          size: fileSize,
          type: fileType,
          url,
          shareableLink: url,
          uploadedAt: new Date().toISOString()
        };
        
        // Trigger download or add to file list based on application needs
        const transferCompleteEvent = new CustomEvent('file-transfer-complete', {
          detail: { file: fileResult }
        });
        window.dispatchEvent(transferCompleteEvent);
      }
    } else {
      // This is a chunk of the file
      fileChunks.push(data);
      receivedSize += data.size;
      
      if (onStatusCallback) {
        onStatusCallback('progress', {
          total: fileSize,
          received: receivedSize,
          percentage: Math.floor((receivedSize / fileSize) * 100)
        });
      }
    }
  };
  
  // Store the data channel in the connection object
  connections[peerId].dataChannel = dataChannel;
};

// Send a file to a peer
export const sendFileToPeer = async (
  file: File,
  targetDeviceId: string,
  onStatus: TransferStatusCallback
): Promise<boolean> => {
  try {
    // Initialize the connection if needed
    let dataChannel: RTCDataChannel;
    if (connections[targetDeviceId]?.dataChannel?.readyState === 'open') {
      dataChannel = connections[targetDeviceId].dataChannel!;
    } else {
      dataChannel = await initiateSendFile(targetDeviceId);
      
      // Wait for the data channel to open
      if (dataChannel.readyState !== 'open') {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Connection timeout'));
          }, 10000);
          
          dataChannel.onopen = () => {
            clearTimeout(timeout);
            resolve();
          };
          
          dataChannel.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Connection error'));
          };
        });
      }
    }
    
    // Send file metadata
    const metadata = {
      type: 'file-info',
      name: file.name,
      size: file.size,
      fileType: file.type
    };
    dataChannel.send(JSON.stringify(metadata));
    
    // Start sending file in chunks
    onStatus('started', { total: file.size, received: 0, percentage: 0 });
    
    // Read the file in chunks and send them
    let offset = 0;
    let sentSize = 0;
    
    const reader = new FileReader();
    
    const readNextChunk = () => {
      const slice = file.slice(offset, offset + chunkSize);
      reader.readAsArrayBuffer(slice);
    };
    
    reader.onload = (e) => {
      if (!e.target?.result) return;
      
      dataChannel.send(new Blob([e.target.result]));
      
      offset += chunkSize;
      sentSize += (e.target.result as ArrayBuffer).byteLength;
      
      // Report progress
      onStatus('progress', {
        total: file.size,
        received: sentSize,
        percentage: Math.floor((sentSize / file.size) * 100)
      });
      
      if (offset < file.size) {
        // More chunks to send
        readNextChunk();
      } else {
        // All chunks sent
        dataChannel.send(JSON.stringify({ type: 'file-complete' }));
        onStatus('complete', {
          total: file.size,
          received: sentSize,
          percentage: 100
        });
      }
    };
    
    reader.onerror = () => {
      onStatus('error');
      return false;
    };
    
    // Start reading the file
    readNextChunk();
    return true;
  } catch (error) {
    console.error('Error sending file:', error);
    onStatus('error');
    return false;
  }
};

// Close all WebRTC connections
export const closeAllConnections = () => {
  Object.values(connections).forEach(({ connection, dataChannel }) => {
    if (dataChannel) {
      dataChannel.close();
    }
    connection.close();
  });
  
  // Clear connections object
  Object.keys(connections).forEach(key => {
    delete connections[key];
  });
};

// Generate a shareable code that can be used to connect directly
export const generateShareableCode = (): string => {
  const deviceId = getLocalDeviceId();
  // Create a shorter version for easier sharing
  return deviceId.substring(0, 6).toUpperCase();
};

// Connect using a shareable code
export const connectUsingCode = async (code: string): Promise<boolean> => {
  try {
    // Convert code to potential device ID format
    const formattedCode = code.toLowerCase();
    
    // Broadcast a connection request with this code
    await supabase.channel('code-connection').send({
      type: 'broadcast',
      event: 'code-connection-request',
      payload: {
        requesterId: getLocalDeviceId(),
        requesterName: getDeviceName(),
        code: formattedCode
      }
    });
    
    // Listen for responses to this specific code
    const listenForResponse = new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false); // No response after timeout
      }, 10000);
      
      const channel = supabase.channel('code-connection-response');
      channel
        .on('broadcast', { event: 'code-connection-response' }, (payload) => {
          const { targetRequesterId, deviceId, deviceName, success } = payload.payload;
          
          if (targetRequesterId === getLocalDeviceId() && success) {
            clearTimeout(timeout);
            channel.unsubscribe();
            
            // Initiate WebRTC connection to this device
            toast({
              title: "Device found",
              description: `Connecting to ${deviceName}...`
            });
            
            initiateSendFile(deviceId)
              .then(() => resolve(true))
              .catch(() => resolve(false));
          }
        })
        .subscribe();
    });
    
    // Also listen for incoming connection requests for my code
    supabase.channel('code-connection-request')
      .on('broadcast', { event: 'code-connection-request' }, async (payload) => {
        const { requesterId, requesterName, code: requestedCode } = payload.payload;
        
        // Check if this request is for my device ID
        if (requestedCode === getLocalDeviceId().substring(0, 6) && requesterId !== getLocalDeviceId()) {
          // Send back a positive response
          await supabase.channel('code-connection-response').send({
            type: 'broadcast',
            event: 'code-connection-response',
            payload: {
              targetRequesterId: requesterId,
              deviceId: getLocalDeviceId(),
              deviceName: getDeviceName(),
              success: true
            }
          });
          
          toast({
            title: "Connection request",
            description: `${requesterName} wants to connect`
          });
        }
      })
      .subscribe();
    
    return await listenForResponse;
  } catch (error) {
    console.error('Error connecting with code:', error);
    return false;
  }
};

// Check if WebRTC is supported in this browser
export const isWebRTCSupported = (): boolean => {
  return !!(
    window.RTCPeerConnection &&
    window.RTCSessionDescription &&
    window.RTCIceCandidate
  );
};
