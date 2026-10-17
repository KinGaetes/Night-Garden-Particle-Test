'use strict';
const GardenConfig=(()=>{
 const defaults={density:32,size:1,petals:14,spread:1,stroke:1,lifetime:3,speed:1,scale:1,interval:1.2,seed:7307,flowers:true,rings:true,sparks:true,curls:true,flashes:true,linkColors:false,background:'#05070b',colors:['#ffffff','#7c4fff','#5834d5','#ffe22d','#ffa813','#bcac4d'],weights:[29,20,15,18,11,7],accents:['#4a4aff','#7cff6c','#ffcf25']};
 const ranges={density:[4,60,1],size:[.4,2,.1],petals:[5,24,1],spread:[.3,1.6,.1],stroke:[.5,2.5,.1],lifetime:[1,12,.5],speed:[.25,2,.05],scale:[.4,1.8,.1],interval:[.25,4,.05],seed:[0,4294967295,1]};
 const presets={nocturne:{},fireworks:{lifetime:1,density:32,background:'#000000'},moonlight:{colors:['#ffffff','#c5d9ff','#80a9eb','#a6a1e8','#8cbcb9','#608cab'],linkColors:true,lifetime:7,speed:.6,curls:false,flashes:false},ember:{colors:['#fff4ca','#ffb347','#f47645','#e55039','#df9d57','#a85e45'],linkColors:true,lifetime:4,stroke:1.4},herbarium:{lifetime:12,speed:.5,rings:false,sparks:false,curls:false,flashes:false,density:16,size:1.4}};
 const clone=v=>JSON.parse(JSON.stringify(v));
 function validate(value){
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error('config');
  const result=clone(defaults);
  for(const [key,base] of Object.entries(defaults)){
   const v=value[key];if(v===undefined)throw Error(key);
   if(ranges[key]){const [min,max,step]=ranges[key];if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max||(step===1&&!Number.isInteger(v)))throw Error(key)}
   else if(typeof base==='boolean'){if(typeof v!=='boolean')throw Error(key)}
   else if(Array.isArray(base)){if(!Array.isArray(v)||v.length!==base.length)throw Error(key);if(key==='weights'){if(v.some(n=>typeof n!=='number'||!Number.isFinite(n)||n<0||n>100)||!v.some(n=>n>0))throw Error(key)}else if(v.some(c=>typeof c!=='string'||!/^#[0-9a-f]{6}$/i.test(c)))throw Error(key)}
   else if(typeof v!=='string'||!/^#[0-9a-f]{6}$/i.test(v))throw Error(key);
   result[key]=clone(v);
  }return result;
 }
 return {defaults,ranges,presets,clone,validate,preset:name=>({...clone(defaults),...clone(presets[name]||{})})};
})();
