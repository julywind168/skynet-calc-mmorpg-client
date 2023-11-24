import { _decorator, Button, Component, Node } from 'cc';
import { AudioManager } from '../libs/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Window')
export class Window extends Component {

    @property({ type: Button })
    private btn_close = null;


    start() {
        this.btn_close.node.on(Button.EventType.CLICK, () => {
            AudioManager.playSound("click");
            this.node.active = false;
        })
    }
}

