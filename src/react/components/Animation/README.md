# ES Animation Component

A powerful, scroll-based animation web component with keyboard controls and customizable steps.

## Features

✅ **Scroll Control** - Animate on mouse wheel scroll
✅ **Keyboard Navigation** - Arrow keys, Home, End support
✅ **Configurable Steps** - Define any number of animation steps
✅ **Performance Optimized** - Uses throttle, RAF, and efficient class updates
✅ **Custom Events** - Listen to step changes
✅ **Public API** - Programmatic control
✅ **Accessible** - Respects prefers-reduced-motion
✅ **Responsive** - Works on all screen sizes

## Basic Usage

```html
<es-animation max-steps="10" initial-step="0">
  <div class="es-animation-item">
    <!-- Your animated content -->
  </div>
</es-animation>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `max-steps` | Number | `10` | Maximum number of animation steps |
| `initial-step` | Number | `0` | Starting step |
| `debounce-time` | Number | `50` | Throttle delay in milliseconds |
| `scroll-sensitivity` | Number | `100` | Pixels to scroll per step |
| `animation-speed` | String | `'normal'` | Animation speed: 'slow', 'normal', 'fast' |
| `debug` | Boolean | `false` | Enable debug console logs |

## Examples

### Example 1: Basic Animation

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="./www/scss/app.css">
</head>
<body>
  <es-animation max-steps="5">
    <div class="es-animation-item" style="width: 200px; height: 200px; background: #3498db;">
      Scroll to animate
    </div>
  </es-animation>
  
  <script type="module" src="./www/js/animation.js"></script>
</body>
</html>
```

### Example 2: Multiple Items

```html
<es-animation max-steps="10" animation-speed="slow">
  <div class="es-animation-item">Item 1</div>
  <div class="es-animation-item">Item 2</div>
  <div class="es-animation-item">Item 3</div>
</es-animation>
```

### Example 3: With Animation Presets

```html
<es-animation max-steps="10" class="es-animation-fade">
  <div class="es-animation-item">Fading content</div>
</es-animation>

<es-animation max-steps="10" class="es-animation-slide-up">
  <div class="es-animation-item">Sliding content</div>
</es-animation>

<es-animation max-steps="10" class="es-animation-scale">
  <div class="es-animation-item">Scaling content</div>
</es-animation>

<es-animation max-steps="10" class="es-animation-rotate">
  <div class="es-animation-item">Rotating content</div>
</es-animation>

<es-animation max-steps="10" class="es-animation-color">
  <div class="es-animation-item">Color changing</div>
</es-animation>
```

### Example 4: With Progress Bar

```html
<div class="es-animation-progress"></div>
<es-animation max-steps="10">
  <div class="es-animation-item">Content with progress</div>
</es-animation>
```

## JavaScript API

### Getting the Element

```javascript
const animation = document.querySelector('es-animation');
```

### Public Methods

#### `next()`
Move to the next step.

```javascript
animation.next();
```

#### `prev()`
Move to the previous step.

```javascript
animation.prev();
```

#### `goToStep(step)`
Go to a specific step.

```javascript
animation.goToStep(5);
```

#### `reset()`
Reset to initial step.

```javascript
animation.reset();
```

#### `getCurrentStep()`
Get the current step number.

```javascript
const step = animation.getCurrentStep();
console.log('Current step:', step);
```

#### `getProgress()`
Get progress as a percentage (0-100).

```javascript
const progress = animation.getProgress();
console.log('Progress:', progress + '%');
```

## Events

### `step-change`
Fired when the animation step changes.

```javascript
animation.addEventListener('step-change', (event) => {
  console.log('Step:', event.detail.step);
  console.log('Max steps:', event.detail.maxSteps);
  console.log('Progress:', event.detail.progress);
});
```

**Event Detail:**
```javascript
{
  step: 5,           // Current step
  maxSteps: 10,      // Maximum steps
  progress: 0.5      // Progress (0-1)
}
```

## Keyboard Controls

| Key | Action |
|-----|--------|
| `↓` / `→` | Next step |
| `↑` / `←` | Previous step |
| `Home` | First step |
| `End` | Last step |

## CSS Classes

### Auto-generated Classes

For each step, the component adds classes to items:

