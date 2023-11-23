import { _decorator, Button, Component, Node } from 'cc';
import { Subscriber } from '../classes/Subscriber';
import global from '../global';
const { ccclass, property } = _decorator;

@ccclass('GameUIMgr')
export class GameUIMgr extends Subscriber {

    @property({ type: Node})
    private restart_panel = null;


    start() {
        if (global.me.scene.hp == 0) {
            this.restart_panel.active = true;
        }

        this.sub("im_dead", () => {
            this.restart_panel.active = true;
        })
        this.sub("im_revived", () => {
            this.restart_panel.active = false;
        })
    }

}

