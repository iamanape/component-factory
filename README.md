# component-factory

A tiny utility for building **organized shorthand React components** with Tailwind and `clsx`.  
Keep your classes **grouped and readable** at creation time, while still flattening them into a single `className` string at runtime.  

---

## ✨ Features

- **Boolean props for variants** → `<Button primary />` instead of `className={{ primary: true }}`
- **Organized groups** (e.g. `spacing`, `background`, `text`) that are *ignored at runtime* — they’re just comments for you, the author
- **Always type-safe**: TS autocompletes valid variant props
- **No runtime overhead** beyond a little `clsx`

---

## 📦 Installation

```bash
npm install react-classy clsx
```

> ⚠️ `react` is a peer dependency (>=17).

---

## 🚀 Usage

### Basic Button

```tsx
import { c } from "react-classy";

export const Button = c({
  base: {
    spacing: "px-4 py-2",
    background: "bg-slate-500",
    text: "text-white",
  },
  primary: {
    spacing: "px-3 py-6",
    background: "bg-slate-200",
  },
  danger: {
    spacing: "px-3 py-6",
    background: "bg-red-600",
    text: "text-white",
  },
}, "button");

// Usage
<Button>Default</Button>
<Button primary>Primary</Button>
<Button danger>Danger</Button>
```

Output classes:

- Default → `px-4 py-2 bg-slate-500 text-white`  
- Primary → `px-3 py-6 bg-slate-200`  
- Danger → `px-3 py-6 bg-red-600 text-white`  

---

### Alert Component

```tsx
export const Alert = c({
  base: {
    padding: "p-4",
    shape: "rounded",
    text: "font-medium",
  },
  success: {
    colors: "bg-green-100 text-green-800",
  },
  error: {
    colors: "bg-red-100 text-red-800",
  },
  info: {
    colors: "bg-blue-100 text-blue-800",
  },
});

// Usage
<Alert success>Success message</Alert>
<Alert error>Error message</Alert>
<Alert info>Info message</Alert>
```

---

### With Additional Props

Because components are real React components with inferred types, you can use them like normal:

```tsx
<Button onClick={() => alert("clicked")} disabled>
  Disabled
</Button>

<a href="/home">
  <Button primary>Go Home</Button>
</a>
```

---

## 🧠 Philosophy

- **Grouping keys** (`spacing`, `background`, `text`) are *author-only comments* — they don’t appear in output.
- **Top-level keys** (`base`, `primary`, `danger`, etc.) become **boolean props**.
- **TypeScript safety** ensures you can only use valid props.

The goal: **clean authoring, clean usage, minimal runtime.**

---

## 📜 License

MIT © You
