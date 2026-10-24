# Visuele en rekenkundige verificatie

Uitgevoerd op 24 oktober 2026. Screenshots zijn echte WebGL-renders uit de productiebuild, gemaakt met Playwright Chromium op 1440 × 1000 CSS-pixels. De gematchte vergelijking gebruikt 800 × 800.

## Iteraties en waarnemingen

| Controle | Eerste afwijking | Aanpassing / eindbeoordeling |
| --- | --- | --- |
| Perspectief | Te veel zicht op de rechterzijwand; de eerste handmatig ingestelde camera zat onder het bovenblad | Camera opnieuw ingeschat uit acht handmatig gekozen buitenhoeken van de productfoto. `camera-fit.json` bevat de pose en foutmaat. De top is nu zichtbaar en de buitencontour sluit dicht aan. |
| Plank 2 | De tekstinterpretatie overspande het smalle vak en gaf een te lange voorrand | Maze-plank verkort van 192 naar 152 mm, tot de binnenste staander. De bronfoto heeft die kortere voorrand. Een instelbare doorgetrokken variant blijft beschikbaar. |
| Materiaal | Licht hout was moeilijk te onderscheiden tegen een grijze, door tone mapping beïnvloede achtergrond | Achtergrond en lichtbalans aangepast; fineer blijft licht en mat. De kopse hoek toont de 13 afzonderlijke lagen, zonder de fineernerf dwars te draaien. |
| Maatlijnen | H-label viel over de zijwand; breedtelabel en vloerlabel raakten UI-controls | Hoogtelijn naar de buitenste achterhoek verplaatst, breedte- en vloerlabel verplaatst. Labels worden aan canvasranden begrensd en liggen onder de bediening. |
| Exploded | Bovenblad viel buiten beeld en keyhole-stippen bleven los zweven | Camerahoek en gezichtsveld passen zich aan de explosie aan. Schematische fixtures worden verborgen. Alle vijf onderdelen en hun labels zijn zichtbaar. |

De buitenhoek-fit heeft ongeveer 3,1 pixels RMS-residu op de handmatig gedigitaliseerde punten. Dit meet alleen aansluiting van die gekozen punten, geen volledige beeldgelijkenis en geen bewijs van exacte camerakalibratie. De oorspronkelijke foto heeft geen intrinsics of zij-/bovenaanzicht. Afgeleide binnenmaten blijven daarom onzeker.

## Screenshotbewijs

- [Editor](screenshots/editor.png) en [mobiel](screenshots/mobile.png).
- [Orthografisch voor](screenshots/front.png), [zij](screenshots/side.png) en [boven](screenshots/top.png), met mm-grid en maatlijnen.
- [Foto naast geschatte perspectiefcamera](screenshots/comparison.png) en [los perspectief](screenshots/perspective.png).
- [Multiplexhoek close-up](screenshots/closeup.png).
- [Exploded met naam en netto maat per onderdeel](screenshots/exploded.png).

De vergelijking gebruikt dezelfde 800 × 800 afbeelding zonder automatische uitsnede. Het origineel heeft eikenfineer en een witte achtergrond; het model gebruikt licht multiplex en een neutrale studio-achtergrond. De houtkleur en belichting zijn dus bewust verschillend. Het bovenaan open vak, de cantilever, de twee staanders en de bodemplank zijn herkenbaar gelijk in silhouet. De exacte achterkant en montage zijn niet visueel geverifieerd.

## Automatische controles

`npm run build` slaagt met TypeScript strict en zonder buildwaarschuwingen. `npm test` bevat 16 tests. Voor beide presets, 12/15/18 mm, 0/0,6/2 mm bevel, alle 27 combinaties van de buitenhoeken in de doorgetrokken variant, optionele platen en gemengde diktes worden bounding boxes gecontroleerd. Ook gecontroleerd: geen materiële volume-intersecties in de assemblage, netto oppervlak per dikte, echte tonglengte bij sponningen, lange verstekpunt, de open Maze-variant, de zichtbare bovenkant van een optionele achterwand, ongeldige invoer en de hoogteverhouding bij vloermontage.

Het browserrapport staat in [browser-verification.json](browser-verification.json): parameterinput, verbindingen, spiegelen, materiaal, nerf, downloaden, URL-herstel, werkelijke raycast-selectie, voetjes/hoogte, schermliniaal, mobiel zonder horizontale overflow, idle rendering en 35 herbouwacties. Het rapport bevat de werkelijke GPU-tellers voor en na de stressreeks. Geen oplopende geometrie- of texturetellers en geen console-errors in de uitgevoerde reeks. Dit is een afgebakende lektest, geen bewijs over alle denkbare sessies.

## Wat benaderd blijft

1. Plaatdikte, plankhoogte, vakbreedte en vakdiepte van het origineel zijn schattingen uit één foto; de onzekerheden staan in [measurements.md](measurements.md).
2. Het vlakfineer is white maple als visuele benadering voor berken. De 9/11/13 laagopbouw en lijmnaad zijn procedureel, geen productspecifieke opbouw.
3. Montage, keyholes, ophangregel en stelvoetjes zijn schematisch. De zaaglijst beschrijft de houten plaatdelen; passend beslag en voetjes moeten apart worden gekozen. Freesdetails, wandankers, toleranties en sterkte zijn nog te bepalen voor werkelijk bouwen.
4. Sponningen lopen door in de gedeelde diepte van alle planken en staanders. Verstek bij ongelijke diktes heeft een aangepaste snijhoek.
5. De exacte camera, achterkant en productiemethode van het origineel zijn onbekend. Er is geen plaatindeling of nesting gemaakt.

## Aanpassingen aan de beschikbare ruimte

Breedte is begrensd op 400 mm in de bediening, modelvalidatie en exports. Alle vijf hoofdplaten krijgen dezelfde Z-grenzen en diepte. Oude opgeslagen vakdieptes en verspringingen worden bij het herstellen genegeerd; overige ontwerpkeuzes blijven behouden. Maatwijzigingen hergebruiken de camera en OrbitControls, inclusief oriëntatie, pan, zoom en orthografische schaal. Alleen expliciete cameraknoppen en de exploded-bediening kaderen opnieuw.
