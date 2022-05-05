require('colors');

const Tarea = require('./tarea').Tarea;

/**
 * Representa el conjunto de tareas de un usuario
 */
class Tareas {

    _listado = {};

    constructor() {
        this._listado = {};
    }

    //GETTER AND SETTERS
     
    /**
     *  Getter 
     * 
     *  Retorna array[], que contiene el listado de tareas de 'this'
     */
    get listadoArr() {
        const listado = [];

        Object.keys(this._listado).forEach( key => {
            const tarea = this._listado[key];

            listado.push( tarea );
        })

        return listado;
    }

    /**
     * Setter
     * 
     * Intenta llenar el listado de tareas de 'this', con las tareas de @param listadoTareas array.
     */
    listadoTareas( listadoTareas=[] ) {
        
        listadoTareas.forEach( tarea => {
            this._listado[tarea.id] = tarea;
        });
        
    }

    //METHODS

    /**
     *  Crea un nuevo objeto tarea y lo almacena en el listado de 'this'
     * 
     * @param {*} desc, descripcion de la tarea 
     */    
    crearTarea( desc = '' ) {
        const tarea = new Tarea(desc);

        this._listado[tarea.id] = tarea;
    }
    
    /**
     *  Borra una tarea del listado de tareas de 'this'
     * 
     * @param {*} id 
     */
    borrarTarea( id = '' ) {

        if( this._listado[id] ) {
            delete this._listado[id];
        }

    }

    /**
     * Crea y retorna en un formato de impresion de las tareas de 'this'
     *  
     * @returns String, un formato de impresion para todas las tareas que contenga 'this'
     */
    listadoDetallado() {

        let salida = `\n`;

        this.listadoArr.forEach( ( tarea, index ) => {
            salida += ` ${ (index+1) }: `.green + `${ tarea.descripcion } ` + `:: ${ tarea.fechaRealizacion ? tarea.fechaRealizacion : 'Pendiente'.red }` + `\n`;
        });
        
        return salida;
    }

    /**
     *  Crea y retorna en un formato de impresion de las tareas de 'this', agrupandolas por su estado de realizacion
     * 
     * @param {*} estadoListo, boolean que indica a que estado de la tarea pertenecera el formato de impresion, si es true pertenecera el formato a las tareas completadas, en caso contrario, a las tareas pendientes.
     * @returns String, un formato de impresion
     */
    listadoSegunEstado( estadoListo=true ) {

        let salida = `\n`;
        let indice = 0;

        this.listadoArr.forEach( tarea  => {
            const descripcion = `${ tarea.descripcion } `;
            const estado = `${ tarea.fechaRealizacion ? tarea.fechaRealizacion : 'Pendiente'.red }`;

            if(estadoListo&&estado===tarea.fechaRealizacion) {
                indice++;
                salida += `${ indice }: `.green + descripcion + `:: ` + estado + `\n`;
            }

            if(!(estadoListo)&&estado==='Pendiente'.red) {
                indice++;
                salida += `${ indice }: `.green + descripcion + `:: ` + estado + `\n`;
            }

        });
        
        return salida;
    }

    /**
     *  Permite cambiar el estado de las tareas de 'this'
     * 
     * @param {*} tareasIdArray, array que indica las tareas que deben ser alternadas a completadas, aquellas que no se indiquen deberan ser marcadas como pendientes
     */
    alternarTareasEstados( tareasIdArray = [] ) {
        // TAREAS INDICADAS
        tareasIdArray.forEach( tareaID => {
            const tarea = this._listado[ tareaID ];

            if( !tarea.fechaRealizacion ) 
                tarea.fechaRealizacion = new Date().toISOString().green;

        })
        // TAREAS QUE NO FUERON INDICADAS
        this.listadoArr.forEach( tarea => {
            if( !tareasIdArray.includes( tarea.id ) )
                this._listado[ tarea.id ].fechaRealizacion = null;
        })
    }
}

module.exports.Tareas = Tareas;