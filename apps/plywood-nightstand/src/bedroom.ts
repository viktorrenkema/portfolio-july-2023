import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { ROOM, placements, contextWarnings, type BedroomSettings } from './context';
import { overhang, type Parameters, type V3 } from './model';
import type { WoodMaps } from './materials';

import { makeProducts } from './products';
import { WALL_COLOR, herringboneFloor } from './room-materials';

function fabricTexture(stitches=false) {
  const cv=document.createElement('canvas');cv.width=cv.height=256;const ctx=cv.getContext('2d')!;
  let seed=42;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const img=ctx.createImageData(256,256);
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){const g=190+Math.round(rand()*25)+((x+y)%3===0?12:0);img.data.set([g,g,g,255],(y*256+x)*4);}ctx.putImageData(img,0,0);
  if(stitches){const g=ctx.createLinearGradient(0,0,256,0);g.addColorStop(0,'#444');g.addColorStop(.025,'#bbb');g.addColorStop(.08,'#eee');g.addColorStop(.92,'#eee');g.addColorStop(.975,'#bbb');g.addColorStop(1,'#444');ctx.globalAlpha=.8;ctx.fillStyle=g;ctx.fillRect(0,0,256,256);}
  const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(stitches?20:7,stitches?3:7);t.anisotropy=8;return t;
}
export function makeBedroom(p:Parameters,c:BedroomSettings,maps:WoodMaps) {
  const root=new THREE.Group();root.name='Slaapkamercontext';
  const clothBump=fabricTexture(),cloth=new THREE.MeshStandardMaterial({color:'#cec9bb',roughness:.92,bumpMap:clothBump,bumpScale:.00045});
  const white=new THREE.MeshStandardMaterial({color:'#f4f2e9',roughness:.96,bumpMap:clothBump,bumpScale:.00018});
  // Maps are cloned so the context owns its texture handles, while sharing image data.
  const woodMap=maps.map.clone();woodMap.needsUpdate=true;
  const wood=new THREE.MeshStandardMaterial({color:'#a47c4c',map:woodMap,roughness:.7});
  const wall=new THREE.MeshStandardMaterial({color:WALL_COLOR,roughness:1});
  const floorMat=herringboneFloor(maps),trimMaterial=new THREE.MeshStandardMaterial({color:WALL_COLOR,roughness:.55});
  const add=(name:string,g:THREE.BufferGeometry,mat:THREE.Material,at:V3=[0,0,0])=>{const mesh=new THREE.Mesh(g,mat);mesh.name=name;mesh.position.set(...at);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);return mesh;};
  const slab=(name:string,size:V3,at:V3,mat:THREE.Material,r=.015)=>add(name,new RoundedBoxGeometry(...size,2,r),mat,at);
  slab('Vloer',[3.5,.015,2.75],[0,-.0075,1.15],floorMat,.001);
  slab('Wand',[3.5,1.45,.02],[0,.725,-.012],wall,.001);
  const rear=(ROOM.skirtingDepth+ROOM.headboardDepth)/1000;
  for(const x of [-.4515,.4515])slab('Boxspring · 200-400 mm',[.897,.2,2],[x,.3,rear+1],cloth,.018);
  slab('Matras · 400-590 mm',[1.8,.19,2],[0,.495,rear+1],cloth,.025);
  slab('Topper · 590-700 mm',[1.8,.11,2],[0,.645,rear+1],white,.028);
  for(const x of [-.77,0,.77])for(const z of [rear+.17,rear+1.83]){
    const geometry=new THREE.CylinderGeometry(.035,.02,.2,16),pos=geometry.getAttribute('position');
    for(let i=0;i<pos.count;i++){const t=(.1-pos.getY(i))/.2;pos.setX(i,pos.getX(i)+Math.sign(x)*.025*t);pos.setZ(i,pos.getZ(i)+(z>1?1:-1)*.02*t);}geometry.computeVertexNormals();
    add('Houten bedpoot · 0-200 mm',geometry,wood,[x,.1,z]);
  }
  const shape=new THREE.Shape();shape.moveTo(-1,0);shape.lineTo(1,0);shape.lineTo(1,.8);shape.quadraticCurveTo(1,1,.8,1);shape.lineTo(-.8,1);shape.quadraticCurveTo(-1,1,-1,.8);shape.closePath();
  const boardGeo=new THREE.ExtrudeGeometry(shape,{depth:.05,bevelEnabled:false,curveSegments:20});
  const uv=boardGeo.getAttribute('uv'),pos=boardGeo.getAttribute('position');for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)+1)/2,pos.getY(i));
  const headMat=cloth.clone();headMat.bumpMap=fabricTexture(true);headMat.bumpScale=.0028;
  add('Hoofdbord · 2000 × 1000 × 50 mm',boardGeo,headMat,[0,0,.018]);
  const stitch=new THREE.MeshStandardMaterial({color:'#b5b0a3',roughness:1});
  for(let x=-.9;x<.95;x+=.1){
    const edge=Math.max(0,Math.abs(x)-.8)/.2,height=1-.2*(1-Math.sqrt(1-edge*edge));
    const path=new THREE.CatmullRomCurve3([new THREE.Vector3(x,.015,.069),new THREE.Vector3(x,height-.045,.069),new THREE.Vector3(x,height-.016,.067)]);
    add('Verticale stikbaan hoofdbord',new THREE.TubeGeometry(path,20,.0008,4,false),stitch);
  }
  const trim=new THREE.Shape();trim.moveTo(0,0);trim.lineTo(.018,0);trim.lineTo(.018,.100);trim.bezierCurveTo(.018,.104,.010,.103,.012,.106);trim.bezierCurveTo(.014,.109,.013,.110,.010,.110);trim.lineTo(0,.110);trim.closePath();
  const trimGeo=new THREE.ExtrudeGeometry(trim,{depth:3.5,bevelEnabled:false,curveSegments:8});trimGeo.rotateY(-Math.PI/2);
  add('Houten plint · 0-110 mm, S-profiel',trimGeo,trimMaterial,[1.75,0,0]);
  const plastic=new THREE.MeshStandardMaterial({color:'#f5f3eb',roughness:.4}),recess=new THREE.MeshStandardMaterial({color:'#d3d1c8',roughness:.65}),holeMat=new THREE.MeshStandardMaterial({color:'#42443f',roughness:.85});
  const warn=contextWarnings(p,c);
  for(const pose of placements(p,c)){
    const x=pose.center[0];
    if(p.mounting==='floor'&&p.feet)for(const localX of [overhang(p)/1000+.009,p.width/1000-.009])for(const z of [-p.depth/2000+.025,p.depth/2000-.025]){
      const at=new THREE.Vector3(localX,-p.footHeight/2000,z).applyMatrix4(pose.matrix);
      add('Stelvoetje kastje',new THREE.BoxGeometry(.012,p.footHeight/1000,.012),holeMat,at.toArray() as V3);
    }
    const socketRoot=new THREE.Group();socketRoot.name=`Dubbel stopcontact ${pose.id}`;socketRoot.position.x=x;socketRoot.userData.context={kind:'outlet',instance:pose.id,minY:.13,maxY:.21};root.add(socketRoot);
    const face=new THREE.Mesh(new RoundedBoxGeometry(.1518,.08,.0074,2,.003),plastic);face.position.set(0,.17,.0037);socketRoot.add(face);
    for(const dx of [-.03555,.03555]){
      const insert=new THREE.Mesh(new RoundedBoxGeometry(.055,.055,.003,2,.003),recess);insert.position.set(dx,.17,.009);socketRoot.add(insert);
      const cup=new THREE.Mesh(new THREE.CylinderGeometry(.019,.019,.001,32),plastic);cup.rotation.x=Math.PI/2;cup.position.set(dx,.17,.01075);socketRoot.add(cup);
      for(const hx of [-.009,.009]){const hole=new THREE.Mesh(new THREE.CylinderGeometry(.002,.002,.0015,12),holeMat);hole.rotation.x=Math.PI/2;hole.position.set(dx+hx,.17,.01065);socketRoot.add(hole);}
    }
    const side=pose.id==='left'?-1:1,mid=side*1.2,color=warn.some(q=>q.instance===pose.id)?'#b85840':'#72917a';
    const zoneMat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.09,depthWrite:false});
    const zone=new THREE.Mesh(new THREE.PlaneGeometry(.4,Math.max(.4,pose.spanZ)),zoneMat);zone.rotation.x=-Math.PI/2;zone.position.set(mid,.001,Math.max(.4,pose.spanZ)/2);zone.name=`400 mm ruimte ${pose.id}`;root.add(zone);
    const points=[new THREE.Vector3(side*1, .003,0),new THREE.Vector3(side*1,.003,.55),new THREE.Vector3(side*1.4,.003,0),new THREE.Vector3(side*1.4,.003,.55)];
    root.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineDashedMaterial({color,dashSize:.015,gapSize:.01})));(root.children.at(-1) as THREE.LineSegments).computeLineDistances();
  }
  if(c.showProducts)root.add(makeProducts(p,c));
  return root;
}
