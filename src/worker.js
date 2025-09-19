/**
 * Ghost Reactions Worker
 * Handles reaction counting using Cloudflare Durable Objects
 */

export class ReactionCounter {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "GET") {
      // Get current reaction counts
      const counts = await this.state.storage.get("counts") || {};
      return new Response(JSON.stringify(counts), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (request.method === "POST") {
      try {
        const { reaction, userId } = await request.json();

        // Validate reaction type
        const validReactions = ["heart", "like", "clap"];
        if (!validReactions.includes(reaction)) {
          return new Response(JSON.stringify({ error: "Invalid reaction type" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        // Get current counts
        const counts = await this.state.storage.get("counts") || {};

        // Check if user already reacted (stored separately)
        const userReactions = await this.state.storage.get("users") || {};
        const userKey = userId || "anonymous";

        if (userReactions[userKey]?.includes(reaction)) {
          // User already reacted with this type, remove it (toggle)
          counts[reaction] = Math.max(0, (counts[reaction] || 0) - 1);
          userReactions[userKey] = userReactions[userKey].filter(r => r !== reaction);
        } else {
          // Add new reaction
          counts[reaction] = (counts[reaction] || 0) + 1;
          userReactions[userKey] = userReactions[userKey] || [];
          userReactions[userKey].push(reaction);
        }

        // Save updated data
        await this.state.storage.put("counts", counts);
        await this.state.storage.put("users", userReactions);

        return new Response(JSON.stringify({
          success: true,
          counts,
          userReactions: userReactions[userKey] || []
        }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response("Method not allowed", { status: 405 });
  }
}

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return handleCors(request, env);
    }

    const url = new URL(request.url);

    // Serve widget script
    if (url.pathname === "/widget.js") {
      return serveWidget(env);
    }

    // API endpoints
    if (url.pathname.startsWith("/api/reactions/")) {
      const postId = url.pathname.split("/")[3];

      if (!postId) {
        return new Response("Post ID required", { status: 400 });
      }

      // Get the Durable Object instance for this post
      const id = env.REACTION_COUNTER.idFromName(postId);
      const stub = env.REACTION_COUNTER.get(id);

      // Forward request to Durable Object
      const response = await stub.fetch(request);

      // Add CORS headers
      const newResponse = new Response(response.body, response);
      setCorsHeaders(newResponse, request, env);

      return newResponse;
    }

    // Default response
    return new Response("Ghost Reactions API", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};

function handleCors(request, env) {
  const origin = request.headers.get("Origin");
  const allowedOrigins = (env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()).filter(Boolean)) || [];

  if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

  return new Response("Origin not allowed", { status: 403 });
}

function setCorsHeaders(response, request, env) {
  const origin = request.headers.get("Origin");
  const allowedOrigins = (env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()).filter(Boolean)) || [];

  if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
}

function serveWidget(env) {
  const widgetCode = `
(function() {
  'use strict';

  // Configuration
  const API_URL = (() => {
    try {
      // Prefer the script element that loaded this widget
      const current = document.currentScript;
      if (current && current.src) return new URL(current.src).origin;
      // Fallback: find any script ending with /widget.js
      const scripts = Array.from(document.getElementsByTagName('script'));
      const found = scripts.find(s => s.src && /\/widget\.js(\?|$)/.test(s.src));
      if (found) return new URL(found.src).origin;
    } catch (_) {
      /* ignore */
    }
    // Final fallback: use window.location origin (works in local dev with same-origin serving)
    return window.location.origin;
  })();
  const REACTIONS = ['heart', 'like', 'clap'];
  const ICONS = {
    heart: '❤️',
    like: '👍',
    clap: '👏'
  };

  // Generate unique user ID (stored in localStorage)
  function getUserId() {
    let userId = localStorage.getItem('ghost_reactions_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('ghost_reactions_user_id', userId);
    }
    return userId;
  }

  // Get reactions for a post
  async function getReactions(postId) {
    try {
      const response = await fetch(\`\${API_URL}/api/reactions/\${postId}\`);
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch reactions:', err);
      return {};
    }
  }

  // Send reaction
  async function sendReaction(postId, reaction) {
    try {
      const response = await fetch(\`\${API_URL}/api/reactions/\${postId}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reaction: reaction,
          userId: getUserId()
        })
      });
      return await response.json();
    } catch (err) {
      console.error('Failed to send reaction:', err);
      return null;
    }
  }

  // Create reaction button
  function createButton(reaction, count, isActive) {
    const button = document.createElement('button');
    button.className = 'ghost-reaction-btn' + (isActive ? ' active' : '');
    button.innerHTML = \`
      <span class="ghost-reaction-icon">\${ICONS[reaction]}</span>
      <span class="ghost-reaction-count">\${count || 0}</span>
    \`;
    button.dataset.reaction = reaction;
    return button;
  }

  // Initialize reactions widget
  async function initReactions() {
    const containers = document.querySelectorAll('[data-ghost-reactions]');

    for (const container of containers) {
      const postId = container.dataset.postId || container.dataset.ghostReactions;

      if (!postId) {
        console.warn('No post ID found for reactions container');
        continue;
      }

      // Enhanced debugging for common issues
      if (postId === 'unknown') {
        console.warn('Ghost Reactions: Post ID is "unknown". This usually means the slug extraction failed. Check your integration code.');
        console.warn('Current URL:', window.location.href);
        console.warn('Expected format: Use the actual post slug instead of "unknown"');
      }

      // Get current reactions
      const counts = await getReactions(postId);
      const userReactions = JSON.parse(localStorage.getItem(\`reactions_\${postId}\`) || '[]');

      // Create widget
      const widget = document.createElement('div');
      widget.className = 'ghost-reactions-widget';

      // Add buttons
      REACTIONS.forEach(reaction => {
        const button = createButton(
          reaction,
          counts[reaction] || 0,
          userReactions.includes(reaction)
        );

        button.addEventListener('click', async () => {
          // Optimistic UI update
          const countSpan = button.querySelector('.ghost-reaction-count');
          const currentCount = parseInt(countSpan.textContent) || 0;
          const isActive = button.classList.contains('active');

          if (isActive) {
            button.classList.remove('active');
            countSpan.textContent = Math.max(0, currentCount - 1);
          } else {
            button.classList.add('active');
            countSpan.textContent = currentCount + 1;
          }

          // Send to server
          const result = await sendReaction(postId, reaction);

          if (result && result.success) {
            // Update localStorage
            const newUserReactions = result.userReactions || [];
            localStorage.setItem(\`reactions_\${postId}\`, JSON.stringify(newUserReactions));

            // Update all counts
            REACTIONS.forEach(r => {
              const btn = widget.querySelector(\`[data-reaction="\${r}"]\`);
              if (btn) {
                const span = btn.querySelector('.ghost-reaction-count');
                span.textContent = result.counts[r] || 0;

                if (newUserReactions.includes(r)) {
                  btn.classList.add('active');
                } else {
                  btn.classList.remove('active');
                }
              }
            });
          } else {
            // Revert on error
            if (isActive) {
              button.classList.add('active');
              countSpan.textContent = currentCount;
            } else {
              button.classList.remove('active');
              countSpan.textContent = currentCount;
            }
          }
        });

        widget.appendChild(button);
      });

      container.appendChild(widget);
    }
  }

  // Add styles
  const style = document.createElement('style');
  style.textContent = \`
    .ghost-reactions-widget {
      display: flex;
      gap: 12px;
      margin: 20px 0;
      flex-wrap: wrap;
    }

    .ghost-reaction-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      color: #666;
    }

    .ghost-reaction-btn:hover {
      border-color: #999;
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .ghost-reaction-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
      color: white;
    }

    .ghost-reaction-icon {
      font-size: 18px;
      line-height: 1;
    }

    .ghost-reaction-count {
      font-weight: 600;
    }

    @media (prefers-color-scheme: dark) {
      .ghost-reaction-btn {
        background: #1a1a1a;
        border-color: #333;
        color: #999;
      }

      .ghost-reaction-btn:hover {
        border-color: #666;
      }

      .ghost-reaction-btn.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
        color: white;
      }
    }
  \`;
  document.head.appendChild(style);

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReactions);
  } else {
    initReactions();
  }
})();
  `;

  return new Response(widgetCode, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600"
    }
  });
}