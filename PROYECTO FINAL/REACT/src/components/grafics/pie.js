import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2"; 

ChartJS.register(ArcElement,Tooltip,Legend);

const Pies = ({primavera,verano,otono,invierno}) => {

var options = {
    responsive: true,
    maintainAspectRatio: false
}

var data = {
    labels: ['PRIMAVERA','VERANO','OTOÑO','INVIERNO'],
    datasets: [
        {
            label: "Monitoreo de humedad",
            data: [primavera[0],verano[0],otono[0],invierno[0]],
            backgroundColor: [
                '#e79eff',
                '#a3ffac',
                '#ffda89',
                '#c7f7f7'
            ],
            borderColor: [
                'rgb(168 85 247)',
                'rgb(34 197 94)',
                'rgb(249 115 22)',
                'rgb(14 165 233)'
            ],
            borderWidth: 2
        }
    ]
}

    return <Pie data={data} options={options}/>
}

export default Pies;