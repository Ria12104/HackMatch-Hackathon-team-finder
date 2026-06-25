---
name: Luminous Material
colors:
  surface: '#fff8f7'
  surface-dim: '#e2d8d8'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf1f1'
  surface-container: '#f6ebeb'
  surface-container-high: '#f0e6e6'
  surface-container-highest: '#eae0e0'
  on-surface: '#1f1a1b'
  on-surface-variant: '#514444'
  inverse-surface: '#342f2f'
  inverse-on-surface: '#f9eeee'
  outline: '#837374'
  outline-variant: '#d5c2c3'
  surface-tint: '#805156'
  primary: '#805156'
  on-primary: '#ffffff'
  primary-container: '#c38c91'
  on-primary-container: '#4e272b'
  inverse-primary: '#f3b7bc'
  secondary: '#815342'
  on-secondary: '#ffffff'
  secondary-container: '#fec1ab'
  on-secondary-container: '#794d3c'
  tertiary: '#835421'
  on-tertiary: '#ffffff'
  tertiary-container: '#c78f56'
  on-tertiary-container: '#4d2a00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9dc'
  primary-fixed-dim: '#f3b7bc'
  on-primary-fixed: '#321016'
  on-primary-fixed-variant: '#653b3f'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#f5b9a3'
  on-secondary-fixed: '#321206'
  on-secondary-fixed-variant: '#663c2c'
  tertiary-fixed: '#ffdcbe'
  tertiary-fixed-dim: '#f9ba7d'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#673d0a'
  background: '#fff8f7'
  on-background: '#1f1a1b'
  surface-variant: '#eae0e0'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.15px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 4px
  x-small: 8px
  small: 12px
  medium: 16px
  large: 24px
  x-large: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

This design system is a sophisticated evolution of Material Design 3 (M3), blending the rigorous logic of Google's design language with a warm, editorial aesthetic. It targets lifestyle, wellness, and high-end service platforms where professionalism must be tempered with approachability and elegance.

The visual style is characterized by:
- **Warm Modernism:** A departure from cold, clinical neutrals in favor of a "Cashmere Glow" foundation.
- **Organic Precision:** Utilizing the extreme roundedness of M3 but applying it to a high-contrast, boutique color palette.
- **Tactile Softness:** Interfaces should feel soft to the touch, evoking the fluid, shimmering textures found in the reference inspiration.

## Colors

The palette is built on a foundation of warmth. The core interaction color, **Rose Dusk**, provides a mature and grounding presence against the lighter, more energetic **Peach Veil** and **Golden Nectar**.

- **Primary (Rose Dusk):** Used for key actions, active states, and prominent branding elements.
- **Secondary (Peach Veil):** Ideal for less prominent components, tonal accents, and secondary buttons.
- **Tertiary (Golden Nectar):** Reserved for highlights, notifications, or "hero" accents that require visual pop.
- **Surface (Cashmere Glow):** Replaces standard whites and grays to ensure the entire UI feels cohesive and premium.
- **Tonal Palettes:** All surfaces should derive from the primary color's tonal scale (e.g., Surface Container Lowest to Highest) to maintain a monochromatic harmony.

## Typography

The typography strategy pairs **Outfit** for high-impact display moments with **Plus Jakarta Sans** for functional, everyday reading.

- **Headlines:** Use Outfit with tight letter spacing for a modern, geometric look. 
- **Body & Functional:** Plus Jakarta Sans provides excellent legibility at smaller scales while maintaining the "friendly" curvature of the system.
- **Hierarchy:** Maintain clear contrast between Headline (SemiBold) and Body (Regular) to guide the eye through dense information layouts.

## Layout & Spacing

This design system follows a 4px baseline grid and a flexible Material 3 column system.

- **Responsive Grid:** 4 columns on mobile, 8 on tablet, and 12 on desktop.
- **Content Padding:** Standardize on 24px (Large) for internal card padding to allow the rounded corners enough "breathing room."
- **Rhythm:** Use "Medium" (16px) for standard vertical spacing between related elements and "X-Large" (32px) for section breaks.

## Elevation & Depth

In accordance with Material Design 3, hierarchy is communicated primarily through **tonal elevation** rather than deep, dark shadows.

- **Surface Tiers:** Use varying opacities of the Primary color mixed with the Surface color to create "lifted" containers.
- **Soft Shadows:** If a shadow is required for a floating action button (FAB) or a high-priority modal, it must be highly diffused and tinted with the Primary color (#C38C91) at a 10% opacity, rather than pure black.
- **Focus States:** Active or focused elements should use a 2px stroke in Peach Veil to create a "glow" effect without adding physical weight.

## Shapes

The shape language is the defining characteristic of this design system, emphasizing extreme softness.

- **Containers:** Cards and modals must use a corner radius of at least 28px to evoke the organic shapes seen in the reference image.
- **Buttons:** Buttons are fully pill-shaped (capsule).
- **Inputs:** Text fields should utilize a 16px corner radius to balance the sharp lines of text with the overall soft aesthetic.

## Components

### Buttons
- **Primary:** Capsule-shaped, solid Rose Dusk with white text.
- **Secondary:** Tonal surface (soft Peach Veil) with Rose Dusk text.
- **Elevated:** Surface color with a subtle 1px border in Peach Veil.

### Cards
- **Style:** 28px rounded corners. No borders. Elevation should be represented by a "Surface Container" color—a slightly darker or warmer version of Cashmere Glow.

### Selection Controls
- **Checkboxes/Radios:** When active, these should use Rose Dusk. Use Golden Nectar for high-priority "Toggle" switches to signify energy.

### Input Fields
- **Filled Style:** A soft cream background (slightly darker than the main surface) with a thick (2px) bottom indicator in Rose Dusk when focused. 16px top-corner rounding.

### Chips & Tags
- **Style:** Small, pill-shaped elements using the Tertiary color (Golden Nectar) at 20% opacity with a 700-weight label for high legibility.