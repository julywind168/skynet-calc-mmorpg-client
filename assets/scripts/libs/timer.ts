const timer = {

    timeout_list: [],
    interval_list: [],

    setInterval(handler, timeout) {
        let id = setInterval(handler, timeout);
        this.interval_list.push(id);
        return id;
    },

    clearAllInterval() {
        for (let i = 0; i < this.interval_list.length; i++) {
            const id = this.interval_list[i];
            clearTimeout(id);
        }
        this.interval_list = [];
    },

    setTimeout(handler, timeout) {
        let id = setTimeout(handler, timeout);
        this.timeout_list.push(id);
        return id;
    },

    clearAllTimeout() {
        for (let i = 0; i < this.timeout_list.length; i++) {
            const id = this.timeout_list[i];
            clearTimeout(id);
        }
        this.timeout_list = [];
    },

    clearAll() {
        console.log("timer clear all ....");
        this.clearAllInterval();
        this.clearAllTimeout();
    }
};

export default timer;