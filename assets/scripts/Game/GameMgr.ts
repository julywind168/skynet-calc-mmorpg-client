import { _decorator, Component, instantiate, log, Node, Prefab, sp, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import global from '../global';
import { OtherAvatar } from './OtherAvatar';
import timer from '../libs/timer';
import { Subscriber } from '../classes/Subscriber';
import network from '../network/network';
import config from '../config';

enum Direction {
    Up = 1,
    Left,
    Down,
    Right
}

@ccclass('GameMgr')
export class GameMgr extends Subscriber {

    @property({ type: Prefab})
    private pfb_other_avatar = null;

    others = {};


    protected onLoad(): void {
        log("GameMgr load....", global.scene.players.length);

        for (let index = 0; index < global.scene.players.length; index++) {
            const p = global.scene.players[index];
            if (p.id != global.me.id) {
                let obj = instantiate(this.pfb_other_avatar);
                obj.getComponent(OtherAvatar).init(p.id, p.x, p.y);
                this.node.addChild(obj);
                this.others[p.id] = obj.getComponent(OtherAvatar);
            }
        }
    }

    guess (position: any, time: number) {
        position.x += position.direction.x * position.speed * time;
        position.y += position.direction.y * position.speed * time;
        return position;
    }

    protected start(): void {

        this.sub("server_scene_player_joined", (data) => {
            let p = data.p;
            let obj = instantiate(this.pfb_other_avatar);
            obj.getComponent(OtherAvatar).init(p.id, p.x, p.y);
            this.node.addChild(obj);
            this.others[p.id] = obj.getComponent(OtherAvatar);
        })

        this.sub("server_scene_sync_position", (data) => {
            if (data.pid == global.me.id) {
                let position = this.guess(data.position, network.rtt/1000/2);
                // todo
                // 如果预测位置与我的位置相差太大, 则跳到该预测位置(服务器认可位置)

            } else {
                let p = this.others[data.pid];
                if (p) {

                    // 预测1秒后的位置
                    let time = 1.0;
                    let position = this.guess(data.position, time + network.rtt/1000/2);

                    // 计算移动速度,如果低于 默认速度 SPEED(200)，则用 SPEED 速度计算出时间
                    let distance = this.calc_distance(position, p.position());
                    let speed = distance/time;
                    if (speed < config.avatar_speed) {
                        speed = config.avatar_speed;
                        time = distance/speed;
                    }

                    // 如果当前玩家是静止不动状态, 此时应该以极快的速度, 纠正位置
                    if (position.direction.x == 0 && position.direction.y == 0 && time > 0.1) {
                        time = 0.1;
                    }
                    p.moveto(new Vec3(position.x, position.y, 0), time);
                }
            }
        })
    }

    calc_distance(p1: any, p2: any) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }


    onDestroy(): void {
        super.onDestroy();
        timer.clearAll();
    }
}

