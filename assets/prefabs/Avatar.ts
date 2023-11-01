import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Node } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('Avatar')
export class Avatar extends Component {

    private pressed = KeyCode.NONE;
    private speed = 4;

    onLoad () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy () {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown (event: EventKeyboard) {
        this.pressed = event.keyCode;
    }

    onKeyUp (event: EventKeyboard) {
        this.pressed = KeyCode.NONE;
    }

    protected update(dt: number): void {

        let pos = null;
        switch (this.pressed) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                pos = this.node.position.clone();
                pos.y += this.speed;
                this.node.setPosition(pos);
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                pos = this.node.position.clone();
                pos.x -= this.speed;
                this.node.setPosition(pos);
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                    pos = this.node.position.clone();
                    pos.y -= this.speed;
                    this.node.setPosition(pos);
                    break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                pos = this.node.position.clone();
                pos.x += this.speed;
                this.node.setPosition(pos);
                break;
        }
    }
}

