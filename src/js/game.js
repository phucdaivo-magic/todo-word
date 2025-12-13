
const img = new Image();
import aaa from "../../src/images/aaa.jpg";
img.src = aaa;
class GameMagi {
    constructor(canvas = document.getElementById("game")) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.characters = [];
        this.loop();
    }

    registerCharacter(character) {
        this.characters.push(character);
    }

    start() {
        this.loop();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.characters.forEach(character => {
            character.draw(this);
        });
        requestAnimationFrame(this.loop.bind(this));
    }

    loop() {
        if (this.update) {
            this.update();
        }
        this.draw();
    }
}

class Character {
    constructor() {
        this.x = 1;
        this.y = 0;
        this.width = 100;
        this.height = 100;
        this.color = "red";
    }
}

class Player extends Character {
    constructor() {
        super();
        this.color = "blue";
        this.height = 20
        this.y = document.querySelector("#game").height - this.height;
        this.cans = [];
    }

    updateAll({ x, y }) {
        this.x = Math.max(0, Math.min(x, document.querySelector("#game").width - this.width));
    }

    draw(game) {
        if (this.update) {
            this.update();
        }
        game.ctx.fillStyle = this.color;
        game.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.cans.forEach(can => {
            can?.draw(game, this);
        });
    }

    pushCan(can) {
        this.cans.push(can);
    }

    isHit(can) {

        if (this.cans.length === 0) {
            const isX = can.x >= this.x && can.x <= this.x + this.width;
            const isY = can.y + can.height >= this.y;
            return {
                isHit: isX && isY,
            }
        } else {
            const lastCan = this.cans.at(-1);
            const isX = can.x >= lastCan.xHitStart && can.x + can.width <= lastCan.xHitEnd;
            const isY = can.y + can.height >= lastCan.y && can.y + can.height <= lastCan.y + lastCan.height + 10;

            if (can.y + can.height >= lastCan.y + 20 ){
                let rotate = 8;

                if (can.x < lastCan.xHitStart ){
                    rotate = -8;
                } else if (can.x + can.width > lastCan.xHitEnd ){
                    rotate = 8;
                }

                return {
                    isHit: false,
                    rotate: rotate,
                }
            }   
            return {
                isHit: isX && isY,
            }
        }
    }
}

class Can extends Character {
    constructor() {
        super();
        this.color = "green";
        this.height = 506 / 2;
        this.width = 195 /2 ;
        this.speed = 4;
        this.angle = 0;
    }

    draw(game) {
        if (this.update) {
            this.update();
        }
        this.y += this.speed;
        game.ctx.fillStyle = this.color;
        !this.angle && game.ctx.fillRect(this.x, this.y, this.width, this.height);
        game.ctx.save();
        game.ctx.translate(this.x + this.width / 2 + this.angle / 4, this.y + this.height / 2);
        game.ctx.rotate(this.angle * Math.PI / 180);
        game.ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
        game.ctx.restore();

      
    }

    rotate(rotate) {
        this.angle += rotate;
    }
}

class CanOfPlayer extends Character {
    constructor(can, player) {
        super();
        this.player = player;
        this.color = "yellow";
        this.height = can.height;
        this.width = can.width;
        this.x = can.x;
        this.y = can.y
        this.distance = can.x - player.x;

        this.xHitStart = this.player.x + this.distance - 10;
        this.xHitEnd = this.player.x + this.distance + this.width + 10;
    }

    draw(game) {
        if (this.update) {
            this.update();
        }
        const w = this.width
        const h = this.height
        const x = this.player.x + this.distance
        const y = this.y
        const xCenter = x + w / 2
        const yCenter = y + h / 2

        game.ctx.fillStyle = this.color;
        game.ctx.save()
        game.ctx.translate(xCenter, yCenter);
        game.ctx.rotate(this.distance/ 3 * Math.PI / 180);
        game.ctx.drawImage(img, -w / 2, -h / 2, w, h);
        game.ctx.restore();

        this.xHitStart = this.player.x + this.distance - 10;
        this.xHitEnd = this.player.x + this.distance + this.width + 10;


        game.ctx.fillStyle = '#fff'
        // game.ctx.fillRect(this.xHitStart, this.y, this.xHitEnd - this.xHitStart, 10);
    }
}



document.addEventListener("mousemove", (e) => {
    player.updateAll({ x: e.clientX });
});


const can = new Can();
const player = new Player();

can.update = () => {
    const { isHit, rotate } = player.isHit(can);
    if (isHit) {
        player.pushCan(new CanOfPlayer(can, player));
        can.y = -can.height;
        can.x = Math.random() * (document.querySelector("#game").width - can.width);
        can.angle = 0;
        console.log("Pushed can");
    } else if (rotate) {
        can.rotate(rotate);
    }
    if (can.y > player.y + player.height) {
        can.y = -can.height;
        can.angle = 0;
        can.x = Math.random() * (document.querySelector("#game").width - can.width);
    }
}



const game = new GameMagi();

game.registerCharacter(player);
game.registerCharacter(can);

new EventSource("/esbuild").addEventListener("change", () => location.reload());
