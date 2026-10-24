import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Part, V3 } from './model';

// Adapted from Wes Bos' MIT-licensed bevelBox and Prop/Batch helpers.
export function bevelBox(min:V3,max:V3,r:number) {
  if(r===0) return new THREE.BoxGeometry(max[0]-min[0],max[1]-min[1],max[2]-min[2]).translate(...min.map((n,i)=>(n+max[i])/2) as V3).toNonIndexed();
  const dirs=[[1,0,0],[0,1,0],[0,0,1],[Math.SQRT1_2,Math.SQRT1_2,0],[Math.SQRT1_2,0,Math.SQRT1_2],[0,Math.SQRT1_2,Math.SQRT1_2],[1/Math.sqrt(3),1/Math.sqrt(3),1/Math.sqrt(3)]];
  const points:THREE.Vector3[]=[];
  for(const sx of [-1,1]) for(const sy of [-1,1]) for(const sz of [-1,1]) {
    const signs=[sx,sy,sz],center=min.map((n,i)=>(n+max[i])/2+signs[i]*((max[i]-n)/2-r));
    for(const d of dirs) points.push(new THREE.Vector3(...center.map((n,i)=>n+signs[i]*d[i]*r) as V3));
  }
  return new ConvexGeometry(points);
}
export function partGeometry(part:Part,bevelMm=0):THREE.BufferGeometry {
  const r=Math.min(bevelMm/1000,part.thickness/5);
  const shape=part.profile;
  const ring=shape[0]?.[0];
  const rectangular=shape.length===1 && shape[0].length===1 && ring.length===5 && ring.slice(0,4).every(([x,y],i)=>{const next=ring[(i+1)%4];return Math.abs(x-next[0])<1e-9 || Math.abs(y-next[1])<1e-9;});
  let geometry:THREE.BufferGeometry;
  if(rectangular) geometry=bevelBox(part.min,part.max,r);
  else {
    const shapes=shape.map(polygon=>{
      const s=new THREE.Shape(polygon[0].slice(0,-1).map(([x,y])=>new THREE.Vector2(x,y)));
      s.holes=polygon.slice(1).map(ring=>new THREE.Path(ring.slice(0,-1).map(([x,y])=>new THREE.Vector2(x,y))));return s;
    });
    geometry=new THREE.ExtrudeGeometry(shapes,{depth:part.max[2]-part.min[2]-2*r,bevelEnabled:r>0,bevelSize:r,bevelOffset:-r,bevelThickness:r,bevelSegments:2,steps:1,curveSegments:1});
    geometry.translate(0,0,part.min[2]+r);
  }
  sanitize(geometry);
  const pos=geometry.getAttribute('position'),nor=geometry.getAttribute('normal');
  const uv=new Float32Array(pos.count*2);geometry.clearGroups();
  for(let i=0;i<pos.count;i+=3) {
    const face=Math.abs(nor.getComponent(i,part.thicknessAxis))>.85;
    geometry.addGroup(i,3,face?0:1);
    for(let k=i;k<i+3;k++) {
      const x=pos.getX(k),y=pos.getY(k),z=pos.getZ(k),a=part.thicknessAxis;
      let u=part.lengthAxis===0?x:y,v=a===2?y:z;
      if(!face) {u=Math.abs(nor.getZ(k))>.5?(part.lengthAxis===0?x:y):z;v=pos.getComponent(k,a)-part.min[a];}
      else if(part.grain==='width') [u,v]=[v,u];
      uv[k*2]=u;uv[k*2+1]=v;
    }
  }
  geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  geometry.computeBoundingBox();geometry.computeBoundingSphere();return geometry;
}
export function sanitize(g:THREE.BufferGeometry) {
  const pos=g.getAttribute('position'),nor=g.getAttribute('normal');
  for(let i=0;i<pos.count;i++) {
    if(!Number.isFinite(pos.getX(i)+pos.getY(i)+pos.getZ(i))) pos.setXYZ(i,0,0,0);
    if(nor && !(Math.hypot(nor.getX(i),nor.getY(i),nor.getZ(i))>1e-6)) nor.setXYZ(i,0,1,0);
  }
}
/** Two batches inside each named part preserve selection and explosion boundaries. */
export function buildPartObject(part:Part,bevel:number,materials:[THREE.Material,THREE.Material]) {
  const g=partGeometry(part,bevel),p=g.getAttribute('position'),n=g.getAttribute('normal'),uv=g.getAttribute('uv');
  const object=new THREE.Group();object.name=part.name;object.userData.part=part;
  for(const index of [0,1]) {
    const list:THREE.BufferGeometry[]=[];
    for(const group of g.groups.filter(q=>q.materialIndex===index)) {
      const item=new THREE.BufferGeometry();
      for(const [name,attr] of [['position',p],['normal',n],['uv',uv]] as const) {
        const values=new Float32Array(group.count*attr.itemSize);
        for(let i=0;i<group.count;i++)for(let k=0;k<attr.itemSize;k++)values[i*attr.itemSize+k]=attr.getComponent(group.start+i,k);
        item.setAttribute(name,new THREE.BufferAttribute(values,attr.itemSize));
      }list.push(item);
    }
    if(list.length) {
      const merged=mergeGeometries(list,false)!;sanitize(merged);
      const mesh=new THREE.Mesh(merged,materials[index]);mesh.name=`${part.id}:${index===0?'fineer':'lagen'}`;
      mesh.castShadow=true;mesh.receiveShadow=true;object.add(mesh);list.forEach(item=>item.dispose());
    }
  }
  g.dispose();return object;
}
export function disposeGroup(root:THREE.Object3D,materials=false) {
  const geos=new Set<THREE.BufferGeometry>(),mats=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();
  root.traverse(obj=>{if(obj instanceof THREE.Mesh || obj instanceof THREE.Line){geos.add(obj.geometry);for(const mat of Array.isArray(obj.material)?obj.material:[obj.material])mats.add(mat);}});
  geos.forEach(g=>g.dispose());
  if(materials) {mats.forEach(m=>{for(const v of Object.values(m))if(v instanceof THREE.Texture)textures.add(v);m.dispose();});textures.forEach(t=>t.dispose());}
  root.removeFromParent();
}
