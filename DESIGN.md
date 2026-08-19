# Design System Inspired by Идея Винодела

> Auto-extracted from `https://ideawinemaker.ru/` on 2026-08-06

## 1. Visual Theme & Atmosphere

Friendly, approachable design with rounded shapes and generous whitespace.

The hero section leads with "Идея винодела коллекция авторских вин".

**Key Characteristics:**
- Cormorant Garamond as the heading font
- Inter as the body font for all running text
- Heading weight 400, letter-spacing 3.68px
- Light/white background (#ffffff) as the primary canvas
- Primary accent `#6d0e2c` used for CTAs and brand highlights
- 5 shadow level(s) detected — tinted shadows
- Rounded corners (12px+) creating a friendly, approachable feel
- Tags: light, rounded, monochrome, serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#6d0e2c`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Background** (`#ffffff`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (`#d9d1c8`) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#1c1716`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#7e6e5a`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#d9d1c8`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| # | Hex | CSS Variable | Role | Area | Contrast |
|---|---|---|---|---|---|
| 1 | `#ffffff` | `--palette-1` | section | large | text-dark |
| 2 | `#d9d1c8` | `--palette-2` | section | large | text-dark |
| 3 | `#5a1f2d` | `--palette-3` | text-accent | medium | text-light |
| 4 | `#6d0e2c` | `--palette-4` | badge | medium | text-light |
| 5 | `#f4efea` | `--palette-5` | button | medium | text-dark |
| 6 | `#1c1716` | `--palette-6` | badge | small | text-light |
| 7 | `#9a7650` | `--palette-7` | text-accent | small | text-light |
| 8 | `#7e6e5a` | `--palette-8` | text-accent | small | text-light |
| 9 | `#405034` | `--palette-9` | text-accent | small | text-light |

## 3. Typography Rules

- **Heading Font:** `Cormorant Garamond`, sans-serif
- **Body Font:** `Inter`, sans-serif

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | Cormorant Garamond | 46px | 400 | 57.5px | 3.68px |
| H2 | Cormorant Garamond | 28px | 400 | 46.2px | 4.48px |
| H3 | Cormorant Garamond | 22px | 400 | 23.76px | normal |
| H4 | Inter | 17px | 400 | 20.4px | normal |
| Body | Inter | 16px | 400 | 26.4px | normal |
| Small | Inter | 16px | 400 | normal | normal |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `52px` | headings |
| H1 | `48px` | headings |
| H2 | `46px` | headings |
| H3 | `28px` | headings |
| H4 | `24px` | headings |
| Body L | `22px` | body / supporting text |
| Body | `17px` | body / supporting text |
| Small | `16px` | body / supporting text |
| XS | `15px` | body / supporting text |
| Caption | `14px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: transparent;
  color: #5a1f2d;
  border-radius: 0px;
  padding: 0px 0px;
  font-size: 24px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: #1c1716;
  border-radius: 0px;
  padding: 0px 0px;
  font-size: 22px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Filled Button

```css
.btn-filled {
  background: #5a1f2d;
  color: #ffffff;
  border-radius: 50px;
  padding: 0px 0px;
  font-size: 16px;
  font-weight: 400;
  border: 1px solid rgba(28, 23, 22, 0.18);
  cursor: pointer;
}
```

### Ghost Button 2

```css
.btn-ghost-2 {
  background: transparent;
  color: #222222;
  border-radius: 0px;
  padding: 0px 0px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Filled Button 2

```css
.btn-filled-2 {
  background: #6d0e2c;
  color: #ffffff;
  border-radius: 50px;
  padding: 0px 0px;
  font-size: 0px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
```

### Filled Button 3

```css
.btn-filled-3 {
  background: #1c1716;
  color: #1c1716;
  border-radius: 50px;
  padding: 0px 0px;
  font-size: 28px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Card

```css
.card {
  background: #f4f6fa;
  border-radius: 12px;
  padding: 0px;
}
```

## 5. Layout Principles

- **Base spacing unit:** `10px` — use multiples (20px, 30px, 40px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `10px` | element |
| spacing-2 | `12px` | element |
| spacing-3 | `14px` | element |
| spacing-4 | `15px` | element |
| spacing-5 | `18px` | element |
| spacing-6 | `24px` | card |
| spacing-7 | `7px` | element |
| spacing-8 | `8px` | element |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-button | `12px` | button |
| radius-button | `14px` | button |
| radius-card | `50px` | card |
| radius-subtle | `5px` | subtle |
| radius-subtle | `4px` | subtle |
| radius-subtle | `3px` | subtle |

## 6. Depth & Elevation

| Level | Shadow | Usage |
|---|---|---|
| Low | `rgba(0, 0, 0, 0.15) 0px 1px 2px 1px, rgba(0, 0, 0, 0.15) 0px 2px 5px -3px` | Cards, subtle elevation |
| High | `rgba(0, 0, 0, 0.1) 0px 8px 24px 0px` | Modals, floating elements |
| Low | `rgba(0, 0, 0, 0.15) 1px 0px 0px 0px, rgba(0, 0, 0, 0.15) -1px 0px 0px 0px` | Cards, subtle elevation |
| Deep | `rgba(0, 0, 0, 0.18) 0px 24px 70px 0px` | Hero sections, deep layers |
| Deep | `rgba(0, 0, 0, 0.5) 0px 10px 30px 0px` | Hero sections, deep layers |


## 7. Do's and Don'ts

### Do
- Use `#ffffff` as the primary background color
- Use `Cormorant Garamond` for all headings and `Inter` for body text
- Use `#6d0e2c` as the single dominant accent/CTA color
- Maintain `10px` as the base spacing unit — all gaps should be multiples
- Use rounded corners (`12px`+) consistently for all interactive elements
- Use serif fonts for headlines to maintain editorial authority
- Stick to grayscale + `#6d0e2c` accent — avoid color overload
- Apply the shadow system for elevation — use the extracted shadow values
- Use weight 400 for headings to match the brand's typographic voice

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute Cormorant Garamond/Inter with generic alternatives
- Don't use irregular spacing — stick to 10px grid
- Don't use dark/black backgrounds — this is a light-themed design
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't add additional saturated colors beyond the primary accent
- Don't mix in geometric sans-serif headlines — it breaks the editorial tone
- Don't use pure black (#000000) for text — use `#1c1716` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette

## 8. Responsive Behavior

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, stack sections, reduce font sizes ~80% |
| Tablet | 640–1024px | 2-column where appropriate, maintain spacing ratios |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container, center content |

- Touch targets: minimum 44×44px on mobile
- Maintain 10px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #ffffff
Text:        #1c1716
Accent:      #6d0e2c
Border:      #d9d1c8
```

### Example Prompts

1. "Build a hero section with a `#ffffff` background, `Cormorant Garamond` heading in `#1c1716`, and a `#6d0e2c` CTA button with 50px radius."
2. "Create a pricing card using background `#d9d1c8`, border `#d9d1c8`, `Inter` for text, and 30px padding."
3. "Design a navigation bar — `#ffffff` background, `#1c1716` links, `#6d0e2c` for active state."
4. "Build a feature grid with 3 columns, 30px gap, each card using the card component style."
5. "Create a footer with `#1c1716` background, `#ffffff` text, and 20px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Add shadows for depth — use the extracted shadow values, not defaults
7. Check responsive behavior — test mobile and tablet layouts
8. Final pass — verify all colors match, spacing is consistent, fonts are correct

## 10. CSS Custom Properties

> 78 custom properties extracted from `:root` / `html` stylesheets.

### Color Variables

| Variable | Value |
|---|---|
| `--wp--preset--color--black` | `#000000` |
| `--wp--preset--color--cyan-bluish-gray` | `#abb8c3` |
| `--wp--preset--color--white` | `#ffffff` |
| `--wp--preset--color--pale-pink` | `#f78da7` |
| `--wp--preset--color--vivid-red` | `#cf2e2e` |
| `--wp--preset--color--luminous-vivid-orange` | `#ff6900` |
| `--wp--preset--color--luminous-vivid-amber` | `#fcb900` |
| `--wp--preset--color--light-green-cyan` | `#7bdcb5` |
| `--wp--preset--color--vivid-green-cyan` | `#00d084` |
| `--wp--preset--color--pale-cyan-blue` | `#8ed1fc` |
| `--wp--preset--color--vivid-cyan-blue` | `#0693e3` |
| `--wp--preset--color--vivid-purple` | `#9b51e0` |
| `--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple` | `linear-gradient(135deg,rgb(6,147,227) 0%,rgb(155,81,224) 100%)` |
| `--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan` | `linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%)` |
| `--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange` | `linear-gradient(135deg,rgb(252,185,0) 0%,rgb(255,105,0) 100%)` |
| `--wp--preset--gradient--luminous-vivid-orange-to-vivid-red` | `linear-gradient(135deg,rgb(255,105,0) 0%,rgb(207,46,46) 100%)` |
| `--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray` | `linear-gradient(135deg,rgb(238,238,238) 0%,rgb(169,184,195) 100%)` |
| `--wp--preset--gradient--cool-to-warm-spectrum` | `linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 100%)` |
| `--wp--preset--gradient--blush-light-purple` | `linear-gradient(135deg,rgb(255,206,236) 0%,rgb(152,150,240) 100%)` |
| `--wp--preset--gradient--blush-bordeaux` | `linear-gradient(135deg,rgb(254,205,165) 0%,rgb(254,45,45) 50%,rgb(107,0,62) 100%)` |
| `--wp--preset--gradient--luminous-dusk` | `linear-gradient(135deg,rgb(255,203,112) 0%,rgb(199,81,192) 50%,rgb(65,88,208) 100%)` |
| `--wp--preset--gradient--pale-ocean` | `linear-gradient(135deg,rgb(255,245,203) 0%,rgb(182,227,212) 50%,rgb(51,167,181) 100%)` |
| `--wp--preset--gradient--electric-grass` | `linear-gradient(135deg,rgb(202,248,128) 0%,rgb(113,206,126) 100%)` |
| `--wp--preset--gradient--midnight` | `linear-gradient(135deg,rgb(2,3,129) 0%,rgb(40,116,252) 100%)` |
| `--wp--preset--shadow--natural` | `6px 6px 9px rgba(0, 0, 0, 0.2)` |
| `--wp--preset--shadow--deep` | `12px 12px 50px rgba(0, 0, 0, 0.4)` |
| `--wp--preset--shadow--sharp` | `6px 6px 0px rgba(0, 0, 0, 0.2)` |
| `--wp--preset--shadow--outlined` | `6px 6px 0px -3px rgb(255, 255, 255), 6px 6px rgb(0, 0, 0)` |
| `--wp--preset--shadow--crisp` | `6px 6px 0px rgb(0, 0, 0)` |
| `--blogdoseo-overlay-bg` | `rgba(0, 0, 0, 0.7)` |
| ... | *(25 more)* |

### Spacing Variables

| Variable | Value |
|---|---|
| `--wp--preset--aspect-ratio--square` | `1` |
| `--wp--preset--spacing--20` | `0.44rem` |
| `--wp--preset--spacing--30` | `0.67rem` |
| `--wp--preset--spacing--40` | `1rem` |
| `--wp--preset--spacing--50` | `1.5rem` |
| `--wp--preset--spacing--60` | `2.25rem` |
| `--wp--preset--spacing--70` | `3.38rem` |
| `--wp--preset--spacing--80` | `5.06rem` |
| `--vk-radius` | `8px` |
| `--swiper-navigation-size` | `44px` |
| `--container` | `1320px` |
| `--containerXL` | `1320px` |

### Typography Variables

| Variable | Value |
|---|---|
| `--wp--preset--font-size--small` | `13px` |
| `--wp--preset--font-size--medium` | `20px` |
| `--wp--preset--font-size--large` | `36px` |
| `--wp--preset--font-size--x-large` | `42px` |

### Other Variables

| Variable | Value |
|---|---|
| `--wp--preset--aspect-ratio--4-3` | `4/3` |
| `--wp--preset--aspect-ratio--3-4` | `3/4` |
| `--wp--preset--aspect-ratio--3-2` | `3/2` |
| `--wp--preset--aspect-ratio--2-3` | `2/3` |
| `--wp--preset--aspect-ratio--16-9` | `16/9` |
| `--wp--preset--aspect-ratio--9-16` | `9/16` |
| `--vk-transition` | `0.3s ease` |
