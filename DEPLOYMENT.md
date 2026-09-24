# Deployment and updates

## Production links

- Portfolio: https://9khfghvzzw-dotcom.github.io/inbar-gerad-portfolio/
- Source: https://github.com/9khfghvzzw-dotcom/inbar-gerad-portfolio
- Deployment runs: https://github.com/9khfghvzzw-dotcom/inbar-gerad-portfolio/actions/workflows/deploy.yml

The verified active account is `9khfghvzzw-dotcom`. Use that account when authenticating.

## Update the published portfolio

Run these commands in the portfolio repository after editing the content:

```powershell
npm run build
npm run check
git add content src scripts dist README.md DEPLOYMENT.md LINKEDIN.md package.json vercel.json .gitignore .github
git commit -m "Update portfolio content"
git push origin main
```

Each push to `main` triggers the GitHub Pages deployment. The Actions page must show a successful run for the pushed commit before treating the update as live.

## Start from a fresh machine

Install Node.js 22 or newer and Git, then run:

```powershell
git clone https://github.com/9khfghvzzw-dotcom/inbar-gerad-portfolio.git
Set-Location inbar-gerad-portfolio
npm run build
npm run check
npm start
```

There are no npm package dependencies to install. Git Credential Manager will handle GitHub sign-in when a push needs authentication. Never place an access token in a remote URL or commit it to the repository.

## GitHub Pages configuration

In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**. The workflow builds the site, checks local links, uploads `dist`, and deploys it to the `github-pages` environment.

If using the GitHub CLI, the exact configuration command for an existing repository without a Pages site is:

```powershell
gh auth login
gh api --method POST repos/9khfghvzzw-dotcom/inbar-gerad-portfolio/pages -f build_type=workflow
gh workflow run deploy.yml --repo 9khfghvzzw-dotcom/inbar-gerad-portfolio
```

For an existing Pages site, use `--method PUT` instead of `POST` to change its build type. Do not create another repository for routine updates.

## Vercel alternative

Import this repository into Vercel. The included `vercel.json` configures `npm run build` and the `dist` output directory. Update `siteUrl` in `content/profile.json` to the actual Vercel URL if it becomes the primary address, then rebuild and push.

## References

[GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
