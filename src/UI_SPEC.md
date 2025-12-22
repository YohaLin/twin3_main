# Twin3 UI Design Specification

## Overview
Twin3 adopts a **Minimalist Elite** design language with iOS-inspired glassmorphism, ensuring a premium, sophisticated user experience.

---

## Brand Assets

| Asset | Path | Usage |
|-------|------|-------|
| Logo | `/public/twin3_logo.svg` | Favicon, sidebar header |
| Promo Image | `/public/twin3-promo.png` | Marketing materials |
| Site Title | `twin3.ai` | Browser tab |

---

## Color Palette

### Primary Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#ffffff` | Primary actions, headings |
| `--color-secondary` | `#8e8e93` | Secondary elements |
| `--color-accent` | `#86868b` | Accent details |

### Background Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-base` | `#000000` | Page background |
| `--color-bg-elevated` | `#0a0a0a` | Elevated surfaces |
| `--color-bg-card` | `rgba(28, 28, 30, 0.6)` | Card backgrounds |

### Text Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#ffffff` | Primary text, headings |
| `--color-text-secondary` | `#8e8e93` | Secondary text, descriptions |
| `--color-text-dim` | `#636366` | Disabled, hints |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#30d158` | Success states |
| `--color-warning` | `#ff9f0a` | Warning states |

---

## Typography

### Font Family
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Font Weights
- **Maximum**: 500 (medium) - used for headings and emphasis
- **Normal**: 400 - used for body text
- **Never use**: 600, 700, 800 (too bold for minimalist aesthetic)

### Heading Styles
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| H1 | 40px | 500 | `--color-text-primary` (white) |
| H2 | 24px | 500 | `--color-text-primary` |
| H3 | 18px | 500 | `--color-text-primary` |
| H4 | 16px | 500 | `--color-text-primary` |

---

## iOS Glassmorphism

### Glass Effect
```css
.glass {
  background: rgba(28, 28, 30, 0.72);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
```

### Glass Variables
| Token | Value |
|-------|-------|
| `--glass-bg` | `rgba(28, 28, 30, 0.72)` |
| `--glass-border` | `rgba(255, 255, 255, 0.12)` |
| `--glass-blur` | `40px` |

---

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background: #ffffff;
  color: #000000;
  border: 1px solid transparent;
  border-radius: 12px;
}

.btn-primary:hover {
  background: transparent;
  border: 1px solid #ffffff;
  color: #ffffff;
}
```

| State | Background | Border | Text |
|-------|------------|--------|------|
| Default (Filled) | `#ffffff` | transparent | `#000000` |
| Hover (Stroke) | transparent | `#ffffff` | `#ffffff` |

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
}
```

### Cards
```css
.card {
  background: var(--glass-bg);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 24px;
}
```

### Chips / Tags
```css
.chip {
  padding: 10px 20px;
  font-size: 15px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

---

## Spacing

| Token | Value |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Small elements |
| `--radius-md` | 12px | Buttons, inputs |
| `--radius-lg` | 16px | Cards |
| `--radius-xl` | 24px | Large cards, modals |
| `--radius-full` | 9999px | Pills, chips |

---

## Icons

### Icon Library
Using **Lucide React** for all icons.

### Icon Usage Guidelines
- ✅ Use Lucide icons (e.g., `<Coins>`, `<Gift>`, `<Clock>`, `<CheckCircle>`)
- ❌ Never use emojis in production UI
- Icon sizes: 14px (small), 16px (medium), 18px (large), 20px (action buttons)

### Common Icons
| Context | Icon |
|---------|------|
| Tokens/Rewards | `<Coins>` |
| Gifts | `<Gift>` |
| Time/Deadline | `<Clock>` |
| Users/Participants | `<Users>` |
| Success/Accept | `<CheckCircle>` |
| Close/Cancel | `<X>` |
| Settings | `<Settings>` |
| Menu | `<Menu>` |
| Send | `<Send>` |

---

## Language

### All UI Text
- **English only** - no Chinese characters in production UI
- Use clear, concise language
- Action buttons: "View Details", "Accept Task", "Cancel", "Back to Home"
- Guidance text: "Click the suggestions below or ask me anything about twin3!"

### Token Display
- Format: `$twin3` (e.g., "500 $twin3")
- Never use "TWIN" alone

---

## Shadows

| Token | Value |
|-------|-------|
| `--shadow-sm` | `0 2px 8px rgba(0, 0, 0, 0.32)` |
| `--shadow-md` | `0 8px 24px rgba(0, 0, 0, 0.4)` |
| `--shadow-lg` | `0 16px 48px rgba(0, 0, 0, 0.56)` |

---

## Animation

### Standard Transitions
```css
transition: all 0.2s ease;
```

### Hover Effects
- Buttons: `translateY(-1px)`
- Cards: `translateY(-2px)`

---

## Responsive Breakpoints

| Breakpoint | Width | Sidebar |
|------------|-------|---------|
| Mobile | < 768px | Hidden |
| Tablet | 768px - 1023px | Collapsible |
| Desktop | ≥ 1024px | Right sidebar visible |

---

## File Reference

- **CSS Variables**: `/src/index.css`
- **Chat Layout**: `/src/features/chat/ChatLayout.tsx`
- **Task Modal**: `/src/features/cards/TaskDetailModal.tsx`
- **Message Bubble**: `/src/features/chat/MessageBubble.tsx`
- **Inventory Data**: `/src/data/inventory.ts`
