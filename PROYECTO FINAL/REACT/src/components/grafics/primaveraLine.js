import { Line } from "react-chartjs-2";
import {
    Chart as Chartjs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

Chartjs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PrimaveraLineas = ({ primavera, id }) => {
    const isValidData = primavera && primavera.length > 0;
  
    // Convertir la fecha a objetos Date y agregar un nuevo campo 'dateObj' al array
    const dataWithDateObj = isValidData
      ? primavera.map(item => {
          const dateObj = new Date(item.fecha);
          return { ...item, dateObj };
        })
      : [];
  
    // Ordenar los datos por el campo 'dateObj'
    const sortedData = dataWithDateObj.sort((a, b) => a.dateObj - b.dateObj);
  
    // Agrupar los datos por mes y calcular el promedio de humedad
    const monthlyAverages = [];
    let currentMonth = -1;
    let sumHumedad = 0;
    let count = 0;
  
    sortedData.forEach(item => {
      const month = item.dateObj.getMonth();
      if (currentMonth === -1) {
        currentMonth = month;
      }
  
      if (month === currentMonth) {
        sumHumedad += item.humedad;
        count++;
      } else {
        // Calcular el promedio y reiniciar para el nuevo mes
        const average = sumHumedad / count;
        monthlyAverages.push({ month: currentMonth, average });
        sumHumedad = item.humedad;
        count = 1;
        currentMonth = month;
      }
    });
  
    // Calcular el promedio para el último mes
    if (count > 0) {
      const average = sumHumedad / count;
      monthlyAverages.push({ month: currentMonth, average });
    }
  
    // Mapear los nombres de los meses
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
  
    // Crear etiquetas para la gráfica
    const labels = monthlyAverages.map(item => monthNames[item.month]);
  
    // Crear un array con los promedios
    const dataValues = monthlyAverages.map(item => item.average);
  
    // Configuración completa de opciones
    const options = {
      responsive: true,
      maintainAspectRatio: false,
    };
  

const miData = {
  labels: labels,
  datasets: [{
    label: 'Promedio de Humedad de ' + id,
    data: dataValues,
    tension: 0.5,
    fill: true,
    borderColor: 'rgb(30 64 175)',
    pointRadius: 7,
    pointBorderColor: 'rgb(14 165 233)',
    pointBackgroundColor: 'rgb(14 165 233)',
    backgroundColor: 'rgb(186 230 253)',
  }],
};
  
    return <Line data={miData} options={options}/>;
  };
  
  export default PrimaveraLineas;
  