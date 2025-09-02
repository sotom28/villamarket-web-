// main.js - Funciones principales para Villa Markets
// Autor: Equipo Villa Markets
// Fecha: 1 de Septiembre, 2025

// ------------------ DATOS DE EJEMPLO ------------------
// Ofertas de ejemplo
const ofertas = [
    '2x1 en arroz integral',
    'Leche a $1.000',
    'Descuento 30% en frutas y verduras',
    'Pan integral 20% off',
    'Yogurt pack de 4 a $2.990'
];

// Productos de ejemplo
const productos = [
    { 
        id: 1, 
        nombre: 'Arroz Integral', 
        precio: 1490, 
        categoria: 'Abarrotes',
        imagen: 'img/arroz.jpg',
        descripcion: 'Arroz integral de grano largo, 1kg',
        stock: 45,
        minimarket: 'Villa Central'
    },
    { 
        id: 2, 
        nombre: 'Leche Descremada', 
        precio: 1000, 
        categoria: 'Lácteos',
        imagen: 'img/leche.jpg',
        descripcion: 'Leche descremada, 1L',
        stock: 38,
        minimarket: 'Villa Norte'
    },
    { 
        id: 3, 
        nombre: 'Manzanas', 
        precio: 1990, 
        categoria: 'Frutas',
        imagen: 'img/manzanas.jpg',
        descripcion: 'Manzanas rojas, 1kg',
        stock: 50,
        minimarket: 'Villa Sur'
    },
    { 
        id: 4, 
        nombre: 'Pan Integral', 
        precio: 2490, 
        categoria: 'Panadería',
        imagen: 'img/pan.jpg',
        descripcion: 'Pan integral de masa madre, 500g',
        stock: 15,
        minimarket: 'Villa Este'
    },
    { 
        id: 5, 
        nombre: 'Yogurt Natural', 
        precio: 2990, 
        categoria: 'Lácteos',
        imagen: 'img/yogurt.jpg',
        descripcion: 'Pack de 4 yogurt natural sin azúcar',
        stock: 22,
        minimarket: 'Villa Central'
    }
];

// Minimarkets de ejemplo
const minimarkets = [
    {
        id: 'M001',
        nombre: 'Villa Central',
        direccion: 'Av. Central 123',
        comuna: 'Santiago',
        latitud: -33.447487,
        longitud: -70.673676,
        horario: 'Lun-Vie: 8:00-21:00, Sáb-Dom: 9:00-20:00',
        telefono: '+56912345678',
        estado: 'Activo'
    },
    {
        id: 'M002',
        nombre: 'Villa Norte',
        direccion: 'Av. Norte 456',
        comuna: 'La Reina',
        latitud: -33.435827,
        longitud: -70.569067,
        horario: 'Lun-Vie: 8:00-21:00, Sáb-Dom: 9:00-20:00',
        telefono: '+56912345679',
        estado: 'Activo'
    },
    {
        id: 'M003',
        nombre: 'Villa Sur',
        direccion: 'Av. Sur 789',
        comuna: 'La Florida',
        latitud: -33.529259,
        longitud: -70.599280,
        horario: 'Lun-Vie: 8:00-21:00, Sáb-Dom: 9:00-20:00',
        telefono: '+56912345680',
        estado: 'Activo'
    },
    {
        id: 'M004',
        nombre: 'Villa Este',
        direccion: 'Av. Este 321',
        comuna: 'Ñuñoa',
        latitud: -33.457462,
        longitud: -70.605671,
        horario: 'Lun-Vie: 8:00-21:00, Sáb-Dom: 9:00-20:00',
        telefono: '+56912345681',
        estado: 'Activo'
    },
];

// ------------------ FUNCIONES PRINCIPALES ------------------

/**
 * Inicializa la aplicación cuando se carga la página
 * Esta función se ejecuta automáticamente al cargar cualquier página del sitio
 */
window.onload = function() {
    console.log('Villa Markets - Iniciando aplicación');
    
    // Inicializar datos de usuario
    verificarSesion();
    
    // Cargar ofertas en la página principal
    cargarOfertas();
    
    // Cargar productos si estamos en la página de productos
    cargarProductos();
    
    // Cargar minimarkets si estamos en la página de minimarkets
    cargarMinimarkets();
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
};

/**
 * Verifica si hay una sesión activa de usuario
 * En caso afirmativo, actualiza la interfaz con los datos del usuario
 * En caso negativo, muestra opciones para iniciar sesión/registrarse
 */
