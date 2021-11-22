function generateCharts(best_days_labels, waves_step, currents_step, wind_step) {
    new Chart(document.getElementById("line-chart-1"), {
        type: 'line',
        data: {
            labels: best_days_labels,
            datasets: [{
                data: waves_step,
                borderColor: "#384f97",
                fill: false
            }
            ]
        },
        options: {
            title: {
                display: false,
                text: 'Waves Height'
            },
            legend: {
                display: false
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
                    data: currents_step,
                    borderColor: "#82bed1",
                    fill: false
                }
            ]
        },
        options: {
            title: {
                display: false,
                text: 'Currents'
            },
            legend: {
                display: false
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
                    data: wind_step,
                    borderColor: "#85b24a",
                    fill: false
                }
            ]
        },
        options: {
            title: {
                display: false,
                text: 'Wind'
            },
            legend: {
                display: false
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