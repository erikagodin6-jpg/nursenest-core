-- Expand UserRole for segmented admin access (super / content / support).
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'CONTENT_ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'SUPPORT_ADMIN';
