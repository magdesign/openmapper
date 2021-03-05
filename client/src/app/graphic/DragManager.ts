import {IVideoMaterial} from "../material/VideoMaterialBuilder";
import {DragEventType, IDragHandler} from "../material/DragHandler";
import DragControls from "three-dragcontrols";
import {Sprite} from "three";
import { EventTypes, EventHandler } from "../event/EventHandler";

enum Event {
    Drag = "drag",
    DragStart = "dragstart",
}

export interface IDragManager {
    click: DragControls;
    move: DragControls;
}

export class DragManager {

    /**
     * loads draghandler out of ivideomaterial by DragEventType
     * is used for make a difference between click or move
     * @param materials
     * @param eventType
     */
    private static loadDragHandler(materials: IVideoMaterial[], eventType: DragEventType): IDragHandler[] {
        return materials
            .map((material: IVideoMaterial) =>
                material.dragHandler
                    .filter((dh: IDragHandler) => dh.dragEventType === eventType))
            .reduce((a, b) => a.concat(b));
    }


    /**
     * get back sprites of given draghanlder
     * used for dragcontrols
     * @param dragHandler
     */
    private static loadSprites(dragHandler: IDragHandler[]): Sprite[] {
        return dragHandler
            .map((dh) => dh.sprites)
            .reduce((a, b) => a.concat(b));
    }

    private static initDragHandler(dragHandler: IDragHandler[], event: Event, camera, renderer): DragControls {

        const sprites = this.loadSprites(dragHandler);
        const dragControls = new DragControls(sprites, camera, renderer.domElement);

        dragControls.addEventListener(event, (value) => {
            // Filter handles event only on same quad
            dragHandler
                .filter((dh) =>
                    dh.sprites.filter((sprite: Sprite) => sprite.uuid === value.object.uuid).length > 0)
                .map((dh) => dh.fn(value));
            
            // EventHandler.throwEvent(EventTypes.Controll, {});
        });

        return dragControls;
    }

    /**
     * creates draghandles for click and move
     * @param materials
     * @param camera
     * @param renderer
     */
    public static createDragManager(materials: IVideoMaterial[], camera, renderer): IDragManager {
        const dragHandler: IDragHandler[] = this.loadDragHandler(materials, DragEventType.Drag);
        const clickHandler: IDragHandler[] = this.loadDragHandler(materials, DragEventType.Click);

        return {
            click: this.initDragHandler(clickHandler, Event.DragStart, camera, renderer),
            move: this.initDragHandler(dragHandler, Event.Drag, camera, renderer),
        };
    }

    public static resetDragManager(dragmanager: IDragManager): void {
        if(dragmanager){
            dragmanager.click.dispose();
            dragmanager.move.dispose();
        }
    }
}
