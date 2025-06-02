import React, { useEffect, useState } from 'react';
import { ImagePlus, QrCode, Calendar, Shield, Zap, Users, ArrowRight, Sparkles, Eye, Download, Star, ChevronDown, Play } from 'lucide-react';
import Link from "next/link";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-indigo-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '60px 60px',
                 transform: `translateY(${scrollY * 0.1}px)`
               }}>
          </div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 py-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo/Icon with Animation */}
            <div className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30 transform group-hover:scale-110 transition-transform duration-500">
                  <ImagePlus className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>
              
              {/* Animated Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-blue-200/50 rounded-full text-blue-700 text-sm font-semibold mb-8 shadow-lg transform transition-all duration-1000 hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`} style={{transitionDelay: '200ms'}}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Star className="w-4 h-4 fill-current" />
                <span>Hoàn toàn miễn phí • 4.9/5 ⭐</span>
              </div>
            </div>
            
            {/* Enhanced Heading */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '400ms'}}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 mb-6 leading-[0.9] tracking-tight">
                <span className="block">Album Ảnh</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient-x">
                  Thông Minh
                </span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-600 mt-2">
                  Với Mã QR
                </span>
              </h1>
            </div>
            
            {/* Enhanced Description */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '600ms'}}>
              <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
                Tạo album ảnh trong <span className="text-blue-600 font-bold">vài giây</span>, chia sẻ bằng mã QR, 
                <br className="hidden sm:block" />
                tự động bảo mật. Hoàn hảo cho mọi <span className="text-indigo-600 font-bold">khoảnh khắc đáng nhớ</span>.
              </p>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '800ms'}}>
              {/* Link Tạo Album Ngay */}
  <Link
    href="/create"
    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative flex items-center justify-center">
      <span>Tạo Album Ngay</span>
      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
    </div>
    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
  </Link>

  {/* Link Xem Demo */}
  <Link
    href="/demo"
    className="group px-8 py-4 bg-white/80 backdrop-blur-md border-2 border-slate-200 text-slate-700 rounded-2xl hover:bg-white hover:border-slate-300 hover:shadow-xl transition-all duration-300 font-bold text-lg transform hover:scale-105 flex items-center justify-center"
  >
    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
    <span>Xem Demo</span>
  </Link>
