import{r as d,j as x}from"./index.d2323753.js";import{u as b,a as R}from"./useAudioBuffer.167e3191.js";const p=400,s=266;function w(){const e=d.exports.useRef(null),t=b(),{background1:f}=R();return d.exports.useEffect(()=>{let o;function u(){if(e.current&&t.current){const i=t.current.length,{width:l,height:g}=e.current,r=e.current.getContext("2d");r.fillStyle=f,r.fillRect(0,0,l,g);const h=l/i;let n,c,m=0;for(let a=0;a<i;a++)n=t.current[a],c=s*(n/255),r.fillStyle=`rgb(${n+100},50,50)`,r.fillRect(m,s-c,h,c),m+=h+1}o=requestAnimationFrame(u)}return u(),()=>{cancelAnimationFrame(o)}},[f,t]),x("canvas",{ref:e,width:p,height:s})}export{w as default};
