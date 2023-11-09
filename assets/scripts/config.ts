let config = {

    server_url: "ws://127.0.0.1:8888",
    // server_url: "ws://120.55.57.93:8888",
    avatar_speed: 200,

    avatar_half_body: 25,
    avatar_id_height: 20,
    map_width: 2880,
    map_height: 1920,

    in_map_width (x: number) {
        return -this.map_width/2 + this.avatar_half_body <= x && x <= this.map_width/2 - this.avatar_half_body;
    },
    in_map_height (y:number) {
        return -this.map_height/2 + this.avatar_half_body + this.avatar_id_height <= y && y <= this.map_height/2 - this.avatar_half_body;
    },
    in_map (x: number, y:number) {
        return this.in_map_width(x) && this.in_map_height(y);
    },
};

export default config;