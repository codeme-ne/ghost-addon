# 🚀 Quick Deployment Guide - Ghost Reactions

Da npm/npx langsam ist, hier die **schnellste Deployment-Methode** über das Cloudflare Dashboard:

## Option 1: Cloudflare Dashboard (Empfohlen für schnellen Start)

### Schritt 1: Worker erstellen

1. Gehe zu [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Klicke auf **Workers & Pages**
3. Klicke auf **Create Application** → **Create Worker**
4. Gib dem Worker einen Namen: `ghost-reactions`

### Schritt 2: Code hochladen

1. Klicke auf **Quick Edit**
2. Lösche den Beispielcode
3. Kopiere den kompletten Inhalt von `src/worker.js`
4. Füge ihn im Editor ein
5. Klicke auf **Save and Deploy**

### Schritt 3: Durable Objects konfigurieren

⚠️ **WICHTIG**: Nach dem ersten Deploy:

1. Gehe zu deinem Worker → **Settings** → **Variables**
2. Unter **Durable Object Bindings** klicke auf **Add Binding**
3. Füge hinzu:
   - Variable name: `REACTION_COUNTER`
   - Class name: `ReactionCounter`
   - Script: Wähle deinen `ghost-reactions` Worker

### Schritt 4: Umgebungsvariablen setzen

In **Settings** → **Variables** → **Environment Variables**:

```
ALLOWED_ORIGINS = https://neurohackingly.com,https://www.neurohackingly.com
```

### Schritt 5: Worker URL notieren

Deine Worker URL wird sein:
```
https://ghost-reactions.[dein-subdomain].workers.dev
```

### Schritt 6: In Ghost einbinden

Füge in Ghost (Code Injection oder HTML Card):

```html
<div data-ghost-reactions="{{post.id}}"></div>
<script src="https://ghost-reactions.[dein-subdomain].workers.dev/widget.js"></script>
```

## Option 2: Wrangler CLI (wenn npm funktioniert)

Falls npm später funktioniert:

```bash
# Installation
npm install

# Login
npx wrangler login

# Deploy
npx wrangler deploy

# Tail logs (optional)
npx wrangler tail
```

## Option 3: GitHub Actions (für automatisches Deployment)

Erstelle `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
```

Füge dann in GitHub Settings → Secrets:
- `CF_API_TOKEN` mit deinem Cloudflare API Token

## 🧪 Testen

1. Öffne `test.html` im Browser
2. Setze Worker URL auf deine deployed URL
3. Teste die Reactions

## 📊 Monitoring

Im Cloudflare Dashboard siehst du:
- Requests pro Tag
- Fehlerrate
- Latenz
- Durable Objects Nutzung

## 🆘 Troubleshooting

### Problem: CORS Fehler
**Lösung**: Stelle sicher, dass deine Domain in `ALLOWED_ORIGINS` ist

### Problem: Reactions werden nicht gespeichert
**Lösung**: Überprüfe ob Durable Object Binding korrekt konfiguriert ist

### Problem: Widget lädt nicht
**Lösung**: Überprüfe die Worker URL in deinem Script-Tag

## 💡 Tipp

Für Production empfehle ich:
1. Custom Domain einrichten (in Worker Settings → Triggers)
2. Rate Limiting aktivieren
3. Web Analytics einschalten

---

**Support**: Bei Fragen gerne melden!
- GitHub Issues: [Link zu deinem Repo]
- Email: support@neurohackingly.com