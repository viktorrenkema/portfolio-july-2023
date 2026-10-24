import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { buildParts, overhang, type Parameters, type Part, type V3 } from './model';
import { buildPartObject, disposeGroup } from './geometry';
import { createMaterials, loadWoodTextures, type WoodMaps } from './materials';
import { defaultBedroom, placements, clearances, contextWarnings, type BedroomSettings, type InstanceId } from './context';
import { productLayout } from './products';
import { makeBedroom } from './bedroom';
export type View='orbit'|'front'|'side'|'top'|'closeup';
export class Viewer {
  renderer:THREE.WebGLRenderer; scene=new THREE.Scene();camera:THREE.PerspectiveCamera|THREE.OrthographicCamera;
  controls:OrbitControls; labels=new CSS2DRenderer();composer:EffectComposer;ao:GTAOPass;pass:RenderPass;
  model=new THREE.Group(); annotations=new THREE.Group();fixtures=new THREE.Group();grid=new THREE.Group();
  context=defaultBedroom();selectedInstance:InstanceId='left';
  cameraFocus:'room'|'left'|'right'='room';
  parts:Part[]=[];p!:Parameters;view:View='orbit';dimensionMode='off';explosion=0;pending=0;frames=0;
  maps!:WoodMaps;materials?:ReturnType<typeof createMaterials>;selected?:string;onSelect?:(part?:Part,instance?:InstanceId)=>void;
  private resizeObserver:ResizeObserver;private env:THREE.WebGLRenderTarget;
  constructor(public host:HTMLElement,public scale:HTMLElement) {
    this.renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.toneMapping=THREE.AgXToneMapping;this.renderer.toneMappingExposure=1.15;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFShadowMap;this.renderer.shadowMap.autoUpdate=false;
    this.renderer.domElement.setAttribute('aria-label','Parametrisch 3D-model. Sleep om te draaien, scroll om te zoomen, klik om een onderdeel te selecteren.');
    host.append(this.renderer.domElement);this.labels.domElement.className='labels';host.append(this.labels.domElement);
    this.scene.background=new THREE.Color('#f1f2ef').multiplyScalar(3.5);
    const pmrem=new THREE.PMREMGenerator(this.renderer),studio=new RoomEnvironment();this.env=pmrem.fromScene(studio,.04);
    this.scene.environment=this.env.texture;this.scene.environmentIntensity=.5;studio.dispose();pmrem.dispose();
    this.scene.add(new THREE.HemisphereLight('#ffffff','#c4c7be',1.6));
    const key=new THREE.DirectionalLight('#fff9ed',2.7);key.position.set(-1,2,2);key.castShadow=true;key.shadow.mapSize.set(2048,2048);
    Object.assign(key.shadow.camera,{left:-2.6,right:2.6,top:2.8,bottom:-2,near:.01,far:6});key.shadow.normalBias=.0005;key.shadow.bias=-.00003;this.scene.add(key);
    const fill=new THREE.DirectionalLight('#ffffff',.8);fill.position.set(2,1,-1);this.scene.add(fill);
    this.camera=new THREE.PerspectiveCamera(34,1,.005,20);
    this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=false;this.controls.minDistance=.06;this.controls.maxDistance=5;
    this.controls.addEventListener('change',()=>this.invalidate());
    this.composer=new EffectComposer(this.renderer,new THREE.WebGLRenderTarget(1,1,{samples:4,type:THREE.HalfFloatType}));
    this.pass=new RenderPass(this.scene,this.camera);this.composer.addPass(this.pass);
    this.ao=new GTAOPass(this.scene,this.camera,1,1);this.ao.updateGtaoMaterial({radius:.035,thickness:.04,distanceExponent:1.5,scale:1,samples:16});this.ao.blendIntensity=.45;this.composer.addPass(this.ao);this.composer.addPass(new OutputPass());
    this.scene.add(this.model,this.annotations,this.fixtures,this.grid);
    let down:[number,number]=[0,0];
    host.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
    host.addEventListener('pointerup',e=>{
      if(Math.hypot(e.clientX-down[0],e.clientY-down[1])>4)return;
      const box=host.getBoundingClientRect(),ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-box.left)/box.width*2-1,-(e.clientY-box.top)/box.height*2+1),this.camera);
      const hit=ray.intersectObjects(this.model.children,true)[0];let object:THREE.Object3D|undefined=hit?.object;
      while(object && !object.userData.part)object=object.parent||undefined;
      this.select(object?.userData.part?.id,true,object?.userData.instance);
    });
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);
  }
  async init(p:Parameters,c:BedroomSettings=defaultBedroom()) {this.maps=await loadWoodTextures();this.rebuild(p,c);this.setView('orbit');}
  rebuild(p:Parameters,c:BedroomSettings=this.context) {
    this.context=structuredClone(c);
    const selected=this.selected;this.select(undefined,false);this.selected=selected;
    this.p=structuredClone(p);this.parts=buildParts(p);
    disposeGroup(this.model);this.materials?.dispose();this.materials=createMaterials(this.maps,p);this.model=new THREE.Group();this.scene.add(this.model);
    if(c.mode==='bedroom') {
      for(const pose of placements(p,c)) {
        const assembly=new THREE.Group();assembly.name=pose.id;assembly.matrixAutoUpdate=false;assembly.matrix.copy(pose.matrix);
        for(const part of this.parts){const object=buildPartObject(part,p.bevel,[this.materials.face,this.materials.edge(part.thickness*1000)]);object.userData.instance=pose.id;assembly.add(object);}
        this.model.add(assembly);
      }
    } else {
      for(const part of this.parts){const object=buildPartObject(part,p.bevel,[this.materials.face,this.materials.edge(part.thickness*1000)]);object.userData.instance='single';this.model.add(object);}
      if(p.handedness==='right'){this.model.scale.x=-1;this.model.position.x=p.width/1000;}
    }
    this.makeFixtures();this.setExplosion(this.explosion,false);this.select(this.selected,false);this.makeDimensions();this.makeGrid();
    this.renderer.shadowMap.needsUpdate=true;this.invalidate();
  }
  private makeFixtures() {
    disposeGroup(this.fixtures,true);this.fixtures=new THREE.Group();this.scene.add(this.fixtures);
    if(this.context.mode==='bedroom'){this.fixtures.add(makeBedroom(this.p,this.context,this.maps));return;}
    const p=this.p,w=p.width/1000,d=p.depth/1000,h=p.height/1000;
    const box=(size:V3,at:V3,color:string,opacity=1)=>{
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),new THREE.MeshStandardMaterial({color,roughness:.9,transparent:opacity<1,opacity}));mesh.position.set(...at);mesh.receiveShadow=true;this.fixtures.add(mesh);return mesh;
    };
    if(p.wallReference && p.mounting==='wall')box([w+.3,h+.2,.012],[w/2,h/2,-d/2-.025],'#d6dad3',.55);
    const foot=p.mounting==='floor'&&p.feet?p.footHeight/1000:0;
    if(p.mounting==='floor') {
      const floor=box([4,.006,4],[w/2,-foot-.003,0],'#f1f2ef');floor.receiveShadow=true;
      if(foot)for(const x of [overhang(p)/1000+.009,w-.009])for(const z of [-d/2+.025,d/2-.025])box([.012,foot,.012],[p.handedness==='right'?w-x:x,-foot/2,z],'#596056');
    }
    if(p.mounting==='wall' && p.hardware==='keyhole') {
      const x=p.handedness==='left'?w-(p.overrides.side||p.thickness)/2000:(p.overrides.side||p.thickness)/2000;
      for(const y of [h-.065,.065]) {
        const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.003,.003,.001,16),new THREE.MeshStandardMaterial({color:'#555d53',metalness:.4,roughness:.6}));mesh.rotation.x=Math.PI/2;mesh.position.set(x,y,-d/2-.0006);mesh.name='Schematische keyhole';this.fixtures.add(mesh);
      }
    }
  }
  private roomHalfWidth(){return Math.max(1.55,...placements(this.p,this.context).map(q=>Math.abs(q.center[0])+q.spanX/2+.12),...productLayout(this.p,this.context).map(q=>Math.max(Math.abs(q.worldBounds.min.x),Math.abs(q.worldBounds.max.x))+.12));}
  private roomTop(){return Math.max(1.1,...productLayout(this.p,this.context).map(q=>q.worldBounds.max.y+.1));}
  private focusBounds() {
    const pose=placements(this.p,this.context).find(q=>q.id===this.cameraFocus)!;
    const bounds=new THREE.Box3(new THREE.Vector3(pose.center[0]-pose.spanX/2,pose.center[1],0),new THREE.Vector3(pose.center[0]+pose.spanX/2,this.p.topHeight/1000,pose.spanZ));
    for(const item of productLayout(this.p,this.context))if(item.instance===pose.id)bounds.union(item.worldBounds);
    return bounds;
  }
  setCameraFocus(focus:'room'|'left'|'right') {
    this.cameraFocus=focus;this.setView('orbit');
  }
  setView(view:View) {
    this.view=view;document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===view));const p=this.p;if(!p)return;
    const w=p.width/1000,h=p.height/1000,d=p.depth/1000,ground=this.dimensionMode==='off'||this.explosion>.02?0:(p.topHeight-p.height)/1000,target=new THREE.Vector3(w/2,(h-ground)/2,0),extent=Math.max(w,h,d);
    const bedroom=this.context.mode==='bedroom';
    if(bedroom){target.set(0,.43,.8);}
    const previous=this.controls;previous.dispose();
    this.camera=view==='orbit'||view==='closeup'?new THREE.PerspectiveCamera(view==='closeup'?32:34*(1+this.explosion*.55),1,.002,20):new THREE.OrthographicCamera(-1,1,1,-1,.002,20);
    if(view==='front')this.camera.position.set(w/2,(h-ground)/2,2);
    else if(view==='side')this.camera.position.set(-2,(h-ground)/2,0);
    else if(view==='top'){this.camera.position.set(w/2,2,0);this.camera.up.set(0,0,-1);}
    else if(view==='closeup'){target.set(p.handedness==='left'?w-.025:.025,h-.025,d/2-.035);this.camera.position.copy(target).add(new THREE.Vector3(-.12,.12,.22));}
    else this.camera.position.copy(target).add(new THREE.Vector3(extent*1.1,extent*1.0,extent*3.1));
    if(bedroom){
      if(view==='front'){target.set(0,.5,0);this.camera.position.set(0,.5,5);}
      else if(view==='top'){target.set(0,0,1);this.camera.position.set(0,5,1);}
      else if(view==='side'){target.set(0,.5,1);this.camera.position.set(-5,.5,1);}
      else if(view==='closeup'){const pose=placements(p,this.context)[0];target.set(pose.center[0],.19,.03);this.camera.position.copy(target).add(new THREE.Vector3(.02,.07,.7));}
      else {
        const direction=new THREE.Vector3(.28,.5,1).normalize(),right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),direction).normalize(),up=new THREE.Vector3().crossVectors(direction,right),aspect=this.host.clientWidth/this.host.clientHeight,tan=Math.tan(THREE.MathUtils.degToRad(17));let distance=0;
        for(const x of [-this.roomHalfWidth(),this.roomHalfWidth()])for(const y of [0,this.roomTop()])for(const z of [0,2.15]){const delta=new THREE.Vector3(x,y,z).sub(target);distance=Math.max(distance,delta.dot(direction)+Math.max(Math.abs(delta.dot(right))/(tan*aspect*.84),Math.abs(delta.dot(up))/(tan*.84)));}
        this.camera.position.copy(target).addScaledVector(direction,distance);
      }
      if(this.cameraFocus!=='room') {
        const bounds=this.focusBounds(),side=this.cameraFocus==='left'?-1:1;
        bounds.getCenter(target);
        const direction=view==='top'?new THREE.Vector3(0,1,0):view==='side'?new THREE.Vector3(side,0,0):view==='front'?new THREE.Vector3(0,0,1):new THREE.Vector3(side*.18,.22,1).normalize();
        if(this.camera instanceof THREE.PerspectiveCamera) {
          const right=new THREE.Vector3().crossVectors(this.camera.up,direction).normalize(),up=new THREE.Vector3().crossVectors(direction,right),tan=Math.tan(THREE.MathUtils.degToRad(this.camera.fov/2)),aspect=this.host.clientWidth/this.host.clientHeight;
          let distance=0;
          for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]) {
            const delta=new THREE.Vector3(x,y,z).sub(target);
            distance=Math.max(distance,delta.dot(direction)+Math.max(Math.abs(delta.dot(right))/(tan*aspect*.7),Math.abs(delta.dot(up))/(tan*.7)));
          }
          this.camera.position.copy(target).addScaledVector(direction,Math.max(.3,distance));
        } else this.camera.position.copy(target).addScaledVector(direction,3);
      }
    }
    this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=false;this.controls.enableRotate=view==='orbit'||view==='closeup';this.controls.target.copy(target);this.controls.minDistance=.04;this.controls.maxDistance=12;this.controls.update();this.controls.addEventListener('change',()=>this.invalidate());
    this.pass.camera=this.camera;this.ao.camera=this.camera;this.resize();this.makeDimensions();this.makeGrid();
  }
  resize() {
    const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;
    this.renderer.setSize(w,h);this.labels.setSize(w,h);this.composer.setSize(w,h);
    if(this.camera instanceof THREE.PerspectiveCamera){this.camera.aspect=w/h;}
    else if(this.p){let height=this.context.mode==='bedroom'?Math.max(this.view==='top'?2.8:Math.max(1.6,(this.roomTop()-.5)*2+.1),(this.roomHalfWidth()*2+.1)/(w/h)):Math.max((this.dimensionMode==='off'||this.view==='top'?this.p.height:this.p.topHeight)/1000+.22,(Math.max(this.p.width,this.p.depth)/1000+.25)/(w/h))*(1+this.explosion*.65);if(this.context.mode==='bedroom'&&this.cameraFocus!=='room'){const size=this.focusBounds().getSize(new THREE.Vector3());height=Math.max(this.view==='top'?size.z:size.y,(this.view==='side'?size.z:size.x)/(w/h))/.7+.05;}this.camera.left=-height*w/h/2;this.camera.right=height*w/h/2;this.camera.top=height/2;this.camera.bottom=-height/2;}
    this.camera.updateProjectionMatrix();this.invalidate();
  }
  setExplosion(value:number,fitCamera=false) {
    this.explosion=value;
    const vectors:Record<string,V3>={top:[0,.13,0],side:[.13,0,0],shelf:[-.08,.04,.06],inner:[-.07,-.05,0],bottom:[0,-.11,.08],back:[0,0,-.1],cleat:[.05,.05,-.15]};
    for(const obj of this.partObjects()){const v=vectors[obj.userData.part.id];obj.position.set(...v.map(n=>n*value) as V3);}
    this.fixtures.visible=this.context.mode==='bedroom'||value<.02;if(fitCamera)this.setView(this.view);this.renderer.shadowMap.needsUpdate=true;this.invalidate();
  }
  private partObjects(){const parts:THREE.Object3D[]=[];this.model.traverse(o=>{if(o.userData.part)parts.push(o);});return parts;}
  select(id?:string,notify=true,instance:InstanceId=this.selectedInstance) {
    this.selected=id;this.selectedInstance=this.context.mode==='single'?'single':instance==='single'?'left':instance;
    for(const obj of this.partObjects())for(const child of obj.children)if(child instanceof THREE.Mesh){
      const original=child.userData.originalMaterial as THREE.Material|undefined;
      if(original){(child.material as THREE.Material).dispose();child.material=original;delete child.userData.originalMaterial;}
      if(obj.userData.part.id===id&&obj.userData.instance===this.selectedInstance){const mat=(child.material as THREE.MeshStandardMaterial).clone();mat.emissive.set('#53806a');mat.emissiveIntensity=.17;child.userData.originalMaterial=child.material;child.material=mat;}
    }
    if(notify){this.onSelect?.(this.parts.find(p=>p.id===id),this.selectedInstance);this.makeDimensions();}this.invalidate();
  }
  private label(text:string,at:V3,small=false) {
    const el=document.createElement('div');el.className=small?'dim-label part-label':'dim-label';el.textContent=text;
    const label=new CSS2DObject(el);label.position.set(...at);this.annotations.add(label);
  }
  private line(points:V3[],color='#7b8379') {
    const geometry=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));
    const line=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color,depthTest:false,transparent:true,opacity:.75}));line.renderOrder=20;this.annotations.add(line);
  }
  private dimension(a:V3,b:V3,offset:V3,text:string) {
    const A=a.map((n,i)=>n+offset[i]) as V3,B=b.map((n,i)=>n+offset[i]) as V3;
    const dir=new THREE.Vector3(...B).sub(new THREE.Vector3(...A)).normalize();
    let tick=new THREE.Vector3(...offset).normalize().multiplyScalar(.0045);if(tick.lengthSq()===0)tick.set(.003,.003,0);
    const points:V3[]=[a,A,b,B,A,B];
    for(const q of [A,B]){const pt=new THREE.Vector3(...q);points.push(pt.clone().add(tick).addScaledVector(dir,.002).toArray() as V3,pt.clone().sub(tick).addScaledVector(dir,-.002).toArray() as V3);}
    this.line(points);this.label(text,A.map((n,i)=>(n+B[i])/2) as V3);
  }
  setDimensions(mode:string){this.dimensionMode=mode;this.makeDimensions();this.makeGrid();this.invalidate();}
  makeDimensions() {
    this.annotations.traverse(o=>{if(o instanceof CSS2DObject)o.element.remove();});disposeGroup(this.annotations,true);this.annotations=new THREE.Group();this.scene.add(this.annotations);
    this.scale.classList.toggle('hidden',this.dimensionMode==='off');
    if(!this.p||this.dimensionMode==='off')return;
    if(this.context.mode==='bedroom'){this.makeBedroomDimensions();return;}
    this.makeSingleDimensions();
  }
  private makeSingleDimensions() {
    const p=this.p,w=p.width/1000,h=p.height/1000,d=p.depth/1000,s=p.shelfHeight/1000,t=(p.overrides.top||p.thickness)/1000;
    const dim=this.dimension.bind(this),all=this.dimensionMode==='all';
    if(this.explosion>.02) {
      for(const obj of this.partObjects()){const part=obj.userData.part as Part;let x=(part.min[0]+part.max[0])/2+obj.position.x;if(p.handedness==='right')x=w-x;
        this.label(`${part.name} · ${Math.round(part.length*1000)} × ${Math.round(part.width*1000)} × ${Math.round(part.thickness*1000)}`,[x,part.max[1]+obj.position.y+.018,part.max[2]+obj.position.z+.02],true);}
      return;
    }
    if(this.dimensionMode==='off'||this.view==='closeup')return;
    if(this.view==='side') {
      const ground=(p.topHeight-p.height)/1000;
      dim([0,-ground,d/2],[0,h,d/2],[0,0,.1],`Bovenblad ${p.topHeight}`);
      this.line([[0,-ground,-d/2-.03],[0,-ground,d/2+.13]],'#a4ad9c');
      dim([0,0,-d/2],[0,0,d/2],[0,-.042,0],`D ${p.depth}`);
      dim([0,0,-d/2],[0,h,-d/2],[0,0,-.05],`H ${p.height}`);
      dim([0,0,d/2],[0,s,d/2],[0,0,.045],`Plank 2 · ${p.shelfHeight}`);
      if(all)dim([0,0,-d/2],[0,0,d/2],[0,-.085,0],`Vakdiepte ${p.depth}`);
    } else if(this.view==='top') {
      dim([0,h,d/2],[w,h,d/2],[0,0,.045],`B ${p.width}`);
      dim([w,h,-d/2],[w,h,d/2],[.045,0,0],`D ${p.depth}`);
      if(all)dim([p.handedness==='left'?0:w,h,-d/2],[p.handedness==='left'?overhang(p)/1000:w-overhang(p)/1000,h,-d/2],[0,0,-.045],`Overstek ${overhang(p)}`);
    } else {
      const ground=(p.topHeight-p.height)/1000;
      dim([0,-ground,d/2],[0,h,d/2],[-.16,0,0],`Bovenblad ${p.topHeight}`);
      this.line([[-.19,-ground,d/2],[w+.06,-ground,d/2]],'#a4ad9c');
      this.label('Vloerpeil',[-.18,-ground,d/2]);
      dim([0,h,d/2],[w,h,d/2],[0,.03,0],`B ${p.width}`);
      dim([w,0,this.view==='orbit'?-d/2:d/2],[w,h,this.view==='orbit'?-d/2:d/2],[.065,0,0],`H ${p.height}`);
      dim([0,0,d/2],[0,s,d/2],[-.055,0,0],`Plank 2 · ${p.shelfHeight}`);
      const inner=p.handedness==='left'?overhang(p)/1000:w-overhang(p)/1000;
      dim([p.handedness==='left'?0:w,0,d/2],[inner,0,d/2],[0,-.04,0],`Overstek ${overhang(p)}`);
      if(this.view==='orbit')dim([w,0,-d/2],[w,0,d/2],[.045,-.04,0],`D ${p.depth}`);
      if(all) {
        const r=(p.overrides.side||p.thickness)/1000,i=(p.overrides.inner||p.thickness)/1000;
        const x0=p.handedness==='left'?inner+i:r,x1=x0+p.cubbyWidth/1000;
        dim([x0,0,d/2],[x1,0,d/2],[0,-.085,0],`Vak ${p.cubbyWidth}`);
        dim([0,s,d/2],[0,h-t,d/2],[-.105,0,0],`Vrij ${Math.round((h-t-s)*1000)}`);
        const floor=p.bottom?(p.overrides.bottom||p.thickness)/1000:0;
        dim([w,floor,d/2],[w,s-(p.overrides.shelf||p.thickness)/1000,d/2],[.11,0,.015],`Vak vrij ${Math.round((s-(p.overrides.shelf||p.thickness)/1000-floor)*1000)}`);
        dim([0,h-t,d/2],[0,h,d/2],[-.05,0,.025],`t ${t*1000}`);
        for(const part of this.parts.filter(q=>q.id!=='top'))this.label(`${part.name} · t ${Math.round(part.thickness*1000)}`,[p.handedness==='left'?(part.min[0]+part.max[0])/2:w-(part.min[0]+part.max[0])/2,(part.min[1]+part.max[1])/2,d/2+.008],true);
      }
    }
  }
  private makeBedroomDimensions() {
    if(this.dimensionMode==='off'||this.view==='closeup')return;
    const p=this.p,c=this.context,poses=placements(p,c),pose=poses.find(q=>q.id===this.selectedInstance)||poses[0],all=this.dimensionMode==='all';
    const floor=(p.topHeight-p.height)/1000,top=p.topHeight/1000,x=pose.center[0],front=pose.spanZ;
    const dim=this.dimension.bind(this),clear=clearances(p);
    if(this.view==='top') {
      dim([-.9,.72,2.068],[.9,.72,2.068],[0,0,.13],'Bed 1800');
      dim([.9,.72,.068],[.9,.72,2.068],[.14,0,0],'Bed 2000');
    } else {
      dim([x,0,front],[x,top,front],[x<0?-.23:.23,0,0],`Bovenblad ${p.topHeight}`);
      dim([x,floor,front],[x,top,front],[x<0?.19:-.19,0,.025],`Kast H ${p.height}`);
      dim([.9,0,2.068],[.9,.7,2.068],[.2,0,0],'Bedtop 700');
      this.label(`Vrij boven stopcontact ${clear.outlet} mm`,[x,.09,front+.06],true);
      this.label(`Bovenblad ${clear.bedTop>=0?clear.bedTop+' onder':-clear.bedTop+' boven'} bedtop`,[x,Math.max(top,.7)+.07,front]);
    }
    for(const q of poses){const side=q.id==='left'?-1:1;dim([side,0,.55],[side*1.4,0,.55],[0,.025,.07],'400 beschikbaar');
      if(all&&c.gap)dim([side,.02,.43],[side*(1+c.gap/1000),.02,.43],[0,.02,.03],`Tussenruimte ${c.gap}`);
    }
    if(all&&this.view!=='top'){
      for(const [low,high,name] of [[0,.2,'Poten 200'],[.2,.4,'Boxspring 200'],[.4,.59,'Matras 190'],[.59,.7,'Topper 110']] as const)dim([-.9,low,2.068],[-.9,high,2.068],[-.13,0,0],name);
      dim([-1,0,.068],[-1,1,.068],[-.5,0,0],'Hoofdbord 1000');

      dim([1.55,0,.018],[1.55,.11,.018],[.06,0,.03],'Plint 110');
      for(const q of poses){this.label('Stopcontact 130-210',[q.center[0],.115,.04],true);}
    }
    if(all)dim([-1,1,.068],[1,1,.068],this.view==='top'?[0,0,-.06]:[0,.1,0],'Hoofdbord 2000');
    if(this.selected&&all){
      // Existing cabinet dimensions are placed in its own coordinate system.
      const global=this.annotations,local=new THREE.Group(),saved=this.p;
      this.annotations=local;this.p={...p,handedness:pose.mirrored?'right':'left'};this.makeSingleDimensions();this.p=saved;this.annotations=global;
      local.matrixAutoUpdate=false;local.matrix.makeTranslation(...pose.center).multiply(new THREE.Matrix4().makeRotationY(pose.angle*Math.PI/180)).multiply(new THREE.Matrix4().makeTranslation(-p.width/2000,0,0));global.add(local);
    }
    for(const warning of contextWarnings(p,c))if(warning.part){
      const part=this.parts.find(q=>q.id===warning.part)!,q=poses.find(q=>q.id===warning.instance)!;
      const box=new THREE.Box3(new THREE.Vector3(...part.min),new THREE.Vector3(...part.max)).applyMatrix4(q.matrix);
      this.annotations.add(new THREE.Box3Helper(box,'#bf4c32'));
    }
  }
  private makeGrid() {
    disposeGroup(this.grid,true);this.grid=new THREE.Group();this.scene.add(this.grid);if(!this.p)return;
    const p=this.p,w=p.width/1000,h=p.height/1000,d=p.depth/1000;
    if(this.context.mode==='bedroom')return;
    const grid=new THREE.GridHelper(2,80,'#cbd0c8','#e1e5de');
    if(this.view==='front'){grid.rotation.x=Math.PI/2;grid.position.set(w/2,h/2,-d/2-.02);}
    else if(this.view==='side'){grid.rotation.z=Math.PI/2;grid.position.set(w+.02,h/2,0);}
    else grid.position.set(w/2,-(this.dimensionMode==='off'?0:(p.topHeight-p.height)/1000)-.012,0);
    if(this.view==='closeup'||this.dimensionMode==='off')grid.visible=false;
    for(const mat of Array.isArray(grid.material)?grid.material:[grid.material]){mat.transparent=true;mat.opacity=.25;}this.grid.add(grid);
  }
  invalidate() {
    if(this.pending)return;document.body.dataset.ready='0';
    this.pending=requestAnimationFrame(()=>{this.pending=0;if(document.hidden)return;
      this.composer.render();
      for(const el of this.labels.domElement.querySelectorAll<HTMLElement>('.dim-label')){el.style.marginLeft='0';el.style.marginTop='0';}
      this.labels.render(this.scene,this.camera);
      const bounds=this.host.getBoundingClientRect(),placed:DOMRect[]=[];
      for(const overlay of this.host.parentElement?.querySelectorAll<HTMLElement>('.stage-heading,.scene-panel,.fullscreen-button,.view-switch,.canvas-controls,.selection,.canvas-note,.orientation,.scale,.orbit-help')||[]){const r=overlay.getBoundingClientRect();if(r.width&&r.height)placed.push(r);}
      for(const el of this.labels.domElement.querySelectorAll<HTMLElement>('.dim-label')){const r=el.getBoundingClientRect();const dx=Math.max(bounds.left+8-r.left,Math.min(0,bounds.right-8-r.right));const dy=Math.max(bounds.top+8-r.top,Math.min(0,bounds.bottom-8-r.bottom));el.style.marginLeft=`${dx}px`;el.style.marginTop=`${dy}px`;
        const original=el.getBoundingClientRect();let best=dy;
        for(let step=0;step<28;step++){const shift=step===0?0:(step%2?1:-1)*Math.ceil(step/2)*22;const top=original.top+shift,bottom=original.bottom+shift;if(top<bounds.top+8||bottom>bounds.bottom-8)continue;
          if(!placed.some(q=>original.left<q.right+5&&original.right>q.left-5&&top<q.bottom+4&&bottom>q.top-4)){best=dy+shift;break;}}
        el.style.marginTop=`${best}px`;placed.push(el.getBoundingClientRect());}
      this.frames++;
      if(this.camera instanceof THREE.OrthographicCamera){const pxPerMm=this.host.clientHeight/((this.camera.top-this.camera.bottom)/this.camera.zoom)/1000;
        this.scale.innerHTML=`<span style="width:${100*pxPerMm}px"></span><b>100 mm</b><small>${this.context.mode==='single'?'Grid 25 mm · ':''}${pxPerMm.toFixed(2)} px/mm</small>`;}
      else this.scale.innerHTML='<small>Perspectief · maten in mm</small>';
      document.body.dataset.ready='1';
    });
  }
  dispose() {cancelAnimationFrame(this.pending);this.resizeObserver.disconnect();this.controls.dispose();disposeGroup(this.model);disposeGroup(this.annotations,true);disposeGroup(this.fixtures,true);disposeGroup(this.grid,true);this.materials?.dispose();Object.values(this.maps).forEach(t=>t.dispose());this.env.dispose();this.composer.passes.forEach(p=>p.dispose());this.composer.dispose();this.renderer.dispose();}
}
