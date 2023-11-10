import { _decorator, Component, Label, log, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OtherAvatar')
export class OtherAvatar extends Component {
    @property({ type: Label})
    private lab_id = null;

    private t = null;

    /**
     * init
     */
    public init(id: string, x: number, y: number) {
        this.lab_id.string = id;
        this.node.setPosition(new Vec3(x, y, 0));
        this.node.active = true;
    }

    /**
     * moveto
     */
    public moveto(dest: Vec3, time: number) {
        if (this.t) {
            this.t.stop();
        }
        this.t = tween(this.node.position).to( time, dest,                  // 这里以node的位置信息坐标缓动的目标 
            {                                                               // ITweenOption 的接口实现：
            onUpdate : (target:Vec3, ratio:number)=>{                       // onUpdate 接受当前缓动的进度
                this.node.position = target;                                // 将缓动系统计算出的结果赋予 node 的位置
            }
        }).start(); 
    }

    /**
     * position
     */
    public position() {
        return this.node.getPosition();
    }

    /**
     * exit
     */
    public exit() {
        this.node.removeFromParent();
        this.node.destroy();
    }
}

