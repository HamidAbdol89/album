// pages/manage/[id].js
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Upload, Share2, Calendar, Clock, ExternalLink, Image as ImageIcon, X, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { formatDate, getExpiryDate } from '../../lib/utils';

// Modern Mobile-First Popup Component
const ModernPopup = ({ isOpen, onClose, title, message, actions = [], type = 'success' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative w-full max-w-md transform transition-all duration-300 ease-out">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
          {/* Header với gradient */}
          <div className={`px-6 pt-6 pb-4 ${
            type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
            type === 'warning' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
            'bg-gradient-to-r from-purple-500 to-indigo-600'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  {type === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : type === 'warning' ? (
                    <AlertTriangle className="w-6 h-6 text-white" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-white" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              {message}
            </p>

            {/* Actions */}
            {actions.length > 0 && (
              <div className="space-y-3">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.onClick();
                      if (action.closeAfter) onClose();
                    }}
                    className={`w-full flex items-center justify-center px-6 py-4 rounded-2xl font-semibold text-base transition-all duration-200 transform active:scale-95 ${action.className}`}
                  >
                    {action.icon && <action.icon className="w-5 h-5 mr-3" />}
                    {action.text}
                  </button>
                ))}
              </div>
            )}

            {/* Close button nếu không có actions */}
            {actions.length === 0 && (
              <button
                onClick={onClose}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Toast cho mobile
const QuickToast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-4 right-4 z-40 mx-auto max-w-sm">
      <div className={`rounded-2xl shadow-lg p-4 backdrop-blur-sm ${
        type === 'success' ? 'bg-green-500 bg-opacity-95' : 
        type === 'warning' ? 'bg-amber-500 bg-opacity-95' :
        'bg-red-500 bg-opacity-95'
      } transform transition-all duration-300 ease-out animate-slide-down`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            {type === 'success' && <CheckCircle className="w-5 h-5 text-white" />}
            {type === 'warning' && <AlertTriangle className="w-5 h-5 text-white" />}
          </div>
          <p className="text-white font-medium text-sm flex-1">{message}</p>
          <button
            onClick={onClose}
            className="ml-3 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ManageAlbum() {
  const router = useRouter();
  const { id } = router.query;
  const fileInputRef = useRef(null);
  
  const [albumInfo, setAlbumInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [popup, setPopup] = useState(null);
  const [toast, setToast] = useState(null);
  const [uploadedCount, setUploadedCount] = useState(0);
  
  // URL cho album và QR
  const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (isLocal ? 'http://localhost:3000' : 'https://album-nu-one.vercel.app');
  const albumUrl = `${baseUrl}/view/${id}`;

  // Load thông tin album với fallback
  const loadAlbumInfo = async () => {
    if (!id) return;
    
    try {
      console.log('Loading album info for ID:', id);
      const response = await fetch(`/api/albums/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Album data received:', data);
        
        setAlbumInfo(data);
        
        // Thử nhiều cách để lấy số lượng ảnh
        let photoCount = 0;
        if (data.photos && Array.isArray(data.photos)) {
          photoCount = data.photos.length;
        } else if (data.images && Array.isArray(data.images)) {
          photoCount = data.images.length;
        } else if (data.photoCount !== undefined) {
          photoCount = data.photoCount;
        } else if (data.count !== undefined) {
          photoCount = data.count;
        }
        
        console.log('Final photo count:', photoCount);
        setUploadedCount(photoCount);
      } else {
        console.error('API Error:', response.status, response.statusText);
        
        // Fallback: đọc từ localStorage nếu có
        const savedCount = localStorage.getItem(`album_${id}_count`);
        if (savedCount) {
          setUploadedCount(parseInt(savedCount));
        }
      }
    } catch (err) {
      console.error('Network Error:', err);
      setError('Không thể tải thông tin album');
      
      // Fallback: đọc từ localStorage
      const savedCount = localStorage.getItem(`album_${id}_count`);
      if (savedCount) {
        setUploadedCount(parseInt(savedCount));
      }
    }
  };

  useEffect(() => {
    if (id) {
      console.log('Album ID changed to:', id); // Debug log
      loadAlbumInfo();
    }
  }, [id]);

  // Hiển thị popup sau khi upload thành công
  const showUploadSuccessPopup = (uploadedImageCount) => {
    setPopup({
      isOpen: true,
      title: '🎉 Upload Thành Công!',
      message: `Tuyệt vời! Bạn đã upload thành công ${uploadedImageCount} ảnh vào album. Bây giờ bạn có thể chia sẻ QR Code hoặc đường dẫn album cho mọi người xem nhé!`,
      type: 'success',
      actions: [
        {
          text: 'Tải QR Code',
          icon: Download,
          className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg',
          onClick: downloadQRCode,
          closeAfter: true
        },
        {
          text: 'Sao Chép Đường Dẫn',
          icon: Share2,
          className: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg',
          onClick: copyAlbumLink,
          closeAfter: true
        },
        {
          text: 'Tiếp Tục Upload',
          icon: Upload,
          className: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg',
          onClick: () => fileInputRef.current?.click(),
          closeAfter: true
        }
      ]
    });
  };

  // Upload ảnh - đã sửa logic
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(`Đang upload ${files.length} ảnh...`);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('photos', file);
      });

      const response = await fetch(`/api/albums/${id}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const successCount = data.uploadedCount || files.length;
        
        // Cập nhật số lượng ảnh ngay lập tức và lưu vào localStorage
        setUploadedCount(prev => {
          const newCount = prev + successCount;
          localStorage.setItem(`album_${id}_count`, newCount.toString());
          return newCount;
        });
        setUploadProgress(`Đã upload thành công ${successCount} ảnh!`);
        
        // Load lại thông tin album để đảm bảo sync
        await loadAlbumInfo();
        
        // Hiển thị toast ngay lập tức
        setToast({
          message: `✨ Đã upload ${successCount} ảnh thành công!`,
          type: 'success'
        });
        
        // Hiển thị popup sau 1 giây
        setTimeout(() => {
          showUploadSuccessPopup(successCount);
        }, 1000);
        
        // Xóa progress sau 3 giây
        setTimeout(() => setUploadProgress(''), 3000);
      } else {
        setError(data.message || 'Lỗi upload ảnh');
        setToast({
          message: 'Có lỗi xảy ra khi upload ảnh',
          type: 'warning'
        });
      }
    } catch (err) {
      setError('Lỗi kết nối khi upload ảnh');
      setToast({
        message: 'Lỗi kết nối, vui lòng thử lại',
        type: 'warning'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Download QR code
  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-Album-${id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      setToast({
        message: '📥 Đã tải QR Code thành công!',
        type: 'success'
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  // Copy link
  const copyAlbumLink = async () => {
    try {
      await navigator.clipboard.writeText(albumUrl);
      setToast({
        message: '📋 Đã sao chép đường dẫn!',
        type: 'success'
      });
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = albumUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setToast({
        message: '📋 Đã sao chép đường dẫn!',
        type: 'success'
      });
    }
  };

  if (!id) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Quản Lý Album - {id}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      {/* Modern Popup */}
      {popup && (
        <ModernPopup
          isOpen={popup.isOpen}
          title={popup.title}
          message={popup.message}
          type={popup.type}
          actions={popup.actions}
          onClose={() => setPopup(null)}
        />
      )}

      {/* Quick Toast */}
      {toast && (
        <QuickToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 pb-8">
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Header - Mobile Optimized */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    🎨 Album: {id}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 gap-2 sm:gap-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Công khai: {formatDate(new Date())}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Hết hạn: {formatDate(getExpiryDate(new Date()))}
                    </span>
                  
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/view/${id}`)}
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Xem Album
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Upload Section - Mobile First */}
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  <Upload className="w-5 h-5 inline mr-2" />
                  Upload Ảnh
                </h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all duration-200">
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Chọn nhiều ảnh để upload
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                 <div className="w-full sm:w-auto">
  <button
    onClick={() => fileInputRef.current?.click()}
    disabled={uploading}
    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
  >
    {uploading ? '⏳ Đang Upload...' : '📷 Chọn Ảnh'}
  </button>
  <p className="text-sm text-red-400 mt-1 italic">Tối đa 50MB trên 1 lần upload</p>
</div>

                </div>
                
                {uploadProgress && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-green-700 font-medium">{uploadProgress}</p>
                  </div>
                )}
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}
              </div>

              {/* QR Code Section - Mobile Optimized */}
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  <Share2 className="w-5 h-5 inline mr-2" />
                  Chia Sẻ Album
                </h2>
                
                <div className="text-center">
                  {/* QR Code */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl mb-4 inline-block shadow-inner">
                    <QRCodeSVG
                      id="qr-code"
                      value={albumUrl}
                      size={140}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  
                  {/* Album URL */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Link Album:</p>
                    <div className="bg-gray-50 p-3 rounded-xl border text-xs break-all font-mono">
                      {albumUrl}
                    </div>
                  </div>
                  
                  {/* Action buttons - Mobile Stack */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={downloadQRCode}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Tải QR Code
                    </button>
                    <button
                      onClick={copyAlbumLink}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Sao Chép Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
}