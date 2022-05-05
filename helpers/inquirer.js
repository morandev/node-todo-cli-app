// IMPORTS
const colors = require('colors');
const inquirer = require('inquirer');

// creamos un objeto con formato de QUESTION para utilizarlo con INQUIRER
const menuOpts = [
    /**
     *  Este objeto le indicara a inquirer que debera crear un menu LISTA
     *  en el cual el valor de la opcion que el usuario elija se guardara en NAME: optValue
     *  el titulo a mostrar sera el valor de MESSAGE
     *  luego CHOICES contendra cada una de las opciones disponibles de la lista con su
     *  respectivo valor, y titulo a mostrar
     * 
     *  Tambien estamos haciendo uso de COLORS.JS en cada sentencia '.black, color.green(string), etc'
     * 
     */
    {
        type: 'list',
        name: 'optValue',
        message: colors.green('Seleccione usando flechas:').bgBlack,
        choices: [
            {
                value:'1',
                name: colors.green(` 1. Crear tarea`).bgBlack
            },
            {
                value:'2',
                name: colors.green(` 2. Listar tareas`).bgBlack
            },
            {
                value:'3',
                name: colors.green(` 3. Listar tareas completadas`).bgBlack
            },
            {
                value:'4',
                name: colors.green(` 4. Listar tareas pendientes`).bgBlack
            },
            {
                value:'5',
                name: colors.green(` 5. Completar tarea(s)`).bgBlack
            },
            {
                value:'6',
                name: colors.green(` 6. Borrar tarea`).bgBlack
            },
            {
                value:'0',
                name: colors.green(` 0. Salir`).bgBlack
            }
        ]
    }
];

/**
 *  Muestra en consola el menu principal de la aplicacion haciendo uso de INQUIRER.PROMPT()
 * 
 * @returns string, el valor STRING de la opcion que el usuario haya elegido
 */
const inquirerMenu = async () => {
    console.clear();

    console.log('==============================='.green);
    console.log(colors.gray(' Author:   Facundo Moran.'.bgYellow));
    console.log(colors.gray(' Github:   https://github.com/morandev'.bgYellow));
    console.log(colors.gray(' Linkedin: https://www.linkedin.com/in/facumoransi'.bgYellow));
    console.log('===============================\n'.green);
    
    const { optValue } = await inquirer.prompt(menuOpts);

    return optValue;

}

/**
 *  Utiliza INQUIRER.PROMPT() para simular una pausa durante la ejecucion del menu de la aplicacion. Obliga al usuario
 * a presionar la tecla ENTER para continuar con el uso.
 * 
 * @param {*} message, string que quisieramos que el usuario lea o interprete
 * @returns promise
 */
const menuPauser = async ( message = '' ) => {
    return await inquirer.prompt([{
        type: 'input',
        name: 'enterPressed',
        message: `${message}. ${ 'ENTER'.green } para continuar`
    }]);
}

/**
 *  Input de consola que permite al usuario ingresar un valor o cadena. Obliga al usuario a no ingresar una cadena vacia.
 * 
 * @param {*} message, string que quisieramos que el usuario lea o interprete antes de ingresar algo
 * @returns cadena o valor que representa lo que el usuario ingreso 
 */
const userTareaInput = async ( message = '' ) => {
    const { userMessage } = await inquirer.prompt([{
        type: 'input',
        name: 'userMessage',
        message,
        validate( messageValue ) {
            return  messageValue.length === 0 ? 
                    'Ingrese un valor'
                    : true;
        }
    }]);

    return userMessage;
}

/**
 *  Imprime en consola el menu lista 'BORRAR' de la aplicacion haciendo uso de INQUIRER.PROMPT() 
 *  mostrandole al usuario todas las tareas que posee, ya sea que tenga estado TERMINADA/COMPLETA o INCOMPLETA 
 * 
 *  Si el usuario no posee tareas se disparara una simulacion de pausa indicandole al usuario que no posee tareas
 *  para borrar
 * 
 *  El usuario solo puede borrar una tarea a la vez y se le pedira confirmacion al elegir una tarea para borrar. Luego se procedera con la eliminacion solo en caso de confirmacion
 * 
 * @param {*} tareasArr, array que contiene todas las tareas que el usuario posee
 * @returns id o identificador de la tarea que se quiere borrar
 */
