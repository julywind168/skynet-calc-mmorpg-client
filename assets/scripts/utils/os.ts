const time = {
    ONEDAY: 86400,

    now () {
        return new Date().getTime();
    },

    timestamp () {
        return Math.floor(this.now()/1000);
    }

}


export default time;