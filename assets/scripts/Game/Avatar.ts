import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Label, Node, Vec3 } from 'cc';
import global from '../global';
import timer from '../libs/timer';
import { Subscriber } from '../classes/Subscriber';
import config from '../config';
const { ccclass, property } = _decorator;

enum Direction {
    Up = 1,
    Left,
    Down,
    Right
}

const SPEED = config.avatar_speed;

@ccclass('Avatar')
export class Avatar extends Subscriber {

    @property({ type: Label})
    private lab_id = null;

    private speed = 0;
    private direction = Direction.Up;

    onLoad () {
        this.lab_id.string = global.me.id;
        this.node.setPosition(new Vec3(
            global.me.scene.x,
            global.me.scene.y,
            0
        ));

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy () {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown (event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.direction = Direction.Up;
                this.speed = SPEED;
                this.upload_my_position();
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.direction = Direction.Left;
                this.speed = SPEED;
                this.upload_my_position();
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.direction = Direction.Down;
                this.speed = SPEED;
                this.upload_my_position();
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.direction = Direction.Right;
                this.speed = SPEED;
                this.upload_my_position();
                break;
        }
    }

    onKeyUp (event: EventKeyboard) {
        if (this.speed != 0) {
            this.speed = 0;
            this.upload_my_position();
        }
        
    }

    my_position () {
        let pos = this.node.position;
        return {
            x: pos.x,
            y: pos.y,
            speed: this.speed,
            direction: this.direction
        }
    }

    upload_my_position() {
        this.send_request(["scene_sync_my_position", global.me.scene.id, this.my_position()]);
    }

    protected start(): void {
        timer.setInterval(() => {
            this.upload_my_position();
        }, 1000)
    }

    protected update(dt: number): void {
        if (this.speed > 0) {
            let pos = this.node.position.clone();

            switch (this.direction) {
                case Direction.Up:
                    pos.y += this.speed*dt;
                    break;
                case Direction.Down:
                    pos.y -= this.speed*dt;
                    break;
                case Direction.Left:
                    pos.x -= this.speed*dt;
                    break;
                case Direction.Right:
                    pos.x += this.speed*dt;
                    break;
                default:
                    break;
            }
            this.node.setPosition(pos);
        }
    }
}

