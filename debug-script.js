// Ghost Reactions Debug Script
// Run this in the browser console on neurohackingly.com to test the reactions system

console.log('🔍 Ghost Reactions Debug Script');
console.log('================================');

// Check current page info
console.log('📍 Current URL:', window.location.href);
console.log('📄 Page Title:', document.title);

// Check if this is a blog post
const postContent = document.querySelector('.gh-content, .post-content');
console.log('📝 Is blog post:', !!postContent);

// Check existing reactions container
const existingContainer = document.querySelector('[data-ghost-reactions]');
if (existingContainer) {
  console.log('📦 Existing container found:', existingContainer);
  console.log('🏷️  Current post ID:', existingContainer.getAttribute('data-ghost-reactions'));
} else {
  console.log('❌ No reactions container found');
}

// Extract correct slug
const pathParts = window.location.pathname.split('/').filter(Boolean);
const correctSlug = pathParts[pathParts.length - 1] || 'unknown';
console.log('✅ Correct slug should be:', correctSlug);

// Test API endpoint
async function testAPI() {
  const apiUrl = 'https://ghost-reactions.zangerl-luk.workers.dev';
  const postId = correctSlug;
  
  try {
    console.log('🧪 Testing API endpoint...');
    const response = await fetch(`${apiUrl}/api/reactions/${postId}`);
    const data = await response.json();
    console.log('✅ API Response:', data);
    return true;
  } catch (error) {
    console.error('❌ API Error:', error);
    return false;
  }
}

// Fix function - creates correct reactions container
function fixReactions() {
  console.log('🔧 Applying fix...');
  
  // Remove existing container if it exists
  const existing = document.querySelector('[data-ghost-reactions]');
  if (existing) {
    existing.remove();
    console.log('🗑️  Removed existing container');
  }
  
  if (postContent) {
    // Create new container with correct slug
    const container = document.createElement('div');
    container.setAttribute('data-ghost-reactions', correctSlug);
    container.style.marginTop = '30px';
    
    // Add it after the post content
    postContent.parentNode.insertBefore(container, postContent.nextSibling);
    
    console.log('📦 Created new container with post ID:', correctSlug);
    
    // Load widget script
    const existingScript = document.querySelector('script[src*="ghost-reactions"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.src = 'https://ghost-reactions.zangerl-luk.workers.dev/widget.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Widget script loaded successfully');
    };
    script.onerror = () => {
      console.error('❌ Failed to load widget script');
    };
    document.head.appendChild(script);
    
    console.log('🚀 Fix applied! Check for reactions below the post content.');
  } else {
    console.log('❌ This is not a blog post page');
  }
}

// Run tests
console.log('\n🧪 Running tests...');
testAPI().then(() => {
  console.log('\n🔧 To fix the reactions on this page, run: fixReactions()');
});

// Make functions available in global scope
window.fixReactions = fixReactions;
window.testAPI = testAPI;