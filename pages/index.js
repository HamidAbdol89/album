// pages/index.js
import Head from 'next/head';
import Link from 'next/link';

import { ImagePlus, QrCode, Calendar, Shield, Zap, Users } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Head>
        <title>Hệ Thống Album Ảnh QR</title>
        <meta name="description" content="Tạo album ảnh với mã QR, chia sẻ dễ dàng và bảo mật" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImagePlus className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Album Ảnh
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                  Với Mã QR
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Tạo album ảnh đơn giản, chia sẻ bằng mã QR, tự động hết hạn sau 1 tháng. 
                Hoàn hảo cho sự kiện, tiệc cưới, và những khoảnh khắc đáng nhớ.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/create"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Tạo Album Mới
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 font-semibold text-lg"
              >
                Xem Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tính Năng Nổi Bật
            </h2>
            <p className="text-gray-600 text-lg">
              Hệ thống được thiết kế đơn giản nhưng đầy đủ tính năng
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Mã QR Tự Động
              </h3>
              <p className="text-gray-600">
                Tự động tạo mã QR cho mỗi album, có thể tải về và in ra để chia sẻ dễ dàng.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Lên Lịch Công Khai
              </h3>
              <p className="text-gray-600">
                Đặt ngày bắt đầu công khai album, tự động hết hạn sau 1 tháng để bảo vệ quyền riêng tư.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Upload Dễ Dàng
              </h3>
              <p className="text-gray-600">
                Upload nhiều ảnh cùng lúc, hỗ trợ drag & drop, tự động tối ưu hóa kích thước.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Bảo Mật Cao
              </h3>
              <p className="text-gray-600">
                Mỗi album có ID riêng biệt, không thể đoán được. Tự động xóa sau hạn sử dụng.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Chia Sẻ Tập Thể
              </h3>
              <p className="text-gray-600">
                Mọi người có thể upload ảnh vào cùng một album thông qua link hoặc QR code.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <ImagePlus className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Giao Diện Đẹp
              </h3>
              <p className="text-gray-600">
                Hiển thị ảnh dạng lưới, có thể phóng to, điều hướng bằng bàn phím, responsive.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Cách Sử Dụng
              </h2>
              <p className="text-gray-600 text-lg">
                Chỉ 3 bước đơn giản để tạo album và chia sẻ
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Tạo Album
                  </h3>
                  <p className="text-gray-600">
                    Nhập tên album và chọn ngày bắt đầu công khai. Hệ thống sẽ tạo ID duy nhất.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Upload & Chia Sẻ
                  </h3>
                  <p className="text-gray-600">
                    Upload ảnh vào album, tải mã QR và chia sẻ với mọi người.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Thưởng Thức
                  </h3>
                  <p className="text-gray-600">
                    Mọi người có thể xem và thêm ảnh vào album trong thời gian có hiệu lực.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Sẵn Sàng Tạo Album Đầu Tiên?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Bắt đầu ngay với album ảnh thông minh, dễ chia sẻ
            </p>
            <Link
              href="/create"
              className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg"
            >
              Tạo Album Ngay
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              © 2025 Album QR System. Được phát triển với ❤️ bằng Next.js & Firebase
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}