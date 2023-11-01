import { director, log } from 'cc';

import pubsub from '../libs/pubsub';
import request from './request';
import response from './response';

const network = {
    url: "",
    id: "",
    password: "",
    token: "",
    sock: null,

    connecting: false,
    logged_in: false,
    session: 0,
    msgidx: 0,
    request: new Map<Number, Object>(),

    on_open() {
        if (this.logged_in == false) {
            // login
            this.sock.send(JSON.stringify({cmd: "login", id: this.id, password: this.password}));
        } else {
            // reconnect
            this.sock.send(JSON.stringify({cmd: "reconnect", id: this.id, token: this.token, msgidx: this.msgidx}));
        }
    },

    on_message(event) {
        let data = JSON.parse(event.data);

        if (this.connecting) {
            this.connecting = false;

            if (this.logged_in == false) {
                // login
                if (data.ok) {
                    this.logged_in = true;   
                }
                pubsub.pub("network_login_result", data);
            } else {
                // reconnect
                pubsub.pub("network_reconnect_result", data);
            }
        } else {
            this.msgidx = data.index;

            let callback = null;
            // request (server push)
            if (data.session == 0) {
                callback = request[data.cmd];
                if (callback) {
                    callback(data);
                }
                
                pubsub.pub("server_" + data.cmd, data);
            // response
            } else {
                let req = this.request.get(data.session);
                if (req) {
                    callback = response[req.name];
                    if (callback) {
                        callback(data);
                    }
                    pubsub.pub("_network_response_" + data.session, data);
                }
            }
        }
    },

    on_close(event) {
        pubsub.pub("network_closed");
    },

    on_error(event) {
        console.log("Websoct error", event);
    },

    heartbeat: false,

    start_heartbeat() {
        if (this.heartbeat == false) {
            this.heartbeat = true;
            setInterval(() => {
                this.send(["heartbeat"]);
            }, 5000);
        }
    },

    send(payload: any) {
        if (this.logged_in && this.sock.readyState == this.sock.OPEN) {
            this.session++;
            this.request.set(this.session, {
                "name": payload[0],
            })
            this.sock.send(JSON.stringify({"session": this.session, payload: payload}))
        }
    },

    close() {
        if (this.sock != null) {
            this.sock.close();
            this.sock = null;
        }
    },

    logout() {
        this.connecting = false;
        this.session = 0;
        this.msgidx = 0;
        this.request = new Map<Number, Object>();
        this.logged_in = false;
        this.close();
    },


    init(url: string, id: string, password: string) {
        this.url = url;
        this.id = id;
        this.password = password;
    },

    connect() {
        this.connecting = true;

        this.sock = new WebSocket(this.url);
        this.sock.onopen = this.on_open.bind(this);
        this.sock.onmessage = this.on_message.bind(this);
        this.sock.onclose = this.on_close.bind(this);
        this.sock.onerror = this.on_error.bind(this);
    }
}

export default network;