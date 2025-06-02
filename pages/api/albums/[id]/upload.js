// pages/api/albums/[id]/upload.js
import { db, storage } from '../../../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log('=== UPLOAD API START ===');
  console.log('Method:', req.method);
  console.log('Query params:', req.query);

  if (req.method !== 'POST') {
    console.log('❌ Wrong method:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id: albumId } = req.query;
  console.log('Album ID:', albumId);

  if (!albumId) {
    console.log('❌ Missing album ID');
    return res.status(400).json({ message: 'Album ID is required' });
  }

  try {
    // Kiểm tra Firestore connection
    if (!db) {
      console.error('❌ Firestore db not initialized');
      return res.status(500).json({ message: 'Database not initialized' });
    }

    if (!storage) {
      console.error('❌ Firebase storage not initialized');
      return res.status(500).json({ message: 'Storage not initialized' });
    }

    console.log('✅ Firebase services initialized');

    // Tìm album trong Firestore
    console.log('Searching for album...');
    const albumsRef = collection(db, 'albums');
    const q = query(albumsRef, where('id', '==', albumId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('❌ Album not found:', albumId);
      return res.status(404).json({ message: 'Không tìm thấy album' });
    }

    const albumDoc = querySnapshot.docs[0];
    const albumData = albumDoc.data();
    console.log('✅ Found album:', albumData.title);

    // Parse form data với error handling
    console.log('Parsing form data...');
    const form = new IncomingForm({
      uploadDir: '/tmp', // Sử dụng thư mục tạm
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      multiples: true
    });

    let fields, files;
    try {
      [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            console.error('Form parse error:', err);
            reject(err);
          } else {
            resolve([fields, files]);
          }
        });
      });
    } catch (parseError) {
      console.error('❌ Form parsing failed:', parseError);
      return res.status(400).json({ 
        message: 'Lỗi khi parse form data',
        error: parseError.message 
      });
    }

    console.log('Form fields:', Object.keys(fields));
    console.log('Form files:', Object.keys(files));

    // Kiểm tra files
    if (!files.photos) {
      console.log('❌ No photos in request');
      return res.status(400).json({ message: 'Không có ảnh nào được upload' });
    }

    // Normalize files array
    const uploadedFiles = Array.isArray(files.photos) ? files.photos : [files.photos];
    console.log(`Processing ${uploadedFiles.length} files`);

    const photoUrls = [];
    let successCount = 0;
    let errorCount = 0;

    // Upload từng ảnh lên Firebase Storage
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      console.log(`\n--- Processing file ${i + 1}/${uploadedFiles.length} ---`);
      
      if (!file || !file.filepath) {
        console.log('❌ Invalid file object');
        errorCount++;
        continue;
      }

      try {
        console.log('File info:', {
          originalFilename: file.originalFilename,
          filepath: file.filepath,
          size: file.size,
          mimetype: file.mimetype
        });

        // Kiểm tra file tồn tại
        if (!fs.existsSync(file.filepath)) {
          console.log('❌ File does not exist:', file.filepath);
          errorCount++;
          continue;
        }

        // Đọc file
        console.log('Reading file...');
        const fileBuffer = fs.readFileSync(file.filepath);
        console.log('✅ File read successfully, size:', fileBuffer.length);

        // Tạo tên file unique
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileExt = path.extname(file.originalFilename || '');
        const fileName = `albums/${albumId}/${timestamp}_${randomStr}${fileExt}`;
        
        console.log('Storage path:', fileName);

        // Upload lên Firebase Storage
        console.log('Uploading to Firebase Storage...');
        const storageRef = ref(storage, fileName);
        
        const uploadResult = await uploadBytes(storageRef, fileBuffer, {
          contentType: file.mimetype || 'image/jpeg'
        });
        console.log('✅ Upload successful');

        // Lấy download URL
        console.log('Getting download URL...');
        const downloadURL = await getDownloadURL(storageRef);
        console.log('✅ Download URL obtained');

        photoUrls.push({
          url: downloadURL,
          name: file.originalFilename || `photo_${timestamp}`,
          size: file.size,
          mimetype: file.mimetype,
          uploadedAt: new Date()
        });

        successCount++;

        // Xóa file tạm
        try {
          fs.unlinkSync(file.filepath);
          console.log('✅ Temp file deleted');
        } catch (unlinkError) {
          console.warn('⚠️ Could not delete temp file:', unlinkError.message);
        }

      } catch (fileError) {
        console.error(`❌ Error processing file ${i + 1}:`, fileError);
        errorCount++;
        
        // Vẫn cố gắng xóa file tạm nếu có lỗi
        try {
          if (file.filepath && fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath);
          }
        } catch (unlinkError) {
          console.warn('⚠️ Could not delete temp file after error:', unlinkError.message);
        }
      }
    }

    console.log(`\n=== Upload Summary ===`);
    console.log(`Success: ${successCount}, Errors: ${errorCount}`);

    if (photoUrls.length === 0) {
      return res.status(400).json({ 
        message: 'Không có ảnh nào được upload thành công',
        errors: errorCount
      });
    }

    // Cập nhật album với ảnh mới
    console.log('Updating album in Firestore...');
    const updatedPhotos = [...(albumData.photos || []), ...photoUrls];
    
    await updateDoc(doc(db, 'albums', albumDoc.id), {
      photos: updatedPhotos,
      updatedAt: new Date()
    });

    console.log('✅ Album updated successfully');

    const response = {
      message: `Đã upload ${photoUrls.length} ảnh thành công`,
      photos: photoUrls,
      summary: {
        success: successCount,
        errors: errorCount,
        total: uploadedFiles.length
      }
    };

    console.log('✅ Sending success response');
    res.status(200).json(response);

  } catch (error) {
    console.error('=== UPLOAD API ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Xử lý các loại lỗi cụ thể
    if (error.code === 'storage/unauthorized') {
      return res.status(403).json({
        message: 'Không có quyền upload lên Storage',
        error: 'Storage permission denied'
      });
    }

    if (error.code === 'storage/canceled') {
      return res.status(408).json({
        message: 'Upload bị hủy hoặc timeout',
        error: 'Upload canceled'
      });
    }

    res.status(500).json({ 
      message: 'Lỗi server khi upload ảnh',
      error: error.message,
      code: error.code || 'unknown',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}