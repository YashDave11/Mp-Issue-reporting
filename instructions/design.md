# UX4G Design System Documentation

## Overview

UX4G (User Experience for Government) is a comprehensive design system developed by NeGD, MeitY for building consistent, accessible government digital applications. This design system is based on UX4G v2.0.8.

**License:** MIT  
**Documentation:** https://doc.ux4g.gov.in  
**Copyright:** 2024-2025 The UX4G Authors, NeGD, MeitY

---

## Design System Architecture

### Core Components

1. **CSS Framework** - Grid system, utilities, and component styles
2. **Typography System** - Fonts, headings, and text styles
3. **Color Palette** - Government-standard colors with variants
4. **Component Library** - Pre-built UI components
5. **JavaScript Interactions** - Dynamic behaviors and functionality
6. **Icon Systems** - Government, state, country, and social icons

---

## Typography

### Font Family

**Primary Font:** Noto Sans

- Font files: `NotoSans-Regular.ttf`, `.woff`, `.woff2`
- Fallback: `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

```css
--bs-font-sans-serif: "Noto Sans", sans-serif;
--bs-body-font-family: "Noto Sans", system-ui, -apple-system, "Segoe UI", ...;
```

### Heading Hierarchy

| Element  | Desktop Size   | Line Height | Weight |
| -------- | -------------- | ----------- | ------ |
| H1 / .h1 | 2.5rem (40px)  | 1.2         | 500    |
| H2 / .h2 | 2rem (32px)    | 1.2         | 500    |
| H3 / .h3 | 1.75rem (28px) | 1.2         | 500    |
| H4 / .h4 | 1.5rem (24px)  | 1.2         | 500    |
| H5 / .h5 | 1.25rem (20px) | 1.2         | 500    |
| H6 / .h6 | 1rem (16px)    | 1.2         | 500    |

### Display Text

| Class      | Size          | Line Height     | Weight | Usage              |
| ---------- | ------------- | --------------- | ------ | ------------------ |
| .display-1 | 5rem (80px)   | 6.25rem (100px) | 400    | Hero headlines     |
| .display-2 | 4.5rem (72px) | 5.5rem (88px)   | 400    | Large headers      |
| .display-3 | 4rem (64px)   | 5rem (80px)     | 400    | Section headers    |
| .display-4 | 3.5rem (56px) | 4.5rem (72px)   | 400    | Subsection headers |
| .display-5 | 3rem (48px)   | 3.5rem (56px)   | 400    | Page titles        |
| .display-6 | 2.5rem (40px) | 3rem (48px)     | 400    | Card headers       |

### Title Variants

| Class    | Size            | Line Height | Letter Spacing | Weight |
| -------- | --------------- | ----------- | -------------- | ------ |
| .title-1 | 1.375rem (22px) | 1.75rem     | -              | 500    |
| .title-2 | 1rem (16px)     | 1.5rem      | 0.00938rem     | 500    |
| .title-3 | 0.875rem (14px) | 1.25rem     | 0.0063rem      | 500    |

### Label Variants

| Class    | Size             | Line Height | Letter Spacing | Weight |
| -------- | ---------------- | ----------- | -------------- | ------ |
| .label-1 | 0.875rem (14px)  | 1.25rem     | 0.0063rem      | 500    |
| .label-2 | 0.75rem (12px)   | 1rem        | 0.0313rem      | 500    |
| .label-3 | 0.6875rem (11px) | 1rem        | 0.0313rem      | 500    |

### Body Text

| Class   | Size            | Line Height | Letter Spacing | Weight | Usage             |
| ------- | --------------- | ----------- | -------------- | ------ | ----------------- |
| .body-1 | 1rem (16px)     | 1.5rem      | 0.03125rem     | 400    | Primary content   |
| .body-2 | 0.875rem (14px) | 1.25rem     | 0.01563rem     | 400    | Secondary content |
| .body-3 | 0.75rem (12px)  | 1rem        | 0.25rem        | 400    | Captions          |

### Font Utilities

- `.lead` - 1.25rem, font-weight: 300 (intro paragraphs)
- `.small` / `<small>` - 0.75rem (12px)
- `.initialism` - 0.875em, uppercase (abbreviations)

---

## Color System

### Primary Colors

```css
--bs-primary: #613af5 (Purple) --bs-secondary: #938bb6 (Light Purple)
  --bs-success: #3c9718 (Green) --bs-info: #00aaff (Cyan) --bs-warning: #b77224
  (Orange) --bs-danger: #b7131a (Red) --bs-light: #f8f9fa --bs-dark: #212121;
