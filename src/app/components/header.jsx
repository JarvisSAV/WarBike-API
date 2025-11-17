import React from "react";

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1 
                  data-aos="fade-up" 
                  data-aos-delay="400"
                >
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p 
                  data-aos="zoom-out" 
                  data-aos-delay="200"
                >
                  {props.data ? props.data.paragraph : "Loading"}
                </p>

                <a
                  href="#team"
                  className="btn btn-custom btn-lg page-scroll"
                  data-aos="zoom-in" 
                  data-aos-delay="800"

                >
                  Instalar Aplicacion
                </a>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};