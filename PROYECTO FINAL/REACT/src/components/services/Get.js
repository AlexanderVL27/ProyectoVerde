import axios from 'axios';

// Obtiene la peticion mediante la libreria de Axios haciendo una peticion GET
const GetData = () => {
    const URL = "https://8d1d952a79382d38fb2f4e6f675aa7f9.serveo.net/hg";
    return axios.get(URL).then((response) => response.data);
}

// Obtiene los datos que retorna el get en formato JSON
const HumedadData = async () => {
  let auxHumedad = [];
    auxHumedad.push(await GetData());
    auxHumedad.map(objectData => {
        objectData.map (data => data.fecha = data.fecha.substring(0,10)) //Elimina una parte de la cadena de texto (T06....) y nomas regresa año-mes-dia
    })
  return auxHumedad;
}

// Retorna el tamaño del arreglo que contiene los datos procesados de acuerdo a su estacion
const sizeArray = (station) => {
  return station[0].length;
}

// Estas funciones verifican si el dato fecha esta comprendido entre la fecha inicial de la estacion y la fecha final, recibe como parametros el año y la fecha del objeto
const isSpring = (year,fecha) => {
  const inicioSpring = new Date(year,2,19); // 19 marzo
  const finSpring = new Date(year,5,20); // 20 junio
  return fecha >= inicioSpring && fecha <= finSpring;
}
const isSummer = (year,fecha) => {
  const inicioSummer = new Date(year,5,20) // 20 junio
  const finSummer = new Date(year,8,22) // 22 septiembre
  return fecha >= inicioSummer && fecha <= finSummer;
}
const isOtono = (year,fecha) => {
  const inicioOtono = new Date(year,8,23); // 23 septiembre
  const finOtono = new Date(year,11,20); // 20 diciembre
  return fecha >= inicioOtono && fecha <= finOtono;
}
const isWinter = (year,fecha) => {
  const inicioWinter = new Date(year-1,11,21); // 21 diciembre
  const finWinter = new Date(year,2,18) // 18 de marzo
  return fecha >= inicioWinter && fecha <= finWinter;
}

// Retorna un arreglo con los 4 arreglos de cada estacion, mostrando por {id,humedad,fecha,hora} [array(19),array(78),array(23),array(21)]
const PromediosHumedad = async (year) => {
  let auxArray = await HumedadData();

  let returnPromedios = [];

  // Hace un filtrado de los datos invocando las funciones de validacion (isSpring,isSummer....) de acuerdo a su fecha de estacion y se asigan a su arreglo correspondiente
  const estacionPrimavera = auxArray.map(item => item.filter(data => isSpring(year,new Date(data.fecha))));
  const estacionVerano = auxArray.map(item => item.filter(data => isSummer(year,new Date(data.fecha))));
  const estacionOtono = auxArray.map(item => item.filter(data => isOtono(year,new Date(data.fecha))));
  const estacionInvierno = auxArray.map(item => item.filter(data => isWinter(year,new Date(data.fecha))));
  returnPromedios.push(estacionPrimavera,estacionVerano,estacionOtono,estacionInvierno);

  return returnPromedios;
}

export {HumedadData,PromediosHumedad,sizeArray}
export default GetData;
