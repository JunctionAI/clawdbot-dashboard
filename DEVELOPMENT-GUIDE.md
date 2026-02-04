# Development Guide - Premium Dashboard

## 🚀 Quick Start

### Installation
```bash
cd dashboard
npm install
```

### Development Server
```bash
npm run dev
```
Visit `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
dashboard/
├── app/                          # Next.js 14 App Router
│   ├── api/                     # API routes
│   │   ├── checkout/            # Stripe checkout
│   │   └── customer/            # Customer data
│   ├── dashboard/               # Dashboard page
│   │   └── page.tsx
│   ├── success/                 # Post-payment success
│   │   └── page.tsx
│   ├── globals.css              # Global styles + Tailwind
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # React components
│   └── ui/                      # Premium UI library
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       ├── LoadingSpinner.tsx
│       ├── ProgressBar.tsx
│       ├── StatCard.tsx
│       ├── Toast.tsx
│       └── icons.tsx
├── tailwind.config.ts           # Tailwind + custom animations
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
├── UI-UX-ENHANCEMENTS.md        # Feature documentation
├── COMPONENT-SHOWCASE.md        # Component examples
└── DEVELOPMENT-GUIDE.md         # This file
```

---

## 🎨 Design System

### Color Palette
```typescript
// Primary
purple-500: #8b5cf6  // Main brand color
purple-600: #7c3aed  // Hover states
purple-400: #a78bfa  // Highlights

// Status
green-500: Success
red-500: Error
yellow-500: Warning
blue-500: Info

// Grayscale
gray-900: Backgrounds
gray-800: Cards
gray-700: Borders
gray-400: Secondary text
```

### Spacing Scale
```
4px   (1)  - Tight spacing
8px   (2)  - Base unit
12px  (3)  - Small gaps
16px  (4)  - Default spacing
24px  (6)  - Medium spacing
32px  (8)  - Large spacing
48px  (12) - Extra large
```

### Typography Scale
```
text-sm:   14px
text-base: 16px (default)
text-lg:   18px
text-xl:   20px
text-2xl:  24px
text-3xl:  30px
text-4xl:  36px
```

---

## 🛠 Adding New Components

### 1. Create Component File
```typescript
// components/ui/YourComponent.tsx
import React from 'react';

interface YourComponentProps {
  // Define props
}

export function YourComponent({ ...props }: YourComponentProps) {
  return (
    // Your JSX
  );
}
```

### 2. Add TypeScript Types
```typescript
interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}
```

### 3. Apply Design System
- Use design tokens (colors, spacing)
- Add hover states
- Include responsive variants
- Add accessibility attributes

### 4. Document Usage
Add examples to `COMPONENT-SHOWCASE.md`

---

## 🎭 Working with Animations

### Adding Custom Animations

1. **Define keyframes** in `tailwind.config.ts`:
```typescript
keyframes: {
  yourAnimation: {
    '0%': { opacity: '0', transform: 'scale(0.9)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  }
}
```

2. **Create animation class**:
```typescript
animation: {
  'your-animation': 'yourAnimation 0.5s ease-out',
}
```

3. **Use in components**:
```tsx
<div className="animate-your-animation">
  Content
</div>
```

### Animation Best Practices
- Keep animations under 500ms
- Use `ease-out` for entrances
- Use `ease-in` for exits
- Respect `prefers-reduced-motion`
- Don't animate everything

---

## 📱 Responsive Design

### Mobile-First Approach
```tsx
<div className="
  w-full           // Mobile (default)
  sm:w-1/2         // Small screens (640px+)
  md:w-1/3         // Medium screens (768px+)
  lg:w-1/4         // Large screens (1024px+)
">
```

### Common Patterns

#### Stack on Mobile, Grid on Desktop
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</div>
```

#### Hide on Mobile
```tsx
<div className="hidden lg:block">
  Desktop only content
</div>
```

#### Show on Mobile Only
```tsx
<div className="block lg:hidden">
  Mobile only content
</div>
```

---

## ♿ Accessibility

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators
- Escape to close modals/menus

### ARIA Attributes
```tsx
<button
  aria-label="Close dialog"
  aria-pressed={isActive}
  aria-expanded={isOpen}
>
  Button text
</button>
```

### Color Contrast
- Text on background: 4.5:1 minimum
- Large text: 3:1 minimum
- Test with tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Screen Readers
- Use semantic HTML (`<nav>`, `<main>`, `<article>`)
- Add alt text to images
- Label form inputs properly

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Test all breakpoints (mobile, tablet, desktop)
- [ ] Verify animations work smoothly
- [ ] Check keyboard navigation
- [ ] Test with screen reader
- [ ] Verify color contrast
- [ ] Test loading states
- [ ] Test error states
- [ ] Test empty states
- [ ] Check browser compatibility (Chrome, Firefox, Safari, Edge)

### Browser DevTools
- Use responsive mode for mobile testing
- Check performance tab for animation FPS
- Lighthouse audit for accessibility
- Network throttling for slow connections

---

## 🎯 Performance Optimization

### Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
  loading="lazy"
  quality={85}
/>
```

### Code Splitting
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});
```

### Lazy Loading Components
```tsx
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./Component'));

<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

---

## 🐛 Common Issues & Solutions

### Issue: Animations not working
**Solution**: Check Tailwind config is properly imported and animations are defined.

### Issue: Styles not applying
**Solution**: 
1. Restart dev server
2. Check Tailwind content paths
3. Verify className syntax

### Issue: TypeScript errors
**Solution**:
1. Run `npm install @types/react @types/react-dom`
2. Check tsconfig.json
3. Verify prop types

### Issue: Hydration errors
**Solution**:
1. Ensure server/client rendering match
2. Use `'use client'` directive when needed
3. Avoid `Math.random()` or `Date.now()` in render

---

## 📊 Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Custom Metrics
- **First Paint**: < 1s
- **Time to Interactive**: < 3s
- **Animation FPS**: 60fps
- **Bundle Size**: < 500KB (gzipped)

---

## 🚢 Deployment Checklist

### Pre-deployment
- [ ] Run `npm run build` successfully
- [ ] Test production build locally
- [ ] Run Lighthouse audit (score 90+)
- [ ] Check all environment variables
- [ ] Verify API endpoints
- [ ] Test payment flow (Stripe)
- [ ] Check error tracking setup
- [ ] Review security headers

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
DATABASE_URL=postgres://xxx
NEXT_PUBLIC_API_URL=https://api.yourapp.com
```

### Deployment Platforms
- **Vercel** (recommended for Next.js)
- **Railway**
- **AWS Amplify**
- **Netlify**

---

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [React](https://react.dev)

### Design Inspiration
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Linear App](https://linear.app)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Retool](https://retool.com)

### Tools
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) (VSCode extension)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 🤝 Contributing

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use functional components
- Prefer composition over inheritance
- Keep components small and focused

### Commit Messages
```
feat: Add new StatCard component
fix: Resolve animation timing issue
docs: Update component showcase
style: Improve button hover states
perf: Optimize image loading
```

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Update documentation
5. Submit PR with description

---

## 🎓 Learning Path

### Beginner
1. Learn React fundamentals
2. Understand TypeScript basics
3. Study Tailwind CSS
4. Practice component creation

### Intermediate
1. Master React hooks
2. Learn animation principles
3. Study accessibility
4. Understand performance optimization

### Advanced
1. Custom hook creation
2. Advanced TypeScript patterns
3. Animation orchestration
4. Bundle optimization

---

**Happy coding! Build something amazing! 🚀**
