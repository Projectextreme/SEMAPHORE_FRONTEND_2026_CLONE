# Semaphore 2K26 — Technical SEO Implementation & Search Architecture

This document describes the complete technical SEO architecture, schema implementations, indexing rules, and Google Search Console verification guidelines implemented for **Semaphore 2K26** (`https://www.semaphore2k26.in/`).

---

## 1. Technical Architecture & Canonical Domain

* **Production Domain**: `https://www.semaphore2k26.in`
* **Framework**: Next.js 16.3.1 (App Router) + React 19 + Tailwind CSS v4.
* **Rendering Strategy**: Static Site Generation (SSG) via `output: 'export'` with high-performance client hydration for interactive 3D and WebGL visuals.
* **Canonicalization Rule**: Every public route specifies an explicit absolute HTTPS canonical URL using `https://www.semaphore2k26.in/` without duplicate query strings or trailing-slash discrepancies.

---

## 2. Robots.txt & Sitemap Configuration

### Robots Configuration (`app/robots.js` & `public/robots.txt`)
* **Allows**: All search engine crawlers (`*`) full access to public pages (`/`, `/info`, `/rules`, `/events/register`, `/memories`, `/contact`, `/developer`).
* **Disallows**:
  * `/api/` (Backend proxy and data endpoints)
  * `/user/` (User authentication, profile management, and payment verification)
  * `/_next/` (Internal Next.js build assets)
  * `/private/` (Admin and private paths)
* **Sitemap Reference**: `https://www.semaphore2k26.in/sitemap.xml`

### XML Sitemap (`app/sitemap.js` & `public/sitemap.xml`)
Includes all indexable public pages with accurate priority and update frequency weights:
1. `https://www.semaphore2k26.in/` (`priority: 1.0`, `daily`)
2. `https://www.semaphore2k26.in/info` (`priority: 0.9`, `daily`)
3. `https://www.semaphore2k26.in/events/register` (`priority: 0.9`, `daily`)
4. `https://www.semaphore2k26.in/rules` (`priority: 0.8`, `weekly`)
5. `https://www.semaphore2k26.in/memories` (`priority: 0.8`, `weekly`)
6. `https://www.semaphore2k26.in/contact` (`priority: 0.8`, `weekly`)
7. `https://www.semaphore2k26.in/developer` (`priority: 0.7`, `monthly`)

---

## 3. Structured Data (JSON-LD / Schema.org)

Structured data is generated dynamically via `lib/schema.js` and embedded via script tags across root layout and individual pages:

### A. Organization Schema (`EducationalOrganization`)
* **Name**: Department of MCA, NMAM Institute of Technology
* **Alternate Names**: NMAMIT MCA, SAMCA NMAMIT, Semaphore 2K26 Committee
* **Address**: Nitte, Karkala Taluk, Udupi, Karnataka, 574110, India
* **Geo Coordinates**: `13.1827° N, 74.9348° E`
* **Social Profiles (`sameAs`)**:
  * `https://www.instagram.com/semaphore.26`
  * `https://www.instagram.com/samca_nitte_mca`
  * `https://www.youtube.com/@SAMCANMAMIT`
  * `https://nitte.edu.in/nmamit/department-mca.php`
* **Contact Points**: Faculty Coordinator (Dr. Roshan D Suvaris: `+91 9663484343`), Student Coordinator (Vansh Shetty: `+91 9019720766`).

### B. Main Event & Sub-Events Schema (`Event`)
* **Name**: Semaphore 2K26: AquaSaga - National Level Technical Fest
* **Dates**: `2026-09-17T09:00:00+05:30` to `2026-09-18T18:00:00+05:30`
* **Attendance Mode**: `https://schema.org/OfflineEventAttendanceMode`
* **Status**: `https://schema.org/EventScheduled`
* **Offer**: ₹2000 Team Entry fee.
* **SubEvents**: Explicit schema definitions for all 10 competitions:
  1. Code Wave (Coding & DSA)
  2. Coral Canvas (Web Design Hackathon)
  3. Aqua Byte (IT Quiz)
  4. Abyss Arena (Gaming Tournament)
  5. AquaVerse (Tech Talk & Elocution)
  6. Ocean Enigma (Surprise Problem Solving)
  7. Leviathan (IT Manager)
  8. The Meg Pitch (StartUp Pitching)
  9. Submarine (Campus Photography & Videography)
  10. Narcissa (Corporate Fashion Walk)

### C. WebSite Schema (`WebSite`)
* Provides site identity, name alternates, and publisher hierarchy.

### D. BreadcrumbList Schema (`BreadcrumbList`)
* Implemented on all subpages for Google rich snippet breadcrumb navigation.

---

## 4. Metadata Strategy & Social Cards

* **Open Graph (Facebook / LinkedIn / WhatsApp / Slack)**:
  * `og:type`: `website`
  * `og:locale`: `en_IN`
  * `og:site_name`: `Semaphore 2K26`
  * `og:image`: High-contrast `1200x630` banner asset (`/techy_underwater_bg.png`) and emblem (`/aquasaga_logo.png`).
* **Twitter / X Cards**:
  * `twitter:card`: `summary_large_image`
  * `twitter:creator`: `@semaphore_26`

---

## 5. Performance, Accessibility & Image SEO

1. **Cloudinary Dynamic Optimization**:
   * Image URLs routed through dynamic format and quality conversion (`f_auto,q_auto,w_800` / `w_650`), reducing payload from ~100MB+ down to < 2MB.
2. **Semantic HTML Structure**:
   * One primary `<h1>` per page with proper `<h2>` and `<h3>` nested hierarchy.
   * Descriptive `alt` attributes on all photographic and UI assets.
3. **PWA & Manifest**:
   * `app/manifest.js` enables installability, mobile home-screen integration, and correct theme-color header rendering.

---

## 6. Google Search Console Deployment Checklist

Complete these manual steps after publishing the deployment:

- [ ] **1. Domain Property Verification**:
  * In Google Search Console, add property `https://www.semaphore2k26.in/` (or Domain DNS verification for `semaphore2k26.in`).
- [ ] **2. Submit Sitemap**:
  * Go to **Sitemaps** > Enter `https://www.semaphore2k26.in/sitemap.xml` > Click **Submit**.
- [ ] **3. URL Inspection & Request Indexing**:
  * Inspect `https://www.semaphore2k26.in/`, `/info`, `/events/register`, `/rules`, `/contact`, `/memories`.
  * Verify live test returns HTTP 200 with valid schema detected.
  * Click **Request Indexing**.
- [ ] **4. Rich Results Test**:
  * Test `https://www.semaphore2k26.in/` on [Google Rich Results Tool](https://search.google.com/test/rich-results) to verify `Event`, `EducationalOrganization`, and `BreadcrumbList` schemas.
- [ ] **5. Local Business / Maps Citation**:
  * Ensure the official NMAMIT Nitte MCA event announcements cross-link to `https://www.semaphore2k26.in/`.
