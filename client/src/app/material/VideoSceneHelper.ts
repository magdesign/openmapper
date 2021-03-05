import {Config} from "../../config";
import {DimensionTransformer, IDimension} from "../math/DimensionTransformer";
import {Edges} from "../math/Edges";
import {Mapper} from "../math/Mapper";
import { IVideoMaterial } from "./VideoMaterialBuilder";
import { IDragHandler } from "./DragHandler";

/**
 * filters scene elements and changes properties
 * @param video is in any case the Mesh object of three js  
 */
export class VideoSceneHelper {

    /**
     * get egdes from mesh object of video
     * @param video
     */
    public static getEdgesFromScene(video: any): IDimension[] {
        const positions = video.geometry.attributes.position.array;
        return Edges.getEdges(DimensionTransformer.fromFloatArrayToDimension(positions));

    }

 
    /**
     * enables or disables wireframe
     * @param video
     * @param wireframe
     */
    public static changeWireframe(video: any, wireframe: boolean) {
        video.material.wireframe = wireframe;
        return video;
    }

    public static changeVisibility(video: any, visible: boolean) {
        video.visible = visible;
        return video;
    }

    public static changeUv(uv: IDimension[], video: any): any {
        video.geometry.attributes.uv.array = DimensionTransformer.toFloatArray(Mapper.map(Config.Vertices.size, uv[0], uv[1], uv[2], uv[3]));
        video.geometry.attributes.uv.needsUpdate = true;
        return video;
    }

    public static changeVerticesWithFloatArray(vertices: Float32Array, video: any) {
        video.geometry.attributes.position.array = vertices;
        video.geometry.attributes.position.needsUpdate = true;

        return video;
    }

    public static changeVertices(vertices: IDimension[], video: any) {
        video.geometry.attributes.position.array = DimensionTransformer.toFloatArray(vertices);
        video.geometry.attributes.position.needsUpdate = true;
        return video;
    }

    public static getSelectedItemByDraghandleId(videos: IVideoMaterial[], selectedId: string): IVideoMaterial[] {
        return videos
            .filter((video: IVideoMaterial) => video
                .dragHandler
                .filter((draghandler: IDragHandler): boolean => draghandler.id === selectedId).length >= 1);
    }
}
