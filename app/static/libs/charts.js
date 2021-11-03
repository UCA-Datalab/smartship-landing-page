new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
        labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
        datasets: [{ 
            data: [86,114,106,106,107,111,133,221,783,2478],
            label: "Base route",
            borderColor: "#3e95cd",
            fill: false
        }, { 
            data: [282,350,411,502,635,809,947,1402,3700,5267],
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
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
            data: [2478,5267,734,784]
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

