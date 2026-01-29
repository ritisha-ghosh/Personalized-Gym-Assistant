/**
 * File Upload Utilities
 * Handles image uploads, validation, and preview generation
 */

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateImageFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return { valid: false, errors };
  }
  
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    errors.push('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size exceeds 5MB limit (Current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

export const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target.result;
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

export const uploadImageToLocalStorage = async (file, storageKey) => {
  try {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }
    
    const dataURL = await readFileAsDataURL(file);
    localStorage.setItem(storageKey, dataURL);
    
    return {
      success: true,
      url: dataURL,
      message: 'Image uploaded successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getStoredImage = (storageKey) => {
  return localStorage.getItem(storageKey);
};

export const deleteStoredImage = (storageKey) => {
  localStorage.removeItem(storageKey);
  return true;
};
