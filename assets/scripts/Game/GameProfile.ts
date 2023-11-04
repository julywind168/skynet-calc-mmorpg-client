import { _decorator, Label, Node } from 'cc';
import { Subscriber } from '../classes/Subscriber';
import global from '../global';
const { ccclass, property } = _decorator;

@ccclass('GameProfile')
export class GameProfile extends Subscriber {

    @property({ type: Label})
    private lab_id = null;

    protected onLoad(): void {
        this.lab_id.string = "ID: " + global.me.id;
    }
}

