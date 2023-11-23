import { _decorator, Label, Node } from 'cc';
import { Subscriber } from '../classes/Subscriber';
import global from '../global';
const { ccclass, property } = _decorator;

@ccclass('GameProfile')
export class GameProfile extends Subscriber {

    @property({ type: Label})
    private lab_id = null;

    @property({ type: Label})
    private lab_hp = null;

    protected onLoad(): void {
        this.lab_id.string = "ID: " + global.me.id;
        this.lab_hp.string = "HP: " + global.me.scene.hp;
    }
    
    protected start(): void {
        this.sub("my_hp_changed", () => {
            this.lab_hp.string = "HP: " + global.me.scene.hp;
        })
    }
}

