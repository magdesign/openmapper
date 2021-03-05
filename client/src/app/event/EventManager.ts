import {DragHandler, DragHandlerTypes, IDragHandler} from "../material/DragHandler";
import {SpriteBuilder} from "../material/SpriteBuilder";
import {IVideoMaterial, VideoType, VideoMaterialBuilder} from "../material/VideoMaterialBuilder";
import {VideoSceneHelper} from "../material/VideoSceneHelper";
import {EventHandler, EventTypes} from "./EventHandler";
import {Scene, Sprite, Raycaster, Vector2} from "three";
import {VideoCutter} from "../graphic/video/VideoCutter";
import {LocalStorage} from "../store/LocalStorage";
import {SceneManager} from "../graphic/SceneManager";
import {DragManager, IDragManager} from "../graphic/DragManager";
import {VideoMapper} from "../graphic/video/VideoMapper";
import { consoleTestResultHandler } from "tslint/lib/test";
import { DimensionTransformer, IDimension } from "../math/DimensionTransformer";
import { Mapper } from "../math/Mapper";
import { Config } from "../../config";
import { CameraCalculations } from "../math/CameraCalculations";
import { WebsocketService } from "./WebsocketService";
import { start } from "repl";




export class EventManager {



    /**
     * initialize eventlisteners.
     * is usualy used by the renderer.
     * @param videos
     * @param scene
     * @param renderer
     * @param camera
     * @param htmlVideo
     */
    public static init(videos: IVideoMaterial[], scene: Scene, renderer, camera, htmlVideo: HTMLVideoElement): void {

        WebsocketService.initWebsocket(videos);

        let dragControls: IDragManager
        let raycaster = new Raycaster();

        let selectedItem = "";

        document.addEventListener("click", (event) => {
            const mouse = new Vector2();

            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            const intersects: any = raycaster.intersectObjects(scene.children);
            
            const itemId: string = intersects
                    .filter((intersect) => intersect.object.type === "Sprite")
                    .map((intersect) => intersect.object.name)[0];

            if (undefined !== itemId) {
                selectedItem = itemId;
            }
        });

        EventHandler.addEventListener(EventTypes.LayerUp, () => {
            const result = VideoSceneHelper.getSelectedItemByDraghandleId(videos, selectedItem);
            VideoMaterialBuilder.moveLayer(result, Config.Layer.z);

        });

        EventHandler.addEventListener(EventTypes.LayerDown, () => {
            const result = VideoSceneHelper.getSelectedItemByDraghandleId(videos, selectedItem);
            VideoMaterialBuilder.moveLayer(result, -Config.Layer.z);
        });

        
        EventHandler.addEventListener(EventTypes.Fullsize, () => {
            const width = CameraCalculations.visibleWidthAtZDepth(0, camera);
            const heigth = CameraCalculations.visibleHeightAtZDepth(0, camera);

            const newPoint = {
                x: - (width / 2),
                y: - (heigth / 2),
                z: 0,
            };

            const vertices: IDimension[] = Mapper.verticesWithHeightAndWidth(Config.Vertices.size, heigth, width, newPoint);

            VideoSceneHelper.changeVertices( vertices, videos[0].mesh);
            VideoMaterialBuilder.reorderDraghandleMapper(videos[0]);
        });


        EventHandler.addEventListener(EventTypes.Save, () => {
            LocalStorage.save(videos);
        });

        EventHandler.addEventListener(EventTypes.Load, () => {
            DragManager.resetDragManager(dragControls);

            const saveState: IVideoMaterial[] = LocalStorage.load();

            const videoMapper: IVideoMaterial[] = saveState
                .filter((video) => video.type === VideoType.Mapper)
                .map((video) => VideoMapper.init(htmlVideo, video));

            const videoCutter: IVideoMaterial[] = saveState
                .filter((video) => video.type === VideoType.Cutter)
                .map((cutter) => VideoCutter.init(htmlVideo, cutter, videoMapper));

            videos = videoMapper.concat(videoCutter);

            scene.children = [];
            DragManager.resetDragManager(dragControls);
            dragControls = DragManager.createDragManager(videos, camera, renderer);

            SceneManager.addToScene(videos, scene);
        });

        EventHandler.addEventListener(EventTypes.Reload, (event) => {
            DragManager.resetDragManager(dragControls);

            const saveState: IVideoMaterial[] = event.detail.value;

            const videoMapper: IVideoMaterial[] = saveState
                .filter((video) => video.type === VideoType.Mapper)
                .map((video) => VideoMapper.init(htmlVideo, video));

            const videoCutter: IVideoMaterial[] = saveState
                .filter((video) => video.type === VideoType.Cutter)
                .map((cutter) => VideoCutter.init(htmlVideo, cutter, videoMapper));

            videos = videoMapper.concat(videoCutter);

            scene.children = [];
            DragManager.resetDragManager(dragControls);
            dragControls = DragManager.createDragManager(videos, camera, renderer);

            SceneManager.addToScene(videos, scene);
        });




        let i = 0.2;
        EventHandler.addEventListener(EventTypes.NewQuad, () => {
            DragManager.resetDragManager(dragControls);

            const z = 0;

            const newVideo: IVideoMaterial = VideoMapper.create(htmlVideo, {
                x: i,
                y: -i,
                z,
            });

            SceneManager.addVideoToScene(newVideo, scene);
            EventManager.changeCutterVisibility(videos, false);

            selectedItem = newVideo.id;
            videos.push(newVideo);
            dragControls = DragManager.createDragManager(videos, camera, renderer);

            i += 0.2;
        });

        EventHandler.addEventListener(EventTypes.RemoveQuad, (event) => {
            const video: IVideoMaterial = event.detail.value;

            // removes videoquad with cutter
            videos
                .filter((vid) => vid.id === video.id)
                .map((vid: IVideoMaterial) => {
                    scene.remove(vid.mesh);
                    vid.dragHandler.map((dh: IDragHandler) => {
                        scene.remove(dh.line);
                        dh.sprites.forEach((sprite: Sprite) => {
                            scene.remove(sprite);
                        });
                    });
                    VideoCutter.removeCutterItem(videos, vid, scene);
                });

            videos = videos.filter((vid) => vid.id !== video.id);
            dragControls = DragManager.createDragManager(videos, camera, renderer);
        });

        EventHandler.addEventListener(EventTypes.Cutter, (value) => {
            if(value.detail.value) {
                DragManager.resetDragManager(dragControls);
    
                const newVideo = VideoSceneHelper.getSelectedItemByDraghandleId(videos, selectedItem);
    
                const width = CameraCalculations.visibleWidthAtZDepth(0, camera);
                const heigth = CameraCalculations.visibleHeightAtZDepth(0, camera);
    
                const borderSpace = 0.9;

                const startPoint = {
                    x: -(width / 2) * borderSpace,
                    y: -(heigth / 2) * borderSpace,
                    z: 0.005,
                };

                const newVideoCutter = VideoCutter.create(newVideo, htmlVideo, startPoint);
                const vertices: IDimension[] = Mapper.verticesWithHeightAndWidth(Config.Vertices.size, heigth * borderSpace, width * borderSpace, startPoint);


                VideoSceneHelper.changeVertices( vertices, newVideoCutter.mesh);
                VideoMaterialBuilder.reorderDraghandleMapper(newVideoCutter);
    
                videos.push(newVideoCutter);
    
    
                SceneManager.addDragHandlesToScene(newVideoCutter, scene);
                SceneManager.addVideoToScene(newVideoCutter, scene);
                dragControls = DragManager.createDragManager(videos, camera, renderer);

    
            } else {
                DragManager.resetDragManager(dragControls);

                videos
                    .filter((vid) => vid.type === VideoType.Cutter)
                    .map((vid: IVideoMaterial) => {
                        scene.remove(vid.mesh);
                        vid.dragHandler.map((dh: IDragHandler) => {
                            scene.remove(dh.line);
                            dh.sprites.forEach((sprite: Sprite) => {
                                scene.remove(sprite);
                            });
                        });
                        VideoCutter.removeCutterItem(videos, vid, scene);
                    });
                dragControls = DragManager.createDragManager(videos, camera, renderer);
                videos = videos.filter((vid) => vid.type !== VideoType.Cutter);
            }



            //EventManager.changeCutterVisibility(videos, value.detail.value);
        });

        EventHandler.addEventListener(EventTypes.Wireframe, (value) => {
            videos.forEach((video: IVideoMaterial) => VideoSceneHelper.changeWireframe(video.mesh, value.detail.value));
        });

        EventHandler.addEventListener(EventTypes.Outlines, (value) => {
            videos.forEach((video: IVideoMaterial) => {
                video.dragHandler.forEach((dh: IDragHandler) => {
                    switch (dh.type) {
                        case DragHandlerTypes.Mapper:
                            DragHandler.visible(dh, value.detail.value);
                            break;
                        case DragHandlerTypes.Mover:
                        case DragHandlerTypes.Delete:
                            SpriteBuilder.disable(dh.sprites, value.detail.value);
                            break;
                    }
                });
            });
        });
    }

    private static changeCutterVisibility(videos: IVideoMaterial[], value: boolean): void{
        videos.forEach((video: IVideoMaterial) => {
            video.dragHandler.forEach((dh: IDragHandler) => {
                switch (dh.type) {
                    case DragHandlerTypes.Cutter:
                        DragHandler.visible(dh, value);
                        VideoSceneHelper.changeVisibility(video.mesh, value);
                }
            });
        });
    }
}
