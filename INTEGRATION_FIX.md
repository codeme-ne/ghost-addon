# Ghost Reactions Integration Fix for neurohackingly.com

## Problem Identified

The current integration on neurohackingly.com has a bug in the post slug extraction code:

```javascript
// CURRENT BUGGY CODE:
const slug = window.location.pathname.split('/').pop() || 'unknown';
```

When the URL is `/pilot-plane-engineer-framework/` (with trailing slash), `.pop()` returns an empty string, causing the fallback to `'unknown'`.

## Solution

Replace the buggy integration code with this corrected version:

### Option 1: Fixed JavaScript (Recommended)

```html
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Only add reactions to blog posts
  if (document.querySelector('.gh-content, .post-content')) {
    // FIXED: Get the post slug from the URL (handles trailing slash correctly)
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const slug = pathParts[pathParts.length - 1] || 'unknown';
    
    // Create the reactions container
    const container = document.createElement('div');
    container.setAttribute('data-ghost-reactions', slug);
    container.style.marginTop = '30px';
    
    // Add it after the post content
    const content = document.querySelector('.gh-content, .post-content');
    if (content) {
      content.parentNode.insertBefore(container, content.nextSibling);
    }
    
    // Load the reactions widget
    const script = document.createElement('script');
    script.src = 'https://ghost-reactions.zangerl-luk.workers.dev/widget.js';
    script.async = true;
    document.head.appendChild(script);
  }
});
</script>
```

### Option 2: Use Ghost's Built-in Variables (Best Practice)

If you have access to Ghost's theme files, use this in your `post.hbs` template:

```html
{{!-- Add this after your post content --}}
<div data-ghost-reactions="{{slug}}"></div>
<script src="https://ghost-reactions.zangerl-luk.workers.dev/widget.js" async></script>
```

### Option 3: Manual Post ID

For specific posts, you can manually set the post ID:

```html
<div data-ghost-reactions="pilot-plane-engineer-framework"></div>
<script src="https://ghost-reactions.zangerl-luk.workers.dev/widget.js" async></script>
```

## Additional Fixes Needed

1. **SSL Issue**: Fix the SSL configuration for `neurohackingly.com` (non-www) or redirect to `www.neurohackingly.com`

2. **JavaScript Error**: Fix the "Unexpected token 'if'" error in the page's JavaScript

## Testing

After implementing the fix:

1. Open a blog post on neurohackingly.com
2. Open browser dev tools and check the console for errors
3. Verify the reactions container has the correct post ID: `data-ghost-reactions="pilot-plane-engineer-framework"`
4. Test clicking the reaction buttons

## Verification

You can verify the fix works by checking:

```javascript
// In browser console:
document.querySelector('[data-ghost-reactions]').getAttribute('data-ghost-reactions')
// Should return: "pilot-plane-engineer-framework" not "unknown"
```