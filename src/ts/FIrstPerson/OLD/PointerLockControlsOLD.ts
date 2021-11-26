import * as THREE from 'three'
import * as CANNON from 'cannon'

export class PointerLockControls {
    public camera: THREE.Camera;
    public body: CANNON.Body;

    public eyeYPos: number;
    public velocityFactor: number;
    public jumpVelocity: number;

    public enabled: boolean;

    private _pitchObject: THREE.Object3D = new THREE.Object3D();
    private _yawObject: THREE.Object3D = new THREE.Object3D();

    private _quat: THREE.Quaternion = new THREE.Quaternion();

    private _moveRight: boolean = false;
    private _moveForward: boolean = false;
    private _moveLeft: boolean = false;
    private _moveBackward: boolean = false;

    private _canJump: boolean = false;

    private _contactNormal: CANNON.Vec3 = new CANNON.Vec3();
    private _upAxis: CANNON.Vec3 = new CANNON.Vec3(0, 1, 0);

    private _velocity: CANNON.Vec3;
    private _PI_2: number;

    private _inputVelocity: THREE.Vector3;
    private _euler: THREE.Euler;

    constructor(camera: THREE.Camera, cannonBody: CANNON.Body, eyeYPos = 2, velocityFactor = 0.2, jumpVelocity = 20) {
        this.eyeYPos = eyeYPos;
        this.velocityFactor = velocityFactor;
        this.jumpVelocity = jumpVelocity;
        this.camera = camera;
        this.body = cannonBody;

        this._pitchObject.add(this.camera);
        this._yawObject.position.y = 2;
        this._yawObject.add(this._pitchObject);

        this.body .addEventListener("collide", function (e: CANNON.ICollisionEvent) {
            var contact = e.contact;
            if (contact.bi.id == this.body .id)
                contact.ni.negate(this._contactNormal);
            else
                this._contactNormal.copy(contact.ni);

            if (this._contactNormal.dot(this._upAxis) > 0.5)
                this._canJump = true;
        }.bind(this));

        this._velocity = this.body .velocity;
        this._PI_2 = Math.PI / 2;

        document.addEventListener('mousemove', this._onMouseMove.bind(this), false);
        document.addEventListener('keydown', this._onKeyDown.bind(this), false);
        document.addEventListener('keyup', this._onKeyUp.bind(this), false);

        this.enabled = false;
        this._inputVelocity = new THREE.Vector3();
        this._euler = new THREE.Euler();
    }

    private _onMouseMove(event: MouseEvent) {
        if (this.enabled === false) return;

        var movementX = event.movementX || 0;
        var movementY = event.movementY || 0;

        this._yawObject.rotation.y -= movementX * 0.002;
        this._pitchObject.rotation.x -= movementY * 0.002;

        this._pitchObject.rotation.x = Math.max(-  this._PI_2, Math.min(this._PI_2, this._pitchObject.rotation.x));
    }

    private _onKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                this._moveForward = true;
                break;

            case 37: // left
            case 65: // a
                this._moveLeft = true; break;

            case 40: // down
            case 83: // s
                this._moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                this._moveRight = true;
                break;

            case 32: // space
                if (this._canJump === true) {
                    this._velocity.y = this.jumpVelocity;
                }
                this._canJump = false;
                break;
        }
    }

    private _onKeyUp(event: KeyboardEvent) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                this._moveForward = false;
                break;

            case 37: // left
            case 65: // a
                this._moveLeft = false;
                break;

            case 40: // down
            case 83: // a
                this._moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                this._moveRight = false;
                break;

        }

    };

    public getObject(){
        return this._yawObject;
    }

    public getDirection(targetVec: CANNON.Vec3){
        targetVec.set(0,0,-1);
        this._quat.multiplyVector3(targetVec);
    }

    public update(delta:number){
        if ( this.enabled === false ) return;

        delta *= 0.1;

        this._inputVelocity.set(0,0,0);

        if (this._moveForward ){
            this._inputVelocity.z = -this.velocityFactor * delta;
        }
        if ( this._moveBackward ){
            this._inputVelocity.z = this.velocityFactor * delta;
        }

        if (this._moveLeft ){
            this._inputVelocity.x = -this.velocityFactor * delta;
        }
        if ( this._moveRight ){
            this._inputVelocity.x = this.velocityFactor * delta;
        }

        // Convert velocity to world coordinates
        this._euler.x = this._pitchObject.rotation.x;
        this._euler.y = this._yawObject.rotation.y;
        this._euler.order = "XYZ";
        this._quat.setFromEuler(this._euler);
        this._inputVelocity.applyQuaternion(this._quat);
        //quat.multiplyVector3(inputVelocity);

        // Add to the object
        this._velocity.x += this._inputVelocity.x;
        this._velocity.z += this._inputVelocity.z;

        this._yawObject.position.copy(<any>this.body.position);
    }
}

// REWRITE THIS WITH https://threejs.org/examples/jsm/controls/PointerLockControls.js
/*
    Additional links:
    https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
    https://github.com/schteppe/cannon.js/blob/master/examples/threejs_fps.html#L154
    https://github.com/schteppe/cannon.js/blob/master/examples/js/PointerLockControls.js
*/