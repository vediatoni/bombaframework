import * as BOMBA from './ts/BombaFramework'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

let time: number; 
let game1: BOMBA.Game = new BOMBA.Game();
let scene: BOMBA.Scene = new BOMBA.Scene(true);
let firstPersonCamera: BOMBA.FirstPersonCamera = new BOMBA.FirstPersonCamera();

//let controls: OrbitControls = new OrbitControls(firstPersonCamera.threeCamera,game1.renderer.domElement);

scene.addCamera(firstPersonCamera);

function animate() {
    requestAnimationFrame(animate);
    //firstPersonCamera.controls.update(Date.now() - time)
    scene.updatePhysics();
    //controls.update();
    game1.render(scene, firstPersonCamera);
    time = Date.now();
}

window.addEventListener('resize', () => {
    game1.resizeRenderer();
    firstPersonCamera.threeCamera.aspect = window.innerWidth / window.innerHeight;
    firstPersonCamera.threeCamera.updateProjectionMatrix();
}, false);

animate();