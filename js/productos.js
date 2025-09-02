/**
 * productos.js - Gestión de productos para el panel de administración
 * 
 * Este archivo contiene las funciones para la gestión CRUD de productos
 * para los dueños de minimarkets en Villa Market.
 * 
 * @author GitHub Copilot
 * @version 1.0
 */

// Productos de ejemplo precargados para demostración
const productosDemostracion = [
    {
        id: 1,
        codigo: 'LACT001',
        nombre: 'Leche Entera 1L',
        categoria: 'lacteos',
        precio: 1200,
        stock: 45,
        descripcion: 'Leche entera de vaca, envase tetrapak de 1 litro',
        imagen: 'img/productos/leche.jpg',
        estado: 'activo',
        destacado: true
    },
    {
        id: 2,
        codigo: 'PAN001',
        nombre: 'Pan Marraqueta',
        categoria: 'panaderia',
        precio: 1800,
        stock: 30,
        descripcion: 'Pan marraqueta fresco, bolsa de 1kg',
        imagen: 'img/productos/pan.jpg',
        estado: 'activo',
        destacado: false
    },
    {
        id: 3,
        codigo: 'FRUT001',
        nombre: 'Manzanas Rojas',
        categoria: 'frutas',
        precio: 1500,
        stock: 40,
        descripcion: 'Manzanas rojas frescas, bolsa de 1kg',
        imagen: 'img/productos/manzanas.jpg',
        estado: 'oferta',
        destacado: true
    },
    {
        id: 4,
        codigo: 'BEB001',
        nombre: 'Coca-Cola 2L',
        categoria: 'bebidas',
        precio: 1700,
        stock: 60,
        descripcion: 'Bebida gaseosa Coca-Cola, botella de 2 litros',
        imagen: 'img/productos/cocacola.jpg',
        estado: 'activo',
        destacado: false
    },
    {
        id: 5,
        codigo: 'LIMP001',
        nombre: 'Detergente Líquido 1L',
        categoria: 'limpieza',
        precio: 2500,
        stock: 25,
        descripcion: 'Detergente líquido concentrado, envase de 1 litro',
        imagen: 'img/productos/detergente.jpg',
        estado: 'activo',
        destacado: false
    },
    {
        id: 6,
        codigo: 'ABAR001',
        nombre: 'Arroz Grado 1',
        categoria: 'abarrotes',
        precio: 1300,
        stock: 80,
        descripcion: 'Arroz grado 1, bolsa de 1kg',
        imagen: 'img/productos/arroz.jpg',
        estado: 'activo',
        destacado: true
    },
    {
        id: 7,
        codigo: 'LACT002',
        nombre: 'Yogurt Natural',
        categoria: 'lacteos',
        precio: 890,
        stock: 0,
        descripcion: 'Yogurt natural sin azúcar, envase de 200g',
        imagen: 'img/productos/yogurt.jpg',
        estado: 'agotado',
        destacado: false
    }
];

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    initProductos();
    initEventListeners();
    setupImagePreview();
});

/**
 * Inicializar la tabla de productos y cargar los datos
 */
function initProductos() {
    // Cargar productos guardados o usar los de demostración
    let productos = getProductosFromStorage();
    
    // Renderizar productos en la tabla
    renderProductosTabla(productos);
    
    // Inicializar DataTables si está disponible
    if ($.fn.DataTable) {
        $('#productos-tabla').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json'
            },
            responsive: true,
            columnDefs: [
                { orderable: false, targets: -1 } // No ordenar la columna de acciones
            ]
        });
    }
}

/**
 * Obtener productos desde localStorage o usar datos de demostración
 */
function getProductosFromStorage() {
    const productosGuardados = localStorage.getItem('villaMarketsProductos');
    if (productosGuardados) {
        return JSON.parse(productosGuardados);
    } else {
        // Guardar productos de demostración en localStorage
        localStorage.setItem('villaMarketsProductos', JSON.stringify(productosDemostracion));
        return productosDemostracion;
    }
}

/**
 * Renderizar productos en la tabla
 * @param {Array} productos - Lista de productos a mostrar
 */
