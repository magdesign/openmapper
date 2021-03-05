export interface IEventHeader {
    id: string;
    targetId: string[];
    type: WsEventType;
    timestampServer?: string;
}

export interface IEvent {
    header: IEventHeader;
    payload: any;
}

export enum WsEventType {
    Registration = "Registration",
    StateRequest = "StateRequest",
    StateResponse = "StateResponse",
    Controll = "Controll",
}
