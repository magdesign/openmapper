import {
    PerspectiveCamera,
    Scene, 
    WebGLRenderer, 
    Vector3,
    Shape, 
    ShapeGeometry,
    MeshBasicMaterial, 
    Mesh
} from "three";
import {EventManager} from "../event/EventManager";
import {IVideoMaterial, VideoType} from "../material/VideoMaterialBuilder";
import {VideoCutter} from "./video/VideoCutter";
import {VideoMapper} from "./video/VideoMapper";
import {HtmlVideoMaterial} from "../material/HtmlVideoMaterial";
import {EventHandler, EventTypes} from "../event/EventHandler";
import {SceneManager} from "./SceneManager";
import {DragManager} from "./DragManager";
import {Config} from "../../config";


export interface IRenderItems {
    scene: Scene;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
}


export interface IScene {
    videoMaterial: IVideoMaterial[];
    htmlVideoElement: HTMLVideoElement;
}

class Renderer {

    public static init() {



        const scene: Scene = new Scene();
        const renderer: WebGLRenderer = this.loadRenderer();
        const camera: PerspectiveCamera = this.loadCamera(scene, renderer);
        const video: HTMLVideoElement = HtmlVideoMaterial.initVideo(Config.Video.source);

        const videoMaterials: IVideoMaterial[] = [];


/*

        var x = 0, y = 0, z = 0;



        let pts = [];
        pts.push(new Vector3(0, 0, z));
        pts.push(new Vector3(0, 1, z));
        pts.push(new Vector3(1, 1, z));
        pts.push(new Vector3(2, 0, z));
        pts.push(new Vector3(0, 0, z));
        let heartShape = new Shape(pts);




        var geometry = new ShapeGeometry( heartShape );
        var material =  new MeshBasicMaterial( { color: 0x00ff00 } );
        var mesh = new Mesh( geometry, material ) ;

        scene.add(mesh);


*/
        SceneManager.addToScene(videoMaterials, scene);


        EventManager.init(videoMaterials, scene, renderer, camera, video);

        // let dragHanldes: CutterDragHandler = new CutterDragHandler(scene, renderer, camera, video2, id);
        // PositionDragHandler.initVertices(scene, renderer, camera, video);

        this.rendermagic(renderer, camera, scene);
    }

    private static loadRenderer(): WebGLRenderer {
        const renderer: WebGLRenderer = new WebGLRenderer();
        // here we should notify the renderer about window resize
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    private static loadCamera(scene: Scene, renderer: WebGLRenderer): PerspectiveCamera {
        const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 5;
        
        camera.lookAt(scene.position);

        window.addEventListener("resize", () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);
        return camera;
    }

    private static rendermagic(renderer: WebGLRenderer, camera: PerspectiveCamera, scene: any): void {
        function animate(): void {
            requestAnimationFrame(animate);
            render();
        }

        function render(): void {
            renderer.render(scene, camera);
        }

        animate();
    }
}

Renderer.init();
