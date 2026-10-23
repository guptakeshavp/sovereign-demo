import{S as e,c as t,d as n,w as r}from"./motion-DNyWKNTG.js";import{b as i,x as a,y as o}from"./index-MfVhIzHn.js";var s=r(e(),1),c=300;function l(e,t){let n=parseInt(e.slice(1),16);return`#`+[n>>16,n>>8&255,n&255].map(e=>Math.round(t<0?e*(1+t):e+(255-e)*t)).map(e=>Math.max(0,Math.min(255,e)).toString(16).padStart(2,`0`)).join(``)}function u(e){let t=parseInt(e.slice(1),16);return .2126*(t>>16)+.7152*(t>>8&255)+.0722*(t&255)>150}function d(e,t=!1){return e.map(e=>{let[n,...r]=e;return n===`Z`?`Z`:n+r.map((e,n)=>+(n%2==0&&t?c-e:e).toFixed(1)).join(` `)}).join(` `)}var f=0;function p(e,t,n){let r=u(t),i=r?`rgba(0,0,0,.06)`:`rgba(255,255,255,.045)`,a=(t,n,r=0)=>`
    <filter id="gr-${e}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="${t}" numOctaves="2" seed="7" result="n"/>
      ${r?`<feGaussianBlur in="n" stdDeviation="${r}" result="n"/>`:``}
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${n/3} ${n/3} ${n/3} 0 -${n*.32}"/>
    </filter>`,o=``,s=a(.95,.42);switch(n){case`flannel`:s=a(.6,.55,.5);break;case`hopsack`:s=a(.8,.36),o=`<pattern id="wv-${e}" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="${i}"/><rect x="3" y="3" width="3" height="3" fill="${i}"/></pattern>`;break;case`crepe`:s=a(1.3,.4),o=`<pattern id="wv-${e}" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 3.5 Q1.75 1 3.5 3.5 T7 3.5" stroke="${i}" stroke-width=".8" fill="none"/></pattern>`;break;case`satin`:s=a(.4,.14),o=`<pattern id="wv-${e}" width="3" height="3" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="3" y2="0" stroke="rgba(255,255,255,.14)" stroke-width="1"/></pattern>`;break;default:o=`<pattern id="wv-${e}" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="${i}" stroke-width="1.2"/></pattern>`}return`<defs>${s}${o}
    <pattern id="tx-${e}" width="96" height="96" patternUnits="userSpaceOnUse">
      <rect width="96" height="96" filter="url(#gr-${e})"/>
      ${o?`<rect width="96" height="96" fill="url(#wv-${e})"/>`:``}
    </pattern>
    <linearGradient id="sh-${e}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".3" stop-color="#000" stop-opacity="0"/>
      <stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/>
    </linearGradient>
    <linearGradient id="sv-${e}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="${r?.18:.09}"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".16"/>
    </linearGradient>
    <filter id="bl-${e}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="bs-${e}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.6"/></filter>
  </defs>`}function m(e,t,n=0){let r=e.colour,i=l(r,-.2),a=l(r,-.34),o=u(r)?l(r,-.22):l(r,-.4),s=e.fitScale??1,c=u(r)?`#7A6A5C`:`#1A1715`,f=e.closure===`db4`,p=f||e.closure===`sb2`?2:1,m=f?190:p===1?218:198,h=e.length===`cropped`?292:e.length===`long`?372:336,g=e.sleeve===`bracelet`?244:266,_=[[`M`,150,72],[`Q`,110,66,70,80],[`L`,90,134],[`Q`,78,230,88,h-2],[`Q`,150,h+14,212,h-2],[`Q`,222,230,210,134],[`L`,230,80],[`Q`,190,66,150,72],[`Z`]],v=[[`M`,70,80],[`Q`,46,170,44,g],[`L`,78,g+4],[`Q`,84,196,90,134],[`Z`]],y=[[`M`,230,80],[`Q`,254,170,256,g],[`L`,222,g+4],[`Q`,216,196,210,134],[`Z`]],b=[[`M`,150,m+4],[`L`,132,76],[`L`,150,70],[`L`,168,76],[`Z`]],x,S,C=f?14:0;e.lapel===`peak`?(x=[[`M`,150,m],[`L`,96-C,82],[`L`,128-C/2,90],[`L`,134,76],[`Z`]],S=[[`M`,150,62],[`L`,116,66],[`L`,128-C/2,90],[`L`,134,76],[`L`,150,70],[`Z`]]):e.lapel===`shawl`?(x=[[`M`,150,m],[`C`,116,170,100,120,108,66],[`Q`,128,60,150,58],[`L`,150,66],[`Q`,140,68,134,76],[`Z`]],S=null):(x=[[`M`,150,m],[`L`,104-C,100],[`L`,124-C/2,86],[`L`,134,76],[`Z`]],S=[[`M`,150,62],[`L`,112,66],[`L`,124-C/2,86],[`L`,134,76],[`L`,150,70],[`Z`]]);let w=e=>[0,1,2].map(t=>`<circle cx="${e?300-(50+t*8):50+t*8}" cy="${g-10+t*1.2}" r="2.4" fill="${c}" opacity=".9"/>`).join(``),T=(e,t)=>`<circle cx="${e}" cy="${t}" r="5" fill="${c}" stroke="${l(c,.3)}" stroke-width=".8"/><path d="M${e-2} ${t-2} l4 4 M${e+2} ${t-2} l-4 4" stroke="${l(c,.5)}" stroke-width=".8" fill="none"/>`,E=f?[0,1].flatMap(e=>[T(132,m+e*42),T(168,m+e*42)]).join(``):Array.from({length:p},(e,t)=>T(150,m+t*42)).join(``),D=f?`<path d="M168 ${m-30} L172 ${h-6}" stroke="${o}" stroke-width="1" fill="none" opacity=".6"/>`:`<path d="M150 ${m+8} L150 ${m+(p-1)*42+28} Q152 ${h-8} 176 ${h}" stroke="${o}" stroke-width="1.1" fill="none" opacity=".7"/>`;return`<g transform="translate(0 ${n})"><g transform="translate(150 0) scale(${s} 1) translate(-150 0)">
    <path d="${d(v)}" fill="${i}"/><path d="${d(y)}" fill="${i}"/>
    <path d="${d(v)} ${d(y)}" fill="url(#tx-${t})"/>
    <path d="M48 ${g-12} Q62 ${g-8} 78 ${g-8}" stroke="${o}" stroke-width="1" fill="none" opacity=".6"/>
    <path d="M252 ${g-12} Q238 ${g-8} 222 ${g-8}" stroke="${o}" stroke-width="1" fill="none" opacity=".6"/>
    ${w(!1)}${w(!0)}
    <path d="${d(_)}" fill="${r}"/><path d="${d(_)}" fill="url(#tx-${t})"/><path d="${d(_)}" fill="url(#sh-${t})"/><path d="${d(_)}" fill="url(#sv-${t})"/>
    <path d="M118 184 L112 ${h-10} M182 184 L188 ${h-10}" stroke="${o}" stroke-width=".9" fill="none" opacity=".55"/>
    ${D}
    <path d="M168 160 L206 158 L205 165 L169 167 Z" fill="${a}" opacity=".9"/>
    <path d="M90 ${h-70} L140 ${h-70} L138 ${h-57} L92 ${h-57} Z" fill="${i}"/>
    <path d="M160 ${h-70} L210 ${h-70} L208 ${h-57} L162 ${h-57} Z" fill="${i}"/>
    <path d="${d(b)}" fill="#EDE8E0"/>
    <path d="M150 ${m} L150 84" stroke="rgba(0,0,0,.12)" stroke-width="1"/>
    <g transform="translate(2 3)" filter="url(#bs-${t})" opacity=".35"><path d="${d(x)}" fill="#000"/><path d="${d(x,!0)}" fill="#000"/></g>
    <path d="${d(x)}" fill="${i}"/><path d="${d(x,!0)}" fill="${i}"/>
    ${S?`<path d="${d(S)}" fill="${a}"/><path d="${d(S,!0)}" fill="${a}"/>`:``}
    <path d="${d(x)} ${d(x,!0)}" fill="url(#tx-${t})"/>
    <path d="M${112-C} ${m-62} l5 -4" stroke="${o}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
    ${E}
  </g></g>`}function h(e,t,n=0,r=1){let i=e.colour,a=l(i,-.2),o=u(i)?l(i,-.22):l(i,-.4),s=u(i)?l(i,.3):l(i,.12),c=e.leg===`wide`,f=c?[68,134]:[78,124],p=c?[166,232]:[176,222],m=[[`M`,94,52],[`L`,150,52],[`L`,150,142],[`L`,f[1],402],[`L`,f[0],402],[`L`,86,160],[`Z`]],h=[[`M`,206,52],[`L`,150,52],[`L`,150,142],[`L`,p[0],402],[`L`,p[1],402],[`L`,214,160],[`Z`]],g=e.pleat===`single`?`<path d="M118 54 L112 140 M182 54 L188 140" stroke="${o}" stroke-width="1" fill="none" opacity=".7"/>`:``;return`<g transform="translate(0 ${n}) scale(${r})"><g transform="translate(150 0) scale(${e.fitScale??1} 1) translate(-150 0)">
    <path d="${d(m)}" fill="${i}"/><path d="${d(h)}" fill="${i}"/>
    <path d="${d(m)} ${d(h)}" fill="url(#tx-${t})"/><path d="${d(m)} ${d(h)}" fill="url(#sh-${t})"/><path d="${d(m)} ${d(h)}" fill="url(#sv-${t})"/>
    <path d="M118 166 L${(f[0]+f[1])/2} 396 M182 166 L${(p[0]+p[1])/2} 396" stroke="${s}" stroke-width="1.1" fill="none" opacity=".5"/>
    <path d="M150 54 L150 138 M150 60 Q160 90 152 136" stroke="${o}" stroke-width="1" fill="none" opacity=".7"/>
    ${g}
    <path d="M92 30 L208 30 L206 54 L94 54 Z" fill="${a}"/><path d="M92 30 L208 30 L206 54 L94 54 Z" fill="url(#tx-${t})"/>
    <path d="M94 40 L206 40" stroke="${o}" stroke-width=".8" opacity=".5"/>
    <path d="M94 58 Q100 90 108 110 M206 58 Q200 90 192 110" stroke="${o}" stroke-width="1" fill="none" opacity=".6"/>
    <path d="M${f[0]+2} 392 L${f[1]-2} 392 M${p[0]+2} 392 L${p[1]-2} 392" stroke="${o}" stroke-width=".8" opacity=".5"/>
  </g></g>`}function g(e,t,n=0){let r=e.colour,i=l(r,-.34),a=u(r)?l(r,-.22):l(r,-.4),o=u(r)?`#7A6A5C`:`#1A1715`,s=e.neck===`deep`?210:176,c=[[`M`,118,62],[`L`,98,70],[`Q`,100,120,104,138],[`L`,98,300],[`L`,132,312],[`L`,150,324],[`L`,150,s],[`Z`]],f=[[`M`,118,62],[`L`,182,62],[`L`,182,70],[`L`,118,70],[`Z`]],p=Array.from({length:5},(e,t)=>`<circle cx="150" cy="${s+8+t*((300-s)/5)}" r="4.2" fill="${o}" stroke="${l(o,.3)}" stroke-width=".7"/>`).join(``),m=`<path d="M120 72 L180 72 L186 300 L150 322 L114 300 Z" fill="${l(r,.15)}" opacity=".9"/>`;return`<g transform="translate(0 ${n})"><g transform="translate(150 0) scale(${e.fitScale??1} 1) translate(-150 0)">
    ${m}
    <path d="${d(c)}" fill="${r}"/><path d="${d(c,!0)}" fill="${r}"/>
    <path d="${d(c)} ${d(c,!0)}" fill="url(#tx-${t})"/><path d="${d(c)} ${d(c,!0)}" fill="url(#sh-${t})"/><path d="${d(c)} ${d(c,!0)}" fill="url(#sv-${t})"/>
    <path d="${d(f)}" fill="${i}"/>
    <path d="M106 228 L136 226 L136 232 L106 234 Z" fill="${i}"/><path d="M164 226 L194 228 L194 234 L164 232 Z" fill="${i}"/>
    <path d="M122 150 L118 300 M178 150 L182 300" stroke="${a}" stroke-width=".9" fill="none" opacity=".5"/>
    <path d="M150 ${s} L150 324" stroke="${a}" stroke-width="1" opacity=".8"/>
    ${p}
  </g></g>`}function _(e,t,n=0){let r=e.colour,i=l(r,-.18),a=u(r)?l(r,.45):l(r,.22),o=e.neck===`cowl`,s=[...o?[[`M`,108,88],[`Q`,150,122,192,88]]:[[`M`,108,88],[`L`,192,88]],[`L`,204,160],[`L`,200,302],[`L`,100,302],[`L`,96,160],[`Z`]],c=e.strap===`wide`?7:2.4;return`<g transform="translate(0 ${n})"><g transform="translate(150 0) scale(${e.fitScale??1} 1) translate(-150 0)">
    <path d="M110 34 L113 88 M190 34 L187 88" stroke="${i}" stroke-width="${c}" stroke-linecap="round" fill="none"/>
    <path d="${d(s)}" fill="${r}"/><path d="${d(s)}" fill="url(#tx-${t})"/><path d="${d(s)}" fill="url(#sh-${t})"/><path d="${d(s)}" fill="url(#sv-${t})"/>
    <path d="M116 100 Q120 200 112 296" stroke="${a}" stroke-width="12" fill="none" opacity=".35" stroke-linecap="round"/>
    <path d="M170 110 Q176 200 172 290" stroke="${a}" stroke-width="5" fill="none" opacity=".25" stroke-linecap="round"/>
    ${o?`<path d="M112 92 Q150 128 188 92" stroke="${a}" stroke-width="1.4" fill="none" opacity=".6"/><path d="M122 96 Q150 118 178 96" stroke="${i}" stroke-width="1" fill="none" opacity=".4"/>`:`<path d="M108 88 L192 88" stroke="${a}" stroke-width="1.2" opacity=".6"/>`}
    <path d="M100 298 L200 298" stroke="${i}" stroke-width=".8" opacity=".5"/>
  </g></g>`}function v(e,t){let n={...e,...e.trouserSpec??{},colour:e.trouserColour??e.colour,fitScale:1},r={...e,...e.waistcoatSpec??{},colour:e.waistcoatColour??e.colour,neck:e.waistcoatSpec?.neck??`deep`};return`<g transform="translate(43 150) scale(.715)">${h(n,t,0)}</g>
    <g transform="translate(45 -2) scale(.70)">${g(r,t,52)}</g>
    <g transform="translate(45 -2) scale(.70)">${m(e,t,0)}</g>`}var y={blazer:(e,t)=>m(e,t,0),trousers:(e,t)=>h(e,t,0),waistcoat:(e,t)=>g(e,t,0),camisole:(e,t)=>_(e,t,0),suit:v};function b(e,t){let n=++f,r={lapel:`peak`,closure:`sb1`,fitScale:1,length:`hip`,sleeve:`standard`,texture:`twill`,...t},i=`<ellipse cx="150" cy="${e===`camisole`?318:e===`waistcoat`?338:e===`blazer`?r.length===`cropped`?310:r.length===`long`?390:352:412}" rx="${e===`trousers`?78:96}" ry="7" fill="#000" opacity=".28" filter="url(#bl-${n})"/>`;return`<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrative garment preview">${p(n,r.colour,r.texture)}${i}${y[e](r,n)}</svg>`}function x(e,t,n=`#D08D5E`){let r=(e||`S`).toUpperCase().slice(0,3),i=t;return`<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Monogram preview">
    <defs><linearGradient id="lin-${r}" x1="0" x2="1"><stop offset="0" stop-color="${l(i,.18)}"/><stop offset=".5" stop-color="${i}"/><stop offset="1" stop-color="${l(i,-.2)}"/></linearGradient>
    <pattern id="silk-${r}" width="3" height="3" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="3" y2="0" stroke="rgba(255,255,255,.12)" stroke-width="1"/></pattern></defs>
    <rect width="300" height="180" fill="url(#lin-${r})"/><rect width="300" height="180" fill="url(#silk-${r})"/>
    <path d="M60 40 L240 40 L240 50 L60 50 Z" fill="${l(i,-.3)}"/>
    <text x="150" y="128" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="56" font-weight="500" letter-spacing="6" fill="none" stroke="${n}" stroke-width="2.2" stroke-dasharray="2.4 1.6" stroke-linejoin="round">${r}</text>
    <text x="150" y="128" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="56" font-weight="500" letter-spacing="6" fill="${n}" opacity=".5">${r}</text>
    <g stroke="${n}" stroke-width="2" stroke-linecap="round" opacity=".9"><path d="M232 128 l7 7 M239 128 l-7 7"/></g>
  </svg>`}var S=n();function C({kind:e,spec:n,className:r}){let i=(0,s.useMemo)(()=>b(e,n),[e,n]);return(0,S.jsx)(`div`,{className:t(`garment`,r),dangerouslySetInnerHTML:{__html:i}})}function w(e,t,n,r){let s=o(t??e.defaultColour).hex,c=i(n??e.defaultFabric),l=a(r??e.defaultFit);return{colour:s,texture:c.texture,fitScale:l.scale,lapel:e.lapel,closure:e.doubleBreasted?`db4`:e.buttons===2?`sb2`:`sb1`,length:e.doubleBreasted?`long`:`hip`,pleat:e.pleat,leg:e.leg,neck:e.neck}}export{x as i,w as n,u as r,C as t};