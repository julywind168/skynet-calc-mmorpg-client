import { AudioManager } from "../libs/AudioManager";
import timer from "../libs/timer";
import os from "./os";

const ui = {

    event_queue(dealy: number, handler: Function) {
        let queue = [];
        let running = false;

        let run = () => {
            if (running) {
                return;
            }
            if (queue.length == 0) {
                return;
            }

            running = true;
            timer.setTimeout(() => {
                running = false;
                run();
            }, dealy);
            handler(queue.shift());
        }
        
        return (e: any) => {
            queue.push(e);
            run();
        }
    },

    button_cooldown_handler(cd_seconds: number, handler: Function, cooldown: Function = null) {
        let click_time = 0;
        return () => {
            AudioManager.playSound("click");
    
            let now = os.now();
            let ms = now - click_time;
            if (ms >= cd_seconds*1000) {
                click_time = now;
                handler();
            } else {
                console.log("this button handler in cooldown, still need wait " + (cd_seconds*1000 - ms)/1000 + "s");
                if (cooldown) {
                    cooldown();
                }
            }
        }
    }

}


export default ui;