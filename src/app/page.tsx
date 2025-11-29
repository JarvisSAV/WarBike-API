'use client'

import React, { useState, useEffect } from 'react'
import { Navigation } from './components/navigation'
import { Header } from './components/header'
import { Features } from './components/features'
import { About } from './components/about'
import { Services } from './components/services'
import { Gallery } from './components/gallery'
import { Testimonials } from './components/testimonials'
import { Team } from './components/Team'
import { Contact } from './components/contact'
import JsonData from './data/data.json'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap 3.3.7 CSS
import '../styles/styles.css' // tu hoja de estilos personalizada
import 'font-awesome/css/font-awesome.min.css' // Font Awesome

import AOS from 'aos'
import 'aos/dist/aos.css'

export default function App() {
  const [landingPageData, setLandingPageData] = useState<{
    Header: object,
    Features: object,
    About: object,
    Services: object,
    Gallery: object,
    Testimonials: object,
    Team: object,
    Contact: object
  } | null>(null)

  useEffect(() => {
    // Cargar los datos del JSON
    setLandingPageData(JsonData)

    // Inicializar la librería AOS (animaciones)
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true
    })

    // Refrescar AOS después de un breve tiempo
    const timer = setTimeout(() => {
      AOS.refresh()
    }, 500)

    // Limpiar el timeout al desmontar el componente
    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      <Navigation />
      <Header data={landingPageData?.Header} />
      <Features data={landingPageData?.Features} />
      <About data={landingPageData?.About} />
      <Services data={landingPageData?.Services} />
      <Gallery data={landingPageData?.Gallery} />
      <Testimonials data={landingPageData?.Testimonials} />
      <Team data={landingPageData?.Team} />
      <Contact data={landingPageData?.Contact} />
    </div>
  )
}
