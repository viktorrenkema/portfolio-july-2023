import { chromium, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
process.chdir(new URL('../',import.meta.url).pathname);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const base=process.env.CAP_URL||'http://127.0.0.1:5190';
const legacy={width:306,depth:297,cubbyDepth:175,innerOffset:30};
await page.goto(`${base}/?scene=single&design=${encodeURIComponent(JSON.stringify(legacy))}`);await page.waitForFunction(()=>window.__nightstand && document.body.dataset.ready==='1');
expect(await page.evaluate(()=>window.__nightstand.export().parts.every(part=>part.width===297))).toBe(true);
expect(await page.locator('[data-key="cubbyDepth"]').count()).toBe(0);expect(await page.locator('[data-key="innerOffset"]').count()).toBe(0);
expect(await page.locator('#width-number').getAttribute('max')).toBe('400');expect(await page.locator('#width').getAttribute('max')).toBe('400');
await page.locator('#width-number').fill('400');expect(await page.evaluate(()=>window.__nightstand.parameters.width)).toBe(400);
await page.locator('#width-number').fill('401');expect(await page.evaluate(()=>window.__nightstand.parameters.width)).toBe(400);await expect(page.locator('#validation')).toContainText('400');
await page.locator('#width-number').fill('306');
const cameraSnapshot=()=>page.evaluate(()=>{const v=window.__nightstand.viewer,c=v.camera;return {position:c.position.toArray(),quaternion:c.quaternion.toArray(),target:v.controls.target.toArray(),zoom:c.zoom,projection:c.projectionMatrix.toArray()};});
const cameraChecks=[];
for(const view of ['orbit','front']){
  await page.locator(`[data-view="${view}"]`).click();
  await page.evaluate(()=>{const v=window.__nightstand.viewer;v.camera.position.add(v.camera.position.clone().set(.035,.02,0));v.controls.target.add(v.camera.position.clone().set(.012,-.015,0));v.camera.zoom=1.25;v.controls.update();v.camera.updateProjectionMatrix();v.invalidate();});
  const before=await cameraSnapshot();
  for(const [selector,value] of [['#depth-number','350'],['#depth-number','180'],['#width-number','320'],['#height-number','450'],['#topHeight-number','680'],['#shelfHeight-number','330']]){
    await page.locator(selector).fill(value);expect(await cameraSnapshot()).toEqual(before);
    expect(await page.evaluate(()=>{const api=window.__nightstand;return api.export().parts.every(part=>part.width===api.parameters.depth);})).toBe(true);
  }
  cameraChecks.push(view);
}
await page.locator('#reset').click();

await page.locator('#width-number').fill('300');await page.locator('#width-number').dispatchEvent('input');
await expect(page.locator('#model-summary')).toContainText('300');
await page.locator('[data-key="bridgeShelf"]').check();
await page.getByRole('button',{name:'Constructie',exact:true}).click();
await page.locator('[data-key="joint:topSide"]').selectOption('miter');
await page.locator('[data-key="joint:shelfSide"]').selectOption('rabbet');
await page.locator('[data-key="handedness"]').selectOption('right');
await page.getByRole('button',{name:'Materiaal',exact:true}).click();await page.locator('[data-key="thickness"]').selectOption('15');
await page.locator('[data-key="finish"]').selectOption('oiled');
await page.locator('summary').first().click();await page.locator('[data-key="grain:top"]').selectOption('width');
await page.waitForFunction(()=>document.body.dataset.ready==='1');
let exported=await page.evaluate(()=>window.__nightstand.export());
expect(exported.parameters.width).toBe(300);expect(exported.parameters.joints.topSide).toBe('miter');expect(exported.parameters.handedness).toBe('right');expect(exported.parts.find(p=>p.id==='shelf').length).toBe(292.5);
await page.getByRole('button',{name:'Onderdelenlijst'}).click();await expect(page.locator('#parts-dialog')).toBeVisible();
for(const format of ['json','csv']){const download=page.waitForEvent('download');await page.locator(`#download-${format}`).click();expect((await download).suggestedFilename()).toBe(`f-nachtkastje.${format}`);}
await page.locator('#parts-dialog [data-close]').click();
await page.reload();await page.waitForFunction(()=>window.__nightstand && document.body.dataset.ready==='1');expect(await page.evaluate(()=>window.__nightstand.parameters.width)).toBe(300);
await page.locator('[data-view="front"]').click();await page.locator('#dimensions').selectOption('all');await page.waitForFunction(()=>document.body.dataset.ready==='1');
const scale=await page.evaluate(()=>{const a=document.querySelector('#scale>span').getBoundingClientRect().width;const v=window.__nightstand.viewer;return {actual:a,expected:100*document.querySelector('#viewport').clientHeight/((v.camera.top-v.camera.bottom)/v.camera.zoom)/1000};});expect(Math.abs(scale.actual-scale.expected)).toBeLessThan(.1);
// Stress rebuilds after warmup, then compare actual GPU resource counters and idle frame count.
const resource=await page.evaluate(async()=>{
 const api=window.__nightstand;const settle=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 for(let i=0;i<5;i++){api.setParameters({width:300+i});await settle();}
 const before={...api.viewer.renderer.info.memory};
 for(let i=0;i<35;i++){api.setParameters({width:300+i%10});api.viewer.select(i%2?'top':undefined,false);await settle();}
 api.viewer.select(undefined,false);await settle();const after={...api.viewer.renderer.info.memory};const frames=api.viewer.frames;
 await new Promise(r=>setTimeout(r,300));return {before,after,idleFrames:api.viewer.frames-frames};
});expect(resource.after.geometries).toBeLessThanOrEqual(resource.before.geometries+2);expect(resource.after.textures).toBeLessThanOrEqual(resource.before.textures+1);expect(resource.idleFrames).toBe(0);
const point=await page.evaluate(()=>{const v=window.__nightstand.viewer,p=v.parts.find(p=>p.id==='side'),r=document.querySelector('#viewport').getBoundingClientRect();v.model.updateMatrixWorld(true);const q=v.camera.position.clone().set((p.min[0]+p.max[0])/2,(p.min[1]+p.max[1])/2,p.max[2]).applyMatrix4(v.model.matrixWorld).project(v.camera);return {x:r.left+(q.x+1)*r.width/2,y:r.top+(1-q.y)*r.height/2};});
await page.mouse.click(point.x,point.y);await expect(page.locator('#selection')).toContainText('Hoge zijwand');
await page.locator('#clear-selection').click();
await page.getByRole('button',{name:'Constructie',exact:true}).click();await page.locator('[data-key="mounting"]').selectOption('floor');await page.locator('[data-key="feet"]').check();
expect(await page.evaluate(()=>{const p=window.__nightstand.parameters;return p.height+p.footHeight===p.topHeight;})).toBe(true);
await page.locator('#reset').click();await page.locator('#dimensions').selectOption('main');
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/screenshots/mobile.png',fullPage:true});
expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
await writeFile('docs/browser-verification.json',JSON.stringify({errors,resource,scale,cameraChecks,checks:['400 mm maximum','legacy depth migration','linked panel depths','camera position, pan and zoom preservation','floor and foot height consistency','raycast part selection','parameter controls','joint-specific cut length','handedness','grain','finish','JSON/CSV download','URL restore','orthographic scale','35 rebuild resource stability','idle rendering','mobile overflow']},null,2));
await browser.close();if(errors.length)throw new Error(errors.join('\n'));console.log(JSON.stringify({resource,scale,errors}));
