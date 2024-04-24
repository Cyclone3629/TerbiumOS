(()=>{var p=self.Ultraviolet,x=["cross-origin-embedder-policy","cross-origin-opener-policy","cross-origin-resource-policy","content-security-policy","content-security-policy-report-only","expect-ct","feature-policy","origin-isolation","strict-transport-security","upgrade-insecure-requests","x-content-type-options","x-download-options","x-frame-options","x-permitted-cross-domain-policies","x-powered-by","x-xss-protection"],w=["GET","HEAD"],b=class extends p.EventEmitter{constructor(t=__uv$config){super(),t.bare||(t.bare="/bare/"),t.prefix||(t.prefix="/service/"),this.config=t;let i=(Array.isArray(t.bare)?t.bare:[t.bare]).map(e=>new URL(e,location).toString());this.address=i[~~(Math.random()*i.length)],this.bareClient=new p.BareClient}async fetch({request:t}){let i;try{if(!t.url.startsWith(location.origin+this.config.prefix))return await fetch(t);let e=new p(this.config,this.address);typeof this.config.construct=="function"&&this.config.construct(e,"service");let a=await e.cookie.db();e.meta.origin=location.origin,e.meta.base=e.meta.url=new URL(e.sourceUrl(t.url));let r=new g(t,this,e,w.includes(t.method.toUpperCase())?null:await t.blob());if(e.meta.url.protocol==="blob:"&&(r.blob=!0,r.base=r.url=new URL(r.url.pathname)),t.referrer&&t.referrer.startsWith(location.origin)){let n=new URL(e.sourceUrl(t.referrer));(r.headers.origin||e.meta.url.origin!==n.origin&&t.mode==="cors")&&(r.headers.origin=n.origin),r.headers.referer=n.href}let l=await e.cookie.getCookies(a)||[],c=e.cookie.serialize(l,e.meta,!1);r.headers["user-agent"]=navigator.userAgent,c&&(r.headers.cookie=c);let f=new m(r,null,null);if(this.emit("request",f),f.intercepted)return f.returnValue;i=r.blob?"blob:"+location.origin+r.url.pathname:r.url;let h=await this.bareClient.fetch(i,{headers:r.headers,method:r.method,body:r.body,credentials:r.credentials,mode:location.origin!==r.address.origin?"cors":r.mode,cache:r.cache,redirect:r.redirect,proxyIp:this.config.proxyIp,proxyPort:this.config.proxyPort}),o=new y(r,h),d=new m(o,null,null);if(this.emit("beforemod",d),d.intercepted)return d.returnValue;for(let n of x)o.headers[n]&&delete o.headers[n];if(o.headers.location&&(o.headers.location=e.rewriteUrl(o.headers.location)),t.destination==="document"){let n=o.headers["content-disposition"];if(!/\s*?((inline|attachment);\s*?)filename=/i.test(n)){let u=/^\s*?attachment/i.test(n)?"attachment":"inline",[v]=new URL(h.finalURL).pathname.split("/").slice(-1);o.headers["content-disposition"]=`${u}; filename=${JSON.stringify(v)}`}}if(o.headers["set-cookie"]&&(Promise.resolve(e.cookie.setCookies(o.headers["set-cookie"],a,e.meta)).then(()=>{self.clients.matchAll().then(function(n){n.forEach(function(u){u.postMessage({msg:"updateCookies",url:e.meta.url.href})})})}),delete o.headers["set-cookie"]),o.body)switch(t.destination){case"script":case"worker":{let n=[e.bundleScript,e.clientScript,e.configScript,e.handlerScript].map(u=>JSON.stringify(u)).join(",");o.body=`if (!self.__uv && self.importScripts) { ${e.createJsInject(this.address,this.bareClient.manfiest,e.cookie.serialize(l,e.meta,!0),t.referrer)} importScripts(${n}); }
`,o.body+=e.js.rewrite(await h.text())}break;case"style":o.body=e.rewriteCSS(await h.text());break;case"iframe":case"document":S(e.meta.url,o.headers["content-type"]||"")&&(o.body=e.rewriteHtml(await h.text(),{document:!0,injectHead:e.createHtmlInject(e.handlerScript,e.bundleScript,e.clientScript,e.configScript,this.address,this.bareClient.manfiest,e.cookie.serialize(l,e.meta,!0),t.referrer)}))}return r.headers.accept==="text/event-stream"&&(o.headers["content-type"]="text/event-stream"),crossOriginIsolated&&(o.headers["Cross-Origin-Embedder-Policy"]="require-corp"),this.emit("response",d),d.intercepted?d.returnValue:new Response(o.body,{headers:o.headers,status:o.status,statusText:o.statusText})}catch(e){return["document","iframe"].includes(t.destination)?(console.error(e),O(e,i,this.address)):new Response(void 0,{status:500})}}static Ultraviolet=p};self.UVServiceWorker=b;var y=class{constructor(t,i){this.request=t,this.raw=i,this.ultraviolet=t.ultraviolet,this.headers={};for(let e in i.rawHeaders)this.headers[e.toLowerCase()]=i.rawHeaders[e];this.status=i.status,this.statusText=i.statusText,this.body=i.body}get url(){return this.request.url}get base(){return this.request.base}set base(t){this.request.base=t}},g=class{constructor(t,i,e,a=null){this.ultraviolet=e,this.request=t,this.headers=Object.fromEntries(t.headers.entries()),this.method=t.method,this.address=i.address,this.body=a||null,this.cache=t.cache,this.redirect=t.redirect,this.credentials="omit",this.mode=t.mode==="cors"?t.mode:"same-origin",this.blob=!1}get url(){return this.ultraviolet.meta.url}set url(t){this.ultraviolet.meta.url=t}get base(){return this.ultraviolet.meta.base}set base(t){this.ultraviolet.meta.base=t}};function S(s,t=""){return(p.mime.contentType(t||s.pathname)||"text/html").split(";")[0]==="text/html"}var m=class{#e;#t;constructor(t={},i=null,e=null){this.#e=!1,this.#t=null,this.data=t,this.target=i,this.that=e}get intercepted(){return this.#e}get returnValue(){return this.#t}respondWith(t){this.#t=t,this.#e=!0}};function C(s,t){let i=new URL(s),e=`remoteHostname.textContent = ${JSON.stringify(i.hostname)};bareServer.href = ${JSON.stringify(t)};uvHostname.textContent = ${JSON.stringify(location.hostname)};reload.addEventListener("click", () => location.reload());uvVersion.textContent = ${JSON.stringify("3.0.0")};`;return`<!DOCTYPE html><html><head><meta charset='utf-8' /><title>Error</title><link rel="stylesheet" href="/uv/uv.styles.css"/></head></head><body><h1>This site can\u2019t be reached</h1><hr /><p><b id="remoteHostname"></b>\u2019s server IP address could not be found.</p><p>Try:</p><ul><p>Verifying you entered the correct address</p><p>Clearing the site data</p><p>Contacting <b id="uvHostname"></b>'s administrator</p><p>Verifying the <a id='bareServer' title='Bare server'>Bare server</a> isn't censored</p></ul><button id="reload">Reload</button><hr /><p><i>Ultraviolet (Legacy Terbium Wisp Hybrid) v<span id="uvVersion"></span></i></p><script src="${"data:application/javascript,"+encodeURIComponent(e)}"><\/script></body></html>`}function U(s,t,i,e,a,r,l){if(e==="The specified host could not be resolved.")return C(r,l);let c=`errorTitle.textContent = ${JSON.stringify(s)};errorCode.textContent = ${JSON.stringify(t)};`+(i?`errorId.textContent = ${JSON.stringify(i)};`:"")+`errorMessage.textContent =  ${JSON.stringify(e)};errorTrace.value = ${JSON.stringify(a)};fetchedURL.textContent = ${JSON.stringify(r)};bareServer.href = ${JSON.stringify(l)};for (const node of document.querySelectorAll("#uvHostname")) node.textContent = ${JSON.stringify(location.hostname)};reload.addEventListener("click", () => location.reload());uvVersion.textContent = ${JSON.stringify("3.0.0")};`;return`<!DOCTYPE html><html><head><meta charset='utf-8' /><title>Error</title><link rel="stylesheet" href="/uv/uv.styles.css"/></head></head><body><h1 id='errorTitle'></h1><hr /><p>Failed to load <b id="fetchedURL"></b></p><p id="errorMessage"></p><table><tbody><tr><td>Code:</td><td id="errorCode"></td></tr>`+(i?'<tr><td>ID:</td><td id="errorId"></td></tr>':"")+`</tbody></table><textarea id="errorTrace" cols="40" rows="10" readonly></textarea><p>Try:</p><ul><p>Checking your internet connection</p><p>Verifying you entered the correct address</p><p>Clearing the site data</p><p>Contacting <b id="uvHostname"></b>'s administrator</p><p>Verify the <a id='bareServer' title='Bare server'>Bare server</a> isn't censored</p></ul><p>If you're the administrator of <b id="uvHostname"></b>, try:</p><ul><p>Restarting your Bare server</p><p>Updating Ultraviolet</p><p>Troubleshooting the error on the <a href="https://github.com/titaniumnetwork-dev/Ultraviolet" target="_blank">GitHub repository</a></p></ul><button id="reload">Reload</button><hr /><p><i>Ultraviolet (Legacy Terbium Wisp Hybrid) v<span id="uvVersion"></span></i></p><script src="${"data:application/javascript,"+encodeURIComponent(c)}"><\/script></body></html>`}function E(s){return s instanceof Error&&typeof s.body=="object"}function O(s,t,i){let e,a,r,l="",c;return E(s)?(e=s.status,a="Error communicating with the Bare server",c=s.body.message,r=s.body.code,l=s.body.id):(e=500,a="Error processing your request",c="Internal Server Error",r=s instanceof Error?s.name:"UNKNOWN"),new Response(U(a,r,l,c,String(s),t,i),{status:e,headers:{"content-type":"text/html"}})}})();
//# sourceMappingURL=uv.sw.js.map
