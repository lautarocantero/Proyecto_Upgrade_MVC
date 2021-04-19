/*

//variables

const expositorio = document.querySelector('#expositorio');
const filtro = document.querySelector('#variedad');
// const notificacion = document.querySelector('.notificacion__cartel');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
let productosCarrito = [];

const datosBusqueda = {
    tipo: '',
}



//event listeners

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarFiltro();
});


cargarEventslisteners();

function cargarEventslisteners() {
    expositorio.addEventListener('click', agregarProducto);

    //eliminar del carrito
    carrito.addEventListener('click', eliminarProducto);

    //mostrar de local storage

    document.addEventListener('DOMContentLoaded', () => {
        productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoHTML();
    })

    // vaciar del carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        productosCarrito = [];
        limpiarHTML();
    })

    //elegir tipo de producto

    filtro.addEventListener('change', e => {
        datosBusqueda.tipo = e.target.value;
        filtrarProductos();
    })

}


//funciones

async function cargarProductos() {
   
    const resultado = await fetch("\json\productos.json");
    
    const db = await resultado.json();

    const { productos } = db;

    productos.forEach(prod => {

        const producto = crearProducto(prod);
        expositorio.appendChild(producto);

    });

}

//crear el producto

function crearProducto(prod) {
    //crear div y ponerle la clase
    const producto = document.createElement('DIV');
    producto.classList.add('producto');

    //ponerle el tipo
    producto.tipo = prod.tipo;

    //crear div imagen y ponerle clase
    const producto_imagen = document.createElement('DIV');
    producto_imagen.classList.add('producto_imagen');

    //crear imagen con todo
    const imagen = document.createElement('IMG');
    imagen.classList.add('imagen');
    imagen.src = prod.imagen;

    //insertar imagen en div imagen
    producto_imagen.appendChild(imagen);

    producto.appendChild(producto_imagen);


    //crear producto informacion con todo
    const producto_informacion = document.createElement('DIV');
    producto_informacion.classList.add('producto_informacion');

    //crear los datos de el producto
    //el nombre
    const producto_nombre = document.createElement('P');
    producto_nombre.classList.add('producto_nombre');
    producto_nombre.textContent = prod.nombre;

    //el precio
    const producto_precio = document.createElement('P');
    producto_precio.classList.add('producto_precio');
    producto_precio.innerHTML = `$ <span>${prod.precio}</span>`;

    //agregar info al div

    producto_informacion.appendChild(producto_nombre);
    producto_informacion.appendChild(producto_precio);

    //agregar div informacion a producto

    producto.appendChild(producto_informacion);


    //crear boton
    const btn = document.createElement('button');
    btn.classList.add('botonCarrito');
    btn.classList.add('agregarCarrito');
    btn.innerHTML = 'Agregar al carrito <i class="fas fa-shopping-cart carrito agregarCarrito"></i>';
    btn.setAttribute('data-id', `${prod.id}`);


    //insertar boton en expositorio

    producto.appendChild(btn);

    return producto;
}

//agregar curso al carrito

function agregarProducto(e) {

    //click en carrito
    if (e.target.classList.contains('carrito')) {

        const productoSeleccionado = e.target.parentElement.parentElement;
        leerDatos(productoSeleccionado);

    } else if (e.target.classList.contains('agregarCarrito')) {

        const productoSeleccionado = e.target.parentElement;
        leerDatos(productoSeleccionado);
    }
    // console.log(productosCarrito);
}

function leerDatos(producto) {

    // console.log(producto);
    //creo un objeto donde guardar la informacion
    const infoProducto = {
        id: producto.querySelector('button').getAttribute('data-id'),
        imagen: producto.querySelector('.imagen').src,
        nombre: producto.querySelector('.producto_nombre').textContent,
        precio: producto.querySelector('.producto_precio span').textContent,
        cantidad: 1,
    }

    //revisar si el elemento ya existe
    const existe = productosCarrito.some(prod => prod.id === infoProducto.id)
    if (existe) {
        //actualizar cantidad
        const productosNuevo = productosCarrito.map(prod => {
            if (prod.id === infoProducto.id) {
                prod.cantidad++;
                return prod;        //devuelvo modificado
            } else {
                return prod;        //devuelvo los que no son 
            }
        });
        productosCarrito = [...productosNuevo];
    } else {

        //agregar elementos al arreglo del carrito
        productosCarrito = [...productosCarrito, infoProducto];
        // console.log(productosCarrito);

    }

    carritoHTML();
    // }

}

//function mostrar carrito en html

function carritoHTML() {

    //limpiar el html
    limpiarHTML();
    let total = 0;
    //generar html
    productosCarrito.forEach(prod => {

        const row = document.createElement('TR');
        const { imagen, nombre, precio, cantidad, id } = prod;
        row.innerHTML = `
            <td>
                <img src="${imagen}" >
            </td>
            <td class="carritoElemento">
                ${nombre}
            </td>
            <td class="carritoElemento">
                $ ${precio}
            </td>
            <td class="carritoElemento">
                ${cantidad}
            </td>
            <td>
                <a href='#' class="borrar-producto" data-id="${id}"> <i class="borrar far fa-trash-alt"></i> </a>
            </td>
        `

        total += parseInt(prod.precio, 10);
        contenedorCarrito.appendChild(row);
    });
    calcularTotal();

    //sincronizar storage
    sincronizarStorage();
}

//eliminar lo que este en el tbody para limpiar

function limpiarHTML() {

    // contenedorCarrito.innerHTML = '';

    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }

}

//eliminar producto

function eliminarProducto(e) {

    e.preventDefault();

    if (e.target.classList.contains('borrar')) {
        const productoId = e.target.parentElement.getAttribute('data-id')
        //filtrar 
        productosCarrito = productosCarrito.filter(prod => prod.id !== productoId);
    }
    carritoHTML();
}

function calcularTotal() {

    let calculo = 0;
    productosCarrito.forEach(prod => {

        const { precio, cantidad } = prod;

        let sub = precio * cantidad;

        calculo = calculo + sub;

    })

    const suma = document.querySelector('#suma');
    suma.innerHTML = `${calculo}`;

}

function sincronizarStorage() {

    localStorage.setItem('carrito', JSON.stringify(productosCarrito));

}

async function cargarFiltro() {

    const resultado = await fetch('./productos.json');
    const db = await resultado.json();

    const { productos } = db;
    let tipos = []

    productos.forEach(prod => {
        const { tipo } = prod;
        const select = document.createElement('OPTION');
        select.value = tipo;
        select.textContent = tipo;

        //si el array esta vacio
        if (tipos.length === 0) {
            //lo agrego y agrego al select
            tipos.push(tipo);
            variedad.appendChild(select);

        }//si no esta vacio
        else {
            const busca = tipos.find(tip => tip === tipo);
            //si no encuentro nada igual
            if (!busca) {
                tipos.push(tipo);
                variedad.appendChild(select);
            }
        }

    });
    // console.log(tipos);

}

//filtrar por busqueda

async function filtrarProductos() {

    const resultadoDos = await fetch('./productos.json');
    const db = await resultadoDos.json();

    const { productos } = db;

    const resultado = productos.filter(filtrarTipo);
    mostrarfiltrado(resultado);
}

function filtrarTipo(prod) {

    const { tipo } = datosBusqueda;


    if (tipo === 'todo') {
        return prod;
    } else {

        return prod.tipo === tipo;
    }

}

function mostrarfiltrado(res) {


    limpiarExpositorio();

    //seguir
    // console.log(res);
    res.forEach(resultado => {
        const producto = crearProducto(resultado);
        expositorio.appendChild(producto);

    })

}

function limpiarExpositorio() {

    while (expositorio.firstChild) {
        expositorio.removeChild(expositorio.firstChild);
    }

}

*/