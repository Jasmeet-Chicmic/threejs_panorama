import Experience from '../Experience.js'
import Environment from './Environment.js'
import Skybox from './Skybox.js'


export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.skybox = new Skybox()
            this.environment = new Environment()
        })
    }

    update()
    {
       
    }
}