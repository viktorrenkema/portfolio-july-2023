import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const base=process.env.CAP_URL||'http://127.0.0.1:5190';
const out=new URL('../docs/screenshots/',import.meta.url).pathname;
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
const ready=async()=>{await page.waitForFunction(()=>window.__nightstand && document.body.dataset.ready==='1');await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));};
await page.goto(base);await ready();await page.screenshot({path:out+'editor.png'});
for(const [name,query] of [['front','view=front'],['side','view=side'],['top','view=top'],['perspective','view=orbit&dimensions=off'],['closeup','view=closeup&dimensions=off'],['exploded','view=orbit&explode=0.9']]){
  await page.goto(`${base}/capture.html?scene=single&${query}`);await ready();await page.screenshot({path:out+name+'.png'});
}
await page.setViewportSize({width:800,height:800});
await page.goto(`${base}/capture.html?scene=single&view=orbit&dimensions=off&cam=1.147464,0.736610,3.803151&look=0.117451,0.204034,0&fov=7.002012`);await ready();await page.screenshot({path:out+'matched-perspective.png'});
await writeFile(out+'console-errors.json',JSON.stringify(errors,null,2));await browser.close();
if(errors.length)throw new Error(errors.join('\n'));
console.log('Saved editor, front, side, top, perspective, closeup, exploded. No console errors.');
