// pages/view/[id].js
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { X, Calendar, Clock, AlertCircle, ImageIcon, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { formatDate } from '../../lib/utils';

// Optimized Image Component with lazy loading and blur
const OptimizedImage = ({ src, alt, fill, width, height, className, sizes, priority = false, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const imageProps = fill 
    ? { fill: true }
    : { width: width || 800, height: height || 600 };

  return (
    <div className="relative w-full h-full">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-100 animate-pulse" />
      )}
      
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          {...imageProps}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes={sizes}
          priority={priority}
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
    </div>
  );
};

// Smart Photo Grid Item với tính toán kích thước tự động
const SmartPhotoGridItem = ({ photo, index, onClick, aspectRatio = 1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [calculatedSize, setCalculatedSize] = useState({ span: 1, rowSpan: 1 });
  const ref = useRef();

  // Tính toán kích thước dựa trên tỷ lệ ảnh thực tế
  const calculateOptimalSize = useCallback((width, height) => {
    const ratio = width / height;
    
    // Định nghĩa các kích thước có thể
    let span = 1;
    let rowSpan = 1;
    
    if (ratio > 1.8) {
      // Ảnh rất rộng - span 2 cột
      span = 2;
      rowSpan = 1;
    } else if (ratio > 1.3) {
      // Ảnh hơi rộng - span 2 cột nhưng cao hơn
      span = 2;
      rowSpan = 1;
    } else if (ratio < 0.7) {
      // Ảnh dọc - span 1 cột, cao 2 hàng
      span = 1;
      rowSpan = 2;
    } else if (ratio < 0.8 && Math.random() > 0.7) {
      // Thỉnh thoảng tạo ảnh vuông lớn
      span = 2;
      rowSpan = 2;
    } else {
      // Ảnh vuông hoặc gần vuông
      span = 1;
      rowSpan = 1;
    }
    
    // Thêm một số biến thể ngẫu nhiên để tránh layout quá đều
    if (index % 7 === 0 && ratio > 0.8 && ratio < 1.2) {
      span = 2;
      rowSpan = 2;
    } else if (index % 11 === 0 && ratio > 1.1) {
      span = 2;
      rowSpan = 1;
    } else if (index % 13 === 0 && ratio < 0.9) {
      span = 1;
      rowSpan = 2;
    }
    
    return { span, rowSpan };
  }, [index]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load image để lấy kích thước thực tế
  useEffect(() => {
    if (isVisible && photo.url) {
      const img = new window.Image();
      img.onload = () => {
        const dimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight
        };
        setImageDimensions(dimensions);
        
        // Tính toán kích thước tối ưu
        const size = calculateOptimalSize(dimensions.width, dimensions.height);
        setCalculatedSize(size);
      };
      img.src = photo.url;
    }
  }, [isVisible, photo.url, calculateOptimalSize]);

  // Dynamic CSS classes dựa trên kích thước tính toán
  const getGridClasses = () => {
    const { span, rowSpan } = calculatedSize;
    return {
      container: `col-span-${span} row-span-${rowSpan}`,
      aspect: imageDimensions.width && imageDimensions.height 
        ? `aspect-[${imageDimensions.width}/${imageDimensions.height}]`
        : 'aspect-square'
    };
  };

  const { container, aspect } = getGridClasses();

  return (
    <div
      ref={ref}
      className={`relative group cursor-pointer ${container} min-h-[120px]`}
      onClick={() => onClick(photo, index)}
      style={{
        // Fallback cho các trường hợp Tailwind không có sẵn class
        gridColumn: `span ${calculatedSize.span}`,
        gridRow: `span ${calculatedSize.rowSpan}`,
      }}
    >
      <div className={`relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] will-change-transform`}>
        {isVisible && (
          <OptimizedImage
            src={photo.url}
            alt={photo.name || `Ảnh cưới ${index + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Floating Elements */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 will-change-transform">
          <Heart className="w-4 h-4 text-white" />
        </div>
        
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 will-change-transform">
          <span className="text-xs font-semibold text-gray-700">{index + 1}</span>
        </div>
      </div>
    </div>
  );
};

// Masonry Layout Component (alternative approach)
const MasonryPhotoGrid = ({ photos, onPhotoClick }) => {
  const [columns, setColumns] = useState(2);
  const [photoColumns, setPhotoColumns] = useState([[], []]);
  const containerRef = useRef();

  // Responsive columns
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      let newColumns = 2;
      
      if (width >= 1280) newColumns = 5;       // xl
      else if (width >= 1024) newColumns = 4;  // lg  
      else if (width >= 768) newColumns = 3;   // md
      else if (width >= 640) newColumns = 2;   // sm
      else newColumns = 2;                     // mobile
      
      setColumns(newColumns);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Distribute photos across columns để cân bằng chiều cao
  useEffect(() => {
    if (!photos.length) return;
    
    const newPhotoColumns = Array.from({ length: columns }, () => []);
    const columnHeights = new Array(columns).fill(0);
    
    photos.forEach((photo, index) => {
      // Tìm cột có chiều cao thấp nhất
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      newPhotoColumns[shortestColumnIndex].push({
        ...photo,
        originalIndex: index
      });
      
      // Estimate height (có thể cải thiện bằng cách load ảnh trước)
      const estimatedHeight = 200 + Math.random() * 100; // Random estimate
      columnHeights[shortestColumnIndex] += estimatedHeight;
    });
    
    setPhotoColumns(newPhotoColumns);
  }, [photos, columns]);

  return (
    <div 
      ref={containerRef}
      className="flex gap-3 sm:gap-4"
      style={{ 
        display: 'flex',
        gap: '1rem'
      }}
    >
      {photoColumns.map((columnPhotos, columnIndex) => (
        <div 
          key={columnIndex} 
          className="flex-1 flex flex-col gap-3 sm:gap-4"
        >
          {columnPhotos.map((photo) => (
            <MasonryPhotoItem
              key={`${photo.url}-${photo.originalIndex}`}
              photo={photo}
              index={photo.originalIndex}
              onClick={onPhotoClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Masonry Photo Item
const MasonryPhotoItem = ({ photo, index, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && photo.url) {
      const img = new window.Image();
      img.onload = () => {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      };
      img.src = photo.url;
    }
  }, [isVisible, photo.url]);

  return (
    <div
      ref={ref}
      className="relative group cursor-pointer"
      onClick={() => onClick(photo, index)}
    >
      <div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] will-change-transform"
        style={{
          aspectRatio: aspectRatio,
          minHeight: '150px'
        }}
      >
        {isVisible && (
          <OptimizedImage
            src={photo.url}
            alt={photo.name || `Ảnh cưới ${index + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Floating Elements */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 will-change-transform">
          <Heart className="w-4 h-4 text-white" />
        </div>
        
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 will-change-transform">
          <span className="text-xs font-semibold text-gray-700">{index + 1}</span>
        </div>
      </div>
    </div>
  );
};

// Modal Navigation Component (unchanged)
const ModalNavigation = ({ currentIndex, totalPhotos, onPrev, onNext, onClose }) => {
  const handlePrev = useCallback(() => {
    requestAnimationFrame(() => onPrev());
  }, [onPrev]);

  const handleNext = useCallback(() => {
    requestAnimationFrame(() => onNext());
  }, [onNext]);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white text-sm font-medium">
              {currentIndex + 1} / {totalPhotos}
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95 will-change-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < totalPhotos - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95 will-change-transform"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default function ViewAlbum() {
  const router = useRouter();
  const { id } = router.query;
  
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagePreloaded, setImagePreloaded] = useState(new Set());
  const [layoutType, setLayoutType] = useState('masonry'); // 'masonry' or 'grid'

  // Optimized album fetching with error handling
  useEffect(() => {
    if (!id) return;
    
    let isMounted = true;
    
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`/api/albums/${id}`);
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok) {
          setAlbum(data.album);
          // Preload first few images
          if (data.album.photos.length > 0) {
            const firstImages = data.album.photos.slice(0, 6);
            firstImages.forEach((photo, idx) => {
              const img = new window.Image();
              img.onload = () => {
                if (isMounted) {
                  setImagePreloaded(prev => new Set([...prev, idx]));
                }
              };
              img.src = photo.url;
            });
          }
        } else {
          setError(data.message || 'Không thể tải album');
        }
      } catch (err) {
        if (isMounted) {
          setError('Lỗi kết nối server');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAlbum();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Photo modal handlers (unchanged)
  const openPhotoModal = useCallback((photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    
    if (album?.photos) {
      const preloadIndices = [index - 1, index + 1].filter(i => i >= 0 && i < album.photos.length);
      preloadIndices.forEach(i => {
        if (!imagePreloaded.has(i)) {
          const img = new window.Image();
          img.onload = () => {
            setImagePreloaded(prev => new Set([...prev, i]));
          };
          img.src = album.photos[i].url;
        }
      });
    }
    
    document.body.style.overflow = 'hidden';
  }, [album?.photos, imagePreloaded]);

  const closePhotoModal = useCallback(() => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  }, []);

  const nextPhoto = useCallback(() => {
    if (!album?.photos || currentIndex >= album.photos.length - 1) return;
    
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedPhoto(album.photos[newIndex]);
    
    const nextNextIndex = newIndex + 1;
    if (nextNextIndex < album.photos.length && !imagePreloaded.has(nextNextIndex)) {
      const img = new window.Image();
      img.onload = () => {
        setImagePreloaded(prev => new Set([...prev, nextNextIndex]));
      };
      img.src = album.photos[nextNextIndex].url;
    }
  }, [album?.photos, currentIndex, imagePreloaded]);

  const prevPhoto = useCallback(() => {
    if (currentIndex <= 0) return;
    
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedPhoto(album.photos[newIndex]);
    
    const prevPrevIndex = newIndex - 1;
    if (prevPrevIndex >= 0 && !imagePreloaded.has(prevPrevIndex)) {
      const img = new window.Image();
      img.onload = () => {
        setImagePreloaded(prev => new Set([...prev, prevPrevIndex]));
      };
      img.src = album.photos[prevPrevIndex].url;
    }
  }, [album?.photos, currentIndex, imagePreloaded]);

  // Keyboard navigation (unchanged)
  useEffect(() => {
    if (!selectedPhoto) return;
    
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'Escape':
          closePhotoModal();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextPhoto();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevPhoto();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPhoto, nextPhoto, prevPhoto, closePhotoModal]);

  // Touch handling (unchanged)
  useEffect(() => {
    if (!selectedPhoto) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!touchStartX || !touchStartY) return;
      
      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;
      
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
        e.preventDefault();
        
        if (diffX > 0) {
          nextPhoto();
        } else {
          prevPhoto();
        }
        
        touchStartX = 0;
        touchStartY = 0;
      }
    };

    const handleTouchEnd = () => {
      touchStartX = 0;
      touchStartY = 0;
    };

    const modalElement = document.querySelector('[data-modal="photo-modal"]');
    if (modalElement) {
      modalElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      modalElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      modalElement.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        modalElement.removeEventListener('touchstart', handleTouchStart);
        modalElement.removeEventListener('touchmove', handleTouchMove);
        modalElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [selectedPhoto, nextPhoto, prevPhoto]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-rose-200 rounded-full animate-spin border-t-rose-500 mx-auto"></div>
            <Heart className="w-6 h-6 text-rose-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-gray-600 font-medium">Đang tải kỷ niệm đẹp...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              Không Thể Truy Cập Album
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

return (
  <>
    <Head>
      <title>{album?.title || 'Album Cưới'}</title>
      <meta name="description" content={`Xem album cưới: ${album?.title}`} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    </Head>
    
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      
      {/* Header */}
      <div className="relative pt-8 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent"></div>
        <div className="relative container mx-auto px-4">
          
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent rounded-full"></div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mb-6 shadow-lg will-change-transform">
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
        {/* Photo Display */}
        {album.photos.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl border border-white/20">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Chưa Có Khoảnh Khắc
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Album này đang chờ những kỷ niệm đẹp được thêm vào.
              </p>
            </div>
          </div>
        ) : layoutType === 'masonry' ? (
          <MasonryPhotoGrid 
            photos={album.photos} 
            onPhotoClick={openPhotoModal} 
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 auto-rows-fr will-change-contents">
            {album.photos.map((photo, index) => (
              <SmartPhotoGridItem
                key={`${photo.url}-${index}`}
                photo={photo}
                index={index}
                onClick={openPhotoModal}
              />
            ))}
          </div>
        )}

        {/* Optimized Photo Modal */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
            data-modal="photo-modal"
          >
            
            <ModalNavigation
              currentIndex={currentIndex}
              totalPhotos={album.photos.length}
              onPrev={prevPhoto}
              onNext={nextPhoto}
              onClose={closePhotoModal}
            />

            {/* Optimized Photo Display */}
            <div className="relative w-full h-full flex items-center justify-center p-4 pt-20 pb-16">
              <div className="relative max-w-4xl max-h-full w-full">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl will-change-transform">
                  <OptimizedImage
                    src={selectedPhoto.url}
                    alt={selectedPhoto.name || 'Ảnh cưới'}
                    width={1200}
                    height={800}
                    className="max-w-full max-h-[calc(100vh-200px)] w-full object-contain"
                    sizes="100vw"
                    priority={true}
                  />
                </div>
              </div>
            </div>

            {/* Optimized Mobile Thumbnails */}
            <div className="absolute bottom-20 left-0 right-0 z-10 px-4 sm:hidden">
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {album.photos.slice(Math.max(0, currentIndex - 2), Math.min(album.photos.length, currentIndex + 3)).map((photo, idx) => {
                  const actualIndex = Math.max(0, currentIndex - 2) + idx;
                  return (
                    <button
                      key={actualIndex}
                      onClick={() => {
                        setCurrentIndex(actualIndex);
                        setSelectedPhoto(album.photos[actualIndex]);
                      }}
                      className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all duration-200 active:scale-95 will-change-transform ${
                        actualIndex === currentIndex ? 'ring-2 ring-white scale-110' : ''
                      }`}
                    >
                      <OptimizedImage
                        src={photo.url}
                        alt=""
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        sizes="48px"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </>
);
}