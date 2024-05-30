document.addEventListener('DOMContentLoaded', () => {
    // 事件 1: 菜單高亮
    const currentLocation = location.href;
    const menuItem = document.querySelectorAll('nav ul li a');
    const menuLength = menuItem.length;
    for (let i = 0; i < menuLength; i++) {
        if (menuItem[i].href === currentLocation) {
            menuItem[i].classList.add('active');
        }

        // 添加点击事件
        menuItem[i].addEventListener('click', () => {
            menuItem.forEach(item => item.classList.remove('read'));
            menuItem[i].classList.add('read');
        });
    }

    // 事件 2: 圖片庫顯示並添加旋轉事件
    if (document.querySelector('.gallery')) {
        const images = document.querySelectorAll('.gallery img');
        images.forEach(image => {
            image.addEventListener('mouseover', () => {
                image.style.transition = 'transform 0.5s';
                image.style.transform = 'rotate(360deg)';
                image.style.animation = 'rotate 1s infinite linear';
            });
            image.addEventListener('mouseout', () => {
                image.style.transition = 'transform 0.5s';
                image.style.transform = 'rotate(0deg)';
                image.style.animation = 'none';
            });
        });
    }

    // 事件 3: 小遊戲
    if (document.querySelector('#gameCanvas')) {
        const canvas = document.getElementById('gameCanvas');
        const context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let player = { x: 50, y: 50, width: 50, height: 50, color: 'blue' };
        let enemies = [
            { x: 300, y: 100, width: 50, height: 50, color: 'red' }
        ];
        let keys = {};
        let gameStarted = false;
        let startTime, currentTime;

        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
            if (!gameStarted) {
                gameStarted = true;
                startTime = new Date().getTime();
                gameLoop();
            }
        });

        window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        function gameLoop() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            movePlayer();
            drawPlayer();
            drawEnemies();
            checkCollisions();
            currentTime = new Date().getTime();
            if (currentTime - startTime < 15000) {
                requestAnimationFrame(gameLoop);
            } else {
                alert('你贏了!');
                resetGame();
            }
        }

        function movePlayer() {
            if (keys['ArrowUp'] && player.y > 0) player.y -= 5;
            if (keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += 5;
            if (keys['ArrowLeft'] && player.x > 0) player.x -= 5;
            if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += 5;
            if (keys[' ']) player.color = 'green'; // 路人蹲下閃躲
            else player.color = 'blue';
        }

        function drawPlayer() {
            context.fillStyle = player.color;
            context.fillRect(player.x, player.y, player.width, player.height);
        }

        function drawEnemies() {
            enemies.forEach(enemy => {
                context.fillStyle = enemy.color;
                context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                enemy.y += 3; // 敵人向下移動
                if (enemy.y > canvas.height) {
                    enemy.y = 0;
                    enemy.x = Math.random() * canvas.width;
                }
            });
        }

        function checkCollisions() {
            enemies.forEach(enemy => {
                if (player.color === 'blue' && 
                    player.x < enemy.x + enemy.width &&
                    player.x + player.width > enemy.x &&
                    player.y < enemy.y + enemy.height &&
                    player.y + player.height > enemy.y) {
                        alert('你被攻擊了!');
                        resetGame();
                }
            });
        }

        function resetGame() {
            player.x = 50;
            player.y = 50;
            gameStarted = false;
        }
    }
});
