import { _decorator, Button, Component, director, EditBox, log, Node, sys } from 'cc';
import { Subscriber } from '../classes/Subscriber';
import network from '../network/network';
import { AudioManager } from '../libs/AudioManager';
import global from '../global';
import config from '../config';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Subscriber {
    @property({ type: EditBox})
    private input_id = null;

    @property({ type: EditBox})
    private input_pswd = null;

    @property({ type: Button })
    private btn_login = null;

    @property({ type: Button })
    private btn_readme = null;

    @property({ type: Node })
    private node_readme = null;

    protected onLoad(): void {
        let pid = sys.localStorage.getItem("account_pid");
        let pswd = sys.localStorage.getItem("account_pswd");
        this.input_id.string = pid || "";
        this.input_pswd.string = pswd || "";

        this.sub("network_login_result", (r) => {
            if (r.ok) {
                // network.start_heartbeat();
                log("登陆成功", r);

                sys.localStorage.setItem("account_pid", this.input_id.string);
                sys.localStorage.setItem("account_pswd", this.input_pswd.string);

                global.me = r.p;
                network.token = r.token;

                this.send_request("scene_join", {pid: global.me.id, sid: r.p.scene.id, rtt: network.rtt}, (scene: any) => {
                    global.scene = scene

                    log("scene_join", scene);

                    director.loadScene("game");
                })
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

            if (this.input_id.string != "" && this.input_pswd.string != "") {
                this.pub("show_popup", {name: "loading"});
                network.init(config.server_url, this.input_id.string, this.input_pswd.string);
                network.connect();
            }
        })
        this.btn_readme.node.on(Button.EventType.CLICK, () => {
            AudioManager.playSound("click");
            this.node_readme.active = true;
        })
    }
}

