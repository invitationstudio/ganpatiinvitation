/* =====================================
   Cloudinary Configuration
   Fixed Version with Security Improvements
===================================== */

export const CLOUDINARY_CLOUD_NAME = "rtl7cgk6";
export const CLOUDINARY_UPLOAD_PRESET = "ganpaticms";

/* =====================================
   File Validation Constants
===================================== */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/m4a", "audio/aac"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const ALLOWED_PDF_TYPES = ["application/pdf"];

/* =====================================
   Validate File Function
===================================== */

export function validateFile(file) {
    
    if (!file) {
        throw new Error("No file selected");
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
    }

    // Check file type
    const allowedTypes = [
        ...ALLOWED_IMAGE_TYPES,
        ...ALLOWED_AUDIO_TYPES,
        ...ALLOWED_VIDEO_TYPES,
        ...ALLOWED_PDF_TYPES
    ];

    if (!allowedTypes.includes(file.type)) {
        throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
    }

    return true;
}

/* =====================================
   Get File Type Category
===================================== */

export function getFileCategory(file) {
    
    if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return "image";
    }
    
    if (ALLOWED_AUDIO_TYPES.includes(file.type)) {
        return "audio";
    }
    
    if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return "video";
    }
    
    if (ALLOWED_PDF_TYPES.includes(file.type)) {
        return "pdf";
    }
    
    return "unknown";
}

/* =====================================
   Universal Upload
   (Images + Audio + PDF + Video)
===================================== */

export async function uploadFile(file) {

    // Validate file before upload
    validateFile(file);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    // Add folder based on file type
    const category = getFileCategory(file);
    
    if (category !== "unknown") {
        formData.append("folder", `ganpati-invitation/${category}`);
    }

    // Show upload progress
    console.log(`Uploading ${category} file:`, file.name, `(${formatFileSize(file.size)})`);

    try {

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) {
            
            const errorData = await response.json().catch(() => null);
            
            const errorMessage = errorData?.error?.message 
                || `Upload failed with status: ${response.status}`;
            
            throw new Error(errorMessage);
        }

        const data = await response.json();

        console.log("Upload successful:", {
            url: data.secure_url,
            format: data.format,
            bytes: data.bytes,
            category: category
        });

        return data.secure_url;

    } catch (error) {

        console.error("Cloudinary Upload Error:", error);
        
        // Re-throw with more context
        throw new Error(`Upload failed: ${error.message}`);
    }
}

/* =====================================
   Upload Multiple Files
===================================== */

export async function uploadMultipleFiles(files, onProgress) {

    if (!files || files.length === 0) {
        throw new Error("No files selected");
    }

    const uploadedUrls = [];
    const total = files.length;

    for (let i = 0; i < total; i++) {

        try {

            const url = await uploadFile(files[i]);
            uploadedUrls.push(url);

            // Call progress callback
            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total: total,
                    percent: Math.round(((i + 1) / total) * 100),
                    file: files[i],
                    url: url
                });
            }

        } catch (error) {

            console.error(`Error uploading file ${i + 1}:`, error);
            
            // Continue with other files, but collect errors
            uploadedUrls.push(null);
            
            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total: total,
                    percent: Math.round(((i + 1) / total) * 100),
                    file: files[i],
                    error: error.message
                });
            }
        }
    }

    return uploadedUrls;
}

/* =====================================
   Delete File from Cloudinary
===================================== */

export async function deleteFile(publicId) {

    if (!publicId) {
        throw new Error("Public ID required");
    }

    try {

        // Note: Cloudinary unsigned delete requires server-side implementation
        // This is a placeholder - implement via your backend server
        
        console.log("Delete request for:", publicId);
        
        // For client-side only, we can't delete without API key
        // Return false to indicate deletion needs server-side handling
        return false;

    } catch (error) {

        console.error("Delete File Error:", error);
        throw error;
    }
}

/* =====================================
   Format File Size Helper
===================================== */

function formatFileSize(bytes) {
    
    if (bytes === 0) return "0 Bytes";
    
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/* =====================================
   Get Cloudinary URL with Transformations
===================================== */

export function getOptimizedUrl(url, options = {}) {

    if (!url) return "";

    // Extract public ID from URL
    const urlParts = url.split("/");
    const publicId = urlParts[urlParts.length - 1].split(".")[0];

    // Build transformation string
    const transformations = [];

    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);

    // Insert transformations into URL
    if (transformations.length > 0) {
        const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
        const fileName = url.substring(url.lastIndexOf("/") + 1);
        
        return `${baseUrl}${transformations.join(",")}/${fileName}`;
    }

    return url;
}

/* =====================================
   Retry Upload with Exponential Backoff
===================================== */

export async function uploadFileWithRetry(file, maxRetries = 3, delay = 1000) {

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            return await uploadFile(file);

        } catch (error) {

            console.warn(`Upload attempt ${attempt} failed:`, error.message);

            if (attempt === maxRetries) {
                throw new Error(`Upload failed after ${maxRetries} attempts: ${error.message}`);
            }

            // Exponential backoff delay
            const waitTime = delay * Math.pow(2, attempt - 1);
            
            console.log(`Retrying in ${waitTime / 1000} seconds...`);
            
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}