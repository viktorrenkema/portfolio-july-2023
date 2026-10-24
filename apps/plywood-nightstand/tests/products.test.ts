import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { clonePreset, buildParts } from '../src/model';
import { defaultBedroom, restoreBedroom, placements, exportProject, csvProject, type QuarterTurn } from '../src/context';
import { productLayout, productWarnings, PRODUCT_SPECS } from '../src/products';
const p={...clonePreset('maze'),width:306,depth:297,height:420,topHeight:650},c={...defaultBedroom(),showProducts:true};
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('Eight products sit on their real supports and fit the current nightstands',()=>{
  const items=productLayout(p,c);assert.equal(items.length,8);assert.equal(items.filter(q=>q.instance==='left').length,5);assert.equal(items.filter(q=>q.instance==='right').length,3);assert.deepEqual(productWarnings(p,c),[]);
  for(const item of items){close(item.worldBounds.min.y,item.surface==='top'?.65:.555);const spec=PRODUCT_SPECS[item.kind].size,b=item.bounds.getSize(new THREE.Vector3());close(b.x,spec[0]/1000);close(b.z,spec[1]/1000);close(b.y,spec[2]/1000);}
});
test('Every quarter turn moves complete sets without reflecting product geometry',()=>{
  for(const angle of [0,90,180,270] as QuarterTurn[])for(const opening of ['inward','outward'] as const){
    const room={...c,leftRotation:angle,opening},items=productLayout(p,room);assert.equal(items.length,8);assert.deepEqual(productWarnings(p,room),[]);
    for(const item of items){close(item.matrix.determinant(),1);const pose=placements(p,room).find(q=>q.id===item.instance)!;const rotation=new THREE.Matrix4().extractRotation(item.matrix);const expected=new THREE.Matrix4().makeRotationY(pose.angle*Math.PI/180);rotation.elements.forEach((v,i)=>close(v,expected.elements[i]));}
  }
});
test('Opening reversal preserves top locations and moves shelf objects onto mirrored shelves',()=>{
  const a=productLayout(p,c),b=productLayout(p,{...c,opening:'outward'});
  for(const item of a){const other=b.find(q=>q.id===item.id)!;if(item.surface==='top')assert.deepEqual(other.worldBounds,item.worldBounds);else{close(other.bounds.min.x,p.width/1000-item.bounds.max.x);close(other.bounds.max.x,p.width/1000-item.bounds.min.x);assert.ok(other.bounds.min.x>=other.support.min.x);assert.ok(other.bounds.max.x<=other.support.max.x);}}
  const sonos=a.find(q=>q.kind==='sonos')!;close(sonos.bounds.max.x,.296);close(sonos.bounds.min.z,-.297/2+.01);
});
test('Independent right rotation and changed shelf height preserve real product dimensions',()=>{
  const design={...p,depth:350,shelfHeight:340},room={...c,leftRotation:90 as const,rightRotation:180 as const,linkedRotation:false};
  for(const item of productLayout(design,room)){close(item.worldBounds.min.y,item.surface==='shelf'?.570:.65);close(item.matrix.determinant(),1);}
});
test('Warnings show overhang, occupied-volume conflicts and insufficient usable shelf clearance',()=>{
  assert.ok(productWarnings({...p,width:180,depth:180},c).some(q=>q.reason==='overhang'));
  assert.ok(productWarnings({...p,depth:200},c).some(q=>q.reason==='overlap'));
  assert.ok(productWarnings({...p,shelfHeight:376},c).some(q=>q.reason==='height'&&q.productId.includes('tissues')));
  assert.ok(productLayout({...p,width:180},c).find(q=>q.kind==='lamp')!.bounds.getSize(new THREE.Vector3()).x>.198);
});
test('Optional products migrate, remain bedroom-only and never enter the furniture bill',()=>{
  assert.equal(restoreBedroom().showProducts,false);assert.equal(restoreBedroom({showProducts:'yes' as unknown as boolean}).showProducts,false);
  assert.equal(productLayout(p,defaultBedroom()).length,0);assert.equal(productLayout(p,{...c,mode:'single'}).length,0);
  const off=exportProject(p,{...c,showProducts:false}),on=exportProject(p,c);assert.deepEqual(on.parts,off.parts);assert.deepEqual(on.areaByThickness,off.areaByThickness);assert.equal(on.parts.length,buildParts(p).length);assert.equal(on.context.showProducts,true);assert.ok(csvProject(p,c).includes('showProducts'));
});
