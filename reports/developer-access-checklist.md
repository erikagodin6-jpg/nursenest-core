# Developer access checklist (safe handoff)

Goal: grant a **paid external developer** enough access to be productive **without** sharing passwords in chat or duplicating privileged accounts unnecessarily.

---

## 1. GitHub

| Item | Recommendation |
|------|----------------|
| **Repository access** | Invite as **outside collaborator** on the private repo (or org member with minimal team). |
| **Default permission** | **Write** only if they must push branches; otherwise **read** + fork policy per org rules. |
| **Branch protection** | Require PR reviews + CI green before merge to `main`; no direct pushes to production branch. |
| **Secrets** | **Never** store production keys in GitHub Actions **plaintext** logs; use encrypted secrets / environments. |

**Do not:** share a personal PAT “for convenience” — use machine users or org-level tokens with expiry.

---

## 2. DigitalOcean (or primary host)

| Level | Typical use |
|-------|-------------|
| **Read-only / Billing viewer** | Contractor who only needs logs screenshots—rare for dev work. |
| **App Platform deploy / read logs** | Most contractors: access to **one** app + **read** logs, **read** env var **names** (values masked if possible). |
| **Database admin** | **Restricted** — use break-glass account; time-bound; MFA mandatory. |

**Do not:** give **Team Owner** by default. Escalate only with manager approval.

---

## 3. Database (PostgreSQL)

| Pattern | Recommendation |
|---------|------------------|
| **Daily dev** | **Read-only** connection to a **staging** or **sanitized** snapshot (PII scrubbed). |
| **Migrations** | Lead or CI-only role using `DIRECT_URL` with IP allowlist / VPN. |
| **Production writes** | Break-glass only; pair session; document in incident channel. |

**Do not:** put production `DATABASE_URL` on a contractor laptop without contract and disk encryption policy.

---

## 4. Stripe

| Pattern | Recommendation |
|---------|------------------|
| **Developers** | **Test mode** keys in dev; **Dashboard test data** only. |
| **Production** | **Read-only** Dashboard role for debugging **unless** webhook work is required—then narrow **webhook endpoint** secret rotation plan. |

**Do not:** share **live** secret keys in Slack, email, or Zoom screen share without blur.

---

## 5. PostHog / analytics

| Pattern | Recommendation |
|---------|------------------|
| **Default** | **View-only** project access + saved funnels for signup → subscription → first lesson. |
| **Feature flags** | Edit access **only** if the contractor owns flag hygiene; otherwise read-only. |

**Do not:** export raw user tables to personal drives.

---

## 6. Environment variables and secrets

| Do | Don’t |
|----|--------|
| Use **1Password** (or team vault) **shared vault item** with rotation policy | Paste `.env` into tickets |
| Use **DO / Vercel** secret UI for deployment | Commit `.env*` files |
| Document **names** in `reports/developer-onboarding.md` | Put **values** in docs |
| Rotate when someone leaves | Reuse “the team password” |

---

## 7. What passwords / secrets must **not** be shared

- Production **database** passwords  
- **Stripe live** secret key and webhook signing secret  
- **NextAuth** secret (session forgery risk)  
- **OAuth** client secrets (Google, etc.)  
- **LLM** API keys with billing attached  
- **SMTP** or transactional email credentials  
- **Sentry DSN** if org treats it as sensitive (often semi-public—follow org policy)  
- Personal **GitHub** or **Google** passwords (“log in as me”) — **never**

Use **role accounts** and **short-lived tokens** where the platform supports it.

---

## 8. Read-only vs admin — quick matrix

| System | Read-only | Admin / write |
|--------|-----------|----------------|
| GitHub repo | Browse, PR from fork | Push to branches, merge (if trusted) |
| DO App | Logs, metrics | Env edits, scaling — **lead only** by default |
| Postgres | `SELECT` on staging | `INSERT/UPDATE/DELETE` — staging only |
| Stripe | Test dashboard, read live invoices (if policy allows) | Refunds, product edits — **lead + finance** |
| PostHog | Dashboards | Flag edits — optional |
| Production Next | None direct | Deploy via CI/CD — **no manual prod Node** |

---

## 9. Offboarding (same day access ends)

- Revoke GitHub collaborator / org membership.  
- Rotate any **shared** secrets the contractor touched (assume clipboard history).  
- Remove **DO**, **Stripe**, **PostHog** seats.  
- Audit **last login** on break-glass DB role.  

---

## 10. Sign-off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Engineering lead | | | |
| Security / IT (if applicable) | | | |
| Contractor | | | Confirmed vault access, no secrets in email |
