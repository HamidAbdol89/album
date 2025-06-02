// pages/api/albums/create.js
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { generateAlbumId } from '../../../lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, publicDate } = req.body;

    if (!title || !publicDate) {
      return res.status(400).json({ 
        message: 'Thiếu thông tin bắt buộc (title, publicDate)' 
      });
    }

    const albumId = generateAlbumId();
    
    // Tạo album mới trong Firestore
    const albumData = {
      id: albumId,
      title: title.trim(),
      publicDate: new Date(publicDate),
      createdAt: new Date(),
      updatedAt: new Date(),
      photos: [],
      isActive: true
    };

    const docRef = await addDoc(collection(db, 'albums'), albumData);

    res.status(201).json({
      message: 'Tạo album thành công',
      album: {
        id: albumId,
        docId: docRef.id,
        ...albumData
      }
    });

  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi tạo album',
      error: error.message 
    });
  }
}