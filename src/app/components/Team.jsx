import React from "react";

export const Team = (props) => {
  return (
    <div id="team" className="text-center">
      <div className="container">
        
        <div 
          className="col-md-8 col-md-offset-2 section-title" 
          data-aos="zoom-out" 
        >
          <h2 style={{ color: '#d1a019', textAlign: 'center' }}>Qr de la App</h2>
          <p style={{ color: '#d5d4d4ff', textAlign: 'center' }}>
            Escanea el QR para comenzar con el viaje
          </p>
        </div>
        
        <div id="row">
          {props.data
            ? props.data.map((d, i) => (
               
                <div 
                  key={`${d.name}-${i}`} 
                  className="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 team" 
  
                  data-aos="zoom-in"
                  data-aos-delay={i * 100}
                >

                  <div className="thumbnail"> 
                    {" "}
                    <img src={d.img} alt="..." className="team-img" />
                    <div className="caption">
                      <h4>{d.name}</h4>
                      <p>{d.job}</p>
                    </div>
                  </div>
                </div>
                
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};