/**
 * Clase principal que controla la lógica y el flujo del juego
 */
class Game {
    constructor(board, nextPieceCanvasId) {
        this.board = board;
        this.nextPieceCanvas = document.getElementById(nextPieceCanvasId);
        this.nextPieceCtx = this.nextPieceCanvas.getContext('2d');
        
        this.reset();
        this.initNextPieceCanvas();
    }

    /**
     * Inicializa variables del juego
     */
    reset() {
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        
        this.board.reset();
        
        this.activePiece = null;
        this.nextPiece = Utils.getRandomPiece();
        this.spawnPiece();

        this.dropCounter = 0;
        this.dropInterval = 1000; // 1 segundo inicial
        this.lastTime = 0;

        this.updateUI();
    }

    initNextPieceCanvas() {
        this.nextPieceCanvas.width = 120;
        this.nextPieceCanvas.height = 120;
    }

    /**
     * Genera una nueva pieza y prepara la siguiente
     */
    spawnPiece() {
        this.activePiece = {
            ...this.nextPiece,
            pos: { x: Math.floor(this.board.cols / 2) - 2, y: 0 }
        };

        // Verificar Game Over inmediato si la nueva pieza colisiona
        if (Utils.checkCollision(this.board.grid, this.activePiece, 0, 0)) {
            this.gameOver = true;
        }

        this.nextPiece = Utils.getRandomPiece();
        this.drawNextPiece();
    }

    /**
     * Dibuja la previsualización de la siguiente pieza
     */
    drawNextPiece() {
        this.nextPieceCtx.clearRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);
        
        const blockSize = 25;
        const offsetX = (this.nextPieceCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
        const offsetY = (this.nextPieceCanvas.height - this.nextPiece.shape.length * blockSize) / 2;

        this.nextPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.nextPieceCtx.fillStyle = this.nextPiece.color;
                    this.nextPieceCtx.fillRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize, blockSize);
                    this.nextPieceCtx.strokeStyle = 'rgba(0,0,0,0.2)';
                    this.nextPieceCtx.strokeRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize, blockSize);
                }
            });
        });
    }

    /**
     * Mueve la pieza hacia abajo
     */
    drop() {
        if (this.gameOver || this.paused) return;

        if (!Utils.checkCollision(this.board.grid, this.activePiece, 0, 1)) {
            this.activePiece.pos.y++;
        } else {
            this.lockPiece();
        }
        this.dropCounter = 0;
    }

    /**
     * Baja la pieza instantáneamente
     */
    hardDrop() {
        if (this.gameOver || this.paused) return;
        
        while (!Utils.checkCollision(this.board.grid, this.activePiece, 0, 1)) {
            this.activePiece.pos.y++;
            this.score += 2; // Pequeño bono por hard drop
        }
        this.lockPiece();
        this.updateUI();
    }

    /**
     * Fija la pieza al tablero y gestiona líneas/puntuación
     */
    lockPiece() {
        this.board.merge(this.activePiece);
        const linesCleared = this.board.clearLines();
        
        if (linesCleared > 0) {
            this.updateScore(linesCleared);
        }

        this.spawnPiece();
    }

    /**
     * Calcula la puntuación según el sistema clásico de Nintendo
     */
    updateScore(lines) {
        const linePoints = [0, 40, 100, 300, 1200];
        this.score += linePoints[lines] * this.level;
        this.lines += lines;

        // Subir de nivel cada 10 líneas
        if (this.lines >= this.level * 10) {
            this.level++;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        }
        
        this.updateUI();
    }

    updateUI() {
        document.getElementById('score').innerText = Utils.formatScore(this.score);
        document.getElementById('level').innerText = this.level;
        
        const highScore = localStorage.getItem('tetris-high-score') || 0;
        if (this.score > highScore) {
            localStorage.setItem('tetris-high-score', this.score);
        }
        document.getElementById('high-score').innerText = Utils.formatScore(Math.max(this.score, highScore));
    }

    /**
     * Mover lateralmente
     */
    move(dir) {
        if (this.gameOver || this.paused) return;
        if (!Utils.checkCollision(this.board.grid, this.activePiece, dir, 0)) {
            this.activePiece.pos.x += dir;
        }
    }

    /**
     * Rotar pieza
     */
    rotate() {
        if (this.gameOver || this.paused) return;
        const originalShape = this.activePiece.shape;
        this.activePiece.shape = Utils.rotate(this.activePiece.shape);
        
        // Si hay colisión al rotar, intentar "wall kick" básico o revertir
        if (Utils.checkCollision(this.board.grid, this.activePiece, 0, 0)) {
            this.activePiece.shape = originalShape;
        }
    }

    /**
     * Loop principal del juego
     */
    update(time = 0) {
        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        if (!this.paused && !this.gameOver) {
            this.dropCounter += deltaTime;
            if (this.dropCounter > this.dropInterval) {
                this.drop();
            }
        }

        this.draw();

        if (this.gameOver) {
            this.showGameOver();
            return;
        }

        requestAnimationFrame(this.update.bind(this));
    }

    draw() {
        this.board.draw();
        if (this.activePiece) {
            this.board.drawPiece(this.activePiece);
        }
    }

    showGameOver() {
        const overlay = document.getElementById('overlay');
        const title = document.getElementById('overlay-title');
        title.innerText = 'GAME OVER';
        overlay.classList.remove('hidden');
        document.getElementById('pause-btn').disabled = true;
    }

    togglePause() {
        if (this.gameOver) return;
        this.paused = !this.paused;
        const overlay = document.getElementById('overlay');
        const title = document.getElementById('overlay-title');
        const pauseBtn = document.getElementById('pause-btn');

        if (this.paused) {
            title.innerText = 'PAUSA';
            overlay.classList.remove('hidden');
            pauseBtn.innerText = 'REANUDAR';
        } else {
            overlay.classList.add('hidden');
            pauseBtn.innerText = 'PAUSAR';
        }
    }
}
