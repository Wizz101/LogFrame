// 🧩 Utils: Consolidated Utilities
// 📁 Location: src/app/core/utils/utils.ts
// 📝 Description: Basic utility functions

import { APP_SETTINGS } from '../config/app.settings';
import { Language } from '@app/shared/models/miscellaneous/app-settings.model';

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Valideert of een waarde een geldig nummer is.
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value);
}

/**
 * Valideert of een string niet leeg is.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Controleert of een waarde leeg is (null, undefined, lege string, lege array).
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Normaliseert een zoekquery (trim + lowercase).
 */
export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

/**
 * Truncateert tekst tot een maximum lengte met ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || typeof text !== 'string' || !isValidNumber(maxLength) || maxLength < 0) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Groepeert een array op basis van een property.
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((groups, item) => {
    if (!item || typeof item !== 'object') return groups;
    const group = String(item[key] ?? 'undefined');
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Verwijdert duplicaten uit een array op basis van een property.
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  if (!Array.isArray(array)) return [];
  const seen = new Set<string>();
  return array.filter(item => {
    if (!item || typeof item !== 'object') return false;
    const value = item[key];
    const valueStr = String(value);
    if (seen.has(valueStr)) return false;
    seen.add(valueStr);
    return true;
  });
}

