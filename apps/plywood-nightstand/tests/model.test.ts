import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import clipping from 'polygon-clipping';
import { MAX_WIDTH_MM, restoreParameters, buildParts, clonePreset, csvDesign, exportDesign, overhang, validate, type Parameters, type Joint } from '../src/model';
import { partGeometry } from '../src/geometry';
const close=(a:number,b:number,tolerance=1e-6)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
function checkGeometry(p:Parameters) {
  const parts=buildParts(p);
  for(const part of parts)for(const bevel of [0,.6,2]) {
    const g=partGeometry(part,bevel);g.computeBoundingBox();const bounds=g.boundingBox!;
    const size=bounds.getSize(new THREE.Vector3()).toArray();
    close(size[part.lengthAxis],part.length);
    close(size[part.thicknessAxis],part.thickness);
    close(size[part.thicknessAxis===2?1:2],part.width);
    for(let a=0;a<3;a++){close(bounds.min.getComponent(a),part.min[a]);close(bounds.max.getComponent(a),part.max[a]);}
    for(const name of ['position','normal','uv']) assert.ok(Array.from(g.getAttribute(name).array).every(Number.isFinite),`${part.id}: finite ${name}`);
    g.dispose();
  }
  const area=(multi:number[][][][])=>multi.reduce((sum,polygon)=>sum+polygon.reduce((total,ring,index)=>{
    let a=0;for(let i=0;i<ring.length-1;i++)a+=ring[i][0]*ring[i+1][1]-ring[i+1][0]*ring[i][1];return total+(index===0?1:-1)*Math.abs(a/2);
  },0),0);
  for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++) {
    const a=parts[i],b=parts[j],z=Math.min(a.max[2],b.max[2])-Math.max(a.min[2],b.min[2]);
    if(z>1e-9)close(area(clipping.intersection(a.profile,b.profile))*z,0,1e-10);
  }
  const data=exportDesign(p);for(const [t,sum] of Object.entries(data.areaByThickness))close(sum,data.parts.filter(q=>String(q.thickness)===t).reduce((a,q)=>a+q.length*q.width/1e6*q.quantity,0));
}
test('Both presets: every part geometry agrees with exported net blanks, with no material intersections',()=>{checkGeometry(clonePreset('maze'));checkGeometry(clonePreset('nightstand'));});
for(const joint of ['butt','rabbet','miter'] as Joint[])test(`${joint}: all supported corners, thicknesses and bevels agree with cut dimensions`,()=>{
  for(const thickness of [12,15,18]) {const p=clonePreset('maze');p.thickness=thickness;p.bridgeShelf=true;for(const id of ['topSide','bottomSide','bottomInner'] as const)p.joints[id]=joint;p.joints.shelfSide=joint==='miter'?'butt':joint;p.joints.shelfInner=joint==='miter'?'butt':joint;checkGeometry(p);}
});
test('Every combination of independent joints fits without intersections',()=>{
  for(const a of ['butt','rabbet','miter'] as Joint[])for(const b of ['butt','rabbet','miter'] as Joint[])for(const c of ['butt','rabbet','miter'] as Joint[]){const p=clonePreset('maze');p.bridgeShelf=true;Object.assign(p.joints,{topSide:a,bottomSide:b,bottomInner:c,shelfSide:'rabbet',shelfInner:'rabbet'});checkGeometry(p);}
});
test('Mixed thickness, rear closure, mirrored orientation and cleat',()=>{
  const p=clonePreset('nightstand');p.overrides={top:12,side:15,inner:12,shelf:15,bottom:12};p.back=true;p.hardware='cleat';p.handedness='right';p.joints={topSide:'miter',shelfSide:'rabbet',shelfInner:'rabbet',bottomSide:'miter',bottomInner:'rabbet'};checkGeometry(p);
});
test('No bottom produces no bottom joints; optional back and floor do not change assembly blank bounds',()=>{
  const p=clonePreset('maze');p.bottom=false;p.back=true;p.mounting='floor';p.topHeight=p.height;checkGeometry(p);assert.ok(!buildParts(p).some(q=>q.id==='bottom'));assert.ok(buildParts(p).every(q=>!q.connections.some(c=>c.part==='bottom')));
});
test('Rebate and miter include real tongue or long-point lengths',()=>{
  const p=clonePreset('maze');p.bridgeShelf=true;let data=exportDesign(p);assert.equal(data.parts.find(q=>q.id==='shelf')!.length,192);
  p.joints.shelfSide='rabbet';data=exportDesign(p);assert.equal(data.parts.find(q=>q.id==='shelf')!.length,201);
  p.joints.topSide='miter';data=exportDesign(p);assert.equal(data.parts.find(q=>q.id==='side')!.length,420);
  assert.equal(overhang(p),134);
});
test('Invalid dimensions fail before building or exporting',()=>{
  for(const patch of [{width:-1},{depth:NaN},{shelfHeight:419},{cubbyWidth:300},{width:401},{thickness:9},{topHeight:100},{bevel:3}])assert.ok(validate({...clonePreset('maze'),...patch}).length);
  assert.throws(()=>buildParts({...clonePreset('maze'),height:0}));
});
test('JSON and CSV preserve reproducible parameters and full connection metadata',()=>{
  const p=clonePreset('maze'),json=exportDesign(p),csv=csvDesign(p);assert.deepEqual(json.parameters,p);assert.ok(csv.includes('parameters_json'));assert.ok(csv.includes('oppervlak_per_dikte_m2'));assert.ok(csv.includes('topSide'));assert.equal(json.parts.length,5);
});

