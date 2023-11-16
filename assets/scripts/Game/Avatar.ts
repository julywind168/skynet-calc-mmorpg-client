import { _decorator, Label, Vec2, Vec3 } from 'cc';
import global from '../global';
import timer from '../libs/timer';
import { Subscriber } from '../classes/Subscriber';
import { Joystick } from '../classes/Joystick';
import config from '../config';
import pubsub from '../libs/pubsub';

const { ccclass, property } = _decorator;


const SPEED = config.avatar_speed;

@ccclass('Avatar')
export class Avatar extends Subscriber {

    @property({ type: Label})
    private lab_id = null;

    private direction = new Vec2(0, 0);
    private joystick_changed = false;

    onLoad () {
        this.lab_id.string = global.me.id;
        this.node.setPosition(new Vec3(
            global.me.scene.x,
            global.me.scene.y,
            0
        ));
    }

    my_position () {
        let pos = this.node.position;
        return {
            x: pos.x,
            y: pos.y,
            speed: SPEED,
            direction: {
                x: this.direction.x,
                y: this.direction.y
            }
        }
    }

    limit_upload(interval) {
        let working = false;
        let next_payload = null

        let upload = (payload) => {
            if (working == false) {
                working = true;
                this.send_request(payload.name, payload.params);
                timer.setTimeout(() => {
                    working = false;
                    if (next_payload) {
                        upload(next_payload);
                        next_payload = null;
                    }
                }, interval)
            } else {
                next_payload = payload;
            }
        }
        return upload;
    }

    private position_uploader = this.limit_upload(300);

    upload_my_position() {
        this.position_uploader({name: "scene_sync_my_position", params:{pid: global.me.id, sid: global.me.scene.id, position: this.my_position()}});
    }

    protected start(): void {
        pubsub.sub("joystick_changed", () => {
            this.joystick_changed = true;
        })

        timer.setInterval(() => {
            this.upload_my_position();
        }, 1000)
    }

    protected update(dt: number): void {
        this.direction = Joystick.ins.dir.normalize();

        if (this.direction.x != 0 || this.direction.y != 0) {
            let pos = this.node.getPosition();
            let posx = pos.x + this.direction.x * SPEED * dt;
            let posy = pos.y + this.direction.y * SPEED * dt;

            if (config.in_map_width(posx)) {
                pos.x = posx;
            }
            if (config.in_map_height(posy)) {
                pos.y = posy;
            }
            this.node.setPosition(pos);
        }

        if (this.joystick_changed) {
            this.joystick_changed = false;
            this.upload_my_position();
        }
    }
}

