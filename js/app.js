// Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



// Eventos

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}



// CLasses

//Crearemos dos clases para optimizar nuesto codigo, una que se encargue de los valores, numeros y calculos y una para el user interface UI para los botones y

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();

    }

    calcularRestante() {
        // .reduce es un arroy method que a su ves es un arrow function
        //El cual pide dos datos en el arrow function
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        console.log(this.gastos);
        this.calcularRestante();
    }
}

// No requiere constructor porque van a ser metodos que van a imprimir HTML basados en la otra clase, por ende no van a requerir de los mismos

class UI {
    insertarPresupuesto(cantidad) {
        /*
        En el curso lo hacen de la siguiente manera 
        const { presupuesto, restante } = cantidad;
        document.querySelector('#total').textContent=presupuesto
        document.querySelector('#restante').textContent=restante
        */
        
        //Yo lo hice de esta manera!!!
        const total = document.querySelector('#total');
        const restante = document.querySelector('#restante');

        total.textContent = cantidad.presupuesto;
        restante.textContent = cantidad.restante;
    }

    //Le vamos a pasar distintos parametros para poder reutilizar la alerta, ya sea de error, correcto, el presupuesto se ha agotado
    imprimirAlerta(mensaje, tipo) {
        //Crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Insertamoes en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //Quitar formulario

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
        
    }
    mostrarGastos(gastos) {

        //Elimina el HTML PREVIO
        this.limpiarHTML();

        //iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            //Crear  un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            // nuevoGasto.setAttribute('data-id', id);


            // console.log(nuevoGasto);
            //Agregar el HTML del gasto

            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad}</span>`;

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            //Como &times es un icono de HTML que es una equis tenemos que usar inner HTML
            btnBorrar.innerHTML = 'Borrar &times'
            //Se utiliza en forma de arrow function porque de esta manera solamente se ejecuta la funcion despues de darle click y no antes
            btnBorrar.onclick = () => {
                eliminarGasto(id);
                
                if (formulario.querySelector('button[type="submit"').disabled = true) {
                    formulario.querySelector('button[type="submit"').disabled = false
                }
            }

            nuevoGasto.appendChild(btnBorrar);

            //Agregar al HTM
            gastoListado.appendChild(nuevoGasto);
        });
    }

    //Estamos creando un metodo, porque esta dentro de la classe UI POR ESO SE LLAMA CON this.limpiarHTML, tambien se puede hacer creando la funcion normal fuera de la clase, pero esta es otra manera de realizarlo
    limpiarHTML() {

        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        
        //Comprobar 25%
        if ((presupuesto / 4) >= restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) >= restante) {
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');

        }

        // Si el total es 0 o menor

        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"').disabled = true;
        }
    }
}


//Para la creacion de los objetos es recomendable crear una variable vacia y luego asignarle los valores dentro de las funciones

//Instancear
const ui = new UI();
let presupuesto;

// Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');
    //Para convertir el string en numeros usamos parseInt, parseFloat, o Number

    // Si vemos que es un string vacio una de la maneras que tenemos para validar el promt es mandando un window.location.reload(); que recarga la pagina
    //El isNan nos arroja un true porque pregunta efectivamente si el parametro es un NaN
    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}



// Agregar gastos
function agregarGasto(e) {
    e.preventDefault();

    //Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    //Le agregamos el pasarlo de string a objeto
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validar que ninguno este vacio

    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }


    //Generar un objeto con el gasto


    //Recordamos Object Literal que une los parametros al objeto que estamos creando que une nombre y cantidad a gasto
    const gasto = { nombre, cantidad, id: Date.now()};
    //NOTA es lo contrario a un destructuring (const {nombre, cantidad} = gasto), que extrae nombre y cantidad de gasto


    //Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //Mensaje de correcto
    ui.imprimirAlerta('Gasto agregado Correctamente')

    //Imprimir los gastos
    // hacemos destructuring para solamente obtener el valor de gastos ya que gastos es un array dentro del objeto presupuesto.
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    //Reinicia el Formulario
    formulario.reset();

}

function eliminarGasto(id) {
    //Los elimina de la clasu u objetos
    presupuesto.eliminarGasto(id);


    //Elimina los gastos del HTMLO
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}