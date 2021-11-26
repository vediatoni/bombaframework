import * as THREE from 'three'
import * as CANNON from 'cannon'

export class Mesh{
    shape: CANNON.Shape;
    mass: number;
    body: CANNON.Body;
    geometry: THREE.Geometry;
    mesh: THREE.Mesh;
    material: THREE.Material;

    get position(): CANNON.Vec3{
        return this.body.position;
    }
    set position(pos: CANNON.Vec3){
        this.body.position = pos;
    }

    constructor(shape:CANNON.Shape,geometry:THREE.Geometry,material:THREE.Material,mass:number){
        this.shape = shape;
        this.mass = mass;
        this.body = new CANNON.Body({mass:this.mass});
        this.body.addShape(this.shape);
        this.geometry = geometry;
        this.material = material;
        this.mesh = new THREE.Mesh(this.geometry,this.material);
    }

    update(){
        this.mesh.position.copy(<any>this.body.position);
        this.mesh.quaternion.copy(<any>this.body.quaternion);
    }
}