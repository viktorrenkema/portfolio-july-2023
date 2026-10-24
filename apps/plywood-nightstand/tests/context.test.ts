import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { clonePreset, buildParts, restoreParameters } from '../src/model';
import { ROOM, defaultBedroom, restoreBedroom, placements, obstacles, contextWarnings, clearances, exportProject, csvProject, type QuarterTurn } from '../src/context';
const p={...clonePreset('maze'),width:306,depth:297,topHeight:650},c=defaultBedroom();
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
test('Measured room elevations and current cabinet clearances remain exact',()=>{
  assert.deepEqual([ROOM.legTop,ROOM.boxTop,ROOM.mattressTop,ROOM.topperTop],[200,400,590,700]);
  assert.deepEqual(clearances(p),{outlet:20,bedTop:50});
  assert.equal(ROOM.headboardWidth,2000);assert.equal(ROOM.skirtingHeight,110);
  for(const q of placements(p,c)){const socket=obstacles(q)[0].bounds;close(socket.getCenter(new THREE.Vector3()).x,q.center[0]);close(socket.min.y,.13);close(socket.max.y,.21);close(socket.getSize(new THREE.Vector3()).x,.1518);}
});
test('All quarter turns keep cabinet rear bounds at the wall and share the same design',()=>{
  for(const width of [210,306,400])for(const depth of [180,297,500])for(const angle of [0,90,180,270] as QuarterTurn[])for(const opening of ['inward','outward'] as const){
    const design={...p,width,depth},poses=placements(design,{...c,leftRotation:angle,opening});
    assert.equal(poses[1].angle,(360-angle)%360);assert.notEqual(poses[0].mirrored,poses[1].mirrored);
    for(const pose of poses){const b=new THREE.Box3(new THREE.Vector3(0,0,-depth/2000),new THREE.Vector3(width/1000,p.height/1000,depth/2000)).applyMatrix4(pose.matrix);close(b.min.z,0);close(b.min.y,.23);close(b.max.y,.65);close(Math.min(Math.abs(b.min.x),Math.abs(b.max.x)),1);close(b.getSize(new THREE.Vector3()).x,pose.spanX);}
    const left=poses[0],right=poses[1];for(const part of buildParts(design))for(const point of [part.min,part.max]){const a=new THREE.Vector3(...point).applyMatrix4(left.matrix),b=new THREE.Vector3(...point).applyMatrix4(right.matrix);close(a.x,-b.x);close(a.y,b.y);close(a.z,b.z);}
  }
});
test('Unlinked rotations and headboard gap are independent',()=>{
  const [left,right]=placements(p,{...c,leftRotation:90,rightRotation:180,linkedRotation:false,gap:35});
  assert.equal(left.angle,90);assert.equal(right.angle,180);close(left.spanX,.297);close(right.spanX,.306);close(Math.abs(left.center[0])-left.spanX/2,1.035);
});
test('Available zone uses rotated depth plus gap without modifying furniture',()=>{
  const deep={...p,width:300,depth:450};assert.equal(contextWarnings(deep,c).length,0);
  const issue=contextWarnings(deep,{...c,leftRotation:90});assert.equal(issue.filter(q=>!q.part).length,2);assert.equal(deep.depth,450);
  assert.equal(contextWarnings(p,{...c,gap:100}).filter(q=>!q.part).length,2);
});
test('Collisions require actual panel material, with touching surfaces excluded',()=>{
  assert.equal(contextWarnings(p,c).filter(q=>q.part).length,0);
  const low={...p,cubbyWidth:85,topHeight:550};assert.ok(contextWarnings(low,c).some(q=>q.obstacle==='stopcontact'));
  const plinth={...p,topHeight:470};assert.ok(contextWarnings(plinth,c).some(q=>q.obstacle==='plint'));
  // The socket is fully within the open F shape at 400 mm depth: no solid panel crosses it.
  const hollow={...p,topHeight:600,bottom:false};assert.equal(contextWarnings(hollow,c).filter(q=>q.obstacle==='stopcontact').length,0);
});
test('Exports multiply only furniture parts and include placement metadata',()=>{
  const one=exportProject(p,c,1),two=exportProject(p,{...c,leftRotation:90});assert.equal(one.furnitureCount,1);assert.equal(two.furnitureCount,2);
  assert.equal(two.parts.length,one.parts.length);for(let i=0;i<one.parts.length;i++)assert.equal(two.parts[i].quantity,2*one.parts[i].quantity);
  for(const t of Object.keys(one.areaByThickness))close(two.areaByThickness[t],2*one.areaByThickness[t]);
  assert.deepEqual(two.assemblies.map(q=>q.rotation),[90,270]);assert.ok(two.parts.every(q=>!q.name.includes('Bed')));assert.ok(csvProject(p,c).includes('context_json'));assert.ok(csvProject(p,c).includes('assemblages_json'));
});
test('Old design payloads retain dimensions and receive independent room defaults',()=>{
  const restored=restoreParameters({...p,cubbyDepth:120,innerOffset:30} as typeof p);assert.equal(restored.width,306);assert.equal(restored.depth,297);assert.equal(restored.topHeight,650);
  assert.deepEqual(restoreBedroom(),c);assert.equal(restoreBedroom({leftRotation:12 as QuarterTurn,gap:-1}).leftRotation,0);
});
