import { _decorator, Component, Button, Prefab, instantiate, Node, Vec3 } from 'cc';
import { AudioManager } from '../libs/AudioManager';

import time from '../utils/os';
import { SwordType } from '../enum';
import { Sword } from '../../prefabs/Swords/Sword';

import { Joystick } from '../classes/Joystick';

const { ccclass, property } = _decorator;


// ms
const ATTACK_CD = 500;

@ccclass('AvatarAttack')
export class AvatarAttack extends Component {

    @property({ type: Node })
    private avatar: Node = null;

    @property({ type: Button })
    private btn_attack = null;

    @property({ type: Prefab })
    private pfb_ice_sword = null;

    @property({ type: Prefab })
    private pfb_fire_sword = null;


    attack_time = 0;
    attack_count = 0;


    start() {
        this.btn_attack.node.on(Button.EventType.CLICK, () => {

            // AudioManager.playSound("click");
            let now = time.now();
            if (now - this.attack_time >= ATTACK_CD) {
                this.attack_time = now;
                let type = SwordType.IceSword;
                if (this.attack_count == 3) {
                    this.attack_count = 0;
                    type = SwordType.FireSword;
                } else {
                    this.attack_count += 1;
                }

                let obj: Node = instantiate(type == SwordType.IceSword && this.pfb_ice_sword || this.pfb_fire_sword)
                this.node.addChild(obj);

                obj.getComponent(Sword).fly(this.avatar.getPosition().clone(), Joystick.ins.calculateAngle(), type);
            }
        })
    }
}

