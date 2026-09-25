import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFile(path.join(root, file), 'utf8');
const profile = JSON.parse(await read('content/profile.json'));
const projects = JSON.parse(await read('content/projects.json'));

const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

const link = (url, label, className = '') =>
  `<a${className ? ` class="${className}"` : ''} href="${escape(url)}">${escape(label)}<span aria-hidden="true"> ↗</span></a>`;

const inline = text => escape(text).replace(
  /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g,
  '<a href="$2">$1</a>'
);

function renderCode(lines, language) {
  const className = language.replace(/[^a-z0-9_-]/gi, '');
  return `<pre class="code-example"><code${className ? ` class="language-${className}"` : ''}>${escape(lines.join('\n'))}</code></pre>`;
}

function renderImage(line) {
  const match = line.match(/^!\[([^\]]*)\]\(([^\s)]+)\)$/);
  if (!match) return null;
  const [, alt, src] = match;
  return `<figure class="artifact-figure"><img src="${escape(src)}" alt="${escape(alt)}" loading="lazy"><figcaption>${escape(alt)}</figcaption></figure>`;
}

function markdown(source) {
  const lines = source.trim().split(/\r?\n/);
  let listOpen = false;
  let codeOpen = false;
  let codeLines = [];
  let codeLanguage = '';
  let result = '';

  const closeList = () => {
    if (listOpen) {
      result += '</ul>';
      listOpen = false;
    }
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (codeOpen) {
        result += renderCode(codeLines, codeLanguage);
        codeOpen = false;
        codeLines = [];
        codeLanguage = '';
      } else {
        closeList();
        codeOpen = true;
        codeLanguage = line.slice(3).trim();
      }
      continue;
    }

    if (codeOpen) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    const image = renderImage(line);
    if (image) {
      closeList();
      result += image;
      continue;
    }

    if (line.startsWith('$$') && line.endsWith('$$') && line.length > 4) {
      closeList();
      result += `<div class="formula"><code>${escape(line.slice(2, -2).trim())}</code></div>`;
      continue;
    }

    if (line.startsWith('- ')) {
      if (!listOpen) {
        result += '<ul>';
        listOpen = true;
      }
      result += `<li>${inline(line.slice(2))}</li>`;
      continue;
    }

    closeList();
    const heading = line.match(/^(#{1,3}) (.*)$/);
    result += heading
      ? `<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`
      : `<p>${inline(line)}</p>`;
  }

  if (codeOpen) result += renderCode(codeLines, codeLanguage);
  closeList();
  return result;
}

function head(title, description, prefix = './', route = '') {
  const canonical = profile.siteUrl
    ? new URL(route, profile.siteUrl.endsWith('/') ? profile.siteUrl : `${profile.siteUrl}/`).href
    : '';
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark"><meta name="theme-color" content="#101112"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:type" content="website">${canonical ? `<link rel="canonical" href="${escape(canonical)}"><meta property="og:url" content="${escape(canonical)}">` : ''}<link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${prefix}assets/styles.css"></head>`;
}

function nav(prefix = './') {
  return `<a class="skip" href="#main">Skip to content</a><header class="site-header wrap"><a class="identity" href="${prefix}"><span class="monogram" aria-hidden="true">ig.</span><span>Inbar Gerad</span></a><nav aria-label="Main navigation"><a href="${prefix}#work">Work</a><a href="${prefix}#about">About</a><a href="${prefix}#contact">Contact</a>${link(profile.github, 'GitHub')}</nav></header>`;
}

function footer(prefix = './') {
  return `<footer class="wrap"><span>Inbar Gerad · Psychology, statistics & applied AI</span>${profile.repositoryUrl ? link(profile.repositoryUrl, 'Portfolio source') : link(profile.linkedin, 'LinkedIn')}<a href="${prefix}#main">Back to top ↑</a></footer>`;
}

function projectVisual(project) {
  if (!project.visual) return '';
  return `<img class="project-visual" src="${escape(project.visual.src)}" alt="${escape(project.visual.alt)}" loading="lazy">`;
}

const cards = projects.map(project => `<article class="project"><div class="project-meta"><span>${escape(project.number)}</span><span>${escape(project.type)}</span></div>${projectVisual(project)}<h3><a href="./projects/${project.id}.html">${escape(project.title)}</a></h3><p>${escape(project.summary)}</p><ul class="tags" aria-label="Technologies">${project.tags.map(tag => `<li>${escape(tag)}</li>`).join('')}</ul><div class="project-links"><a href="./projects/${project.id}.html">Read case study <span aria-hidden="true">→</span></a>${project.links.slice(0, 1).map(item => link(item.url, item.label)).join('')}</div></article>`).join('');

const home = `${head(`${profile.name} — Psychology, Statistics & Applied AI`, profile.description)}<body>${nav()}<main id="main" tabindex="-1"><section class="hero wrap" aria-labelledby="intro-title"><div class="eyebrow"><span>Research / code / human behaviour</span><span>Portfolio · 2026</span></div><h1 id="intro-title">Human questions.<br><span class="muted-title">Quantitative thinking.</span></h1><div class="hero-bottom"><p>${escape(profile.intro)}</p><div class="hero-actions"><a class="button primary" href="#work">Explore selected work <span aria-hidden="true">↓</span></a><a class="text-link" href="${escape(profile.linkedin)}">Connect on LinkedIn ↗</a></div></div><div class="focus-strip"><span>Psychology & Statistics <small>Ben-Gurion University</small></span><span>Cognitive Neuroscience <small>Research assistant</small></span><span>Python · R · PyTorch <small>Analysis & implementation</small></span></div></section><section id="work" class="section wrap" aria-labelledby="work-title"><div class="section-heading"><span class="section-index">01 / Selected work</span><h2 id="work-title">Work I can show.</h2><p>Source-backed implementations, visual outputs, and interactive tools.</p></div><div class="projects">${cards}</div></section><section id="about" class="section wrap about" aria-labelledby="about-title"><div class="section-heading"><span class="section-index">02 / Background</span><h2 id="about-title">Where behaviour<br>meets data.</h2><p>I bring a behavioural-science perspective to technical work: ask a clear question, examine the evidence, and communicate what the model can support.</p><p>My background in music also shapes how I build—through iteration, careful listening, and attention to structure.</p></div><div class="experience"><h3 class="small-heading">Experience</h3>${profile.experience.map(item => `<article><div class="role-line"><h4>${escape(item.role)}</h4><span>${escape(item.dates)}</span></div><p class="organisation">${escape(item.organisation)}</p><p>${escape(item.description)}</p></article>`).join('')}<article class="education"><h3 class="small-heading">Education</h3><h4>${escape(profile.education.degree)}</h4><p class="organisation">${escape(profile.education.institution)}</p><p>${escape(profile.education.description)}</p><p class="exchange">${escape(profile.education.exchange)}</p></article></div></section><section class="section wrap" aria-labelledby="toolkit-title"><div class="section-heading compact"><span class="section-index">03 / Toolkit</span><h2 id="toolkit-title">Methods & tools.</h2></div><div class="skill-grid">${profile.skills.map(skill => `<div><h3>${escape(skill.label)}</h3><ul>${skill.items.map(item => `<li>${escape(item)}</li>`).join('')}</ul></div>`).join('')}</div></section><section id="contact" class="section wrap contact" aria-labelledby="contact-title"><span class="section-index">04 / Contact</span><div class="contact-grid"><div><h2 id="contact-title">Let’s work on<br>a useful question.</h2><p>Interested in data science, applied science, machine learning, and research work with a clear connection to people.</p></div><div class="contact-links">${link(`mailto:${profile.email}`, 'Email me')}${link(profile.linkedin, 'LinkedIn')}${link(profile.github, 'GitHub')}<a href="./profile.html">Professional profile <span aria-hidden="true">→</span></a></div></div></section></main>${footer()}</body></html>`;

await rm(path.join(root, 'dist'), { recursive: true, force: true });
await mkdir(path.join(root, 'dist', 'projects'), { recursive: true });
await cp(path.join(root, 'src', 'assets'), path.join(root, 'dist', 'assets'), { recursive: true });
await cp(path.join(root, 'src', 'styles.css'), path.join(root, 'dist', 'assets', 'styles.css'));
await cp(path.join(root, 'src', 'favicon.svg'), path.join(root, 'dist', 'assets', 'favicon.svg'));
await writeFile(path.join(root, 'dist', 'index.html'), home);

for (const project of projects) {
  const body = markdown(await read(project.detail));
  const page = `${head(`${project.title} — Inbar Gerad`, project.summary, '../', `projects/${project.id}.html`)}<body>${nav('../')}<main id="main" tabindex="-1" class="wrap case-study"><a class="back-link" href="../#work">← Selected work</a><div class="eyebrow">${escape(project.type)}</div><article class="prose">${body}</article><div class="case-links">${project.links.map(item => link(item.url, item.label, 'button')).join('')}</div></main>${footer('../')}</body></html>`;
  await writeFile(path.join(root, 'dist', 'projects', `${project.id}.html`), page);
}

const profileMarkdown = `# ${profile.name}\n\n${profile.title}\n\n${profile.intro}\n\n## Experience\n\n${profile.experience.map(item => `### ${item.role}\n\n${item.organisation} | ${item.dates}\n\n${item.description}`).join('\n\n')}\n\n## Education\n\n${profile.education.degree}\n\n${profile.education.institution}\n\n${profile.education.description}\n\n${profile.education.exchange}\n\n## Skills\n\n${profile.skills.map(skill => `### ${skill.label}\n\n${skill.items.join(', ')}`).join('\n\n')}\n\n## Contact\n\n- [LinkedIn](${profile.linkedin})\n- [GitHub](${profile.github})\n`;
await writeFile(path.join(root, 'dist', 'profile.md'), profileMarkdown);
await writeFile(path.join(root, 'dist', 'profile.html'), `${head('Professional profile — Inbar Gerad', profile.description, './', 'profile.html')}<body>${nav()}<main id="main" tabindex="-1" class="wrap case-study"><a class="back-link" href="./">← Portfolio</a><article class="prose">${markdown(profileMarkdown)}</article><a class="button" href="./profile.md" download>Download Markdown profile</a></main>${footer()}</body></html>`);
await writeFile(path.join(root, 'dist', '.nojekyll'), '');

if (profile.siteUrl) {
  const base = profile.siteUrl.replace(/\/$/, '');
  const routes = ['', 'profile.html', ...projects.map(project => `projects/${project.id}.html`)];
  const urls = routes.map(route => `<url><loc>${escape(`${base}/${route}`)}</loc></url>`).join('');
  await writeFile(path.join(root, 'dist', 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
}

console.log(`Built portfolio and ${projects.length} case studies in dist/`);
