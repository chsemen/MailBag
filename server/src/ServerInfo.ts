const path = require("path");
const fs = require("fs");

export interface IServerInfo {
    smtp: {
        host: string, port: number,
        auth: { user: string, pass: string }
        secureConnection: boolean
    },
    imap: {
        host: string, port: number,
        auth: { user: string, pass: string },
        useSecureTransport: boolean,
        requireTLS : boolean,
        id : {name: string, version: string}
    }
}

export let serverInfo: IServerInfo;

const rawInfo: string =
    fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
serverInfo = JSON.parse(rawInfo)