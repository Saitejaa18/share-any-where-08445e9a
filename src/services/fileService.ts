
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface FileUploadResult {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  shareableLink: string;
  uploadedAt: string;
}

export const uploadFile = async (file: File): Promise<FileUploadResult> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("You must be logged in to upload files");
    }

    // Generate a unique ID for the file
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const filePath = `${session.user.id}/${fileId}.${fileExtension}`;
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, file);
    
    if (uploadError) {
      throw new Error(`Error uploading file: ${uploadError.message}`);
    }
    
    // Generate a share ID (shorter, URL-friendly)
    const shareId = fileId.split('-')[0] + uuidv4().split('-')[0];
    
    // Store file metadata in database
    const { error: dbError } = await supabase
      .from('file_shares')
      .insert({
        user_id: session.user.id,
        filename: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        share_id: shareId
      });
    
    if (dbError) {
      throw new Error(`Error storing file metadata: ${dbError.message}`);
    }
    
    // Create the shareable link
    const shareableLink = `${window.location.origin}/download/${shareId}`;
    
    // Get a URL for the file (valid for a short time)
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(filePath);
    
    return {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: publicUrl,
      shareableLink,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
};

export const getUserFiles = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return [];
    }
    
    const { data: files, error } = await supabase
      .from('file_shares')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return files.map(file => {
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(file.file_path);
      
      return {
        id: file.id,
        name: file.filename,
        size: file.file_size,
        type: file.file_type,
        url: publicUrl,
        shareableLink: `${window.location.origin}/download/${file.share_id}`,
        uploadedAt: file.created_at
      };
    });
  } catch (error) {
    console.error("Error fetching user files:", error);
    throw error;
  }
};

export const getFileByShareId = async (shareId: string) => {
  try {
    const { data: file, error } = await supabase
      .from('file_shares')
      .select('*')
      .eq('share_id', shareId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!file) {
      throw new Error("File not found");
    }
    
    // Increment download counter
    await supabase
      .from('file_shares')
      .update({ downloads: file.downloads + 1 })
      .eq('id', file.id);
    
    // Get the download URL
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(file.file_path);
    
    return {
      id: file.id,
      name: file.filename,
      size: file.file_size,
      type: file.file_type,
      url: publicUrl,
      uploadedAt: file.created_at,
      downloads: file.downloads + 1
    };
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
};
