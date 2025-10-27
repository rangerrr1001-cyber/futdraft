import { Formation } from '../types';

// Formation position slot mappings
const FORMATION_SLOTS: Record<Formation, string[]> = {
  '4-3-3': ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM1', 'CM2', 'CM3', 'LW', 'ST', 'RW'],
  '4-4-2': ['GK', 'LB', 'CB1', 'CB2', 'RB', 'LM', 'CM1', 'CM2', 'RM', 'ST1', 'ST2'],
  '4-2-3-1': ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CDM1', 'CDM2', 'LM', 'CAM', 'RM', 'ST'],
  '3-5-2': ['GK', 'CB1', 'CB2', 'CB3', 'LM', 'CM1', 'CM2', 'CM3', 'RM', 'ST1', 'ST2'],
  '4-2-2-2': ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CDM1', 'CDM2', 'CAM1', 'CAM2', 'ST1', 'ST2'],
  '3-4-3': ['GK', 'CB1', 'CB2', 'CB3', 'LM', 'CM1', 'CM2', 'RM', 'LW', 'ST', 'RW'],
};

const VALID_FORMATIONS: Formation[] = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '4-2-2-2', '3-4-3'];

/**
 * Get position slots required for a formation
 */
export function getPositionSlotsForFormation(formation: Formation): string[] {
  return FORMATION_SLOTS[formation] || [];
}

/**
 * Extract base position from position slot (e.g., "CM" from "CM1", "ST" from "ST2")
 */
export function parsePositionFromSlot(slot: string): string {
  return slot.replace(/\d+$/, '');
}

/**
 * Validate if provided position slots match the formation exactly
 */
export function validatePositionSlots(formation: Formation, slots: string[]): boolean {
  const required = FORMATION_SLOTS[formation];
  if (!required) return false;

  // Check if provided slots match required slots exactly
  const sortedRequired = [...required].sort();
  const sortedProvided = [...slots].sort();

  return JSON.stringify(sortedRequired) === JSON.stringify(sortedProvided);
}

/**
 * Check if formation is valid
 */
export function isValidFormation(formation: string): formation is Formation {
  return VALID_FORMATIONS.includes(formation as Formation);
}

/**
 * Get all valid formations
 */
export function getAllFormations(): Formation[] {
  return VALID_FORMATIONS;
}