```css
.es-animation-step-0  /* Step 0 */
.es-animation-step-1  /* Step 1 */
.es-animation-step-2  /* Step 2 */
/* ... up to max-steps */
```

### Data Attributes

```css
/* On items */
.es-animation-item[data-step="5"] { }

/* On container */
es-animation[data-current-step="5"] { }
```

## Custom Animations

### Method 1: CSS Classes

```scss
.my-custom-animation {
  .es-animation-item {
    transition: all 0.3s ease;
    
    &.es-animation-step-0 {
      transform: translateX(-100px);
      opacity: 0;
    }
    
    &.es-animation-step-5 {
      transform: translateX(0);
      opacity: 1;
    }
    
    &.es-animation-step-10 {
      transform: translateX(100px);
      opacity: 0;
    }
  }
}
```

```html
<es-animation max-steps="10" class="my-custom-animation">
  <div class="es-animation-item">Custom animation</div>
</es-animation>
```

### Method 2: Data Attributes

```css
.es-animation-item {
  transition: all 0.3s ease;
  
  &[data-step="0"] { transform: scale(0.5); }
  &[data-step="5"] { transform: scale(1); }
  &[data-step="10"] { transform: scale(1.5); }
}
```

## Animation Presets

Built-in animation presets you can use:

### Fade
```html
<es-animation class="es-animation-fade">
  <div class="es-animation-item">Content</div>
</es-animation>
```

### Slide Up
```html
<es-animation class="es-animation-slide-up">
  <div class="es-animation-item">Content</div>
</es-animation>
```

### Scale
```html
<es-animation class="es-animation-scale">
  <div class="es-animation-item">Content</div>
</es-animation>
```

### Rotate
```html
<es-animation class="es-animation-rotate">
  <div class="es-animation-item">Content</div>
</es-animation>
```

### Color
```html
<es-animation class="es-animation-color">
  <div class="es-animation-item">Content</div>
</es-animation>
```

## Advanced Examples

### Example: Controlled Animation

```html
<button id="prev">← Previous</button>
<button id="next">Next →</button>
<button id="reset">Reset</button>
<span id="progress"></span>

<es-animation id="myAnimation" max-steps="10">
  <div class="es-animation-item">Controlled content</div>
</es-animation>

<script>
  const animation = document.getElementById('myAnimation');
  const progress = document.getElementById('progress');
  
  document.getElementById('prev').onclick = () => animation.prev();
  document.getElementById('next').onclick = () => animation.next();
  document.getElementById('reset').onclick = () => animation.reset();
  
  animation.addEventListener('step-change', (e) => {
    progress.textContent = `${e.detail.step} / ${e.detail.maxSteps}`;
  });
</script>
```

### Example: Story Sections

```html
<es-animation max-steps="3" scroll-sensitivity="200">
  <div class="es-animation-item" data-step="0">
    <h1>Chapter 1</h1>
    <p>Once upon a time...</p>
  </div>
  <div class="es-animation-item" data-step="1">
    <h1>Chapter 2</h1>
    <p>The adventure continues...</p>
  </div>
  <div class="es-animation-item" data-step="2">
    <h1>Chapter 3</h1>
    <p>The end!</p>
  </div>
</es-animation>

<style>
  .es-animation-item {
    position: absolute;
    opacity: 0;
    transform: translateX(-100%);
    transition: all 0.6s ease;
  }
  
  .es-animation-item[data-step="0"].es-animation-step-0,
  .es-animation-item[data-step="1"].es-animation-step-1,
  .es-animation-item[data-step="2"].es-animation-step-2 {
    opacity: 1;
    transform: translateX(0);
  }
</style>
```

## Performance Tips

1. **Use `will-change`** for animated properties:
   ```css
   .es-animation-item {
     will-change: transform, opacity;
   }
   ```

2. **Limit transforms** to `transform` and `opacity` for best performance

3. **Adjust throttle** for smoother/faster response:
   ```html
   <es-animation debounce-time="100">
   ```

4. **Use fewer steps** for complex animations

## Accessibility

The component respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .es-animation-item {
    transition: none !important;
  }
}
```

## Browser Support

✅ Chrome 54+
✅ Firefox 63+
✅ Safari 10.1+
✅ Edge 79+

Requires:
- Custom Elements API
- ES6 Classes
- CSS Custom Properties

## License

MIT

