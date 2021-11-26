import { Mesh } from "./Mesh";
import * as CANNON from "cannon"
import * as THREE from 'three'

export class Box extends Mesh{
    constructor(size:number, mass:number){
        var he = new CANNON.Vec3(size,size,size);
        var boxShape = new CANNON.Box(he);
        var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
        var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );

        super(boxShape,boxGeometry, material, mass);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
}