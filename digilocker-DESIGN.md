---
version: alpha
name: "DigiLocker Government Portal"
description: "DigiLocker is India's official government digital document wallet portal. The design follows a Bootstrap-based system with a strong institutional blue (#1A73E9) as the primary action color, a dark navy top bar signaling government authority, and a white-dominant content surface. Card carousels with colorful category backgrounds (teal, green, purple, blue) surface new document issuers, while pill-shaped badges provide document-type navigation. Typography is Roboto-led with Noto Sans as a secondary face, maintaining accessible contrast ratios throughout. The layout is responsive across five breakpoints from 389px to 1024px+."
colors:
  government-navy: "#081854"
  lavender-surface: "#f1eeff"
  page-background-gray: "#f4f5f8"
  surface-white: "#ffffff"
  warm-off-white: "#fefafa"
  body-text-dark: "#212529"
  dark-charcoal: "#212121"
  deep-navy-text: "#121224"
  navy-link: "#000080"
  primary-blue: "#1a73e9"
  pure-black: "#000000"
  purple-accent: "#502ee3"
  border-gray: "#dddddd"
typography:
  body-default:
    fontFamily: "Roboto"
    fontSize: "15px"
    fontWeight: "400"
    lineHeight: "25.5px"
  card-title:
    fontFamily: "Roboto"
    fontSize: "14.961px"
    fontWeight: "700"
    lineHeight: "18.7px"
    letterSpacing: "-0.673px"
  body-small:
    fontFamily: "Roboto"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "23.8px"
  nav-label:
    fontFamily: "Roboto"
    fontSize: "16px"
    fontWeight: "500"
    lineHeight: "20px"
  caption-small:
    fontFamily: "Roboto"
    fontSize: "13px"
    fontWeight: "400"
    lineHeight: "22.1px"
  badge-label:
    fontFamily: "Roboto"
    fontSize: "12.598px"
    fontWeight: "700"
    lineHeight: "20.16px"
    letterSpacing: "-0.126px"
  section-heading:
    fontFamily: "Roboto"
    fontSize: "28px"
    fontWeight: "500"
    lineHeight: "33.6px"
  display-thin:
    fontFamily: "Roboto"
    fontSize: "30px"
    fontWeight: "100"
    lineHeight: "51px"
  noto-sans-body:
    fontFamily: "Noto Sans"
    fontSize: "15px"
    fontWeight: "400"
    lineHeight: "25.5px"
  noto-sans-label:
    fontFamily: "Noto Sans"
    fontSize: "13px"
    fontWeight: "600"
    lineHeight: "22.1px"
rounded:
  sm: "5px"
  md: "7.9px"
  base: "8px"
  lg: "10px"
  xl: "12px"
  2xl: "18px"
  3xl: "20px"
  pill: "60px"
  full-pill: "30px"
spacing:
  xs: "4px"
  sm: "5px"
  md-sm: "8px"
  md: "10px"
  md-lg: "12px"
  base: "15px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "48px"
  4xl: "62px"
  5xl: "65px"
  6xl: "70px"
---

## Overview

DigiLocker is India's official government digital document wallet portal. The design follows a Bootstrap-based system with a strong institutional blue (#1A73E9) as the primary action color, a dark navy top bar signaling government authority, and a white-dominant content surface. Card carousels with colorful category backgrounds (teal, green, purple, blue) surface new document issuers, while pill-shaped badges provide document-type navigation. Typography is Roboto-led with Noto Sans as a secondary face, maintaining accessible contrast ratios throughout. The layout is responsive across five breakpoints from 389px to 1024px+.

**Signature traits:**
- Dual typeface system: Pairs Roboto and Noto Sans across the type hierarchy.
- Soft, rounded geometry: Generous corner rounding up to 60px.
- Layered elevation: Depth comes from 5 validated shadow tokens.

## Colors

The palette uses 13 validated color tokens across 1 theme profile. Semantic roles stay attached to observed usage so generation agents can choose accents without inventing new color meaning.

**Semantic naming:**
- **action-text** maps to `primary-blue`: Role "text" is grounded by usage context "Primary CTA buttons (Login/Register), links, nav highlights, and brand color".
- **content-text** maps to `body-text-dark`: Role "text" is grounded by usage context "Body text, nav labels, and general foreground content".
- **action-background** maps to `surface-white`: Role "background" is grounded by usage context "Page background, card surfaces, and button text on colored backgrounds".
- **surface-background** maps to `government-navy`: Role "background" is grounded by usage context "Top government authority bar background".

