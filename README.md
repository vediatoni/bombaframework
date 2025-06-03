# BombaFramework

Framework for creating 3D HTML5 games. Uses ThreeJS for rendering, Cannon for physics and Howler for sound.

Work initially started on January 2020, but the scope was way too high, so I left this project alone since then. Maybe in the future, because the idea is still very interesting.

## Repository Overview

This project is an early experiment in building a small 3D game framework on top of Three.js and Cannon.js. The README summarizes the goal:

```
1  Framework for creating 3D HTML5 games.
2  Uses ThreeJS for rendering, Cannon for physics and Howler for sound.
4  Work initially started on January 2020, but the scope was way too high, so I left this project alone since then. Maybe in the future, because the idea is still very interesting.
```

### General Structure
```
├── app.js                  # Express server for static files
├── index.html              # Web page with pointer‑lock instructions
├── package.json            # NPM dependencies and "start" script
├── webpack.config.js       # Builds TypeScript into dist/main.js
├── src/
│   ├── main.ts             # Entry point that sets up a scene and game loop
│   └── ts/
│       ├── BombaFramework.ts
│       ├── Game.ts
│       ├── FIrstPerson/
│       ├── Lights/
│       ├── Meshes/
│       └── Scene.ts
└── dist/                   # Generated JavaScript bundle and source map
```

### Key Components

- **Server** – `app.js` launches an Express server on port 3000 and serves `index.html` plus the compiled scripts from `dist/`:
  ```
  1  const port = 3000; //Specify a port for our web server
  ...
  6  app.get('/',(req,res)=>{
  7      res.sendFile(path.join(__dirname, 'index.html'));
  ...
  15  app.use(express.static(path.join(__dirname,'dist')))
  ```

- **Entry Point** – `src/main.ts` creates a `Game`, a `Scene`, and a `FirstPersonCamera`. It starts the animation loop and updates the scene’s physics each frame:
  ```
  1  import * as BOMBA from './ts/BombaFramework'
  ...
  5  let game1: BOMBA.Game = new BOMBA.Game();
  6  let scene: BOMBA.Scene = new BOMBA.Scene(true);
  7  let firstPersonCamera: BOMBA.FirstPersonCamera = new BOMBA.FirstPersonCamera();
  ...
  13  function animate() {
  14      requestAnimationFrame(animate);
  16      scene.updatePhysics();
  18      game1.render(scene, firstPersonCamera);
  19      time = Date.now();
  }
  ...
  28  animate();
  ```

- **Game/Renderer** – `src/ts/Game.ts` wraps `THREE.WebGLRenderer` and exposes `render()`:
  ```
  5  export class Game {
  6      private _renderer: THREE.WebGLRenderer;
  ...
  11      constructor() {
  12          this._renderer = new THREE.WebGLRenderer();
  13          this._renderer.setSize(window.innerWidth, window.innerHeight);
  14          this._renderer.setPixelRatio( window.devicePixelRatio );
  ...
  26      public render(scene: Scene, camera: FirstPersonCamera) {
  27          this._renderer.render(scene.threeScene, camera.threeCamera);
  28      }
  }
  ```

- **Scene** – `src/ts/Scene.ts` combines a `THREE.Scene` with a Cannon.js `World`, adds meshes and cameras, and steps physics:
  ```
  13  constructor(basicScene: boolean, gravity = new CANNON.Vec3(0, -10, 0)) {
  14      this.threeScene = new THREE.Scene();
  15      this.threeScene.background = new THREE.Color(0xcccccc);
  16      this.cannonWorld = new CANNON.World();
  17      this.cannonWorld.gravity.set(gravity.x, gravity.y, gravity.z);
  ...
  27  public addMesh(mesh: Mesh, updatePhysics = true) {
  29      this.cannonWorld.addBody(mesh.body);
  30      this.threeScene.add(mesh.mesh);
  32      if (updatePhysics)
  33          this.meshes.push(mesh);
  ...
  45  public updatePhysics() {
  46      this.cannonWorld.step(1 / 60)
  47      this.meshes.forEach(el => { el.update(); })
  }
  ```

- **Meshes** – `src/ts/Meshes/Mesh.ts` is a base class connecting a `THREE.Mesh` and a Cannon body; subclasses like `Box` and `Plane` set up specific shapes.

- **First-Person Camera** – under `src/ts/FIrstPerson/` there is a simple `FirstPersonCamera` using Three’s `PointerLockControls` along with a physics body. An older, more elaborate implementation lives in `FIrstPerson/OLD/`.

- **Build Tooling** – `webpack.config.js` compiles `src/main.ts` to `dist/main.js` and uses `ts-loader` with the `tsconfig.json` settings.

### Things to Know

1. **TypeScript Compilation** – Only `src/main.ts` is listed in `tsconfig.json` for compilation. That file imports from the rest of `src/ts`, so building with `npm start` runs webpack and outputs `dist/main.js`.
2. **Incomplete Features** – Many modules are partial or placeholders (for example, the `Lights/` directory and the simplified `FirstPersonCamera`). The repository contains older experimental files, hinting that development was still exploratory.
3. **Case Sensitivity** – Note that the folder `FIrstPerson` is spelled with a capital "I." Some imports use `./FIrstPerson/...`, others `./FirstPerson/...`, which could cause issues on case-sensitive file systems.
4. **Example Scene** – When a `Scene` is constructed with `true`, `_createBasicScene()` adds a ground plane, a box, ambient light, and a point light. This demonstrates how to extend the framework with your own meshes and lighting.

### Next Steps / Learning Pointers
- **Explore Three.js and Cannon.js** – Understanding these libraries will clarify how rendering and physics are wired together. Three.js examples (especially pointer‑lock controls) will be helpful.
- **Study the Old PointerLockControls** – The `OLD` folder shows a custom implementation of movement and jumping. Reviewing it could inspire enhancements to the current `FirstPersonCamera`.
- **Implement Lighting and Additional Meshes** – The `Lights/` directory is empty. Adding spotlights or physical lighting models would be a good exercise.
- **Expand the Scene System** – Consider how scenes might be loaded, unloaded, or transitioned. Adding textures, materials, or a more complex environment would showcase the framework.
- **Refine Build and TypeScript Config** – Only one entry file is currently compiled; adjusting `tsconfig.json` and webpack to handle multiple modules and to output smaller bundles may be useful.

This project is a compact starting point for experimenting with Three.js + Cannon.js integration. By stepping through `src/main.ts`, `Game.ts`, and `Scene.ts`, you can see how objects are added to the scene, rendered, and updated. Enhancing the first‑person controls or adding additional features would be logical areas to continue learning.

