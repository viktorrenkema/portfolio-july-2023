import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { placements, type BedroomSettings } from './context';
import { buildParts, thickness, type Parameters, type V3 } from './model';

export const PRODUCT_SPECS = {
  lamp:{name:'Philips Wake-up Light',size:[199,146,192]},
  koboBlue:{name:'Kobo met blauwe hoes',size:[116,164,14]},
  cup:{name:'Groene theekop',size:[145,110,95]},
  tissues:{name:'Zakdoekpakje',size:[105,55,25]},
  spray:{name:'Neusspray',size:[30,30,110]},
  sonos:{name:'Sonos One SL',size:[119.7,119.7,161.45]},
  charger:{name:'Witte 2-in-1-lader',size:[162,75,8]},
  koboBlack:{name:'Kobo met zwarte hoes',size:[116,164,14]},
} as const;
export type ProductKind=keyof typeof PRODUCT_SPECS;
export interface ProductPlacement {
  id:string;instance:'left'|'right';kind:ProductKind;surface:'top'|'shelf';
  bounds:THREE.Box3;support:THREE.Box3;matrix:THREE.Matrix4;worldBounds:THREE.Box3;
}
const mm=(n:number)=>n/1000;
export function productLayout(p:Parameters,c:BedroomSettings):ProductPlacement[] {
  if(c.mode!=='bedroom'||!c.showProducts)return [];
  const result:ProductPlacement[]=[],shelf=buildParts(p).find(q=>q.id==='shelf')!,w=mm(p.width),d=mm(p.depth),margin=.01;
  for(const pose of placements(p,c)){
    // Positions on top use an unmirrored frame. Products rotate, never reflect.
    const base=new THREE.Matrix4().makeTranslation(...pose.center).multiply(new THREE.Matrix4().makeRotationY(pose.angle*Math.PI/180)).multiply(new THREE.Matrix4().makeTranslation(-w/2,0,0));
    const add=(kind:ProductKind,surface:'top'|'shelf',x:number,v:number)=>{
      const [width,depth,height]=PRODUCT_SPECS[kind].size.map(mm),y=surface==='top'?mm(p.height):mm(p.shelfHeight);
      if(surface==='shelf'&&pose.mirrored)x=w-x-width;
      const bounds=new THREE.Box3(new THREE.Vector3(x,y,v-d/2),new THREE.Vector3(x+width,y+height,v+depth-d/2));
      const x0=surface==='top'?0:pose.mirrored?w-shelf.max[0]:shelf.min[0],x1=surface==='top'?w:pose.mirrored?w-shelf.min[0]:shelf.max[0];
      const support=new THREE.Box3(new THREE.Vector3(x0,y,-d/2),new THREE.Vector3(x1,y,d/2));
      const matrix=base.clone().multiply(new THREE.Matrix4().makeTranslation(x+width/2,y,v-d/2+depth/2));
      result.push({id:`${pose.id}:${kind}`,instance:pose.id,kind,surface,bounds,support,matrix,worldBounds:bounds.clone().applyMatrix4(base)});
    };
    if(pose.id==='left'){
      add('lamp','top',margin,margin);
      add('cup','top',w-margin-.145,d-margin-.110);
      add('spray','top',margin,d-margin-.030);
      add('koboBlue','shelf',shelf.min[0]+margin,d-margin-.164);
      add('tissues','shelf',shelf.max[0]-margin-.105,margin);
    } else {
      add('sonos','top',w-margin-.1197,margin);
      add('charger','top',margin,d-margin-.075);
      add('koboBlack','shelf',shelf.min[0]+margin,d-margin-.164);
    }
  }
  return result;
}
export interface ProductWarning {productId:string;message:string;reason:'overhang'|'height'|'overlap';}
export function productWarnings(p:Parameters,c:BedroomSettings):ProductWarning[] {
  const items=productLayout(p,c),result:ProductWarning[]=[],epsilon=1e-6;
  const name=(item:ProductPlacement)=>`${item.instance==='left'?'Links':'Rechts'}: ${PRODUCT_SPECS[item.kind].name}`;
  for(const item of items){
    const b=item.bounds,s=item.support;
    if(b.min.x<s.min.x-epsilon||b.max.x>s.max.x+epsilon||b.min.z<s.min.z-epsilon||b.max.z>s.max.z+epsilon)result.push({productId:item.id,reason:'overhang',message:`${name(item)} steekt buiten de steunplank.`});
    const free=p.height-thickness(p,'top')-p.shelfHeight,required=PRODUCT_SPECS[item.kind].size[2]+5;
    if(item.surface==='shelf'&&free<required-epsilon)result.push({productId:item.id,reason:'height',message:`${name(item)}: ${Math.round(free)} mm vrije hoogte, ${required} mm nodig met 5 mm speling.`});
  }
  for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
    const a=items[i],b=items[j];if(a.instance!==b.instance)continue;
    const overlaps=(['x','y','z'] as const).every(axis=>Math.min(a.bounds.max[axis],b.bounds.max[axis])-Math.max(a.bounds.min[axis],b.bounds.min[axis])>epsilon);
    if(overlaps){for(const item of [a,b])result.push({productId:item.id,reason:'overlap',message:`${name(item)}: bezette ruimte overlapt ${PRODUCT_SPECS[item===a?b.kind:a.kind].name.toLowerCase()}.`});}
  }
  return result;
}

