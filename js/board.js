/**
 * Clase que gestiona el tablero de juego
 */
class Board {
    constructor(canvasId, rows = 20, cols = 10) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.rows = rows;
        this.cols = cols;
        this.grid = this.createGrid();
        
        // Ajuste de tamaño de bloques según el canvas
        this.blockSize = 30; // Tamaño base
        this.resize();
    }

    /**
     * Crea una matriz vacía de rows x cols
     */
    createGrid() {
        return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    }

    /**
     * Ajusta el tamaño del canvas
     */
    resize() {
        this.canvas.width = this.cols * this.blockSize;
        this.canvas.height = this.rows * this.blockSize;
    }

    /**
     * Reinicia el tablero
     */
    reset() {
        this.grid = this.createGrid();
    }

    /**
     * Dibuja un bloque individual
     */
    drawBlock(x, y, colorIndex) {
        const color = COLORS[colorIndex];
        const xPos = x * this.blockSize;
        const yPos = y * this.blockSize;

        // Cuerpo del bloque
        this.ctx.fillStyle = color;
        this.ctx.fillRect(xPos, yPos, this.blockSize, this.blockSize);

        // Bordes para efecto 3D/profundidad
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.strokeRect(xPos, yPos, this.blockSize, this.blockSize);
        
        // Brillo superior
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(xPos, yPos, this.blockSize, this.blockSize / 4);
    }

    /**
     * Renderiza todo el tablero
     */
    draw() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar grid (opcional para estética)
        this.drawGridLines();

        // Dibujar bloques fijos
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x] !== 0) {
                    this.drawBlock(x, y, this.grid[y][x]);
                }
            }
        }
    }

    /**
     * Dibuja líneas de guía de la cuadrícula
     */
    drawGridLines() {
        this.ctx.strokeStyle = '#222';
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(this.canvas.width, y * this.blockSize);
            this.ctx.stroke();
        }
    }

    /**
     * Dibuja la pieza activa
     */
    drawPiece(piece) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.drawBlock(piece.pos.x + x, piece.pos.y + y, value);
                }
            });
        });
    }

    /**
     * Fusiona la pieza con el tablero
     */
    merge(piece) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const boardY = piece.pos.y + y;
                    const boardX = piece.pos.x + x;
                    if (boardY >= 0) {
                        this.grid[boardY][boardX] = value;
                    }
                }
            });
        });
    }

    /**
     * Elimina las líneas completas y devuelve la cantidad eliminada
     */
    clearLines() {
        let linesCleared = 0;

        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.grid[y].every(value => value !== 0)) {
                // Eliminar línea y añadir una vacía arriba
                this.grid.splice(y, 1);
                this.grid.unshift(Array(this.cols).fill(0));
                linesCleared++;
                y++; // Re-chequear la misma posición Y tras el desplazamiento
            }
        }

        return linesCleared;
    }
}
