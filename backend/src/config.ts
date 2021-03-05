export const Config = {
    Rest: {
        Port: 3000,
        Headers: [
            {key: "Access-Control-Allow-Origin", value: "*"},
            {key: "Access-Control-Allow-Headers", value: "Origin, X-Requested-With, Content-Type, Accept"},
        ],
    },
    WebSocket: {
        Port: 9030,
    }
}
