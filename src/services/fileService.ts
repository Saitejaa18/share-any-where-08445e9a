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
  isLinkActive?: boolean;
  description?: string;
  folder_id?: string;
  expiry_date?: string;
  download_limit?: number;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

export const uploadFile = async (file: File): Promise<FileUploadResult> => {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds the maximum allowed size of 50MB`);
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("You must be logged in to upload files");
    }

    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const filePath = `${session.user.id}/${fileId}.${fileExtension}`;
    
    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, file);
    
    if (uploadError) {
      throw new Error(`Error uploading file: ${uploadError.message}`);
    }
    
    const shareId = fileId.split('-')[0] + uuidv4().split('-')[0];
    
    const { error: dbError } = await supabase
      .from('file_shares')
      .insert({
        user_id: session.user.id,
        filename: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        share_id: shareId,
        is_link_active: true,
        max_downloads: 1,
        downloads: 0
      });
    
    if (dbError) {
      throw new Error(`Error storing file metadata: ${dbError.message}`);
    }
    
    const shareableLink = `${window.location.origin}/download/${shareId}`;
    
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
      uploadedAt: new Date().toISOString(),
      isLinkActive: true
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
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return files.map(file => ({
      id: file.id,
      name: file.filename,
      size: file.file_size,
      type: file.file_type,
      url: supabase.storage.from('files').getPublicUrl(file.file_path).data.publicUrl,
      shareableLink: `${window.location.origin}/download/${file.share_id}`,
      uploadedAt: file.created_at,
      isLinkActive: file.is_link_active
    }));
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
      .eq('is_link_active', true)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!file) {
      throw new Error("File not found or link expired");
    }
    
    const { error: updateError } = await supabase
      .from('file_shares')
      .update({ 
        downloads: file.downloads + 1,
        is_link_active: file.max_downloads > (file.downloads + 1)
      })
      .eq('id', file.id);
    
    if (updateError) {
      console.error("Error updating download count:", updateError);
    }
    
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
      downloads: file.downloads + 1,
      isLinkActive: file.is_link_active
    };
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
};

export const createFolder = async (name: string, description?: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("You must be logged in to create folders");
  }

  const { data, error } = await supabase
    .from('folders')
    .insert({
      name,
      description,
      user_id: session.user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getFolders = async () => {
  const { data: folders, error } = await supabase
    .from('folders')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return folders;
};

export const updateFileMetadata = async (
  fileId: string, 
  updates: {
    description?: string;
    folder_id?: string | null;
    expiry_date?: string | null;
    download_limit?: number;
  }
) => {
  const { data, error } = await supabase
    .from('file_shares')
    .update(updates)
    .eq('id', fileId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
