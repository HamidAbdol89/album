// pages/manage/[id].js
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Upload, Share2, Calendar, Clock, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { formatDate, getExpiryDate } from '../../lib/utils';

export default function ManageAlbum() {
  const router = useRouter();
  const { id } = router.query;
  const fileInputRef = useRef(null);
  
  const [albumInfo, setAlbumInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  
  // URL cho album và QR
const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (isLocal ? 'http://localhost:3000' : 'https://album-nu-one.vercel.app');

const albumUrl = `${baseUrl}/view/${id}`;


  // Load thông tin album (trong thực tế sẽ fetch từ API)
  const loadAlbumInfo = async () => {
    if (!id) return;
    
    try {
      // Tạm thời dùng dữ liệu giả
      setAlbumInfo({
        id: id,
        title: 'Album Demo',
        publicDate: new Date('2025-06-06'),
        photos: []
      });
    } catch (err) {
      setError('Không thể tải thông tin album');
    }
  };

  // Upload ảnh
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(`Đang upload ${files.length} ảnh...`);

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
        setUploadProgress(`Đã upload thành công ${files.length} ảnh!`);
        // Refresh album info
        await loadAlbumInfo();
        setTimeout(() => setUploadProgress(''), 3000);
      } else {
        setError(data.message || 'Lỗi upload ảnh');
      }
    } catch (err) {
      setError('Lỗi kết nối khi upload ảnh');
    } finally {
      setUploading(false);
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
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  // Copy link
  const copyAlbumLink = async () => {
    try {
      await navigator.clipboard.writeText(albumUrl);
      alert('Đã copy link album!');
    } catch (err) {
      // Fallback cho browser không hỗ trợ clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = albumUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Đã copy link album!');
    }
  };

  if (!id) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>Quản Lý Album - {id}</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Quản Lý Album: {id}
                  </h1>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Công khai: {formatDate(new Date('2025-06-06'))}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Hết hạn: {formatDate(getExpiryDate(new Date('2025-06-06')))}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/view/${id}`)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Xem Album
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Upload Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  <Upload className="w-5 h-5 inline mr-2" />
                  Upload Ảnh
                </h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Chọn ảnh để upload vào album
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploading ? 'Đang Upload...' : 'Chọn Ảnh'}
                  </button>
                </div>
                
                {uploadProgress && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">{uploadProgress}</p>
                  </div>
                )}
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>

              {/* QR Code Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  <Share2 className="w-5 h-5 inline mr-2" />
                  Chia Sẻ Album
                </h2>
                
                <div className="text-center">
                  {/* QR Code */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 inline-block">
                    <QRCodeSVG
                      id="qr-code"
                      value={albumUrl}
                      size={160}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  
                  {/* Album URL */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Link Album:</p>
                    <div className="bg-gray-50 p-2 rounded border text-sm break-all">
                      {albumUrl}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={downloadQRCode}
                      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Tải QR Code
                    </button>
                    <button
                      onClick={copyAlbumLink}
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Thống Kê Album
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-blue-800">Ảnh Đã Upload</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">30</div>
                  <div className="text-sm text-green-800">Ngày Còn Lại</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-purple-800">Lượt Xem</div>
                </div>
              </div>
            </div>
            
            {/* Back button */}
            <div className="text-center mt-6">
              <button
                onClick={() => router.push('/create')}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Tạo Album Khác
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}