

/* inputs de formulario */
const mascotaInput = document.getElementById('mascota')
const propietarioInput = document.getElementById('propietario')
const telefonoInput = document.getElementById('telefono')
const fechaInput = document.getElementById('fecha')
const horaInput = document.getElementById('hora')
const sintomasInput = document.getElementById('sintomas')

const contenedorAlerta = document.getElementById('contenedor-alerta')

/* formulario */
const formulario = document.getElementById('formulario')

/* lista de citas */
const listaCitas = document.getElementById('lista-citas')


/* btn crear cita */
const btnCrearCita = document.getElementById('btn-crear-cita')

/* definir el objeto para sincronizar los valores de los inputs */
const objInfoCita = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
    id: ''
}

let editar = false


/* definir clases */
class Citas {
    constructor() {
        this.citas = []
    }

    agregarCita(newObjCita) {
        this.citas = [...this.citas, newObjCita]
    }
    eliminarCita(idEliminar) {
        this.citas = this.citas.filter(objCita => {
            return objCita.id !== idEliminar
        })
    }
    editarCita(objCitaActualiazada) {
        this.citas = this.citas.map(objCita => {
            return (objCita.id === objCitaActualiazada.id) ? objCitaActualiazada : objCita
        })
    }
}
/* crear la instancia de Citas */
const administrarCitas = new Citas()


/* clase ui => se encarga del html dinamico */
class UI {
    mostrarAlerta(mensaje, tipo) {
        const templateAlerta =
            `
        <div class="alert alert-${tipo} p-2 text-center">
            ${mensaje}
        </div>
        `

        contenedorAlerta.insertAdjacentHTML('beforeend', templateAlerta)

        setTimeout(() => {
            const alertaHTML = document.querySelector(`.alert-${tipo}`)
            alertaHTML.remove()
        }, 3000);
    }
    limpiarListaCita() {
        [...listaCitas.children].forEach(li => li.remove())
    }
    mostrarCitasHTML({ citas }) {
        /* limpiar el html previo */
        this.limpiarListaCita()
        citas.forEach(objCita => {

            /* realizar la destructuracion */
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = objCita

            /* crear el template para el element li html */

            /* 
            el template, tiene en los botones de editar, y eliminar 
            el id del objeto que fue agregado
            */

            const templateLi =
            `
            <li class="list-group-item">
                <div class="cita">
                    <h4 class="cita__title">
                        ${mascota}
                    </h4>
                    <b>Propietario: </b><span>${propietario}</span><br>
                    <b>Télefono: </b><span>${telefono}</span><br>
                    <b>Fecha: </b><span>${fecha}</span><br>
                    <b>Hora: </b><span>${hora}</span><br>
                    <b>Sintomas: </b><span>${sintomas}</span><br>
            
                    <div class="d-flex gap-2 mt-2">
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id-cita="${id}">
                            Eliminar
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        <button class="btn btn-primary btn-sm btn-editar" data-id-cita="${id}">
                            Editar
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </div>
                </div>
            </li>
            `
            

            /* insertar el template en el html */
            listaCitas.insertAdjacentHTML('beforeend', templateLi)


        })

    }

}
/* crear la instancia de ui */
const ui = new UI()


/* funcioes */
/* funcion para resetear el objInfoCita */
const cargarEdicion = (id) => {
    const objCitaFiltrado = administrarCitas.citas.filter(objCita => objCita.id === id)[0]

    console.log(objCitaFiltrado)

    const { mascota, propietario, telefono, fecha, hora, sintomas } = objCitaFiltrado

    editar = true

    btnCrearCita.textContent = `Guardar cambios`

    /* llenear los inputs de los formularios */
    mascotaInput.value = mascota
    propietarioInput.value = propietario
    telefonoInput.value = telefono
    fechaInput.value = fecha
    horaInput.value = hora
    sintomasInput.value = sintomas

    /* asignarle valor a los objetos */
    objInfoCita.mascota = mascota
    objInfoCita.propietario = propietario
    objInfoCita.telefono = telefono
    objInfoCita.fecha = fecha
    objInfoCita.hora = hora
    objInfoCita.sintomas = sintomas
    objInfoCita.id = id
}




const resetearObjInfoCita = () => {
    for (const key in objInfoCita) {
        objInfoCita[key] = ''
    }
}


/* esta funcion se ejecuta cuando exista un evento de input */
const crearNuevaCita = event => {
    /* prevenir el evento */
    event.preventDefault()

    /* aplicar destructuring */
    const { mascota, propietario, fecha, hora, sintomas, telefono } = objInfoCita


    const estaVacio = [mascota, propietario, hora, fecha, sintomas, telefono].includes('')

    if (estaVacio) {
        ui.mostrarAlerta('Todos los campos son obligatorios', 'danger')
        console.log(objInfoCita)
        return
    }

    if (editar) {
        /* quitar el modo editar */
        editar = false

        /* agregar alerta de editado correctamente */
        ui.mostrarAlerta('Editado correctamente', 'success')

        /* actualizar el objeto */
        administrarCitas.editarCita({ ...objInfoCita })

        btnCrearCita.textContent = `Crear cita`
    }

    else {
        /* agregarle un id a la cita */
        objInfoCita.id = Date.now()


        /* agregamos el objeto al arreglo */
        administrarCitas.agregarCita({ ...objInfoCita })

        /* mensaje de agregado correctamente */
        ui.mostrarAlerta('Se agrego correctamente', 'success')
    }


    /* resetear el formulario */
    formulario.reset()
    /* mostrar citas en el html */
    ui.mostrarCitasHTML(administrarCitas)

    resetearObjInfoCita()



}

/* esta funcion se dispara cada vez que exista un evento input, en el formulario */
const sincronizarObjetCita = event => {
    const inputElement = event.target
    if (inputElement.classList.contains('form-control')) {
        const idInput = inputElement.id
        const value = inputElement.value
        objInfoCita[idInput] = value

    }
}

/* funcion eliminar */




/* events listeners */
const cargarEventsListeners = () => {
    /*
    cuando ocurre un evento de un "input" de los inputs del formulario
    */
    formulario.addEventListener('input', sincronizarObjetCita)
    /* cuando ocurre el evento de enviar */
    formulario.addEventListener('submit', crearNuevaCita)
    /*
    una vez agregada la cita tiene la opcion de modificar y editar dando
    click a uno de los dos botones
    */
    listaCitas.addEventListener('click', event => {
        const button = event.target
        if (button.classList.contains('btn-eliminar')) {
            const idEliminar = parseFloat(button.getAttribute('data-id-cita'))
            administrarCitas.eliminarCita(idEliminar)
            ui.mostrarCitasHTML(administrarCitas)

        }
        else if (button.classList.contains('btn-editar')) {
            const idFiltrado = parseFloat(button.getAttribute('data-id-cita'))
            cargarEdicion(idFiltrado)
        }
    })
}

cargarEventsListeners()