```

### Extended Color Palette

#### Primary Variants (Purple)

- **900** - #392095 (Darkest)
- **800** - #4A2BC2
- **700** - #5F39E9
- **600** - #774BFF (Link hover)
- **500** - #9161FF
- **400** - #AC7AFF
- **300** - #C495FF
- **200** - #DAB2FF
- **100** - #ECD0FF
- **50** - #FAEFFF (Lightest)

#### Secondary Variants (Light Purple)

- **900** - #3A364F
- **800** - #4D4768
- **700** - #60597F
- **600** - #746D96
- **500** - #8981AB
- **400** - #9E96BE
- **300** - #B3ACCF
- **200** - #C9C3DE
- **100** - #DEDBEC
- **50** - #F4F3F9

#### Success Variants (Green)

- **900** - #044400
- **800** - #024900
- **700** - #005A00
- **600** - #107400
- **500** - #389314
- **400** - #69B349
- **300** - #9BCF80
- **200** - #C6E5B5
- **100** - #E3F2D9
- **50** - #EDF7E6

#### Danger Variants (Red)

- **900** - #741010
- **800** - #961416
- **700** - #B72120
- **600** - #D4362E
- **500** - #EC5042
- **400** - #FF6C5A
- **300** - #FF8B78
- **200** - #FFAC9A
- **100** - #FFCDC0
- **50** - #FFEEEA

#### Warning Variants (Orange)

- **900** - #573000
- **800** - #713F00
- **700** - #8B5000
- **600** - #A46212
- **500** - #BB772B
- **400** - #D08D47
- **300** - #E2A468
- **200** - #F0BD8F
- **100** - #F9D7B9
- **50** - #FEF1E7

#### Gray Scale

- **900** - #393939
- **800** - #4B4B4B
- **700** - #5E5E5E
- **600** - #727272
- **500** - #868686
- **400** - #9B9B9B
- **300** - #B0B0B0
- **200** - #C6C6C6
- **100** - #DDD
- **50** - #F3F3F3

### Color Utility Classes

#### Background Colors

```css
.bg-primary-{50-900}     /* Purple backgrounds */
.bg-secondary-{50-900}   /* Light purple backgrounds */
.bg-success-{50-900}     /* Green backgrounds */
.bg-danger-{50-900}      /* Red backgrounds */
.bg-warning-{50-900}     /* Orange backgrounds */
.bg-gray-{50-900}        /* Gray backgrounds */
```

#### Text Colors

```css
.text-primary-{50-900}
.text-secondary-{50-900}
.text-success-{50-900}
.text-danger-{50-900}
.text-warning-{50-900}
.text-gray-{50-900}
```

#### Border Colors

```css
.border-primary-{50-900}
.border-secondary-{50-900}
.border-success-{50-900}
.border-danger-{50-900}
.border-warning-{50-900}
.border-gray-{50-900}
```

---

## Grid System

### Container Types

| Container Class    | Max Width (Breakpoint)                  |
| ------------------ | --------------------------------------- |
| `.container`       | Responsive max-width at each breakpoint |
| `.container-sm`    | 540px @ sm (576px)                      |
| `.container-md`    | 720px @ md (768px)                      |
| `.container-lg`    | 960px @ lg (992px)                      |
| `.container-xl`    | 1140px @ xl (1200px)                    |
| `.container-xxl`   | 1320px @ xxl (1400px)                   |
| `.container-fluid` | 100% width at all breakpoints           |

### Breakpoints

| Name              | Prefix | Min Width | Typical Device   |
| ----------------- | ------ | --------- | ---------------- |
| Extra small       | (none) | <576px    | Portrait phones  |
| Small             | `sm`   | ≥576px    | Landscape phones |
| Medium            | `md`   | ≥768px    | Tablets          |
| Large             | `lg`   | ≥992px    | Desktops         |
| Extra large       | `xl`   | ≥1200px   | Large desktops   |
| Extra extra large | `xxl`  | ≥1400px   | Larger desktops  |

### Grid Columns

- 12-column grid system
- Responsive column classes: `.col-{breakpoint}-{size}`
- Auto-layout columns: `.col`, `.col-auto`
- Row columns: `.row-cols-{breakpoint}-{1-6}`

**Example:**

```html
<div class="container">
  <div class="row">
    <div class="col-md-6 col-lg-4">Column 1</div>
    <div class="col-md-6 col-lg-4">Column 2</div>
    <div class="col-md-12 col-lg-4">Column 3</div>
  </div>
