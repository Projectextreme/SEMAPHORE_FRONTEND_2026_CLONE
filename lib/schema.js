import { SITE_CONFIG } from "@/constants/seo";
import eventsData from "@/data/events.json";

/**
 * Generate Organization JSON-LD for NMAMIT MCA & SAMCA
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: "Department of MCA, NMAM Institute of Technology",
    alternateName: ["NMAMIT MCA", "SAMCA NMAMIT", "Semaphore 2K26 Committee"],
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
    description:
      "Department of Master of Computer Applications (MCA) at NMAMIT Nitte, hosting the annual National Level Technical Fest Semaphore 2K26.",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.venue.streetAddress,
      addressLocality: SITE_CONFIG.venue.addressLocality,
      addressRegion: SITE_CONFIG.venue.addressRegion,
      postalCode: SITE_CONFIG.venue.postalCode,
      addressCountry: SITE_CONFIG.venue.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.venue.geo.latitude,
      longitude: SITE_CONFIG.venue.geo.longitude,
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.samcaInstagram,
      SITE_CONFIG.social.youtube,
      SITE_CONFIG.social.mcaWebsite,
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE_CONFIG.contact.staffCoordinator.phone,
        contactType: "faculty coordinator",
        name: SITE_CONFIG.contact.staffCoordinator.name,
      },
      {
        "@type": "ContactPoint",
        telephone: SITE_CONFIG.contact.studentCoordinator.phone,
        contactType: "student coordinator",
        name: SITE_CONFIG.contact.studentCoordinator.name,
      },
    ],
  };
}

/**
 * Generate WebSite JSON-LD
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    alternateName: ["Semaphore 2026", "Semaphore Fest NMAMIT", "AquaSaga 2026"],
    description: SITE_CONFIG.description,
    publisher: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    inLanguage: "en-IN",
  };
}

/**
 * Generate Main Fest Event JSON-LD (with sub-events)
 */
export function getMainEventSchema() {
  const publicEvents = eventsData.filter((e) => e.id !== "general-rules");

  const subEvents = publicEvents.map((evt) => ({
    "@type": "Event",
    name: `${evt.name} - ${evt.category} Competition`,
    description: `${evt.description}. Competition rules and guidelines under Semaphore 2K26.`,
    startDate: SITE_CONFIG.eventDates.start,
    endDate: SITE_CONFIG.eventDates.end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: `${SITE_CONFIG.venue.name} - ${SITE_CONFIG.venue.department}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.venue.streetAddress,
        addressLocality: SITE_CONFIG.venue.addressLocality,
        addressRegion: SITE_CONFIG.venue.addressRegion,
        postalCode: SITE_CONFIG.venue.postalCode,
        addressCountry: "IN",
      },
    },
    organizer: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    url: `${SITE_CONFIG.url}/info`,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${SITE_CONFIG.url}/#event`,
    name: "Semaphore 2K26: AquaSaga - National Level Technical Fest",
    alternateName: "Semaphore 2026 MCA Technical Fest",
    description: SITE_CONFIG.description,
    startDate: SITE_CONFIG.eventDates.start,
    endDate: SITE_CONFIG.eventDates.end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [
      `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
      `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
      `${SITE_CONFIG.url}${SITE_CONFIG.festLogo}`,
    ],
    location: {
      "@type": "Place",
      name: SITE_CONFIG.venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.venue.streetAddress,
        addressLocality: SITE_CONFIG.venue.addressLocality,
        addressRegion: SITE_CONFIG.venue.addressRegion,
        postalCode: SITE_CONFIG.venue.postalCode,
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: SITE_CONFIG.venue.geo.latitude,
        longitude: SITE_CONFIG.venue.geo.longitude,
      },
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.url}/events/register`,
      price: "2000",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
      description: "Team Registration fee of ₹2000 for full fest participation across all events.",
    },
    organizer: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    subEvent: subEvents,
  };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function getBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}
