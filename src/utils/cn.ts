// clsx kütüphanesinden ClassValue tipini ve clsx fonksiyonunu import ediyoruz
// clsx, dinamik CSS class string'lerini birleştirmek için kullanılır
import { type ClassValue, clsx } from 'clsx';
// tailwind-merge kütüphanesinden twMerge fonksiyonunu import ediyoruz
// tailwind-merge, Tailwind CSS class'larını birleştirirken çakışmaları çözer
import { twMerge } from 'tailwind-merge';

/**
 * Class Name Birleştirme Yardımcı Fonksiyonu (CN - Class Names)
 * 
 * Bu fonksiyon, Tailwind CSS class'larını birleştirmek için kullanılan bir utility fonksiyonudur.
 * clsx ve tailwind-merge kütüphanelerini birleştirerek optimal class yönetimi sağlar.
 * 
 * Özellikler:
 * - Birden fazla class string, obje veya array'i birleştirebilir
 * - Tailwind CSS class çakışmalarını otomatik olarak çözer (örn: "p-4 p-2" -> "p-2")
 * - Koşullu class'ları destekler (örn: { "bg-red-500": isError })
 * 
 * Kullanım örnekleri:
 * cn("text-lg", "font-bold") -> "text-lg font-bold"
 * cn("p-4", "p-2") -> "p-2" (çakışma çözüldü)
 * cn("text-center", { "text-red-500": isError }) -> koşullu class ekler
 * 
 * @param inputs - Birleştirilecek class değerleri (string, obje, array veya bunların kombinasyonu)
 * @returns Birleştirilmiş ve optimize edilmiş class string'i
 */
export function cn(...inputs: ClassValue[]) {
  // Önce clsx ile tüm class'ları birleştir, sonra tailwind-merge ile çakışmaları çöz
  return twMerge(clsx(inputs));
}

