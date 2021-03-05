export const Config = {
    Websocket: {
        url: "ws:localhost:9030",
        protocoll: ["json"],
    },
    Gui: {
        hidden: false,
    },
    Video: {
        source: "assets/media/video/testvideo.mp4",
    },
    DeleteHandler: {
        line: 3,
        scale: 0.2,
        source: "../assets/deletehandle.png",
    },
    DragHandler: {
        line: 1, // with of line
        scale: 0.2,
        source: "../assets/draghandle.png",
    },
    MoveHandler: {
        line: 3,
        scale: 0.4,
        source: "../assets/movehandle.png",
    },
    Layer: {
        z: 0.001,
    },
    Vertices: {
        length: 2,
        size: 30,
        wireframe: false,
    },
    Services: {
        Directory: "http://localhost:3000/rest/",
    },
};
