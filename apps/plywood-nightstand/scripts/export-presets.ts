import { mkdirSync, writeFileSync } from 'node:fs';
import { clonePreset, csvDesign, exportDesign } from '../src/model';
import { defaultBedroom, exportProject, csvProject } from '../src/context';
const out=new URL('../docs/examples/',import.meta.url);mkdirSync(out,{recursive:true});
for(const name of ['maze','nightstand'] as const){const p=clonePreset(name);writeFileSync(new URL(name+'.json',out),JSON.stringify(exportDesign(p),null,2)+'\n');writeFileSync(new URL(name+'.csv',out),csvDesign(p));}

const design={...clonePreset('maze'),width:306,depth:297,topHeight:650};
for(const quantity of [1,2] as const){const room={...defaultBedroom(),exportQuantity:quantity},name=`bedroom-${quantity}`;writeFileSync(new URL(name+'.json',out),JSON.stringify(exportProject(design,room),null,2)+'\n');writeFileSync(new URL(name+'.csv',out),csvProject(design,room));}

const productsRoom={...defaultBedroom(),showProducts:true};
writeFileSync(new URL('bedroom-products.json',out),JSON.stringify(exportProject(design,productsRoom),null,2)+'\n');
writeFileSync(new URL('bedroom-products.csv',out),csvProject(design,productsRoom));