</div>
```

### Gutters

| Class                      | Spacing       |
| -------------------------- | ------------- |
| `.g-0` / `.gx-0` / `.gy-0` | 0             |
| `.g-1` / `.gx-1` / `.gy-1` | 0.25rem (4px) |
| `.g-2` / `.gx-2` / `.gy-2` | 0.5rem (8px)  |
| `.g-3` / `.gx-3` / `.gy-3` | 1rem (16px)   |
| `.g-4` / `.gx-4` / `.gy-4` | 1.5rem (24px) |
| `.g-5` / `.gx-5` / `.gy-5` | 3rem (48px)   |

- `g-` = both horizontal and vertical gutters
- `gx-` = horizontal gutters only
- `gy-` = vertical gutters only

### Offsets

```css
.offset-{1-11}        /* Offset columns */
.offset-{breakpoint}-{1-11}  /* Responsive offsets */
```

---

## Spacing System

### Scale

| Value | rem     | px   |
| ----- | ------- | ---- |
| 0     | 0       | 0    |
| 1     | 0.25rem | 4px  |
| 2     | 0.5rem  | 8px  |
| 3     | 1rem    | 16px |
| 4     | 1.5rem  | 24px |
| 5     | 3rem    | 48px |

### Margin Utilities

```css
.m-{0-5}      /* All sides */
.mt-{0-5}     /* Top */
.mr-{0-5}     /* Right */
.mb-{0-5}     /* Bottom */
.ml-{0-5}     /* Left */
.mx-{0-5}     /* Horizontal (left + right) */
.my-{0-5}     /* Vertical (top + bottom) */
.m-auto       /* Margin auto */
```

### Padding Utilities

```css
.p-{0-5}      /* All sides */
.pt-{0-5}     /* Top */
.pr-{0-5}     /* Right */
.pb-{0-5}     /* Bottom */
.pl-{0-5}     /* Left */
.px-{0-5}     /* Horizontal (left + right) */
.py-{0-5}     /* Vertical (top + bottom) */
```

### Responsive Spacing

All spacing utilities support responsive breakpoints:

```css
.m{t|r|b|l|x|y}-{breakpoint}-{0-5}
.p{t|r|b|l|x|y}-{breakpoint}-{0-5}
```

**Example:** `.mt-3 .mt-md-4 .mt-lg-5`

---

## Border System

### Border Radius

```css
--bs-border-radius: 0.375rem (6px) --bs-border-radius-sm: 0.25rem (4px)
  --bs-border-radius-lg: 0.5rem (8px) --bs-border-radius-xl: 1rem (16px)
  --bs-border-radius-2xl: 2rem (32px) --bs-border-radius-pill: 6.25rem (100px);
```

### Border Utilities

```css
.border               /* Add border on all sides */
.border-{top|right|bottom|left}  /* Single side */
.border-0             /* Remove all borders */
.border-{top|right|bottom|left}-0  /* Remove single side */

.border-{1-5}         /* Border width */

.rounded              /* Border radius 0.25rem */
.rounded-{0|1|2|3}    /* Specific radius */
.rounded-circle       /* 50% radius (circular) */
.rounded-pill         /* 50rem radius (pill shape) */
.rounded-{top|end|bottom|start}  /* Side-specific radius */
```

---

## Icon Systems

### Government Icons

UX4G provides sprite-based government icons:

```css
.gov-icons               /* Base class */
.gov-icons-in-flag       /* Indian flag - 99x66px */
.gov-icons-emblem        /* National emblem - 60x110px */
.gov-icons-digital-india /* Digital India logo - 130x54px */
.gov-icons-nic           /* NIC logo - 135x54px */
.gov-icons-negd          /* NeGD logo - 121x54px */
.gov-icons-gov-in        /* Gov.in logo - 143x54px */
.gov-icons-aadhaar       /* Aadhaar logo - 110x60px */
.gov-icons-UPI           /* UPI logo - 129x53px */
.gov-icons-mygov         /* MyGov logo - 109x83px */
```

**Usage:**

```html
<span class="gov-icons gov-icons-in-flag"></span>
<span class="gov-icons gov-icons-emblem"></span>
```

### State Icons

```css
.state-icons                    /* Base class */
.state-icons-andhra-pradesh     /* 109x118px */
/* Additional state icons follow the same pattern */
```

### Union Territory Icons

```css
.ut-icons                      /* Base class */
.ut-icons-andaman-n-nicobar    /* 166x108px */
/* Additional UT icons follow the same pattern */
```

### Country Icons

```css
.country-icons          /* Base class */
.country-icons-af       /* Afghanistan - 65x67px */
/* Additional country icons follow the same pattern */
```

### Social Icons

```css
.social-icons              /* Base class */
.social-icons-facebook     /* 65x67px */
/* Additional social icons follow the same pattern */
```

---

## Display & Visibility

### Display Utilities

```css
.d-none               /* display: none */
.d-inline             /* display: inline */
.d-inline-block       /* display: inline-block */
.d-block              /* display: block */
.d-table              /* display: table */
.d-table-row          /* display: table-row */
.d-table-cell         /* display: table-cell */
.d-flex               /* display: flex */
.d-inline-flex        /* display: inline-flex */
.d-grid               /* display: grid */
```

All display utilities support responsive breakpoints:

```css
.d-{breakpoint}-{value}
```

**Example:** `.d-none .d-md-block`

### Visibility Utilities

```css
.visible              /* visibility: visible */
.invisible            /* visibility: hidden */
.visually-hidden      /* Screen reader only content */
```

---

## Flexbox Utilities

### Flex Container

```css
.d-flex                    /* Enable flexbox */
.d-inline-flex             /* Inline flex */
.flex-row                  /* Row direction */
.flex-column               /* Column direction */
.flex-row-reverse          /* Reverse row */
.flex-column-reverse       /* Reverse column */
.flex-wrap                 /* Allow wrapping */
.flex-nowrap               /* No wrapping */
.flex-wrap-reverse         /* Wrap reverse */
```

### Justify Content

```css
.justify-content-start     /* Flex items at start */
.justify-content-end       /* Flex items at end */
.justify-content-center    /* Center items */
.justify-content-between   /* Space between */
.justify-content-around    /* Space around */
.justify-content-evenly    /* Space evenly */
```

### Align Items

```css
.align-items-start         /* Items at start */
.align-items-end           /* Items at end */
.align-items-center        /* Center items */
.align-items-baseline      /* Baseline alignment */
.align-items-stretch       /* Stretch items */
```

### Align Self

```css
.align-self-auto           /* Default alignment */
.align-self-start          /* Self at start */
.align-self-end            /* Self at end */
.align-self-center         /* Center self */
.align-self-baseline       /* Baseline */
.align-self-stretch        /* Stretch self */
```

### Flex Grow & Shrink

```css
.flex-grow-0               /* Don't grow */
.flex-grow-1               /* Allow growth */
.flex-shrink-0             /* Don't shrink */
.flex-shrink-1             /* Allow shrinking */
.flex-fill                 /* Fill available space */
```

### Gap Utilities

```css
.gap-0                     /* No gap */
.gap-1                     /* 0.25rem gap */
.gap-2                     /* 0.5rem gap */
.gap-3                     /* 1rem gap */
.gap-4                     /* 1.5rem gap */
.gap-5                     /* 3rem gap */
```

### Order

```css
.order-first               /* Order -1 */
.order-0 through .order-5  /* Order 0-5 */
.order-last                /* Order 6 */
```

All flexbox utilities support responsive breakpoints.

---

## Position Utilities

```css
.position-static           /* Static positioning */
.position-relative         /* Relative positioning */
.position-absolute         /* Absolute positioning */
.position-fixed            /* Fixed positioning */
.position-sticky           /* Sticky positioning */

