import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper function to resize image
  const resizeImage = (file: File, maxSize: number = 1024, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const aspect = width / height;

        // Scale down if larger than maxSize
        if (width > height) {
          if (width > maxSize) {
            width = maxSize;
            height = width / aspect;
          }
        } else {
          if (height > maxSize) {
            height = maxSize;
            width = height * aspect;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg', // Or 'image/webp' for better compression
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImage = async (
    file: File, 
    folder: 'products' | 'avatars' = 'products'
  ): Promise<string | null> => {
    setUploading(true)
    setError(null)

    try {
      // Resize the image first
      const resizedBlob = await resizeImage(file);

      // Determine bucket based on folder
      const bucketName = folder === 'avatars' ? 'avatars' : 'product-images';

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload resized blob directly to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, resizedBlob, {
          contentType: 'image/jpeg', // Adjust if using webp
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
}
