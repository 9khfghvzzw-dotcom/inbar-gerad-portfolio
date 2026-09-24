import {readFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const pages=[];
async function walk(dir){for(const name of await readdir(dir)){const file=path.join(dir,name);if((await stat(file)).isDirectory())await walk(file);else if(file.endsWith('.html'))pages.push(file);}}
await walk(root);
const errors=[];
for(const file of pages){const text=await readFile(file,'utf8');
 if(!text.includes('<html lang="en">'))errors.push(`${file}: missing language`);
 if(!text.includes('name="viewport"'))errors.push(`${file}: missing viewport`);
 if((text.match(/<h1(?:\s|>)/g)||[]).length!==1)errors.push(`${file}: expected one h1`);
 for(const match of text.matchAll(/(?:href|src)="([^"<>]+)"/g)){
  const url=match[1];if(/^(https?:|mailto:|data:)/.test(url))continue;
  const [target,fragment]=url.split('#');let resolved=path.resolve(path.dirname(file),target||path.basename(file));
  try{if((await stat(resolved)).isDirectory())resolved=path.join(resolved,'index.html');await stat(resolved);
   if(fragment&&resolved.endsWith('.html')&&!(await readFile(resolved,'utf8')).includes(`id="${fragment}"`))errors.push(`${file}: missing anchor ${url}`);
  }catch{errors.push(`${file}: missing local target ${url}`);}
 }
 if(/(?:TODO|PLACEHOLDER|example\.com)/.test(text))errors.push(`${file}: unfinished content`);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Verified ${pages.length} HTML pages: local routes, assets, anchors, metadata, and content checks passed.`);