.top-0, .top-50, .top-100
.bottom-0, .bottom-50, .bottom-100
.start-0, .start-50, .start-100    /* Left in LTR */
.end-0, .end-50, .end-100          /* Right in LTR */

.translate-middle          /* Center element */
.translate-middle-x        /* Center horizontally */
.translate-middle-y        /* Center vertically */
```

### Fixed Positioning

```css
.fixed-top                 /* Stick to top */
.fixed-bottom              /* Stick to bottom */
.sticky-top                /* Sticky at top */
.sticky-{breakpoint}-top   /* Responsive sticky */
```

---

## Sizing Utilities

### Width

```css
.w-25                      /* Width 25% */
.w-50                      /* Width 50% */
.w-75                      /* Width 75% */
.w-100                     /* Width 100% */
.w-auto                    /* Width auto */
.mw-100                    /* Max-width 100% */
.vw-100                    /* Width 100vw */
.min-vw-100                /* Min-width 100vw */
```

### Height

```css
.h-25                      /* Height 25% */
.h-50                      /* Height 50% */
.h-75                      /* Height 75% */
.h-100                     /* Height 100% */
.h-auto                    /* Height auto */
.mh-100                    /* Max-height 100% */
.vh-100                    /* Height 100vh */
.min-vh-100                /* Min-height 100vh */
```

---

## Text Utilities

### Alignment

```css
.text-start                /* Left align (LTR) */
.text-center               /* Center align */
.text-end                  /* Right align (LTR) */
```

### Transform

```css
.text-lowercase            /* Transform to lowercase */
.text-uppercase            /* Transform to uppercase */
.text-capitalize           /* Capitalize first letter */
```

### Font Weight & Style

```css
.fw-light                  /* Font weight 300 */
.fw-lighter                /* Lighter than parent */
.fw-normal                 /* Font weight 400 */
.fw-bold                   /* Font weight 700 */
.fw-bolder                 /* Bolder than parent */

.fst-italic                /* Italic style */
.fst-normal                /* Normal style */
```

### Line Height

```css
.lh-1                      /* Line height 1 */
.lh-sm                     /* Line height 1.25 */
.lh-base                   /* Line height 1.5 */
.lh-lg                     /* Line height 2 */
```

### Font Size

```css
.fs-1                      /* calc(1.375rem + 1.5vw) */
.fs-2                      /* calc(1.325rem + 0.9vw) */
.fs-3                      /* calc(1.3rem + 0.6vw) */
.fs-4                      /* calc(1.275rem + 0.3vw) */
.fs-5                      /* 1.25rem */
.fs-6                      /* 1rem */
```

### Text Decoration

```css
.text-decoration-none            /* No decoration */
.text-decoration-underline       /* Underline */
.text-decoration-line-through    /* Strike through */
```

### Text Wrapping

```css
.text-wrap                 /* Allow wrapping */
.text-nowrap               /* Prevent wrapping */
.text-truncate             /* Truncate with ellipsis */
.text-break                /* Break long words */
```

### Text Utilities (Other)

```css
.font-monospace            /* Monospace font */
.text-reset                /* Reset text color */
.text-muted                /* Muted text color (#6c757d) */
```

---

## Shadow Utilities

```css
.shadow                    /* Default shadow */
.shadow-sm                 /* Small shadow */
.shadow-lg                 /* Large shadow */
.shadow-none               /* Remove shadow */
```

**Shadow Values:**

- `.shadow-sm`: 0 0.125rem 0.25rem rgba(0,0,0,0.075)
- `.shadow`: 0 0.5rem 1rem rgba(0,0,0,0.15)
- `.shadow-lg`: 0 1rem 3rem rgba(0,0,0,0.175)

---

## Overflow Utilities

```css
.overflow-auto             /* Auto overflow */
.overflow-hidden           /* Hide overflow */
.overflow-visible          /* Show overflow */
.overflow-scroll           /* Always show scrollbars */
```

---

## Interaction Utilities

### User Select

```css
.user-select-all           /* Select all text */
.user-select-auto          /* Default select behavior */
.user-select-none          /* Prevent text selection */
```

### Pointer Events

```css
.pe-none                   /* Disable pointer events */
.pe-auto                   /* Enable pointer events */
```

---

## Date & Time Components

### Date Range Picker

UX4G includes a customized daterangepicker component:

**Features:**

- Single date or range selection
- Month/year dropdowns
- Time selection support
- Responsive design
- Customizable ranges
- RTL support

**Styling:**

- Active date: Background `#613AF5` (primary purple)
- In-range dates: Background `#FAEFFF` (lightest purple)
- Hover state: Background `#613AF5`, text white
- Border radius: 4px
- Font size: 12px for calendar, 15px base

