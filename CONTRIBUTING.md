# Contributing to Ghost Reactions

Thanks for your interest in contributing! This project aims to be simple and welcoming.

## How to contribute

- Open an issue to discuss bugs or ideas
- Fork the repo and create a feature branch
- Keep changes focused and small when possible
- Add/update docs if behavior changes
- Open a pull request describing the change and motivation

## Development

- Requirements: Node.js 18+ and npm
- Install: `npm install`
- Dev server: `npm run dev`
- Deploy (manual): `npm run deploy`

## Coding style

- Prefer small functions and clear names
- Avoid unnecessary dependencies
- Keep the Worker and widget self-contained

## CI/CD

- GitHub Actions deploys on push to `main`/`master`
- Ensure `package-lock.json` is updated and committed
- The workflow requires `CLOUDFLARE_API_TOKEN` secret

## Reporting security issues

Please report security concerns privately to support@neurohackingly.com. We'll handle them promptly.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
