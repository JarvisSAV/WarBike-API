'use client'

import React, { useState, useEffect } from 'react'
import { Navigation } from './charts/navigation'
import { Header } from './charts/header'
import { Features } from '../graphics/charts/features'
import { Areas } from './charts/CyclistBubbleChart'
import { Dashboard  } from './charts/CyclistDashboard'

import JsonData from './data/data.json'
import '../App.css'
import '../../styles/styles.css' // tu hoja de estilos personalizada
import 'font-awesome/css/font-awesome.min.css' // Font Awesome
import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap 3.3.7 CSS


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
    // Cargar jQuery y Bootstrap dinámicamente
    const loadBootstrap = async () => {
      if (typeof window !== 'undefined') {
        const $ = (await import('jquery')).default
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).$ = (window as any).jQuery = $
        await import('bootstrap/dist/js/bootstrap.min.js')
      }
    }
    loadBootstrap()

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
     
       <Header data={landingPageData?.Header} />
       <Navigation />
       <Features data={landingPageData?.Features} />
       <Areas data={landingPageData?.Areas} />
       <Dashboard data={landingPageData?.Dashboard} />
       
    </div>
  )
}
