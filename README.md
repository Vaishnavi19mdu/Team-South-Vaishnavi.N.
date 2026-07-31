# 🌊 Project Vaigai — Frontend

<div align="center">

# 🌊 Project Vaigai

### Smart Hostel Management Platform

</div>

---

# 📖 Overview

Project Vaigai is a modern hostel management platform designed for colleges and universities to replace manual registers, fragmented communication channels, and inefficient workflows with one unified digital ecosystem.

The platform connects Residents, Wardens, Maintenance Staff, Security Personnel, and Super Administrators through dedicated dashboards while providing real-time visibility into hostel operations.

This repository currently contains the **Frontend Implementation**.

Backend services such as Firebase Authentication, Firestore, Cloud Storage, Push Notifications, AI integrations, and QR verification will be integrated during future development phases.

---

# ✨ Features

## 🏠 Landing Experience

- Modern responsive landing page
- Premium minimal UI
- Smooth animations
- Mobile-first design
- About Project Vaigai
- Feature showcase
- Workflow visualization
- Responsive navigation
- Role-based authentication entry

---

## 🔐 Authentication

### Login

- Email Login
- Password Login
- Google Sign In (UI Ready)
- Remember Me
- Forgot Password
- Validation UI

### Registration

Residents

- First Name
- Last Name
- Date of Birth
- Automatic Age Calculation
- Gender
- Password Creation
- Hostel Information
- Block
- Floor
- Room Number

Staff

- Warden
- Maintenance
- Security

Staff registrations enter an approval workflow before activation.

---

# 👥 User Roles

## 👨‍🎓 Resident

Features include:

- Dashboard
- Smart Complaint Management
- Complaint Tracking
- Visitor Registration
- QR Visitor Pass
- Emergency SOS
- Notifications
- Hostel Circle
- Offline Smart Sync
- Inventory Check-In
- Community Settings

---

## 👩‍💼 Warden

- Complaint Review
- Complaint Assignment
- Visitor Approval
- QR Management
- Announcement Creation
- Poll Management
- Hostel Analytics
- SOS Monitoring
- Community Moderation
- Resident Management

---

## 🔧 Maintenance Staff

- Assigned Tasks
- Progress Updates
- Completion Proof Upload
- Maintenance QR Pass
- Delay Requests
- Task History

---

## 👮 Security Personnel

- QR Scanner
- Visitor Verification
- Maintenance Verification
- Entry Logs
- Exit Logs
- SOS Alerts
- Shift Dashboard
- Gate Analytics

---

## 👑 Super Administrator

Enterprise Administration Portal

Modules include

- Campus Dashboard
- Global Analytics
- User Management
- Role Management
- Access Control Center
- Backup & Disaster Recovery
- System Health Monitor
- Cross Hostel Comparison
- Performance Leaderboard
- Audit Logs
- Alert Center
- Offline Sync Monitor
- Campus Overview

---

# 🚀 Frontend Modules

## Complaint Management

- Submit Complaint
- Photo Upload Placeholder
- AI Category Preview
- Priority Badge
- Status Timeline
- Progress Tracking

---

## Visitor Management

- Visitor Registration
- QR Pass Generation
- Approval Status
- Security Verification
- Entry / Exit Tracking
- Visitor History

---

## Emergency SOS

- One Tap Emergency
- Live Status
- Emergency Contacts
- Alert History

---

## Announcements

- Notice Board
- Attachments
- Categories
- Read Status

---

## Polls

- Voting Interface
- Live Results
- Poll History

---

## Hostel Circle

Private resident-only community.

Supports

- Text Posts
- Image Placeholder
- Hashtags
- Categories
- Comments
- Replies
- Likes
- Bookmarks
- Anonymous Posting
- Community Username
- Lost & Found
- Study Groups
- Events
- Suggestions

---

# 🏷 Community Username Generator

Residents cannot create arbitrary usernames.

Instead, usernames are generated using

```
Prefix + Middle + Suffix + Optional Digit
```

Example

```
Royal_Fire_Falcon7

Nova-Ice-Wolf2

GoldenStarExplorer8

Pixel.Cloud.Panda4
```

Features

