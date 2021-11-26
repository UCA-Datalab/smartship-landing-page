function generateCharts(best_days_labels, waves_step_best, currents_step_best, wind_step_best, waves_step_base, currents_step_base, wind_step_base) {
    new Chart(document.getElementById("line-chart-1"), {
        type: 'line',
        data: {
            labels: best_days_labels,
            datasets: [{
                data: waves_step_best,
                borderColor: "#384f97",
                fill: false,
                label: "Optimized route"
            },
            {
                data: waves_step_base,
                borderColor: '#cc4902',
                fill: false,
                label: "Base route"
            }
            ]
        },
        options: {
            title: {
                display: false,
                text: 'Waves Height'
            },
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'linear'
                }]
            }
        }
    });

    new Chart(document.getElementById("line-chart-2"), {
        type: 'line',
        data: {
            labels: best_days_labels,
            datasets: [
                {
                    data: currents_step_best,
                    borderColor: "#384f97",
                    fill: false,
                    label: "Optimized route",
                },
                {
                    data: currents_step_base,
                    borderColor: '#cc4902',
                    fill: false,
                    label: "Base route"
                }
            ]
        },
        options: {
            title: {
                display: false,
                text: 'Currents'
            },
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'linear'
                }]
            }
        }
    });

    new Chart(document.getElementById("line-chart-3"), {
        type: 'line',
        data: {
            labels: best_days_labels,
            datasets: [
                {
                    data: wind_step_best,
                    borderColor: "#384f97",
                    fill: false,
                    label: "Optimized route"
                },
                {
                    data: wind_step_base,
                    borderColor: '#cc4902',
                    fill: false,
                    label: "Base route"
                }
            ]
        },
        options: {
            title: {
                display: false,
                text: 'Wind'
            },
            legend: {
                display: true
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