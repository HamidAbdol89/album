// lib/utils.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Tạo ID ngẫu nhiên cho album
export function generateAlbumId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Kiểm tra album có hết hạn không
export function isAlbumExpired(publicDate) {
  if (!publicDate) return false;
  
  const currentDate = new Date();
  const expireDate = new Date(publicDate);
  expireDate.setMonth(expireDate.getMonth() + 2); // Thêm 2 tháng
  
  return currentDate > expireDate;
}

// Format ngày tháng
export function formatDate(date) {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Tính ngày hết hạn
export function getExpiryDate(publicDate) {
  const expiry = new Date(publicDate);
  expiry.setMonth(expiry.getMonth() + 2); // Thêm 2 tháng
  return expiry;
}