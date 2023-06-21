var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');

var player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    dx: 10,
    isMovingLeft: false,
    isMovingRight: false
};

var aliens = [];
var alienRowCount = 5;
var alienColumnCount = 10;
var alienWidth = 50;
var alienHeight = 50;
var alienPadding = 10;
var alienOffsetTop = 50;
var alienOffsetLeft = 60;
var alienSpeed = 1;
var alienSpeedIncrement = 0.1;

var bullets = [];
var bulletWidth = 5;
var bulletHeight = 10;
var bulletSpeed = 5;

var score = 0;

var startScreen = document.getElementById('startScreen');
document.addEventListener('keydown', startGame);

function startGame() {
    startScreen.style.display = 'none';
    document.removeEventListener('keydown', startGame);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    createAliens();

    function handleKeyDown(event) {
        if (event.code === 'ArrowLeft') {
            player.isMovingLeft = true;
        } else if (event.code === 'ArrowRight') {
            player.isMovingRight = true;
        } else if (event.code === 'Space') {
            shootBullet();
        }
    }

    function handleKeyUp(event) {
        if (event.code === 'ArrowLeft') {
            player.isMovingLeft = false;
        } else if (event.code === 'ArrowRight') {
            player.isMovingRight = false;
        }
    }

    function createAliens() {
        for (var row = 0; row < alienRowCount; row++) {
            aliens[row] = [];
            for (var col = 0; col < alienColumnCount; col++) {
                var alienX = col * (alienWidth + alienPadding) + alienOffsetLeft;
                var alienY = row * (alienHeight + alienPadding) + alienOffsetTop;
                aliens[row][col] = { x: alienX, y: alienY, isAlive: true };
            }
        }
    }

    function drawAliens() {
        for (var row = 0; row < alienRowCount; row++) {
            for (var col = 0; col < alienColumnCount; col++) {
                var alien = aliens[row][col];
                if (alien.isAlive) {
                    context.fillStyle = 'green';
                    context.fillRect(alien.x, alien.y, alienWidth, alienHeight);
                }
            }
        }
    }

    function updateAliens() {
        var hasReachedEdge = false;

        for (var row = 0; row < alienRowCount; row++) {
            for (var col = 0; col < alienColumnCount; col++) {
                var alien = aliens[row][col];
                if (alien.isAlive) {
                    alien.x += alienSpeed;

                    if (alien.x + alienWidth >= canvas.width || alien.x <= 0) {
                        hasReachedEdge = true;
                    }

                    if (alien.y + alienHeight >= player.y && alien.isAlive) {
                        endGame();
                    }
                }
            }
        }

        if (hasReachedEdge) {
            alienSpeed *= -1;
            for (var row = 0; row < alienRowCount; row++) {
                for (var col = 0; col < alienColumnCount; col++) {
                    aliens[row][col].y
                    aliens[row][col].y += alienHeight;
                }
            }
        }
    }

    function shootBullet() {
        var bullet = {
            x: player.x + player.width / 2 - bulletWidth / 2,
            y: player.y - bulletHeight,
            width: bulletWidth,
            height: bulletHeight
        };
        bullets.push(bullet);
    }

    function updateBullets() {
        for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];
            bullet.y -= bulletSpeed;

            for (var row = 0; row < alienRowCount; row++) {
                for (var col = 0; col < alienColumnCount; col++) {
                    var alien = aliens[row][col];
                    if (alien.isAlive && checkCollision(bullet, alien)) {
                        alien.isAlive = false;
                        bullets.splice(i, 1);
                        score++;
                        break;
                    }
                }
            }

            if (bullet.y <= 0) {
                bullets.splice(i, 1);
            }
        }
    }

    function checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + alienWidth &&
            rect1.x + bulletWidth > rect2.x &&
            rect1.y < rect2.y + alienHeight &&
            rect1.y + bulletHeight > rect2.y
        );
    }

    function updatePlayer() {
        if (player.isMovingLeft && player.x > 0) {
            player.x -= player.dx;
        } else if (player.isMovingRight && player.x + player.width < canvas.width) {
            player.x += player.dx;
        }
    }

    function drawPlayer() {
        context.fillStyle = 'blue';
        context.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawBullets() {
        context.fillStyle = 'white';
        for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];
            context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    }

    function drawScore() {
        context.fillStyle = 'white';
        context.font = '16px Arial';
        context.fillText('Score: ' + score, canvas.width - 100, 20);
    }

    function drawGameOverScreen() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = '40px Arial';
        context.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        context.font = '20px Arial';
        context.fillText('Final Score: ' + score, canvas.width / 2 - 70, canvas.height / 2 + 40);
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawAliens();
        drawPlayer();
        drawBullets();
        drawScore();

        if (score === alienRowCount * alienColumnCount) {
            drawGameOverScreen();
        } else {
            requestAnimationFrame(draw);
        }
    }

function gameLoop() {
    updatePlayer();
    updateBullets();
    updateAliens();

    draw();

    requestAnimationFrame(gameLoop);
}

createAliens();
gameLoop();

    function endGame() {
        drawGameOverScreen();
    }

    gameLoop();
}
