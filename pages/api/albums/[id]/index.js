// pages/api/albums/[id]/index.js
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { isAlbumExpired } from '../../../../lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    // Kiểm tra trạng thái album
    const currentDate = new Date();
    const publicDate = albumData.publicDate.toDate();
    
    // Chưa đến ngày public
    if (currentDate < publicDate) {
      return res.status(403).json({
        message: 'Album chưa được công khai',
        publicDate: publicDate.toISOString(),
        status: 'not_public'
      });
    }

    // Kiểm tra hết hạn
    const expired = isAlbumExpired(publicDate);
    
    if (expired) {
      return res.status(410).json({
        message: 'Album này đã hết hạn sau 1 tháng',
        expiredAt: publicDate,
        status: 'expired'
      });
    }

    // Trả về thông tin album
    res.status(200).json({
      album: {
        id: albumData.id,
        title: albumData.title,
        publicDate: publicDate.toISOString(),
        createdAt: albumData.createdAt.toDate().toISOString(),
        photos: albumData.photos || [],
        status: 'active'
      }
    });

  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi lấy thông tin album',
      error: error.message 
    });
  }
}