import { assert } from "cc";

const pubsub = {

    listeners: new Map<String, Array<Function>>(),

    event_queue(name: String) :Array<Function> {
        if (!this.listeners.has(name)) {
            this.listeners.set(name, new Array<Function>);
        }

        return this.listeners.get(name);
    },

    pub (name: String, event: Object = null) {
        console.log("PUB ===", name, event);
        
        let queue = this.event_queue(name);
        for (let i = 0; i < queue.length; i++) {
            queue[i](event);
        }
    },

    sub (name: String, callback: Function) {
        let queue = this.event_queue(name);
        queue.push(callback);

        return () => {
            for (let i = 0; i < queue.length; i++) {
                if (queue[i] == callback) {
                    queue.splice(i, 1);
                }
            }
        }
    },

    sub_once (name: String, callback: Function) {
        let unsub = null; unsub = this.sub(name, function(event: Object) {
            unsub();
            callback(event);
        });
        return unsub;
    },

    sub_many (name: String, callback: Function, num: number) {
        assert(num >= 1);
        let count = 0;
        let unsub = null; unsub = this.sub(name, function(event: Object) {
            count += 1;
            if (count == num) {
                unsub();
            }
            callback(event);
        });
        return unsub;
    }
};


export default pubsub;