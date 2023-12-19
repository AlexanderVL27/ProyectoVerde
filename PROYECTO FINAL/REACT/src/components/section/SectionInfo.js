import {React,useEffect,useState} from "react";
import '../../assets/css/App.css';
import CardsAverage from "./Cards";

const SectionData = () => {

  // Array que guarda las opciones del estan habilitadas en el select
  let options = [
    {value: "ELIGE UNA ESTACIÓN DEL AÑO", tag: "Elige una opción", disabled: true},
    {value: "DATOS GENERALES", tag: "Datos generales"},
    {value: "PRIMAVERA" , tag: "Primavera"},
    {value: "VERANO", tag: "Verano"},
    {value: "OTONO", tag: "Otono"},
    {value: "INVIERNO", tag: "Invierno"}
  ];

  const [opcion,setOpcion] = useState(options[0].value);

  const valorOptiones = (event) => {
    setOpcion(event.target.value)
  }

  // Una variable de estado del tipo Date para ingresar a sus metodos
  const [date,setDate] = useState(new Date());

  // Funcion del boton que hace un refresh a la pagina para visualizar si hay cambios nuevos
  const refreshPage = () => {
    window.location.reload();
  }

  return(
    <section className="flex flex-col mx-4 my-4 gap-y-8">
      
        <div className="section-entry bg-gray-300 flex flex-nowrap items-center h-12 rounded-lg">

              <div className="ctn-icon-plant">
                <span className="p-2">
                    <img src='img/planta64.png'/>
                </span>
              </div>

              <div className="section-data flex grow flex-nowrap">

                <div className="ctn-date flex grow flex-nowrap justify-center">
                  <p className="tracking-widest [font-family:sans-serif]">FECHA DE INGRESO:
                    <span className="p-2 font-black [font-family:cursive] italic">{date.toDateString()}</span>
                  </p>
                </div>
                
                <div className="ctn-time flex flex-nowrap grow justify-center">
                  <p className="tracking-widest [font-family:sans-serif]">HORA DE INGRESO:
                    <span className="p-2 font-black [font-family:cursive] italic">{date.toLocaleTimeString()}</span>
                  </p>
                </div>

              </div>
              
        </div>

        <div className="section-date bg-gray-300 flex flex-nowrap items-center h-12 rounded-lg">

          <div className="ctn-icon-sensor">
            <span className="p-2">
              <img src="img/sensor-de-humedad.png"/>
            </span>
          </div>

          <div className="section-inputs flex grow">
              <div className="ctn-date-inputs flex grow justify-center gap-10">
                  <p className="flex tracking-widest items-center flex-nowrap">ESTACIÓN DEL AÑO: 
                    <span className="p-2 italic font-black [font-family:cursive]">
                      <select value={opcion} onChange={valorOptiones}>
                        {options.map(estacion => (<option value={estacion.value} key={estacion.value} disabled={estacion.disabled}>{estacion.tag}</option>))}
                      </select>
                    </span> 
                  </p> 
                  <button onClick={refreshPage} className="flex gap-x-3 px-3 bg-white 
                      border rounded-lg text-center font-serif tracking-widest hover:border-4 hover:border-lime-500 items-center">
                      <span className="">
                        <img src="img/icons/actualizarbutton.png"/>
                      </span> Visualizar nuevos datos
                  </button>
              </div>
          </div>

        </div>
            
        <div>
          <CardsAverage selected={opcion}/>
        </div>

    </section>
  );

}

export default SectionData;