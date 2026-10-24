# Referentieonderzoek en afbakening

De gevraagde GitHub-repository is gecloned in `/tmp/nightstand-3d-model-anything`, commit `31b2dc9da3fb541e501f2f0936e55b32afb70ee8`. Gelezen: README, scan-to-threejs SKILL en de vier references, alle room-runtime modules, knolling.ts, capture.ts, cap.sh, cmp.sh, fetch_textures.py, builtins-cabinetry.ts en _shelf-kit.ts.

Toegepast: meters, +Y, y = 0 op de onderkant; meter-UV's; convexe afgeronde dozen; materiaalbatches binnen benoemde onderdelen; guards voor niet-eindige vertices en nulnormalen; eerst textures laden; AgX + PCF + GTAO; RoomEnvironment/PMREM; alleen renderen na veranderingen; schaduwen op aanvraag; afvoeren van tijdelijke GPU-resources; orthografische vergelijking met ready-signaal.

De afzonderlijke panelen blijven benoemde groepen met `userData.part`; fineer en kopse kanten zijn elk een batch binnen die groep. Delen worden niet tot één globale batch samengevoegd, omdat selectie en exploded view individuele grenzen nodig hebben.

Afwijking in toepassing van de geometriehelper: stompe rechthoekige platen gebruiken de convexe bevelBox. Niet-convexe sponningprofielen en verstekken gebruiken ExtrudeGeometry met een naar binnen gerichte kleine afronding. Daarmee blijven de buitenmaten en de echte uitsparingen behouden. De bounding-box-tests controleren dit ook bij 2 mm.

Niet meegenomen: room registry/runtime, WallDef, kamer- of LiDAR-invoer, overlays, foto-pose infrastructuur, walk mode, Rapier, ruimteverlichtingbudgetten, parallelle workers of BRIEF-structuur. De app heeft vijf basisplaten, optioneel een achterwand en een schematische ophangregel.

Foto versus tekst: de daadwerkelijke voorrand van plank 2 is circa 152/210 van de bovenbladbreedte. De eerste tekstinterpretatie met 192 mm overspande het vak en week duidelijk af. Die afwijking is na inspectie van de vergelijking verholpen met een standaard open Maze-variant en een optioneel doorgetrokken plank. De verbinding plank/zijwand bestaat alleen in de doorgetrokken variant.
