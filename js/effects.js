'use strict';
// The five original v6 effect families, with configurable color and flower geometry.
function createBloom(ctx, config, seed) {
 let state=seed>>>0;
 const random=()=>{state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};
 const TAU=Math.PI*2, rand=(a,b)=>a+random()*(b-a), clamp=x=>Math.max(0,Math.min(1,x));
 const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
 const palette=config.colors.map(rgb), accents=config.accents.map(rgb);
 const accent=i=>config.linkColors?palette[(i+1)%palette.length]:accents[i];
 const rgba=(c,a)=>`rgba(${c[0]},${c[1]},${c[2]},${a})`;
 const ease=t=>1-Math.pow(1-t,3);
 function smooth(a,b,x){const t=clamp((x-a)/(b-a));return t*t*(3-2*t)}
 function bloomEase(t){const s=.68,u=t-1;return 1+(s+1)*u*u*u+s*u*u}
 function flowerColor(){let n=random()*config.weights.reduce((a,b)=>a+b,0);for(let i=0;i<6;i++){n-=config.weights[i];if(n<0)return palette[i]}return palette[0]}
class Ring{
 constructor(x,y,inner){
  this.x=x+rand(-3,3);this.y=y+rand(-3,3);
  this.age=inner?-.07:0;
  this.life=inner?rand(.56,.72):rand(.70,.84);
  this.r0=inner?5:8;
  this.r1=inner?rand(72,106):rand(136,180);
  this.maxA=inner?.72:.48;
  this.w=inner?rand(.95,1.45):rand(.7,1.1);
 }
 update(dt){this.age+=dt;return this.age<this.life}
 draw(){
  if(this.age<0)return;
  const t=clamp(this.age/this.life);
  const r=this.r0+(this.r1-this.r0)*ease(t);
  const a=this.maxA*(1-smooth(.30,1,t))*smooth(0,.045,t);
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.beginPath();ctx.arc(this.x,this.y,r,0,TAU);
  ctx.strokeStyle=rgba(accent(0),a);ctx.lineWidth=this.w;ctx.stroke();
  ctx.restore();
 }
}

class Flash{
 constructor(x,y){this.x=x;this.y=y;this.age=0;this.life=.17}
 update(dt){this.age+=dt;return this.age<this.life}
 draw(){
  const t=this.age/this.life,a=1-t;
  ctx.save();ctx.globalCompositeOperation='lighter';
  ctx.fillStyle=rgba(accent(1),a*.86);
  ctx.beginPath();ctx.arc(this.x,this.y,2+7*ease(t),0,TAU);ctx.fill();
  ctx.fillStyle=rgba(accent(2),a);
  ctx.beginPath();ctx.arc(this.x,this.y,1+2.2*ease(t),0,TAU);ctx.fill();
  ctx.restore();
 }
}

class Flower{
 constructor(cx,cy,zone,delay,ghost=false){
  this.age=-delay;
  this.ghost=ghost;
  this.life=(ghost?rand(.76,1.06):rand(.84,1.18))*config.lifetime;
  this.bloom=ghost?rand(.12,.18):rand(.14,.22);

  const a=rand(0,TAU);
  const d=(zone===0?rand(8,74):zone===1?rand(52,130):rand(92,190))*config.spread;
  const sx=rand(.82,1.16);
  this.x=cx+Math.cos(a)*d*sx;
  this.y=cy+Math.sin(a)*d;
  const v=rand(3,18);
  this.vx=Math.cos(a+rand(-.55,.55))*v;
  this.vy=Math.sin(a+rand(-.55,.55))*v;
  this.drag=rand(2.4,4.7);

  const q=random();
  this.R=(q<.50?rand(8,16):q<.90?rand(17,29):rand(30,40))*config.size;
  this.petals=Math.max(5,Math.round(config.petals+rand(-2,2)));
  this.widthRatio=rand(.14,.235);
  this.col=flowerColor();
  this.rot=rand(0,TAU);this.spin=rand(-.18,.18);
  this.stroke=rand(.72,1.12)*config.stroke;
  this.baseA=ghost?rand(.26,.50):(random()<.22?rand(.58,.75):rand(.86,1));
  this.centerN=(rand(2,6))|0;
  this.double=random()<.09;
 }
 update(dt){
  this.age+=dt;if(this.age<0)return true;
  const d=Math.exp(-this.drag*dt);
  this.vx*=d;this.vy*=d;this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.rot+=this.spin*dt;
  return this.age<this.life;
 }
 drawRosette(R,a,rotOff=0,alphaScale=1){
  ctx.save();ctx.rotate(rotOff);
  ctx.strokeStyle=rgba(this.col,a*alphaScale);
  ctx.lineWidth=this.stroke;
  const w=R*this.widthRatio;
  for(let i=0;i<this.petals;i++){
   ctx.save();ctx.rotate(i*TAU/this.petals);
   ctx.beginPath();
   ctx.moveTo(0,0);
   ctx.bezierCurveTo(R*.25,-w,R*.80,-w,R,0);
   ctx.bezierCurveTo(R*.80,w,R*.25,w,0,0);
   ctx.stroke();
   ctx.restore();
  }
  ctx.restore();
 }
 draw(){
  if(this.age<0)return;
  const t=clamp(this.age/this.life);
  const sc=bloomEase(clamp(this.age/this.bloom));
  let a=this.baseA*(1-smooth(this.ghost?.18:.34,1,t));
  if(a<.006)return;
  const R=this.R*sc;

  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);
  this.drawRosette(R,a);
  if(this.double)this.drawRosette(R*.78,a,Math.PI/this.petals,.30);

  const cr=Math.max(1.8,R*.135);
  ctx.beginPath();ctx.arc(0,0,cr,0,TAU);
  ctx.fillStyle=`rgba(4,2,6,${Math.min(1,a+.34)})`;ctx.fill();
  ctx.strokeStyle=rgba(this.col,a*.82);ctx.lineWidth=Math.max(.7,this.stroke*.9);ctx.stroke();

  if(!this.ghost && this.age<.40){
   const ca=a*(1-this.age/.40);
   for(let i=0;i<this.centerN;i++){
    const aa=i*TAU/this.centerN;
    ctx.fillStyle=rgba(accent(2),ca);
    ctx.beginPath();ctx.arc(Math.cos(aa)*cr*.35,Math.sin(aa)*cr*.35,Math.max(.65,cr*.18),0,TAU);ctx.fill();
   }
  }
  ctx.restore();
 }
}

