// IMPORTS
const fs = require('fs');

// ruta y nombre de archivo por defecto en los cuales se persistiran los 
// datos generados por el usuario
const filePath = 'db/datos.json';

/**
 *  Crea un nuevo archivo con extension .JSON. Hace uso de fileSystem
 *  
 * @param {*} datos, array con los datos que se almacenaran dentro del archivo JSON
 */
const persistirDatos = ( datos = [] ) => {

    fs.writeFileSync( filePath, JSON.stringify(datos) );

}

/**
 *  Lee los datos almacenados del usuario. Hace uso de fileSystem
 * 
 * @returns array de datos del usuario, si no existe el archivo de datos retorna NULL
 */
const leerDatos = () => {
    
    // si no existe ningun archivo de datos
    if (!fs.existsSync(filePath)) 
        return null;

    //flag 'r': Open file for reading. An exception occurs if the file does not exist.
    const datos = fs.readFileSync( filePath, { encoding: 'utf8', flag: 'r' } );

    return JSON.parse(datos);
}

module.exports = {
    persistirDatos,
    leerDatos
};