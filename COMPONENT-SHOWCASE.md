# Premium Component Showcase

## 🎨 Interactive Component Library

This document showcases all available premium UI components with usage examples.

---

## 📦 Components Overview

### 1. Cards

#### Basic Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description text</CardDescription>
  </CardHeader>
  <CardContent>
    Your content here
  </CardContent>
</Card>
```

#### Hover Card
```tsx
<Card hover>
  <!-- Lifts on hover with shadow glow -->
</Card>
```

#### Gradient Card
```tsx
<Card gradient>
  <!-- Gradient background from gray-800 to gray-900 -->
</Card>
```

#### Full Featured
```tsx
<Card hover gradient className="border-purple-500/30">
  <!-- Combines all effects -->
</Card>
```

---

### 2. Buttons

#### Variants
```tsx
// Primary (default) - Gradient purple with glow
<Button>Primary Action</Button>

// Secondary - Solid gray
<Button variant="secondary">Secondary</Button>

// Outline - Border with hover fill
<Button variant="outline">Outline</Button>

// Ghost - Transparent background
<Button variant="ghost">Ghost</Button>

// Danger - Red for destructive actions
<Button variant="danger">Delete</Button>
```

#### Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

#### Loading State
```tsx
<Button loading>Processing...</Button>
```

#### With Icons
```tsx
<Button>
  <ZapIcon className="w-5 h-5" />
  Click Me
</Button>
```

---

### 3. Loading States

#### Full Screen Loading
```tsx
import { LoadingScreen } from '@/components/ui/LoadingSpinner';

{loading && <LoadingScreen />}
```

#### Inline Spinner
```tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

<LoadingSpinner size="md" />
// sizes: sm, md, lg, xl
```

#### Loading Skeleton
```tsx
import { LoadingSkeleton } from '@/components/ui/LoadingSpinner';

<LoadingSkeleton className="h-20 w-full" />
```

---

### 4. Progress Bars

#### Basic Progress
```tsx
<ProgressBar value={3420} max={20000} />
```

#### With Label
```tsx
<ProgressBar 
  value={3420} 
  max={20000}
  label="Messages Used"
/>
```

#### Color Variants
```tsx
<ProgressBar value={50} max={100} color="purple" />
<ProgressBar value={50} max={100} color="green" />
<ProgressBar value={50} max={100} color="blue" />
<ProgressBar value={50} max={100} color="red" />
<ProgressBar value={50} max={100} color="yellow" />
```

#### Sizes
```tsx
<ProgressBar value={50} max={100} size="sm" />
<ProgressBar value={50} max={100} size="md" />
<ProgressBar value={50} max={100} size="lg" />
```

#### Animated (default) or Static
```tsx
<ProgressBar value={50} max={100} animated={true} />
<ProgressBar value={50} max={100} animated={false} />
```

---

### 5. Badges

#### Variants
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="default">Default</Badge>
```

#### Sizes
```tsx
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

#### With Pulse Animation
```tsx
<Badge variant="success" pulse>Live</Badge>
```

---

### 6. Stat Cards

#### Basic Stat
```tsx
<StatCard
  icon={<MessageSquareIcon className="w-8 h-8" />}
  label="Total Messages"
  value="3,420"
  description="This month"
/>
```

#### With Trend Indicator
```tsx
<StatCard
  icon={<TrendingUpIcon className="w-8 h-8" />}
  label="Growth"
  value="+23%"
  change={{ value: 12, trend: 'up' }}
  description="vs last month"
/>

<StatCard
  icon={<TrendingDownIcon className="w-8 h-8" />}
  label="Errors"
  value="-15%"
  change={{ value: 15, trend: 'down' }}
  description="Great improvement!"
/>
```

---

### 7. Empty States

#### Basic Empty State
```tsx
<EmptyState
  icon={<MessageSquareIcon className="w-16 h-16" />}
  title="No messages yet"
  description="Your messages will appear here once you start chatting"
/>
```

#### With Action Button
```tsx
<EmptyState
  icon={<MessageSquareIcon className="w-16 h-16" />}
  title="No messages yet"
  description="Get started by sending your first message"
  action={{
    label: 'Send Message',
    onClick: () => console.log('Action clicked')
  }}
/>
```

---

### 8. Error States

#### Basic Error
```tsx
<ErrorState
  message="Failed to load data"
/>
```

#### With Custom Title
```tsx
<ErrorState
  title="Connection Failed"
  message="Unable to connect to the server. Please check your internet connection."
/>
```

#### With Retry
```tsx
<ErrorState
  message="Failed to load dashboard"
  onRetry={() => window.location.reload()}
/>
```

#### Error Boundary
```tsx
<ErrorBoundary>
  <YourComponentThatMightError />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

---

### 9. Toast Notifications

#### Setup (in layout)
```tsx
import { ToastProvider } from '@/components/ui/Toast';

<ToastProvider>
  {children}
</ToastProvider>
```

#### Usage in Components
```tsx
import { useToast } from '@/components/ui/Toast';

function MyComponent() {
  const { showToast } = useToast();
  
  return (
    <Button onClick={() => showToast('Success!', 'success')}>
      Show Success
    </Button>
  );
}
```

