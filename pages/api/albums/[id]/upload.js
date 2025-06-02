// pages/api/albums/[id]/upload.js
import { db, storage } from '../../../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id: albumId } = req.query;

  try {
    // Tìm album trong Firestore
    const albumsRef = collection(db, 'albums');
    const q = query(albumsRef, where('id', '==', albumId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'Không tìm thấy album' });
    }

    const albumDoc = querySnapshot.docs[0];
    const albumData = albumDoc.data();

    // Parse form data
    const form = new IncomingForm();
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const uploadedFiles = Array.isArray(files.photos) ? files.photos : [files.photos];
    const photoUrls = [];

    // Upload từng ảnh lên Firebase Storage
    for (const file of uploadedFiles) {
      if (!file) continue;

      const fileBuffer = fs.readFileSync(file.filepath);
      const fileName = `albums/${albumId}/${Date.now()}_${file.originalFilename}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, fileBuffer);
      const downloadURL = await getDownloadURL(storageRef);

      photoUrls.push({
        url: downloadURL,
        name: file.originalFilename,
        uploadedAt: new Date()
      });

      // Xóa file tạm
      fs.unlinkSync(file.filepath);
    }

    // Cập nhật album với ảnh mới
    const updatedPhotos = [...(albumData.photos || []), ...photoUrls];
    await updateDoc(doc(db, 'albums', albumDoc.id), {
      photos: updatedPhotos,
      updatedAt: new Date()
    });

    res.status(200).json({
      message: `Đã upload ${photoUrls.length} ảnh thành công`,
      photos: photoUrls
    });

  } catch (error) {
    console.error('Error uploading photos:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi upload ảnh',
      error: error.message 
    });
  }
}