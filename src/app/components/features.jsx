import React from "react";

export const Features = (props) => {
  return (
    <div id="features" className="text-center">
      <div className="container">
        <div 
          className="col-md-10 col-md-offset-1 section-title" 
          data-aos="fade-up"
        >
          <h2 style={{ color: '#fff' }}>Características</h2>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div 
                  key={`${d.title}-${i}`} 
                  className="col-xs-6 col-md-3"
                  data-aos="fade-down" 
                  data-aos-delay={i * 100} 
                >
                  {" "}
                  <i className={d.icon}></i>
                  <h3 style={{ color: '#ffffffff' }}>{d.title}</h3>
                  <p style={{ color: '#b4ababff' }}>{d.text}</p>
                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    </div>
  );
};