function verificarSesion() {
    console.log('Verificando sesión de usuario...');
    
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const menuOpciones = document.getElementById('menu-opciones');
    
    if (!menuOpciones) return; // Si no estamos en una página con menú, salimos
    
    // Actualizar la interfaz según el estado de la sesión
    if (usuarioActual) {
        console.log(`Sesión activa: ${usuarioActual.nombre} (${usuarioActual.rol})`);
        
        // Actualizar el menú para usuario logueado
        menuOpciones.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="home.html">Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="productos.html">Productos</a></li>
            <li class="nav-item"><a class="nav-link" href="minimarkets.html">Minimarkets</a></li>
            <li class="nav-item"><a class="nav-link" href="carrito.html">
                <i class="fas fa-shopping-cart"></i> Carrito
                <span class="badge bg-danger rounded-pill" id="carrito-contador">0</span>
            </a></li>
            <li class="nav-item"><a class="nav-link" href="menuprincipal.html">
                <i class="fas fa-user"></i> Mi Cuenta
            </a></li>
        `;
        
        // Si es administrador, agregar enlace de administración
        if (usuarioActual.rol === 'admin') {
            menuOpciones.innerHTML += `
                <li class="nav-item"><a class="nav-link" href="menuprincipal.html#admin">
                    <i class="fas fa-cog"></i> Administración
                </a></li>
            `;
        }
        
        // Agregar botón de cerrar sesión
        menuOpciones.innerHTML += `
            <li class="nav-item"><button class="btn btn-outline-danger btn-sm ms-2" onclick="cerrarSesion()">Cerrar Sesión</button></li>
        `;
    } else {
        console.log('No hay sesión activa');
        
        // Menú para visitantes
        menuOpciones.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="home.html">Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="productos.html">Productos</a></li>
            <li class="nav-item"><a class="nav-link" href="minimarkets.html">Minimarkets</a></li>
            <li class="nav-item"><a class="nav-link" href="carrito.html">
                <i class="fas fa-shopping-cart"></i> Carrito
            </a></li>
            <li class="nav-item"><a class="nav-link" href="login.html">Iniciar Sesión</a></li>
            <li class="nav-item"><a class="nav-link" href="registro.html">Registrarse</a></li>
        `;
    }
}

/**
 * Carga las ofertas disponibles en la página principal
 */
function cargarOfertas() {
    console.log('Cargando ofertas...');
    const lista = document.getElementById('ofertas-lista');
    
    if (lista) {
        // Limpiamos la lista por si ya tenía elementos
        lista.innerHTML = '';
        
        // Agregamos cada oferta a la lista
        ofertas.forEach(oferta => {
            const li = document.createElement('li');
            li.textContent = oferta;
            li.className = 'list-group-item d-flex align-items-center';
            
            // Añadir icono para las ofertas
            const icono = document.createElement('i');
            icono.className = 'fas fa-tag text-green me-2';
            li.prepend(icono);
            
            lista.appendChild(li);
        });
        
        console.log(`Se cargaron ${ofertas.length} ofertas`);
    }
}

/**
 * Carga los productos en la página de productos
 * Permite filtrar y ordenar los productos según diferentes criterios
 */
function cargarProductos() {
    console.log('Cargando productos...');
    const contenedorProductos = document.getElementById('productos-container');
    
    if (contenedorProductos) {
        // Limpiamos el contenedor
        contenedorProductos.innerHTML = '';
        
        // Obtenemos los filtros (categoría seleccionada, rango de precio, etc.)
        const filtroCategoria = obtenerFiltroCategoria();
        
        // Filtramos los productos
        let productosFiltrados = productos;
        
        if (filtroCategoria && filtroCategoria !== 'Todas') {
            productosFiltrados = productos.filter(p => p.categoria === filtroCategoria);
        }
        
        // Mostramos los productos
        productosFiltrados.forEach(producto => {
            const cardProducto = document.createElement('div');
            cardProducto.className = 'col-md-4 mb-4';
            cardProducto.innerHTML = `
                <div class="card h-100">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <p class="card-text"><small class="text-muted">Categoría: ${producto.categoria}</small></p>
                        <p class="card-text"><strong>$${producto.precio.toLocaleString()}</strong></p>
                        <p class="card-text"><small class="text-muted">Disponible en: ${producto.minimarket}</small></p>
                    </div>
                    <div class="card-footer bg-white">
                        <button class="btn btn-green" onclick="agregarAlCarrito(${producto.id})">
                            <i class="fas fa-cart-plus"></i> Agregar al carrito
                        </button>
                    </div>
                </div>
            `;
            contenedorProductos.appendChild(cardProducto);
        });
        
        console.log(`Se cargaron ${productosFiltrados.length} productos`);
    }
}

/**
 * Obtiene el filtro de categoría seleccionado
 * @returns {string} Categoría seleccionada o 'Todas' si no hay filtro
 */
function obtenerFiltroCategoria() {
    const selectCategoria = document.getElementById('filtro-categoria');
    if (selectCategoria) {
        return selectCategoria.value;
    }
    return 'Todas';
}

/**
 * Añade un producto al carrito de compras
 * @param {number} productoId - ID del producto a agregar
 */
