// IMPORTS
require('colors');

const { persistirDatos, leerDatos } = require('./helpers/dataController');

const { inquirerMenu, 
        menuPauser,
        userTareaInput,
        borrarTareaDisplay,
        confirmQuest,
        completarTareaDisplay } = require('./helpers/inquirer');

const { Tareas } = require('./models/tareas');

// APP MAIN FUNCTION
const main = async () => {
    //clear the console to the user
    process.stdout.write("\u001b[0J\u001b[1J\u001b[2J\u001b[0;0H\u001b[0;0W");
    
    // VARIABLES/CONSTANTES GLOBALES
    let opt = '';
    const tareasObj = new Tareas();         
    let tareasDBArr = leerDatos();

    // Si nuestro archivo de persistencia contiene datos
    if( tareasDBArr ) {
        //traemos objetos de la db hacia la app
        tareasObj.listadoTareas( tareasDBArr );
    }

    
    do { // DO-WHILE
        opt = await inquirerMenu();
 
        switch (opt) {
            case '1': {
                // input para nuevo objeto tarea
                const tareaDesc = await userTareaInput('Crear:');
                //creamos un nuevo objeto tarea
                tareasObj.crearTarea( tareaDesc );
                break;      
            }
            case '2': {
                // listar tareas
                console.log( tareasObj.listadoDetallado() );
                break;
            }
            case '3': {
                // listar tareas completadas
                console.log( tareasObj.listadoSegunEstado(true) );
                break;
            }
            case '4': {
                // listar tareas pendientes
                console.log( tareasObj.listadoSegunEstado(false) );
                break;
            }
            case '5': {
                // submenu terminar o comenzar tareas
                const idArray = await completarTareaDisplay( tareasObj.listadoArr );
                
                if(idArray) {
                    tareasObj.alternarTareasEstados( idArray );
                } else { 
                    continue;
                }

                break;     
            }
            case '6': {
                // submenu borrar tarea
                const idTareaBorrar = await borrarTareaDisplay( tareasObj.listadoArr );

                if(idTareaBorrar) {
                    // confirmacion 
                    const confirm = await confirmQuest('¿Esta seguro de eliminar la tarea?'.yellow);

                    if(confirm)
                        tareasObj.borrarTarea( idTareaBorrar );
                } else { 
                    continue;
                }

                break;   
            }
        }
        // solo persitimos en opt
        if ((opt==='1')||(opt==='5')||(opt==='6')) 
            persistirDatos( tareasObj.listadoArr );

        console.log();
        await menuPauser('Presionar'); // generamos una pausa e indicamos al usuario Presionar / PROMESA

    } while (opt !== '0'); // DO-WHILE


}

main(); 


