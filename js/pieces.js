/**
 * Definición de los Tetrominos y sus propiedades
 */

const TETROMINOS = {
    'I': {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: '#00f0f0' // Cian
    },
    'J': {
        shape: [
            [2, 0, 0],
            [2, 2, 2],
            [0, 0, 0]
        ],
        color: '#0000f0' // Azul
    },
    'L': {
        shape: [
            [0, 0, 3],
            [3, 3, 3],
            [0, 0, 0]
        ],
        color: '#f0a000' // Naranja
    },
    'O': {
        shape: [
            [4, 4],
            [4, 4]
        ],
        color: '#f0f000' // Amarillo
    },
    'S': {
        shape: [
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0]
        ],
        color: '#00f000' // Verde
    },
    'T': {
        shape: [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]
        ],
        color: '#a000f0' // Púrpura
    },
    'Z': {
        shape: [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ],
        color: '#f00000' // Rojo
    }
};

const COLORS = [
    null,
    '#00f0f0', // I
    '#0000f0', // J
    '#f0a000', // L
    '#f0f000', // O
    '#00f000', // S
    '#a000f0', // T
    '#f00000'  // Z
];
