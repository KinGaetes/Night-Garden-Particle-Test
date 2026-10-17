'use strict';
const GardenExports=(()=>{
 function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}
 function json(value,name){download(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),name)}
 function png(canvas){return new Promise((resolve,reject)=>canvas.toBlob(blob=>{if(!blob){reject(Error('PNG'));return}download(blob,'jardin-nocturno.png');resolve()},'image/png'))}
 function html(scene,title,hint){
  const data=JSON.stringify(scene).replace(/</g,'\\u003c');
  const safe=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const code=`${createBloom.toString()}
${createGardenEngine.toString()}
const scene=${data};const canvas=document.querySelector('canvas'),engine=createGardenEngine(canvas,createBloom);let tick=0,index=0,last=0,acc=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;function restart(){tick=0;index=0;engine.clear()}function step(){if(tick>=scene.duration)restart();while(index<scene.events.length&&scene.events[index].tick===tick)engine.emit(scene.events[index++]);engine.update();tick++}function toggle(){paused=!paused}canvas.addEventListener('click',toggle);canvas.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();toggle()}});addEventListener('resize',()=>engine.resize());document.addEventListener('visibilitychange',()=>{last=0;acc=0});function frame(now){if(!last)last=now;acc+=Math.min(.1,(now-last)/1000);last=now;if(document.hidden||paused)acc=0;let n=0;while(acc>=1/60&&n++<6){step();acc-=1/60}engine.draw(scene.background);requestAnimationFrame(frame)}step();engine.draw(scene.background);requestAnimationFrame(frame);`;
  download(new Blob([`<!doctype html><html lang="${document.documentElement.lang}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safe(title)}</title><style>body{margin:0;background:#000}canvas{display:block;width:100vw;height:100dvh}p{position:fixed;bottom:12px;left:20px;color:#b6bed1;font:12px system-ui;pointer-events:none}</style><canvas tabindex="0" aria-label="${safe(hint)}"></canvas><p>${safe(hint)}</p><script>${code}</script></html>`],{type:'text/html'}),'jardin-nocturno.html');
 }
 function video(canvas,onStop){
  if(!canvas.captureStream||typeof MediaRecorder==='undefined')throw Error('unsupported');
  const mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));if(!mime)throw Error('unsupported');
  const stream=canvas.captureStream(30);let recorder;
  try{recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:6000000})}catch(error){stream.getTracks().forEach(t=>t.stop());throw error}
  const chunks=[];let failed=false;recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  recorder.onerror=()=>{failed=true;stop()};
  recorder.onstop=()=>{clearTimeout(timer);stream.getTracks().forEach(t=>t.stop());if(chunks.length&&!failed)download(new Blob(chunks,{type:mime}),'jardin-nocturno.webm');onStop(failed||!chunks.length)};
  const stop=()=>{if(recorder.state!=='inactive')recorder.stop()};recorder.start();const timer=setTimeout(stop,6000);return stop;
 }
 return {download,json,png,html,video};
})();