### Text Scale
- **Body Text Dark** (#212529): Body text, nav labels, and general foreground content. Role: text. {authored: rgb(33, 37, 41), space: rgb}
- **Dark Charcoal** (#212121): Secondary text and label elements. Role: text. {authored: rgb(33, 33, 33), space: rgb}
- **Deep Navy Text** (#121224): Footer text and deep dark content areas. Role: text. {authored: rgb(18, 18, 36), space: rgb}
- **Navy Link** (#000080): Footer hyperlinks in government-standard navy. Role: text. {authored: rgb(0, 0, 128), space: rgb}
- **Primary Blue** (#1a73e9): Primary CTA buttons (Login/Register), links, nav highlights, and brand color. Role: text. {authored: rgb(26, 115, 233), space: rgb}
- **Pure Black** (#000000): High-contrast text elements and icon fills. Role: text. {authored: rgb(0, 0, 0), space: rgb, alpha: 0.176}
- **Purple Accent** (#502ee3): Pill badge text color and accent highlights for document taxonomy. Role: text. {authored: rgb(80, 46, 227), space: rgb}

### Interactive
- **Border Gray** (#dddddd): Card borders and divider lines. Role: border. {authored: rgb(221, 221, 221), space: rgb}

### Surface & Shadows
- **Government Navy** (#081854): Top government authority bar background. Role: background. {authored: rgb(8, 24, 84), space: rgb}
- **Lavender Surface** (#f1eeff): Pill badge background and light accent surfaces. Role: background. {authored: rgb(241, 238, 255), space: rgb}
- **Page Background Gray** (#f4f5f8): Section backgrounds and subtle surface fills. Role: background. {authored: rgba(244, 245, 248, 0.5), space: rgb, alpha: 0.5}
- **Surface White** (#ffffff): Page background, card surfaces, and button text on colored backgrounds. Role: background. {authored: rgb(255, 255, 255), space: rgb}
- **Warm Off-White** (#fefafa): Subtle warm surface variant for card backgrounds. Role: background. {authored: rgba(254, 250, 250, 0.024), space: rgb, alpha: 0.024}

## Typography

Typography uses Roboto, Noto Sans across extracted hierarchy roles. Keep hierarchy mapped to these token rows before adding decorative type styles.

Mixes Roboto and Noto Sans for visual contrast. Weight range spans regular, bold, medium, light, semi-bold. Sizes range from 12.598px to 30px.

### Font Roles
- **Headline Font**: Roboto
- **Body Font**: Roboto

### Type Scale Evidence
| Role | Font | Size | Weight | Line Height | Letter Spacing | Stack / Features | Notes |
|------|------|------|--------|-------------|----------------|------------------|-------|
| Primary body text across all content areas | Roboto | 15px | 400 | 25.5px | normal | Roboto, Open Sans, sans-serif | Extracted token |
| Issuer card headings and document category titles | Roboto | 14.961px | 700 | 18.7px | -0.673px | Roboto, Open Sans, sans-serif | Extracted token |
| Secondary body text and card descriptions | Roboto | 14px | 400 | 23.8px | normal | Roboto, Open Sans, sans-serif | Extracted token |
| Navigation items and medium-emphasis UI labels | Roboto | 16px | 500 | 20px | normal | Roboto, Open Sans, sans-serif | Extracted token |
| Captions, metadata, and fine-print text | Roboto | 13px | 400 | 22.1px | normal | Roboto, Open Sans, sans-serif | Extracted token |
| Badge and pill label text | Roboto | 12.598px | 700 | 20.16px | -0.126px | Roboto, Open Sans, sans-serif | Extracted token |
| Section headings like 'New in DigiLocker' | Roboto | 28px | 500 | 33.6px | normal | Roboto, Open Sans, sans-serif | Extracted token |
| Large display or hero text elements | Roboto | 30px | 100 | 51px | normal | Roboto, Open Sans, sans-serif | Extracted token |
| Secondary body text, likely for Indic script fallback support | Noto Sans | 15px | 400 | 25.5px | normal | Noto Sans, sans-serif | Extracted token |
| Semi-bold labels and UI element text in Noto Sans | Noto Sans | 13px | 600 | 22.1px | normal | Noto Sans, sans-serif | Extracted token |

## Layout

Responsive system uses 1 breakpoint tier(s): mobile.

This system uses a 8px base grid with scale values 4, 5, 8, 10, 12, 15, 16, 20, 24, 48, 62, 65, 70.

### Responsive Strategy
- **mobile (576-1024px)**: Constrain layout for small viewports and prioritize vertical stacking.

### Spacing System
| Token | Value | Px | Notes |
|------|-------|----|-------|
| xs | 4px | 4 | Extracted spacing token |
| sm | 5px | 5 | Extracted spacing token |
| md-sm | 8px | 8 | Extracted spacing token |
| md | 10px | 10 | Extracted spacing token |
| md-lg | 12px | 12 | Extracted spacing token |
| base | 15px | 15 | Extracted spacing token |
| lg | 16px | 16 | Extracted spacing token |
| xl | 20px | 20 | Extracted spacing token |
| 2xl | 24px | 24 | Extracted spacing token |
| 3xl | 48px | 48 | Extracted spacing token |
| 4xl | 62px | 62 | Extracted spacing token |
| 5xl | 65px | 65 | Extracted spacing token |
| 6xl | 70px | 70 | Extracted spacing token |

## Elevation & Depth

Keep depth flat unless validated shadow or interaction evidence appears in the extraction payload. Do not invent shadows beyond this evidence boundary.

### Shadow Evidence
| Shadow Token | Layers | Details |
|--------------|--------|---------|
| card-subtle | 1 | 0px 2px 4px 0px rgba(0, 0, 0, 0.075) |
| button-blue-glow | 1 | 0px 2px 8px 0px rgba(0, 0, 255, 0.3) |
| card-lift | 1 | 0px 8px 16px 0px rgba(0, 0, 0, 0.15) |
| card-layered | 2 | 0px 7px 14px 0px rgba(59, 65, 94, 0.1) |
| card-medium | 1 | 0px 4px 8px 0px rgba(0, 0, 0, 0.3) |

### Interaction Signals
| Theme | Signal | Evidence |
|-------|--------|----------|
| Light | outline-style | solid |
| Light | outline-color | rgb(33, 37, 41) ; rgb(255, 255, 255) ; rgb(26, 115, 233) |
| Light | outline-width | 0px ; 3px ; 2px |
| Light | outline-offset | 0px |
| Light | transform | matrix(1, 0, 0, 1, 0, 0) ; matrix(-1, 0, 0, 1, 0, 0) ; matrix(1, 0, 0, 1, -1357, 0) |

## Shapes

Shape language maps directly to rounded tokens. Keep component corners consistent with the role mapping below before introducing bespoke geometry.

### Radius Roles
| Token | Value | Px | Role Mapping |
|------|-------|----|--------------|
| sm | 5px | 5 | Subtle corner |
| md | 7.9px | 7.9 | Control corner |
| base | 8px | 8 | Control corner |
| lg | 10px | 10 | Control corner |
| xl | 12px | 12 | Control corner |
| 2xl | 18px | 18 | Card corner |
| 3xl | 20px | 20 | Card corner |
| full-pill | 30px | 30 | Large surface corner |
| pill | 60px | 60 | Large surface corner |

### Geometry Evidence
| Radius Token | Shape | Units |
|--------------|-------|-------|
| sm | 5px | px |
| md | 7.9px | px |
| base | 8px | px |
| lg | 10px | px |
| xl | 12px | px |
| 2xl | 18px | px |
| 3xl | 20px | px |
| pill | 60px | px |
| full-pill | 30px | px |

## Components

(none detected)

## Do's and Don'ts

Guardrails protect Dual typeface system, Soft, rounded geometry, Layered elevation without adding unsupported visual claims.

| Do | Don't |
|----|---------|
| Do maintain consistent spacing using the base grid | Don't make unsupported claims about absent visual features |
| Do maintain WCAG AA contrast ratios (4.5:1 for normal text) | Don't mix rounded and sharp corners in the same view |
| Do use the primary color only for the single most important action per screen |  |
| Do verify evidence before writing new design-system guidance |  |

## Responsive Evidence

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <= 389px | screen and (max-width: 389px) |
| Mobile | <= 575px | screen and (max-width: 575px) |
| Mobile | <= 575.98px | (max-width: 575.98px) |
| Breakpoint 4 | <= 768px | screen and (max-width: 768px) |
| Breakpoint 5 | <= 992px | screen and (max-width: 992px) |
| Breakpoint 6 | <= 1024px | screen and (max-width: 1024px) |
| Mobile | 576-767px | screen and (min-width: 576px) and (max-width: 767px) |

## Agent Prompt Guide

### Example Component Prompts
- Create button component using validated primary color role and spacing tokens.
- Create card component with mapped radius role and evidence-backed elevation.
- Create form input component using inferred typography hierarchy and border roles.

### Iteration Guide
1. Start with extracted palette and typography roles only.
2. Map spacing and radius directly from token tables before visual polish.
3. Apply component patterns one section at a time and compare against source intent.
4. Keep elevation claims tied to explicit evidence in output.
5. Iterate with smallest diffs and re-check section hierarchy after each change.
