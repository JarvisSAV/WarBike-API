import React from "react";

export const Testimonials = (props) => {
  return (
    <div id="testimonials">
      <div className="container">
        <div className="row">
          
          <div 
            className="col-xs-12 col-md-6 testimonials-image-container"
            data-aos="fade-right" 
            data-aos-duration="1000"
          >
            {" "}
            <img src="img/Gana.jpeg" className="img-responsive" alt="" />{" "}
            <img src="img/Ganaa.jpeg" className="img-responsive" alt="" />{" "}
          </div>
         
          <div 
            className="col-xs-12 col-md-6" 
            data-aos="zoom-in" 
            data-aos-duration="1000"
          >
            <div className="testimonials-text">
              <h2 style={{ color: '#d1a019', textAlign: 'center' }}>
                Gana premios especiales
              </h2>
              <p style={{ color: '#d5d4d4ff', textAlign: 'center' }}>
                {props.data ? props.data.paragraph : "loading..."}
              </p>
              <div className="list-style">
                <div className="col-lg-6 col-sm-6 col-xs-12">
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
    </div>
  );
};