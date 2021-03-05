import * as Dat from "dat.gui";
import {EventHandler, EventTypes} from "../event/EventHandler";
import { Config } from "../../config";
import { IConfig, IGuiItem } from "./IConfig";
import { ConfigManager } from "./ConfigManager";
import { KeyHandler } from "./KeyHandler";

import { RestDirectoryService } from "./RestDirectoryService";

import { Vector2 } from "three";
import { sync } from "glob";


// this thing makes the GUI menus
// and defines the keyboard shortcuts

RestDirectoryService.getMediaDirectoryFiles(prepareConfig);

function prepareConfig(videos) {
    const config: IConfig[] = [
        {
            title: "File",
            open: true,
            subitemsValues: [],
            subitemsButtons: [
                {
                    key: "Save (s)",
                    keycode: "KeyS",
                    value: true,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.Save, value),
                },
                {
                    key: "Load (l)",
                    keycode: "KeyL",
                    value: true,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.Load, value),
                },
                {
                    key: "Render to file",
                    keycode: "",
                    value: true,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.Render2File, value),
                },
            ],
        },
        {
            title: "View",
            open: true,
            subitemsValues: [
                {
                    key: "Wireframe (w)",
                    value: false,
                    keycode: "KeyW",
                    fn: (value) => EventHandler.throwEvent(EventTypes.Wireframe, value),
                },
                {
                    key: "Outlines (o)",
                    value: false,
                    keycode: "KeyO",
                    fn: (value) => EventHandler.throwEvent(EventTypes.Outlines, value),
                },
                {
                    key: "Cutter (c)",
                    keycode: "KeyC",
                    value: true,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.Cutter, value),
                },
            ],
            subitemsButtons: [],
        },
        {
            title: "Surfaces",
            open: true,
            subitemsValues: [],
            subitemsButtons: [
                {
                    key: "Add (q)",
                    keycode: "KeyQ",
                    value: true,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.NewQuad, value),
                },
                {
                    key: "Fullsize (f)",
                    keycode: "KeyF",
                    value: true,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.Fullsize, value),
                },
                {
                    key: "LayerUp (pUp)",
                    keycode: "PageUp",
                    value: true,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.LayerUp, value),
                },
                {
                    key: "LayerDown (pD)",
                    keycode: "PageDown",
                    value: true,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.LayerDown, value),
                },
            ],
        },
        {
            title: "Content Selection",
            open: true,
            subitemsValues: [
                {
                    key: "Video File",
                    keycode: "KeyS",
                    value: videos,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.VideoSrc, value),
                },
                {
                    key: "Slideshow",
                    keycode: "KeyS",
                    value: false,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.Slideshow, value),
                },
                {
                    key: "Webcam (i)",
                    keycode: "KeyI",
                    value: false,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.WebCam, value),
                },
                {
                    key: "NDI",
                    keycode: "",
                    value: false,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.NDIsource, value),
                },
            ],
            subitemsButtons: [],
        },
        {
            title: "Control",
            open: true,
            subitemsValues: [
                {
                    key: "Play/Pause",
                    keycode: "Space",
                    value: true,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.PlayVideo, value),
                },
                {
                    key: "Speed",
                    value: 1,
    
                    min: 0,
                    max: 1000,
                    steps: 1,
    
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.VideoSpeed, value),
                },
            ],
            subitemsButtons: [],
        },
        {
            title: "Sync",
            open: true,
            subitemsValues: [
                {
                    key: "Slave",
                    value: false,
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.Slave, value),
                },
                {
                    key: "MasterIP",
                    value: "127.0.0.1",
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.Slave, value),
                },
                {
                    key: "Remote Controller",
                    value: [
                    ],
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.RemoteAccessWS, value),
                },
                {
                    key: "To Control IP",
                    value: "127.0.0.1",
                    fn: (value: any) => EventHandler.throwEvent(EventTypes.Slave, value),
                },
            ],
            subitemsButtons: [],
        },
    ];

    const initConfig: Dat.GUIParams = {};

    // create a gui element
    const gui = new Dat.GUI(initConfig);
    if (Config.Gui.hidden) {
        gui.hide();
    }

    ConfigManager.createGuiElements(gui, config);
    KeyHandler.createShortCuts(gui, config);



    EventHandler.addEventListener(EventTypes.NewWebSocketRegistration, (value) => {
        ConfigManager.updateDropDown(gui, "Sync", "Remote Controller", value.detail.value);
    });
}