test('Open Maze slot: shelf ends at inner upright, no imaginary side connection; miter is a real outside corner',()=>{
 const p=clonePreset('maze');const shelf=exportDesign(p).parts.find(q=>q.id==='shelf')!;assert.equal(shelf.length,152);assert.equal(shelf.connections.some(c=>c.part==='side'),false);
 p.joints.shelfInner='miter';checkGeometry(p);assert.equal(exportDesign(p).parts.find(q=>q.id==='inner')!.length,325);
 p.bridgeShelf=true;assert.ok(validate(p).length);
});

test('Floor mounting keeps furniture height plus feet equal to the tabletop height',()=>{const p=clonePreset('maze');p.mounting='floor';assert.ok(validate(p).length);p.feet=true;p.topHeight=p.height+p.footHeight;checkGeometry(p);});

test('The optional back has an exposed upper edge under an open slot',()=>{const p=clonePreset('maze');p.back=true;assert.ok(buildParts(p).find(q=>q.id==='back')!.exposedEdges.includes('bovenzijde'));p.bridgeShelf=true;assert.ok(!buildParts(p).find(q=>q.id==='back')!.exposedEdges.includes('bovenzijde'));});


test('The 400 mm room width is a hard limit for geometry and exports',()=>{
  const p=clonePreset('maze');p.width=MAX_WIDTH_MM;checkGeometry(p);
  p.width=MAX_WIDTH_MM+.01;assert.ok(validate(p).some(error=>error.includes('400')));
  assert.throws(()=>buildParts(p));assert.throws(()=>exportDesign(p));assert.throws(()=>csvDesign(p));
});
test('All five structural panels share the complete depth when it grows or shrinks',()=>{
  for(const depth of [297,350,180,500]){
    const p={...clonePreset('maze'),width:306,depth};
    const parts=buildParts(p);assert.equal(parts.length,5);
    for(const part of parts){close(part.min[2],-depth/2000);close(part.max[2],depth/2000);close(part.width,depth/1000);}
    assert.ok(exportDesign(p).parts.every(part=>part.width===depth));checkGeometry(p);
  }
});
test('Legacy designs retain their dimensions but discard independent inner depths and offsets',()=>{
  const p=restoreParameters({width:306,depth:297,cubbyDepth:175,innerOffset:30});
  assert.equal(p.width,306);assert.equal(p.depth,297);assert.ok(!('cubbyDepth' in p));assert.ok(!('innerOffset' in p));
  assert.ok(exportDesign(p).parts.every(part=>part.width===297));
  assert.equal(restoreParameters({width:600,depth:297}).width,400);
});
