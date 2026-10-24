import { chromium, expect } from '@playwright/test';
import { captureBedroom } from './capture-bedroom.mjs';
import { writeFile } from 'node:fs/promises';
process.chdir(new URL('../',import.meta.url).pathname);
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const base=process.env.CAP_URL||'http://127.0.0.1:5190',design={width:306,depth:297,height:420,topHeight:650};
const ready=()=>page.waitForFunction(()=>window.__nightstand&&document.body.dataset.ready==='1');
await page.goto(`${base}/?design=${encodeURIComponent(JSON.stringify(design))}`);await ready();
expect(await page.evaluate(()=>window.__nightstand.context.mode)).toBe('bedroom');
expect(await page.evaluate(()=>window.__nightstand.viewer.model.children.length)).toBe(2);
expect(await page.evaluate(()=>window.__nightstand.export().parts.every(p=>p.quantity===2))).toBe(true);
const elevations=await page.evaluate(()=>{const v=window.__nightstand.viewer,result={};v.fixtures.updateMatrixWorld(true);v.fixtures.traverse(o=>{if(o.isMesh&&/^(Boxspring|Matras|Topper|Houten bedpoot|Hoofdbord|Houten plint)/.test(o.name)){o.geometry.computeBoundingBox();const box=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);result[o.name]=[box.min.y,box.max.y];}if(o.userData.context?.kind==='outlet'){const q=o.children[0];q.geometry.computeBoundingBox();const box=q.geometry.boundingBox.clone().applyMatrix4(q.matrixWorld);result[o.name]=[box.min.y,box.max.y];}});return result;});
for(const [name,range] of Object.entries(elevations)){const expected=name.startsWith('Boxspring')?[.2,.4]:name.startsWith('Matras')?[.4,.59]:name.startsWith('Topper')?[.59,.7]:name.startsWith('Houten bedpoot')?[0,.2]:name.startsWith('Hoofdbord')?[0,1]:name.startsWith('Houten plint')?[0,.11]:[.13,.21];expect(range[0]).toBeCloseTo(expected[0],6);expect(range[1]).toBeCloseTo(expected[1],6);}
await page.getByRole('button',{name:'Opstelling',exact:true}).click();await expect(page.locator('#clearances')).toContainText('20 mm');await expect(page.locator('#clearances')).toContainText('50 mm');
const snapshot=()=>page.evaluate(()=>{const {camera:c,controls}=window.__nightstand.viewer;return {position:c.position.toArray(),quaternion:c.quaternion.toArray(),target:controls.target.toArray(),zoom:c.zoom,projection:c.projectionMatrix.toArray()};});
for(const view of ['orbit','front']){
 await page.locator(`[data-view="${view}"]`).click();
 await page.evaluate(()=>{const {camera:c,controls}=window.__nightstand.viewer;c.zoom=1.12;c.position.x+=.08;controls.target.x+=.04;controls.update();c.updateProjectionMatrix();});const before=await snapshot();
 await page.locator('#leftRotation').selectOption('90');expect(await snapshot()).toEqual(before);await expect(page.locator('#rightRotation')).toHaveValue('270');await expect(page.locator('#rightRotation')).toBeDisabled();
 await page.locator('[data-room="linkedRotation"]').uncheck();await expect(page.locator('#rightRotation')).toHaveValue('270');await page.locator('#rightRotation').selectOption('180');expect(await snapshot()).toEqual(before);
 await page.locator('#opening').selectOption('outward');expect(await snapshot()).toEqual(before);
 await page.locator('#room-gap').fill('30');expect(await snapshot()).toEqual(before);
 await page.evaluate(()=>window.__nightstand.setParameters({depth:450}));expect(await snapshot()).toEqual(before);await expect(page.locator('#validation')).toContainText('400 mm');
 await page.evaluate(()=>window.__nightstand.setParameters({depth:297}));
 await page.locator('[data-room="linkedRotation"]').check();await page.locator('#leftRotation').selectOption('0');await page.locator('#opening').selectOption('inward');await page.locator('#room-gap').fill('0');
}
console.log('Room controls and camera preservation passed.');
const dimensionCamera=await snapshot();await page.locator('#dimensions').selectOption('all');expect(await snapshot()).toEqual(dimensionCamera);await page.locator('#dimensions').selectOption('main');expect(await snapshot()).toEqual(dimensionCamera);
// Select the same part independently in each cabinet through the actual raycaster.
await page.locator('#fit').click();
for(const id of ['left','right']){
 const point=await page.evaluate(id=>{const v=window.__nightstand.viewer,part=v.parts.find(q=>q.id==='side'),assembly=v.model.children.find(q=>q.name===id),r=v.host.getBoundingClientRect();v.model.updateMatrixWorld(true);const q=v.camera.position.clone().set((part.min[0]+part.max[0])/2,(part.min[1]+part.max[1])/2,part.max[2]).applyMatrix4(assembly.matrixWorld).project(v.camera);return {x:r.left+(q.x+1)*r.width/2,y:r.top+(1-q.y)*r.height/2};},id);
 await page.mouse.click(point.x,point.y);await expect(page.locator('#selection')).toContainText(id==='left'?'LINKS':'RECHTS');expect(await page.evaluate(()=>window.__nightstand.viewer.selectedInstance)).toBe(id);await page.locator('#clear-selection').click();
}
await page.locator('#leftRotation').selectOption('90');await page.locator('#room-gap').fill('25');await page.waitForFunction(()=>JSON.parse(new URLSearchParams(location.search).get('room')).gap===25);await page.reload();await ready();expect(await page.evaluate(()=>window.__nightstand.context.leftRotation)).toBe(90);expect(await page.evaluate(()=>window.__nightstand.parameters.width)).toBe(306);expect(await page.evaluate(()=>window.__nightstand.context.gap)).toBe(25);
await page.locator('#parts-button').click();await page.locator('#export-quantity').selectOption('1');const one=await page.evaluate(()=>window.__nightstand.export());await page.locator('#export-quantity').selectOption('2');const two=await page.evaluate(()=>window.__nightstand.export());expect(two.parts[0].quantity).toBe(one.parts[0].quantity*2);for(const t in one.areaByThickness)expect(two.areaByThickness[t]).toBe(one.areaByThickness[t]*2);
for(const format of ['json','csv']){const download=page.waitForEvent('download');await page.locator(`#download-${format}`).click();const file=await download;const content=await (await import('node:fs/promises')).readFile(await file.path(),'utf8');expect(content).toContain(format==='json'?'"assemblies"':'assemblages_json');}
await page.locator('#parts-dialog [data-close]').click();
console.log('Selection, persistence and exports passed.');
const resource=await page.evaluate(async()=>{const api=window.__nightstand,settle=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));for(let i=0;i<4;i++){api.setParameters({width:300+i});await settle();}const before={...api.viewer.renderer.info.memory};for(let i=0;i<35;i++){api.setParameters({width:300+i%10});api.setContext({leftRotation:[0,90,180,270][i%4]});await settle();}const after={...api.viewer.renderer.info.memory},frames=api.viewer.frames;await new Promise(r=>setTimeout(r,250));return {before,after,idleFrames:api.viewer.frames-frames};});
expect(resource.after.geometries).toBeLessThanOrEqual(resource.before.geometries+2);expect(resource.after.textures).toBeLessThanOrEqual(resource.before.textures+1);expect(resource.idleFrames).toBe(0);
console.log('Room resource stability passed:',JSON.stringify(resource));
await page.locator('[data-context="single"]').click();expect(await page.evaluate(()=>window.__nightstand.context.mode)).toBe('single');const explodedCamera=await snapshot();await page.locator('#explode').fill('0.8');expect(await snapshot()).toEqual(explodedCamera);expect(await page.evaluate(()=>window.__nightstand.viewer.explosion)).toBe(.8);await page.locator('[data-context="bedroom"]').click();expect(await page.locator('#explode').inputValue()).toBe('0');
await captureBedroom(page,base);
await writeFile('docs/bedroom-verification.json',JSON.stringify({errors,resource,checks:['default room and old design URL','mirrored linked rotation','independent right rotation','opening direction','gap and width warning','camera position, orientation, zoom, pan and projection preservation','raycast selection per cabinet','URL restore','one and two cabinet exports','JSON and CSV placement metadata','35 room rebuilds without resource growth','idle rendering','context switch and exploded view','mobile overflow','room perspective, orthographic front/top and socket/plinth detail captures']},null,2));
await browser.close();if(errors.length)throw new Error(errors.join('\n'));console.log(JSON.stringify({errors,resource}));
