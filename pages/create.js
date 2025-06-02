// pages/create.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Calendar, ImagePlus, QrCode } from 'lucide-react';

export default function CreateAlbum() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    publicDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/albums/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Chuyển đến trang quản lý album
        router.push(`/manage/${data.album.id}`);
      } else {
        setError(data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Lấy ngày hiện tại để làm min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <Head>
        <title>Tạo Album Ảnh Mới</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ImagePlus className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Tạo Album Ảnh Mới
              </h1>
              <p className="text-gray-600">
                Tạo album để chia sẻ những khoảnh khắc đáng nhớ
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tên album */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Album *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ví dụ: Kỷ niệm 20/10/2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Ngày công khai */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Ngày Bắt Đầu Công Khai *
                </label>
                <input
                  type="date"
                  name="publicDate"
                  value={formData.publicDate}
                  onChange={handleChange}
                  min={today}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Album sẽ tự động hết hạn sau 1 tháng kể từ ngày này
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.publicDate}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang tạo...' : 'Tạo Album'}
              </button>
            </form>

            {/* Features */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Tính năng của Album:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <QrCode className="w-4 h-4 mr-2 text-indigo-600" />
                  Mã QR để chia sẻ dễ dàng
                </li>
                <li className="flex items-center">
                  <ImagePlus className="w-4 h-4 mr-2 text-indigo-600" />
                  Upload ảnh sau khi tạo album
                </li>
                <li className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                  Tự động hết hạn sau 1 tháng
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}