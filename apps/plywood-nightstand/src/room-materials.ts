import * as THREE from 'three';
import type { WoodMaps } from './materials';
export const WALL_COLOR='#8D3B35';
const floorImages=new WeakMap<THREE.Texture,HTMLCanvasElement>();
function floorImage(maps:WoodMaps) {
  const cached=floorImages.get(maps.map);if(cached)return cached;
  // One texture covers the entire floor, with 600 x 100 mm planks.
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1609;
  const ctx=canvas.getContext('2d')!,scale=2048/3.5,n=6;
  ctx.fillStyle='#473323';ctx.fillRect(0,0,canvas.width,canvas.height);
  let seed=731;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  ctx.translate(canvas.width/2,canvas.height/2);ctx.rotate(Math.PI/4);
  const plank=(x:number,y:number,vertical:boolean)=>{
    ctx.save();ctx.translate(x*scale,y*scale);if(vertical)ctx.rotate(Math.PI/2);
    const w=.6*scale,h=.1*scale,gap=.001*scale;
    ctx.fillStyle='#473323';ctx.fillRect(0,0,w,h);
    const image=maps.map.image as HTMLImageElement;ctx.drawImage(image,rand()*image.width*.2,rand()*image.height*.8,image.width*.7,image.height*.1,gap/2,gap/2,w-gap,h-gap);
    ctx.globalCompositeOperation='multiply';ctx.fillStyle=`hsl(${28+rand()*5} 35% ${40+rand()*10}%)`;ctx.fillRect(gap/2,gap/2,w-gap,h-gap);
    ctx.globalCompositeOperation='source-over';ctx.strokeStyle='#ebc698';ctx.globalAlpha=.14;ctx.lineWidth=.5;ctx.strokeRect(gap/2,gap/2,w-gap,h-gap);ctx.restore();
  };
  // Alternating perpendicular strips interlock without overlapping faces.
  for(let row=-24;row<24;row++)for(let col=-7;col<7;col++){
    const x=(col*n+row)*.1,y=(col*n-row)*.1;
    plank(x,y,false);plank(x+.7,y,true);
  }
  floorImages.set(maps.map,canvas);return canvas;
}
export function herringboneFloor(maps:WoodMaps) {
  const map=new THREE.CanvasTexture(floorImage(maps));map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(1,1);map.anisotropy=8;
  const bump=map.clone();bump.colorSpace=THREE.NoColorSpace;bump.needsUpdate=true;
  return new THREE.MeshStandardMaterial({name:'Bruine houten visgraatvloer',map,bumpMap:bump,bumpScale:.0005,roughness:.72});
}
