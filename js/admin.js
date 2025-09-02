/**
 * admin.js - Funcionalidades para el panel de administración
 * 
 * Este archivo contiene las funciones comunes para el panel de administración
 * de los dueños de minimarkets en Villa Market.
 * 
 * @author GitHub Copilot
 * @version 1.0
 */

// Datos del usuario administrador (dueño del minimarket)
const usuarioAdmin = {
    id: 'M001',
    nombre: 'Juan Martínez',
    minimarket: 'Villa Central',
    email: 'juan.martinez@example.com',
    rol: 'dueño',
    ultimoAcceso: '2025-09-01T15:30:00'
};

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del usuario
    cargarDatosUsuario();
    
    // Configurar cierre de sesión
    configurarCierreSesion();
    
    // Otras inicializaciones específicas según la página
    inicializarPaginaActual();
});

/**
 * Cargar datos del usuario en la interfaz
 */
function cargarDatosUsuario() {
    // Mostrar nombre del usuario en el menú
    const adminNameElement = document.getElementById('admin-name');
    if (adminNameElement) {
        adminNameElement.textContent = usuarioAdmin.nombre;
    }
    
    // Mostrar nombre del minimarket
    const minimarketNameElement = document.getElementById('minimarket-name');
    if (minimarketNameElement) {
        minimarketNameElement.textContent = usuarioAdmin.minimarket;
    }
}

/**
 * Configurar el botón de cierre de sesión
 */
function configurarCierreSesion() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            Swal.fire({
                title: '¿Cerrar sesión?',
                text: "Se cerrará tu sesión actual",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#2d8f3c',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // En una aplicación real, aquí se haría el logout en el servidor
                    window.location.href = 'home.html';
                }
            });
        });
    }
}

/**
 * Inicializar funciones específicas según la página actual
 */
function inicializarPaginaActual() {
    // Obtener la URL actual
    const currentPage = window.location.pathname.split('/').pop();
    
    // Ejecutar funciones específicas según la página
    switch (currentPage) {
        case 'admin-panel.html':
            inicializarDashboard();
            break;
        case 'admin-ventas.html':
            inicializarVentas();
            break;
        // Otras páginas específicas
    }
}

/**
 * Inicializar el dashboard con estadísticas y gráficos
 */
function inicializarDashboard() {
    // Si existe el Canvas para el gráfico de ventas
    const ventasChart = document.getElementById('ventas-chart');
    if (ventasChart && typeof Chart !== 'undefined') {
        const ctx = ventasChart.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Ventas diarias (miles $)',
                    data: [43, 58, 50, 55, 75, 98, 45],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

/**
 * Inicializar la página de ventas con gráficos y estadísticas
 */
function inicializarVentas() {
    // Implementar gráficos y estadísticas para la página de ventas
    console.log('Inicializando página de ventas');
}

/**
 * Formatear moneda en formato chileno
 * @param {number} valor - Valor numérico a formatear
 * @returns {string} Valor formateado como moneda chilena
 */
function formatoMoneda(valor) {
    return '$' + valor.toLocaleString('es-CL');
}

/**
 * Formatear fecha en formato chileno
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatoFecha(fecha) {
    if (!(fecha instanceof Date)) {
        fecha = new Date(fecha);
    }
    
    return fecha.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Validar formulario (para uso general en el panel)
 * @param {HTMLFormElement} form - El formulario a validar
 * @returns {boolean} Si el formulario es válido o no
 */
function validarFormulario(form) {
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return false;
    }
    return true;
}

/**
 * Mostrar mensaje de éxito
 * @param {string} titulo - Título del mensaje
 * @param {string} mensaje - Contenido del mensaje
 */
function mostrarMensajeExito(titulo, mensaje) {
    Swal.fire({
        icon: 'success',
        title: titulo,
        text: mensaje,
        confirmButtonColor: '#2d8f3c'
    });
}

/**
 * Mostrar mensaje de error
 * @param {string} titulo - Título del mensaje
 * @param {string} mensaje - Contenido del mensaje
 */
function mostrarMensajeError(titulo, mensaje) {
    Swal.fire({
        icon: 'error',
        title: titulo,
        text: mensaje,
        confirmButtonColor: '#2d8f3c'
    });
}
