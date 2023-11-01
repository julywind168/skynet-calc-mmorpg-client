import { _decorator, Component, Node, Label, tween, Vec3 } from 'cc';
import { Subscriber } from '../../scripts/classes/Subscriber';
import timer from '../../scripts/libs/timer';
const { ccclass, property } = _decorator;

@ccclass('Tooltips')
export class Tooltips extends Subscriber {
    @property({ type: Label})
    private label = null;

    init(text: string) {
        this.label.string = text;
        tween()
        .target(this.node)
        .to(0.2, {scale: new Vec3(1, 1, 1)})
        .by(1.0, {
            position: new Vec3(0, 200, 0),
            easing: "backIn",
        })
        .start();

        timer.setTimeout(() => {
            this.node.destroy();
        }, 2000);
    }
}