function agregarAlCarrito(productoId) {
    console.log(`Agregando producto ID ${productoId} al carrito`);
    
    // Buscar el producto en la lista de productos
    const producto = productos.find(p => p.id === productoId);
    
    if (producto) {
        // Obtener el carrito actual o crear uno nuevo
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.id === productoId);
        
        if (productoExistente) {
            // Si ya existe, aumentar la cantidad
            productoExistente.cantidad += 1;
        } else {
            // Si no existe, agregarlo con cantidad 1
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1,
                minimarket: producto.minimarket
            });
        }
        
        // Guardar el carrito actualizado en ambas claves para compatibilidad
        localStorage.setItem('carrito', JSON.stringify(carrito));
        localStorage.setItem('carritoVillaMarkets', JSON.stringify(carrito));
        
        // Actualizar el contador del carrito
        actualizarContadorCarrito();
        
        // Mostrar mensaje de confirmación
        alert(`${producto.nombre} añadido al carrito`);
    } else {
        console.error(`Producto ID ${productoId} no encontrado`);
    }
}

/**
 * Actualiza el contador de productos en el carrito
 * que se muestra en la barra de navegación
 */
function actualizarContadorCarrito() {
    const contadorElement = document.getElementById('carrito-contador');
    if (!contadorElement) return;
    
    // Obtener el carrito actual - verificar ambas claves para compatibilidad
    const carrito = JSON.parse(localStorage.getItem('carritoVillaMarkets')) || 
                  JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Calcular la cantidad total de productos
    const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    // Actualizar el contador
    contadorElement.textContent = totalProductos;
}

/**
 * Carga los datos de los minimarkets en la página de minimarkets
 * Si está disponible, utiliza el API de mapas para mostrarlos en un mapa interactivo
 */