function canvasTexture(width:number,height:number,draw:(ctx:CanvasRenderingContext2D)=>void) {
  const cv=document.createElement('canvas');cv.width=width;cv.height=height;draw(cv.getContext('2d')!);
  const texture=new THREE.CanvasTexture(cv);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;return texture;
}
function lettering(text:string,color='#deded9',background?:string) {
  return canvasTexture(512,128,ctx=>{if(background){ctx.fillStyle=background;ctx.fillRect(0,0,512,128);}ctx.fillStyle=color;ctx.font='500 78px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,67);});
}
function roundedPrism(width:number,depth:number,height:number,radius:number) {
  const bevel=.001,x=width/2-bevel,z=depth/2-bevel,r=radius-bevel,shape=new THREE.Shape();
  shape.moveTo(-x+r,-z);shape.lineTo(x-r,-z);shape.quadraticCurveTo(x,-z,x,-z+r);shape.lineTo(x,z-r);shape.quadraticCurveTo(x,z,x-r,z);shape.lineTo(-x+r,z);shape.quadraticCurveTo(-x,z,-x,z-r);shape.lineTo(-x,-z+r);shape.quadraticCurveTo(-x,-z,-x+r,-z);
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:height-2*bevel,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,steps:1,curveSegments:12});geometry.rotateX(-Math.PI/2);geometry.translate(0,bevel,0);
  const uv=geometry.getAttribute('uv'),pos=geometry.getAttribute('position'),normal=geometry.getAttribute('normal');
  for(let i=0;i<uv.count;i++)if(Math.abs(normal.getY(i))>.5)uv.setXY(i,pos.getX(i)/width+.5,pos.getZ(i)/depth+.5);else uv.setXY(i,Math.abs(normal.getX(i))>.5?pos.getZ(i)/depth+.5:pos.getX(i)/width+.5,pos.getY(i)/height);
  return geometry;
}
export function makeProducts(p:Parameters,c:BedroomSettings) {
  const root=new THREE.Group();root.name='Producten';root.userData.kind='products';
  const items=productLayout(p,c);if(!items.length)return root;
  const white=new THREE.MeshStandardMaterial({color:'#f3f1e9',roughness:.45}),black=new THREE.MeshStandardMaterial({color:'#171a1b',roughness:.7});
  const green=new THREE.MeshPhysicalMaterial({color:'#416f46',roughness:.25,clearcoat:.35,clearcoatRoughness:.2});
  const blue=new THREE.MeshStandardMaterial({color:'#315c91',roughness:.85});
  const labelMat=(map:THREE.Texture)=>new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false});
  const koboLabel=labelMat(lettering('kobo')),sonosLabel=labelMat(lettering('SONOS'));
  const grill=canvasTexture(128,128,ctx=>{ctx.fillStyle='#292c2c';ctx.fillRect(0,0,128,128);ctx.fillStyle='#090b0c';for(let y=0;y<128;y+=8)for(let x=0;x<128;x+=8){ctx.beginPath();ctx.arc(x+(y%16?4:0),y,1.8,0,Math.PI*2);ctx.fill();}});grill.wrapS=grill.wrapT=THREE.RepeatWrapping;grill.repeat.set(4,5);
  const grilleMat=new THREE.MeshStandardMaterial({map:grill,color:'#92999b',roughness:.85,bumpMap:grill,bumpScale:.00025});
  const mesh=(group:THREE.Group,name:string,g:THREE.BufferGeometry,m:THREE.Material,at:V3=[0,0,0])=>{const o=new THREE.Mesh(g,m);o.name=name;o.position.set(...at);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;};
  const box=(g:THREE.Group,name:string,size:V3,m:THREE.Material,at:V3,r=.003)=>mesh(g,name,new RoundedBoxGeometry(...size,2,r),m,at);
  const decal=(g:THREE.Group,name:string,size:[number,number],m:THREE.Material,at:V3,top=false)=>{const o=mesh(g,name,new THREE.PlaneGeometry(...size),m,at);o.castShadow=false;if(top)o.rotation.x=-Math.PI/2;return o;};
  for(const item of items){
    const g=new THREE.Group();g.name=PRODUCT_SPECS[item.kind].name;g.userData.product={id:item.id,instance:item.instance,kind:item.kind,surface:item.surface,sizeMm:PRODUCT_SPECS[item.kind].size};g.matrixAutoUpdate=false;g.matrix.copy(item.matrix);root.add(g);
    switch(item.kind){
      case 'lamp':{
        const profile=[[0,-.073],[.055,-.073],[.085,-.045],[.0995,0],[.0995,.055],[.097,.067],[.092,.070],[0,.070]].map(([r,z])=>new THREE.Vector2(r,z));
        const housing=new THREE.LatheGeometry(profile,64);housing.rotateX(Math.PI/2);housing.scale(1,.192/.199,1);mesh(g,'Witte ronde behuizing',housing,white,[0,.096,0]);
        box(g,'Voet',[.102,.008,.058],white,[0,.004,0],.003);
        const light=new THREE.MeshStandardMaterial({color:'#fff0ce',emissive:'#ffce81',emissiveIntensity:.18,roughness:.5});
        mesh(g,'Lichtvlak',new THREE.CircleGeometry(.086,64),light,[0,.102,.0701]);
        box(g,'Klokdisplay',[.064,.025,.004],black,[0,.044,.071],.004);
        decal(g,'07:00',[.054,.014],labelMat(lettering('07:00','#efb26e','#171a1b')),[0,.044,.0731]);
        decal(g,'Philips',[.038,.009],labelMat(lettering('PHILIPS','#777569')),[0,.073,.0702]);break;
      }
      case 'sonos':{
        mesh(g,'Geperforeerde grille',roundedPrism(.1197,.1197,.15345,.019),grilleMat);
        mesh(g,'Bovenzijde',roundedPrism(.1197,.1197,.008,.019),black,[0,.15345,0]);
        decal(g,'SONOS',[.048,.012],sonosLabel,[0,.083,.0599]);
        for(const x of [-.025,0,.025])decal(g,'Bovenbediening',[.006,.002],labelMat(lettering(x===0?'▶':'▪','#7c8281')),[x,.1615,0],true);
        break;
      }
      case 'koboBlue':case 'koboBlack':{
        box(g,'Gesloten hoes',[.116,.014,.164],item.kind==='koboBlue'?blue:black,[0,.007,0],.004);
        box(g,'Boekrug',[.004,.012,.157],item.kind==='koboBlue'?blue:black,[-.055,.007,0],.001);
        decal(g,'Kobo',[.035,.009],koboLabel,[.027,.0141,.06],true);
        const points=[[-.05,.0141,-.074],[.05,.0141,-.074],[.05,.0141,.074],[-.05,.0141,.074],[-.05,.0141,-.074]] as V3[];
        const seam=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(q=>new THREE.Vector3(...q))),new THREE.LineBasicMaterial({color:'#9da5ac',transparent:true,opacity:.25}));g.add(seam);break;
      }
      case 'cup':{
        const profile=[[0,0],[.041,0],[.047,.005],[.055,.088],[.055,.093],[.053,.095],[.051,.093],[.049,.018],[.038,.012],[0,.012]].map(([x,y])=>new THREE.Vector2(x,y));
        mesh(g,'Holle groene kop',new THREE.LatheGeometry(profile,48),green,[-.0175,0,0]);
        mesh(g,'Oor',new THREE.TorusGeometry(.0235,.0065,10,40),green,[.0425,.054,0]);
        const tea=new THREE.MeshPhysicalMaterial({color:'#6b3a14',roughness:.2,clearcoat:.4});
        const surface=mesh(g,'Thee',new THREE.CircleGeometry(.048,48),tea,[-.0175,.080,0]);surface.rotation.x=-Math.PI/2;break;
      }
      case 'tissues':{
        box(g,'Zakdoekjes',[.105,.025,.055],white,[0,.0125,0],.006);
        const label=labelMat(lettering('tissues','#edf2f6','#6386a5'));
        decal(g,'Wikkel',[.089,.024],label,[0,.0251,0],true);
        box(g,'Sluitflap',[.018,.0005,.012],white,[.033,.0251,.017],.0002);break;
      }
      case 'spray':{
        mesh(g,'Flesje',new THREE.CylinderGeometry(.014,.015,.065,32),white,[0,.0325,0]);
        mesh(g,'Schouder',new THREE.CylinderGeometry(.008,.014,.013,32),white,[0,.0715,0]);
        mesh(g,'Spraypomp',new THREE.CylinderGeometry(.004,.006,.022,24),white,[0,.089,0]);
        box(g,'Spuitmond',[.018,.008,.009],white,[.003,.100,0],.002);
        mesh(g,'Blauwe labelband',new THREE.CylinderGeometry(.0151,.0151,.028,32),blue,[0,.032,0]);
        const cap=new THREE.MeshPhysicalMaterial({color:'#e8eff0',transparent:true,opacity:.38,roughness:.25,depthWrite:false});
        mesh(g,'Transparante dop',new THREE.CylinderGeometry(.009,.009,.032,32),cap,[0,.094,0]);break;
      }
      case 'charger':{
        for(const x of [-.0435,.0435])box(g,'Laadvlak',[.075,.008,.075],white,[x,.004,0],.0037);
        box(g,'Scharnier',[.012,.004,.062],white,[0,.004,0],.001);
        const ringMat=new THREE.MeshStandardMaterial({color:'#deded8',roughness:.65});
        for(const [x,r] of [[-.0435,.025],[.0435,.014]]){const ring=mesh(g,'Laadring',new THREE.TorusGeometry(r,.0004,6,48),ringMat,[x,.0081,0]);ring.rotation.x=Math.PI/2;}
        box(g,'USB-C',[.008,.002,.001],black,[0,.004,-.031],.0005);break;
      }
    }
  }
  const warnings=productWarnings(p,c);
  for(const item of items)if(warnings.some(w=>w.productId===item.id)){const outline=new THREE.Box3Helper(item.worldBounds,'#c74728');outline.name='Product past niet';(outline.material as THREE.Material).depthTest=false;root.add(outline);}
  return root;
}
