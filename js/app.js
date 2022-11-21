// Declaraciones
const baseDeDatos = [
    {
        id: 1,
        nombre: 'Coca Cola 1.75L',
        precio: 250,
        imagen: 'assets/coca170.jpg'
    },
    {
        id: 2,
        nombre: 'Coca Cola 2,25L',
        precio: 450,
        imagen: 'assets/cocaGrande.jpg'
    },
    {
        id: 3,
        nombre: 'Coca Cola 354ml',
        precio: 180,
        imagen: 'assets/cocaLata.jpg'
    },
    {
        id: 4,
        nombre: 'Coca Zero 2,5L',
        precio: 450,
        imagen: 'assets/cocaZero170.jpg'
    },
    {
        id: 5,
        nombre: 'Coca Zero 354ml',
        precio: 180,
        imagen: 'assets/cocaZeroLata.jpg'
    },
    {
        id: 6,
        nombre: 'Coca Zero mini',
        precio: 150,
        imagen: 'assets/cocaZeroMini.jpg'
    }
];

let carrito = [];
const divisa = '$';
const miLocalStorage = window.localStorage;


//Query de Elementos
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const DOMbotonComprar = document.querySelector('#boton-comprar');


// Funciones
function renderizarProductos() {
    baseDeDatos.forEach((prod) => {        
        const miNodo = document.createElement('div');
        miNodo.classList.add('card', 'col-sm-4');        
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('card-body');        
        const miNodoTitle = document.createElement('h5');
        miNodoTitle.classList.add('card-title');
        miNodoTitle.textContent = prod.nombre;        
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('img-fluid');
        miNodoImagen.setAttribute('src', prod.imagen);        
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('card-text');
        miNodoPrecio.textContent = `${divisa}${prod.precio}`;        
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-info');
        miNodoBoton.textContent = 'Agregar al Carrito';
        miNodoBoton.setAttribute('marcador', prod.id);
        miNodoBoton.addEventListener('click', sumarProductoAlCarrito);        
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
    });
}

function sumarProductoAlCarrito(evento) {  
    carrito.push(evento.target.getAttribute('marcador'))    
    renderizarCarrito();
    guardarCarritoEnLocalStorage();
}


function renderizarCarrito() {
    DOMcarrito.textContent = '';
    const carritoSinDuplicados = [...new Set(carrito)];
    carritoSinDuplicados.forEach((item) => {
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            return itemId === item ? total += 1 : total;
        }, 0);
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio}`;
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    DOMtotal.textContent = calcularTotal();
}

function borrarItemCarrito(evento) {
    const id = evento.target.dataset.item;
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    renderizarCarrito();
    guardarCarritoEnLocalStorage();
}

function calcularTotal() {
    return carrito.reduce((total, item) => {
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        return total + miItem[0].precio;
    }, 0).toFixed(2);
}

function vaciarCarrito() {
    carrito = [];
    renderizarCarrito();
    guardarCarritoEnLocalStorage();
}

function comprarCarrito() {
    if (carrito.length === 0 ) {
    Swal.fire(
    'No hay productos en el carrito',
    ' ',
    'error'
    )
    }else{
    Swal.fire(
    'Compra Realizada',
    'TOTAL $'+ calcularTotal(),
    'success'
    )
    vaciarCarrito();
    }    
        
}

function guardarCarritoEnLocalStorage () {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage () {
    if (miLocalStorage.getItem('carrito') !== null) {    
    carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}


//EvenListeners
DOMbotonVaciar.addEventListener('click', vaciarCarrito);
DOMbotonComprar.addEventListener('click', comprarCarrito);


//EJECUCIONES
cargarCarritoDeLocalStorage();
renderizarProductos();
renderizarCarrito();