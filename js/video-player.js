/**
 * video-player.js - Controlador personalizado de video HTML5
 * 
 * Este script implementa controles personalizados y funcionalidades avanzadas
 * para el reproductor de video HTML5 en Villa Market, mejorando la accesibilidad
 * y experiencia de usuario.
 * 
 * @author GitHub Copilot
 * @version 2.0
 */

document.addEventListener('DOMContentLoaded', function() {
    /**
     * Referencias a los elementos del DOM del reproductor de video
     */
    const videoPlayer = document.getElementById('villa-market-video');
    const playButton = document.getElementById('play-button');
    const muteButton = document.getElementById('mute-button');
    const fullscreenButton = document.getElementById('fullscreen-button');
    const videoContainer = document.querySelector('.video-container');
    const videoControls = document.querySelector('.video-controls');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.getElementById('video-progress');
    
    // Verificar que existan los elementos antes de trabajar con ellos
    if (!videoPlayer || !videoControls) return;
    
    /**
     * Gestión de visibilidad de los controles
     * Los controles se muestran al pasar el mouse sobre el video y se ocultan después de un tiempo
     */
    videoContainer.addEventListener('mouseover', showControls);
    videoContainer.addEventListener('mouseleave', hideControls);
    videoContainer.addEventListener('touchstart', showControls);
    videoContainer.addEventListener('focus', showControls);
    
    let controlsTimeout;
    
    function showControls() {
        videoControls.classList.add('visible');
        clearTimeout(controlsTimeout);
        
        // Si el video está reproduciéndose, configurar temporizador para ocultar
        if (!videoPlayer.paused) {
            controlsTimeout = setTimeout(hideControls, 3000);
        }
    }
    
    function hideControls() {
        if (!videoPlayer.paused) {
            videoControls.classList.remove('visible');
        }
    }
    
    /**
     * Funcionalidad del botón reproducir/pausar
     * Alterna entre los estados de reproducción y pausa
     */
    if (playButton) {
        playButton.addEventListener('click', togglePlay);
        
        // También permitir hacer clic en el video para reproducir/pausar
        videoPlayer.addEventListener('click', togglePlay);
    }
    
    function togglePlay() {
        if (videoPlayer.paused || videoPlayer.ended) {
            videoPlayer.play()
                .catch(error => {
                    console.error('Error al reproducir el video:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de reproducción',
                        text: 'No se pudo reproducir el video. Intenta de nuevo más tarde.',
                        confirmButtonColor: '#2d8f3c'
                    });
                });
        } else {
            videoPlayer.pause();
        }
    }
    
    /**
     * Actualización de los iconos del botón play/pause
     */
    videoPlayer.addEventListener('play', () => {
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        playButton.setAttribute('aria-label', 'Pausar video');
        showControls();
    });
    
    videoPlayer.addEventListener('pause', () => {
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        playButton.setAttribute('aria-label', 'Reproducir video');
        showControls();
    });
    
    /**
     * Funcionalidad del botón silenciar/restaurar sonido
     */
    if (muteButton) {
        muteButton.addEventListener('click', toggleMute);
    }
    
    function toggleMute() {
        videoPlayer.muted = !videoPlayer.muted;
        muteButton.innerHTML = videoPlayer.muted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
        muteButton.setAttribute('aria-label', 
            videoPlayer.muted ? 'Activar sonido' : 'Silenciar video');
    }
    
    /**
     * Función para pantalla completa
     */
    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', toggleFullScreen);
    }
    
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.webkitRequestFullscreen) { // Safari
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) { // IE11
                videoContainer.msRequestFullscreen();
            }
            fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
            fullscreenButton.setAttribute('aria-label', 'Salir de pantalla completa');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { // Safari
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE11
                document.msExitFullscreen();
            }
            fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenButton.setAttribute('aria-label', 'Pantalla completa');
        }
    }
    
    /**
     * Actualización de la barra de progreso
     */
    if (progressBar && progress) {
        videoPlayer.addEventListener('timeupdate', updateProgress);
        progressBar.addEventListener('click', seek);
        
        // Accesibilidad: controlar el progreso con el teclado
        progressBar.addEventListener('keydown', function(e) {
            // Izquierda/derecha para navegar en el video
            if (e.key === 'ArrowLeft') {
                videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime - 10);
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                videoPlayer.currentTime = Math.min(videoPlayer.duration, videoPlayer.currentTime + 10);
                e.preventDefault();
            }
        });
        
        // Hacer la barra de progreso accesible con teclado
        progressBar.setAttribute('tabindex', '0');
    }
    
    function updateProgress() {
        if (!progress) return;
        
        const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progress.style.width = `${percent}%`;
        
        // Actualizar el atributo aria para accesibilidad
        progressBar.setAttribute('aria-valuenow', Math.round(percent));
        progressBar.setAttribute('aria-valuetext', `${formatTime(videoPlayer.currentTime)} de ${formatTime(videoPlayer.duration)}`);
    }
    
    function seek(e) {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
        videoPlayer.currentTime = pos * videoPlayer.duration;
    }
    
    /**
     * Formatear tiempo en segundos a formato MM:SS
     */
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    /**
     * Soporte para teclado (accesibilidad)
     */
    videoPlayer.addEventListener('keydown', function(e) {
        // Espacio para reproducir/pausar
        if (e.key === ' ' || e.key === 'Enter') {
            togglePlay();
            e.preventDefault();
        }
        // M para silenciar
        else if (e.key === 'm' || e.key === 'M') {
            toggleMute();
            e.preventDefault();
        }
        // F para pantalla completa
        else if (e.key === 'f' || e.key === 'F') {
            toggleFullScreen();
            e.preventDefault();
        }
        // Flechas para avanzar/retroceder
        else if (e.key === 'ArrowLeft') {
            videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime - 5);
            e.preventDefault();
        }
        else if (e.key === 'ArrowRight') {
            videoPlayer.currentTime = Math.min(videoPlayer.duration, videoPlayer.currentTime + 5);
            e.preventDefault();
        }
        // Flechas para subir/bajar volumen
        else if (e.key === 'ArrowUp') {
            videoPlayer.volume = Math.min(1, videoPlayer.volume + 0.1);
            e.preventDefault();
        }
        else if (e.key === 'ArrowDown') {
            videoPlayer.volume = Math.max(0, videoPlayer.volume - 0.1);
            e.preventDefault();
        }
    });
    
    /**
     * Mostrar mensaje cuando el video termina
     * Ofrece la opción de explorar minimarkets
     */
    videoPlayer.addEventListener('ended', () => {
        Swal.fire({
            title: '¿Te gustó nuestro video?',
            text: 'Descubre más sobre Villa Markets visitando nuestras tiendas',
            icon: 'success',
            confirmButtonText: 'Explorar Minimarkets',
            confirmButtonColor: '#2d8f3c'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'minimarkets.html';
            } else {
                // Reiniciar el video para volver a verlo
                videoPlayer.currentTime = 0;
                playButton.focus(); // Devolver el foco al botón de reproducción
            }
        });
    });
    
    /**
     * Inicializar valores para accesibilidad
     */
    if (progressBar) {
        progressBar.setAttribute('aria-label', 'Progreso del video');
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '100');
        progressBar.setAttribute('aria-valuenow', '0');
        progressBar.setAttribute('aria-valuetext', '0:00 de 0:00');
    }
    
    // Hacer que el video sea enfocable con teclado
    videoPlayer.setAttribute('tabindex', '0');
});
