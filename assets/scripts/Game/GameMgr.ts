import { _decorator, Component, instantiate, log, Node, Prefab, sp, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import global from '../global';
import { OtherAvatar } from './OtherAvatar';
import timer from '../libs/timer';
import { Subscriber } from '../classes/Subscriber';
import network from '../network/network';
import config from '../config';


@ccclass('GameMgr')
export class GameMgr extends Subscriber {

    public static ins: GameMgr = null;

    @property({ type: Prefab})
    private pfb_other_avatar = null;

    others = {};

    /**
     * get_player_position
     */
    public get_player_position(pid: string) {
        let p = this.others[pid];
        if (p) {
            return p.position().clone();
        }
    }

    protected onLoad(): void {
        for (let index = 0; index < global.scene.players.length; index++) {
            const p = global.scene.players[index];
            if (p.id != global.me.id) {
                let obj = instantiate(this.pfb_other_avatar);
                obj.getComponent(OtherAvatar).init(p.id, p.x, p.y);
                this.node.addChild(obj);
                this.others[p.id] = obj.getComponent(OtherAvatar);

                if (p.hp == 0) {
                    this.others[p.id].dead();
                }
            }
        }
        GameMgr.ins = this;
    }

    guess (position: any, time: number) {
        position.x += position.direction.x * position.speed * time;
        position.y += position.direction.y * position.speed * time;
        this.fix_dest(position);
        return position;
    }

    // 不能超过地图
    private fix_dest(dest: any) {
        let min_x = -config.map_width/2 + config.avatar_half_body;
        let max_x = config.map_width/2 - config.avatar_half_body;

        let min_y = -config.map_height/2 + config.avatar_half_body + config.avatar_id_height;
        let max_y = config.map_height/2 - config.avatar_half_body;

        if (dest.x > max_x) {
            dest.x = max_x;
        } else if (dest.x < min_x) {
            dest.x = min_x;
        }
        if (dest.y > max_y) {
            dest.y = max_y;
        } else if (dest.y < min_y) {
            dest.x = min_y;
        }
    }

    protected start(): void {

        this.sub("network_closed", () => {
            alert("网络连接错误");
        })

        this.sub("hit_other", (e) => {
            let p = this.others[e.id];
            if (p) {
                p.show_damage(e.damage, e.dead);
            }
        })

        this.sub("server_scene_player_revived", (data) => {
            if (data.pid == global.me.id) {
                global.me.scene.hp = 100;
                this.pub("im_revived");
                this.pub("my_hp_changed");
            } else {
                let p = this.others[data.pid];
                if (p) {
                    p.revive();
                }
            }
        })

        this.sub("server_scene_player_joined", (data) => {
            let p = data.p;
            let obj = instantiate(this.pfb_other_avatar);
            obj.getComponent(OtherAvatar).init(p.id, p.x, p.y);
            this.node.addChild(obj);
            this.others[p.id] = obj.getComponent(OtherAvatar);
            if (p.hp == 0) {
                this.others[p.id].dead();
            }
        })

        this.sub("server_scene_player_leaved", (data) => {
            let pid = data.pid;
            let p = this.others[pid];
            if (p) {
                p.exit();
            }
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