class Spark{
 constructor(x,y,delay){
  this.age=-delay;this.life=rand(.28,.62);
  const a=rand(0,TAU),d=rand(0,58);
  this.x=x+Math.cos(a)*d;this.y=y+Math.sin(a)*d;
  const v=rand(26,112);this.vx=Math.cos(a)*v;this.vy=Math.sin(a)*v;
  this.drag=rand(4.2,6.8);this.r=rand(.55,1.55);
  this.col=random()<.72?palette[0]:accent(2);
  this.phase=rand(0,TAU);
 }
 update(dt){
  this.age+=dt;if(this.age<0)return true;
  const d=Math.exp(-this.drag*dt);this.vx*=d;this.vy*=d;
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  return this.age<this.life;
 }
 draw(){
  if(this.age<0)return;
  const t=this.age/this.life;
  const a=(1-t)*(.62+.38*Math.sin(this.phase+this.age*32)**2);
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.fillStyle=rgba(this.col,a);
  ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,TAU);ctx.fill();
  ctx.restore();
 }
}

class Curl{
 constructor(cx,cy,delay){
  this.age=-delay;
  this.life=rand(.74,.98);
  const a=rand(0,TAU),d=rand(18,118);
  this.x=cx+Math.cos(a)*d;this.y=cy+Math.sin(a)*d;
  this.heading=a+rand(-2.2,2.2);
  this.speed=rand(168,255);
  this.turn=(random()<.5?-1:1)*rand(3.6,7.2);
  this.acc=(random()<.5?-1:1)*rand(.46,1.50);
  this.jitter=rand(1.9,5.2);
  this.phase=rand(0,TAU);
  this.points=[];
  this.max=(rand(90,140))|0;
  this.width=rand(.90,1.35);
  this.head=rand(1.05,1.45);
  this.hot=random()<.55;
 }
 update(dt){
  this.age+=dt;if(this.age<0)return true;
  const t=clamp(this.age/this.life);
  this.turn+=this.acc*dt + (random()-.5)*this.jitter*dt;
  const wobble=
    Math.sin(this.phase+this.age*12.8)*1.05+
    Math.sin(this.phase*1.7+this.age*21.2)*.48+
    (random()-.5)*1.35;
  this.heading+=(this.turn+wobble)*dt;
  const s=this.speed*(1-.04*t);
  this.x+=Math.cos(this.heading)*s*dt;
  this.y+=Math.sin(this.heading)*s*dt;
  this.points.push([this.x,this.y,rand(0,1)]);
  if(this.points.length>this.max)this.points.shift();
  return this.age<this.life;
 }
 draw(){
  if(this.age<0||this.points.length<2)return;
  const lifeA=Math.pow(1-clamp(this.age/this.life),1.55);
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.lineCap='round';ctx.lineJoin='round';
  for(let i=1;i<this.points.length;i++){
   const q=i/(this.points.length-1),p=this.points[i-1],n=this.points[i];
   const flicker=.82+.45*Math.sin((i*1.7)+this.age*28+p[2]*8);
   ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(n[0],n[1]);
   ctx.strokeStyle=rgba(accent(1),Math.max(0,lifeA*q*.66*flicker));
   ctx.lineWidth=this.width+q*1.12;
   ctx.stroke();
   if(i%3===0){
    ctx.strokeStyle=rgba(accent(1),Math.max(0,lifeA*q*.12));
    ctx.lineWidth=.7+q*.55;
    ctx.stroke();
   }
  }
  const h=this.points[this.points.length-1];
  ctx.fillStyle=rgba(accent(1),lifeA*.58);
  ctx.beginPath();ctx.arc(h[0],h[1],this.head,0,TAU);ctx.fill();
  ctx.restore();
 }
}


 const particles=[];
 if(config.flashes)particles.push(new Flash(0,0));
 if(config.rings)particles.push(new Ring(0,0,false),new Ring(0,0,true));
 if(config.flowers)for(let i=0;i<config.density;i++)particles.push(new Flower(0,0,i%3,rand(0,.2),i%3===2));
 if(config.curls)for(let i=0;i<Math.round(config.density*.42);i++)particles.push(new Curl(0,0,rand(0,.04)));
 if(config.sparks)for(let i=0;i<config.density;i++)particles.push(new Spark(0,0,rand(0,.12)));
 return {get count(){return particles.length},update(dt){for(let i=particles.length-1;i>=0;i--)if(!particles[i].update(dt*config.speed))particles.splice(i,1)},draw(){for(const p of particles)p.draw()}};
}
