import * as THREE from 'three';
import clipping from 'polygon-clipping';
import { buildParts, exportDesign, type Parameters, type V3 } from './model';
export type QuarterTurn = 0 | 90 | 180 | 270;
export type InstanceId = 'left' | 'right' | 'single';
export interface BedroomSettings {
  showProducts:boolean;mode:'bedroom'|'single'; opening:'inward'|'outward'; linkedRotation:boolean;
  leftRotation:QuarterTurn; rightRotation:QuarterTurn; gap:number; exportQuantity:1|2;
}
export const ROOM = {
  bedWidth:1800,bedLength:2000,legTop:200,boxTop:400,mattressTop:590,topperTop:700,
  headboardWidth:2000,headboardHeight:1000,headboardDepth:50,headboardRadius:200,
  skirtingHeight:110,skirtingDepth:18,outletBottom:130,outletTop:210,outletWidth:151.8,outletDepth:11.4,availableWidth:400,
} as const;
export const defaultBedroom=():BedroomSettings=>({showProducts:false,mode:'bedroom',opening:'inward',linkedRotation:true,leftRotation:0,rightRotation:0,gap:0,exportQuantity:2});
export function restoreBedroom(raw:Partial<BedroomSettings>={}):BedroomSettings {
  const c={...defaultBedroom(),...raw};
  if(!['bedroom','single'].includes(c.mode))c.mode='bedroom';
  if(!['inward','outward'].includes(c.opening))c.opening='inward';
  if(typeof c.showProducts!=='boolean')c.showProducts=false;
  if(typeof c.linkedRotation!=='boolean')c.linkedRotation=true;
  for(const key of ['leftRotation','rightRotation'] as const)if(![0,90,180,270].includes(c[key]))c[key]=0;
  if(!Number.isFinite(c.gap)||c.gap<0||c.gap>400)c.gap=0;
  if(c.exportQuantity!==1&&c.exportQuantity!==2)c.exportQuantity=2;
  return c;
}
export interface Placement {id:'left'|'right';mirrored:boolean;angle:QuarterTurn;spanX:number;spanZ:number;center:V3;matrix:THREE.Matrix4;}
export function placements(p:Parameters,c:BedroomSettings):Placement[] {
  return (['left','right'] as const).map(id=>{
    const angle=id==='left'?c.leftRotation:c.linkedRotation?((360-c.leftRotation)%360) as QuarterTurn:c.rightRotation;
    const side=id==='left'?-1:1,mirrored=c.opening==='inward'?id==='left':id==='right';
    const swapped=angle===90||angle===270,spanX=(swapped?p.depth:p.width)/1000,spanZ=(swapped?p.width:p.depth)/1000;
    const center:V3=[side*(ROOM.headboardWidth/2000+c.gap/1000+spanX/2),(p.topHeight-p.height)/1000,spanZ/2];
    const matrix=new THREE.Matrix4().makeTranslation(...center).multiply(new THREE.Matrix4().makeRotationY(angle*Math.PI/180)).multiply(new THREE.Matrix4().makeScale(mirrored?-1:1,1,1)).multiply(new THREE.Matrix4().makeTranslation(-p.width/2000,0,0));
    return {id,mirrored,angle,spanX,spanZ,center,matrix};
  });
}
export interface Obstacle {name:string;bounds:THREE.Box3;}
const bounds=(min:V3,max:V3)=>new THREE.Box3(new THREE.Vector3(...min),new THREE.Vector3(...max));
export function obstacles(pose:Placement):Obstacle[] {
  const bedRear=(ROOM.skirtingDepth+ROOM.headboardDepth)/1000;
  return [
    {name:'stopcontact',bounds:bounds([pose.center[0]-ROOM.outletWidth/2000,.13,0],[pose.center[0]+ROOM.outletWidth/2000,.21,.0114])},
    {name:'plint',bounds:bounds([-1.6,0,0],[1.6,.11,.018])},
    {name:'hoofdbord',bounds:bounds([-1,0,.018],[1,1,.068])},
    {name:'boxspring',bounds:bounds([-.9,.2,bedRear],[.9,.4,bedRear+2])},
    {name:'matras',bounds:bounds([-.9,.4,bedRear],[.9,.59,bedRear+2])},
    {name:'topper',bounds:bounds([-.9,.59,bedRear],[.9,.7,bedRear+2])},
  ];
}
function polygonArea(polygons:clipping.MultiPolygon) {
  return polygons.reduce((sum,polygon)=>sum+polygon.reduce((total,ring,index)=>{
    let a=0;for(let i=0;i<ring.length-1;i++)a+=ring[i][0]*ring[i+1][1]-ring[i+1][0]*ring[i][1];return total+(index===0?1:-1)*Math.abs(a/2);
  },0),0);
}
export function contextWarnings(p:Parameters,c:BedroomSettings) {
  const parts=buildParts(p),result:{instance:'left'|'right';part?:string;obstacle?:string;message:string}[]=[];
  for(const pose of placements(p,c)){
    const name=pose.id==='left'?'Links':'Rechts';
    if(pose.spanX*1000+c.gap>ROOM.availableWidth+.001)result.push({instance:pose.id,message:`${name}: ${Math.round(pose.spanX*1000+c.gap)} mm gebruikt van 400 mm ruimte naast het hoofdbord.`});
    const inverse=pose.matrix.clone().invert();
    for(const obstacle of obstacles(pose)) {
      const b=obstacle.bounds.clone().applyMatrix4(inverse);
      for(const part of parts){
        if(Math.min(part.max[2],b.max.z)-Math.max(part.min[2],b.min.z)<1e-7)continue;
        const polygon:clipping.Polygon=[[[b.min.x,b.min.y],[b.max.x,b.min.y],[b.max.x,b.max.y],[b.min.x,b.max.y],[b.min.x,b.min.y]]];
        if(polygonArea(clipping.intersection(part.profile,polygon))>1e-10)result.push({instance:pose.id,part:part.id,obstacle:obstacle.name,message:`${name}: ${part.name.toLowerCase()} overlapt ${obstacle.name}.`});
      }
    }
  }
  return result;
}
export function clearances(p:Parameters) {return {outlet:p.topHeight-p.height-ROOM.outletTop,bedTop:ROOM.topperTop-p.topHeight};}
export function exportProject(p:Parameters,c:BedroomSettings,quantity:1|2=c.exportQuantity) {
  const data=exportDesign(p);
  return {...data,furnitureCount:quantity,parts:data.parts.map(part=>({...part,quantity:part.quantity*quantity})),
    areaByThickness:Object.fromEntries(Object.entries(data.areaByThickness).map(([t,a])=>[t,a*quantity])),
    context:{...c},references:{...ROOM},
    assemblies:placements(p,c).slice(0,quantity).map(({id,mirrored,angle,center})=>({id,mirrored,rotation:angle,centerMm:center.map(n=>Math.round(n*1e6)/1000)})),
    notes:[...data.notes,'Bed, hoofdbord, plint en stopcontacten zijn context en staan niet in de zaaglijst.','Voor beide kastjes worden de onderdelen gespiegeld uitgevoerd; controleer de zichtzijde bij de bewerking.']};
}
export function csvProject(p:Parameters,c:BedroomSettings) {
  const data=exportProject(p,c),quote=(v:unknown)=>`"${String(v).replaceAll('"','""')}"`;
  const header=['id','naam','aantal','lengte_mm','breedte_mm','dikte_mm','nerf','zichtbare_kanten','verbindingen','materiaal','bewerking','parameters_json','oppervlak_per_dikte_m2','aantal_kastjes','context_json','assemblages_json'];
  return '\uFEFF'+[header.join(';'),...data.parts.map(part=>[part.id,part.name,part.quantity,part.length,part.width,part.thickness,part.grain,part.exposedEdges.join(' | '),JSON.stringify(part.connections),part.material,part.machining.join(' | '),JSON.stringify(p),JSON.stringify(data.areaByThickness),data.furnitureCount,JSON.stringify(c),JSON.stringify(data.assemblies)].map(quote).join(';'))].join('\r\n');
}
