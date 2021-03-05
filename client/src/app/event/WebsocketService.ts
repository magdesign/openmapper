import { Config } from "../../config";
import { IEvent, WsEventType } from "./Event";
import { EventHandler, EventTypes } from "./EventHandler";

export class WebsocketService {

    public static initWebsocket(videos): void {
        let webSocketID: string = '';
        let ws: WebSocket = new WebSocket(Config.Websocket.url, Config.Websocket.protocoll);
        let target: string[] = [];


        ws.onmessage = (e) => {
            const event: IEvent = JSON.parse(e.data);
            console.log(event);

            webSocketID = event.payload.id;
            switch(event.header.type) {
                case WsEventType.Registration:
                    EventHandler.throwEvent(EventTypes.NewWebSocketRegistration, event.payload.clients);
                    break;
                case WsEventType.StateRequest:
                    const stateEvent: IEvent = {
                        header: {
                            id: webSocketID,
                            targetId: [event.header.id],
                            type: WsEventType.StateResponse,
                        },
                        payload: videos,
                    };
                    target = [event.header.id];
                    console.log(stateEvent);

                    ws.send(JSON.stringify(stateEvent));
                    break;
                case WsEventType.StateResponse:
                    EventHandler.throwEvent(EventTypes.Reload, event.payload);
 
            }
        };

        EventHandler.addEventListener(EventTypes.Controll, () => {
            const stateEvent: IEvent = {
                header: {
                    id: webSocketID,
                    targetId: target,
                    type: WsEventType.Controll,
                },
                payload: videos,
            };
            ws.send(JSON.stringify(stateEvent));
        });



        EventHandler.addEventListener(EventTypes.RemoteAccessWS, (value) => {
            const stateEvent: IEvent = {
                header: {
                    id: webSocketID,
                    targetId: [value.detail.value],
                    type: WsEventType.StateRequest,
                },
                payload: {},
            };
            ws.send(JSON.stringify(stateEvent));

        });
    }

}