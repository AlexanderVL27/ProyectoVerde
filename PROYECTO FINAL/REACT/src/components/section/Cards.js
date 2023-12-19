import { Component, useEffect, useState, useRef } from "react";
import { HumedadData, PromediosHumedad, sizeArray } from "../services/Get";
import Pies from "../grafics/pie";
import { Line } from "react-chartjs-2";
import PrimaveraLineas from "../grafics/primaveraLine";

const CardsAverage = ({selected}) => {

 const [titleValid,setTitle] = useState("DATOS GENERALES");

  // Arreglos que guardaran los datos procesados en la clase Get
  const [primaveraa,setPrimavera] = useState([]);
  const [veranoo,setVerano] = useState([]);
  const [otonoo,setOtono] = useState([]);
  const [inviernoo,setInvierno] = useState([]);

  // Arreglos auxiliares que me guardaran el promedio, valor maximo y valor minimo
  const [auxPrimavera, setAuxPrimavera] = useState([]);
  const [auxVerano, setAuxVerano] = useState([]);
  const [auxOtono, setAuxOtono] = useState([]);
  const [auxInvierno, setAuxInvierno] = useState([]);

  const [isDataNull, setDataNull] = useState(true);

  let [sizePrimavera,setSizePrimavera] = useState(0);
  let [sizeVerano,setSizeVerano] = useState(0);
  let [sizeOtono,setSizeOtono] = useState(0);
  let [sizeInvierno,setSizeInvierno] = useState(0);

  // Auxiliares de estado para verificar el estado del input del año y guardar el valor del año 
  const [checkYear,setCheckYear] = useState(true);
  const [yearSelect, setYearSelect] = useState("2023");
  const yearInputRef = useRef("2023");

  // Variable para obtener las fechas y el año actual
  let anoActual = new Date();
  let yearNow = anoActual.getFullYear();

  // Estas funciones retornan el promedio, valor maximo, valor minimo de acuerdo al array ingresa (station) 
  const promedio = (station) => {
    let promedio = 0;
    station.map(item => {
        let suma = 0;
        item.map(data => suma += data.humedad);
        promedio = suma / item.length;
    })
    return parseFloat(promedio.toFixed(2));
  }
  const valorMaximo = (station) => Math.max(...station[0].map(data => data.humedad));
  const valorMinimo = (station) => Math.min(...station[0].map(data => data.humedad));

  const flujoDataHumedad = async () => {
    let [primavera,verano,otono,invierno] = await PromediosHumedad(yearSelect);
    const hayDatos = primavera[0].length > 0 || verano[0].length > 0 || otono[0].length > 0 || invierno[0].length > 0;

    console.log(selected);
    
    setSizePrimavera(sizeArray(primavera));
    setSizeVerano(sizeArray(verano));
    setSizeOtono(sizeArray(otono));
    setSizeInvierno(sizeArray(invierno));

    if(hayDatos){
        setDataNull(true);

        primavera.map(item => {
            setPrimavera(item)
        })

        verano.map(item => {
           setVerano(item);
        })

       otono.map(item => {
        setOtono(item);
       })

       invierno.map(item => {
        setInvierno(item)
       })

        setAuxPrimavera([
            promedio(primavera),
            valorMaximo(primavera),
            valorMinimo(primavera)
          ]);
    
          setAuxVerano([
            promedio(verano),
            valorMaximo(verano),
            valorMinimo(verano)
          ]);
    
          setAuxOtono([
            promedio(otono),
            valorMaximo(otono),
            valorMinimo(otono)
          ]);
    
          setAuxInvierno([
            promedio(invierno),
            valorMaximo(invierno),
            valorMinimo(invierno)
          ]);
          
        }else{
            setDataNull(false);
            setAuxPrimavera([])
            setAuxVerano([])
            setAuxOtono([])
            setAuxInvierno([])
        }
    }

  useEffect(() => {
    flujoDataHumedad();
  },[yearSelect]);

  useEffect(() => {
  }, [primaveraa,veranoo,otonoo,inviernoo]); 

  const watchPie = () => {
    if(yearInputRef.current.value.length < 4) {
        setYearSelect(yearNow);
        setCheckYear(false);
    }else{
        setYearSelect(yearInputRef.current.value);
        setCheckYear(true);
        
        console.log(primaveraa);
        console.log(otonoo);
        console.log(veranoo);
        console.log(inviernoo);
    }
  }

  return(
    <>
        <div className="flex grow flex-row gap-x-16 my-4">

            <div className="bg-[#e79eff] grow flex flex-col rounded-lg hover:border-dashed hover:border-2 hover:border-purple-500">
                <span className="self-center mt-[-2em]">
                    <img src="img/icons/flor.png"/>
                </span>
                <div className="pb-1">
                    <span className="tracking-widest italic font-semibold underline">
                        PRIMAVERA
                    </span>
                </div>
                <div className="pb-1">
                    <p>
                        Promedio de humedad: <span className="text-sm font-medium [font-family:fantasy]">{auxPrimavera[0]}%</span>
                    </p>
                    <p>
                        Valor maximo: <span className="text-sm font-medium [font-family:fantasy]">{auxPrimavera[1]}%</span>
                    </p>
                    <p>
                        Valor minimo: <span className="text-sm font-medium [font-family:fantasy]">{auxPrimavera[2]}%</span>
                    </p>
                    <p>
                        Total de datos: <span className="text-sm font-medium [font-family:fantasy]">{sizePrimavera}</span>
                    </p>
                </div>
            </div>

            <div className="bg-[#a3ffac] grow flex flex-col rounded-lg hover:border-dashed hover:border-2 hover:border-green-500">
                <span className="self-center mt-[-2em]">
                    <img src="img/icons/hoja-verde.png"/>
                </span>
                <div className="pb-1">
                    <span className="tracking-widest italic font-semibold underline">
                        VERANO
                    </span>
                </div>
                <div className="pb-1">
                    <p>
                        Promedio de humedad: <span className="text-sm font-medium [font-family:fantasy]">{auxVerano[0]}%</span>
                    </p>
                    <p>
                        Valor maximo: <span className="text-sm font-medium [font-family:fantasy]">{auxVerano[1]}%</span>
                    </p>
                    <p>
                        Valor minimo: <span className="text-sm font-medium [font-family:fantasy]">{auxVerano[2]}%</span>
                    </p>
                    <p>
                        Total de datos: <span className="text-sm font-medium [font-family:fantasy]">{sizeVerano}</span>
                    </p>
                </div>
            </div>

            <div className="bg-[#ffda89] grow flex flex-col rounded-lg hover:border-dashed hover:border-2 hover:border-orange-500">
                <span className="self-center mt-[-2em]">
                    <img src="img/icons/hojas-de-otono.png"/>
                </span>
                <div className="pb-1">
                    <span className="tracking-widest italic font-semibold underline">
                        OTOÑO
                    </span>
                </div>
                <div className="pb-1">
                    <p>
                        Promedio de humedad: <span className="text-sm font-medium [font-family:fantasy]">{auxOtono[0]}%</span>
                    </p>
                    <p>
                        Valor maximo: <span className="text-sm font-medium [font-family:fantasy]">{auxOtono[1]}%</span>
                    </p>
                    <p>
                        Valor minimo: <span className="text-sm font-medium [font-family:fantasy]">{auxOtono[2]}%</span>
                    </p>
                    <p>
                        Total de datos: <span className="text-sm font-medium [font-family:fantasy]">{sizeOtono}</span>
                    </p>
                </div>
            </div>
            
            <div className="bg-[#c7f7f7] grow flex flex-col rounded-lg hover:border-dashed hover:border-2 hover:border-sky-500">
                <span className="self-center mt-[-2em]">
                    <img src="img/icons/copo-de-nieve.png"/>
                </span>
                <div className="pb-1">
                    <span className="tracking-widest italic font-semibold underline">
                        INVIERNO
                    </span>
                </div>
                <div className="pb-1">
                    <p>
                        Promedio de humedad: <span className="text-sm font-medium [font-family:fantasy]">{auxInvierno[0]}%</span>
                    </p>
                    <p>
                        Valor maximo: <span className="text-sm font-medium [font-family:fantasy]">{auxInvierno[1]}%</span>
                    </p>
                    <p>
                        Valor minimo: <span className="text-sm font-medium [font-family:fantasy]">{auxInvierno[2]}%</span>
                    </p>
                    <p>
                        Total de datos: <span className="text-sm font-medium [font-family:fantasy]">{sizeInvierno}</span>
                    </p>
                </div>
            </div>

        </div>

        <div className="flex grow justify-center">
            <h1 className="font-bold text-2xl">{selected}</h1>
        </div>

        <div className="flex grow text-center justify-center mt-8 tracking-widest italic [font-family:cursive] font-black text-base"> 
            <p className="flex flex-row">ELIGE UN AÑO:
                <span className="px-3 font-thin">
                    <input className="text-center border rounded-md hover:border-dashed hover:border-2 hover:border-black"
                    type="text" placeholder="2023" min="4" max="4" maxLength={4} step="1" pattern="\d{4}" 
                    title="Ingrese un año válido (formato: YYYY)" ref={yearInputRef} defaultValue={"2023"}
                    />
                </span>

                <span className="px-3">
                    <button className="flex gap-x-3 border rounded-lg text-center tracking-widest px-3 py-0.5 mt-[-0.1em] border-sky-300 
                     hover:border-2 hover:border-lime-500" onClick={watchPie}>
                        <span className="">
                            <img src="img/grafico.png"/>
                        </span> Visualizar
                    </button>
                </span>
            </p>
            
        </div>

        <div className="my-8 flex grow h-[30rem] justify-center">
            {isDataNull && selected === "DATOS GENERALES" && <Pies primavera={auxPrimavera} verano={auxVerano} otono={auxOtono} invierno={auxInvierno} />}
            {isDataNull && selected === "PRIMAVERA" && <PrimaveraLineas primavera={primaveraa} id={"Primavera"} />}
            {isDataNull && selected === "VERANO" && <PrimaveraLineas primavera={veranoo} id={"Verano"} />}
            {isDataNull && selected === "OTONO" && <PrimaveraLineas primavera={otonoo} id={"Otoño"} />}
            {isDataNull && selected === "INVIERNO" && <PrimaveraLineas primavera={inviernoo} id={"Invierno"} />}
            {!isDataNull && (<div className="flex grow justify-center py-4"><h2 className="text-3xl font-bold"> El año {yearSelect} no tiene registro de datos</h2></div> )}
        </div>
      
    </>
    )
}

export default CardsAverage;
