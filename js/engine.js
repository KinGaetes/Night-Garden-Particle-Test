'use strict';
// A fixed 60 Hz clock and a separate seed per bloom make saved events replayable.
function createGardenEngine(canvas, bloomFactory) {
 const ctx=canvas.getContext('2d',{alpha:false});let groups=[],width=1,height=1,dpr=1;
 function resize(){width=canvas.clientWidth||innerWidth;height=canvas.clientHeight||innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr)}
 function emit(event){
  const bloom=bloomFactory(ctx,event.config,event.seed);
  while(groups.length&&(groups.reduce((n,g)=>n+g.bloom.count,0)+bloom.count>1400||groups.length>=36))groups.shift();
  groups.push({bloom,x:event.x,y:event.y,scale:event.config.scale});
 }
 function update(){for(let i=groups.length-1;i>=0;i--){groups[i].bloom.update(1/60);if(!groups[i].bloom.count)groups.splice(i,1)}}
 function draw(background){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=background;ctx.fillRect(0,0,width,height);const scale=Math.min(width,height)/800;for(const g of groups){ctx.save();ctx.translate(g.x*width,g.y*height);ctx.scale(scale*g.scale,scale*g.scale);g.bloom.draw();ctx.restore()}}
 resize();return {resize,emit,update,draw,clear(){groups=[]},get count(){return groups.reduce((n,g)=>n+g.bloom.count,0)}};
}
