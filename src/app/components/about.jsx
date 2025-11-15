import React from "react";

export const About = (props) => {
  return (
    <div id="about">
      <div className="container">
        <div className="row">
          <div 
            className="col-xs-12 col-md-6" 
            data-aos="slide-up" 
            data-aos-duration="1000" 
          >
            {" "}
            <img src="img/WB.png" className="img-responsive" alt="" />{" "}
          </div>

          <div 
            className="col-xs-12 col-md-6" 
            data-aos="fade-left" 
            data-aos-duration="1000"
          >
            <div className="about-text">
              <h2 style={{ color: '#fff' }}>¿Qué es War Bike?</h2>
              <p>{props.data ? props.data.paragraph : "loading..."}</p>
              <h3 style={{ color: '#fff' }}>Al jugar podras obtener</h3>
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