**Calendar Table:**

- Cell size: 24x24px minimum
- Cell border-radius: 4px
- Date range start/end: Custom radius (4px 0 0 4px / 0 4px 4px 0)

**Positioning:**

- Z-index: 3001
- Dropdown indicators supported
- Auto-positioning (left/right/center)

---

## JavaScript Components & Interactions

### Core JavaScript Features

1. **Popper.js Integration** - For positioning tooltips, popovers, dropdowns
2. **Event Handling System** - Custom event delegation
3. **Transition Management** - Smooth transitions and animations
4. **Accessibility Support** - ARIA attributes and keyboard navigation

### Mobile Menu (meanmenu)

Configuration:

```javascript
$("#mobile-menu").meanmenu({
  meanMenuContainer: ".mobile-menu",
  meanScreenWidth: "992",
  onePage: true,
});
```

### Data Attributes

**Background Images:**

```html
<div data-background="path/to/image.jpg"></div>
```

Automatically applies as CSS background-image.

**Animations:**

```html
<div data-animation="fadeInUp" data-delay="0.3s"></div>
```

Used with slider animations.

### Slider/Carousel

Features:

- Autoplay support (configurable)
- Fade transitions
- Custom animation delays
- Responsive breakpoints
- Animation end event handling

### Pricing/Selection Boxes

Interactive hover states:

- On mouseenter, adds `.active` class
- Removes `.active` from siblings
- Smooth transitions

### Scroll to Top

Configuration:

```javascript
$.scrollUp({
  scrollName: "scrollUp",
  topDistance: "300", // Distance from top (px)
  topSpeed: 300, // Speed back to top (ms)
  animation: "fade", // Fade, slide, none
  animationInSpeed: 200,
  animationOutSpeed: 200,
  scrollText: '<i class="fas fa-long-arrow-alt-up"></i>',
  activeOverlay: false,
});
```

### Animation Library (WOW.js)

Initialization:

```javascript
new WOW().init();
```

Enables scroll-triggered animations for enhanced user experience.

---

## Form Components

### Input Fields

**Search Input:**

- Background icon: `url("../images/search.svg")`
- Icon position: Right side
- Padding: Adjusted for icon space

**Input States:**

- `:focus` - Focus ring with primary color
- `:disabled` - Opacity 0.65
- `.disabled` - Visual disabled state

### Form Validation

- Supported states: Valid, invalid, custom validation
- Visual feedback through border colors
- Icon indicators for success/error states

### Select Dropdowns

- Custom styling support
- Disabled state with opacity
- Consistent height and padding

---

## Accessibility Guidelines

### General Principles

1. **Semantic HTML** - Use proper HTML elements (buttons, links, headings)
2. **Keyboard Navigation** - All interactive elements accessible via keyboard
3. **Screen Reader Support** - ARIA labels and descriptions
4. **Color Contrast** - WCAG AA compliant color combinations
5. **Focus Indicators** - Visible focus states on all interactive elements

### Accessibility Utilities

```css
.visually-hidden           /* Hide visually, keep for screen readers */
.visually-hidden-focusable /* Show on focus */
```

### Button Focus States

- Default focus ring removed for `:focus:not(:focus-visible)`
- Custom focus shadow: `--bs-btn-focus-shadow`
- Keyboard users see focus indicators

### ARIA Support

- Dynamic content announces changes
- Modal dialogs with proper roles
- Form validation messages linked to inputs
- Skip navigation links for keyboard users

---

## Responsive Design Patterns

### Mobile-First Approach

All styles are built mobile-first, with larger screens as progressive enhancement.

### Breakpoint Usage Guidelines

1. **Mobile (< 576px):** Single column layouts, larger touch targets
2. **Tablet (576px - 991px):** 2-column layouts, sidebar navigation
3. **Desktop (992px+):** Multi-column layouts, hover interactions
4. **Large Desktop (1200px+):** Wider containers, more content density
5. **Extra Large (1400px+):** Maximum container width, additional spacing

