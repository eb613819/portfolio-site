# Personal Website – Evan Brooks

This repository contains the source code for my personal portfolio website.

> [Live Site](https://evanbrooks.me)

The site highlights selected projects, technical experience, and hands-on work across software development, infrastructure, electronics, and fabrication. It provides an overview of my skills, interests, and the types of problems I enjoy solving.

---

## Tech Stack

- Angular
- TypeScript
- HTML / CSS
- Responsive design
- Deployed as a static site
- Data loaded dynamically from a separate content repository (JSON over HTTP)

---

## Features

- Project gallery with filtering by type, tags, and status
- Expandable project cards with images and links
- Experience gallery with filtering by type and tags
- Resume download
- Clean, minimal UI

---

## Data Architecture

Project and experience data are stored in a separate repository and fetched at runtime via HTTP requests.
This separates site content from the presentation layer, allowing updates to project data without modifying or redeploying the application code.

Data is fetched from a [data repo](https://github.com/eb613819/portfolio-site-data).

---

## Portfolio Editor

The site includes a built-in content editor at [evanbrooks.me/editor](https://evanbrooks.me/editor) for managing project and experience data without manually editing JSON.

### Features
- Browse and edit all project entries via a structured form
- Create new project entries
- Upload images directly to the data repository
- Changes are committed directly to the data repository via the GitHub API

### Authentication
The editor uses GitHub OAuth for authentication. The OAuth token exchange is handled by a dedicated Cloudflare Worker ([portfolio-oauth-worker](https://github.com/eb613819/portfolio-oauth-worker)) which keeps the client secret out of the frontend code.

### Local Development
To run the editor locally, update the `REDIRECT_URI` in `auth.service.ts` to `http://localhost:4200/editor` and register `http://localhost:4200/editor` as a valid callback URL in the GitHub OAuth app settings.

---

## Local Development

To run the site locally, install dependencies and run the development server:

```bash
npm install
ng serve
```

Open `http://localhost:4200` in a browser.

---

## Production Build
Run
```bash
ng build --configuration production --base-href /
```
to generate a production build.

---

## Development Workflow
This repository follows a structured workflow to maintain clean history, traceability, and a deployable `main` branch at all times.

### Branching Strategy

- `main` is always production-ready  
- All work is completed in a feature branch  
- One branch per issue  

#### Branch naming convention: 
The issue number **must** be included in the branch name, along with a short description. The convention is `<type>/<issue-number>-short-description`. Example:
- `feature/3-add-creality-button`
- `fix/1-fix-mobile-menu`
- `docs/53-add-build-guide`

### Issue Tracking
All changes are tracked using GitHub issues.

Issues describe the intended outcome of a change and include clear acceptance criteria. Implementation details are handled within the branch and pull request.

### Development Process

1. Start from an updated `main` branch:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Create a feature branch:
   ```bash
   git checkout -b <type>/<issue-number>-short-description
   ```

3. Commit changes with a descriptive message referencing the issue:
   ```bash
   git add .
   git commit -m "feat: short description (#issue-number)"
   ```

4. Push the branch:
   ```bash
   git push -u origin <type>/<issue-number>-short-description
   ```

### Pull Requests
- Open a pull request into `main`
- Reference the associated issue
- Merge only after requirements are satisfied
- Delete the feature branch after merging

No direct commits are made to `main`.

---

## Deployment
Deployment is performed from the `main` branch:
```bash
git checkout main  
git pull origin main
ng build --configuration production --base-href /
npx angular-cli-ghpages --dir dist/personal_website/browser
```
After deployment, ensure the custom domain is configured in the repository’s Pages settings.

---

## License
This project is provided for personal and educational reference. All site content and design are © Evan Brooks.
