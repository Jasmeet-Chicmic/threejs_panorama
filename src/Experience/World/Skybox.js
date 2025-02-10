import * as THREE from 'three'
import Experience from '../Experience.js'
import { imageBaseURL, skyboxImagesName } from '../Constants.js'
import gsap from "gsap"

export default class Skybox {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.skyBox = null;
        this.imageCounter = 0;

        if (this.experience.debug.active)
            this.debugFolder = this.experience.debug.ui.addFolder("Skybox");

        
        this.createSkybox(skyboxImagesName.purplenebula);
    }

    fetchImagePaths(imageName) {
        const baseURL = `${imageBaseURL}${imageName}/${imageName}`;
        const fileType = imageName === skyboxImagesName.purplenebula ? '.png' : '.jpg';
        const sides = ['ft', 'bk', 'up', 'dn', 'rt', 'lf'];

        return sides.map(side => `${baseURL}_${side}${fileType}`);
    }

    async createMaterials(skyBox) {
        const pathStrings = this.fetchImagePaths(skyBox);

        return Promise.all(
            pathStrings.map(image => {
                return new Promise(resolve => {
                    const textureLoader = new THREE.TextureLoader();
                    textureLoader.load(image, texture => {
                        resolve(new THREE.MeshBasicMaterial({
                            map: texture,
                            side: THREE.BackSide,
                            transparent: true,  // Ensure transparency is enabled
                           
                            depthWrite: false   // Fix transparency issues
                        }));
                    });
                });
            })
        );
    }

    async createSkybox(skybox) {
        const materials = await this.createMaterials(skybox);
        const box = new THREE.BoxGeometry(1000, 1000, 1000);

        this.skybox = new THREE.Mesh(box, materials);
        this.scene.add(this.skybox);

        if (this.experience.debug.active) {
            this.debugFolder.add({ changeSkybox: () => this.changeSkybox() }, "changeSkybox").name("Change Skybox");
        }
    }


    getRandomSkybox() {
        const values = Object.values(skyboxImagesName);
        const img = values[this.imageCounter];

        this.imageCounter++;
        if (this.imageCounter >= values.length) {
            this.imageCounter = 0;
        }

        return img;
    }

    async changeSkybox() {
        if (!this.skybox) return;

      
       

      
        const newSkyboxImage = this.getRandomSkybox();
        const newMaterials = await this.createMaterials(newSkyboxImage);

        await new Promise(resolve => {
            gsap.to(this.skybox.material, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: resolve, 
            });
        });
        this.scene.remove(this.skybox);
        this.skybox = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), newMaterials);
       
        this.scene.add(this.skybox);
        this.skybox.material.map((material)=>{
            material.opacity = 0
        })
       
        gsap.to(this.skybox.material, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.inOut",
        });
    }
}
