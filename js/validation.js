/**
 * validation.js - Script para validación de formularios en Villa Market
 * 
 * Este archivo contiene funciones para validar formularios en tiempo real,
 * proporcionar feedback inmediato al usuario y mejorar la experiencia de usuario.
 * Implementa características de accesibilidad siguiendo ARIA para asegurar
 * que todos los usuarios puedan interactuar con los formularios correctamente.
 * 
 * @author GitHub Copilot
 * @version 1.0
 */

// Inicializar los componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips de Bootstrap si existen
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => {
            new bootstrap.Tooltip(tooltip);
        });
    }
    
    // Inicializar contadores para elementos con animación
    initCounters();
    
    // Inicializar validador para formularios
    initFormValidation();
    
    // Actualizar contador del carrito
    updateCartCount();
});

/**
 * Busca un pedido por su número y muestra los detalles
 * Incluye validación mejorada y feedback al usuario
 */
function buscarPedido() {
    // Obtener y validar entrada
    const inputElement = document.getElementById('pedido-numero');
    const numeroPedido = inputElement.value.trim();
    
    // Resetear estados previos
    resetValidationState(inputElement);
    
    // Validar campo vacío con feedback visual inmediato
    if (!numeroPedido) {
        setInvalidState(inputElement, 'El número de pedido es requerido');
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor, ingresa un número de pedido',
            confirmButtonColor: '#2d8f3c'
        });
        return;
    }
    
    // Validar formato de número de pedido (ejemplo: VM-123456-789)
    const pedidoRegex = /^[A-Z]+-\d+-\d+$/;
    if (!pedidoRegex.test(numeroPedido) && !numeroPedido.startsWith('P-')) {
        setInvalidState(inputElement, 'Formato inválido. Ej: VM-123456-789');
        Swal.fire({
            icon: 'warning',
            title: 'Formato incorrecto',
            text: 'El formato del número de pedido no es válido',
            confirmButtonColor: '#2d8f3c'
        });
        return;
    }
    
    // Si pasa validación, muestra estado "cargando"
    setLoadingState(inputElement);
    
    // Simular latencia de red para demostración de UX
    setTimeout(() => {
        // Obtener pedidos guardados
        const pedidos = JSON.parse(localStorage.getItem('pedidosVillaMarkets')) || [];
        const pedido = pedidos.find(p => p.id === numeroPedido);
        
        if (!pedido) {
            setInvalidState(inputElement, 'Pedido no encontrado');
            Swal.fire({
                icon: 'error',
                title: 'Pedido no encontrado',
                text: `No se encontró el pedido ${numeroPedido}`,
                confirmButtonColor: '#2d8f3c'
            });
            return;
        }
        
        // Pedido encontrado - mostrar estado válido
        setValidState(inputElement, '¡Pedido encontrado!');
        
        // Formatear total
        const total = typeof pedido.totales?.total === 'number' 
            ? `$${pedido.totales.total.toLocaleString('es-CL')}` 
            : pedido.total || '$0';
        
        // Determinar nombre del minimarket
        let nombreMinimarket = pedido.minimarket;
        if (pedido.minimarket === 'M001') nombreMinimarket = 'Villa Central';
        else if (pedido.minimarket === 'M002') nombreMinimarket = 'Villa Norte';
        else if (pedido.minimarket === 'M003') nombreMinimarket = 'Villa Sur';
        else if (pedido.minimarket === 'M004') nombreMinimarket = 'Villa Este';
        
        // Mostrar información del pedido con una experiencia mejorada
        Swal.fire({
            title: `Pedido #${pedido.id}`,
            html: `
                <div class="text-start">
                    <div class="d-flex justify-content-between">
                        <strong>Fecha:</strong>
                        <span>${pedido.fecha} ${pedido.hora || ''}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <strong>Estado:</strong>
                        <span class="badge ${
                            pedido.estado === 'Entregado' ? 'bg-success' : 
                            pedido.estado === 'Cancelado' ? 'bg-danger' : 'bg-warning'
                        }">${pedido.estado}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <strong>Total:</strong>
                        <span>${total}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <strong>Método de entrega:</strong>
                        <span>${pedido.tipoEntrega === 'recoger' ? 'Recoger en tienda' : 'Delivery'}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <strong>Minimarket:</strong>
                        <span>${nombreMinimarket}</span>
                    </div>
                    ${pedido.items ? getPedidoItemsHTML(pedido.items) : ''}
                </div>
                <div class="mt-4 text-center">
                    <a href="menuprincipal.html#pedidos" class="btn btn-green">Ver todos mis pedidos</a>
                </div>
            `,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#2d8f3c',
            width: '500px'
        });
    }, 800); // Simular tiempo de carga
}

/**
 * Genera el HTML para mostrar los items de un pedido
 * @param {Array} items - Arreglo de productos del pedido
 * @returns {string} HTML con los items del pedido
 */