function cargarMinimarkets() {
    console.log('Cargando minimarkets...');
    const contenedorMinimarkets = document.getElementById('minimarkets-container');
    const mapaContainer = document.getElementById('mapa-minimarkets');
    
    if (contenedorMinimarkets) {
        // Limpiamos el contenedor
        contenedorMinimarkets.innerHTML = '';
        
        // Mostramos cada minimarket
        minimarkets.forEach(market => {
            const cardMinimarket = document.createElement('div');
            cardMinimarket.className = 'col-md-6 mb-4';
            cardMinimarket.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${market.nombre}</h5>
                        <p class="card-text"><i class="fas fa-map-marker-alt text-green me-2"></i>${market.direccion}, ${market.comuna}</p>
                        <p class="card-text"><i class="fas fa-clock text-green me-2"></i>${market.horario}</p>
                        <p class="card-text"><i class="fas fa-phone text-green me-2"></i>${market.telefono}</p>
                    </div>
                    <div class="card-footer bg-white">
                        <button class="btn btn-sm btn-green" onclick="verDetalleMinimarket('${market.id}')">
                            <i class="fas fa-info-circle"></i> Más información
                        </button>
                        <button class="btn btn-sm btn-outline-green" onclick="verEnMapa('${market.id}')">
                            <i class="fas fa-map"></i> Ver en mapa
                        </button>
                    </div>
                </div>
            `;
            contenedorMinimarkets.appendChild(cardMinimarket);
        });
        
        console.log(`Se cargaron ${minimarkets.length} minimarkets`);
    }
    
    // Si existe el contenedor del mapa, inicializamos Leaflet
    if (mapaContainer) {
        inicializarMapa();
    }
}

/**
 * Inicializa el mapa de Leaflet para mostrar los minimarkets
 */
function inicializarMapa() {
    console.log('Inicializando mapa de minimarkets...');
    
    // Verificar si Leaflet está disponible
    if (typeof L !== 'undefined') {
        // Crear el mapa centrado en Santiago
        const mapa = L.map('mapa-minimarkets').setView([-33.447487, -70.673676], 12);
        
        // Agregar la capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapa);
        
        // Agregar marcadores para cada minimarket
        minimarkets.forEach(market => {
            const marker = L.marker([market.latitud, market.longitud])
                .addTo(mapa)
                .bindPopup(`<b>${market.nombre}</b><br>${market.direccion}<br>${market.comuna}`);
        });
        
        // Verificar ubicación del usuario para mostrar el minimarket más cercano
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    
                    // Agregar marcador para la ubicación del usuario
                    L.marker([userLat, userLng], {
                        icon: L.divIcon({
                            className: 'user-location-marker',
                            html: '<i class="fas fa-user-circle fa-2x text-primary"></i>',
                            iconSize: [25, 25]
                        })
                    }).addTo(mapa).bindPopup('Tu ubicación');
                    
                    // Encontrar el minimarket más cercano
                    const minimarketCercano = encontrarMinimarketMasCercano(userLat, userLng);
                    mostrarMinimarketMasCercano(minimarketCercano);
                },
                error => {
                    console.error('Error al obtener la ubicación:', error);
                    alert('No se pudo obtener tu ubicación. Por favor, habilita el acceso a la ubicación para encontrar el minimarket más cercano.');
                }
            );
        }
    } else {
        console.error('Leaflet no está disponible. No se puede inicializar el mapa.');
        document.getElementById('mapa-minimarkets').innerHTML = 
            '<div class="alert alert-warning">No se pudo cargar el mapa. Por favor, verifica tu conexión a internet.</div>';
    }
}

/**
 * Encuentra el minimarket más cercano a la ubicación del usuario
 * @param {number} userLat - Latitud del usuario
 * @param {number} userLng - Longitud del usuario
 * @returns {object} Minimarket más cercano y la distancia
 */
function encontrarMinimarketMasCercano(userLat, userLng) {
    let minimarketCercano = null;
    let distanciaMinima = Infinity;
    
    minimarkets.forEach(market => {
        const distancia = calcularDistancia(
            userLat, userLng, 
            market.latitud, market.longitud
        );
        
        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            minimarketCercano = market;
        }
    });
    
    return {
        minimarket: minimarketCercano,
        distancia: distanciaMinima
    };
}

/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
 * @param {number} lat1 - Latitud del punto 1
 * @param {number} lon1 - Longitud del punto 1
 * @param {number} lat2 - Latitud del punto 2
 * @param {number} lon2 - Longitud del punto 2
 * @returns {number} Distancia en kilómetros
 */
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en km
    return distance;
}

/**
 * Muestra información sobre el minimarket más cercano
 * @param {object} resultado - Objeto con el minimarket y la distancia
 */
function mostrarMinimarketMasCercano(resultado) {
    const infoContainer = document.getElementById('minimarket-cercano-info');
    if (!infoContainer) return;
    
    const { minimarket, distancia } = resultado;
    
    infoContainer.innerHTML = `
        <div class="alert alert-success">
            <h4><i class="fas fa-store me-2"></i>Minimarket más cercano</h4>
            <p class="mb-1"><strong>${minimarket.nombre}</strong></p>
            <p class="mb-1">${minimarket.direccion}, ${minimarket.comuna}</p>
            <p class="mb-1">Distancia: ${distancia.toFixed(2)} km</p>
            <button class="btn btn-sm btn-green mt-2" onclick="verDetalleMinimarket('${minimarket.id}')">
                Ver detalles
            </button>
        </div>
    `;
}

/**
 * Muestra los detalles de un minimarket específico
 * @param {string} minimarketId - ID del minimarket
 */
function verDetalleMinimarket(minimarketId) {
    console.log(`Mostrando detalles del minimarket ${minimarketId}`);
    
    const minimarket = minimarkets.find(m => m.id === minimarketId);
    
    if (minimarket) {
        // Almacenar el ID del minimarket seleccionado para mostrar sus detalles
        localStorage.setItem('minimarketSeleccionado', minimarketId);
        
        // Redirigir a la página de detalles o mostrar un modal
        // Por ahora, mostraremos un alert con los detalles
        alert(`
            Minimarket: ${minimarket.nombre}
            Dirección: ${minimarket.direccion}, ${minimarket.comuna}
            Horario: ${minimarket.horario}
            Teléfono: ${minimarket.telefono}
        `);
    } else {
        console.error(`Minimarket ID ${minimarketId} no encontrado`);
    }
}

/**
 * Centra el mapa en un minimarket específico
 * @param {string} minimarketId - ID del minimarket
 */
function verEnMapa(minimarketId) {
    console.log(`Centrando mapa en minimarket ${minimarketId}`);
    
    const minimarket = minimarkets.find(m => m.id === minimarketId);
    
    if (minimarket && typeof L !== 'undefined') {
        const mapa = document.getElementById('mapa-minimarkets')._leaflet_map;
        if (mapa) {
            mapa.setView([minimarket.latitud, minimarket.longitud], 16);
            
            // Buscar y abrir el popup del marcador
            mapa.eachLayer(layer => {
                if (layer._latlng && 
                    layer._latlng.lat === minimarket.latitud && 
                    layer._latlng.lng === minimarket.longitud) {
                    layer.openPopup();
                }
            });
        }
    } else {
        console.error(`No se pudo centrar el mapa en el minimarket ${minimarketId}`);
    }
}

/**
 * Cierra la sesión del usuario actual
 * Elimina los datos de la sesión y redirige a la página de inicio
 */
function cerrarSesion() {
    console.log('Cerrando sesión...');
    
    // Eliminar datos de sesión
    localStorage.removeItem('usuarioActual');
    
    // Mostrar mensaje
    alert('Has cerrado sesión correctamente.');
    
    // Redirigir a la página de inicio
    window.location.href = 'home.html';
}
