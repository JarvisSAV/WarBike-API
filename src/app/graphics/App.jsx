"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "../components/navigation";
import { Header } from "../components/header";
import { Features } from "../components/features";
import { About } from "../components/about";
import { Services } from "../components/services";
import { Gallery } from "../components/gallery";
import { Testimonials } from "../components/testimonials";
import { Team } from "../components/Team";
import { Contact } from "../components/contact";
import JsonData from "../data/data.json";
import "../App.css";

import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    // Cargar los datos del JSON
    setLandingPageData(JsonData);

    // Inicializar la librería AOS (animaciones)
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });

    // Refrescar AOS después de un breve tiempo
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 500);

    // Limpiar el timeout al desmontar el componente
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />

    </div>
  );
};

export default App;
