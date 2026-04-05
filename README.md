# Expense Tracker — Finance Dashboard
---

## Overview

This is a fully functional, personal finance dashboard I built prior to this assignment. It goes beyond the assignment scope by including a real backend, authentication, and persistent data — but it covers every core requirement listed. Rather than rebuilding a similar project from scratch, I am submitting this as it demonstrates a stronger understanding of the same concepts.

---

## How It Meets the Assignment Requirements

### 1. Dashboard Overview
The main dashboard displays:
- **Total Limit / Base Income** — user-defined monthly baseline
- **Current Expenses** — total expenses for the selected month with percentage of budget spent
- **Remaining Balance** — dynamically calculated including extra income

Visualizations include:
- **Daily Spending Trends** — a time-based line chart showing expense and income trends across days of the month
- **Expenses by Category** — a categorical pie/donut chart showing spending distribution across all categories

### 2. Transactions Section
The Activity section displays all transactions with:
- Date, amount, category, and type (income/expense)
- **Search** by description or category
- **Filter** by category using a dropdown
- **Edit** transactions inline
- **Export CSV** functionality built in

### 3. Insights Section
The **Smart AI Insights** section dynamically generates observations such as:
- Savings rate analysis ("Great Saver — saving over 60% of income")
- Category concentration alerts ("Category Heavy — over 50% going to Travel")
- Largest expense and top spending category cards
- Budget by category with progress bars showing spend vs limit

### 4. State Management
State is managed using **Redux Toolkit** with the following slices:
- Transactions data
- Selected month/date filter
- User role and session state
- Budget limits per category

Redux was chosen over simpler alternatives because the app manages shared state across multiple deeply nested components (dashboard, activity feed, insights, budget tracker).

### 6. UI and UX
- Clean, modern design with light and dark mode support
- Fully responsive across mobile, tablet, and desktop
- Empty states handled gracefully (e.g., "No recurring items. Add rent, subscriptions, etc.")
- Smooth transitions and intuitive navigation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Redux Toolkit |
| Backend | Next.js API Routes (Node.js) |
| Database | MongoDB (Mongoose) |
| Authentication | NextAuth.js |
| Deployment | Vercel |

---

## Features Beyond Assignment Scope

These were built as part of the production app and go beyond what was required:

- Full authentication with NextAuth (Google / credentials)
- Real MongoDB backend with per-user data isolation
- Recurring transactions tracker
- Budget limits per category with progress visualization
- AI-generated dynamic financial insights
- Month-by-month navigation
- Export CSV

---
