# Assetbronnen

## Fineer

Poly Haven `white_maple_veneer`, CC0. Diffuse, OpenGL normal en roughness, 1K, in `public/textures`. Gekozen na inspectie van `texture-contact-sheet.png`: ambientCG Wood090A en Wood091A bleken samengestelde plankvloeren; white maple heeft een ononderbroken, licht en subtiel gevlamd fineeroppervlak.

Het is een visuele benadering van berken, geen botanisch correcte berkenfotografie. Materiaalkleur en roughness verzorgen de naturel/geolied-varianten. De normal strength is bewust laag.

Herhalen:

```sh
python scripts/fetch_textures.py sheet docs/texture-contact-sheet.png ambientcg:Wood090A ambientcg:Wood091A polyhaven:white_maple_veneer
python scripts/fetch_textures.py get public/textures birch=polyhaven:white_maple_veneer
```

Het script vereist Pillow en gebruikt curl voor downloads. Het is ongewijzigd overgenomen uit de MIT-geleverde referentierepository; de bijbehorende licentie is opgenomen.

## Kopse kanten

Procedurele CanvasTexture, 512 × 512. De buitenste lagen zijn 15% dikker en lichter dan de binnenlagen; alle gewichten worden op de daadwerkelijke plaatdikte genormaliseerd. Dunne lijmnaden van circa 0,07 mm, afwisselend lichte/donkere lagen. UV's gebruiken de fysieke plaatdikte, zodat het hele patroon precies één keer over 12/15/18 mm loopt. Nerfrichting roteert alleen het fineer, niet de lagen.

## Foto

`reference.jpg`: https://media.fds.fi/product_image/800/1Maze_2018_TH.jpg

Product Maze F-shelf Left oak, ontwerper Kent Johansson. De foto is een onderzoeksreferentie van Finnish Design Shop / Maze en is niet CC0 of MIT. Niet als eigen productfoto presenteren. De lokale vergelijking is geen toestemming tot publicatie van de bronfoto.

## Fonts

DM Sans Variable en IBM Plex Mono via `@fontsource-variable/dm-sans` en `@fontsource/ibm-plex-mono`, lokaal gebundeld, SIL Open Font License. Geen externe fontverzoeken bij gebruik.
