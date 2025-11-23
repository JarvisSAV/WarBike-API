import React from "react";

export const Services = (props) => {
  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="row">

          {/* IMÁGENES */}
          <div 
            className="col-12 col-md-6"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <div className="row">
              <div class="col-xs-6 col-md-6">
                <img src="img/Ganaa.png" className="img-fluid" alt="" />
              </div>
              <div class="col-xs-6 col-md-6">
                <img src="img/Mapa.png" className="img-fluid" alt="" />
              </div>
            </div>
          </div>

          {/* TEXTO */}
          <div 
            className="col-12 col-md-6"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            <div className="service-text">
              <h2 style={{ color: '#d1a019', textAlign: 'center' }}>
                Conquista territorios
              </h2>
              <p style={{ color: '#d5d4d4ff', textAlign: 'center' }}>
                {props.data ? props.data.paragraph : "loading..."}
              </p>
              <div className="list-style">
                <ul>
                  {props.data
                    ? props.data.Why.map((d, i) => (
                        <li key={`${d}-${i}`}>{d}</li>
                      ))
                    : "loading"}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
