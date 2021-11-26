import * as THREE from 'three'
import * as CANNON from 'cannon'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

export class FirstPersonCamera {
    public threeCamera: THREE.PerspectiveCamera;
    public controls: PointerLockControls;
    public shape: CANNON.Shape
    public body: CANNON.Body


    private _playerSpeed: number;
    private _jumpForce: number;

    constructor(playerSpeed = 0.1, jumpForce = 100, radius = 1.3, mass = 5) {
        this.threeCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.threeCamera.position.set(0, 20, 100);

        this._playerSpeed = playerSpeed;
        this._jumpForce = jumpForce;

        this.shape = new CANNON.Sphere(radius);
        this.body = new CANNON.Body({ mass: mass });
        this.body.addShape(this.shape);
        this.body.position.set(15, 5, 0);

        this.controls = new PointerLockControls(this.threeCamera);
    }
}