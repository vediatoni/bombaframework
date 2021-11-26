import * as THREE from 'three'
import * as CANNON from 'cannon'
import { PointerLockControls } from './PointerLockControlsOLD'

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

        this.controls = new PointerLockControls( this.threeCamera , this.body );
        this._setPointerLocker();
    }

    private _setPointerLocker() {
        var blocker = document.getElementById('blocker');
        var instructions = document.getElementById('instructions');
        var havePointerLock = 'pointerLockElement' in document;

        if (havePointerLock) {
            var element = document.body;
            var pointerlockchange = function (event: any) {
                if (document.pointerLockElement === element) {
                    this.controls.enabled = true;
                    blocker.style.display = 'none';
                } else {
                    this.controls.enabled = false;
                    blocker.style.display = 'box';
                    instructions.style.display = '';
                }
            }

            var pointerlockerror = function (event: any) {
                instructions.style.display = '';
            }

            document.addEventListener('pointerlockchange', pointerlockchange.bind(this), false);
            document.addEventListener('pointerlockerror', pointerlockerror.bind(this), false);

            instructions.addEventListener('click', function (event: any) {
                instructions.style.display = 'none';
                // Ask the browser to lock the pointer
                element.requestPointerLock = element.requestPointerLock;
                if (/Firefox/i.test(navigator.userAgent)) {
                    var fullscreenchange = function (event: any) {
                        if (document.fullscreenElement === element) {
                            document.removeEventListener('fullscreenchange', fullscreenchange);
                            element.requestPointerLock();
                        }
                    }
                    document.addEventListener('fullscreenchange', fullscreenchange, false);
                    element.requestFullscreen = element.requestFullscreen;
                    element.requestFullscreen();
                } else {
                    element.requestPointerLock();
                }
            }, false);
        } else {
            instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
        }


    }
}