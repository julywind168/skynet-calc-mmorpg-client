import { _decorator, Canvas, Component, Director, view, math, Node, Vec3, screen, sys, log } from 'cc';
import config from './config';
const { ccclass, property } = _decorator;

@ccclass('AvatarCamera')
export class AvatarCamera extends Component {

    @property(Node)
    avatar: Node;

    viewport = {width: 0, height: 0};

    min_x: number = 0;
    max_x: number = 0;

    min_y: number = 0;
    max_y: number = 0;

    start() {
        let design_size = view.getDesignResolutionSize();        
        let window = screen.windowSize;


        // 适配屏幕宽度 (手机横屏)
        if (sys.isMobile) {
            this.viewport.height = design_size.height;
            this.viewport.width = window.width/(window.height/design_size.height);
        } else {
            this.viewport.width = design_size.width;
            this.viewport.height = design_size.height;
        }

        this.min_x = -config.map_width/2 + this.viewport.width/2 + config.avatar_half_body;
        this.max_x = config.map_width/2 - this.viewport.width/2 - config.avatar_half_body;

        this.min_y = -config.map_height/2 + this.viewport.height/2;
        this.max_y = config.map_height/2 - this.viewport.height/2;


        // console.log("min_x", this.min_x);
        // console.log("max_x", this.max_x);

        // console.log("min_y", this.min_y);
        // console.log("max_y", this.max_y);
    }


    // 摄像机是角色的子节点
    // 当角色达到视界边缘后 摄像机要反向移动 
    position: Vec3 = new Vec3(0, 0, 0);

    update(deltaTime: number) {

        let pos = this.avatar.getPosition();

        if (pos.x < this.min_x) {
            this.position.x = this.min_x - pos.x;
        } else if (pos.x > this.max_x) {
            this.position.x = this.max_x - pos.x;
        } else {
            this.position.x = 0;
        }

        if (pos.y < this.min_y) {
            this.position.y = this.min_y - pos.y;
        } else if (pos.y > this.max_y) {
            this.position.y = this.max_y - pos.y;
        } else {
            this.position.y = 0;
        }

        this.node.setPosition(this.position);
    }
}

