import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadsDir() {
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
}

export const uploadHandler = async (req, res, next) => {
  await ensureUploadsDir();

  const form = formidable({
    uploadDir: uploadsDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 10,
    filter: function ({ name, originalFilename, mimetype }) {
      // Chỉ cho phép upload ảnh
      return mimetype && mimetype.includes('image');
    },
  });

  try {
    const [fields, files] = await form.parse(req);
    
    // Xử lý files upload
    const uploadedFiles = [];
    const fileArray = Array.isArray(files.images) ? files.images : [files.images].filter(Boolean);
    
    for (const file of fileArray) {
      if (file) {
        // Tạo tên file mới
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const ext = path.extname(file.originalFilename || '');
        const newFileName = `${timestamp}_${randomStr}${ext}`;
        const newPath = path.join(uploadsDir, newFileName);
        
        // Di chuyển file từ temp location
        await fs.rename(file.filepath, newPath);
        
        uploadedFiles.push({
          filename: newFileName,
          originalName: file.originalFilename,
          mimetype: file.mimetype,
          size: file.size,
          url: `/uploads/${newFileName}`
        });
      }
    }
    
    req.uploadedFiles = uploadedFiles;
    req.formFields = fields;
    next();
    
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(400).json({
      success: false,
      message: 'Lỗi khi upload file: ' + error.message
    });
  }
};