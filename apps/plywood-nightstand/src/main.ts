import '@fontsource-variable/dm-sans';
import '@fontsource/ibm-plex-mono/400.css';
import './style.css';
import { Viewer, type View } from './viewer';
import { MAX_WIDTH_MM, restoreParameters, buildParts, clonePreset, overhang, thickness, validate, warnings, type Parameters, type Part, type PartId, type JointId } from './model';
import { defaultBedroom, restoreBedroom, exportProject, csvProject, contextWarnings, clearances, type BedroomSettings } from './context';
import { productWarnings } from './products';
const $=<T extends HTMLElement=HTMLElement>(s:string)=>document.querySelector<T>(s)!;
const capture=location.pathname.includes('capture');
const query=new URLSearchParams(location.search);
let room=defaultBedroom();
try {const raw=query.get('room')||(!capture?localStorage.getItem('f-form-room'):null);if(raw)room=restoreBedroom(JSON.parse(raw));}catch { /* Use context defaults for old links. */ }
if(query.get('scene')==='single'||query.get('scene')==='bedroom')room.mode=query.get('scene') as BedroomSettings['mode'];
let p=clonePreset('maze'),tab='dimensions',activePreset='maze';
try {
  const raw=query.get('design')||(!capture?localStorage.getItem('f-form-design'):null);
  if(raw){const saved=JSON.parse(raw);const candidate=restoreParameters(saved);if(!validate(candidate).length)p=candidate;}
} catch { /* An invalid saved design leaves the documented preset available. */ }
$('#app').innerHTML=`
<header class="app-header"><a class="brand" href="${import.meta.env.BASE_URL}" aria-label="F Form home"><strong>f<span>/</span></strong><span>FORM<span class="brand-note">Ontwerpen in multiplex</span></span></a><span class="project-title">F-nachtkastje <span>/</span> Ontwerpstudio</span><div class="header-actions"><span id="saved" role="status">Lokaal opgeslagen</span><button id="share" class="quiet">Deel ontwerp</button><button class="primary" id="parts-button">Onderdelenlijst <span>↗</span></button></div></header>
<main class="workspace"><section class="stage" aria-label="3D ontwerpcanvas"><div class="stage-heading"><div class="eyebrow">BERKEN MULTIPLEX / F-SERIE</div><h1>Een eigen F.</h1><p id="model-summary">210 × 250 × 420 mm</p></div>
<div class="scene-panel" role="group" aria-label="Weergave-instellingen">
<div class="context-switch" role="group" aria-label="Weergavecontext"><button data-context="bedroom">Slaapkamer</button><button data-context="single">Los kastje</button></div>
<label class="scene-row products-toggle" id="products-control"><span>Toon producten</span><input type="checkbox" id="show-products" role="switch" aria-label="Toon producten"></label>
<label class="scene-row camera-focus" id="camera-focus-control"><span>Camera</span><select id="camera-focus" aria-label="Camerafocus"><option value="room">Hele slaapkamer</option><option value="left">Linker kastje</option><option value="right">Rechter kastje</option></select></label>
<label class="scene-row dimensions-toggle"><span>Maten en labels</span><input id="show-dimensions" type="checkbox" role="switch" aria-label="Toon maten en labels"></label>
</div>
<button class="fullscreen-button" id="fullscreen" aria-label="Volledig scherm" aria-pressed="false" title="Volledig scherm"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4"/></svg></button>
<div class="view-switch" role="group" aria-label="Camera aanzicht"><button data-view="orbit" class="active">3D</button><button data-view="front">Voor</button><button data-view="side">Zij</button><button data-view="top">Boven</button></div>
<div id="viewport"><div class="loading" id="loading">Fineer en model laden...</div></div>
<div class="canvas-note"><span class="status-dot"></span><span id="part-count">5 onderdelen</span><span class="separator">/</span><span id="finish-note">18 mm naturel</span></div>
<div class="orientation" aria-hidden="true"><span class="axis-y">Y</span><span class="axis-x">X</span><span class="axis-z">Z</span><i></i></div>
<div id="selection" class="selection hidden" aria-live="polite"></div>
<div class="stage-bottom"><div class="scale" id="scale"></div><div class="canvas-controls"><label>Maten <select id="dimensions" aria-label="Maatlijnen"><option value="off">Verbergen</option><option value="main">Hoofdmaten</option><option value="all">Alle maten</option></select></label><span class="divider"></span><label class="explode-label">Exploded <input id="explode" type="range" min="0" max="1" step=".01" value="0" aria-label="Exploded view"></label><button id="fit" title="Camera passend maken">Pas in beeld</button></div><span class="orbit-help">Sleep: draaien · Rechtermuisknop / twee vingers: verschuiven · Scroll / knijp: zoom</span></div></section>
<aside class="sidebar"><div class="sidebar-title"><div><span class="eyebrow">JOUW ONTWERP</span><h2>Vorm & verhouding</h2></div><button id="reset" class="quiet" title="Herstel Maze preset">Reset</button></div><div class="presets"><button data-preset="maze" class="active"><span>Maze origineel</span><small>210 × 250 × 420</small></button><button data-preset="nightstand"><span>Nachtkastje</span><small>Op matrashoogte</small></button></div><nav class="tabs" aria-label="Ontwerpinstellingen"><button data-tab="context">Opstelling</button><button data-tab="dimensions" class="active">Afmetingen</button><button data-tab="construction">Constructie</button><button data-tab="material">Materiaal</button></nav><div id="controls" class="control-scroll"></div><div id="validation" role="alert"></div><div class="sidebar-footer"><span id="area">0,000 m²</span><span>Netto plaatoppervlak</span><button id="sources">Bronmaten & aannames ↗</button></div></aside></main>
<footer class="app-footer"><span>Alle maten in millimeters</span><span>Geïnspireerd op de Maze F-shelf van Kent Johansson</span><span>Netto zaagmaten · Geen plaatindeling</span></footer>
<dialog id="parts-dialog" aria-labelledby="parts-title"><div class="dialog-header"><div><span class="eyebrow">VAN ONTWERP NAAR WERKPLAATS</span><h2 id="parts-title">Onderdelenlijst</h2></div><button data-close aria-label="Sluiten">Sluiten ×</button></div><p class="dialog-note">Netto rechthoekige zaagblanks, inclusief tongen en lange verstekpunten. Bewerkingen staan per onderdeel vermeld.</p><label class="quantity-control">Onderdelen voor <select id="export-quantity"><option value="2">Beide kastjes</option><option value="1">Per kastje</option></select></label><div id="parts-content"></div><div class="dialog-actions"><button id="download-json">Download JSON</button><button id="download-csv" class="primary">Download CSV ↗</button></div></dialog>
<dialog id="sources-dialog" aria-labelledby="sources-title"><div class="dialog-header"><h2 id="sources-title">Bronmaten & aannames</h2><button data-close aria-label="Sluiten">Sluiten ×</button></div><p>Slaapkamer: bed 1800 × 2000 mm. Gemeten hoogtes: poten 0-200, boxspring 200-400, matras 400-590, topper 590-700 mm. Hoofdbord 2000 × 1000 × 50 mm; hoekradius circa 200 mm. Bekleding, stikbanen en pootvorm volgen de referentiefoto bij benadering.</p><p>Plint 110 mm hoog, dikte 18 mm geschat, klein S-profiel bovenaan. Horizontaal dubbel stopcontact: onderkant 130, bovenkant 210 mm. Breedte 151,8 en projectie 11,4 mm naar <a href="https://katalog.gira.de//nl-NL/datenblatt/021201" target="_blank" rel="noreferrer">Gira Standard 55</a>; exacte serie nog onbekend. Bedhoogtes zijn jouw metingen, boven de producthoogte.</p><p>Producten zijn context op ware schaal. Philips HF3519/01: 199 × 146 × 192 mm; Sonos One SL: 119,7 × 119,7 × 161,45 mm; lader: 162 × 75 × 8 mm. Kobo met hoes: circa 116 × 164 × 14 mm. Kop, zakdoekpakje en neusspray zijn generieke benaderingen. Er wordt 5 mm vrije ruimte boven spullen op de tussenplank aangehouden.</p><p>Losjes gebaseerd op de <a href="https://www.finnishdesignshop.com/en-ax/product/f-shelf-left-oak" target="_blank" rel="noreferrer">Maze F-shelf Left, oak</a>. Geen exacte reproductie of gevalideerd bouwplan.</p><table><thead><tr><th>Maat</th><th>Origineel</th><th>Status / onzekerheid</th></tr></thead><tbody><tr><td>B × D × H</td><td>210 × 250 × 420</td><td>Opgegeven, productbron</td></tr><tr><td>Plaatdikte</td><td>18</td><td>Afgeleid ±3 mm</td></tr><tr><td>Plank 2 bovenzijde</td><td>325</td><td>Afgeleid ±15 mm</td></tr><tr><td>Breedte plank 2</td><td>152</td><td>Afgeleid ±13 mm, tot staander</td></tr><tr><td>Vrije vakbreedte</td><td>40</td><td>Afgeleid ±10 mm</td></tr><tr><td>Overstek</td><td>134</td><td>Berekend uit schattingen, ±16 mm</td></tr><tr><td>Vakdiepte</td><td>250</td><td>Aangenomen, ±25 mm</td></tr><tr><td>Montage</td><td>Wand</td><td>Bevestigd door productbron</td></tr></tbody></table><p>Fineer is een CC0 white-maple textuur van Poly Haven, visueel gekozen als benadering voor licht berken. De lagen zijn procedureel: 9 / 11 / 13 lagen voor 12 / 15 / 18 mm. Ophanging, laagdiktes, lijmnaden en afronding zijn ontwerpkeuzes.</p><p>De Maze-foto toont plank 2 tot de binnenste staander, met het smalle vak open aan de bovenkant. De optie doortrekken verbindt plank 2 met de zijwand; deze staat aan in de Nachtkastje-preset. Een doorlopende T-aansluiting kan stomp of in een sponning; verstek is beschikbaar op buitenhoeken. Sponningen zijn doorlopend in de diepte. Constructieve sterkte, wandankers en toleranties zijn niet berekend.</p><p>De bovenbladhoogte is vanaf de vloer; meubelhoogte is van onderkant tot bovenkant. Bij wandmontage is het verschil de vrije ruimte onder het meubel. Bij vloermontage volgt de meubelhoogte de bovenbladhoogte minus eventuele voetjes.</p></dialog>`;
if(capture)document.body.classList.add('capture-mode');
const viewer=new Viewer($('#viewport'),$('#scale'));
let persistTimer:ReturnType<typeof setTimeout>;
const mm=(n:number)=>new Intl.NumberFormat('nl-NL',{maximumFractionDigits:1}).format(n);
let persistDirty=false;
function flushPersist() {
  if(!persistDirty)return;persistDirty=false;clearTimeout(persistTimer);
  const raw=JSON.stringify(p);try {localStorage.setItem('f-form-design',raw);localStorage.setItem('f-form-room',JSON.stringify(room));const url=new URL(location.href);url.searchParams.delete('scene');url.searchParams.set('design',raw);url.searchParams.set('room',JSON.stringify(room));history.replaceState(null,'',url);$('#saved').textContent='Lokaal opgeslagen';} catch {$('#saved').textContent='Opslaan niet beschikbaar';}
}
function persist() {persistDirty=true;clearTimeout(persistTimer);persistTimer=setTimeout(flushPersist,180);}
function update(next:Parameters,save=true) {
  const errors=validate(next);
  if(errors.length){$('#validation').textContent=errors[0];$('#validation').className='error';return false;}
  p=next;viewer.rebuild(p,room);
  $('#model-summary').textContent=`${mm(p.width)} × ${mm(p.depth)} × ${mm(p.height)} mm`;
  $('#part-count').textContent=`${room.mode==='bedroom'?'2 kastjes · ':''}${viewer.parts.length} onderdelen per kastje`;$('#finish-note').textContent=`${p.thickness} mm · ${p.finish==='natural'?'naturel':'geolied'}`;
  const data=exportProject(p,room),area=Object.values(data.areaByThickness).reduce((a,b)=>a+b,0);
  $('#area').textContent=`${area.toLocaleString('nl-NL',{minimumFractionDigits:3,maximumFractionDigits:3})} m²`;
  const warning=warnings(p),issues=room.mode==='bedroom'?[...contextWarnings(p,room),...productWarnings(p,room)]:[];$('#validation').textContent=[...new Set(issues.map(q=>q.message)),warning.find(w=>w.startsWith('Groot'))].filter(Boolean).join(' ');$('#validation').className='warning';
  syncControls();if(save)persist();if(viewer.selected)showSelection(viewer.parts.find(q=>q.id===viewer.selected));return true;
}
function syncControls() {
  $('#camera-focus-control').classList.toggle('hidden',room.mode!=='bedroom');
  $('#products-control').classList.toggle('hidden',room.mode!=='bedroom');$<HTMLInputElement>('#show-products').checked=room.showProducts;
  document.querySelectorAll('[data-context]').forEach(b=>b.classList.toggle('active',b.getAttribute('data-context')===room.mode));
  document.querySelectorAll<HTMLInputElement|HTMLSelectElement>('[data-room]').forEach(input=>{const key=input.dataset.room as keyof BedroomSettings,val=key==='rightRotation'&&room.linkedRotation?(360-room.leftRotation)%360:room[key];if(input instanceof HTMLInputElement&&input.type==='checkbox')input.checked=!!val;else input.value=String(val);if(key==='rightRotation')input.disabled=room.linkedRotation;});
  const clear=clearances(p),readout=document.querySelector('#clearances');if(readout)readout.textContent=`Kastonderkant: ${p.topHeight-p.height} mm. Vrij boven stopcontact: ${clear.outlet} mm. Bovenblad: ${Math.abs(clear.bedTop)} mm ${clear.bedTop>=0?'onder':'boven'} bedtop.`;
  $<HTMLSelectElement>('#export-quantity').value=String(room.exportQuantity);
  document.querySelectorAll<HTMLInputElement|HTMLSelectElement>('[data-key]').forEach(input=>{
    const key=input.dataset.key!;let val:unknown=key==='overhang'?overhang(p):key.startsWith('joint:')?p.joints[key.split(':')[1] as JointId]:key.startsWith('thickness:')?p.overrides[key.split(':')[1] as PartId]||0:key.startsWith('grain:')?p.grain[key.split(':')[1] as PartId]||'length':p[key as keyof Parameters];
    if(input instanceof HTMLInputElement && input.type==='checkbox')input.checked=!!val;else input.value=String(val);
    const output=input.closest('.field')?.querySelector('output');if(output)output.textContent=typeof val==='number'?mm(val):String(val);
  });
  document.querySelectorAll('[data-preset]').forEach(button=>button.classList.toggle('active',button.getAttribute('data-preset')===activePreset));
}
function range(key:string,label:string,min:number,max:number,step=1,note='') {return `<div class="field"><div class="field-heading"><label for="${key}">${label}</label><div class="number-wrap"><input id="${key}-number" aria-label="${label}, exact in mm" type="number" data-key="${key}" min="${min}" max="${max}" step="${step}"><span>mm</span></div></div><input id="${key}" aria-label="${label}" data-key="${key}" type="range" min="${min}" max="${max}" step="${step}">${note?`<p class="field-note">${note}</p>`:''}</div>`;}
function select(key:string,label:string,options:[string,string][],note='') {return `<div class="select-field"><label for="${key}">${label}</label><select id="${key}" data-key="${key}">${options.map(([value,text])=>`<option value="${value}">${text}</option>`).join('')}</select>${note?`<p class="field-note">${note}</p>`:''}</div>`;}
function check(key:string,label:string){return `<label class="check-field"><span>${label}</span><input type="checkbox" data-key="${key}" role="switch"></label>`;}
function renderControls() {
  if(tab==='context')$('#controls').innerHTML=`<div class="section-caption">Twee gedeelde ontwerpen</div><p class="field-note">Alle kastmaten gelden links en rechts. Per kant is er 400 mm ruimte naast de buitenrand van het hoofdbord.</p><div class="select-field"><label for="opening">Open kanten</label><select id="opening" data-room="opening"><option value="inward">Naar bed</option><option value="outward">Naar buiten</option></select><p class="field-note">Richting bij 0°. De rotatie wordt daarna toegepast.</p></div><label class="check-field"><span>Rotaties gespiegeld koppelen</span><input type="checkbox" role="switch" data-room="linkedRotation"></label>${(['leftRotation','rightRotation'] as const).map((key,i)=>`<div class="select-field"><label for="${key}">Rotatie ${i?'rechts':'links'}</label><select id="${key}" data-room="${key}">${[0,90,180,270].map(n=>`<option value="${n}">${n}°</option>`).join('')}</select></div>`).join('')}<div class="field"><div class="field-heading"><label for="room-gap">Tussenruimte naast hoofdbord</label><span>mm</span></div><input id="room-gap" aria-label="Tussenruimte naast hoofdbord" data-room="gap" type="number" min="0" max="400" step="1"></div><p class="field-note">Kwartslagrotatie gebruikt de diepte als wandbreedte. Een rode zone markeert te weinig ruimte of overlap.</p><div class="section-caption spaced">Hoogtes vanaf vloer</div><p class="field-note">Bedtop 700 mm · hoofdbord 1000 mm<br>Plint 0-110 mm · stopcontact 130-210 mm</p><p id="clearances" class="clearance-readout"></p><p class="field-note">Klik een kastje voor selectie. Alle maten toont extra contextmaten en detailmaten van het geselecteerde kastje.</p>`;
  else if(tab==='dimensions')$('#controls').innerHTML=`<div class="section-caption">Buitenmaten <span>mm</span></div>${range('width','Breedte',100,MAX_WIDTH_MM,1,'Maximaal 400 mm beschikbare ruimte.')}${range('depth','Diepte',100,500)}${range('height','Meubelhoogte',180,800)}${range('topHeight','Hoogte bovenblad',300,1000,1,'Vanaf de vloer, af te stemmen op je matras.')}<div class="section-caption spaced">Planken & vak</div>${range('shelfHeight','Hoogte plank 2',60,750)}${range('overhang',p.handedness==='left'?'Overstek links':'Overstek rechts',10,500,1,'Gekoppeld aan de vrije vakbreedte.')} ${range('cubbyWidth','Vrije vakbreedte',20,250)}<p class="field-note">Alle planken en staanders volgen dezelfde diepte.</p>${check('bridgeShelf','Plank 2 doortrekken tot zijwand')}${check('bottom','Bodemplankje')}${check('back','Vak aan achterzijde sluiten')}`;
  else if(tab==='construction')$('#controls').innerHTML=`<div class="section-caption">Plaatsing</div>${select('handedness','Uitvoering',[['left','Links · zijwand rechts'],['right','Rechts · zijwand links']],'Voor Los kastje. De slaapkamer gebruikt de spiegeling bij Opstelling.')}${select('mounting','Montage',[['wall','Wand · zwevend'],['floor','Vloer']])}${select('hardware','Wandbevestiging',[['keyhole','Keyhole · schematisch'],['cleat','Verborgen ophangregel']])}${check('wallReference','Wandplaat als referentie')}${check('feet','Stelvoetjes bij vloermontage')}${range('footHeight','Hoogte voetjes',5,50)}<div class="section-caption spaced">Verbindingen per hoek</div>${(['topSide','shelfSide','shelfInner','bottomSide','bottomInner'] as JointId[]).map((id,i)=>select(`joint:${id}`,['Bovenblad / zijwand','Plank 2 / zijwand','Plank 2 / staander','Bodem / zijwand','Bodem / staander'][i],[['butt','Stomp'],['rabbet','Sponning'],...((id==='shelfSide'||id==='shelfInner'&&p.bridgeShelf)?[]:[['miter','Verstek']] as [string,string][])])).join('')}<p class="field-note">Sponning: halve ontvangende plaatdikte, doorlopend in de diepte. Verstek: netto lange punt; bij verschillende diktes volgt de snede de twee binnenvlakken.</p><p class="field-note">Keyholes en ophangregel zijn schematisch. Freesdetails en wandankers nog bepalen.</p>`;
  else $('#controls').innerHTML=`<div class="section-caption">Berken multiplex</div>${select('thickness','Plaatdikte',[['12','12 mm · circa 9 lagen'],['15','15 mm · circa 11 lagen'],['18','18 mm · circa 13 lagen']])}${select('finish','Afwerking',[['natural','Naturel · licht en mat'],['oiled','Geolied · warmer en dieper']])}${range('bevel','Afronding randen',0,2,.1)}<div class="material-sample"><i></i><div>Fineer & laagopbouw<small>Vlakke nerf, gelaagde kopse kant</small></div></div><div class="section-caption spaced">Per onderdeel</div>${viewer.parts.filter(q=>q.id!=='cleat').map(part=>`<details class="part-settings"><summary>${part.name}</summary>${select(`thickness:${part.id}`,'Plaatdikte',[['0','Volg globale dikte'],['12','12 mm'],['15','15 mm'],['18','18 mm']])}${select(`grain:${part.id}`,'Nerfrichting',[['length','Langs de lengte'],['width','Langs de breedte']])}</details>`).join('')}<p class="field-note">Vlaktextuur: CC0 white maple, gekozen als visuele benadering voor licht berken.</p>`;
  syncControls();
  const shelfSide=document.querySelector<HTMLSelectElement>('[data-key="joint:shelfSide"]');if(shelfSide){shelfSide.disabled=!p.bridgeShelf;if(!p.bridgeShelf)shelfSide.closest('.select-field')?.insertAdjacentHTML('beforeend','<p class="field-note">Geen aansluiting zolang plank 2 niet wordt doorgetrokken.</p>');}
}
$('#controls').addEventListener('input',event=>{
  const input=event.target as HTMLInputElement;
  if(input.dataset.room){const key=input.dataset.room,value=input.type==='checkbox'?input.checked:['gap','leftRotation','rightRotation'].includes(key)?Number(input.value):input.value;if(input.value==='')return;changeContext({[key]:value});return;}
  if(!input.dataset.key)return;
  if(input.type==='number' && input.value==='')return;
  let next=structuredClone(p);const key=input.dataset.key;
  const value=input.type==='checkbox'?input.checked:(input instanceof HTMLInputElement && ['range','number'].includes(input.type))||key==='thickness'||key.startsWith('thickness:')?Number(input.value):input.value;
  if(key.startsWith('joint:'))next.joints[key.split(':')[1] as JointId]=value as Parameters['joints']['topSide'];
  else if(key.startsWith('thickness:')){const id=key.split(':')[1] as PartId;if(Number(value))next.overrides[id]=Number(value);else delete next.overrides[id];}
  else if(key.startsWith('grain:'))next.grain[key.split(':')[1] as PartId]=value as 'length'|'width';
  else if(key==='overhang')next.cubbyWidth=next.width-thickness(next,'side')-thickness(next,'inner')-Number(value);
  else (next as unknown as Record<string,unknown>)[key]=value;
  if(key==='height') {next.shelfHeight=Math.min(next.shelfHeight,next.height-thickness(next,'top')-26);next.topHeight=Math.max(next.topHeight,next.height);}
  if(key==='mounting' && next.mounting==='floor')next.height=next.topHeight-(next.feet?next.footHeight:0);
  if(next.mounting==='floor' && ['topHeight','feet','footHeight'].includes(key))next.height=next.topHeight-(next.feet?next.footHeight:0);
  if(next.mounting==='floor' && key==='height')next.topHeight=next.height+(next.feet?next.footHeight:0);
  if(key==='bridgeShelf' && next.bridgeShelf && next.joints.shelfInner==='miter')next.joints.shelfInner='butt';
  if(update(next)){activePreset='';syncControls();if(key==='bridgeShelf')renderControls();}else if(input.type!=='number')syncControls();
});
function showSelection(part?:Part) {
  const el=$('#selection');el.classList.toggle('hidden',!part);if(!part)return;
  el.innerHTML=`<button id="clear-selection" aria-label="Selectie sluiten">×</button><span class="eyebrow">${viewer.selectedInstance==='left'?'LINKS':viewer.selectedInstance==='right'?'RECHTS':'LOS KASTJE'} / ${part.id.toUpperCase()}</span><h3>${part.name}</h3><strong>${mm(part.length*1000)} × ${mm(part.width*1000)} × ${mm(part.thickness*1000)} <small>mm</small></strong><p>Nerf: ${part.grain==='length'?'langs de lengte':'langs de breedte'}<br>Kopse kanten: ${part.exposedEdges.join(', ')||'verborgen'}</p>`;
  $('#clear-selection').onclick=()=>viewer.select();
}
viewer.onSelect=showSelection;
$('#camera-focus').onchange=()=>viewer.setCameraFocus($<HTMLSelectElement>('#camera-focus').value as 'room'|'left'|'right');
$('#show-products').onchange=()=>changeContext({showProducts:$<HTMLInputElement>('#show-products').checked});
function changeContext(patch:Partial<BedroomSettings>){if(patch.linkedRotation===false&&room.linkedRotation)patch={rightRotation:((360-room.leftRotation)%360) as BedroomSettings['rightRotation'],...patch};const previous=room.mode;room=restoreBedroom({...room,...patch});if(room.mode==='bedroom'){viewer.explosion=0;$<HTMLInputElement>('#explode').value='0';}update(p);if(previous!==room.mode)viewer.setView(viewer.view);}
document.querySelectorAll<HTMLButtonElement>('[data-context]').forEach(b=>b.onclick=()=>changeContext({mode:b.dataset.context as BedroomSettings['mode']}));
document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-view]').forEach(q=>q.classList.remove('active'));b.classList.add('active');viewer.setView(b.dataset.view as View);});
document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab!;document.querySelectorAll('[data-tab]').forEach(q=>q.classList.remove('active'));b.classList.add('active');renderControls();});
function preset(id:'maze'|'nightstand'){activePreset=id;update(clonePreset(id));renderControls();}
document.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach(b=>b.onclick=()=>preset(b.dataset.preset as 'maze'|'nightstand'));
$('#reset').onclick=()=>preset('maze');$('#fit').onclick=()=>viewer.setView(viewer.view);
let lastDimensions='main';
function changeDimensions(mode:string){if(mode!=='off')lastDimensions=mode;$<HTMLSelectElement>('#dimensions').value=mode;$<HTMLInputElement>('#show-dimensions').checked=mode!=='off';viewer.setDimensions(mode);}
$('#dimensions').onchange=()=>changeDimensions($<HTMLSelectElement>('#dimensions').value);
$('#show-dimensions').onchange=()=>changeDimensions($<HTMLInputElement>('#show-dimensions').checked?lastDimensions:'off');
const stage=$('.stage'),fullscreenButton=$<HTMLButtonElement>('#fullscreen');
let expanded=false;
function showExpanded(value:boolean){expanded=value;document.body.classList.toggle('viewer-fullscreen',value);fullscreenButton.setAttribute('aria-pressed',String(value));fullscreenButton.setAttribute('aria-label',value?'Volledig scherm sluiten':'Volledig scherm');fullscreenButton.title=value?'Volledig scherm sluiten (Esc)':'Volledig scherm';fullscreenButton.querySelector('path')!.setAttribute('d',value?'M3 7h4V3m6 0v4h4M7 17v-4H3m14 0h-4v4':'M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4');viewer.invalidate();}
async function toggleFullscreen(){fullscreenButton.disabled=true;try{if(expanded){if(document.fullscreenElement===stage)await document.exitFullscreen();showExpanded(false);fullscreenButton.focus();}else{showExpanded(true);try{await stage.requestFullscreen?.();}catch{/* Keep the expanded canvas when native fullscreen is unavailable. */}}}finally{fullscreenButton.disabled=false;fullscreenButton.focus();}}
fullscreenButton.onclick=()=>void toggleFullscreen();
document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement===stage)showExpanded(true);else if(expanded){showExpanded(false);fullscreenButton.focus();}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&expanded){event.preventDefault();void toggleFullscreen();}});
$('#explode').oninput=()=>{const value=Number($<HTMLInputElement>('#explode').value);if(value&&room.mode==='bedroom')changeContext({mode:'single'});viewer.setExplosion(value);};
$('#share').onclick=async()=>{try{const url=new URL(location.href);url.searchParams.delete('scene');url.searchParams.set('design',JSON.stringify(p));url.searchParams.set('room',JSON.stringify(room));await navigator.clipboard.writeText(url.href);$('#share').textContent='Link gekopieerd';setTimeout(()=>$('#share').textContent='Deel ontwerp',2000);}catch{$('#saved').textContent='Kopieer de URL uit de adresbalk';}};
$('#sources').onclick=()=>$<HTMLDialogElement>('#sources-dialog').showModal();
document.querySelectorAll<HTMLButtonElement>('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog')!.close());
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function showParts(){
  const data=exportProject(p,room);$('#parts-content').innerHTML=`<div class="table-scroll"><table><thead><tr><th>Onderdeel</th><th>Aantal</th><th>L × B × D (mm)</th><th>Nerf</th><th>Verbindingen / bewerking</th></tr></thead><tbody>${data.parts.map(part=>`<tr><td><strong>${part.name}</strong><small>${part.exposedEdges.join(', ')}</small></td><td>${part.quantity}</td><td class="mono">${mm(part.length)} × ${mm(part.width)} × ${mm(part.thickness)}</td><td>${part.grain==='length'?'Lengte':'Breedte'}</td><td>${part.connections.map(c=>`${c.part}: ${c.joint==='butt'?'stomp':c.joint==='rabbet'?'sponning':'verstek'}`).join('<br>')}<small>${part.machining.join('; ')}</small></td></tr>`).join('')}</tbody></table></div><div class="area-summary">${Object.entries(data.areaByThickness).map(([t,a])=>`<span><strong>${t} mm</strong> ${a.toLocaleString('nl-NL',{maximumFractionDigits:4})} m²</span>`).join('')}</div><p class="dialog-note">Parameters worden volledig in beide exports opgenomen. Geen zaagverlies of bewerkingstolerantie inbegrepen. Controleer wandbevestiging en stabiliteit voor productie.</p>`;
  if(!$<HTMLDialogElement>('#parts-dialog').open)$<HTMLDialogElement>('#parts-dialog').showModal();
}
$('#parts-button').onclick=showParts;
$('#export-quantity').onchange=()=>{room.exportQuantity=Number($<HTMLSelectElement>('#export-quantity').value) as 1|2;update(p);showParts();};
function download(filename:string,text:string,type:string){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#download-json').onclick=()=>download('f-nachtkastje.json',JSON.stringify(exportProject(p,room),null,2),'application/json');
$('#download-csv').onclick=()=>download('f-nachtkastje.csv',csvProject(p,room),'text/csv;charset=utf-8');
try {
  await viewer.init(p,room);$('#loading').remove();update(p,!capture);renderControls();
  if(capture){viewer.dimensionMode=query.get('dimensions')||'all';viewer.setView((query.get('view')||'front') as View);if(query.has('explode')){viewer.setExplosion(Number(query.get('explode')));viewer.setView(viewer.view);}
    if(query.has('cam')){const values=query.get('cam')!.split(',').map(Number),target=(query.get('look')||'0.105,0.21,0').split(',').map(Number);if(values.length===3&&target.length===3&&[...values,...target].every(Number.isFinite)){viewer.camera.position.set(values[0],values[1],values[2]);viewer.controls.target.set(target[0],target[1],target[2]);if('fov' in viewer.camera)viewer.camera.fov=Number(query.get('fov')||18);viewer.camera.updateProjectionMatrix();viewer.controls.update();viewer.invalidate();}}
  }
  Object.assign(window,{__nightstand:{viewer,get parameters(){return p;},get context(){return room;},setContext:changeContext,setParameters:(patch:Partial<Parameters>)=>update({...structuredClone(p),...patch},false),export:()=>exportProject(p,room),csv:()=>csvProject(p,room),buildParts}});
} catch(error) {$('#loading').textContent=`Model laden mislukt: ${error instanceof Error?error.message:String(error)}. Herlaad de pagina.`;console.error(error);}
window.addEventListener('beforeunload',flushPersist);
document.addEventListener('visibilitychange',()=>{if(document.hidden)flushPersist();});
window.addEventListener('pagehide',()=>{flushPersist();viewer.dispose();});