### Responsive Text

Use responsive font-size utilities:

```css
.fs-{1-6}  /* Auto-scales with viewport */
```

### Responsive Images

```css
.img-fluid              /* Max-width 100%, height auto */
.img-thumbnail          /* Bordered, padded thumbnail */
```

---

## Performance Considerations

### CSS Loading Strategy

1. **ux4g-reboot.css** - CSS reset and normalization (load first)
2. **ux4g-grid.css** - Grid system (load early for layout)
3. **ux4g-utilities.css** - Utility classes
4. **ux4g.css** - Main component styles
5. **ux4g-date-time.css** - Date picker styles (conditional)

### JavaScript Loading

1. **Dependencies:** Popper.js (for positioning)
2. **Core:** ux4g.js (main framework)
3. **Plugins:** ux4g-main.js (optional features)
4. **Charts/Maps:** Load only when needed

### Minified Versions

Production should use minified files:

- `ux4g.min.css` (compressed CSS)
- `ux4g.bundle.min.js` (bundled + minified JS)

---

## RTL (Right-to-Left) Support

UX4G provides full RTL support for languages like Arabic, Hebrew, Urdu:

### RTL Files

- `ux4g.rtl.css` - RTL version of main stylesheet
- `ux4g-grid.rtl.css` - RTL grid system
- `ux4g-utilities.rtl.css` - RTL utilities
- `ux4g-reboot.rtl.css` - RTL reset

### RTL Detection

```javascript
const isRTL = () => document.documentElement.dir === "rtl";
```

### RTL Considerations

- Flexbox direction automatically flips
- Margin/padding: `ms-` (margin-start) and `me-` (margin-end) are direction-aware
- Icons and images may need mirroring
- Custom properties maintain consistent naming

---

## Browser Support

### Supported Browsers

- **Chrome:** Latest 2 versions
- **Firefox:** Latest 2 versions + ESR
- **Safari:** Latest 2 versions
- **Edge:** Latest 2 versions
- **Opera:** Latest 2 versions

### Mobile Browsers

- **iOS Safari:** iOS 12+
- **Chrome for Android:** Latest
- **Samsung Internet:** Latest

### Fallbacks

- CSS Custom Properties with fallback values
- Flexbox with graceful degradation
- Progressive enhancement approach

---

## File Structure

```
UX4G@2.0.8/
├── css/
│   ├── ux4g.css                    # Main stylesheet
│   ├── ux4g.min.css                # Minified main
│   ├── ux4g.rtl.css                # RTL version
│   ├── ux4g.rtl.min.css            # RTL minified
│   ├── ux4g-grid.css               # Grid system
│   ├── ux4g-grid.min.css           # Grid minified
│   ├── ux4g-utilities.css          # Utility classes
│   ├── ux4g-utilities.min.css      # Utilities minified
│   ├── ux4g-reboot.css             # CSS reset
│   ├── ux4g-reboot.min.css         # Reset minified
│   └── ux4g-date-time.css          # Date picker styles
├── js/
│   ├── ux4g.js                     # Main JavaScript
│   ├── ux4g.min.js                 # Minified main JS
│   ├── ux4g.bundle.js              # Bundled with dependencies
│   ├── ux4g.bundle.min.js          # Bundled + minified
│   ├── ux4g.esm.js                 # ES Module version
│   ├── ux4g-main.js                # Additional features
│   ├── ux4g-chart.js               # Chart components
│   ├── ux4g-map.js                 # Map components
│   └── ux4g-date-time-*.js         # Date picker scripts
└── fonts/
    └── NotoSans-Regular.ttf        # Primary font
```

---

## Getting Started

### Basic HTML Template

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UX4G Project</title>

    <!-- UX4G CSS -->
    <link rel="stylesheet" href="css/ux4g-reboot.css" />
    <link rel="stylesheet" href="css/ux4g-grid.css" />
    <link rel="stylesheet" href="css/ux4g-utilities.css" />
    <link rel="stylesheet" href="css/ux4g.css" />
  </head>
  <body>
    <div class="container">
      <h1>Welcome to UX4G</h1>
      <p class="lead">Government-standard design system</p>
    </div>

    <!-- UX4G JavaScript -->
    <script src="js/ux4g.bundle.min.js"></script>
    <script src="js/ux4g-main.js"></script>
  </body>
</html>
```

### CDN Usage (if available)

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.example.com/ux4g/2.0.8/ux4g.min.css" />

<!-- JavaScript -->
<script src="https://cdn.example.com/ux4g/2.0.8/ux4g.bundle.min.js"></script>
```

### NPM Installation (if available)

```bash
npm install ux4g@2.0.8
```

---

## Common Patterns & Examples

### Hero Section

```html
<section class="bg-primary-50 py-5">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-6">
        <h1 class="display-3 text-primary-900">Welcome to Digital India</h1>
        <p class="lead text-gray-700">Building a digitally empowered society</p>
        <button class="btn btn-primary btn-lg">Get Started</button>
      </div>
      <div class="col-lg-6">
        <span class="gov-icons gov-icons-digital-india"></span>
      </div>
    </div>
  </div>
</section>
```

