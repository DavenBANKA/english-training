/**
 * Utilitaires de validation
 */

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateCEFRLevel = (level) => {
  const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  return validLevels.includes(level);
};

export const validateSkill = (skill) => {
  const validSkills = ['reading', 'listening', 'speaking', 'writing'];
  return validSkills.includes(skill.toLowerCase());
};
