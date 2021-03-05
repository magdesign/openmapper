export enum EventTypes {
    NewWebSocketRegistration = "NewWebSocketRegistration",
    
    Wireframe = "Wireframe",
    Cutter = "Cutter",
    Outlines = "outlines",
    PlayVideo = "PlayVideo",
    NewQuad = "newQuad",
    // must be defined from here:
    // renders whole scene witout gui https://janakiev.com/til/videos-and-gifs-with-threejs/
    LayerUp = "LayerUp",
    LayerDown =  "LayerDown",

    Render2File = "notDefined",
    Fullsize = "fullsize",
    NDIsource = "notDefined",           // this must grab an NDI source
    Slideshow = "notDefined",           // this should render an iframe with /media/slideshow/index.html
    Slave = "notDefined",
    RemoteAccessWS = "RemoteAccessWS",     // set enables the WS to
    // until here
    RemoveQuad = "removeQuad",
    DragQuad = "dragQuad",
    MoveQuad = "moveQuad",
    Save = "save",
    Load = "load",
    Reload = "Reload",
    Controll = "Controll",
    
    VideoSpeed = "VideoSpeed",
    VideoSrc = "VideoSrc",
    WebCam = "WebCam",
}

export class EventHandler {

    public static addEventListener(type: EventTypes, fn: (val: any) => void): void {
        this.getEventHandler()
            .addEventListener(type, fn, false);
    }

    public static throwEvent(type: EventTypes, value: any): void {
        const event = new CustomEvent(type, {detail: {value}});
        this.getEventHandler().dispatchEvent(event);
    }

    private static getEventHandler(): any {
        return document.getElementsByTagName("body")[0];
    }
}
