import { v3 } from 'cc';
import { v2 } from 'cc';
import { EventTouch } from 'cc';
import { _decorator, Component, Node, NodeEventType, UITransform, Vec2 } from 'cc';
import pubsub from '../libs/pubsub';
const { ccclass, property } = _decorator;

@ccclass('Joystick')
export class Joystick extends Component {

    public static ins: Joystick = null;

    @property({ type: Node, displayName: '摇杆bg' })
    node_dotBg: Node = null;
    @property({ type: Node, displayName: '摇杆中间点' })
    node_dot: Node = null;

    /** node_dotBg的UITransform组件*/
    UITf_dot: UITransform = null;
    /** 摇杆移动的最大半径 */
    maxLength: number = 0;

    /** 方向 */
    private _dir: Vec2 = new Vec2(0, 0);
    public get dir(): Vec2 {
        return this._dir;
    }
    public set dir(value: Vec2) {
        this._dir = value;
    }

    /** 角度 */
    roleAngle: number = 0;


    onLoad() {
        if (Joystick.ins == null) {
            Joystick.ins = this;
        }
        this.init();
    }

    init() {
        this.UITf_dot = this.node_dotBg.getComponent(UITransform);
        this.maxLength = this.node_dotBg.getComponent(UITransform).width / 2;

        this.node_dotBg.on(NodeEventType.TOUCH_START, this.onTouchMove, this);
        this.node_dotBg.on(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node_dotBg.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.node_dotBg.on(NodeEventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    /** 触摸移动 */
    private onTouchMove(event: EventTouch) {
        // 获取世界坐标
        let worldPos = event.getUILocation();
        // 摇杆点是dotBg的子节点，所以要转换成dotBg的局部坐标
        let localPos = this.UITf_dot.convertToNodeSpaceAR(v3(worldPos.x, worldPos.y, 0));
        let length = localPos.length();
        if (length > 0) {
            //  只计算方向
            this.dir.x = localPos.x / length;
            this.dir.y = localPos.y / length;
            // 计算最外一圈的x,y位置
            if (length > this.maxLength) {
                localPos.x = this.maxLength * this.dir.x;
                localPos.y = this.maxLength * this.dir.y;
            }
            this.node_dot.setPosition(localPos);
        }
        pubsub.pub("joystick_changed");
    }

    /** 触摸结束 */
    private onTouchEnd(event: NodeEventType) {
        this.dir = v2(0, 0);
        this.node_dot.setPosition(0, 0, 0);
        pubsub.pub("joystick_changed");
    }

    /** 求角度 */
    public calculateAngle() {
        if (this.dir.x == 0 && this.dir.y == 0) return this.roleAngle;
        // 计算单位向量相对于正右方向的角度（以弧度表示）
        let angleRad = Math.atan2(this.dir.y, this.dir.x);
        // 将弧度转换为角度（以度数表示）
        this.roleAngle = angleRad * 180 / Math.PI;
        return this.roleAngle;
    }
}

