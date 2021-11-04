function generateCharts(cumulative_best_fuel, cumulative_base_fuel, days_labels) {
    new Chart(document.getElementById("line-chart"), {
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

    new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
            labels: ["Spain", "United States", "Portugal", "France"],
            datasets: [
                {
                    label: "Miles",
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9"],
                    data: [2478, 5267, 734, 784]
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Miles in territorial waters'
            }
        }
    });

}