# Ghost Reactions 👻❤️

A lightweight, privacy-friendly reactions system for Ghost CMS. Add quick engagement buttons to your Ghost posts without any backend modifications.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Ghost](https://img.shields.io/badge/ghost-6.0%2B-green)
![License](https://img.shields.io/badge/license-MIT-purple)
![Deploy](https://github.com/codeme-ne/ghost-addon/actions/workflows/deploy.yml/badge.svg)
[![Live](https://img.shields.io/badge/worker-live-green)](https://ghost-reactions.zangerl-luk.workers.dev)

## ✨ Features

- **Simple Integration** - One-line installation via HTML or Code Injection
- **Privacy First** - No cookies, no tracking, GDPR compliant
- **Lightning Fast** - Powered by Cloudflare's edge network
- **Beautiful UI** - Responsive design with dark mode support
- **Free Forever** - Generous free tier handles millions of reactions

## 🚀 Quick Start

### For Ghost Users (5-minute setup)

#### Option 1: HTML Card (Per Post)

Add this to an HTML card in your Ghost post:

```html
<div data-ghost-reactions="{{post.id}}"></div>
<script src="https://your-worker.workers.dev/widget.js" async></script>
```

#### Option 2: Code Injection (Site-wide)

Add to your Ghost admin → Settings → Code injection → Site Footer:

```html
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Add reactions to all posts
  const articles = document.querySelectorAll('article.post-card');
  articles.forEach(article => {
    const postId = article.getAttribute('data-post-id');
    if (postId && article.querySelector('.post-card-excerpt')) {
      const container = document.createElement('div');
      container.setAttribute('data-ghost-reactions', postId);
      article.querySelector('.post-card-excerpt').after(container);
    }
  });
});
</script>
<script src="https://your-worker.workers.dev/widget.js" async></script>
```

#### Option 3: Theme Integration

Add to your `post.hbs` template:

```handlebars
{{!-- Add reactions after content --}}
<div class="reactions-container" data-ghost-reactions="{{id}}"></div>
<script src="https://your-worker.workers.dev/widget.js" async></script>
```

## 🔧 Self-Hosting Setup

### Prerequisites

- Cloudflare account (free)
- Node.js 16+ installed
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/codeme-ne/ghost-addon.git
cd ghost-addon
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure your domain**

Edit `wrangler.toml`:
```toml
[vars]
ALLOWED_ORIGINS = "https://your-ghost-site.com"
```

4. **Deploy to Cloudflare (local)**
```bash
npm run deploy
```

5. **Note your worker URL**

After deployment, you'll get a URL like:
```
https://ghost-reactions.your-account.workers.dev
```

6. **Update the widget URL in your Ghost site**

Replace `https://your-worker.workers.dev` with your actual worker URL.

### CI/CD (GitHub Actions)

This repo includes a workflow at `.github/workflows/deploy.yml` that deploys on pushes to `main` or `master` and on manual dispatch.

Setup steps:

1. In GitHub → Settings → Secrets and variables → Actions → New repository secret
2. Add `CLOUDFLARE_API_TOKEN` with a Cloudflare API token that has “Edit Workers” permission
3. Ensure `package-lock.json` is committed (required for `npm ci` in CI)
4. Push a commit to trigger deploy or run the workflow manually

## 🧪 Try locally

You can test the widget end-to-end with the included `test.html`:

1. Install dependencies
  - `npm install`
2. Start the Worker locally
  - `npm run dev` (defaults to http://localhost:8787)
3. Open `test.html` in your browser (no server required)
4. Ensure the "Worker URL" field is `http://localhost:8787` and click "Load Widget"

Notes:
- Local CORS is already permitted via `wrangler.toml` under `[env.development].vars.ALLOWED_ORIGINS`.
- The Durable Object class is registered via migrations in `wrangler.toml`.

## 🎨 Customization

### Custom Styling

Add to your Ghost Code Injection (Site Header):

```html
<style>
/* Custom reaction button colors */
.ghost-reaction-btn {
  background: #f0f0f0 !important;
  border-color: #ddd !important;
}

.ghost-reaction-btn.active {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%) !important;
}

/* Custom widget spacing */
.ghost-reactions-widget {
  margin: 30px 0 !important;
  justify-content: center !important;
}
</style>
```

### Change Reaction Types

Edit `src/worker.js` to modify available reactions:

```javascript
const REACTIONS = ['heart', 'fire', 'star']; // Your custom reactions
const ICONS = {
  heart: '❤️',
  fire: '🔥',
  star: '⭐'
};
```

## 📊 Analytics

View reaction analytics in your Cloudflare dashboard:

1. Go to your Cloudflare dashboard
2. Select Workers & Pages
3. Click on your ghost-reactions worker
4. View Analytics tab

## 🔒 Security Features

- **CORS Protection** - Only configured domains can use your API
- **Rate Limiting** - Built-in DDoS protection via Cloudflare
- **Input Validation** - All inputs sanitized and validated
- **No PII Collection** - No personal data stored

## 🧪 Testing Locally

1. **Start local development**
```bash
npm run dev
```

2. **Create test HTML file**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Ghost Reactions Test</title>
</head>
<body>
  <h1>Test Post</h1>
  <div data-ghost-reactions="test-post-123"></div>
  <script src="http://localhost:8787/widget.js"></script>
</body>
</html>
```

3. **Open in browser and test reactions**

## 📝 API Documentation

### Get Reactions
```
GET /api/reactions/{post_id}
```

Response:
```json
{
  "heart": 42,
  "like": 15,
  "clap": 8
}
```

### Add Reaction
```
POST /api/reactions/{post_id}
Content-Type: application/json

{
  "reaction": "heart",
  "userId": "user_abc123"
}
```

Response:
```json
{
  "success": true,
  "counts": {
    "heart": 43,
    "like": 15,
    "clap": 8
  },
  "userReactions": ["heart"]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See also: [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ghost CMS team for the amazing platform
- Cloudflare for the excellent Workers platform
- The Ghost community for feedback and support

## 💬 Support

- Issues: https://github.com/codeme-ne/ghost-addon/issues
- Discussions: https://forum.ghost.org
- Email: support@neurohackingly.com

## 🚦 Status

- ✅ Production ready
- ✅ Ghost 6.0+ compatible
- ✅ GDPR compliant
- ✅ Free tier supports 125,000 reactions/month

---

Made with ❤️ for the Ghost community by [neurohackingly.com](https://neurohackingly.com)