function getPedidoItemsHTML(items) {
    if (!items || !items.length) return '';
    
    let html = '<hr><h6 class="mt-3">Productos:</h6><ul class="list-group list-group-flush">';
    
    items.forEach(item => {
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center p-2">
                <div>
                    <span>${item.nombre}</span>
                    <span class="badge bg-secondary ms-2">${item.cantidad}x</span>
                </div>
                <span>$${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
            </li>
        `;
    });
    
    html += '</ul>';
    return html;
}

/**
 * Configura la validación de formularios
 */
function initFormValidation() {
    // Obtener todos los formularios con clase needs-validation
    const forms = document.querySelectorAll('.needs-validation');
    
    // Iterar sobre ellos y evitar el envío si no son válidos
    forms.forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
        
        // Validación en tiempo real para campos requeridos
        const requiredInputs = form.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    validateInput(input);
                }
            });
        });
    });
    
    // Validación específica para campo de email si existe
    const emailInput = document.getElementById('email-suscripcion');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !validateEmail(emailInput.value)) {
                setInvalidState(emailInput, 'Email inválido');
            }
        });
    }
}

/**
 * Valida un campo de entrada
 * @param {HTMLElement} input - El elemento de entrada a validar
 */
function validateInput(input) {
    if (!input.value.trim() && input.hasAttribute('required')) {
        setInvalidState(input, 'Este campo es obligatorio');
    } else {
        resetValidationState(input);
    }
}

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - Si el email es válido
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Establece estado inválido en un input
 * @param {HTMLElement} input - El input a marcar como inválido
 * @param {string} message - Mensaje de error
 */
function setInvalidState(input, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    
    // Crear o actualizar mensaje de feedback
    let feedback = input.nextElementSibling;
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        input.parentNode.insertBefore(feedback, input.nextSibling);
    }
    feedback.textContent = message;
}

/**
 * Establece estado válido en un input
 * @param {HTMLElement} input - El input a marcar como válido
 * @param {string} message - Mensaje de éxito (opcional)
 */
function setValidState(input, message) {
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
    
    // Crear o actualizar mensaje de feedback
    if (message) {
        let feedback = input.parentNode.querySelector('.valid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'valid-feedback';
            input.parentNode.insertBefore(feedback, input.nextSibling);
        }
        feedback.textContent = message;
    }
}

/**
 * Establece estado de carga en un input
 * @param {HTMLElement} input - El input a marcar como en carga
 */
function setLoadingState(input) {
    // Remover clases previas
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');
    
    // Añadir clase de carga y deshabilitar input temporalmente
    input.classList.add('input-loading');
    input.disabled = true;
    
    // Añadir icono de carga después del input
    const loadingIcon = document.createElement('span');
    loadingIcon.className = 'spinner-border spinner-border-sm ms-2 text-green';
    loadingIcon.setAttribute('role', 'status');
    loadingIcon.setAttribute('aria-hidden', 'true');
    loadingIcon.id = 'loading-indicator';
    
    // Verificar si ya existe un indicador
    const existingIndicator = input.parentNode.querySelector('#loading-indicator');
    if (!existingIndicator) {
        if (input.nextElementSibling) {
            input.parentNode.insertBefore(loadingIcon, input.nextElementSibling);
        } else {
            input.parentNode.appendChild(loadingIcon);
        }
    }
    
    // Restaurar después de la operación
    setTimeout(() => {
        input.classList.remove('input-loading');
        input.disabled = false;
        const indicator = document.getElementById('loading-indicator');
        if (indicator) indicator.remove();
    }, 800);
}

/**
 * Resetea el estado de validación de un input
 * @param {HTMLElement} input - El input a resetear
 */
function resetValidationState(input) {
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');
    
    // Remover mensajes de feedback
    const invalidFeedback = input.parentNode.querySelector('.invalid-feedback');
    if (invalidFeedback) invalidFeedback.remove();
    
    const validFeedback = input.parentNode.querySelector('.valid-feedback');
    if (validFeedback) validFeedback.remove();
}

/**
 * Inicializa contadores animados para estadísticas
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1500; // ms
        const step = target / (duration / 16); // 60 FPS aprox
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString('es-CL');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString('es-CL');
            }
        };
        
        // Iniciar animación cuando el elemento es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

/**
 * Actualiza el contador del carrito basado en localStorage
 */
function updateCartCount() {
    const cartBadge = document.getElementById('cart-count');
    if (!cartBadge) return;
    
    const carrito = JSON.parse(localStorage.getItem('carritoVillaMarkets')) || [];
    const itemCount = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    cartBadge.textContent = itemCount;
    
    // Mostrar u ocultar según contenido
    if (itemCount > 0) {
        cartBadge.style.display = 'inline';
    } else {
        cartBadge.style.display = 'none';
    }
}
