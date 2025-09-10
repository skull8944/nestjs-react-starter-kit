export const SITE_TYPES = ['WHC', 'WIH', 'WSCQ'] as const;

export type SiteType = (typeof SITE_TYPES)[number];
