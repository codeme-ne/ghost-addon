# 🚀 EXAKTE SCHRITT-FÜR-SCHRITT ANLEITUNG

## Vorbereitung: Was du brauchst
- Einen Cloudflare Account (kostenlos)
- Den Code aus `src/worker.js` (liegt in diesem Ordner)

---

## TEIL 1: Cloudflare Account erstellen (falls noch nicht vorhanden)

1. **Öffne**: https://dash.cloudflare.com/sign-up
2. **Eingeben**:
   - Email-Adresse
   - Passwort (mind. 8 Zeichen)
3. **Klicke**: "Sign Up" Button
4. **Bestätige**: Email-Verifikation (Check dein Postfach)

---

## TEIL 2: Worker erstellen

### Schritt 1: Zum Workers Bereich navigieren

1. **Login** bei Cloudflare: https://dash.cloudflare.com
2. **Klicke** im linken Menü auf "Workers & Pages"

   ![](Hinweis: Es ist das Symbol mit dem Blitz ⚡)

### Schritt 2: Neuen Worker anlegen

1. **Klicke** den blauen Button "Create application"
2. **Wähle** "Create Worker" (NICHT "Pages")
3. Du siehst jetzt eine Template-Auswahl
4. **WICHTIG**: Wähle "Start from scratch" oder "Hello World" Template
5. **Name eingeben**: `ghost-reactions`
   - ⚠️ Dieser Name wird Teil deiner URL!
   - Alternative Namen: `reactions`, `blog-reactions`
6. **Klicke** "Deploy"

### Schritt 3: Code einfügen ⚠️ WICHTIGSTER SCHRITT!

1. Nach dem Deploy siehst du eine Erfolgs-Seite
2. **Klicke** auf "Edit code" Button (sollte auf der Seite sichtbar sein)
3. **Du kommst zum "Worker Playground"**:
   - Links: Code-Editor
   - Rechts: Preview/Test-Bereich

4. **Im linken Code-Editor**:
   - Du siehst Template-Code (z.B. Hello World)
   - **Markiere ALLEN Code** (Strg+A oder Cmd+A)
   - **Lösche ALLES** (Delete/Backspace)
   - Editor muss LEER sein!

5. **Öffne** die Datei `src/worker.js` aus dem `ghost-addon` Ordner:
   - Mit einem Texteditor öffnen
   - **Markiere ALLES** (Strg+A)
   - **Kopiere** (Strg+C)

6. **Zurück im Cloudflare Editor**:
   - Klicke in den leeren Editor
   - **Füge ein** (Strg+V)
   - Der Code beginnt mit: `export class ReactionCounter {`

7. **Deploy den neuen Code**:
   - **Klicke** "Save and Deploy" (rechts oben)
   - Warte auf "Successfully deployed"

---

## TEIL 3: Durable Objects aktivieren (SEHR WICHTIG!)

### Schritt 1: Zu den Einstellungen

1. **Klicke** auf "← ghost-reactions" (oben links) um zur Übersicht zurückzukehren
2. **Klicke** auf den Tab "Settings"
3. **Scrolle** runter zu "Bindings"

### Schritt 2: Durable Object Binding hinzufügen

1. **Finde** die Sektion "Durable Object bindings"
2. **Klicke** "Add binding"
3. **Fülle aus**:
   - Variable name: `REACTION_COUNTER` (EXAKT so schreiben!)
   - Class name: `ReactionCounter` (EXAKT so schreiben!)
   - Script: Wähle `ghost-reactions` aus dem Dropdown
4. **Klicke** "Save"

### Schritt 3: Umgebungsvariablen setzen

1. **Scrolle** hoch zu "Environment Variables"
2. **Klicke** "Add variable"
3. **Fülle aus**:
   - Variable name: `ALLOWED_ORIGINS`
   - Value: `https://neurohackingly.com,https://www.neurohackingly.com`
   - ⚠️ Ersetze mit DEINER Domain!
4. **Klicke** "Save and deploy"

---

## TEIL 4: Deine Worker URL finden

