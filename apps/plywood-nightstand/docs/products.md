# Materialen en producten

De slaapkamerwand en de geschilderde plint gebruiken materiaalkleur `#8D3B35`, met respectievelijk matte en subtiele zijdeglans-afwerking. De oorspronkelijke plintvorm blijft behouden. Belichting en tonemapping veroorzaken natuurlijke verschillen in de weergegeven kleur.

De vloer gebruikt een lokale procedurele visgraattextuur met warmbruin getinte houtnerf uit de bestaande CC0-textuur. De planken zijn ongeveer 600 × 100 mm, met circa 1 mm naden. De textuur beslaat het hele vloermodel zodat er geen zichtbare herhaalnaden zijn. De bovenzijde blijft op vloerpeil 0 mm. De eenmalig opgebouwde textuurafbeelding wordt gedeeld; elke contextopbouw bezit en ruimt zijn eigen GPU-textures op.

## Bediening

**Toon producten** staat direct onder **Slaapkamer / Los kastje**, standaard uit. De toggle en producten verschijnen uitsluitend in Slaapkamer. De keuze blijft bewaard tijdens een bezoek aan Los kastje, en wordt opgeslagen als `room.showProducts` in URL, localStorage en de context van JSON/CSV-exports. Oude links krijgen `false`.

Aan- en uitzetten, wijzigen van kastmaten en aanpassen van de opstelling behouden de camera, pan, zoom en projectie. Expliciet **Pas in beeld** houdt rekening met de productvolumes. Producten staan los van de maakonderdelen en beïnvloeden aantallen, plaatoppervlak en zaagmaten niet.

## Vaste indeling op schaal

Afmetingen zijn B × D × H in millimeters. De waarden voor hoes, kop, zakdoekpakje en spray zijn benaderingen.

| Kant | Product | Maten | Plaats |
| --- | --- | --- | --- |
| Links | Philips HF3519/01 | 199 × 146 × 192 | Bovenop, achteraan buitenzijde |
| Links | Blauwe Kobo-hoes | 116 × 164 × 14 | Tussenplank, vooraan open zijde |
| Links | Groene theekop met oor | 145 × 110 × 95 | Bovenop, vooraan bedzijde |
| Links | Klein zakdoekpakje | 105 × 55 × 25 | Tussenplank, achteraan tegenover Kobo |
| Links | Neusspray | 30 × 30 × 110 | Bovenop, vooraan buitenzijde |
| Rechts | Sonos One SL zwart | 119,7 × 119,7 × 161,45 | Bovenop, rechtsachter bij 0° |
| Rechts | Witte 2-in-1-lader | 162 × 75 × 8 | Bovenop, vooraan bedzijde |
| Rechts | Zwarte Kobo-hoes | 116 × 164 × 14 | Tussenplank, vooraan open zijde |

De lamp heeft een witte ronde behuizing, zacht lichtvlak en vast klokdisplay. Er is geen extra kamerlicht of animatie. De Sonos heeft een zwarte grille en bovenbediening. De kop is hol met thee en een oor. De lader ligt opengevouwen en plat met twee laadvlakken en een scharnier. De Kobo's hebben een gesloten hoes. Kabels, telefoon en horloge zijn niet toegevoegd.

De verankerde randen hebben 10 mm afstand tot de betreffende plankrand. Voorwerpen op het bovenblad houden bij 0° hun gekozen positie wanneer de open kanten wisselen. De spullen op de tussenplank volgen het werkelijke, eventueel gespiegelde steunvlak. Vervolgens draait de hele set mee met de kastrotatie. Productvormen en tekst worden niet gespiegeld.

Bij het huidige ontwerp 306 × 297 × 420 mm en bovenbladhoogte 650 mm staan bovenbladproducten op 650 mm en tussenplankproducten op 555 mm. Alle acht producten passen binnen de steunvlakken en hebben voldoende vrije hoogte.

## Ruimtewaarschuwingen

Producten behouden hun schaal en vaste randverankering bij kleinere kastmaten. Overhang, overlappende bezette volumes en onvoldoende hoogte worden gemeld en met een rood kader gemarkeerd. Er wordt 5 mm bruikbare speling boven producten op de tussenplank aangehouden; deze marge wordt in de melding vermeld. De volumetest gebruikt conservatieve rechthoekige productvolumes, inclusief het oor van de kop. Er vindt geen automatische herschaling of herindeling plaats.

## Bronnen

- [Philips HF3519/01](https://www.philips.nl/shop/NL_Energiedirect/gezondheid/oplossingen-voor-gezonde-slaap/smartsleep-wake-up-light/p/HF3519_01): buitenmaten en productvorm.
- [Sonos One SL](https://www.sonos.com/en-us/shop/one-sl-white?SL_360i=&gclsrc=aw.ds&pr_rd_page=35): buitenmaten, zwarte afwerking en grille.
- [FLIP 2-in-1-lader](https://www.promodirect-europe.com/promotional-items/office/rfid-and-new-technologies/1134032-2-in-1-foldable-charger-15w-flip-2-in-1-foldable-charging-station-in-abs-MO2445_06/): de opgegeven visuele referentie en maten. Het model is een benadering van deze vorm.
- [Kobo Clara BW-factsheet](https://kobo-blog.files.svdcdn.com/production/assets/KoboClaraBW_Factsheet_2024-07-23-160601_ikbw.pdf?dm=1721750761): apparaat 112 × 160 × 9,2 mm, aangevuld met geschatte hoesdikte.

## Verifiëren

```sh
npm test
npm run build
CAP_URL=http://127.0.0.1:5191 npm run test:products
```

De productbrowsercheck controleert de werkelijk gerenderde maten, materiaalkleuren en vloerhoogte, camerabehoud, rotaties en spiegeling, weergavecontext, opslag, export, waarschuwingen en resourcegebruik na 35 herhaalde opbouwen/toggles. Het rapport staat in `docs/products-verification.json`; de beelden staan als `products*.png` in `docs/screenshots`.
