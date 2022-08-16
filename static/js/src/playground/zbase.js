class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);
        this.hide();

        this.root.$ac_game.append(this.$playground);

        this.start();
    }
    get_random_color() {
        let colors = ["blue", "red", "pink", "grey", "green"];
        return colors[Math.floor(Math.random() * 5)];
    }

    start() {
        let outer = this;
        $(window).resize(function(){//当用户改变窗口大小时，函数触发
            outer.resize();
        });
    }
    resize(){
        this.width = this.$playground.width();//求当前窗口的长和宽度
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);//单位
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;//基准  相对长度单位值
        if(this.game_map){
            this.game_map.resize();
        }
    }

    update() {
    }
    show(mode) {  // 打开playground界面
        let outer = this;
        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.mode = mode;//将模式记录下来
        this.state = "waiting";  // waiting -> fighting -> over
        this.notice_board = new NoticeBoard(this);
        this.player_count = 0;

        this.resize();

        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo));
        if(mode === "single mode"){
            for (let i = 0; i < 5; i ++ ) {
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5,0.05, this.get_random_color(), 0.15, "robot"));
            }
        }else if (mode === "multi mode"){
            this.chat_field = new ChatField(this);
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;

            this.mps.ws.onopen = function(){ //链接创建成功会回调这个函数
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };
        }

    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}
