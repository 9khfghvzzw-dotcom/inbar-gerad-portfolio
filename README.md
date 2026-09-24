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
- `content/projects/*.md`: readable case studies; supports headings, paragraphs, lists, and HTTPS links.
- `src/styles.css`: the black-and-grey visual theme and responsive layout.
- `scripts/build.mjs`: dependency-free static generator.
- `dist/`: generated, deployable site.

After editing, run the build and check commands, commit, and push. GitHub Actions builds and deploys `dist/` to GitHub Pages on every push to `main`. The workflow uses environment-scoped Pages permissions and GitHub OIDC; no deployment secret is required.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for exact setup and update commands, GitHub Pages configuration, and the Vercel alternative. See [LINKEDIN.md](LINKEDIN.md) for coordinated profile text and links.

## Content provenance

The professional summary is based on the current resume and LinkedIn profile. The public game and audio case studies link to the original repositories. The R case study describes methods only. The PyTorch case study is labelled coursework-based, AI-assisted study work; no proprietary course files, participant data, or unpublished findings are included. No benchmark results or independently unaided authorship claims are made.