- Smart Suggestions
- Random Generator
- Availability Check (Mock)
- Reserved Usernames
- 30-Day Change Cooldown
- Anonymous Community Identity

---

# 🛡 Moderation Workflow

Each hostel is managed independently.

Wardens can moderate posts only from their assigned hostel.

Cross-hostel moderation requires approval.

Workflow

```
Request Removal

↓

Assigned Warden Review

↓

Approve

OR

Reject

↓

Notification
```

Super Admin may override all moderation actions.

---

# 📦 Digital Room Inventory

Residents complete an inventory check during hostel check-in.

Supports

- Furniture
- Appliances
- Fixtures
- Condition Selection
- Damage Reporting
- Notes
- Photo Placeholder
- Resident Declaration
- Automatic Maintenance Ticket Generation

---

# 📱 QR Visitor Pass

Features

- Secure QR
- Visitor Details
- Resident Details
- Approval Status
- Validity Window
- Copy Pass ID
- Download Pass (Mock)
- Share Pass (Mock)
- Countdown Timer
- Verification Badge

---

# 📡 Offline Smart Sync

Supports simulated offline-first experience.

Network States

- Online
- Offline
- Syncing

Modules

- Queue Manager
- Pending Uploads
- Sync History
- Storage Usage
- Retry Failed Sync
- Offline Complaint Drafts
- Offline Task Updates

---

# 📊 Dashboards

Every role has its own responsive dashboard.

Includes

- Sidebar
- Topbar
- Avatar
- Notifications
- Statistics
- Cards
- Tables
- Activity Feed
- Responsive Navigation

---

# 🎨 Design System

## Theme

Premium Minimal

Inspired by

- Apple
- Linear
- Notion
- Stripe

---

## Primary Colors

| Color | Hex |
|--------|------|
| Cerulean Blue | #9EB8D2 |
| Mauve | #996E7D |
| Paprika | #C46C45 |
| Accent Purple | #A73FD3 |
| Ivory White | #F8F7F2 |
| Charcoal | #1A1A1A |
| Soft Gray | #EAEAEA |

---

## Typography

- Montserrat
- Manrope
- DM Mono

---

## UI Components

- Rounded Cards
- Rectangular Buttons
- Soft Shadows
- Smooth Hover Effects
- Premium Icons
- Responsive Tables
- Status Chips
- Modern Forms

---

# 📂 Project Structure

```
src/

├── app/
├── components/
│   ├── common/
│   └── layout/
├── pages/
├── hooks/
├── services/
├── utils/
├── assets/
└── types/
```

---

# 📱 Responsive Design

Optimized for

- Mobile
- Tablet
- Desktop

Uses

- Flexible Grid
- Responsive Sidebar
- Adaptive Cards
- Mobile Navigation
- Tablet Layouts

---

# 🛠 Planned Backend Integration

- Firebase Authentication
- Firestore Database
- Firebase Storage
- Cloud Functions
- Firebase Messaging
- Role-Based Access
- QR Verification
- AI Integration (Groq)
- Whisper Voice Input
- Push Notifications
- Analytics
- Real-Time Updates

---

# 🤖 AI Roadmap

Planned integrations

- Complaint Categorization
- Duplicate Detection
- Priority Prediction
- Smart Assignment
- AI Chat Assistant
- Voice Complaint Transcription
- Predictive Hostel Insights

---

# 📌 Current Status

### ✅ Completed

- Landing Page
- Authentication UI
- Role Dashboards
- Community Module
- Visitor Management UI
- QR Pass UI
- Offline Smart Sync UI
- Inventory Check-In
- Super Admin Portal
- Responsive Design
- Modern Design System

---

### 🚧 Upcoming

- Firebase Integration
- Authentication Logic
- Firestore Database
- Real QR Generation
- QR Scanner
- Push Notifications
- AI Backend
- Voice Support
- File Uploads
- Live Sync

---

# 👨‍💻 Team

**Project Name**

Project Vaigai

**Domain**

Smart Hostel Management

**Institution**

College Hostel Management System

---

## ❤️ Built with modern web technologies to simplify hostel life and create a safer, smarter campus experience.
