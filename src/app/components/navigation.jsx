import React from "react";

export const Navigation = (props) => {
  return (
    <nav 
      id="menu" 
      className="navbar navbar-default navbar-fixed-top"
      data-aos="fade-down" 
      data-aos-duration="1500" 
    >
      
      <div className="container" style={{ marginLeft: "0.5em" }} >
        
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
                    style={{ fontSize: "1em" }}
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
                <a href="#features" className="page-scroll"  style={{ marginLeft: "0.5em", marginRight : "0.5em" }} >
                  Carateristicas
                </a>
              </li>
              <li>
                <a href="#about" className="page-scroll" style={{ marginLeft: "0.5em", marginRight : "0.5em" }} >
                  War Bike
                </a>
              </li>
              <li>
                <a href="#services" className="page-scroll" style={{ marginLeft: "0.5em", marginRight : "0.5em" }} >
                  Conquista
                </a>
              </li>
              <li>
                <a href="#portfolio" className="page-scroll" style={{ marginLeft: "0.5em", marginRight : "0.5em" }} >
                  Compite
                </a>
              </li>
              <li>
                <a href="#testimonials" className="page-scroll" style={{ marginLeft: "0.5em", marginRight : "0.5em" }} >
                  Gana
                </a>
              </li>
              <li>
                <a href="#team" className="page-scroll" style={{ marginLeft: "0.5em", marginRight : "0.5em" }}>
                  QR
                </a>
              </li>
              <li>
                <a href="#contact" className="page-scroll" style={{ marginLeft: "0.5em", marginRight : "0.5em" }} >
                  Contacto
                </a>
              </li>
              <li>
                <a href="/graphics" className="page-scroll" style={{ marginLeft: "0.5em", marginRight : "0.5em" }} >
                  Estadisticas
                </a>
              </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};