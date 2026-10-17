// Geographic utility functions for proximity-based equipment discovery
import { getProximityScore } from '../data/africaGeo';

/**
 * Build a full location label from parts.
 */
export const buildLocationLabel = ({ lga, state, country } = {}) => {
  const parts = [lga, state, country].filter(Boolean);
  return parts.join(', ');
};

/**
 * Check if two locations are in the same LGA.
 */
export const isSameLGA = (loc1, loc2) =>
  loc1?.country === loc2?.country &&
  loc1?.state === loc2?.state &&
  loc1?.lga === loc2?.lga;

/**
 * Check if two locations are in the same state/region.
 */
export const isSameState = (loc1, loc2) =>
  loc1?.country === loc2?.country && loc1?.state === loc2?.state;

/**
 * Check if two locations are in the same country.
 */
export const isSameCountry = (loc1, loc2) => loc1?.country === loc2?.country;

/**
 * Get a human-readable proximity label.
 */
export const getProximityLabel = (equipment, userLocation) => {
  if (!userLocation) return null;
  if (isSameLGA(equipment, userLocation)) return 'Same area';
  if (isSameState(equipment, userLocation)) return 'Same state';
  if (isSameCountry(equipment, userLocation)) return 'Same country';
  return null;
};

/**
 * Filter equipment by location criteria.
 * Supports partial matching (country-only, country+state, or full LGA match).
 */
export const filterByLocation = (equipmentList, { country, state, lga } = {}) => {
  return equipmentList.filter((eq) => {
    if (country && eq.country !== country) return false;
    if (state && eq.state !== state) return false;
    if (lga && eq.lga !== lga) return false;
    return true;
  });
};

/**
 * Sort equipment by proximity to user, then by price ascending.
 */
export const sortEquipmentByProximityAndPrice = (equipmentList, userLocation) => {
  return [...equipmentList].sort((a, b) => {
    const scoreA = getProximityScore(a, userLocation);
    const scoreB = getProximityScore(b, userLocation);
    if (scoreB !== scoreA) return scoreB - scoreA; // Higher score first
    return (a.pricePerDay || 0) - (b.pricePerDay || 0);
  });
};

/**
 * Search equipment by keyword against multiple fields.
 */
export const searchEquipment = (equipmentList, keyword) => {
  if (!keyword || !keyword.trim()) return equipmentList;
  const lower = keyword.toLowerCase().trim();
  return equipmentList.filter((eq) => {
    return (
      eq.name?.toLowerCase().includes(lower) ||
      eq.type?.toLowerCase().includes(lower) ||
      eq.description?.toLowerCase().includes(lower) ||
      eq.lga?.toLowerCase().includes(lower) ||
      eq.state?.toLowerCase().includes(lower) ||
      eq.country?.toLowerCase().includes(lower) ||
      eq.tags?.some((t) => t.toLowerCase().includes(lower))
    );
  });
};

/**
 * Filter by price range.
 */
export const filterByPriceRange = (equipmentList, { minPrice, maxPrice } = {}) => {
  return equipmentList.filter((eq) => {
    const price = eq.pricePerDay || eq.pricePerHour || 0;
    if (minPrice && price < Number(minPrice)) return false;
    if (maxPrice && price > Number(maxPrice)) return false;
    return true;
  });
};

/**
 * Apply all filters and search at once.
 */
export const applyEquipmentFilters = (
  equipmentList,
  { keyword, type, country, state, lga, minPrice, maxPrice, availability, operatorIncluded, sortBy },
  userLocation
) => {
  let results = [...equipmentList];

  // Keyword search
  if (keyword) results = searchEquipment(results, keyword);

  // Type filter
  if (type) results = results.filter((eq) => eq.type === type);

  // Location filter
  results = filterByLocation(results, { country, state, lga });

  // Price range filter
  results = filterByPriceRange(results, { minPrice, maxPrice });

  // Availability filter
  if (availability === 'available') {
    results = results.filter((eq) => eq.availability === 'available');
  }

  // Operator filter
  if (operatorIncluded === 'yes') {
    results = results.filter((eq) => eq.operatorIncluded === true);
  } else if (operatorIncluded === 'no') {
    results = results.filter((eq) => eq.operatorIncluded === false);
  }

  // Sort
  if (sortBy === 'price_asc') {
    results.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
  } else if (sortBy === 'price_desc') {
    results.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
  } else if (sortBy === 'nearest') {
    results = sortEquipmentByProximityAndPrice(results, userLocation);
  } else if (sortBy === 'newest') {
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else {
    // Default: proximity first
    results = sortEquipmentByProximityAndPrice(results, userLocation);
  }

  return results;
};