const borrarTareaDisplay = async ( tareasArr = [] ) => {
    console.clear();

    console.log('==============================='.green);
    console.log(' Seleccione una tarea para borrar '.green);
    console.log('===============================\n'.green);

    // SIMULAR PAUSA SI NO POSEE TAREAS
    if ( tareasArr.length === 0 ) {
        await menuPauser('No posee tarea(s) para borrar');
        return '';
    }

    // CHOICES: QUESTION PROPERTY
    const choices = tareasArr.map( ({ id, descripcion }, index) => {

        return {
            value: id,
            name: `${ (index+1) }. `.green + `${ descripcion }`
        };

    })

    // MENU BORRAR
    const { idValue } = await inquirer.prompt([{
        type: 'list',
        name: 'idValue',
        message: 'Borrar',
        choices
    }]);

    return idValue;

}

/**
 *  Imprime en consola un input de confirmacion en el cual el usuario debera ingresar un valor que corresponda a SI o NO
 *  respectivamente. 
 * 
 * @param {*} quest, string que representa la pregunta que queremos que el usuario responda o nos confirme 
 * @returns Boolean, user confirmation
 */
const confirmQuest = async ( quest = '' ) => {

    const { responseValue } = await inquirer.prompt([{
        type:'confirm',
         name: 'responseValue',
         message: quest
    }]);

    return responseValue;
}

/**
 *  Imprime en consola el menu COMPLETAR TAREAS. Este menu tiene varias opciones y es de tipo CHECKBOX. Mostrara al     usuario todas sus tareas en modo de checkboxes, aquellas con estado COMPLETAS se imprimiran CHECKEADAS o CHECKED.
 * 
 *  El usuario pueda utilizar 'BARRA ESPACIADORA' o 'SPACE BAR' para checkear o quitar el check de las tareas, aquellas tareas que el usuario al presionar ENTER esten checkeadas, cambiaran a estado COMPLETAS/TERMINADAS y aquellas que no se encuentren checkeadas cambiaran a estado INCOMPLETAS
 * 
 *  Ademas, el usuario puede utilizar la tecla A para CHECKEAR todas las tareas de una sola vez. Tambien tiene la habilidad de presionar la tecla I e invertir la seleccion que hubiere realizado.
 * 
 *  Si el usuario no posee tareas se disparara una simulacion de pausa indicandole al usuario que no posee tareas
 *  para completar/comenzar
 * 
 * @param {*} tareasArr, array que contiene todas las tareas que el usuario posee
 * @returns ids array o array de identificadores de las tareas que el usuario a decidido cambiar a estado COMPLETAS/TERMINADAS
 */
const completarTareaDisplay = async ( tareasArr = [] ) => {
    console.clear();

    console.log('==============================='.green);
    console.log(' Marque una tarea para completarla. Desmarque para comenzarla '.green);
    console.log('===============================\n'.green);

    // SIMULAR PAUSA SI NO POSEE TAREAS
    if ( tareasArr.length === 0 ) {
        await menuPauser('No posee tarea(s) para completar/comenzar');
        return '';
    }

    // CHOICES: QUESTION PROPERTY
    const choices = tareasArr.map( ({ id, descripcion, fechaRealizacion }, index) => {

        return {
            value: id,
            name: `${ (index+1) }. `.green + `${ descripcion }`,
            checked: fechaRealizacion ? true : false 
        };

    })

    // MENU COMPLETAR TAREAS
    const { idArr } = await inquirer.prompt([{
        type: 'checkbox',
        name: 'idArr',
        message: 'Tareas completadas:',
        choices
    }]);

    return idArr;

}

module.exports = {
    inquirerMenu,
    menuPauser,
    userTareaInput,
    borrarTareaDisplay,
    confirmQuest,
    completarTareaDisplay
}