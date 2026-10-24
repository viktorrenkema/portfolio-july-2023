# F / Form

Deze app is onderdeel van het portfolio en wordt gepubliceerd op `/3js/bedroom-shelf`.
De buildkoppeling en browsercheck staan in de README van de portfolio-repository.

Een kleine, zelfstandige ontwerptool voor twee gespiegelde F-vormige nachtkastjes in berken multiplex, met een slaapkamer op schaal en een losse detailweergave. Vite + TypeScript + Three.js, zonder backend.

## Starten

Node.js 22.12 of nieuwer. Een `.nvmrc` is meegeleverd.

```sh
cd /Users/viktorrenkema/Documents/personal/repositories/my-utility-apps/plywood-nightstand
nvm use
npm install
npm run dev
```

Open <http://127.0.0.1:5190>. Bij een reeds bezette poort toont Vite de gekozen poort.

```sh
npm test
npm run build
npm run preview
```

## Ontwerpen

De standaardweergave toont het bed, hoofdbord, twee kastjes, plint en stopcontacten. Gebruik **Slaapkamer / Los kastje** boven het canvas en **Opstelling** voor open kanten, gekoppelde of afzonderlijke kwartslagrotatie en tussenruimte naast het hoofdbord. Zie [de slaapkamerdefinities en aannames](docs/bedroom.md). Muur en plint zijn roodbruin (`#8D3B35`); de vloer heeft een bruin houten visgraatpatroon. **Toon producten** voegt de vaste productindeling op schaal toe, uitsluitend in Slaapkamer. Zie [productmaten, indeling en aannames](docs/products.md).

- Kies **Maze origineel** (210 × 250 × 420 mm) of **Nachtkastje** (320 × 300 × 460 mm, bovenblad op 650 mm vanaf de vloer).
- Wijzig buitenmaten, plankhoogte, vak en bodemplank. De breedte heeft een harde bovengrens van **400 mm**. Alle planken en staanders volgen één gedeelde diepte; een afwijkende vakdiepte of verspringing is niet instelbaar. De Maze-preset heeft een bovenaan open smal vak; **Plank 2 doortrekken tot zijwand** maakt de variant uit de tekstbeschrijving. Overstek en vakbreedte zijn gekoppeld: B = overstek + binnenste staander + vrije vakbreedte + hoge zijwand.
- Kies bij Constructie links/rechts, wand/vloer, schematische keyholes of een ophangregel, voetjes en verbinding per hoek. Maatwijzigingen behouden de camera, pan en zoom; gebruik **Pas in beeld** om opnieuw te kaderen. Bij Materiaal zijn 12/15/18 mm, afwerking, afronding, dikte per onderdeel en nerfrichting instelbaar.
- Klik op een onderdeel voor naam, netto afmetingen, nerf en zichtbare kopse kanten. Kies Voor/Zij/Boven voor orthografische projectie met een 25 mm-grid en een actuele 100 mm-liniaal. Maten zijn in mm; de liniaal gebruikt CSS-pixels en is geen fysieke 1:1-printkalibratie.
- Gebruik Exploded om onderdelen uit elkaar te schuiven. Open **Onderdelenlijst** voor de tabel en JSON/CSV-downloads voor **Per kastje / Beide kastjes**, standaard beide. Contextobjecten tellen niet mee als onderdelen. Beide exports bevatten alle parameters, verbindingen, bewerkingen en het netto oppervlak per dikte. Er is geen plaatindeling of nesting.

Parameters worden alleen in localStorage bewaard. **Deel link** kopieert de schone app-URL, zonder je persoonlijke instellingen mee te sturen. Oude ontwerp-URLs worden nog ingelezen en daarna opgeschoond. Reset herstelt de Maze-preset. De app doet geen netwerkaanvragen naar een backend; textures en fonts worden lokaal meegeleverd.

## Maatdefinities en zaagmaten

De parameterinvoer en export gebruiken millimeters. `buildParts()` converteert direct naar meters; geometrie heeft +Y omhoog, meubelonderkant op y = 0 en voorzijde op +Z. Rechts spiegelen gebeurt rond het midden van de totale breedte.

`height` is de meubelhoogte. `topHeight` is de hoogte van de bovenzijde van het bovenblad boven de vloer. In de losse detailweergave ligt het vloerpeil bij wandmontage op `-(topHeight-height)`. De slaapkamer gebruikt één vloerpeil `y = 0` en plaatst de kast op `topHeight-height`. Bij vloermontage geldt `height = topHeight - footHeight` wanneer voetjes aan staan. De Nachtkastje-preset houdt bovenbladhoogte als leidende maat.

Een exportregel geeft de rechthoekige netto zaagblank vóór het frezen of afschuinen. Sponningtongen en de lange punten van verstekken tellen mee. Er is geen zaagverlies, afwerktolerantie, freesradius of sterkteberekening toegevoegd. De geometry heeft wel echte uitsparingen en diagonale aansluitvlakken.

