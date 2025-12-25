# CampusNotifier: A simple web-based event manager system for campuses.

A modern, AI-assisted college event management platform built with React, Firebase, and Tailwind CSS.
Event Notifier acts as a single source of truth for campus events, ensuring students never miss deadlines, workshops, or announcements.

## Overview

##### Event Notifier streamlines how campus events are created, managed, and consumed.

Students get a clean, personalized timeline of relevant events

Admins can create structured events from raw text using AI

Firebase powers authentication and real-time data storage

Role-based routing ensures the correct experience for each user

### Features
#### Student Features

- Signup and login restricted to @cet.ac.in email addresses
- Mandatory onboarding to personalize the event feed
- Events Timeline with:
    - Department, type, and priority filters
    - Chronological sorting of upcoming events
    - Detailed event pages with priority indicators
- Fully responsive UI (mobile + desktop)

#### Admin Features

1. Dedicated Admin Dashboard
2. AI-assisted event creation (Gemini integration)
3. Preview, edit, and publish events before pushing live
4. Manage all published events from a centralized interface
5. Protected admin-only routes

#### AI-Assisted Event Creation

Admins can paste raw event text and automatically generate:

- Event title
- Summary
- Full description
- Tags / departments
- Venue
- Start & end times

### Tech Stack

#### Frontend
- React (Vite)
- Tailwind CSS
- Lucide React Icons

#### Backend
- Firebase Authentication
- Firebase Firestore

#### AI
- Gemini (event parsing & normalization)

## Project Structure
    src/
    ├── App.jsx                # App entry, routing & guards
    ├── main.jsx               # React DOM bootstrap
    ├── index.css              # Tailwind base styles
    │
    ├── pages/
    │   ├── LandingPage.jsx
    │   ├── LoginPage.jsx
    │   ├── SignupPage.jsx
    │   ├── OnboardingPage.jsx
    │   ├── EventsTimelinePage.jsx
    │   ├── EventDetailPage.jsx
    │   └── AdminDashboard.jsx
    │
    ├── hooks/
    │   ├── useRouter.js       # Custom lightweight router
    │   ├── useSession.js      # Auth + role management
    │   ├── useEvents.js       # Firestore events hook
    │   └── useFilters.js      # Timeline filtering logic
    │
    ├── firebase/
    │   └── firebase.js        # Firebase configuration
    │
    ├── services/
    │   └── gemini.js          # AI event processing
    │
    ├── utils/
    │   └── normalizeEvent.js  # Firestore → UI mapper
    │
    └── components/
        ├── EventCard.jsx
        └── FiltersPanel.jsx

## Authentication & Roles

Only @cet.ac.in email addresses are allowed to:

1. Sign up
2. Log in

New users must complete onboarding before accessing the events timeline
 
-- --
>  User roles:
    
1. student (default)
2. admin (manually assigned in Firestore)

-- --

Routing guards ensure:

- Unauthenticated users cannot access admin routes
- Admin users are redirected away from the student timeline

## Event Data Model (Firestore)
    {
    title_raw: string,
    summary_ai: string,
    description_raw: string,
    department_tags: string[],
    event_type: string,
    priority: "normal" | "important" | "critical",
    venue: string,
    start_time: string,
    end_time: string,
    createdAt: timestamp,
    updatedAt: timestamp
    }


Events are normalized before rendering to ensure consistent UI behavior.

## Routing System (WIP)

This project uses a **custom router hook** instead of React Router.

Supported routes:
- landing page 
- login
- signup
- onboarding
- events
- event-detail
- admin

Routing logic is centralized in App.jsx and guarded by session state.

## UI & Design

- Utility-first styling with Tailwind CSS

- Glassmorphism-inspired admin dashboard

- Clean, minimal student interface

- Animation-friendly layouts

- Dark-mode–safe color choices (future-ready)

## Getting Started
-- --
#### Install dependencies

    npm install

-- --
#### Configure Firebase

Update your Firebase credentials in:

    src/firebase/firebase.js (or add in .env)

**Ensure the following are enabled:**

- Firebase Authentication (Email/Password)

- Cloud Firestore

-- --

#### Run the development server (or deploy it, your wish)

    npm run dev

## Design Philosophy

- Single Source of Truth for campus events

- Low noise, high signal communication

- AI assists admins, not replaces them

- Students see only what is relevant to them

## Planned Enhancements

- Dark mode toggle

