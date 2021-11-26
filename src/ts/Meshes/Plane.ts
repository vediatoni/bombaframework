import { Mesh } from "./Mesh";
import * as CANNON from "cannon"
import * as THREE from "three"
export class Plane extends Mesh {
    constructor(material = (<THREE.Material>new THREE.MeshLambertMaterial({ color: 0xFFFFFF })), mass = 0) {
        var groundShape = new CANNON.Plane();
        var geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
        var material = material

        super(groundShape, geometry, material, mass);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);

        this.update();
    }
}