import { Mesh } from './Meshes/Mesh'
import { Plane } from './Meshes/Plane'
import * as THREE from 'three'
import * as CANNON from 'cannon'
import { FirstPersonCamera } from './FIrstPerson/FirstPersonCamera';
import { Box } from './Meshes/Box';

export class Scene {
    public threeScene: THREE.Scene;
    public cannonWorld: CANNON.World;
    public meshes: Array<Mesh>;

    constructor(basicScene: boolean, gravity = new CANNON.Vec3(0, -10, 0)) {
        this.threeScene = new THREE.Scene();
        this.threeScene.background = new THREE.Color(0xcccccc);
        this.cannonWorld = new CANNON.World();
        this.cannonWorld.gravity.set(gravity.x, gravity.y, gravity.z);
        this.cannonWorld.broadphase = new CANNON.NaiveBroadphase();

        this.meshes = new Array<Mesh>();

        if (basicScene) {
            this._createBasicScene();
        }
    }

    public addMesh(mesh: Mesh, updatePhysics = true) {

        this.cannonWorld.addBody(mesh.body);
        this.threeScene.add(mesh.mesh);

        if (updatePhysics)
            this.meshes.push(mesh);
    }

    public addCamera(camera: FirstPersonCamera) {
        this.threeScene.add(camera.controls.getObject());
        this.cannonWorld.addBody(camera.body);
    }

    public addThreeObject(obj: THREE.Object3D) {
        this.threeScene.add(obj);
    }

    public updatePhysics() {
        this.cannonWorld.step(1 / 60)
        this.meshes.forEach(el => {
            el.update();
        })
    }

    private _createBasicScene() {
        var ground: Plane = new Plane(new THREE.MeshPhongMaterial({ color: 0xffff00 }));
        ground.mesh.castShadow = false;
        ground.mesh.receiveShadow = true;

        var ambientLight = new THREE.AmbientLight(0xfffff,0.2);

        var pointLight = new THREE.PointLight(0xffffff, 0.8, 18);
        pointLight.position.set(-3,6,-3);
        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 0.1;
        pointLight.shadow.camera.far = 25;

        var box: Box = new Box(1, 5);
        box.position.set(0, 15, 0)
        box.mesh.castShadow = true;
        box.mesh.receiveShadow = true;

        this.addMesh(ground);
        this.addMesh(box);
        this.addThreeObject(ambientLight);
        this.addThreeObject(pointLight);
    }
}