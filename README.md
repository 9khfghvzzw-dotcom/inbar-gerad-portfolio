# Inbar Gerad · Professional portfolio

A static, Markdown-driven portfolio covering psychology, statistics, research, PyTorch learning work, and interactive software. Built with Node.js and plain HTML/CSS. There are no application dependencies or browser tracking scripts.

## Run locally

```powershell
npm run build
npm run check
npm start
```

Open the local address printed by the server. Node.js 22 or newer is required.

## Edit content

- `content/profile.json`: biography, contact links, skills, experience, and site URL.
- `content/projects.json`: project cards and source/demo links.
- `content/projects/*.md`: readable case studies; supports headings, paragraphs, lists, HTTPS links, code blocks, formula callouts, and local image evidence.
- `src/assets/`: source-backed screenshots and visual outputs copied into the deployable site.
- `artifacts/`: standalone, inspectable code extracts linked from case studies.
- `src/styles.css`: the black-and-grey visual theme and responsive layout.
- `scripts/build.mjs`: dependency-free static generator.
- `dist/`: generated, deployable site.

After editing, run the build and check commands, commit, and push. GitHub Actions builds and deploys `dist/` to GitHub Pages on every push to `main`. The workflow uses environment-scoped Pages permissions and GitHub OIDC; no deployment secret is required.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for exact setup and update commands, GitHub Pages configuration, and the Vercel alternative. See [LINKEDIN.md](LINKEDIN.md) for coordinated profile text and links.

## Content provenance

The professional summary is based on the current resume and LinkedIn profile. Every public work card is backed by a linked application, source code, generated visual output, or score excerpt. The CIFAR-10 page contains a self-contained extract from a user-authored coursework implementation plus its generated visual checks; it excludes the class brief, dataset copy, and report. The music page shows one score excerpt and links to its existing public implementation, without re-hosting the full score or audio. The private AI-assisted study corpus is described only at a high level because it includes course and assessment material. No participant data, unpublished research findings, benchmark claims, or unsupported authorship claims are included.
