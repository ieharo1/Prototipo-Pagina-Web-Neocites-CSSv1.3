/**
 * Funciones de utilidad para el juego
 */

const Utils = {
    /**
     * Genera un número entero aleatorio entre min y max
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Selecciona una pieza aleatoria del objeto TETROMINOS
     */
    getRandomPiece() {
        const keys = Object.keys(TETROMINOS);
        const randomKey = keys[this.randomInt(0, keys.length - 1)];
        return {
            name: randomKey,
            ...TETROMINOS[randomKey]
        };
    },

    /**
     * Rota una matriz (pieza) 90 grados en sentido horario
     */
    rotate(matrix) {
        const N = matrix.length;
        const result = matrix.map((row, i) =>
            row.map((val, j) => matrix[N - 1 - j][i])
        );
        return result;
    },

    /**
     * Verifica si una posición es válida (colisiones con bordes o piezas fijas)
     * @param {Array} board - Matriz del tablero
     * @param {Object} piece - Objeto de la pieza actual
     * @param {number} offsetPosX - Posición X deseada
     * @param {number} offsetPosY - Posición Y deseada
     */
    checkCollision(board, piece, offsetPosX, offsetPosY) {
        const shape = piece.shape;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const newX = x + piece.pos.x + offsetPosX;
                    const newY = y + piece.pos.y + offsetPosY;

                    if (
                        newX < 0 || 
                        newX >= board[0].length ||
                        newY >= board.length ||
                        (newY >= 0 && board[newY][newX] !== 0)
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    /**
     * Formatea la puntuación para mostrar ceros a la izquierda
     */
    formatScore(score) {
        return score.toString().padStart(6, '0');
    }
};
