import clipping, { type MultiPolygon, type Polygon } from 'polygon-clipping';
export type Joint = 'butt' | 'rabbet' | 'miter';
export type PartId = 'top' | 'side' | 'shelf' | 'inner' | 'bottom' | 'back' | 'cleat';
export type JointId = 'topSide' | 'shelfSide' | 'shelfInner' | 'bottomSide' | 'bottomInner';
export type V3 = [number, number, number];
export interface Parameters {
  width: number; depth: number; height: number; topHeight: number; thickness: number;
  shelfHeight: number; cubbyWidth: number;
  bottom: boolean; back: boolean; bridgeShelf: boolean; handedness: 'left' | 'right'; mounting: 'wall' | 'floor';
  wallReference: boolean; hardware: 'keyhole' | 'cleat'; feet: boolean; footHeight: number;
  finish: 'natural' | 'oiled'; bevel: number; joints: Record<JointId, Joint>;
  overrides: Partial<Record<PartId, number>>; grain: Partial<Record<PartId, 'length' | 'width'>>;
}
export interface Part {
  id: PartId; name: string; quantity: number; min: V3; max: V3;
  profile: MultiPolygon; thicknessAxis: 0 | 1 | 2; lengthAxis: 0 | 1;
  length: number; width: number; thickness: number; grain: 'length' | 'width';
  exposedEdges: string[]; connections: { part: PartId; joint: Joint; detail: string }[];
  material: string; machining: string[];
}
export const MAX_WIDTH_MM = 400;
export const presets: Record<'maze' | 'nightstand', Parameters> = {
  maze: {width:210, depth:250, height:420, topHeight:650, thickness:18, shelfHeight:325, cubbyWidth:40, bottom:true, back:false, bridgeShelf:false, handedness:'left', mounting:'wall', wallReference:false, hardware:'keyhole', feet:false, footHeight:15, finish:'natural', bevel:.6, joints:{topSide:'butt', shelfSide:'butt', shelfInner:'butt', bottomSide:'butt', bottomInner:'butt'}, overrides:{}, grain:{}},
  nightstand: {width:320, depth:300, height:460, topHeight:650, thickness:18, shelfHeight:330, cubbyWidth:85, bottom:true, back:false, bridgeShelf:true, handedness:'left', mounting:'wall', wallReference:false, hardware:'keyhole', feet:false, footHeight:15, finish:'natural', bevel:.6, joints:{topSide:'butt', shelfSide:'butt', shelfInner:'butt', bottomSide:'butt', bottomInner:'butt'}, overrides:{}, grain:{}}
};
export const clonePreset = (id: 'maze' | 'nightstand') => structuredClone(presets[id]);
// Saved URLs from the first version may contain independent inner depths.
export function restoreParameters(saved: Partial<Parameters> & {cubbyDepth?:number;innerOffset?:number}): Parameters {
  const {cubbyDepth: _depth, innerOffset: _offset, ...current}=saved;
  const defaults=clonePreset('maze');
  return {...defaults,...current,width:Math.min(current.width ?? defaults.width,MAX_WIDTH_MM),joints:{...defaults.joints,...current.joints},overrides:current.overrides||{},grain:current.grain||{}};
}
export const thickness = (p: Parameters, id: PartId) => p.overrides[id] || p.thickness;
export const overhang = (p: Parameters) => p.width - thickness(p,'side') - p.cubbyWidth - thickness(p,'inner');
export function validate(p: Parameters): string[] {
  const errors: string[] = [];
  for(const [key,options] of Object.entries({handedness:['left','right'],mounting:['wall','floor'],hardware:['keyhole','cleat'],finish:['natural','oiled']})) if(!options.includes(String(p[key as keyof Parameters])))errors.push(`${key}: ongeldige keuze.`);
  if(!p.joints || typeof p.joints!=='object' || !p.overrides || typeof p.overrides!=='object' || !p.grain || typeof p.grain!=='object')return ['Ongeldige parameterset.'];
  for(const id of ['topSide','shelfSide','shelfInner','bottomSide','bottomInner'] as JointId[])if(!['butt','rabbet','miter'].includes(p.joints[id]))errors.push('Ongeldige verbinding.');
  for(const value of Object.values(p.grain))if(!['length','width'].includes(value))errors.push('Ongeldige nerfrichting.');
  for(const key of ['bottom','back','wallReference','feet','bridgeShelf'] as const)if(typeof p[key]!=='boolean')errors.push(`${key}: verwacht aan of uit.`);
  for (const key of ['width','depth','height','topHeight','thickness','shelfHeight','cubbyWidth','footHeight'] as const)
    if (!Number.isFinite(p[key]) || p[key] <= 0) errors.push(`${key}: gebruik een positieve, eindige maat.`);
  for (const value of Object.values(p.overrides)) if (value !== undefined && ![12,15,18].includes(value)) errors.push('Plaatdikte per onderdeel: kies 12, 15 of 18 mm.');
  if (![12,15,18].includes(p.thickness)) errors.push('Plaatdikte: kies 12, 15 of 18 mm.');
  if (!Number.isFinite(p.bevel) || p.bevel<0 || p.bevel>2) errors.push('Afronding moet tussen 0 en 2 mm liggen.');
  if (overhang(p)<10) errors.push('Het vak en de staanders laten te weinig overstek over.');
  if (p.shelfHeight <= thickness(p,'shelf') + thickness(p,'bottom') + 35 || p.shelfHeight >= p.height - thickness(p,'top') - 25) errors.push('Plank 2 moet minstens 25 mm onder het bovenblad blijven en ruimte laten voor het vak.');
  if(p.mounting==='floor' && Math.abs(p.topHeight-p.height-(p.feet?p.footHeight:0))>1e-6)errors.push('Bij vloermontage moet meubelhoogte plus eventuele voetjes gelijk zijn aan bovenbladhoogte.');
  if (p.topHeight < p.height) errors.push('Bovenbladhoogte kan niet lager zijn dan de meubelhoogte.');
  if (p.bridgeShelf && (p.joints.shelfSide==='miter' || p.joints.shelfInner==='miter')) errors.push('Een doorlopende T-aansluiting ondersteunt stomp of sponning; verstek is alleen beschikbaar op buitenhoeken.');
  if (p.width > MAX_WIDTH_MM) errors.push(`De maximale breedte is ${MAX_WIDTH_MM} mm: meer ruimte is niet beschikbaar.`);
  if (p.depth < 80 || p.width < 80 || p.height > 1200 || p.depth > 700) errors.push('Ontwerp buiten het bereik van deze tool (B 80-400, D 80-700, H tot 1200 mm).');
  if(p.back && p.depth < thickness(p,'back')+25) errors.push('Te weinig vrije vakdiepte voor een achterwand.');
  return errors;
}
export function warnings(p: Parameters) {
  const result: string[] = [];
  if (overhang(p) > 2*(p.cubbyWidth+thickness(p,'inner')+thickness(p,'side')) * (p.thickness/18)) result.push('Groot overstek: meer dan circa 2× de steunbreedte, geschaald voor plaatdikte. Alleen een indicatie, geen sterkteberekening.');
  if(p.mounting==='floor') result.push('Smalle voetafdruk: controleer kantelstabiliteit en gebruik zo nodig een wandverankering.');
  if(p.hardware==='keyhole' && p.mounting==='wall') result.push('Keyholes zijn schematisch. Posities, freesdiepte en wandankers moeten nog worden bepaald.');
  return result;
}
const rect = (x0:number,y0:number,x1:number,y1:number): Polygon => [[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]];
const poly = (points:number[][]): Polygon => [[...points,points[0]] as [number,number][]];
export function buildParts(p: Parameters): Part[] {
  const errors=validate(p); if(errors.length) throw new Error(errors.join(' '));
  // Convert once: all geometry, profiles, lengths and bounds below are meters.
  const W=p.width/1000,D=p.depth/1000,H=p.height/1000,S=p.shelfHeight/1000,C=p.cubbyWidth/1000;
  const t=(id:PartId)=>thickness(p,id)/1000;
  const T=t('top'),R=t('side'),M=t('shelf'),I=t('inner'),B=t('bottom');
  const xi=W-R-C-I, xr=W-R, z0=-D/2, z1=D/2;
  const j=p.joints, parts: Part[]=[];
  const add=(id:PartId,name:string,shape:MultiPolygon,minZ:number,maxZ:number,axis:0|1|2,links:Part['connections'])=>{
    const points=shape.flat(2); const xs=points.map(q=>q[0]),ys=points.map(q=>q[1]);
    const min:V3=[Math.min(...xs),Math.min(...ys),minZ], max:V3=[Math.max(...xs),Math.max(...ys),maxZ];
    const lengthAxis=axis===0?1:0;
    parts.push({id,name,quantity:1,min,max,profile:shape,thicknessAxis:axis,lengthAxis,
      length:max[lengthAxis]-min[lengthAxis],width:axis===2?max[1]-min[1]:maxZ-minZ,thickness:t(id),grain:p.grain[id]||'length',
      exposedEdges: id==='back' ? [...(!p.bridgeShelf?['bovenzijde']:[]),...(!p.bottom?['onderzijde']:[])] : ['voorzijde',...(p.back && ['inner','bottom'].includes(id)?['achterzijde gedeeltelijk']:['achterzijde']),...(['top','shelf'].includes(id)?['linker kopse kant']:[]),...(id==='shelf' && !p.bridgeShelf && j.shelfInner!=='miter'?['rechter kopse kant']:[]),...(id==='top' && j.topSide!=='miter'?[j.topSide==='rabbet'?'rechter kopse kant gedeeltelijk':'rechter kopse kant']:[]),...((id==='inner' && (!p.bottom || j.bottomInner!=='miter')) || id==='side' && (!p.bottom || j.bottomSide!=='miter')?['onderzijde']:[])],
      connections:links,material:`Berken multiplex / ${p.finish==='oiled'?'geolied':'naturel'}`,machining:links.filter(l=>l.joint!=='butt').map(l=>`${l.detail} (${l.part})`)});
  };
  const link=(part:PartId,joint:Joint,detail:string)=>({part,joint,detail});
  let top:MultiPolygon=[rect(0,H-T,W,H)];
  let side:MultiPolygon=[rect(xr,0,W,H-T)];
  if(j.topSide==='miter') {
    top=[poly([[0,H-T],[xr,H-T],[W,H],[0,H]])];
    side=[poly([[xr,0],[W,0],[W,H],[xr,H-T]])];
  } else if(j.topSide==='rabbet') {
    top=clipping.difference(top,rect(xr,H-T,W,H-T/2));
    side=[rect(xr,0,W,H-T/2)];
  }
  const shelfEnd=p.bridgeShelf?xr+(j.shelfSide==='rabbet'?R/2:0):xi+I;
  if(p.bridgeShelf && j.shelfSide==='rabbet') side=clipping.difference(side,rect(xr,S-M,xr+R/2,S));
  let shelf:MultiPolygon=[rect(0,S-M,shelfEnd,S)];
  let inner:MultiPolygon=[rect(xi,0,xi+I,S-M)];
  if(!p.bridgeShelf && j.shelfInner==='miter'){
    shelf=[poly([[0,S-M],[xi,S-M],[xi+I,S],[0,S]])];
    inner=[poly([[xi,0],[xi+I,0],[xi+I,S],[xi,S-M]])];
  } else if(j.shelfInner==='rabbet') {
    shelf=clipping.difference(shelf,rect(xi,S-M,xi+I,S-M/2));
    inner=[rect(xi,0,xi+I,S-M/2)];
  }
  let bottom:MultiPolygon=[rect(xi+I,0,xr,B)];
  if(p.bottom) {
    if(j.bottomSide==='rabbet') {
      bottom=[rect(xi+I,0,xr+R/2,B)];
      side=clipping.difference(side,rect(xr,0,xr+R/2,B));
    } else if(j.bottomSide==='miter') {
      bottom=[poly([[xi+I,0],[W,0],[xr,B],[xi+I,B]])];
      side=clipping.difference(side,poly([[xr,0],[W,0],[xr,B]]));
    }
    if(j.bottomInner==='rabbet') {
      bottom=clipping.union(bottom,rect(xi+I/2,0,xi+I,B));
      inner=clipping.difference(inner,rect(xi+I/2,0,xi+I,B));
    } else if(j.bottomInner==='miter') {
      bottom=clipping.union(bottom,poly([[xi,0],[xi+I,0],[xi+I,B]]));
      inner=clipping.difference(inner,poly([[xi,0],[xi+I,0],[xi+I,B]]));
    }
  }
  add('top','Bovenblad',top,-D/2,D/2,1,[link('side',j.topSide,j.topSide==='miter'?'Verstek, lange punt = buitenmaat':j.topSide==='rabbet'?`Sponning ${T*500} mm diep, bovenblad loopt door`:'Bovenblad loopt door')]);
  add('side','Hoge zijwand',side,-D/2,D/2,0,[link('top',j.topSide,'Aansluiting bovenblad'),...(p.bridgeShelf?[link('shelf',j.shelfSide,j.shelfSide==='rabbet'?`Groef ${R*500} mm diep`:'Plank tegen binnenvlak')]:[]),...(p.bottom?[link('bottom',j.bottomSide,'Aansluiting bodem')]:[])]);
  add('shelf','Plank 2',shelf,-D/2,D/2,1,[...(p.bridgeShelf?[link('side',j.shelfSide,j.shelfSide==='rabbet'?`Tong ${R*500} mm in zijwand`:'Tussen zijwand en vrije linkerzijde')]:[]),link('inner',j.shelfInner,j.shelfInner==='rabbet'?`Sponning ${M*500} mm diep`:'Plank loopt over staander')]);
  add('inner','Binnenste staander',inner,z0,z1,0,[link('shelf',j.shelfInner,'Staander onder plank 2'),...(p.bottom?[link('bottom',j.bottomInner,'Aansluiting bodem')]:[])]);
  if(p.bottom) add('bottom','Bodemplank',bottom,z0,z1,1,[link('side',j.bottomSide,'Netto maat inclusief tong of lange verstekpunt'),link('inner',j.bottomInner,'Netto maat inclusief tong of lange verstekpunt')]);
  if(p.back) add('back','Achterwand vak',[rect(xi+I,p.bottom?B:0,xr,S-M)],z0,z0+t('back'),2,[link('side','butt','Tussen de zijwanden'),link('inner','butt','Tussen de zijwanden')]);
  if(p.mounting==='wall' && p.hardware==='cleat') {
    add('cleat','Ophangregel',[rect(xi+I,S-M-.045,xr,S-M-.015)],-D/2-t('cleat'),-D/2,2,[link('side','butt','Schematische verborgen ophangregel, montage uitwerken')]);
    parts.at(-1)!.exposedEdges=[];
  }
  return parts;
}
export function exportDesign(p: Parameters) {
  const parts=buildParts(p);
  const area:Record<string,number>={};
  const mm=(n:number)=>Math.round(n*1e6)/1000;
  return {schema:'f-form/1',units:'mm',parameters:p,notes:['Netto rechthoekige zaagblank; sponningen en verstekken daarna frezen of zagen.','Geen zaagverlies, toleranties, plaatindeling of sterkteberekening inbegrepen.','Bronmaten B/D/H opgegeven; overige originele maten zijn schattingen.'],
    parts:parts.map(q=>{const key=String(mm(q.thickness));area[key]=(area[key]||0)+q.length*q.width*q.quantity;
      return {id:q.id,name:q.name,quantity:q.quantity,length:mm(q.length),width:mm(q.width),thickness:mm(q.thickness),grain:q.grain,exposedEdges:q.exposedEdges,connections:q.connections,material:q.material,machining:q.machining};}),areaByThickness:area};
}
export function csvDesign(p:Parameters) {
  const data=exportDesign(p), q=(s:unknown)=>`"${String(s).replaceAll('"','""')}"`;
  const head=['id','naam','aantal','lengte_mm','breedte_mm','dikte_mm','nerf','zichtbare_kanten','verbindingen','materiaal','bewerking','parameters_json','oppervlak_per_dikte_m2'];
  return '\uFEFF'+[head.join(';'),...data.parts.map(part=>[part.id,part.name,part.quantity,part.length,part.width,part.thickness,part.grain,part.exposedEdges.join(' | '),JSON.stringify(part.connections),part.material,part.machining.join(' | '),JSON.stringify(p),JSON.stringify(data.areaByThickness)].map(q).join(';'))].join('\r\n');
}
