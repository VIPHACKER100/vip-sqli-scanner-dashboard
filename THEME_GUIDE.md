# XNODE Interface Design Guide

This guide details the **v2.2.4 Semantic Token System**, used to maintain absolute visual fidelity and technical clarity across shifting mission protocols (Light/Dark themes).

## 🏗️ Technical Architecture

The interface utilizes a **Dynamic CSS Variable Layer** mapped to **Tailwind CSS Utility Classes**. This eliminates hardcoded hex values, allowing the UI to adapt instantly to mission-critical visibility requirements.

### Root Variables (`index.html`)

| Variable | Light Protocol | Dark Protocol | Intent |
| :--- | :--- | :--- | :--- |
| `--background` | `#FFFFFF` | `#020617` | Primary tactical space |
| `--background-alt` | `#F8FAFC` | `#0B1121` | Secondary/Sidebar surfaces |
| `--foreground` | `#0F172A` | `#F8FAFC` | Primary technical data |
| `--accent` | `#0052FF` | `#0052FF` | Active mission vectors |
| `--muted` | `#F1F5F9` | `#1E293B` | Ghost/De-emphasized states |
| `--card` | `#FFFFFF` | `#0F172A` | Component containers |
| `--border` | `#E2E8F0` | `#1E293B` | Structural separation |

## 🛠️ Usage Guidelines

### 1. Theming with Tailwind
When building new components, always use the semantic utility classes. Do **not** use specific Tailwind colors (like `bg-slate-900`) unless it's for absolute/fixed colors.

- **Backgrounds**: Use `bg-background` or `bg-background-alt`.
- **Text**: Use `text-foreground` or `text-muted-foreground`.
- **Borders**: Use `border-border`.
- **Cards**: Use `bg-card` or the `modern-card` utility.

### 2. Implementation Example

```tsx
const TacticalModule = () => (
  <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
    <h3 className="text-foreground font-display text-xl">Module_Alpha</h3>
    <p className="text-muted-foreground text-sm">Operation parameters secured.</p>
    <button className="bg-accent text-white px-4 py-2 rounded-xl mt-4">
      DEPLOY_VECTOR
    </button>
  </div>
);
```

### 3. Glassmorphism Utilities
The `.hf-glass` class provides high-fidelity translucency that adapts to the current protocol:

- **Light Protocol**: Subtle white-wash with border refinement.
- **Dark Protocol**: Deep-sector blur with emerald/accent tinting.

## 🚀 Optimization Tips
- **Transitions**: Every element should include `transition-colors duration-300` for smooth protocol shifting.
- **Opacity**: Use variable-based opacity (e.g., `bg-accent/10`) to allow brand colors to bleed into themed backgrounds.
- **Icons**: Utilize the `text-accent` or `text-muted-foreground` classes on Lucide icons to maintain technical alignment.

---
**Standard Operating Procedure // VIPHACKER.100**
