const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
    COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
};


class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }
    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload));
        }
    }
}

let heroImg, enemyImg, laserImg, explosionImg,
    canvas, ctx,
    gameObjects = [],
    hero,
    eventEmitter = new EventEmitter();

class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;
        this.type = "";
        this.width = 0;
        this.height = 0;
        this.img = undefined;
    }

    rectFromGameObject() {
        return {
            top: this.y,
            left: this.x,
            bottom: this.y + this.height,
            right: this.x + this.width,
        };
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

class Hero extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 99;
        this.height = 75;
        this.type = 'Hero';
        this.cooldown = 0;
    }
    fire() {
        if (this.canFire()) { //쿨다운 확인
        gameObjects.push(new Laser(this.x + 45, this.y - 10)); //레이저 생성 
        this.cooldown = 500; //쿨다운 500ms 설정

        let id = setInterval(() => {
            if (this.cooldown > 0) {
                this.cooldown -= 100;
            } else {
            clearInterval(id); //쿨다운 완료 후 타이머 종료 
            }
        }, 100); 
    }    
}
    canFire() {
        return this.cooldown === 0; //쿨다운 상태 확인
    }
}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 98;
        this.height = 50;
        this.type = "Enemy";
        let id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5;
            } else {
                clearInterval(id);
            }
        }, 300);
    }
}

class Laser extends GameObject {
    constructor(x, y) {
      super(x, y);
      (this.width = 9), (this.height = 33);
      this.type = 'Laser';
      this.img = laserImg;
      
      let id = setInterval(() => {
        if (this.y > 0) {
            this.y -= 15; // 레이저가 위로 이동 
        } 
        else {
            this.dead = true; // 화면 상단에 도달하면 제거
            clearInterval(id);
        }
        }, 100);
    }
}

class Explosion extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 50; // 폭발 이미지 크기
        this.height = 50;
        this.type = "Explosion";
        this.img = explosionImg;

        // 일정 시간 후 폭발 이미지 제거
        setTimeout(() => {
            this.dead = true;
        }, 500); // 0.5초 후 제거
    }
}

function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    });
}

function initGame() {
    gameObjects = [];
    createEnemies();
    createHero();

    addSidekicksToHero(hero);

    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        hero.y -= 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        hero.y += 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        hero.x -= 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        hero.x += 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        if (hero.canFire()) {
          hero.fire();
        }
      });
    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => { 
        first.dead = true; // 레이저 제거
        second.dead = true; // 적 제거

        const explosion = new Explosion(second.x, second.y);
        gameObjects.push(explosion);
        });
}

function createEnemies() {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * 98;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;
    for (let x = START_X; x < STOP_X; x += 98) {
        for (let y = 0; y < 50 * 5; y += 50) {
            const enemy = new Enemy(x, y);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
        }
    }
}

function createHero() {
    hero = new Hero(
        canvas.width / 2 - 45,
        canvas.height - canvas.height / 4
    );
    hero.img = heroImg;
    gameObjects.push(hero);
}

function addSidekicksToHero(mainHero) {
    // 왼쪽 작은 히어로 생성
    const leftHero = new Hero(
        mainHero.x - 110, // 주 히어로보다 왼쪽으로 150px
        mainHero.y
    );
    leftHero.img = heroImg;
    leftHero.width = 50; // 작은 히어로 크기
    leftHero.height = 37;
    gameObjects.push(leftHero);

    // 오른쪽 작은 히어로 생성
    const rightHero = new Hero(
        mainHero.x + 150, // 주 히어로보다 오른쪽으로 150px
        mainHero.y
    );
    rightHero.img = heroImg;
    rightHero.width = 50; // 작은 히어로 크기
    rightHero.height = 37;
    gameObjects.push(rightHero);

    // 작은 히어로들도 중앙 히어로와 함께 움직이도록 연결
    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        leftHero.y -= 5;
        rightHero.y -= 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        leftHero.y += 5;
        rightHero.y += 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        leftHero.x -= 5;
        rightHero.x -= 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        leftHero.x += 5;
        rightHero.x += 5;
    });
    setInterval(() => {
        if (leftHero.canFire()) {
            leftHero.fire();
        }
    }, 500); // 1초마다 발사

    setInterval(() => { 
        if (rightHero.canFire()) {
            rightHero.fire();
        }
    }, 500); // 1초마다 발사
}


function intersectRect(r1, r2) {
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    ); 
}

function drawGameObjects(ctx) {
    gameObjects.forEach(go => go.draw(ctx));
}

function updateGameObjects() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy");
    const lasers = gameObjects.filter((go) => go.type === "Laser");
    lasers.forEach((l) => {
      enemies.forEach((m) => {
        if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
          eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
  first: l,
            second: m,
          });
  } });
  });
    gameObjects = gameObjects.filter((go) => !go.dead);
  }

window.onload = async () => {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    heroImg = await loadTexture("assets/player.png");
    enemyImg = await loadTexture("assets/enemyShip.png");
    laserImg = await loadTexture("assets/laserRed.png");
    explosionImg = await loadTexture("assets/laserGreenShot.png"); // 폭발 이미지 추가

    initGame();
    let gameLoopId = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGameObjects(ctx);
        updateGameObjects();
    }, 100)
};

let onKeyDown = function (e) {
    switch (e.keyCode) {
        case 37: // Left arrow
        case 38: // Up arrow
        case 39: // Right arrow
        case 40: // Down arrow
        case 32: // Spacebar
            e.preventDefault();
            break;
        default:
            break;
    }
};

window.addEventListener('keydown', onKeyDown);
window.addEventListener("keyup", (evt) => {
    if (evt.key === "ArrowUp") {
        eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (evt.key === "ArrowDown") {
        eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (evt.key === "ArrowLeft") {
        eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (evt.key === "ArrowRight") {
        eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    }else if(evt.keyCode === 32) {
        eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    }
});
