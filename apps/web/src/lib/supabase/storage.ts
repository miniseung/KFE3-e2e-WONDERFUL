import { createClient } from './client';

const supabase = createClient();

export type StorageBucket = 'auction-images' | 'profile-images';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

//옥션 이미지 업로드
const uploadImage = async (
  file: File,
  bucket: StorageBucket,
  folder?: string
): Promise<UploadResult> => {
  try {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomStr}.${fileExt}`;

    //폴더 경로 생성
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    //업로드 실행
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    //공개 URL 생성
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

//여러 옥션 이미지 업로드
export const uploadMultipleImages = async (
  files: File[],
  bucket: StorageBucket,
  folder?: string
): Promise<UploadResult[]> => {
  const results = await Promise.all(files.map((file) => uploadImage(file, bucket, folder)));
  return results;
};