function renderProductosTabla(productos) {
    const tbody = document.getElementById('productos-lista');
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
        const tr = document.createElement('tr');
        
        // Estado con color
        let estadoClass = '';
        switch(producto.estado) {
            case 'activo': estadoClass = 'bg-success'; break;
            case 'inactivo': estadoClass = 'bg-secondary'; break;
            case 'oferta': estadoClass = 'bg-primary'; break;
            case 'agotado': estadoClass = 'bg-danger'; break;
        }
        
        // Formatear nombres de categorías
        const categoriaNombre = getCategoryDisplayName(producto.categoria);
        
        tr.innerHTML = `
            <td>${producto.codigo}</td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="me-2 rounded" width="40" height="40">
                    <div>
                        <div>${producto.nombre}</div>
                        <small class="text-muted">${producto.destacado ? '<i class="fas fa-star text-warning"></i> Destacado' : ''}</small>
                    </div>
                </div>
            </td>
            <td>${categoriaNombre}</td>
            <td>$${producto.precio.toLocaleString('es-CL')}</td>
            <td>
                <span class="badge ${producto.stock === 0 ? 'bg-danger' : 'bg-success'}">${producto.stock}</span>
            </td>
            <td><span class="badge ${estadoClass}">${producto.estado.toUpperCase()}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editarProducto(${producto.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="eliminarProducto(${producto.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

/**
 * Configurar listeners de eventos
 */
function initEventListeners() {
    // Guardar nuevo producto
    document.getElementById('save-product-btn').addEventListener('click', guardarProducto);
    
    // Actualizar producto existente
    document.getElementById('update-product-btn').addEventListener('click', actualizarProducto);
    
    // Filtrar por categoría
    document.getElementById('categoria-filtro').addEventListener('change', filtrarProductos);
    
    // Filtrar por estado
    document.getElementById('estado-filtro').addEventListener('change', filtrarProductos);
    
    // Buscar productos
    document.getElementById('btn-buscar').addEventListener('click', filtrarProductos);
    document.getElementById('busqueda').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filtrarProductos();
        }
    });
}

/**
 * Configurar vista previa de imagen
 */
function setupImagePreview() {
    // Para formulario de nuevo producto
    document.getElementById('product-image').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('image-preview').src = e.target.result;
                document.getElementById('preview-container').classList.remove('d-none');
            }
            reader.readAsDataURL(file);
        }
    });
    
    // Para formulario de edición
    document.getElementById('edit-product-image').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('edit-image-preview').src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });
}

/**
 * Guardar un nuevo producto
 */
function guardarProducto() {
    const form = document.getElementById('product-form');
    
    // Validar formulario
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    // Obtener valores del formulario
    const codigo = document.getElementById('product-code').value;
    const nombre = document.getElementById('product-name').value;
    const categoria = document.getElementById('product-category').value;
    const precio = parseInt(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const descripcion = document.getElementById('product-description').value;
    const estado = document.getElementById('product-status').value;
    const destacado = document.getElementById('product-featured').checked;
    
    // Imagen (para una demo, usamos una URL predeterminada basada en categoría)
    let imagen = getDefaultImageForCategory(categoria);
    
    // Si hay un archivo seleccionado, leer como base64
    const fileInput = document.getElementById('product-image');
    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Aquí en una aplicación real, subirías la imagen a un servidor
            imagen = e.target.result;
            finalizarGuardado();
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        finalizarGuardado();
    }
    
    function finalizarGuardado() {
        // Obtener productos existentes
        let productos = getProductosFromStorage();
        
        // Generar ID único
        const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        
        // Crear nuevo producto
        const nuevoProducto = {
            id: nuevoId,
            codigo,
            nombre,
            categoria,
            precio,
            stock,
            descripcion,
            imagen,
            estado,
            destacado
        };
        
        // Agregar a la lista
        productos.push(nuevoProducto);
        
        // Guardar en localStorage
        localStorage.setItem('villaMarketsProductos', JSON.stringify(productos));
        
        // Refrescar tabla
        renderProductosTabla(productos);
        
        // Cerrar modal y mostrar mensaje
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();
        
        Swal.fire({
            icon: 'success',
            title: 'Producto guardado',
            text: `El producto "${nombre}" ha sido agregado correctamente`,
            confirmButtonColor: '#2d8f3c'
        });
        
        // Reiniciar formulario
        form.reset();
        form.classList.remove('was-validated');
        document.getElementById('preview-container').classList.add('d-none');
    }
}

/**
 * Editar un producto existente
 * @param {number} id - ID del producto a editar
 */
function editarProducto(id) {
    // Obtener productos
    const productos = getProductosFromStorage();
    
    // Buscar el producto por ID
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    // Llenar formulario de edición
    document.getElementById('edit-product-id').value = producto.id;
    document.getElementById('edit-product-code').value = producto.codigo;
    document.getElementById('edit-product-name').value = producto.nombre;
    document.getElementById('edit-product-category').value = producto.categoria;
    document.getElementById('edit-product-price').value = producto.precio;
    document.getElementById('edit-product-stock').value = producto.stock;
    document.getElementById('edit-product-description').value = producto.descripcion;
    document.getElementById('edit-product-status').value = producto.estado;
    document.getElementById('edit-product-featured').checked = producto.destacado;
    
    // Mostrar imagen actual
    document.getElementById('edit-image-preview').src = producto.imagen;
    
    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
}

/**
 * Actualizar un producto existente
 */
function actualizarProducto() {
    const form = document.getElementById('edit-product-form');
    
    // Validar formulario
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    // Obtener ID del producto
    const id = parseInt(document.getElementById('edit-product-id').value);
    
    // Obtener valores del formulario
    const codigo = document.getElementById('edit-product-code').value;
    const nombre = document.getElementById('edit-product-name').value;
    const categoria = document.getElementById('edit-product-category').value;
    const precio = parseInt(document.getElementById('edit-product-price').value);
    const stock = parseInt(document.getElementById('edit-product-stock').value);
    const descripcion = document.getElementById('edit-product-description').value;
    const estado = document.getElementById('edit-product-status').value;
    const destacado = document.getElementById('edit-product-featured').checked;
    
    // Obtener productos actuales
    let productos = getProductosFromStorage();
    
    // Encontrar índice del producto a actualizar
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return;
    
    // Conservar la imagen actual si no se selecciona una nueva
    let imagen = productos[index].imagen;
    
    // Si hay un archivo seleccionado, leer como base64
    const fileInput = document.getElementById('edit-product-image');
    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Aquí en una aplicación real, subirías la imagen a un servidor
            imagen = e.target.result;
            finalizarActualizacion();
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        finalizarActualizacion();
    }
    
    function finalizarActualizacion() {
        // Actualizar producto
        productos[index] = {
            ...productos[index], // Mantener otros atributos como fecha de creación
            codigo,
            nombre,
            categoria,
            precio,
            stock,
            descripcion,
            imagen,
            estado,
            destacado
        };
        
        // Guardar cambios
        localStorage.setItem('villaMarketsProductos', JSON.stringify(productos));
        
        // Refrescar tabla
        renderProductosTabla(productos);
        
        // Cerrar modal y mostrar mensaje
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        modal.hide();
        
        Swal.fire({
            icon: 'success',
            title: 'Producto actualizado',
            text: `El producto "${nombre}" ha sido actualizado correctamente`,
            confirmButtonColor: '#2d8f3c'
        });
    }
}

/**
 * Eliminar un producto
 * @param {number} id - ID del producto a eliminar
 */
function eliminarProducto(id) {
    // Confirmar eliminación
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Obtener productos
            let productos = getProductosFromStorage();
            
            // Filtrar producto por ID
            const productoAEliminar = productos.find(p => p.id === id);
            productos = productos.filter(p => p.id !== id);
            
            // Guardar cambios
            localStorage.setItem('villaMarketsProductos', JSON.stringify(productos));
            
            // Refrescar tabla
            renderProductosTabla(productos);
            
            // Notificar éxito
            Swal.fire(
                'Eliminado',
                `El producto "${productoAEliminar.nombre}" ha sido eliminado`,
                'success'
            );
        }
    });
}

/**
 * Filtrar productos según los criterios seleccionados
 */
function filtrarProductos() {
    // Obtener valores de filtro
    const categoriaFiltro = document.getElementById('categoria-filtro').value;
    const estadoFiltro = document.getElementById('estado-filtro').value;
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    
    // Obtener todos los productos
    let productos = getProductosFromStorage();
    
    // Aplicar filtros
    if (categoriaFiltro) {
        productos = productos.filter(p => p.categoria === categoriaFiltro);
    }
    
    if (estadoFiltro) {
        productos = productos.filter(p => p.estado === estadoFiltro);
    }
    
    if (busqueda) {
        productos = productos.filter(p => 
            p.nombre.toLowerCase().includes(busqueda) ||
            p.codigo.toLowerCase().includes(busqueda) ||
            p.descripcion.toLowerCase().includes(busqueda)
        );
    }
    
    // Actualizar tabla
    renderProductosTabla(productos);
    
    // Si no hay resultados, mostrar mensaje
    if (productos.length === 0) {
        document.getElementById('productos-lista').innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <p>No se encontraron productos con los filtros seleccionados</p>
                </td>
            </tr>
        `;
    }
}

/**
 * Obtener nombre legible de una categoría
 * @param {string} categoriaId - ID de la categoría
 * @returns {string} Nombre formateado para mostrar
 */
function getCategoryDisplayName(categoriaId) {
    const categorias = {
        'lacteos': 'Lácteos',
        'panaderia': 'Panadería',
        'frutas': 'Frutas y Verduras',
        'bebidas': 'Bebidas',
        'limpieza': 'Limpieza',
        'abarrotes': 'Abarrotes'
    };
    
    return categorias[categoriaId] || categoriaId;
}

/**
 * Obtener imagen predeterminada para una categoría
 * @param {string} categoriaId - ID de la categoría
 * @returns {string} URL de la imagen predeterminada
 */
function getDefaultImageForCategory(categoriaId) {
    const imagenes = {
        'lacteos': 'img/productos/default-lacteos.jpg',
        'panaderia': 'img/productos/default-panaderia.jpg',
        'frutas': 'img/productos/default-frutas.jpg',
        'bebidas': 'img/productos/default-bebidas.jpg',
        'limpieza': 'img/productos/default-limpieza.jpg',
        'abarrotes': 'img/productos/default-abarrotes.jpg'
    };
    
    return imagenes[categoriaId] || 'img/productos/default-product.jpg';
}
