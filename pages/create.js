// pages/create.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Calendar, ImagePlus, QrCode, Camera } from 'lucide-react';

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
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-lg mx-auto">
            
            {/* Main Card */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              
              {/* Header */}
              <div className="text-center px-8 py-10">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                    <ImagePlus className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                  Tạo Album Mới
                </h1>
                <p className="text-gray-300 text-lg">
                  Lưu giữ những khoảnh khắc đẹp nhất
                </p>
              </div>

              {/* Form */}
              <div className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Album Title */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-200 tracking-wide">
                      TÊN ALBUM
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ví dụ: Kỷ niệm ngày cưới"
                        className="w-full px-5 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 group-hover:border-white/30"
                        required
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Public Date */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-200 tracking-wide flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                      NGÀY CÔNG KHAI
                    </label>
                    <div className="relative group">
                      <input
                        type="date"
                        name="publicDate"
                        value={formData.publicDate}
                        onChange={handleChange}
                        min={today}
                        className="w-full px-5 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 group-hover:border-white/30 [color-scheme:dark]"
                        required
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    <div className="flex items-start space-x-3 bg-blue-500/10 border border-blue-400/20 rounded-xl p-4">
                      <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <p className="text-sm text-blue-200">
                        Album sẽ tự động hết hạn sau 1 tháng kể từ ngày bạn chọn
                      </p>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-4 backdrop-blur-sm">
                      <p className="text-red-300 font-medium flex items-center">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !formData.title || !formData.publicDate}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <ImagePlus className="w-5 h-5 mr-3" />
                          Tạo Album
                        </>
                      )}
                    </div>
                  </button>
                </form>
              </div>

              {/* Features */}
              <div className="px-8 pb-8">
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-white font-semibold mb-4 text-center">
                    Tính năng nổi bật
                  </h3>
                  <div className="grid gap-3">
                    {[
                      { icon: QrCode, text: 'Chia sẻ qua mã QR', gradient: 'from-cyan-500 to-blue-500' },
                      { icon: ImagePlus, text: 'Ảnh hiện thị siêu đẹp và hiện đại', gradient: 'from-green-500 to-emerald-500' },
                      { icon: Calendar, text: 'Quản lý thời gian tự động', gradient: 'from-orange-500 to-red-500' }
                    ].map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className={`w-10 h-10 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-200 font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}