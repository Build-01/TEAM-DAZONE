# SabiWork - Economic Identity Platform for Africa's Informal Economy

## 🎯 The Problem We Solve

Africa's informal economy employs over 80% of the workforce, yet most workers lack formal records, credit access, pensions, insurance, and financial services. Because existing systems depend on traditional banking data, millions remain excluded, vulnerable to fraud, non-payment, and persistent poverty.

## 💡 Our Solution

An AI-powered platform that creates digital economic identities for informal workers. It onboards them, matches them to jobs, automates pension savings (10%), and builds verified trust credentials through an **Economic Identity Score™** based on:
- Work activity & transaction consistency
- Pension contributions
- Community trust & repayment behavior

This enables banks to offer credit safely, while workers gain financial visibility, secure payments, and long-term economic opportunities. **We provide trust credentials, not lending.**

## 🔌 Squad APIs Used

| API | Purpose |
|-----|---------|
| **Escrow transactions** | Secure gig payments |
| **Instant worker payouts** | Immediate net payment after completion |
| **Pension contribution transfers** | Auto-deduct 10% to pension |
| **Payment webhooks** | Trigger trust score updates |
| **Transaction reconciliation** | Match gig records with pension/payout logs |

## 🏗️ Tech Stack

- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Frontend:** Next.js, TailwindCSS, TypeScript
- **AI:** Hugging Face, embedding-based matching
- **Payments:** Squad API

## 📋 Development Pillars Addressed

| Pillar | Description |
|--------|-------------|
| **AI** | Skill extraction from photos, job matching, fraud detection, behavioral trust scoring |
| **Use of Data** | Alternative data (gig completion, escrow history, savings, community endorsements) replaces traditional credit history |
| **Financial Innovation** | Automated pension inclusion for informal workers + trust-based credit credentials |
| **Squad API** | Escrow, instant payouts, automated pension transfers — Squad is our financial backbone |

## 🚀 Run Locally with Docker

1. Copy `.env.example` to `.env` and update secrets.
2. Build and start containers:

```bash
docker compose up --build