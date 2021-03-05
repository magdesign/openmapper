import {
    BufferAttribute,
    BufferGeometry,
    ClampToEdgeWrapping,
    LinearFilter,
    Mesh,
    MeshBasicMaterial, Scene, Sprite,
    VideoTexture,
} from "three";
import {Config} from "../../config";
import {DragHandler, DragHandlerTypes, IDragHandler} from "./DragHandler";
import {DimensionTransformer, IDimension} from "../math/DimensionTransformer";
import {Indices} from "../math/Indices";
import {Mapper} from "../math/Mapper";
import {SpriteBuilder} from "./SpriteBuilder";
import {LineBuilder} from "./LineBuilder";
import {VideoSceneHelper} from "./VideoSceneHelper";
import uuid = require("uuid");
import {isNegativeNumberLiteral} from "tslint";

export enum VideoType {
    Cutter,
    Mapper,
}

export interface IVideoMaterial {
    id: string;
    mesh: Mesh;
    type?: VideoType; // is the quad a mapper or a cutter
    positions: IDimension[];
    dragHandler: IDragHandler[];
}

export class VideoMaterialBuilder {

    public static init(video: HTMLVideoElement, src: IVideoMaterial): IVideoMaterial {

        const mesh: any = src.mesh;
        const texture = this.loadTexture(video);

        const index = mesh.geometries[0].data.index.array;
        const uv = new Float32Array(mesh.geometries[0].data.attributes.uv.array);
        const position = new Float32Array(mesh.geometries[0].data.attributes.position.array);

        const geometry = this.loadGeometry(index, uv, position);

        const videoMesh = new Mesh(geometry, new MeshBasicMaterial({map: texture, wireframe: false}));

        return {
            id: src.id,
            type: src.type,
            dragHandler: [],
            mesh: videoMesh,
            positions: DimensionTransformer.fromFloatArrayToDimension(position),
        };
    }


    public static create(video: HTMLVideoElement, startPoint: IDimension): IVideoMaterial {

        const indices: number[] = Indices.calcIndices(Config.Vertices.size);

        const positions = Mapper.verticesWithStartPoint(Config.Vertices.size, 2, startPoint);

        const uvs = Mapper.uv(Config.Vertices.size);
        const uvsFloat: Float32Array = DimensionTransformer.toFloatArray(uvs);

        const texture = this.loadTexture(video);

        const geometry = this.loadGeometry(indices, uvsFloat, DimensionTransformer.toFloatArray(positions));

        const videoMesh = new Mesh(geometry, new MeshBasicMaterial({map: texture, wireframe: false}));

        return {
            id: uuid(),
            dragHandler: [],
            mesh: videoMesh,
            positions,
        };
    }

    /**
     * reorders draghandler of videomatieral
     * @param videoMaterial
     */
    public static reorderDraghandleMapper(videoMaterial: IVideoMaterial) {
            videoMaterial.dragHandler
                .map((dh: IDragHandler) => {
                    const edges: IDimension[] = VideoSceneHelper.getEdgesFromScene(videoMaterial.mesh);

                    for (let i = 0; i < edges.length; i++) {
                        dh.sprites[i] .position.set(edges[i].x, edges[i].y, edges[i].z);
                    }

                    LineBuilder.reorderLines(dh.line, edges);
                    const vertices = Mapper.map(Config.Vertices.size, edges[0], edges[1], edges[2], edges[3]);

                    VideoSceneHelper.changeVertices(vertices, videoMaterial.mesh);
                });
    }

    public static moveLayer(videos: IVideoMaterial[], deltaZ: number): void {
        videos.map((video: IVideoMaterial) => {

            const vector: IDimension = {
                x: 0,
                y: 0,
                z: deltaZ,
            };

            const geometry: any = video.mesh.geometry;
            const oldVertices = geometry.attributes.position.array;
            const z = geometry.attributes.position.array[2] + deltaZ;
            const newVertices = DimensionTransformer.vectorizeFloatArray(oldVertices, vector);

            VideoSceneHelper.changeVerticesWithFloatArray(newVertices, video.mesh);

            // reorder z axis of Mapper items
            video.dragHandler
                .filter((dh: IDragHandler) => dh.type === DragHandlerTypes.Mapper)
                .map((dh: IDragHandler) => DragHandler.updateByVecotor(dh, vector));

            // reorder z axis of delete item
            video.dragHandler
                    .filter((dh: IDragHandler) => dh.type === DragHandlerTypes.Delete)
                    .map((dh: IDragHandler) => {
                        dh.sprites.map((sprite: Sprite) => {
                            const zPosition: number = sprite.position.z + z;
                            sprite.position.setZ(zPosition);
                        });
                    });
        });
    }

    /** 
     * Mapping function for draghandle event
     * @param videoMaterial 
     */
    public static dragVideo(videoMaterial: IVideoMaterial) {
        return () => {
            videoMaterial.dragHandler
                .filter((dh: IDragHandler) => dh.type === DragHandlerTypes.Mapper)
                .map((dh: IDragHandler) => {
                    const spriteEdges: IDimension[] = SpriteBuilder.loadSpriteEdges(dh.sprites);

                    LineBuilder.reorderLines(dh.line, spriteEdges);
                    const vertices = Mapper.map(Config.Vertices.size, spriteEdges[0], spriteEdges[1], spriteEdges[2], spriteEdges[3]);

                    VideoSceneHelper.changeVertices(vertices, videoMaterial.mesh);
                });
        };
    }

    /** 
     * Move function for draghandle event
     * @param videoMaterial 
     */
    public static moveVideo(videoMaterial: IVideoMaterial, refPoint: IDimension) {
        return (event) => {
            const delta = {
                x: event.object.position.x - refPoint.x,
                y: event.object.position.y - refPoint.y,
                z: event.object.position.z,
            };

            const geometry: any = videoMaterial.mesh.geometry;
            const oldVertices = geometry.attributes.position.array;
            const newVertices = DimensionTransformer.vectorizeFloatArray(oldVertices, delta);

            VideoSceneHelper.changeVerticesWithFloatArray(newVertices, videoMaterial.mesh);


            videoMaterial.dragHandler
                .filter((dh: IDragHandler) => dh.type === DragHandlerTypes.Mapper)
                .map((dh: IDragHandler) => {
                    DragHandler.updateByVecotor(dh, delta);
                });

            videoMaterial.dragHandler
                .filter((dh: IDragHandler) => dh.type === DragHandlerTypes.Delete)
                .map((dh: IDragHandler) => {
                    dh.sprites.map((sprite: Sprite) => {
                        sprite.position.setX(sprite.position.x + delta.x);
                        sprite.position.setY(sprite.position.y + delta.y);
                        sprite.position.setZ(sprite.position.z + delta.z);
                    });
                });

            // sets new position for proper delta (i know it is not a proper solution -.-)
            refPoint = {...event.object.position};
        };
    }

    private static loadGeometry(indices: number[], uvs: Float32Array, positions: Float32Array): BufferGeometry {
        const geometry = new BufferGeometry();
        geometry.setIndex(indices);
        geometry.addAttribute("position", new BufferAttribute(positions, 3));
        geometry.addAttribute("uv", new BufferAttribute(uvs, 3));
        return geometry;
    }

    private static loadTexture(video: HTMLVideoElement): VideoTexture {
        const texture = new VideoTexture(video);
        texture.generateMipmaps = false;
        texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
        texture.minFilter = LinearFilter;
        return texture;
    }
}
