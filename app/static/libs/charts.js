function round_2(n) {
    return Number(n.toFixed(2));
}

function process_steps(steps_array, new_index) {
    var new_steps = []

    new_index.forEach(i => {
        if (steps_array[i] == null)
            steps_array[i] = (steps_array[Math.max(i - 1, 0)] + steps_array[Math.min(i + 1, steps_array.length - 1)]) / 2

        new_steps.push(round_2(steps_array[i]))
    });

    return new_steps
}

function generateCharts(timestamps, waves_step_best, currents_step_best, wind_step_best, waves_step_base, currents_step_base, wind_step_base, new_index) {
    console.log(currents_step_best, new_index)
    var new_timestamps = []
    new_index.forEach(i => {
        new_timestamps.push(timestamps[i])
    });

    new Chart(document.getElementById("line-chart-1"), {
        type: 'line',
        data: {
            labels: new_timestamps,
            datasets: [{
                data: process_steps(waves_step_best, new_index),
                borderColor: "#384f97",
                fill: false,
                label: "Optimized route"
            },
            {
                data: process_steps(waves_step_base, new_index),
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
            labels: new_timestamps,
            datasets: [
                {
                    data: process_steps(currents_step_best, new_index),
                    borderColor: "#384f97",
                    fill: false,
                    label: "Optimized route",
                },
                {
                    data: process_steps(currents_step_base, new_index),
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
            labels: new_timestamps,
            datasets: [
                {
                    data: process_steps(wind_step_best, new_index),
                    borderColor: "#384f97",
                    fill: false,
                    label: "Optimized route"
                },
                {
                    data: process_steps(wind_step_base, new_index),
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