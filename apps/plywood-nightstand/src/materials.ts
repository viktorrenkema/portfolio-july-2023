import * as THREE from 'three';
import type { Parameters } from './model';
export async function loadWoodTextures() {
  const loader=new THREE.TextureLoader();
  const maps=await Promise.all(['diff','nor','rough'].map(type=>loader.loadAsync(`${import.meta.env.BASE_URL}textures/birch_${type}.jpg`)));
  maps.forEach(t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;t.repeat.set(1.7,1.7);});
  maps[0].colorSpace=THREE.SRGBColorSpace;
  return {map:maps[0],normalMap:maps[1],roughnessMap:maps[2]};
}
export type WoodMaps=Awaited<ReturnType<typeof loadWoodTextures>>;
export function plyCount(mm:number) {return mm===12?9:mm===15?11:13;}
export function edgeTexture(mm:number) {
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
  const ctx=canvas.getContext('2d')!,layers=plyCount(mm),weights=Array.from({length:layers},(_,i)=>i===0||i===layers-1?1.15:1),total=weights.reduce((a,b)=>a+b,0);
  let y=0;
  weights.forEach((w,i)=>{
    const h=w/total*512;
    ctx.fillStyle=i===0||i===layers-1?'#e8d3a4':i%2===0?'#dfc293':'#bda076';ctx.fillRect(0,y,512,h+.5);
    if(i>0){ctx.fillStyle='#977b57';ctx.fillRect(0,y,512,Math.max(1,.07/mm*512));}
    for(let x=0;x<512;x+=2){ctx.fillStyle=`rgba(90,66,28,${.01+.025*(.5+.5*Math.sin(x*.19+i*8))})`;ctx.fillRect(x,y,1,h);}
    y+=h;
  });
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.ClampToEdgeWrapping;t.repeat.set(4,1000/mm);t.anisotropy=8;return t;
}
export function createMaterials(maps:WoodMaps,p:Parameters) {
  const face=new THREE.MeshPhysicalMaterial({name:'Berken fineer',map:maps.map,normalMap:maps.normalMap,normalScale:new THREE.Vector2(.055,.055),color:p.finish==='oiled'?'#e0c59b':'#fff6df',roughness:p.finish==='oiled'?.56:.69,clearcoat:p.finish==='oiled'?.12:0,clearcoatRoughness:.4});
  const edges=new Map<number,THREE.MeshStandardMaterial>();
  const edge=(mm:number)=>{
    let material=edges.get(mm);if(!material){material=new THREE.MeshStandardMaterial({name:`${mm} mm / ${plyCount(mm)} lagen`,map:edgeTexture(mm),color:p.finish==='oiled'?'#d9bd96':'#fff5df',roughness:.68});edges.set(mm,material);}return material;
  };
  return {face,edge,dispose(){face.dispose();edges.forEach(m=>{m.map?.dispose();m.dispose();});}};
}
