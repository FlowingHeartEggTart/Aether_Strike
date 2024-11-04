// 游戏设置
const settings = {
    cannonSpeedIncrement: 1, // 炮弹速度增量
    maxCannonSpeed: 10, // 最大炮弹速度
    minCannonSpeed: 1, // 最小炮弹速度
    cannonAngleIncrement: 5, // 炮角度增量
    maxCannonAngle: 90, // 最大炮角度
    minCannonAngle: 0, // 最小炮角度
    airResistanceFactor: 0.02 // 空气阻力因子
};

// 炮弹类
class CannonBall {
    constructor(x, y, speed, angle) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.angle = angle;
        this.vx = speed * Math.cos(angle);
        this.vy = -speed * Math.sin(angle); // 注意y轴正方向向下
        this.radius = 4;
        this.gravity = 0.1;
        this.airResistance = settings.airResistanceFactor * speed;
        this.active = true;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx -= this.vx * this.airResistance;

        // 炮弹飞出画布或击中飞机，结束
        if (this.y > canvas.height || this.x > canvas.width || this.x < 0) {
            this.active = false;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

// 高射炮类
class Cannon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 50;
        this.barrelLength = 60;
        this.barrelWidth = 20;
        this.angle = 45;
		this.image.src = 'img/cannon.png'; // 替换成更美观的高射炮图像
        this.image = new Image();
        
    }

    updateAngle(newAngle) {
        this.angle = newAngle;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(-this.angle * Math.PI / 180);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

// 飞机类
class Plane {
    constructor(type, speed, score) {
        this.type = type;
        this.speed = speed;
        this.score = score;
        this.width = 50;
        this.height = 30;
        this.x = 0 - this.width;
        this.y = Math.random() * (canvas.height - 100) + 50;
        this.active = true;
        this.image = new Image();
        this.image.src = type === 'normal' ? 'img/plane1.png' : 'img/plane2.png'; // 替换成更美观的飞机图像
    }

    update() {
        this.x += this.speed;
        if (this.x > canvas.width) {
            this.active = false;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// 游戏状态
const gameState = {
    cannonAngle: 45,
    cannonSpeed: 5,
    cannonBalls: [],
    planes: [],
    score: 0,
    highestScore: localStorage.getItem('highestScore') || 0
};

// 获取Canvas和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 背景图
const backgroundImage = new Image();
backgroundImage.src = 'images/background.jpg';

// 监听键盘事件
document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowUp':
            gameState.cannonAngle = Math.min(gameState.cannonAngle + settings.cannonAngleIncrement, settings.maxCannonAngle);
            break;
        case 'ArrowDown':
            gameState.cannonAngle = Math.max(gameState.cannonAngle - settings.cannonAngleIncrement, settings.minCannonAngle);
            break;
        case ' ':
            shootCannon();
            break;
        default:
            break;
    }
});

// 发射炮弹
function shootCannon() {
    let angleRad = gameState.cannonAngle * Math.PI / 180;
    let startX = canvas.width - 100;
    let startY = canvas.height - 50;
    let speed = gameState.cannonSpeed;

    let cannonBall = new CannonBall(startX, startY, speed, angleRad);
    gameState.cannonBalls.push(cannonBall);
}

// 更新游戏状态
function updateGameState() {
    // 更新炮弹状态
    gameState.cannonBalls.forEach(ball => {
        ball.update();
    });

    // 更新飞机状态
    gameState.planes.forEach(plane => {
        plane.update();
    });

    // 移除不活跃的炮弹和飞机
    gameState.cannonBalls = gameState.cannonBalls.filter(ball => ball.active);
    gameState.planes = gameState.planes.filter(plane => plane.active);

    // 碰撞检测
    gameState.cannonBalls.forEach(ball => {
        gameState.planes.forEach(plane => {
            if (checkCollision(ball, plane)) {
                plane.active = false;
                gameState.score += plane.score;
            }
        });
    });

    // 更新最高分
    if (gameState.score > gameState.highestScore) {
        gameState.highestScore = gameState.score;
        localStorage.setItem('highestScore', gameState.highestScore);
    }
}

// 碰撞检测函数
function checkCollision(ball, plane) {
    return ball.x + ball.radius >= plane.x &&
        ball.x - ball.radius <= plane.x + plane.width &&
        ball.y + ball.radius >= plane.y &&
        ball.y - ball.radius <= plane.y + plane.height;
}

// 绘制游戏画面
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // 绘制高射炮
    ctx.fillStyle = 'black';
    ctx.fillRect(canvas.width - 120, canvas.height - 60, 100, 50);

    // 绘制炮弹初始速度和角度
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(`Speed: ${gameState.cannonSpeed}`, canvas.width - 110, 20);
    ctx.fillText(`Angle: ${gameState.cannonAngle}°`, canvas.width - 110, 40);

    // 绘制炮弹
    gameState.cannonBalls.forEach(ball => {
        ball.draw();
    });

    // 绘制飞机
    gameState.planes.forEach(plane => {
        plane.draw();
    });

    // 绘制得分
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 20, 40);
    ctx.fillText(`Highest Score: ${gameState.highestScore}`, 20, 70);
}

// 游戏循环
function gameLoop() {
    updateGameState();
    draw();
    requestAnimationFrame(gameLoop);
}

// 初始化游戏
function initGame() {
    gameState.score = 0;
    gameState.cannonBalls = [];
    gameState.planes = [];

    // 创建飞机
    setInterval(() => {
        let planeType = Math.random() < 0.5 ? 'normal' : 'smart';
        let speed = Math.random() * 2 + 1;
        let score = planeType === 'normal' ? 10 : Math.floor(Math.random() * 90 + 10);
        let plane = new Plane(planeType, speed, score);
        gameState.planes.push(plane);
    }, 3000);

    gameLoop();
}

// 启动游戏
initGame();