</div>

            {/* Scroll Indicator */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '1000ms'}}>
              <div className="flex flex-col items-center text-slate-400">
                <span className="text-sm font-medium mb-2">Khám phá thêm</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-20 lg:py-32 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full text-blue-700 text-sm font-bold mb-6 shadow-md">
              <Zap className="w-4 h-4" />
              <span>Tính năng vượt trội</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
              Được Thiết Kế Cho
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Trải Nghiệm Tuyệt Vời
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto font-medium">
              Mọi tính năng đều được <span className="text-blue-600 font-bold">tối ưu hóa hoàn hảo</span> để mang lại sự tiện lợi và bảo mật tối đa
            </p>
          </div>
          
          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: QrCode,
                title: "Mã QR Siêu Thông Minh",
                description: "Tự động tạo mã QR độc quyền với thiết kế đẹp mắt. Hỗ trợ tải về PNG/SVG chất lượng 4K để in ấn chuyên nghiệp.",
                color: "blue",
                gradient: "from-blue-500 via-blue-600 to-indigo-600",
                bgGradient: "from-blue-50 to-indigo-50"
              },
              {
                icon: Calendar,
                title: "Lên Lịch Thông Minh",
                description: "Đặt thời gian công khai linh hoạt, tự động thông báo hết hạn, bảo vệ quyền riêng tư với AI Security.",
                color: "indigo",
                gradient: "from-indigo-500 via-indigo-600 to-purple-600",
                bgGradient: "from-indigo-50 to-purple-50"
              },
              {
                icon: Zap,
                title: "Upload Tốc Độ Ánh Sáng",
                description: "Kéo thả đa file, nén thông minh giảm 80% dung lượng, upload song song siêu tốc với CDN toàn cầu.",
                color: "emerald",
                gradient: "from-emerald-500 via-emerald-600 to-teal-600",
                bgGradient: "from-emerald-50 to-teal-50"
              },
              {
                icon: Shield,
                title: "Bảo Mật Quân Sự",
                description: "Mã hóa AES-256, ID 256-bit chống brute-force, auto-delete với blockchain verification, GDPR compliant.",
                color: "purple",
                gradient: "from-purple-500 via-purple-600 to-pink-600",
                bgGradient: "from-purple-50 to-pink-50"
              },
              {
                icon: Users,
                title: "Cộng Tác Thông Minh",
                description: "Real-time collaboration, AI duplicate detection, auto-organize theo khuôn mặt, gắn tag thông minh GPS.",
                color: "rose",
                gradient: "from-rose-500 via-rose-600 to-pink-600",
                bgGradient: "from-rose-50 to-pink-50"
              },
              {
                icon: ImagePlus,
                title: "UX/UI Đẳng Cấp",
                description: "Responsive perfect, lazy loading thông minh, gesture control, AR preview, dark mode adaptive cực mượt.",
                color: "amber",
                gradient: "from-amber-500 via-orange-500 to-red-500",
                bgGradient: "from-amber-50 to-orange-50"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                {/* Hover Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105`}></div>
                
                {/* Main Card */}
                <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 hover:border-slate-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/30 transform hover:-translate-y-2 group">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-slate-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium group-hover:text-slate-700 transition-colors">
                    {feature.description}
                  </p>
                  
                  {/* Hover Effect Arrow */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2 mt-4">
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced How it Works */}
      <div className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M50 50m-25 0a25 25 0 1 1 50 0a25 25 0 1 1 -50 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '100px 100px'
             }}>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-full text-slate-700 text-sm font-bold mb-6 shadow-lg">
              <ArrowRight className="w-4 h-4" />
              <span>Quy trình siêu đơn giản</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
              Chỉ Cần 3 Bước
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Thành Công Hoàn Hảo
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto font-medium">
              Từ <span className="text-blue-600 font-bold">ý tưởng</span> đến <span className="text-purple-600 font-bold">viral</span> chỉ trong <span className="text-indigo-600 font-bold">30 giây</span>
            </p>
          </div>
          
          {/* Enhanced Steps */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: "01",
                  title: "Tạo Album Thần Tốc",
                  description: "Nhập tên album và chọn ngày bắt đầu. AI tự động tạo ID bảo mật chuẩn quân sự và mã QR nghệ thuật trong 0.3 giây.",
                  color: "from-blue-500 via-blue-600 to-indigo-600",
                  bgColor: "from-blue-50 to-indigo-50",
                  icon: ImagePlus
                },
                {
                  step: "02", 
                  title: "Upload & Viral",
                  description: "Kéo thả ảnh siêu mượt, AI tự động tối ưu chất lượng 4K, tạo QR code đẹp long lanh để chia sẻ khắp nơi.",
                  color: "from-indigo-500 via-purple-500 to-purple-600",
                  bgColor: "from-indigo-50 to-purple-50",
                  icon: Zap
                },
                {
                  step: "03",
                  title: "Thưởng Thức & Bảo Mật",
                  description: "Mọi người tham gia đóng góp ảnh real-time, AI tự động sắp xếp theo thời gian, bảo mật tuyệt đối sau 30 ngày.",
                  color: "from-purple-500 via-pink-500 to-pink-600",
                  bgColor: "from-purple-50 to-pink-50",
                  icon: Shield
                }
              ].map((step, index) => (
                <div key={index} className="relative group">
                  {/* Connection Line */}
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-20 left-full w-12 z-10">
                      <div className="h-0.5 bg-gradient-to-r from-slate-300 via-blue-300 to-transparent"></div>
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>
                  )}
                  
                  {/* Step Card */}
                  <div className="relative">
                    {/* Hover Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.bgColor} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105`}></div>
                    
                    <div className="relative bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-3xl p-8 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/30 transition-all duration-500 transform hover:-translate-y-3 group">
                      {/* Step Number */}
                      <div className="relative mb-6">
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                        <div className={`relative w-20 h-20 bg-gradient-to-br ${step.color} text-white rounded-2xl flex items-center justify-center mx-auto text-2xl font-black shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                          {step.step}
                        </div>
                      </div>
                      
                      {/* Step Icon */}
                      <div className="flex justify-center mb-4">
                        <step.icon className="w-8 h-8 text-slate-600 group-hover:text-slate-800 transform group-hover:scale-110 transition-all duration-300" />
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-900 mb-4 text-center group-hover:text-slate-800 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 text-center leading-relaxed font-medium group-hover:text-slate-700 transition-colors">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Final CTA */}
      <div className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 via-purple-600 to-pink-600 rounded-[2rem] lg:rounded-[3rem] p-12 lg:p-20 text-center text-white">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 transform -skew-x-12 animate-pulse"></div>
              <div className="absolute inset-0" 
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                     backgroundSize: '60px 60px'
                   }}>
              </div>
            </div>
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white/95 text-sm font-bold mb-8 transform hover:scale-105 transition-transform duration-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <Sparkles className="w-4 h-4" />
                <span>Hoàn toàn miễn phí • Không giới hạn</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                <span className="block">Sẵn Sàng Tạo Ra</span>
                <span className="block">Điều Kỳ Diệu?</span>
              </h2>
              
              <p className="text-xl sm:text-2xl mb-12 opacity-95 max-w-3xl mx-auto font-medium leading-relaxed">
                Tham gia <span className="font-black text-yellow-300">50,000+</span> người dùng đã tin tưởng và tạo ra 
                <span className="font-black text-yellow-300"> 1 triệu+</span> album tuyệt đẹp
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="group relative px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    <span>Tạo Album Ngay</span>
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
                
            
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '40px 40px'
             }}>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <ImagePlus className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-4">Album Ảnh Thông Minh</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Tạo và chia sẻ album ảnh với mã QR thông minh, 
              bảo mật tuyệt đối và trải nghiệm người dùng hoàn hảo.
            </p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-6 mb-8">
              {[
                { name: 'Facebook', href: '#', icon: '📘' },
                { name: 'Instagram', href: '#', icon: '📷' },
                { name: 'Twitter', href: '#', icon: '🐦' },
                { name: 'LinkedIn', href: '#', icon: '💼' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="group w-12 h-12 bg-slate-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-600 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
            
            {/* Footer Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-center md:text-left max-w-4xl mx-auto">
              <div>
                <h4 className="font-bold text-white mb-4">Sản Phẩm</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Tạo Album</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Mã QR</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Chia Sẻ</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Bảo Mật</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-4">Hỗ Trợ</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Trung Tâm Trợ Giúp</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Hướng Dẫn</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">FAQ</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Liên Hệ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-4">Công Ty</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Về Chúng Tôi</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Blog</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Tin Tức</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Tuyển Dụng</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-4">Pháp Lý</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Điều Khoản</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Bảo Mật</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Cookie</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">GDPR</a></li>
                </ul>
              </div>
            </div>
            
            {/* Footer Bottom */}
            <div className="border-t border-slate-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-slate-400 mb-4 md:mb-0">
                  <p>© 2025 Album Ảnh Thông Minh phát triển bởi ABDOL HAMID.</p>
                </div>
                <div className="flex items-center space-x-4 text-slate-400">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Hệ thống hoạt động bình thường
                  </span>
                  <span>•</span>
                  <span>Phiên bản 1.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}