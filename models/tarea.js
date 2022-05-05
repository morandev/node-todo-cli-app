const { v4: uuidv4 } = require('uuid');

/**
 * Representa cada tarea que el usuario puede especificar mediante el uso de la interfaz
 */
class Tarea {

    id = '';
    descripcion = '';
    fechaRealizacion = null; 

    constructor( desc ) {
        this.id = uuidv4();
        this.descripcion = desc; 
        this.fechaRealizacion = null;
    }
}


module.exports.Tarea = Tarea;