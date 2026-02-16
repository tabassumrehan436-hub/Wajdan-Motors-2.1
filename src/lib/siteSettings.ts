export type SiteSettings = {
  businessName?: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsappNumber?: string; // without +
  workingHours?: string;
};

const STORAGE_KEY = "bloodline_motors_settings";

export function getSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SiteSettings;
  } catch (e) {
    return {};
  }
}

export function saveSiteSettings(settings: SiteSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    // ignore
  }
}
