# NurseNest Recovery Environment Checklist

Use this checklist when setting up NurseNest on a new host after a disaster recovery event.

## Infrastructure Requirements

- [ ] Node.js 20+ installed
- [ ] PostgreSQL 15+ database provisioned
- [ ] Domain DNS configured (if applicable)
- [ ] SSL certificate provisioned (if applicable)
- [ ] Object storage bucket created (for assets)

## Environment Variables

### Required (App will not start without these)
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `SESSION_SECRET` - Random string (32+ characters)
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### Recommended (Features will be limited without these)
- [ ] `OPENAI_API_KEY` - For AI tutor and content generation
- [ ] `STRIPE_WEBHOOK_SECRET` - For payment webhook verification
- [ ] `PUBLIC_OBJECT_SEARCH_PATHS` - For serving uploaded assets
- [ ] `PRIVATE_OBJECT_DIR` - For private file storage

### Optional
- [ ] `PROD_DATABASE_URL` - If separate production DB
- [ ] `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` - For email
- [ ] `GOOGLE_ANALYTICS_ID` - For analytics tracking
- [ ] `DOMAIN` / `BASE_URL` - For canonical URLs
- [ ] `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` - For PayPal payments

## Recovery Steps

### 1. Code Restoration
- [ ] Extract backup archive or clone repository
- [ ] Verify all source directories exist (client/, server/, shared/)
- [ ] Run `npm install` to install dependencies

### 2. Database Restoration
- [ ] Create new PostgreSQL database
- [ ] Set `DATABASE_URL` in environment
- [ ] Apply migrations: `npx drizzle-kit push` or apply SQL files
- [ ] Verify tables created with `npm run backup:db`
- [ ] Import content data from backup JSON files (if available)

### 3. Build and Deploy
- [ ] Run `npm run build`
- [ ] Start with `npm run start`
- [ ] Verify app loads on port 5000

### 4. Verification
- [ ] Home page loads correctly
- [ ] Login/registration works
- [ ] Lessons and content display
- [ ] Question banks load
- [ ] Flashcard system works
- [ ] Pricing page shows plans
- [ ] Stripe checkout initiates (test mode)
- [ ] Admin dashboard accessible
- [ ] SEO pages render meta tags
- [ ] Translations switch languages

### 5. Post-Recovery
- [ ] Run `npm run restore:validate` to verify setup
- [ ] Run `npm run backup:full` to create first backup on new host
- [ ] Configure monitoring and alerts
- [ ] Update DNS if domain changed
- [ ] Notify users if extended downtime occurred

## Reference
- See `config/env-schema.json` for detailed variable documentation
- See `docs/recovery/external-backup-strategy.md` for backup storage guidance
- Run `npm run restore:dry-run` to simulate a full restore
