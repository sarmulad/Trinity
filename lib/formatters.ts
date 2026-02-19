/**
 * Utility functions for formatting data
 */

/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - The currency code (default: USD)
 * @param locale - The locale to use (default: en-US)
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format a number with abbreviations (K, M, B, T)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 1)
 */
export function formatNumber(value: number, decimals: number = 1): string {
  if (value === 0) return '0';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e12) {
    return sign + (absValue / 1e12).toFixed(decimals) + 'T';
  }
  if (absValue >= 1e9) {
    return sign + (absValue / 1e9).toFixed(decimals) + 'B';
  }
  if (absValue >= 1e6) {
    return sign + (absValue / 1e6).toFixed(decimals) + 'M';
  }
  if (absValue >= 1e3) {
    return sign + (absValue / 1e3).toFixed(decimals) + 'K';
  }
  
  return sign + absValue.toString();
}

/**
 * Format a number as a percentage
 * @param value - The number to format (0-100)
 * @param decimals - Number of decimal places (default: 1)
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a date to a readable string
 * @param date - The date to format
 * @param format - The format type (default: 'short')
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (format === 'relative') {
    return formatRelativeTime(dateObj);
  }
  
  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' };
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 * @param date - The date to format
 */
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
}

/**
 * Truncate text to a specified length
 * @param text - The text to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: '...')
 */
export function truncate(text: string, length: number, suffix: string = '...'): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + suffix;
}

/**
 * Get initials from a name
 * @param name - The name to get initials from
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Oil & Gas Production Formatters
 */

/**
 * Format production volume with unit
 * @param value - The production value
 * @param unit - The unit (bbl, mcf, bbl/d, etc.)
 * @param decimals - Number of decimal places
 */
export function formatProduction(
  value: number,
  unit: string = 'bbl/d',
  decimals: number = 1
): string {
  return `${formatNumber(value, decimals)} ${unit}`;
}

/**
 * Format pressure value
 * @param value - The pressure value
 * @param unit - The unit (psi, bar, kPa)
 * @param decimals - Number of decimal places
 */
export function formatPressure(
  value: number,
  unit: string = 'psi',
  decimals: number = 0
): string {
  return `${value.toFixed(decimals)} ${unit}`;
}

/**
 * Format temperature value
 * @param value - The temperature value
 * @param unit - The unit (°F, °C, K)
 * @param decimals - Number of decimal places
 */
export function formatTemperature(
  value: number,
  unit: string = '°F',
  decimals: number = 1
): string {
  return `${value.toFixed(decimals)}${unit}`;
}

/**
 * Format well status to display string
 * @param status - The well status
 */
export function formatWellStatus(
  status: 'active' | 'inactive' | 'maintenance' | 'alert'
): string {
  const statusMap = {
    active: 'Active',
    inactive: 'Inactive',
    maintenance: 'Under Maintenance',
    alert: 'Alert',
  };
  return statusMap[status];
}

/**
 * Format alert severity to display string
 * @param severity - The alert severity
 */
export function formatAlertSeverity(
  severity: 'critical' | 'high' | 'medium' | 'low'
): string {
  const severityMap = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };
  return severityMap[severity];
}

/**
 * Format coordinates to readable location
 * @param lat - Latitude
 * @param lng - Longitude
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}