#### All Variants
```tsx
showToast('Operation completed', 'success');
showToast('Something went wrong', 'error');
showToast('Please review your input', 'warning');
showToast('New update available', 'info');
```

---

## 🎭 Animation Classes

### Entrance Animations
```tsx
className="animate-fade-in"           // Fade in
className="animate-fade-in-up"        // Fade in from below
className="animate-fade-in-down"      // Fade in from above
className="animate-slide-in-right"    // Slide from right
className="animate-slide-in-left"     // Slide from left
className="animate-scale-in"          // Scale from center
```

### Continuous Animations
```tsx
className="animate-bounce-subtle"     // Gentle bounce
className="animate-shimmer"           // Shimmer effect
className="animate-pulse-subtle"      // Gentle pulse
className="animate-gradient"          // Gradient animation
```

### Animation Delays
```tsx
style={{ animationDelay: '0.1s' }}
style={{ animationDelay: '0.2s' }}
style={{ animationDelay: '0.5s' }}
```

---

## 🎨 Utility Classes

### Shadows
```tsx
className="shadow-premium"        // Subtle elevation
className="shadow-premium-lg"     // Higher elevation
className="shadow-glow"           // Purple glow
className="shadow-glow-lg"        // Larger glow
```

### Glass Morphism
```tsx
className="backdrop-blur-xl bg-gray-800/50"
```

### Gradients
```tsx
className="bg-gradient-to-r from-purple-600 to-purple-700"
className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
```

### Gradient Text
```tsx
className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
```

---

## 📐 Layout Patterns

### Dashboard Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard {...} />
  <StatCard {...} />
  <StatCard {...} />
  <StatCard {...} />
</div>
```

### Two Column Layout
```tsx
<div className="grid lg:grid-cols-2 gap-6">
  <Card>Left column</Card>
  <Card>Right column</Card>
</div>
```

### Three Column Quick Actions
```tsx
<div className="grid sm:grid-cols-3 gap-6">
  <Card hover>Action 1</Card>
  <Card hover>Action 2</Card>
  <Card hover>Action 3</Card>
</div>
```

---

## 🎯 Real-World Examples

### Usage Metric Card
```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <MessageSquareIcon className="w-5 h-5 text-purple-400" />
      Message Usage
    </CardTitle>
    <CardDescription>
      Your message quota for the current billing period
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ProgressBar 
      value={3420} 
      max={20000}
      color="purple"
      animated
    />
    <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
      <p className="text-sm text-gray-300">
        <span className="font-semibold text-white">Pro tip:</span> 
        Messages reset on your billing date.
      </p>
    </div>
  </CardContent>
</Card>
```

### Integration Status List
```tsx
<div className="space-y-3">
  {integrations.map((integration) => (
    <div 
      key={integration.name}
      className="flex items-center justify-between p-4 rounded-lg 
                 bg-gray-900/50 border border-gray-700/50 
                 hover:border-purple-500/30 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{integration.icon}</span>
        <div>
          <div className="font-medium text-white">{integration.name}</div>
          <div className="text-xs text-gray-400">
            Last sync: {integration.lastSync}
          </div>
        </div>
      </div>
      {integration.connected ? (
        <Badge variant="success" size="sm">Connected</Badge>
      ) : (
        <Button variant="outline" size="sm">Connect</Button>
      )}
    </div>
  ))}
</div>
```

### Activity Feed
```tsx
<div className="space-y-3">
  {activities.map((activity, i) => (
    <div 
      key={activity.id}
      className="flex items-start gap-3 p-3 rounded-lg 
                 bg-gray-900/50 border border-gray-700/50 
                 hover:border-purple-500/30 transition-all duration-200 
                 animate-fade-in-left"
      style={{ animationDelay: `${i * 0.1}s` }}
    >
      <div className="w-2 h-2 mt-2 rounded-full bg-purple-400 animate-pulse-subtle" />
      <div className="flex-1">
        <p className="text-white text-sm">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
      </div>
    </div>
  ))}
</div>
```

---

## 🚀 Performance Tips

1. **Use animation delays sparingly** - Too many staggered animations can feel sluggish
2. **Prefer CSS animations** over JavaScript for better performance
3. **Use `will-change` carefully** - Only for elements that will definitely animate
4. **Lazy load heavy components** - Use React.lazy() for routes
5. **Optimize images** - Use Next.js Image component with proper sizing
6. **Reduce motion for accessibility** - Respect `prefers-reduced-motion`

---

## 🎓 Best Practices

### ✅ Do
- Use semantic HTML
- Add ARIA labels for accessibility
- Test keyboard navigation
- Provide loading states
- Handle errors gracefully
- Use consistent spacing
- Follow the design system

### ❌ Don't
- Nest too many cards
- Over-animate everything
- Ignore mobile responsiveness
- Forget empty states
- Skip error boundaries
- Use arbitrary values
- Break the color palette

---

**Component library ready for production! 🎉**
