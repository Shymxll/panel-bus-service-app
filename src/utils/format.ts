import { format as dateFnsFormat, parseISO } from 'date-fns';
import { DATE_FORMATS } from '@/config/constants';

/**
 * Format date to display format
 */
export const formatDate = (date: string | Date, formatStr: string = DATE_FORMATS.display): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateFnsFormat(dateObj, formatStr);
  } catch {
    return '';
  }
};

/**
 * Format date with time
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, DATE_FORMATS.displayWithTime);
};

/**
 * Format date for API
 */
export const formatDateForAPI = (date: Date): string => {
  return dateFnsFormat(date, DATE_FORMATS.api);
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format: +994 XX XXX XX XX
  if (cleaned.startsWith('994')) {
    const match = cleaned.match(/^994(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+994 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
  }
  
  return phone;
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

