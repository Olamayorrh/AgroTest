/**
 * User Capabilities and Normalization Utility
 * Supports single-role legacy users and dual-role (Farmer + Equipment Owner) accounts.
 */

export const CAPABILITY_OPTIONS = {
  FARMER_ONLY: 'farmer',
  OWNER_ONLY: 'owner',
  BOTH: 'both',
};

/**
 * Normalizes any user object (legacy or new) to guarantee valid `capabilities`
 * and `preferredDashboard` properties without mutating original IDs or losing data.
 */
export const normalizeUser = (user) => {
  if (!user) return null;

  const existingCaps = user.capabilities || {};
  let canRent = existingCaps.canRentEquipment;
  let canList = existingCaps.canListEquipment;

  // If capabilities are undefined or partially defined, derive from legacy `role`
  if (canRent === undefined || canList === undefined) {
    if (user.role === 'owner') {
      canRent = false;
      canList = true;
    } else if (user.role === 'both') {
      canRent = true;
      canList = true;
    } else {
      // Default legacy role is 'farmer'
      canRent = true;
      canList = false;
    }
  }

  // Derive preferredDashboard
  let preferredDashboard = user.preferredDashboard;
  if (!preferredDashboard) {
    if (canList && !canRent) {
      preferredDashboard = 'owner';
    } else {
      preferredDashboard = 'farmer';
    }
  }

  // Derive unified role string for backward-compatibility with UI badges
  let unifiedRole = user.role;
  if (canRent && canList) {
    unifiedRole = 'both';
  } else if (canList) {
    unifiedRole = 'owner';
  } else {
    unifiedRole = 'farmer';
  }

  return {
    ...user,
    role: unifiedRole,
    capabilities: {
      canRentEquipment: Boolean(canRent),
      canListEquipment: Boolean(canList),
    },
    preferredDashboard,
  };
};

/**
 * Helper to check if a user has dual capabilities.
 */
export const hasDualCapabilities = (user) => {
  const normalized = normalizeUser(user);
  return Boolean(
    normalized?.capabilities?.canRentEquipment &&
    normalized?.capabilities?.canListEquipment
  );
};
