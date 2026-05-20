-- India, Nigeria, Saudi Arabia marketing pathway country codes (additive enum values).
ALTER TYPE "CountryCode" ADD VALUE IF NOT EXISTS 'IN';
ALTER TYPE "CountryCode" ADD VALUE IF NOT EXISTS 'NG';
ALTER TYPE "CountryCode" ADD VALUE IF NOT EXISTS 'SA';
