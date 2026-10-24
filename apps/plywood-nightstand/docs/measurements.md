# Maten en aannames

Alle tabelmaten in mm. Afgeleide waarden zijn interpretaties van één perspectieffoto en hebben geen metrologische precisie. De marges zijn inschattingen, geen statistische betrouwbaarheidsintervallen.

| Parameter | Maze-preset | Status | Onzekerheid / grondslag |
| --- | ---: | --- | --- |
| Breedte | 210 | Opgegeven | Productbron, geen productietolerantie bekend |
| Diepte | 250 | Opgegeven | Productbron, geen productietolerantie bekend |
| Hoogte | 420 | Opgegeven | Productbron, geen productietolerantie bekend |
| Plaatdikte | 18 | Afgeleid | Circa ±3, verhouding zichtbare randen / totale hoogte |
| Bovenzijde plank 2 | 325 | Afgeleid | Circa ±15, silhouet uit productfoto |
| Plank 2 breedte | 152 | Afgeleid / berekend | Circa ±13; tot buitenzijde binnenste staander, geen brug over vak |
| Vrije vakbreedte | 40 | Afgeleid | Circa ±10, verhouding tot zijwand en staander |
| Linker overstek | 134 | Berekend uit schattingen | Circa ±16; 210 - 18 - 40 - 18 |
| Vrije hoogte boven plank 2 | 77 | Berekend uit schattingen | Circa ±18; 420 - 18 - 325 |
| Vakdiepte | 250 | Gekoppeld aan totale diepte | Geen onafhankelijke ontwerpmaat; oorspronkelijk uit foto geschat |
| Staanderverspringing | 0 | Vast | Voor- en achterranden van alle planken en staanders liggen gelijk |
| Bodemplank | Aan | Afgeleid | Zichtbaar op productfoto; exact aansluitdetail onbekend |
| Achterkant vak | Open | Aangenomen | Niet bewezen met deze foto; als ontwerpoptie beschikbaar |
| Montage | Wand | Opgegeven | Product wordt als wall shelf / wandgemonteerd beschreven |
| Keyholes / ophangregel | Schematisch | Aangepast | Werkelijke constructie origineel onbekend |
| Bovenblad vanaf vloer | 650 | Aangepast | Ontwerpkeuze voor matras, geen originele productmaat |
| Afronding | 0,6 | Aangepast | Kleine highlight, geen originele productmaat |
| Plaatmateriaal | Berken multiplex | Aangepast | Origineel eikenfineer, drager niet uit foto vast te stellen |
| Lagen 12 / 15 / 18 mm | 9 / 11 / 13 | Benadering | Niet de opbouw van een specifieke leverancier |

## Nachtkastje-preset

B 320, D 300, meubelhoogte 460, bovenbladhoogte 650, plank 2 op 330, vakbreedte 85, vakdiepte 300, plaatdikte 18. Dit zijn aangepaste ontwerpkeuzes zonder claim op oorspronkelijke Maze-maten. Bij wandmontage is de vrije ruimte onder het meubel 190. Bij omschakelen naar vloermontage volgt de meubelhoogte uit bovenbladhoogte en voetjes.

## Bronnen

- [Architonic productpagina uit de opdracht](https://www.architonic.com/en/p/maze-graphic-or-f-shelf-left-oak-20243806): tijdens deze sessie niet toegankelijk via de onderzoeksbrowser.
- [Finnish Design Shop, F-shelf Left oak](https://www.finnishdesignshop.com/en-ax/product/f-shelf-left-oak): B 21, D 25, H 42 cm, eikenfineer, ontwerper Kent Johansson, wandmontage en zichtbare productfoto.
- [Maze productcatalogus, pagina 19](https://media.aski.se/2025/05/Aski-Maze.pdf): F-shelf Left, product 305118, wandgemonteerd; maatillustratie 21 × 25 × 42 cm. De leverancier host de catalogus van Maze.
- [Productfoto](https://media.fds.fi/product_image/800/1Maze_2018_TH.jpg): lokaal opgeslagen als `reference.jpg` voor vergelijking. De foto toont een aanzicht van rechtsvoor, iets van boven. Geen meegeleverde camera-intrinsics beschikbaar.

## Correctie na fotovergelijking

De beschrijving in de prompt veronderstelde dat plank 2 doorloopt tot de hoge zijwand. De zichtbare voorrand op de bronfoto eindigt echter boven de binnenste staander, ongeveer op x = 152 mm. Het smalle vak blijft bovenaan open. De Maze-preset volgt dit silhouet. De Nachtkastje-preset zet `bridgeShelf` aan en volgt daarmee de doorgetrokken variant uit de beschrijving; de gebruiker kan de schakelaar in beide presets wijzigen.

De beschikbare ruimte begrenst de totale breedte hard op 400 mm. Vakdiepte volgt de totale diepte en de staander kan niet onafhankelijk verspringen.