### Card Component

```html
<div class="card shadow-sm rounded">
  <div class="card-body p-4">
    <h5 class="title-1 mb-3">Service Title</h5>
    <p class="body-2 text-gray-600">Description of the government service</p>
    <a href="#" class="btn btn-outline-primary"> Learn More </a>
  </div>
</div>
```

### Navigation Bar

```html
<nav class="navbar navbar-expand-lg bg-white shadow-sm">
  <div class="container">
    <a class="navbar-brand" href="#">
      <span class="gov-icons gov-icons-emblem"></span>
    </a>
    <button class="navbar-toggler" id="mobile-menu">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Services</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">About</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

### Form Layout

```html
<form class="p-4 bg-gray-50 rounded">
  <div class="mb-3">
    <label for="name" class="label-1 mb-2">Full Name</label>
    <input
      type="text"
      class="form-control"
      id="name"
      placeholder="Enter your name"
    />
  </div>
  <div class="mb-3">
    <label for="email" class="label-1 mb-2">Email</label>
    <input
      type="email"
      class="form-control"
      id="email"
      placeholder="your@email.com"
    />
  </div>
  <button type="submit" class="btn btn-primary w-100">Submit</button>
</form>
```

### Footer

```html
<footer class="bg-dark text-white py-5">
  <div class="container">
    <div class="row">
      <div class="col-md-4 mb-4">
        <span class="gov-icons gov-icons-gov-in mb-3"></span>
        <p class="body-2">Government of India official portal</p>
      </div>
      <div class="col-md-4 mb-4">
        <h6 class="label-1 mb-3">Quick Links</h6>
        <ul class="list-unstyled">
          <li><a href="#" class="text-gray-300">About Us</a></li>
          <li><a href="#" class="text-gray-300">Services</a></li>
          <li><a href="#" class="text-gray-300">Contact</a></li>
        </ul>
      </div>
      <div class="col-md-4 mb-4">
        <h6 class="label-1 mb-3">Connect</h6>
        <div class="d-flex gap-3">
          <span class="social-icons social-icons-facebook"></span>
        </div>
      </div>
    </div>
    <hr class="border-gray-700 my-4" />
    <div class="row">
      <div class="col-md-6">
        <p class="body-3 mb-0">
          © 2025 Government of India. All rights reserved.
        </p>
      </div>
      <div class="col-md-6 text-md-end">
        <a href="#" class="text-gray-400 body-3">Privacy Policy</a>
        <span class="mx-2">|</span>
        <a href="#" class="text-gray-400 body-3">Terms</a>
      </div>
    </div>
  </div>
