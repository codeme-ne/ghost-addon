# Product Requirements Document: Ghost Reactions System

## Executive Summary

A lightweight, privacy-friendly reactions system for Ghost CMS that enables readers to quickly express engagement with content without commenting. Built on Cloudflare's edge infrastructure for maximum performance and minimal cost.

## Problem Statement

Ghost 6.0 introduced native comments but lacks a quick reaction mechanism. Content creators need immediate feedback signals, and readers want frictionless ways to express appreciation without the commitment of writing a comment.

### Current Pain Points
- No native quick feedback mechanism in Ghost
- Comments require significant user investment
- No simple engagement metrics for authors
- Third-party solutions are complex or expensive

## User Personas

### 1. **Readers**
- Want to quickly show appreciation
- Prefer not to write full comments
- Value privacy and simplicity
- Access content from various devices

### 2. **Content Creators**
- Need engagement feedback
- Want to understand content resonance
- Require simple analytics
- Limited technical expertise

### 3. **Site Owners**
- Need easy installation (< 5 minutes)
- Want minimal maintenance
- Require GDPR compliance
- Budget-conscious (prefer free/low-cost)

## Functional Requirements

### Core Features (MVP)

#### 1. Reaction Types
- Like/Heart reaction (primary)
- Optional: Clap, Fire, Thinking emojis
- Maximum 3 reaction types to maintain simplicity

#### 2. Display Requirements
- Real-time reaction count
- Visual feedback on interaction
- Responsive design
- Dark/light mode support

#### 3. User Interaction
- Single-click to react
- Visual confirmation of reaction
- Prevent duplicate reactions (localStorage)
- No login required

#### 4. Integration
- Single-line JavaScript installation
- Works with any Ghost theme
- HTML card or code injection compatible
- No backend modifications needed

### Non-Functional Requirements

#### Performance
- < 100ms response time
- < 10KB total script size
- Lazy loading support
- Edge caching via Cloudflare

#### Security
- CORS validation
- Rate limiting (100 reactions/IP/hour)
- Input sanitization
- No PII collection

#### Compliance
- GDPR compliant (no tracking)
- No cookies required
- Transparent data handling
- User privacy by design

## Technical Architecture

### Backend: Cloudflare Workers + Durable Objects

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser   │────▶│   CF Worker  │────▶│Durable Object│
│  (Widget)   │◀────│   (Router)   │◀────│  (Counter)   │
└─────────────┘     └──────────────┘     └──────────────┘
```

#### Why Durable Objects?
- **Atomic updates**: Prevents race conditions
- **Cost-effective**: 125,000 requests/month free
- **Scalable**: Handles millions of reactions
- **Simple**: No external database needed

### Frontend: Vanilla JavaScript Widget

```javascript
// Installation
<div id="reactions" data-post-id="{{post.id}}"></div>
<script src="https://reactions.example.com/widget.js"></script>
```

#### Key Components
1. **Reaction Display**: Shows current counts
2. **Interaction Handler**: Processes clicks
3. **Storage Manager**: localStorage for deduplication
4. **Style Engine**: CSS-in-JS for theming

## API Specification

### Endpoints

#### GET /api/reactions/{post_id}
**Response:**
```json
{
  "like": 42,
  "heart": 15,
  "clap": 8
}
```

#### POST /api/reactions/{post_id}
**Request:**
```json
{
  "reaction": "like"
}
```
**Response:**
```json
{
  "success": true,
  "counts": {
    "like": 43,
    "heart": 15,
    "clap": 8
  }
}
```

## User Experience Flow

1. **Page Load**
   - Widget initializes
   - Fetches current reaction counts
   - Checks localStorage for previous reactions

2. **User Interaction**
   - User clicks reaction button
   - Optimistic UI update
   - API call to record reaction
   - localStorage updated

3. **Error Handling**
   - Graceful degradation if API fails
   - Clear error messaging
   - Retry logic with exponential backoff

## Success Metrics

### Launch Metrics (Month 1)
- 100+ Ghost sites installed
- 10,000+ reactions recorded
- < 0.1% error rate
- < 100ms p95 latency

### Growth Metrics (Month 3)
- 500+ active installations
- 100,000+ monthly reactions
- 95% user satisfaction
- 5-star rating on Ghost forum

## Implementation Timeline

### Day 1: Backend Infrastructure
- [ ] Cloudflare Worker setup
- [ ] Durable Objects configuration
- [ ] API endpoint implementation
- [ ] CORS and security

### Day 2: Frontend Development
- [ ] Widget core functionality
- [ ] localStorage integration
- [ ] Responsive styling
- [ ] Ghost theme compatibility

### Day 3: Testing & Documentation
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Installation guide
- [ ] Demo site setup

## MVP vs Future Enhancements

### MVP (v1.0)
- Single reaction type (heart)
- Basic styling
- Ghost post integration
- Free tier only

### Phase 2 (v1.1)
- Multiple reaction types
- Custom styling options
- Member-specific features
- Analytics dashboard

### Phase 3 (v2.0)
- Webhooks for automation
- A/B testing support
- Premium features
- White-label options

## Risk Assessment

### Technical Risks
- **Cloudflare outage**: Low probability, high impact
- **Mitigation**: Graceful degradation, cached counts

### Business Risks
- **Ghost platform changes**: Medium probability, medium impact
- **Mitigation**: Regular compatibility testing

### Security Risks
- **DDoS attacks**: Low probability, medium impact
- **Mitigation**: Cloudflare's built-in protection

## Privacy & Security

### Data Collection
- Post ID and reaction type only
- No personal information
- No tracking cookies
- No cross-site tracking

### Data Storage
- Reactions stored on Cloudflare edge
- 30-day retention for analytics
- No data sharing with third parties
- User-initiated data deletion supported

## Distribution Strategy

1. **Ghost Forum Launch**
   - Announcement post with demo
   - Free forever for basic features
   - Community feedback integration

2. **GitHub Repository**
   - MIT License
   - Open source contributions welcome
   - Comprehensive documentation

3. **Direct Outreach**
   - Ghost theme developers
   - Popular Ghost bloggers
   - Ghost hosting providers

## Monetization Strategy (Future)

### Freemium Model
- **Free**: 1 reaction type, 10k reactions/month
- **Pro ($5/month)**: 5 reaction types, unlimited reactions, analytics
- **Enterprise**: Custom deployment, SLA, support

## Conclusion

This Ghost Reactions System addresses a clear market need with a simple, elegant solution. By leveraging Cloudflare's edge infrastructure and focusing on user privacy, we can deliver a best-in-class experience that's easy to install and maintain.

The 2-3 day implementation timeline is achievable with the refined architecture using Durable Objects and localStorage, avoiding the complexity of fingerprinting while maintaining effectiveness.

---

*Version 1.0 | Created: January 2025*