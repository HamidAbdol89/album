// pages/view/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { X, Calendar, Clock, AlertCircle, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function ViewAlbum() {
  const router = useRouter();
  const { id } = router.query;
  
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load album data
  useEffect(() => {
    if (!id) return;
    
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`/api/albums/${id}`);
        const data = await response.json();

        if (response.ok) {
          setAlbum(data.album);
        } else {
          setError(data.message || 'Không thể tải album');
        }
      } catch (err) {
        setError('Lỗi kết nối server');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  // Handle photo modal
  const openPhotoModal = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  // Navigate photos in modal
  const nextPhoto = () => {
    if (currentIndex < album.photos.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedPhoto(album.photos[newIndex]);
    }
  };

  const prevPhoto = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedPhoto(album.photos[newIndex]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedPhoto) return;
      
      if (e.key === 'Escape') closePhotoModal();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPhoto, currentIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Đang tải album...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không Thể Truy Cập Album
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{album?.title || 'Album Ảnh'}</title>
        <meta name="description" content={`Xem album ảnh: ${album?.title}`} />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {album.title}
            </h1>
            <div className="flex items-center justify-center text-sm text-gray-600 space-x-6">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Công khai: {formatDate(album.publicDate)}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {album.photos.length} ảnh
              </span>
            </div>
          </div>

          {/* Photo Grid */}
          {album.photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa Có Ảnh
              </h3>
              <p className="text-gray-600">
                Album này chưa có ảnh nào được upload.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {album.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => openPhotoModal(photo, index)}
                >
                  <Image
                    src={photo.url}
                    alt={photo.name || `Ảnh ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                </div>
              ))}
            </div>
          )}

          {/* Photo Modal */}
          {selectedPhoto && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
              <div className="relative max-w-4xl max-h-full">
                {/* Close button */}
                <button
                  onClick={closePhotoModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Navigation buttons */}
                {currentIndex > 0 && (
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {currentIndex < album.photos.length - 1 && (
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                {/* Photo */}
                <div className="relative max-w-full max-h-full">
                  <Image
                    src={selectedPhoto.url}
                    alt={selectedPhoto.name || 'Ảnh'}
                    width={800}
                    height={600}
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                </div>

                {/* Photo info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded">
                  <p className="text-sm">
                    {currentIndex + 1} / {album.photos.length}
                    {selectedPhoto.name && ` - ${selectedPhoto.name}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}