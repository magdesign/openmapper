import express = require('express');
import * as fs from 'fs';
import * as path from 'path';
import { Config } from '../config';

const subpath = "assets/media/video/";
const folder = "../client/" + subpath;

const app = express();

app.use((req, res, next) => {
    Config.Rest.Headers.map((header) => res.header(header.key, header.value));
    next();
});

app.get("/rest/videos/", (req, res) => {
    let data = fs.readdirSync(folder)
                .map((file) => subpath + file);

    console.log("Rest => access on video");
    res.send(data);
});

app.listen(Config.Rest.Port, () => {
    console.log('rest listening on port ' + Config.Rest.Port);
});
