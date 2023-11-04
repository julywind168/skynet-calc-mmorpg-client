import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

import pubsub from '../libs/pubsub';
import network from '../network/network';


@ccclass('Subscriber')
export class Subscriber extends Component {


    private unsub_list = [];

    pub (name: string, params: object = null) {
        pubsub.pub(name, params);
    }

    sub (name: String, callback: Function) {
        let unsub = pubsub.sub(name, callback);
        this.unsub_list.push(unsub);
    }

    send_request (payload: any, callback: Function = null) {
        if (network.logged_in && network.sock.readyState == network.sock.OPEN) {
            if (callback) {
                let event_name = "_network_response_" + (network.session + 1);
                this.sub(event_name, callback);
            }
            network.send(payload);
        }
    }

    onDestroy () {
        for (let i = 0; i < this.unsub_list.length; i++) {
            const unsub = this.unsub_list[i];
            unsub();
        }
    }
}