- Event reminders & notifications

- Department-based event targeting

- Admin role management UI

- Analytics dashboard for admins

## Project Status

- [x] Core architecture complete

- [x] Admin & student flows stable

- [ ] Actively evolving

- [x] MVP feature-complete

# CampusNotifier: A simple web-based event manager system for campuses.

A modern, AI-assisted college event management platform built with React, Firebase, and Tailwind CSS.
Event Notifier acts as a single source of truth for campus events, ensuring students never miss deadlines, workshops, or announcements.

## Overview

Event Notifier streamlines how campus events are created, managed, and consumed.

Students get a clean, personalized timeline of relevant events

Admins can create structured events from raw text using AI

Firebase powers authentication and real-time data storage

Role-based routing ensures the correct experience for each user

### Features
#### Student Features

Signup and login restricted to @cet.ac.in email addresses

Mandatory onboarding to personalize the event feed

Events Timeline with:

Department, type, and priority filters

Chronological sorting of upcoming events

Detailed event pages with priority indicators

Fully responsive UI (mobile + desktop)

#### Admin Features

Dedicated Admin Dashboard

AI-assisted event creation (Gemini integration)

Preview, edit, and publish events before pushing live

Manage all published events from a centralized interface

Protected admin-only routes

#### AI-Assisted Event Creation

Admins can paste raw event text and automatically generate:

Event title

Summary

Full description

Tags / departments

Venue

Start & end times

### Tech Stack

Frontend

React (Vite)

Tailwind CSS

Lucide React Icons

Backend

Firebase Authentication

Firebase Firestore

AI

Gemini (event parsing & normalization)

## Project Structure
src/
├── App.jsx                # App entry, routing & guards
├── main.jsx               # React DOM bootstrap
├── index.css              # Tailwind base styles
│
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── OnboardingPage.jsx
│   ├── EventsTimelinePage.jsx
│   ├── EventDetailPage.jsx
│   └── AdminDashboard.jsx
│
├── hooks/
│   ├── useRouter.js       # Custom lightweight router
│   ├── useSession.js      # Auth + role management
│   ├── useEvents.js       # Firestore events hook
│   └── useFilters.js      # Timeline filtering logic
│
├── firebase/
│   └── firebase.js        # Firebase configuration
│
├── services/
│   └── gemini.js          # AI event processing
│
├── utils/
│   └── normalizeEvent.js  # Firestore → UI mapper
│
└── components/
    ├── EventCard.jsx
    └── FiltersPanel.jsx

## Authentication & Roles

Only @cet.ac.in email addresses are allowed to:

Sign up

Log in

New users must complete onboarding before accessing the events timeline

User roles:

student (default)

admin (manually assigned in Firestore)

Routing guards ensure:

Unauthenticated users cannot access admin routes

Admin users are redirected away from the student timeline

## Event Data Model (Firestore)
{
  title_raw: string,
  summary_ai: string,
  description_raw: string,
  department_tags: string[],
  event_type: string,
  priority: "normal" | "important" | "critical",
  venue: string,
  start_time: string,
  end_time: string,
  createdAt: timestamp,
  updatedAt: timestamp
}


Events are normalized before rendering to ensure consistent UI behavior.

## Routing System

This project uses a custom router hook instead of React Router.

Supported routes:

landing

login

signup

onboarding

events

event-detail

admin

Routing logic is centralized in App.jsx and guarded by session state.

## UI & Design

Utility-first styling with Tailwind CSS

Glassmorphism-inspired admin dashboard

Clean, minimal student interface

Animation-friendly layouts

Dark-mode–safe color choices (future-ready)

## Getting Started
1️⃣ Install dependencies

    npm install

2️⃣ Configure Firebase

Update your Firebase credentials in:

src/firebase/firebase.js (or add in .env)


Ensure the following are enabled:

Firebase Authentication (Email/Password)

Cloud Firestore

3️⃣ Run the development server

    npm run dev

## Design Philosophy

Single Source of Truth for campus events

Low noise, high signal communication

AI assists admins, not replaces them

Students see only what is relevant to them

## Planned Enhancements

- Dark mode toggle

- Event reminders & notifications

- Department-based event targeting

- Admin role management UI

- Analytics dashboard for admins

## Project Status

-[x] Core architecture complete

-[x] Admin & student flows stable

-[ ] Actively evolving

-[ ] MVP feature-complete
