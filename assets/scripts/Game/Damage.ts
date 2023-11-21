import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Damage')
export class Damage extends Component {

    init(text: string) {
        this.node.getComponent(Label).string = text;

        tween(this.node.position).by(1.2, new Vec3(0, 80, 0),
        {   
            easing: "cubicIn",  
            onUpdate : (target:Vec3, ratio:number)=>{      
                this.node.position = target;
            },
            
        })
        .call(() => {
            this.node.removeFromParent();
            this.node.destroy();
        })
        .start(); 
    }
}

