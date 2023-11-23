import { _decorator, Button, Component, Label, Node } from 'cc';
import { Subscriber } from '../classes/Subscriber';
import global from '../global';
import timer from '../libs/timer';
import { AudioManager } from '../libs/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('RestartPanel')
export class RestartPanel extends Subscriber {

    @property({ type: Label})
    private lab_tip = null;

    @property({ type: Node})
    private btn_restart = null;


    handle: number = -1;
    time: number = 10;

    protected onEnable(): void {
        this.time = 10;
        this.lab_tip.string = "复活中 (10)";
        this.btn_restart.active = false;

        this.handle = timer.setInterval(() => {
            this.time -= 1;
            this.lab_tip.string = "复活中 (" + this.time + ")";
            if (this.time == 0) {
                this.btn_restart.active = true;
                clearInterval(this.handle);
            }
        }, 1000);
    }

    start() {
        this.btn_restart.on(Button.EventType.CLICK, () => {

            AudioManager.playSound("click");
            this.send_request("scene_revive", {
                sid: global.me.scene.id,
                pid: global.me.id
            }, (r: any) => {
                if (r.err) {
                    alert(r.err);
                }
            })
        })
    }
}