Sponningen zijn halve ontvangende plaatdikte en lopen door in de diepte. Een doorlopende T-aansluiting ondersteunt stomp en sponning. Verstek is beschikbaar voor bovenblad/zijwand, beide bodemhoeken en plank 2/staander wanneer plank 2 niet doorloopt; bij gemengde plaatdiktes volgt de snede de binnenvlakken en is de hoek niet automatisch 45 graden. De bovenzijde van plank 2 blijft op `shelfHeight`.

De actuele zichtbare kopse kanten gelden voor het samengebouwde meubel. Gedeeltelijk bedekte kanten worden zo benoemd. Exploded laat ook normaal verlijmde aansluitvlakken zien.

## Referentie en onzekerheid

Zie [de maattabel](docs/measurements.md), [visuele beoordeling](docs/verification.md) en [referentieonderzoek](docs/reference-review.md). Alleen B/D/H en wandmontage zijn door productbronnen bevestigd. De overige oorspronkelijke maten zijn schattingen uit één productfoto. De geüploade tekst bevatte geen foto; de gebruikte productfoto is afkomstig van Finnish Design Shop, met Maze als productmaker.

Het origineel is eikenfineer. Dit project gebruikt een CC0 white-maple fineertextuur als visuele benadering van berken en procedurele multiplexlagen. Het is een aanpasbaar ontwerp, geen exacte reproductie of constructief goedgekeurd bouwplan.

## Visueel verifiëren

```sh
npx playwright install chromium
npm run dev
# In een tweede terminal, vanuit dit project:
npm run capture
npm run test:browser
npm run test:bedroom
npm run test:products
npm run capture:bedroom
```

Voorbeelden van de complete exports staan in [docs/examples](docs/examples); `npm run export:presets` vernieuwt deze.

`CAP_URL=http://127.0.0.1:5191 npm run capture` kan een productiepreview gebruiken. De scripts wachten op `window.__nightstand` en `body[data-ready="1"]`. Captures staan in [docs/screenshots](docs/screenshots). Het browserrapport staat in [docs/browser-verification.json](docs/browser-verification.json).

- `/capture.html?scene=single&view=front`, `view=side`, `view=top`: orthografische views met grid en maatlijnen.
- `/capture.html?scene=single&view=orbit&dimensions=off`: perspectief zonder maatlijnen.
- `/capture.html?scene=single&view=closeup&dimensions=off`: detail van de multiplexhoek.
- `/capture.html?scene=single&view=orbit&explode=0.9`: exploded view met namen en maten.
- `cam=x,y,z&look=x,y,z&fov=18`: camera in meters voor reproduceerbare fotovergelijking.

De vergelijking wordt gemaakt met Pillow, zonder de bronfoto of het model automatisch bij te snijden:

```sh
python3 -m venv .venv
.venv/bin/pip install Pillow
.venv/bin/python scripts/compare.py
```

`npm test` vergelijkt voor elk onderdeel de geometrische bounding box met de L/B/D van de zaagblank, bij 0/0,6/2 mm afronding. De tests controleren ook alle 27 combinaties van buitenhoeken op de doorgetrokken variant, sponningen op T-aansluitingen, materiaalintersecties, gemengde diktes, optionele onderdelen, oppervlak, de 400 mm-limiet, gekoppelde dieptes en invoervalidatie.

## Kleine codebasis

`src/context.ts` bevat de opstelling, botsingscontrole en export voor één of twee kastjes. `bedroom.ts` bouwt het bed en de kamerreferenties. `src/model.ts` bevat parameters, verbindingen, validatie en exports. `geometry.ts` maakt profielen, subtiel afgeronde hoeken en materiaalbatches per benoemd onderdeel. `materials.ts` laadt eerst de textures en maakt daarna fineer en procedurele kopse kanten. `viewer.ts` verzorgt AgX, PCF-schaduwen, GTAO, PMREM/RoomEnvironment, selectie, camera's en maatlijnen. `main.ts` verbindt de toegankelijke HTML-controls met het model.

Er draait geen permanente animatielus. Alleen input, camerawijziging en resize plannen een frame. Schaduwkaarten vernieuwen bij geometriewijzigingen. Geometrie, tijdelijke materialen en laagtextures worden bij een herbouw vrijgegeven; de vooraf geladen fineertextures blijven gedeeld.

## Licenties

De beperkte helpers zijn aangepast uit [wesbos/3d-model-anything](https://github.com/wesbos/3d-model-anything), commit `31b2dc9da3fb541e501f2f0936e55b32afb70ee8`. Zie [THIRD_PARTY_LICENSE](THIRD_PARTY_LICENSE). Geen RoomPlan, muren, scans, physics, workers of room-runtime zijn overgenomen.

De PBR-maps zijn CC0 van [Poly Haven white_maple_veneer](https://polyhaven.com/a/white_maple_veneer). De fonts worden geleverd met hun eigen OFL-licenties in de npm-pakketten. `docs/reference.jpg` is uitsluitend onderzoeksreferentie, geen CC0-asset en valt niet onder de MIT-codevoorwaarden. Zie [assetbronnen](docs/assets.md).
