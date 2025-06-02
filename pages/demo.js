// pages/demo.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { X, Calendar, Image as ImageIcon, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

// Demo data - thay thế bằng ảnh thật của bạn
const demoAlbum = {
  title: "Ngày Cưới Của Chúng Tôi",
  publicDate: "2024-12-15",
  photos: [
    { url: "images/1.jpg", name: "Lễ cưới" },
    { url: "images/2.jpg", name: "Cô dâu chú rể" },
    { url: "images/3.jpg", name: "Hạnh phúc" },
    { url: "images/4.jpg", name: "Khoảnh khắc đẹp" },
    { url: "images/5.jpg", name: "Tiệc cưới" },
    { url: "images/6.jpg", name: "Nụ cười" },
    { url: "images/7.jpg", name: "Tình yêu" },
    { url: "images/8.jpg", name: "Gia đình" },
    { url: "images/9.jpg", name: "Lãng mạn" },
    { url: "images/10.jpg", name: "Kỷ niệm" }
  ]
};

// Utility function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function DemoPage() {
  const [album] = useState(demoAlbum);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
  }, [selectedPhoto, currentIndex, album.photos.length]);

  return (
    <>
      <Head>
        <title>Demo - Album Cưới</title>
        <meta name="description" content="Xem demo album cưới với giao diện đẹp mắt" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
        
        {/* Elegant Header with Floating Effect */}
        <div className="relative pt-8 pb-12">
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent"></div>
          <div className="relative container mx-auto px-4">
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent rounded-full"></div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mb-6 shadow-lg">
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent mb-4 leading-tight">
                {album.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row items-center justify-center text-sm text-gray-600 space-y-2 sm:space-y-0 sm:space-x-8">
                <div className="flex items-center bg-white/50 rounded-full px-4 py-2 backdrop-blur-sm">
                  <Calendar className="w-4 h-4 mr-2 text-rose-500" />
                  <span className="font-medium">Công khai: {formatDate(album.publicDate)}</span>
                </div>
                <div className="flex items-center bg-white/50 rounded-full px-4 py-2 backdrop-blur-sm">
                  <ImageIcon className="w-4 h-4 mr-2 text-pink-500" />
                  <span className="font-medium">{album.photos.length} khoảnh khắc</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-12">
          {/* Photo Grid with Masonry Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {album.photos.map((photo, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => openPhotoModal(photo, index)}
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
                  <Image
                    src={photo.url}
                    alt={photo.name || `Ảnh cưới ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized // Cho phép load ảnh từ external sources
                  />
                  
                  {/* Elegant Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Floating Heart Icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Photo Number Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-xs font-semibold text-gray-700">{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Photo Modal */}
          {selectedPhoto && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
              
              {/* Header Controls */}
              <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent p-4">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                      <span className="text-white text-sm font-medium">
                        {currentIndex + 1} / {album.photos.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={closePhotoModal}
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Photo Container */}
              <div className="relative w-full h-full flex items-center justify-center p-4 pt-20 pb-16">
                
                {/* Navigation Arrows */}
                {currentIndex > 0 && (
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {currentIndex < album.photos.length - 1 && (
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                {/* Photo Display */}
                <div className="relative max-w-4xl max-h-full w-full">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={selectedPhoto.url}
                      alt={selectedPhoto.name || 'Ảnh cưới'}
                      width={1200}
                      height={800}
                      className="max-w-full max-h-[calc(100vh-200px)] w-full object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* Photo Thumbnails Strip (Mobile) */}
              <div className="absolute bottom-20 left-0 right-0 z-10 px-4 sm:hidden">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {album.photos.slice(Math.max(0, currentIndex - 2), Math.min(album.photos.length, currentIndex + 3)).map((photo, idx) => {
                    const actualIndex = Math.max(0, currentIndex - 2) + idx;
                    return (
                      <button
                        key={actualIndex}
                        onClick={() => {
                          setCurrentIndex(actualIndex);
                          setSelectedPhoto(album.photos[actualIndex]);
                        }}
                        className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden ${
                          actualIndex === currentIndex ? 'ring-2 ring-white' : ''
                        }`}
                      >
                        <Image
                          src={photo.url}
                          alt=""
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20 max-w-xs">
          <p className="text-xs text-gray-600">
            <strong>Demo:</strong> Đây là bản xem thử với ảnh mẫu. Bạn có thể thay thế bằng ảnh thật của mình.
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="fixed bottom-4 left-4">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    </>
  );
}