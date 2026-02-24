/**
 * Punto de entrada de la aplicación
 */

document.addEventListener('DOMContentLoaded', () => {
    const board = new Board('game-board');
    const game = new Game(board, 'next-piece');

    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const restartBtnOverlay = document.getElementById('restart-btn-overlay');

    // Manejo de controles por teclado
    document.addEventListener('keydown', event => {
        if (game.gameOver) return;

        switch (event.keyCode) {
            case 37: // Flecha Izquierda
                game.move(-1);
                break;
            case 39: // Flecha Derecha
                game.move(1);
                break;
            case 40: // Flecha Abajo
                game.drop();
                break;
            case 38: // Flecha Arriba
                game.rotate();
                break;
            case 32: // Barra Espaciadora
                game.hardDrop();
                break;
            case 80: // Tecla P (Pausa)
                game.togglePause();
                break;
        }
    });

    // Eventos de botones UI
    startBtn.addEventListener('click', () => {
        if (startBtn.innerText === 'INICIAR' || game.gameOver) {
            game.reset();
            game.update();
            startBtn.innerText = 'REINICIAR';
            pauseBtn.disabled = false;
            document.getElementById('overlay').classList.add('hidden');
        } else {
            // Confirmación opcional para reiniciar
            if (confirm('¿Reiniciar partida actual?')) {
                game.reset();
            }
        }
    });

    pauseBtn.addEventListener('click', () => {
        game.togglePause();
    });

    restartBtnOverlay.addEventListener('click', () => {
        game.reset();
        game.update();
        document.getElementById('overlay').classList.add('hidden');
        pauseBtn.disabled = false;
        pauseBtn.innerText = 'PAUSAR';
    });

    // Inicializar High Score en la UI al cargar
    game.updateUI();
});
