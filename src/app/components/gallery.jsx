import React from "react";

export const Gallery = (props) => {
  return (
    <div id="portfolio" className="text-center">
      <div className="container">
        <div className="row">

          <div 
            className="col-xs-12 col-md-6" 
            data-aos="zoom-in" 
            data-aos-duration="1000"
          >
            <div className="portfolio-text">
              <h2 style={{ color: "#d1a019", textAlign: "center" }}>
                Compite con amigos
              </h2>
              <p style={{ color: "#d5d4d4ff", textAlign: "center" }}>
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

          <div 
            className="col-xs-12 col-md-6" 
            data-aos="fade-left" 
            data-aos-duration="1000"
          >
            {" "}
            <img src="img/Ranking.jpeg" className="img-responsive" alt="" />{" "}
          </div>
        </div>
      </div>
    </div>
  );
};