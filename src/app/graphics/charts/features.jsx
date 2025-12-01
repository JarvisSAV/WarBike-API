import React, { useEffect } from "react";

export const Features = (props) => {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.onload = () => {
      window.google.charts.load("current", { packages: ["calendar"] });
      window.google.charts.setOnLoadCallback(drawChart);
    };
    document.body.appendChild(script);

    function drawChart() {
      const dataTable = new window.google.visualization.DataTable();
      dataTable.addColumn({ type: "date", id: "Date" });
      dataTable.addColumn({ type: "number", id: "Won/Loss" });
     const rows = [];
      for (let d = new Date(2025, 0, 1); d <= new Date(2025, 11, 31); d.setDate(d.getDate() + 1)) { 
        const day = d.getDay(); // 0-Dom, 6-Sab
        const month = d.getMonth();

        let value;

        // Más bicicleta → menos conectividad
        const isWeekend = (day === 0 || day === 6);
        const warmMonths = (month === 3 || month === 4 || month === 5 || month === 6 || month === 7 || month === 8);

        if (isWeekend && warmMonths) {
          // fines de semana cálidos → muy poca conectividad
          value = Math.floor(100 + Math.random() * 250);  // 100–350
        } else if (isWeekend) {
          value = Math.floor(200 + Math.random() * 350);  // 200–550
        } else if (warmMonths) {
          value = Math.floor(300 + Math.random() * 500);  // 300–800
        } else {
          value = Math.floor(600 + Math.random() * 400);  // 600–1000
        }

        rows.push([new Date(d.getTime()), value]);
      }
      dataTable.addRows(rows);
      const chart = new window.google.visualization.Calendar(
        document.getElementById("calendar_basic")
      );

      const options = {
        title: "Ciclistas activos",
        height: 350,
      };

      chart.draw(dataTable, options);
    }
  }, []);

  return (
    <div id="general" className="text-center">
      <div className="container">
        <div 
          className="col-md-12  section-title" 
          data-aos="fade-up"
        >
          <h2 style={{ color: '#fff' }}>Ciclistas Activos</h2>
        </div>

        <div className="row">
          <div>
            <h2>Gráfica de Calendario</h2>
            <div id="calendar_basic" style={{ width: "100%", height: "60vh" }}></div>
          </div>
        </div>

      </div>
    </div>
  );
};
