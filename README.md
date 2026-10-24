This is a starter template for [Learn Next.js](https://nextjs.org/learn).

## 3D modeltool

De broncode van de multiplex nachtkastjes staat in `apps/plywood-nightstand`.
De tool wordt gepubliceerd op `/3d-modeling/self`. Ontwerpen blijven deelbaar via
de `design`- en `room`-parameters in de URL.

Gebruik Node.js 22. `yarn dev` en `yarn build` bouwen eerst de modeltool met Vite
naar `public/3d-modeling/self`. Deze uitvoer wordt automatisch gegenereerd en staat
niet in Git. `yarn build:model` bouwt alleen de modeltool.

Vercel publiceert de portfolio via de bestaande GitHub-koppeling met `main`.

Controleer de productiebuild lokaal met `yarn start -p 5192` en daarna
`yarn test:model-hosting`. De browsercheck controleert de modelroute, textures,
deelbare ontwerpen, camera, het compacte paneel, fullscreen, standaard verborgen
labels en de bestaande portfolio-homepage.
