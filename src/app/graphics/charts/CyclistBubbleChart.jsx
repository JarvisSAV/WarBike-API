import React, { useEffect } from "react";

export const Areas = () => {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.onload = () => {
      window.google.charts.load("current", { packages: ["corechart"] });
      window.google.charts.setOnLoadCallback(drawChart);
    };
    document.body.appendChild(script);

    function drawChart() {
      const data = window.google.visualization.arrayToDataTable([
        ["ID", "KM diarios", "Minutos activos", "Municipio", "Ciclistas activos"],
        ["GDL", 12, 55, "Guadalajara", 45000],
        ["ZAP", 10, 50, "Zapopan", 38000],
        ["TLAQ", 9, 47, "Tlaquepaque", 22000],
        ["TONA", 8, 45, "Tonalá", 15000],
        ["TLAJ", 11, 52, "Tlajomulco", 18500],
        ["SALT", 7, 40, "El Salto", 7500],
      ]);

     const options = {
          title:
            "",
          hAxis: { 
            title: "KM diarios recorridos",
            textStyle: { color: '#fff' }, // texto eje X blanco
            titleTextStyle: { color: '#fff' }
          },
          vAxis: { 
            title: "Minutos activos por día",
            textStyle: { color: '#fff' }, // texto eje Y blanco
            titleTextStyle: { color: '#fff' }
          },
          bubble: { textStyle: { fontSize: 12, color: '#fff' } },
          backgroundColor: '#222',  // fondo general oscuro
          chartArea: { backgroundColor: '#333', width: '80%', height: '70%' } // área de dibujo
        };

      const chart = new window.google.visualization.BubbleChart(
        document.getElementById("bubble_chart_zmg")
      );
      chart.draw(data, options);
    }
  }, []);

  return (


    <div id="bubblechart" className="text-center">
      <div className="container">
        <div 
          className="col-md-12 section-title" 
          data-aos="fade-up"
        >
          <h2 style={{ color: '#fff' }}>Ciclistas Activos En Zona Metropolitana de Guadalajara</h2>
        </div>

        <div  style={{ width: "100%", textAlign: "center" }}>
          <h5 style={{ marginBottom: "10px", color: "#fff" }}>
           
           X = KM diarios, Y = Minutos activos, Tamaño = Ciclistas activos
          </h5>

          <div
            id="bubble_chart_zmg"
            style={{ width: "100%", height: "500px" }}
          ></div>
        </div>

      </div>
    </div>



  );
};
