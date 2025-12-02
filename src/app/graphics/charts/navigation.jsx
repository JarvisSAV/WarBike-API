import React from "react";

export const Navigation = (props) => {
  return (
    <nav 
      id="menu" 
      className="navbar navbar-default navbar-fixed-top"
      data-aos="fade-down" 
      data-aos-duration="1500" 
    >
      
      <div className="container">
        
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
                <div>
                    <img src="img/logo_wb.png" className="img-responsive" alt="" style={{ height: "40px" }} >
                    </img>
                </div>
            
                <div>
                  <a
                    className="navbar-brand page-scroll"
                    href="#page-top"
                    style={{ fontSize: "18px" }}
                  >
                    Pedalea y Conquista
                  </a>
                </div>
            
          </div>
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="#general" className="page-scroll">
                  Ciclistas Activos por dia
                </a>
              </li>

              <li>
                <a href="#bubblechart" className="page-scroll">
                  Ciclistas Activos por zona
                </a>
              </li>

              <li>
                <a href="/" className="page-scroll">
                  War Bike
                </a>
              </li>
              <li>
                <a href="/#contact" className="page-scroll">
                  Contacto
                </a>
              </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};