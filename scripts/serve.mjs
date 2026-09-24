import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');const port=Number(process.env.PORT||4180);
http.createServer(async(req,res)=>{try{let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}if((await stat(file)).isDirectory())file=path.join(file,'index.html');const body=await readFile(file);const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.md':'text/markdown; charset=utf-8','.xml':'application/xml'};res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404,{'Content-Type':'text/plain'}).end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Portfolio preview: http://127.0.0.1:${port}/`));
