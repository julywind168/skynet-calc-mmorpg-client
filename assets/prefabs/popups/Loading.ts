import { _decorator, Component, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends Component {
    start() {
        tween(this.node).by(1.0, {
            angle: 180
        }).repeatForever().start();
    }
}

