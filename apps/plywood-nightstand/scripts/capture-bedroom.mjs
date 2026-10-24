import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const design={width:306,depth:297,height:420,topHeight:650},room={mode:'bedroom',opening:'inward',linkedRotation:true,leftRotation:0,rightRotation:0,gap:0,exportQuantity:2};
export async function captureBedroom(page,base){
 const out=new URL('../docs/screenshots/',import.meta.url).pathname;await mkdir(out,{recursive:true});
 const ready=()=>page.waitForFunction(()=>window.__nightstand&&document.body.dataset.ready==='1');
 const params=`design=${encodeURIComponent(JSON.stringify(design))}&room=${encodeURIComponent(JSON.stringify(room))}`;
 await page.setViewportSize({width:1440,height:1000});
 for(const [name,view,dimensions] of [['bedroom','orbit','main'],['bedroom-front','front','all'],['bedroom-top','top','all'],['bedroom-detail','closeup','off']]){
  await page.goto(`${base}/capture.html?${params}&view=${view}&dimensions=${dimensions}`);await ready();await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${out}${name}.png`});
 }
 await page.goto(`${base}/?${params}`);await ready();await page.getByRole('button',{name:'Opstelling',exact:true}).click();await page.screenshot({path:out+'bedroom-editor.png'});
 await page.setViewportSize({width:390,height:844});await page.locator('#fit').evaluate(el=>el.click());await ready();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:out+'bedroom-mobile.png',fullPage:true});
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const base=process.env.CAP_URL||'http://127.0.0.1:5190',browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const url=`${base}/?design=${encodeURIComponent(JSON.stringify(design))}&room=${encodeURIComponent(JSON.stringify(room))}`;
 await page.goto(url);await page.waitForFunction(()=>window.__nightstand&&document.body.dataset.ready==='1');
 await page.getByRole('button',{name:'Opstelling',exact:true}).click();await page.locator('#leftRotation').selectOption('90');await page.locator('[data-room="linkedRotation"]').uncheck();await expect(page.locator('#rightRotation')).toHaveValue('270');await page.locator('#rightRotation').selectOption('180');expect(await page.evaluate(()=>window.__nightstand.context.rightRotation)).toBe(180);await page.locator('[data-room="linkedRotation"]').check();
 const fitting=[];
 for(const size of [{width:1440,height:1000},{width:390,height:844}]){
  await page.setViewportSize(size);
  for(const depth of [297,500])for(const gap of [0,400])for(const view of ['orbit','front','top']){
   const result=await page.evaluate(({depth,gap,view})=>{const api=window.__nightstand,v=api.viewer;api.setParameters({depth});api.setContext({gap,leftRotation:90});v.setView(view);v.model.updateMatrixWorld(true);v.camera.updateMatrixWorld(true);let maxX=0,maxY=0;v.model.traverse(o=>{if(o.userData.part){const {min,max}=o.userData.part;for(const x of [min[0],max[0]])for(const y of [min[1],max[1]])for(const z of [min[2],max[2]]){const point=v.camera.position.clone().set(x,y,z).applyMatrix4(o.matrixWorld).project(v.camera);maxX=Math.max(maxX,Math.abs(point.x));maxY=Math.max(maxY,Math.abs(point.y));}}});return {maxX,maxY};},{depth,gap,view});
   expect(result.maxX).toBeLessThan(1);expect(result.maxY).toBeLessThan(1);fitting.push({...size,depth,gap,view,...result});
  }
 }
 await captureBedroom(page,base);await browser.close();await writeFile(new URL('../docs/bedroom-camera-fit.json',import.meta.url),JSON.stringify({errors,fitting},null,2));if(errors.length)throw new Error(errors.join('\n'));console.log(`Saved six bedroom views; ${fitting.length} desktop/mobile camera fits passed.`);
}
