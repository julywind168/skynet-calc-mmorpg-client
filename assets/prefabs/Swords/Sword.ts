import { _decorator, Color, Component, Node, Sprite, tween, Vec3 } from 'cc';
import timer from '../../scripts/libs/timer';
const { ccclass, property } = _decorator;

import {SwordType} from "../../scripts/enum";


const ICE_DISTANCE = 400;
const FIRE_DISTANCE = 500;

const ICE_FLY_TIME = 0.8;
const FIRE_FLY_TIME = 1;


function rad(angel: number) :number {
    return angel / 180 * Math.PI;
}


class BindTarget{
    a : number
}


@ccclass('Sword')
export class Sword extends Component {

    private slow_destory() {
        let sprite : Sprite = this.node.getComponent(Sprite);
        let color : Color = sprite.color.clone();
        let bindTarget : BindTarget = new BindTarget();
        bindTarget.a = 255;
        tween(bindTarget)
            .to( 0.1, { a: 0 }, {
                onUpdate(tar:BindTarget){
                    color.a = tar.a;
                    sprite.color = color;
                }
        })
        .call(() => {
            this.node.removeFromParent();
            this.node.destroy();
        })
        .start();
    }

    /**
     * fly
     * 向当前方向飞行
     */
    public fly(position: Vec3, angle: any, type: SwordType) {

        let distance = type == SwordType.IceSword && ICE_DISTANCE || FIRE_DISTANCE;
        let time = type == SwordType.IceSword && ICE_FLY_TIME || FIRE_FLY_TIME;


        this.node.setPosition(position);
        this.node.setRotationFromEuler(new Vec3(0, 0, angle - 90));
        let offsetX = distance * Math.cos(rad(angle));
        let offsetY = distance * Math.sin(rad(angle));

        tween(this.node.position).to(time, new Vec3(
                this.node.position.x + offsetX,
                this.node.position.y + offsetY,
                0
            ),
            {   
                easing: "cubicOut",  
                onUpdate : (target:Vec3, ratio:number)=>{      
                    this.node.position = target;
                },
                
            })
            .call(() => {
                this.slow_destory();
            })
            .start(); 
    }
}

