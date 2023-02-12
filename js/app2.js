

/* inputs de formulario */
const mascotaInput = document.getElementById('mascota')
const propietarioInput = document.getElementById('propietario')
const telefonoInput = document.getElementById('telefono')
const fechaInput = document.getElementById('fecha')
const horaInput = document.getElementById('hora')
const sintomasInput = document.getElementById('sintomas')

/* en este elemento insertar las alertas correspondientes */
const contenedorAlerta = document.getElementById('contenedor-alerta')

/* formulario */
const formulario = document.getElementById('formulario')

/* lista de citas */
const listaCitas = document.getElementById('lista-citas')


/* btn crear cita */
const btnCrearCita = document.getElementById('btn-crear-cita')

/* definir el objeto para sincronizar los valores de los inputs */


/* esta variable almancera posteriormente,  */
let objCitaActualizar;

const objCita = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
    id: ''
}

let editar = false

let citas = []

/* funciones */

const reiniciarObjCita = () => {
    for (const key in objCita) {
        objCita[key] = ``
    }
}

const clearHTML = contenedor => {
    [...contenedor.children].forEach(li => li.remove())
}

const insertarCitasHTML = () => {
    /* primero limpiar el html previo */
    clearHTML(listaCitas)

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

const mostrarMensaje = (mensaje, tipo) => {
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

const agregarCita = newObjCita => {
    citas = [...citas, newObjCita]
}

const eliminarCita = id => {
    citas = citas.filter(objCita => objCita.id !== id)
    insertarCitasHTML()
}

const cargarHTMLEditar = id => {
    editar = true
    /* obtener el objeto a modificar */
    objCitaActualizar = citas.filter(citaObj => citaObj.id === id)[0]

    /* filtar id */
    const copia = { ...objCitaActualizar }
    if (copia.id) {
        delete copia.id
    }

    const arrObjActualizar = Object.values(copia)

    const arrInputs = [...document.querySelectorAll(`.form-control`)]

    /* llenar el select */
    for (let index = 0; index < arrObjActualizar.length; index++) {
        arrInputs[index].value = arrObjActualizar[index]
    }

    /* cambiar el textContent  */
    btnCrearCita.textContent = `Guardar cambios`

    /* sincronizar el objeto */
    const keys = Object.keys(objCitaActualizar)

    for (let index = 0; index < keys.length; index++) {
        const key = keys[index]
        objCita[key] = objCitaActualizar[key]
    }
}


const editarCita = objCitaActualizada => {
    citas = citas.map(objCita => {
        if (objCitaActualizada.id === objCita.id) {
            return objCitaActualizada
        }
        return objCita
    })
}

const quitarIdObjCita = () => {
    /* 
    convertir las pros del objeto a un array oara despues filtrar 
    los elementos que no son igual a un string "id"
    */
    const keys = Object.keys(objCita).filter(key => key !== 'id')

    /* crear uno bojet vacio */
    const validarObjCita = {}

    /*
    recorrer el arreglo para definir las propiedades 
    del objeto vacio va hacer igual al objeto global objCita 
    */
    for (const item of keys) {
        validarObjCita[item] = objCita[item]
    }

    return Object.values(validarObjCita)
}

const realizarCita = event => {
    event.preventDefault()

    /* realizar destructuracion */
    const validar = quitarIdObjCita().includes('')
    if (validar) {
        /* mostrar un mensaje de error */
        mostrarMensaje('Todos los campos son obligatorios', 'danger')
        return
    }
    if (editar) {
        editar = false
        /* cambiar el textContent  */

        btnCrearCita.textContent = `Crear cita`

        editarCita({ ...objCita })

        /* mostrar mensaje de exito */
        mostrarMensaje('Editado correctamente', 'success')
    }

    else {
        /* mostrar mensaje de exito */
        mostrarMensaje('Agregado correctamente', 'success')

        /* 
        asignarle un id al objeto
        */
        objCita.id = Date.now()

        /* agregar la cita al arreglo */
        /* cuando se agrega objeto mejor voy aplicar siempre la destruturacion */
        agregarCita({ ...objCita })
    }


    /* cargar el html de la citas */
    insertarCitasHTML()

    /* limpiar el formulario despues de agregar o editar una cita*/
    formulario.reset()

    /* posicionarme el primer input */
    mascotaInput.focus()

    /* reiniciar el objeto */
    reiniciarObjCita()
}

const agregarDatosObjCita = event => {
    const inputElement = event.target

    /* delegacion de eventos */
    if (inputElement.classList.contains('form-control')) {
        /* aplicar detructuracion */

        /*
        el id del input, es igual a una propiedad del objeto objCita
        */
        const { id: property } = inputElement
        /* aplicar detructuracion */
        const { value } = inputElement

        /* asignar el valor del input al objeto */
        objCita[property] = value
    }
}

/* events listeners */
document.addEventListener('DOMContentLoaded', () => mascotaInput.focus())

formulario.addEventListener('input', agregarDatosObjCita)

formulario.addEventListener('submit', realizarCita)

listaCitas.addEventListener('click', event => {
    const element = event.target

    if (element.classList.contains('btn-eliminar')) {
        const id = parseFloat(element.getAttribute('data-id-cita')) || null
        eliminarCita(id)
    }
    else if (element.classList.contains('fa-trash')) {
        const id = parseFloat(element.parentElement.getAttribute('data-id-cita')) || null
        eliminarCita(id)
    }
    else if (element.classList.contains('btn-editar')) {
        const id = parseFloat(element.getAttribute('data-id-cita')) || null
        cargarHTMLEditar(id)
    }
    else if (element.classList.contains('fa-pen')) {
        const id = parseFloat(element.parentElement.getAttribute('data-id-cita')) || null
        cargarHTMLEditar(id)
    }
})