1. **Gehe** zurück zur Übersicht (Tab "Metrics")
2. **Finde** deine URL unter "Preview"
3. Sie sieht so aus: `https://ghost-reactions.DEIN-USERNAME.workers.dev`
4. **KOPIERE** diese URL und speichere sie!

**Beispiel URLs:**
- `https://ghost-reactions.lukasz123.workers.dev`
- `https://ghost-reactions.neurohack.workers.dev`

---

## TEIL 5: In Ghost einbauen

### Option A: Für ALLE Posts (Site-wide)

1. **Login** in dein Ghost Admin: `https://deine-seite.com/ghost`
2. **Gehe zu**: Settings → Code injection
3. **Füge** in "Site Footer" ein:

```html
<script>
// Warte bis Seite geladen ist
document.addEventListener('DOMContentLoaded', function() {
  // Finde den Artikel-Content
  const article = document.querySelector('.gh-content');
  if (article) {
    // Hole Post ID aus der URL
    const pathParts = window.location.pathname.split('/');
    const postSlug = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1];

    // Erstelle Reactions Container
    const container = document.createElement('div');
    container.setAttribute('data-ghost-reactions', postSlug);
    container.style.marginTop = '40px';

    // Füge nach dem Content ein
    article.appendChild(container);
  }
});
</script>
<script src="https://DEINE-WORKER-URL/widget.js" async></script>
```

4. **ERSETZE** `DEINE-WORKER-URL` mit deiner kopierten URL!
5. **Klicke** "Save"

### Option B: Für einzelne Posts (HTML Card)

1. **Öffne** einen Post im Ghost Editor
2. **Klicke** + für neuen Block
3. **Wähle** "HTML" (unter "Other")
4. **Füge ein**:

```html
<div data-ghost-reactions="{{slug}}"></div>
<script src="https://DEINE-WORKER-URL/widget.js" async></script>
```

5. **ERSETZE** `DEINE-WORKER-URL`!
6. **Publish** den Post

---

## TEIL 6: Testen

### Test 1: Worker direkt testen

1. **Öffne** im Browser: `https://DEINE-WORKER-URL/api/reactions/test-post`
2. **Du solltest sehen**: `{}`oder `{"heart":0,"like":0,"clap":0}`
3. Wenn du einen Fehler siehst → Durable Objects Binding prüfen!

### Test 2: Auf deiner Ghost Seite

1. **Öffne** einen Post auf deiner Seite
2. **Scrolle** zum Ende des Artikels
3. **Du solltest sehen**: 3 Reaction-Buttons (❤️ 👍 👏)
4. **Klicke** auf ein Emoji
5. Die Zahl sollte sich erhöhen!

---

## 🔴 HÄUFIGE FEHLER & LÖSUNGEN

### Fehler: "Script not found"
**Lösung**: Worker URL ist falsch. Prüfe die URL nochmal!

### Fehler: Buttons erscheinen nicht
**Lösung**:
1. Öffne Browser Console (F12)
2. Schau nach roten Fehlermeldungen
3. Meist ist die Worker URL falsch

### Fehler: "CORS error"
**Lösung**:
1. Gehe zu Worker Settings
2. Prüfe `ALLOWED_ORIGINS` Variable
3. Muss EXAKT deine Domain sein (mit https://)

### Fehler: Reactions werden nicht gespeichert
**Lösung**: Durable Object Binding fehlt oder ist falsch!
- Variable name MUSS sein: `REACTION_COUNTER`
- Class name MUSS sein: `ReactionCounter`

---

## ✅ FERTIG!

Wenn alles funktioniert:
1. Reactions werden gezählt
2. Besucher können reagieren
3. Alles läuft kostenlos auf Cloudflare!

**Brauchst du Hilfe?**
- Schick mir einen Screenshot von dem Schritt wo es hakt
- Oder die Fehlermeldung aus der Browser Console

---

## 📊 BONUS: Analytics anschauen

1. **Gehe zu** deinem Worker im Cloudflare Dashboard
2. **Klicke** Tab "Analytics"
3. **Sieh**:
   - Wie viele Requests
   - Fehlerrate
   - Response Zeit
   - Alles in Echtzeit!

---

**TIPP**: Mach Screenshots von jedem Schritt, falls was schiefgeht!