</footer>
```

---

## Best Practices

### 1. Color Usage

- **Primary Purple (#613AF5):** CTAs, links, active states
- **Success Green (#3C9718):** Confirmations, success messages
- **Danger Red (#B7131A):** Errors, warnings, destructive actions
- **Gray Scale:** Text hierarchy, backgrounds, borders
- Use color variants (50-900) for subtle differences

### 2. Typography Hierarchy

- Use heading tags (h1-h6) in semantic order
- Apply `.display-*` for hero sections only
- Use `.title-*` for component headings
- Apply `.body-*` for content based on importance
- Maintain consistent line-height for readability

### 3. Spacing Consistency

- Use spacing scale (0-5) consistently
- Maintain vertical rhythm: multiples of 8px (0.5rem)
- Apply generous whitespace in government applications
- Use `.my-*` for vertical section spacing
- Use `.p-*` for component internal padding

### 4. Responsive Design

- Test on all breakpoints (sm, md, lg, xl, xxl)
- Use responsive utilities: `.d-{breakpoint}-{value}`
- Stack columns on mobile: `.col-12 .col-md-6`
- Hide/show content based on screen size
- Ensure touch targets are minimum 44x44px on mobile

### 5. Accessibility

- Always provide alt text for images
- Use semantic HTML elements
- Ensure keyboard navigation works
- Maintain WCAG AA contrast ratios
- Test with screen readers
- Provide focus indicators
- Use ARIA labels when needed

### 6. Performance

- Load CSS in order: reboot → grid → utilities → main
- Use minified versions in production
- Load only required JavaScript components
- Lazy load images and heavy content
- Minimize HTTP requests
- Use CDN when available

### 7. Government Branding

- Always include government emblems/logos appropriately
- Follow official color guidelines
- Use approved icons from the icon system
- Maintain formal, professional tone
- Include required disclaimers and policies

---

## Component Guidelines

### Buttons

**States:**

- Default: Solid color with subtle shadow
- Hover: Slightly darker shade
- Active: Pressed appearance
- Disabled: Reduced opacity (0.65)
- Focus: Visible outline for keyboard users

**Sizes:**

- `.btn-sm` - Small buttons
- `.btn` (default) - Standard size
- `.btn-lg` - Large buttons

**Variants:**

- `.btn-primary` - Primary actions
- `.btn-secondary` - Secondary actions
- `.btn-outline-*` - Outlined buttons
- `.btn-link` - Link-styled buttons

### Cards

**Structure:**

- `.card` - Main container
- `.card-header` - Optional header
- `.card-body` - Main content area
- `.card-footer` - Optional footer

**Best Practices:**

- Add `.shadow-sm` for subtle elevation
- Use `.rounded` for consistent corners
- Apply padding with `.p-3` or `.p-4`
- Maintain consistent card heights in grids

### Tables

**Styling:**

- `.table` - Base table class
- `.table-striped` - Zebra striping
- `.table-hover` - Hover states
- `.table-bordered` - Borders
- `.table-sm` - Compact spacing

**Responsive:**

- Wrap in `.table-responsive` for horizontal scroll
- Consider stacking on mobile for complex tables

### Alerts & Notifications

**Types:**

- `.alert-primary` - Information
- `.alert-success` - Success messages
- `.alert-warning` - Warnings
- `.alert-danger` - Errors
- `.alert-info` - Info messages

**Features:**

- Dismissible with `.alert-dismissible`
- Icon support for visual hierarchy
- Link styling with `.alert-link`

### Modals & Dialogs

**Structure:**

- `.modal` - Backdrop and container
- `.modal-dialog` - Dialog box
- `.modal-content` - Content wrapper
- `.modal-header` - Header with title
- `.modal-body` - Main content
- `.modal-footer` - Action buttons

**Sizes:**

- `.modal-sm` - Small modal
- (default) - Medium modal
- `.modal-lg` - Large modal
- `.modal-xl` - Extra large modal

**Accessibility:**

- Focus trap within modal
- ESC key to close
- ARIA labels for screen readers
- Background click to dismiss (optional)

---

## Customization

### CSS Variables

UX4G uses CSS custom properties for easy theming:

```css
:root {
  --bs-primary: #613af5;
  --bs-body-font-family: "Noto Sans", sans-serif;
  --bs-body-font-size: 1rem;
  --bs-body-line-height: 1.5;
  --bs-border-radius: 0.375rem;
  /* Override as needed */
}
```

### Custom Theme Example

```css
/* custom-theme.css */
:root {
  /* Change primary color */
  --bs-primary: #0066cc;
  --bs-primary-rgb: 0, 102, 204;

  /* Adjust font sizes */
  --bs-body-font-size: 1.125rem;

  /* Modify border radius */
  --bs-border-radius: 0.5rem;

  /* Custom spacing */
  --bs-gutter-x: 2rem;
}

/* Custom component styles */
.btn-primary {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.btn-primary:hover {
  background-color: darken(var(--bs-primary), 10%);
}
```

---

## Migration Guide

### From Bootstrap to UX4G

UX4G is based on Bootstrap principles, with government-specific customizations:

**Key Differences:**

1. **Colors:** Government-approved color palette
2. **Typography:** Noto Sans instead of system fonts
3. **Icons:** Custom government icon sets
4. **Components:** Additional government-specific components
5. **Accessibility:** Enhanced WCAG compliance

**Migration Steps:**

1. Replace Bootstrap CSS with UX4G CSS
2. Update color classes (if using custom Bootstrap colors)
3. Add government icons where appropriate
4. Update font references to Noto Sans
5. Test all components thoroughly
6. Validate accessibility compliance

---

## Resources & Support

### Documentation

- Official Docs: https://doc.ux4g.gov.in
- API Reference: Component-specific documentation
- Code Examples: Sample implementations

### Learning Resources

- Design System Guidelines
- Accessibility Standards
- Government Web Standards
- Component Patterns
- Best Practices Documentation

### Community & Support

- Report Issues: GitHub (if available)
- Feature Requests: Official channels
- Community Forums: Government developer portals
- Technical Support: NeGD, MeitY support channels

---

## Version History

### v2.0.8 (Current)

**Features:**

- Complete design system with 12-column grid
- Comprehensive color system with 10-shade variants
- Government icon systems (Gov, State, UT, Country, Social)
- Date/time picker components
- Responsive utilities for all breakpoints
- Full RTL language support
- Accessibility enhancements
- JavaScript interaction library

**Improvements:**

- Enhanced mobile responsiveness
- Better performance optimizations
- Improved documentation
- Extended utility classes
- Better browser compatibility

---

## Conclusion

The UX4G Design System provides a comprehensive, government-standard framework for building accessible, consistent digital applications. By following these guidelines and using the provided components, developers can create professional government portals that serve citizens effectively.

**Key Takeaways:**

✓ Mobile-first responsive design  
✓ Government-approved color palette  
✓ Comprehensive typography system  
✓ Flexible grid and spacing utilities  
✓ Accessibility-first approach  
✓ Official government icons  
✓ RTL language support  
✓ Performance optimized  
✓ Well-documented components  
✓ MIT licensed and open source

For the latest updates and detailed component documentation, visit: **https://doc.ux4g.gov.in**

---

**Document Version:** 1.0  
**Last Updated:** Based on UX4G v2.0.8  
**Maintained By:** NeGD, MeitY  
**License:** MIT
