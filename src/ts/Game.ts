import * as THREE from 'three'
import { FirstPersonCamera } from "./FIrstPerson/FirstPersonCamera"
import { Scene } from "./Scene"

export class Game {
    private _renderer: THREE.WebGLRenderer;
    public get renderer(): THREE.WebGLRenderer{
        return this._renderer;
    }

    constructor() {
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setPixelRatio( window.devicePixelRatio );

        this._renderer.shadowMapEnabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;

        document.body.appendChild(this._renderer.domElement);
    }

    public resizeRenderer() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public render(scene: Scene, camera: FirstPersonCamera) {
        this._renderer.render(scene.threeScene, camera.threeCamera);
    }
}