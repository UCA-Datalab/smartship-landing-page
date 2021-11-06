function generateCharts(cumulative_best_fuel, cumulative_base_fuel, days_labels, waves_step, waves_height_step, currents_step, wind_step) {
    new Chart(document.getElementById("line-chart-2"), {
        type: 'line',
        data: {
            labels: days_labels,
            datasets: [{
                data: cumulative_base_fuel,
                label: "Base route",
                borderColor: "#3e95cd",
                fill: false
            }, {
                data: cumulative_best_fuel,
                label: "Optimize route",
                borderColor: "#8e5ea2",
                fill: false
            }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Fuel consumption between waypoints'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'linear'
                }]
            }
        }
    });

    new Chart(document.getElementById("line-chart-1"), {
        type: 'line',
        data: {
            labels: days_labels,
            datasets: [{
                data: waves_step,
                label: "Waves",
                borderColor: "#2d4287",
                fill: false
            }, {
                data: waves_height_step,
                label: "Waves height",
                borderColor: "#384f97",
                fill: false
            },
            {
                data: currents_step,
                label: "Currents",
                borderColor: "#82bed1",
                fill: false
            },
            {
                data: wind_step,
                label: "Wind",
                borderColor: "#85b24a",
                fill: false
            }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Oceanographic data between waypoints'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'linear'
                }]
            }
        }
    });

}