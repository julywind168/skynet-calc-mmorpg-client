import { _decorator, Prefab, Node, instantiate, isValid } from 'cc';
import { Subscriber } from '../../scripts/classes/Subscriber';
import { Tooltips } from '../popups/Tooltips';
import ui from '../../scripts/utils/ui';
import timer from '../../scripts/libs/timer';
const { ccclass, property } = _decorator;

@ccclass('PopupMgr')
export class PopupMgr extends Subscriber {

    @property({ type: Prefab})
    private pfb_tooltips = null;

    @property({ type: Prefab})
    private pfb_setting = null;


    // 弹框 相同的只能显示一个，不同的可以都显示
    single_popup = {};

    onLoad() {
        this.single_popup["setting"] = {prefab: this.pfb_setting, instance: null};
    }

    start () {
        this.sub("show_tooltips", ui.event_queue(400, (e: any) => {
            let obj = instantiate(this.pfb_tooltips);
            obj.getComponent(Tooltips).init(e.text);
            this.node.addChild(obj);
        }))

        this.sub("show_popup", (e:any) => {
            let name = e.name;
            let popup = this.single_popup[name];
            if (popup) {
                if (popup.instance && isValid(popup.instance) ) {
                    console.log("WARN ========= " + name + " already popup");
                } else {
                    let obj = instantiate(popup.prefab);
                    popup.instance = obj;
                    this.node.addChild(obj);
                }
            } else {
                console.log("ERROR ========= not found", name);
            }
        })


        // test
        // timer.setTimeout(() => {
        //     this.pub("show_tooltips", {text : "这个一条测试信息！"});
        //     this.pub("show_tooltips", {text : "这个一条测试信息2！"});
        // }, 1000);
    }
}

