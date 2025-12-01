import React, { useEffect } from "react";

export const Dashboard = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    document.body.appendChild(script);

    script.onload = () => {
      window.google.charts.load("current", {
        packages: ["table", "map", "corechart"],
        mapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
      });
      window.google.charts.setOnLoadCallback(drawDashboard);
    };

    function drawDashboard() {
      // Datos simulados de ciclistas por municipio
      const geoData = window.google.visualization.arrayToDataTable([
        ["Lat", "Lon", "Municipio", "Ciclistas Activos"],
        [20.6736, -103.344, "Guadalajara", 45000],
        [20.7167, -103.400, "Zapopan", 38000],
        [20.6000, -103.283, "Tlaquepaque", 22000],
        [20.6167, -103.283, "Tonalá", 15000],
        [20.4500, -103.283, "Tlajomulco", 18500],
      ]);

      // Column Chart
      const chartData = window.google.visualization.arrayToDataTable([
        ["Municipio", "Ciclistas Activos", { role: "style" }],
        ["Guadalajara", 45000, "color: #66ccff"],
        ["Zapopan", 38000, "color: #ff6666"],
        ["Tlaquepaque", 22000, "color: #ffcc66"],
        ["Tonalá", 15000, "color: #66ff66"],
        ["Tlajomulco", 18500, "color: #cc66ff"],
      ]);

      const chartOptions = {
        title: "Ciclistas activos por municipio (2025)",
        legend: { position: "none", textStyle: { color: "#fff" } },
        hAxis: { title: "Municipio", textStyle: { color: "#fff" } },
        vAxis: { title: "Ciclistas Activos", textStyle: { color: "#fff" } },
        backgroundColor: "#222",
        chartArea: { width: "80%", height: "70%", backgroundColor: "#333" },
        titleTextStyle: { color: "#fff" },
      };

      const columnChart = new window.google.visualization.ColumnChart(
        document.getElementById("chart_div")
      );
      columnChart.draw(chartData, chartOptions);

      // Tabla con tema oscuro
      const table = new window.google.visualization.Table(
        document.getElementById("table_div")
      );
      table.draw(geoData, {
        showRowNumber: false,
        width: "100%",
        height: "100%",
        color: "#000",
        cssClassNames: {
          headerRow: "table-header",
          tableRow: "table-row",
          oddTableRow: "table-row-odd",
          selectedTableRow: "table-selected",
        },
      });

    //   Map (opcional, estilo oscuro con Google Maps)
      const mapView = new window.google.visualization.DataView(geoData);
      mapView.setColumns([0, 1]);
      const map = new window.google.visualization.Map(
        document.getElementById("map_div")
      );
      map.draw(mapView, { showTip: true, mapType: "terrain" });
    }
  }, []);

  return (
    <div style={{ color: "#fff", textAlign: "center", backgroundColor: "#373333", padding: "20px" }}>
      <h2>Ciclistas activos en la Zona Metropolitana de Guadalajara (2025)</h2>
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <div id="map_div" style={{ width: "400px", height: "300px", backgroundColor: "#373333" }}></div>
        <div id="table_div" style={{ width: "400px", height: "300px", backgroundColor: "#373333" }}></div>
      </div>
      <div
        id="chart_div"
        style={{ width: "90%", height: "400px", margin: "0 auto", backgroundColor: "#373333", padding: "10px", borderRadius: "8px" }}
      ></div>
      {/* Estilos para tabla */}
      <style>
        {`
          .table-header { background-color: #373333; color: #fff; font-weight: bold; }
          .table-row { background-color: #373333; color: #fff; }
          .table-row-odd { background-color: #2a2a2a; color: #fff; }
          .table-selected { background-color: #555 !important; color: #fff !important; }
        `}
      </style>
    </div>
  );
};
