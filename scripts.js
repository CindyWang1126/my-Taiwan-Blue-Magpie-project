
    // 事件 1: 點擊頁面超連結會變色
    document.addEventListener('DOMContentLoaded', () => {
        // 取得所有超連結
        const menuItems = document.querySelectorAll('nav ul li a');

        // 當前頁面的 URL
        const currentURL = window.location.href;

        // 預設所有超連結為未點擊過的樣式
        menuItems.forEach(item => {
            item.classList.remove('read');
            item.classList.add('unread');
        });

        // 將當前頁面的超連結設置為已點擊過的樣式
        menuItems.forEach(item => {
            if (item.href === currentURL) {
                item.classList.remove('unread');
                item.classList.add('read');
                // 記錄到 LocalStorage，標記為已點擊
                localStorage.setItem(item.href, 'read');
            }
            
            // 添加點擊事件處理
            item.addEventListener('click', (event) => {
                // 將超連結標記為已點擊
                localStorage.setItem(item.href, 'read');
                item.classList.remove('unread');
                item.classList.add('read');
            });
        });
    });






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
document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('startButton');
    const countdownElement = document.getElementById('countdown');
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    let countdown = 20;
    let gameStarted = false;
    let countdownInterval;
    let canTurnGray = true;
    let moveLeftInterval, moveRightInterval;

    function setCanvasSize() {
        canvas.width = Math.min(window.innerWidth, 1200); // 限制最大寬度為1200
        canvas.height = Math.min(window.innerHeight, 600); // 限制最大高度為600
    }

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let player = { x: 50, y: canvas.height - 150, width: 50, height: 50, color: 'lightblue' };
    let enemies = [];
    let keys = {};

    const enemyImage = new Image();
    enemyImage.src = 'taiwan_blue_magpie.png';

    // Prevent arrow keys and space from scrolling the page
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    });

    startButton.addEventListener('click', () => {
        startButton.classList.add('hidden');
        canvas.classList.remove('hidden');
        countdownElement.textContent = `倒計時: ${countdown} 秒`;
        countdownInterval = setInterval(() => {
            countdown--;
            countdownElement.textContent = `倒計時: ${countdown} 秒`;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = `倒計時: 0 秒`;
                if (gameStarted) {
                    alert('時間到！你贏了OuOb');
                }
                resetGame();
            }
        }, 1000);
        gameStarted = true;
        createEnemies();
        gameLoop();
    });

    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    document.getElementById('leftButton').addEventListener('mousedown', () => {
        moveLeftInterval = setInterval(moveLeft, 50);
    });

    document.getElementById('leftButton').addEventListener('mouseup', () => {
        clearInterval(moveLeftInterval);
    });

    document.getElementById('leftButton').addEventListener('touchstart', () => {
        moveLeftInterval = setInterval(moveLeft, 50);
    });

    document.getElementById('leftButton').addEventListener('touchend', () => {
        clearInterval(moveLeftInterval);
    });

    document.getElementById('rightButton').addEventListener('mousedown', () => {
        moveRightInterval = setInterval(moveRight, 50);
    });

    document.getElementById('rightButton').addEventListener('mouseup', () => {
        clearInterval(moveRightInterval);
    });

    document.getElementById('rightButton').addEventListener('touchstart', () => {
        moveRightInterval = setInterval(moveRight, 50);
    });

    document.getElementById('rightButton').addEventListener('touchend', () => {
        clearInterval(moveRightInterval);
    });

    document.getElementById('invincibleButton').addEventListener('click', () => {
        activateInvincibility();
    });

    function activateInvincibility() {
        if (canTurnGreen) {
            player.color = 'gray';
            canTurnGreen = false;
            document.getElementById('invincibleButton').classList.add('disabled');
            setTimeout(() => {
                player.color = 'lightblue';
            }, 1000);
        }
    }
    

    function createEnemies() {
        for (let i = 0; i < 5; i++) {
            let enemy = {
                x: Math.random() * canvas.width,
                y: -50,
                width: 50,
                height: 50,
                speedY: 3 + Math.random() * 3,
                speedX: Math.random() > 0.5 ? (1 + Math.random() * 2) : -(1 + Math.random() * 2)
            };
            enemies.push(enemy);
        }
    }

    function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        movePlayer();
        drawPlayer();
        drawEnemies();
        checkCollisions();
        if (gameStarted && countdown > 0) {
            requestAnimationFrame(gameLoop);
        } else if (countdown > 0) {
            resetGame();
        }
    }

    function movePlayer() {
        if (keys['ArrowLeft'] && player.x > 0) player.x -= 5;
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += 5;
        if (keys[' '] && canTurnGray) {
            activateInvincibility();
        }
    }
    
    function moveLeft() {
        if (player.x > 0) player.x -= 17;
    }

    function moveRight() {
        if (player.x < canvas.width - player.width) player.x += 17;
    }

    function drawPlayer() {
        context.fillStyle = player.color;
        context.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawEnemies() {
        enemies.forEach(enemy => {
            context.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
            enemy.y += enemy.speedY;
            enemy.x += enemy.speedX;
            if (enemy.y > canvas.height) {
                enemy.y = 0;
                enemy.x = Math.random() * canvas.width;
            }
            if (enemy.x > canvas.width || enemy.x < 0) {
                enemy.speedX *= -1;
            }
        });
    }

    function checkCollisions() {
        enemies.forEach(enemy => {
            if (player.color === 'lightblue' && 
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) {
                    alert('你被攻擊了! GAME OVER!');
                    gameEnded = true;
                    resetGame();
            }
        });
    }

    function resetGame() {
        player.x = 50;
        player.y = canvas.height - 100;
        gameStarted = false;
        countdown = 20;
        canTurnGreen = true;
        enemies = [];
        startButton.classList.remove('hidden');
        canvas.classList.add('hidden');
        clearInterval(countdownInterval);
        clearInterval(moveLeftInterval);
        clearInterval(moveRightInterval);
        keys = {}; // 清空按鍵狀態
        isLongPress = false;
        document.getElementById('invincibleButton').classList.remove('disabled'); // 恢复按钮颜色
        countdownElement.textContent = `倒計時: 20 秒`;
    }
    
});

