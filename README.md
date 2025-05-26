# README: CareLink - HealthTech Follow-Up Reminder System

## 🔍 Prompt Engineering (25%)

CareLink was developed through strategic prompt engineering to solve a real-world healthcare problem: missed follow-up appointments. Prompts were carefully designed to:

* Replace Twilio with a reliable, region-specific messaging API (e.g., Africa’s Talking)
* Design an intuitive, role-based UI with Tailwind CSS
* Ensure backend and frontend integration remained intact during UI changes
* Provide scalable prompts that work across system architecture, UX, and business logic

## 🎨 Aesthetic Appeal & Vibes (20%)

* The UI/UX is built using Tailwind CSS for a clean, modern healthcare design
* Calming blue and green color palette ensures accessibility and brand alignment
* Mobile-first design, responsive layout, consistent spacing and visual hierarchy
* Placeholder animations and auditory feedback potential planned for final version

## 🧠 Technical Creativity & Flow (20%)

* Replaced Twilio with Africa’s Talking for local SMS delivery
* Role-based dashboards using conditionally rendered components
* Modular code with clean folder structure and separation of concerns
* Creative fallback logic: if SMS fails, attempt WhatsApp or alternative route

## ⚡ Rapid Prototyping & Execution (15%)

* Functional prototype developed within short timeline using React and Node.js
* Fast integration of messaging, authentication, and role-based routing
* Canva pitch deck and UI mockups created simultaneously with live code
* Resolved roadblocks by replacing broken dependencies and redesigning UI without losing logic

## 🔐 Security & Fault Tolerance (10%)

* Backend protected with environment variables and secure API key storage
* Role-based access control limits patient, doctor, and admin access
* Message dispatch audit logs and retry logic implemented
* Prepared for GDPR/HIPAA compliance with encrypted messaging routes

## 📚 Presentation & Testing (10%)

* Clear README included for judges and collaborators
* Backend routes tested for SMS, auth, and message logs
* Features validated across user roles and delivery channels

---

**Project Goal:** To ensure that no patient falls through the cracks by delivering intelligent, automated follow-up reminders to both patients and doctors via accessible messaging platforms.

**Tech Stack:** React · Node.js/Python · Tailwind CSS · Africa's Talking API · Firebase/PostgreSQL

**Contributors:** Clinton Ochieng (Lead Developer, Prompt Engineer, UI/UX Designer)
