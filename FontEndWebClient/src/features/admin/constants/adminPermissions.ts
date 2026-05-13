export const ADMIN_PERMISSIONS = {
    DASHBOARD: 'ADMIN_DASHBOARD',
    BUYER: 'ADMIN_BUYER',
    SELLER: 'ADMIN_SELLER',
    ADMIN_ACCOUNTS: 'ADMIN_ADMIN_ACCOUNTS',
    CATEGORY: 'ADMIN_CATEGORY',
    VOUCHER: 'ADMIN_VOUCHER',
    SETTINGS: 'ADMIN_SETTINGS',
    PERMISSIONS: 'ADMIN_PERMISSIONS',
} as const;

export type AdminPermissionCode = typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS];

export interface AdminFeaturePermission {
    code: AdminPermissionCode;
    label: string;
}
