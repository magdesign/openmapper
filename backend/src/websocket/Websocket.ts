import * as uuid from "uuid";
import * as log4js from "log4js";
import express = require('express');
import * as fs from 'fs';
import * as path from 'path';

import {Server} from "ws";
import { Config } from "../config";

let wss = new Server({port: Config.WebSocket.Port});
console.log("websocket listening on port " + Config.WebSocket.Port);

enum EventType {
    Registration = "Registration",
}

interface IEventHeader {
    id: string;
    targetId: string[];
    type: EventType;
    timestampServer?: string;
}

interface IEvent {
    header: IEventHeader;
    payload: any;
}

wss.on("connection", (ws: any) => {
    ws.id = uuid();
    console.log(ws.id);



    sendRegistrationRequest(ws.id, wss.clients);

    ws.on("message", (msg) => {
        console.log("Websocket => message");
        console.log(msg);
        wss.clients.forEach((client) => {
            console.log(msg);


            client.send(msg);
        });
    });

    ws.on("close", (client) => {
        console.log("Websocket => " + client);
    });
});

function sendRegistrationRequest(id: string, clients: any) {
    const ids = [];
    
    clients.forEach((client: any) => {
        ids.push(client.id);
    });



    clients.forEach((client) => {
        const event: IEvent = {
            header: {
                id: client.id,
                targetId: [client.id],
                type: EventType.Registration,
            },
            payload: {
                clients: ids,
            }
        }
        sendEvent(client, event);

    })
}

function sendEvent(client, event: IEvent) {
    const json: string = JSON.stringify(event);
    console.log(json);
    client.send(json);
}
