# Slaapkamercontext

De slaapkamer is de standaardweergave. **Los kastje** behoudt de detailweergave; de Exploded-schuif schakelt hier automatisch naartoe. De tab **Opstelling** bestuurt de twee instanties. Alle afmetingen, verbindingen en materialen blijven één gedeeld kastontwerp.

## Schaal en plaatsing

De slaapkamer gebruikt meters intern, met vloerpeil `y = 0`. Elke kast staat op `y = (topHeight - height) / 1000`. De bedhoogtes zijn onafhankelijk van de kastmaten.

| Onderdeel | Onderkant / bovenkant in mm | Buitenmaten / uitvoering |
| --- | --- | --- |
| Bedpoten | 0 / 200 | Taps toelopend hout, visuele benadering |
| Boxspring | 200 / 400 | 1800 × 2000, twee beklede helften |
| Matras | 400 / 590 | 1800 × 2000, crèmegrijze stof |
| Topper | 590 / 700 | 1800 × 2000, wit hoeslaken |
| Hoofdbord | 0 / 1000 | 2000 × 50 dik, afgeronde bovenhoeken, verticale stikbanen |
| Plint | 0 / 110 | 18 dik, klein S-profiel in de bovenste 10 mm |
| Dubbel stopcontact | 130 / 210 | 151,8 breed, projectie 11,4 |

De bedhoogtes zijn gemeten door de gebruiker en gaan boven de producthoogte van 600 mm. Hoofdbordradius (200 mm), plintdikte (18 mm), stoffering, stikdiepte en pootvorm zijn benaderingen naar de aangeleverde foto. De fotoreferentie is het Emma Original Elite-bed met afgeronde, gestikte hoofdbordhoeken; geen decoratieve kamerobjecten zijn toegevoegd.

