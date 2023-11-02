import { _decorator, Button, Component, director, EditBox, log, Node, sys } from 'cc';
import { Subscriber } from '../classes/Subscriber';
import network from '../network/network';
import { AudioManager } from '../libs/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Subscriber {
    @property({ type: EditBox})
    private input_id = null;

    @property({ type: EditBox})
    private input_pswd = null;

    @property({ type: Button })
    private btn_login = null;

    protected onLoad(): void {
        let pid = sys.localStorage.getItem("account_pid");
        let pswd = sys.localStorage.getItem("account_pswd");
        this.input_id.string = pid || "";
        this.input_pswd.string = pswd || "";

        this.sub("network_login_result", (r) => {
            if (r.ok) {
                network.start_heartbeat();
                log("登陆成功", r);
                director.loadScene("game");
            } else {
                alert("登陆失败: " + r.err);
            }
        })

        this.sub("network_closed", () => {
            alert("网络连接错误");
        })
    }

    protected start(): void {
        this.btn_login.node.on(Button.EventType.CLICK, () => {
            AudioManager.playSound("click");
            log(this.input_id.string, this.input_pswd.string);

            if (this.input_id.string != "" && this.input_pswd.string != "") {

                network.init("ws://127.0.0.1:8888", this.input_id.string, this.input_pswd.string);
                network.connect();
            }
        })
    }
}

