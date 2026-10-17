'use strict';
(async()=>{
 const $=id=>document.getElementById(id),canvas=$('garden');
 await GardenI18n.load('locales/translations.csv');
 let config=GardenConfig.clone(GardenConfig.defaults),language='auto',lang='es',mode='manual';
 let tick=0,events=[],paused=matchMedia('(prefers-reduced-motion: reduce)').matches,replaying=false,replayIndex=0,duration=1,last=0,acc=0,lastEmission=-999,pointer=null,recordStop=null;
 const engine=createGardenEngine(canvas,createBloom),MAX_TICKS=3600,MAX_EVENTS=600;
 const t=(id,vars={})=>GardenI18n.text(id,lang,vars);
 try{language=localStorage.getItem('garden-v7-language')||'auto';const stored=localStorage.getItem('garden-v7-preset');if(stored)config=GardenConfig.validate(JSON.parse(stored))}catch(_){}
 if(!['auto','es','en','zh','ja'].includes(language))language='auto';
 function notify(id){$('status').textContent=t(id);clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('status').textContent='',5000)}
 function translated(tag,id){const el=document.createElement(tag);el.dataset.i18n=id;return el}
 function range(key,parent){const label=document.createElement('label');label.className='control';const text=translated('span',key),out=document.createElement('output'),input=document.createElement('input');input.type='range';input.id='control-'+key;input.dataset.key=key;const [min,max,step]=GardenConfig.ranges[key];Object.assign(input,{min,max,step});input.oninput=()=>{config[key]=Number(input.value);out.value=input.value;$('preset').value='custom'};label.append(text,out,input);$(parent).append(label)}
 function check(key,parent){const label=document.createElement('label');label.className='row';const input=document.createElement('input');input.type='checkbox';input.dataset.key=key;input.onchange=()=>{config[key]=input.checked;$('preset').value='custom'};label.append(translated('span',key),input);$(parent).append(label)}
 ['interval','scale','speed'].forEach(k=>range(k,'emissionControls'));
 ['density','size','petals','spread','stroke','lifetime'].forEach(k=>range(k,'flowerControls'));
 ['flowers','rings','sparks','curls','flashes'].forEach(k=>check(k,'layerControls'));
 check('linkColors','accentControls');
 for(let i=0;i<6;i++){
  const row=document.createElement('div');row.className='color-row';const label=translated('label','color'+(i+1));label.htmlFor='color-'+i;
  const color=document.createElement('input');color.type='color';color.id='color-'+i;color.dataset.color=i;color.oninput=()=>{config.colors[i]=color.value;$('preset').value='custom'};
  const weight=document.createElement('input');Object.assign(weight,{type:'number',min:0,max:100,step:1});weight.dataset.weight=i;weight.dataset.i18nAriaLabel='weight'+(i+1);weight.onchange=()=>{const n=Number(weight.value),next=[...config.weights];next[i]=n;if(weight.value===''||!Number.isInteger(n)||n<0||n>100||!next.some(v=>v>0)){weight.value=config.weights[i];notify('invalid');return}config.weights=next;$('preset').value='custom'};
  row.append(label,color,weight);$('paletteControls').append(row);
 }
 for(const [key,id] of [['background','background'],[0,'ringColor'],[1,'curlColor'],[2,'centerColor']]){
  const label=document.createElement('label');label.className='row';const input=document.createElement('input');input.type='color';input.dataset.accent=key;input.oninput=()=>{if(key==='background')config.background=input.value;else config.accents[key]=input.value;$('preset').value='custom';render()};label.append(translated('span',id),input);$('accentControls').append(label);
 }
 for(const id of [...Object.keys(GardenConfig.presets),'custom']){const option=translated('option',id);option.value=id;$('preset').append(option)}
 function sync(){document.querySelectorAll('[data-key]').forEach(input=>{const v=config[input.dataset.key];if(input.type==='checkbox')input.checked=v;else{input.value=v;input.previousElementSibling.value=v}});document.querySelectorAll('[data-color]').forEach(el=>el.value=config.colors[el.dataset.color]);document.querySelectorAll('[data-weight]').forEach(el=>el.value=config.weights[el.dataset.weight]);document.querySelectorAll('[data-accent]').forEach(el=>el.value=el.dataset.accent==='background'?config.background:config.accents[el.dataset.accent]);$('seed').value=config.seed}
 function localize(){lang=language==='auto'?((navigator.languages||[navigator.language]).map(l=>l.split('-')[0]).find(l=>['es','en','zh','ja'].includes(l))||'en'):language;document.documentElement.lang=lang;GardenI18n.localize(document,lang);document.title=t('title')+' · v7';$('language').value=language;updateLabels()}
 function updateLabels(){$('pause').textContent=t(paused?'play':'pause');$('video').textContent=t(recordStop?'stopVideo':'video');$('replay').disabled=events.length===0;$('undo').disabled=events.length===0;$('stats').textContent=t('stats',{seconds:(tick/60).toFixed(1),count:engine.count});}
 function render(){engine.draw(config.background);updateLabels()}
 function panel(open){$('panel').hidden=!open;$('toggle').setAttribute('aria-expanded',String(open));if(!open)$('toggle').focus()}
 $('toggle').onclick=()=>panel($('panel').hidden);$('close').onclick=()=>panel(false);
 $('language').onchange=()=>{language=$('language').value;try{localStorage.setItem('garden-v7-language',language)}catch(_){}localize()};
 $('preset').onchange=()=>{if($('preset').value==='custom')return;config=GardenConfig.preset($('preset').value);sync();render();notify('nextBloom')};
 $('reset').onclick=()=>{config=GardenConfig.clone(GardenConfig.defaults);$('preset').value='nocturne';sync();render();notify('nextBloom')};
 $('mode').onchange=()=>{mode=$('mode').value;if(mode!=='manual'&&!paused)lastEmission=tick-240};
 $('seed').onchange=()=>{const n=Number($('seed').value);if($('seed').value===''||!Number.isInteger(n)||n<0||n>4294967295){$('seed').value=config.seed;notify('invalid');return}config.seed=n;$('preset').value='custom'};
 $('savePreset').onclick=()=>{try{localStorage.setItem('garden-v7-preset',JSON.stringify(config));notify('saved')}catch(_){notify('storageError')}GardenExports.json({format:'night-garden-preset',version:7,config},'jardin-nocturno-preset.json')};
 function reset(){engine.clear();tick=0;events=[];lastEmission=-999;replaying=false;duration=1;acc=0;pointer=null;render()}
 $('clear').onclick=reset;
 function togglePause(){if(paused&&tick>=MAX_TICKS){notify('limit');return}paused=!paused;acc=0;last=0;render()}
 $('pause').onclick=togglePause;
 const hash=n=>{n=Math.imul(n^n>>>16,0x45d9f3b);n=Math.imul(n^n>>>16,0x45d9f3b);return (n^n>>>16)>>>0};
 function emit(x,y){
  if(replaying||tick>=MAX_TICKS||events.length>=MAX_EVENTS){notify('limit');return false}
  if(tick-lastEmission<8)return false;
  const event={tick,x:Math.max(0,Math.min(1,x)),y:Math.max(0,Math.min(1,y)),seed:hash(config.seed+events.length),config:GardenConfig.clone(config)};
  events.push(event);engine.emit(event);lastEmission=tick;duration=Math.max(duration,tick+1);render();return true;
 }
 function point(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}}
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;canvas.focus();pointer={...point(e),id:e.pointerId};canvas.setPointerCapture(e.pointerId);if(paused){notify('pausedHint');return}emit(pointer.x,pointer.y)});
 canvas.addEventListener('pointermove',e=>{if(pointer&&pointer.id===e.pointerId)pointer={...point(e),id:e.pointerId}});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,()=>pointer=null);
 document.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA|BUTTON|SUMMARY/.test(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();togglePause()}else if(e.key.toLowerCase()==='h')panel($('panel').hidden);else if(e.key==='Escape')panel(false);else if(e.key==='Enter'&&e.target===canvas){e.preventDefault();if(paused)notify('pausedHint');else emit(.5,.5)}});
 function scene(){return {format:'night-garden-scene',version:7,background:config.background,config:GardenConfig.clone(config),duration:Math.min(MAX_TICKS,Math.max(duration,tick,1)),events:GardenConfig.clone(events)}}
 function validateScene(value){
  if(!value||value.format!=='night-garden-scene'||value.version!==7||!Number.isInteger(value.duration)||value.duration<1||value.duration>MAX_TICKS||!Array.isArray(value.events)||value.events.length>MAX_EVENTS||typeof value.background!=='string'||!/^#[0-9a-f]{6}$/i.test(value.background))throw Error('scene');
  const result={...value,config:GardenConfig.validate(value.config),events:[]};let previous=-1;
  for(const e of value.events){if(!e||!Number.isInteger(e.tick)||e.tick<0||e.tick>=value.duration||e.tick<previous||!Number.isInteger(e.seed)||e.seed<0||e.seed>4294967295||![e.x,e.y].every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1))throw Error('event');if(previous>=0&&e.tick-previous<8)throw Error('rate');previous=e.tick;result.events.push({tick:e.tick,x:e.x,y:e.y,seed:e.seed,config:GardenConfig.validate(e.config)})}return result;
 }
 function replay(){if(!events.length)return;duration=Math.max(duration,tick,1);engine.clear();tick=0;replayIndex=0;replaying=true;paused=false;acc=0;last=0;pointer=null;render()}
 $('replay').onclick=replay;
 $('undo').onclick=()=>{if(!events.length)return;events.pop();engine.clear();const target=tick;tick=0;replayIndex=0;while(tick<target){while(replayIndex<events.length&&events[replayIndex].tick===tick)engine.emit(events[replayIndex++]);engine.update();tick++}replaying=false;lastEmission=events.at(-1)?.tick??-999;render()};
 $('saveScene').onclick=()=>GardenExports.json(scene(),'jardin-nocturno-scene.json');
 $('import').onclick=()=>$('file').click();
 $('file').onchange=async()=>{const file=$('file').files[0];$('file').value='';if(!file)return;try{if(file.size>2000000)throw Error('size');const value=JSON.parse(await file.text());if(value.format==='night-garden-preset'&&value.version===7){config=GardenConfig.validate(value.config);notify('nextBloom')}else{const valid=validateScene(value);reset();config=valid.config;config.background=valid.background;events=valid.events;duration=valid.duration;replay();notify('loaded')}$('preset').value='custom';sync();render()}catch(_){notify('invalid')}};
 $('png').onclick=async()=>{try{render();await GardenExports.png(canvas);notify('exported')}catch(_){notify('exportError')}};
 $('html').onclick=()=>{if(!events.length){notify('empty');return}GardenExports.html(scene(),t('title'),t('exportHint'));notify('exported')};
 $('video').onclick=()=>{if(recordStop){recordStop();return}try{recordStop=GardenExports.video(canvas,failed=>{recordStop=null;updateLabels();notify(failed?'exportError':'exported')});notify('recording');updateLabels()}catch(_){notify('unsupported')}};
 function step(){
  if(replaying){while(replayIndex<events.length&&events[replayIndex].tick===tick)engine.emit(events[replayIndex++])}
  else if(mode==='auto'&&tick-lastEmission>=Math.round(config.interval*60)){const n=hash(config.seed+tick);emit(.18+(n/4294967296)*.64,.18+(hash(n)/4294967296)*.64)}
  else if(mode==='drag'&&pointer&&tick-lastEmission>=Math.round(config.interval*60))emit(pointer.x,pointer.y);
  engine.update();tick++;
  if((replaying&&tick>=duration)||tick>=MAX_TICKS){paused=true;replaying=false;if(tick>=MAX_TICKS)notify('limit')}
 }
 function frame(now){if(!last)last=now;acc+=Math.min(.1,(now-last)/1000);last=now;if(paused||document.hidden)acc=0;let steps=0;while(acc>=1/60&&steps++<6&&!paused){step();acc-=1/60}render();requestAnimationFrame(frame)}
 addEventListener('resize',()=>{engine.resize();render()});
 document.addEventListener('visibilitychange',()=>{last=0;acc=0;pointer=null;if(document.hidden&&recordStop)recordStop()});
 sync();$('preset').value=JSON.stringify(config)===JSON.stringify(GardenConfig.defaults)?'nocturne':'custom';localize();
 if(innerWidth<700)panel(false);
 emit(innerWidth>=700?.67:.5,.5);if(paused){for(let i=0;i<18;i++)engine.update();tick=18;duration=18;notify('reducedMotion')}
 requestAnimationFrame(frame);
})().catch(error=>{console.error(error);document.getElementById('status').textContent='CSV / translations.generated.js: '+error.message});