De socketbreedte en projectie volgen [Gira Standard 55 021201](https://katalog.gira.de//nl-NL/datenblatt/021201). De exacte serie is onbekend. De gemeten 80 mm hoogte wordt gebruikt in plaats van de 80,7 mm uit de productgegevens.

Het hoofdbord staat 18 mm vóór het wandvlak, met het bed direct vóór de voorzijde van het hoofdbord. Naast iedere buitenrand van het 2000 mm brede hoofdbord ligt een beschikbare zone van 400 mm. De instelbare tussenruimte wordt gemeten vanaf die buitenrand, standaard 0 mm. De stopcontacten blijven horizontaal en volgen het horizontale midden van elk kastje.

## Rotatie en spiegeling

Beide kastjes worden rond hun horizontale middelpunt geroteerd. Vervolgens ligt hun achterste begrenzing tegen het wandvlak. Bij 90° en 270° wisselen de breedte en diepte van de voetafdruk. De open kanten staan standaard naar het bed; **Naar buiten** wisselt de spiegeling.

Gekoppelde rotaties zijn gespiegeld: 0/0, 90/270, 180/180, 270/90. Ontkoppelen behoudt de huidige rechter rotatie; daarna is deze apart instelbaar. Een rode ruimtezone en tekstwaarschuwing tonen overschrijding van `tussenruimte + wandbreedte > 400 mm`. De ingevoerde kastmaten veranderen daarbij niet. De algemene meubelbreedte blijft onafhankelijk hard begrensd op 400 mm.

Overlapcontrole snijdt het werkelijke plaatprofiel met het obstakel in lokale kastcoördinaten, inclusief de diepte-overlap. Een open gedeelte van de F-vorm is geen botsing. Contextobjecten gebruiken begrenzingsvolumes; de afgeronde bedhoeken, kleine uitsparingen in het stopcontact en het decoratieve plintprofiel zijn daarbij benaderd. Rode kaders markeren de betrokken platen wanneer maatlijnen zichtbaar zijn.

Bij B306 × D297 × H420 en bovenbladhoogte 650 is de kastonderkant 230 mm, 20 mm boven het stopcontact. Het bovenblad ligt 50 mm onder de bedtop. Een negatieve verticale afstand wordt weergegeven, maar geldt alleen als botsing wanneer er ook plaatmateriaal overlapt.

## Camera, maatvoering en opslag

Met **Camera** kies je **Hele slaapkamer**, **Linker kastje** of **Rechter kastje** zonder de slaapkamer te verlaten. De aanzichten 3D, Voor, Zij, Boven en **Pas in beeld** gebruiken die focus. Sleep met de rechtermuisknop of met twee vingers om vrij te verschuiven; scroll of knijp om te zoomen. De camerafocus is een tijdelijke kijkinstelling en verandert het ontwerp niet.

Het compacte paneel links bevat de contextkeuze, producten, camerafocus en **Maten en labels**. Maten en labels staan standaard uit. De schakelaar en de matenkeuze onder het beeld bedienen dezelfde instelling. Weer inschakelen herstelt de gekozen hoofd- of detailmaten zonder de camera te verplaatsen.

**Volledig scherm** rechtsboven toont alleen het canvas, het compacte paneel, de aanzichten en de matenkeuze onderaan. De ontwerpinstellingen, titel, selectiekaart en overige overlays verdwijnen tijdelijk. Dezelfde knop of Escape sluit fullscreen; ontwerp en camera blijven behouden. Als de browser geen native fullscreen ondersteunt, vult het canvas het browservenster.

Maat-, spiegelings-, rotatie- en tussenruimtewijzigingen behouden positie, oriëntatie, pan, zoom en projectie van de camera. Een contextwissel, expliciete camera-aanzichtkeuze of **Pas in beeld** kadert opnieuw. De schaalweergave past zich aan orthografische zoom aan.

**Hoofdmaten** toont kasthoogte, bovenbladhoogte, bedtop, verticale stopcontactafstand en de beide 400 mm zones. **Alle maten** voegt bedlagen, bedlengte/breedte, hoofdbord, plint, stopcontacthoogtes en eventuele tussenruimte toe. Selecteer een kastje om daarbij de bestaande gedetailleerde kastmaten te tonen. Klikselectie en markering horen bij één instantie; wijzigingen blijven gedeeld.

Instellingen worden lokaal opgeslagen met `f-form-design` en `f-form-room`; de adresbalk blijft schoon. Oude URLs met `design`, `room` of `scene` worden nog ingelezen en daarna opgeschoond. Tijdelijk vertraagd opslaan wordt ook bij verlaten of verbergen van het document uitgevoerd. Capture-URLs behouden hun parameters voor reproduceerbare afbeeldingen. **Deel link** deelt alleen de app, niet de lokaal opgeslagen instellingen.

## Onderdelen en export

**Onderdelenlijst** bevat **Per kastje / Beide kastjes**, standaard beide. Het aantal en netto plaatoppervlak verdubbelen voor twee kastjes. Bed, hoofdbord, poten van het bed, plint en stopcontacten zijn uitsluitend context. De JSON- en CSV-export bevatten het gedeelde ontwerp, contextinstellingen, assemblageposities, spiegeling en rotatie. De export voor één kastje beschrijft de linker assemblage van de opstelling.

## Verificatie

```sh
npm test
npm run build
CAP_URL=http://127.0.0.1:5191 npm run test:browser
CAP_URL=http://127.0.0.1:5191 npm run test:bedroom
CAP_URL=http://127.0.0.1:5191 npm run capture:bedroom
```

De modeltests controleren de gemeten hoogtes, gecentreerde stopcontacten, alle kwartslagen bij gelijke en ongelijke breedte/diepte, spiegeling, onafhankelijke rotatie, botsingen met materiaal en vrije zones, migratie en aantallen/oppervlakken.

De slaapkamerbrowsercheck controleert bovendien de werkelijk gerenderde hoogtebegrenzingen, bediening, camerabehoud, selectie links/rechts, opslag, downloads, mobiel formaat, 35 herhaalde opbouwen en stilstaande renders. Het rapport staat in `docs/bedroom-verification.json`. Afbeeldingen `bedroom`, `bedroom-front`, `bedroom-top`, `bedroom-detail`, `bedroom-editor` en `bedroom-mobile` staan in `docs/screenshots`.

De camera-check in `docs/bedroom-camera-fit.json` controleert 24 combinaties van desktop/mobiel, diepte 297/500 mm, tussenruimte 0/400 mm en 3D/voor/boven. Ook buiten de beschikbare zone kadert **Pas in beeld** beide meubels. Het ontkoppelen van rotaties behoudt de getoonde rechter hoek.

De screenshots zijn visueel gecontroleerd: de afgeronde bovenhoeken en verticale stikbanen volgen de fotoreferentie, de bedlagen en houten poten behouden hun gemeten overgangen, en het detail toont beide contactdozen, de kastonderkant en het S-profiel van de plint. Stof en pootvorm blijven benaderingen.
