import{r as g,j as b}from"./index.f2c2ac5c.js";import{u as d,a as x,b as R}from"./useResizeCanvas.e61bbf9a.js";function B(){const e=g.exports.useRef(null);d(e);const t=x(),{background1:u}=R();return g.exports.useEffect(()=>{let f;function i(){if(e.current&&t.current){const o=t.current.length,{width:l,height:n}=e.current,r=e.current.getContext("2d");r.fillStyle=u,r.fillRect(0,0,l,n);const m=l/o;let a,s,h=0;for(let c=0;c<o;c++)a=t.current[c],s=n*(a/255),r.fillStyle=`rgb(50,50,${a+100})`,r.fillRect(h,n-s,m,s),h+=m+1}f=requestAnimationFrame(i)}return i(),()=>{cancelAnimationFrame(f)}},[u,t]),b("canvas",{ref:e})}export{B as default};
