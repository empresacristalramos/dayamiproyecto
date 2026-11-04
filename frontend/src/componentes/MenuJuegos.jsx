/**
 * Menú Principal de Selección de los 4 Minijuegos
 * Autora: Dayami Blanco Ramos - CETIS 57
 * Variables y funciones 100% en español.
 */

import React from 'react';
import { Play, Sparkles, Target, Zap, Radar, GitCommit } from 'lucide-react';
import { reproducirSonidoBoton } from '../servicios/motorSonido';

export default function MenuJuegos({ alSeleccionarJuego }) {
  const listaMinijuegos = [
    {
      id: 'caza_abeja',
      titulo: '🐝 Caza la Abeja',
      subtitulo: 'Ecuación de la Recta y Pendiente',
      tema: 'y = mx + b',
      descripcion: 'Homenaje al dibujo del profe: apunta con el cañón cartesiano y ajusta la pendiente del rayo láser para cazar a la abeja antes de que pique.',
      icono: Zap,
      color: '#facc15',
      borde: '#eab308'
    },
    {
      id: 'punto_medio',
      titulo: '🎯 Rescate en el Punto Medio',
      subtitulo: 'Centro de un Segmento',
      tema: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)',
      descripcion: 'Calcula visualmente el centro de gravedad entre dos estaciones espaciales para soltar la cápsula de rescate sin que caiga al vacío.',
      icono: Target,
      color: '#06b6d4',
      borde: '#0891b2'
    },
    {
      id: 'radar',
      titulo: '🛰️ Radar de Distancia Cósmica',
      subtitulo: 'Distancia Euclidiana',
      tema: 'd = √((x₂-x₁)² + (y₂-y₁)²)',
      descripcion: 'Analiza el radar espacial y detecta a toda velocidad cuál amenaza está a menor distancia de tu base cartesiana para activar los escudos.',
      icono: Radar,
      color: '#10b981',
      borde: '#059669'
    },
    {
      id: 'vias',
      titulo: '⚡ Vías Paralelas vs Perpendiculares',
      subtitulo: 'Relación de Pendientes',
      tema: 'm₁ = m₂  |  m₁ · m₂ = -1',
      descripcion: 'Salva al convoy geométrico de descarrilar: alinea rieles paralelos para desviar o barreras perpendiculares a 90° para frenar.',
      icono: GitCommit,
      color: '#ec4899',
      borde: '#db2777'
    }
  ];

  const iniciarJuego = (idJuego) => {
    reproducirSonidoBoton();
    alSeleccionarJuego(idJuego);
  };

  return (
    <div className="contenedor-menu-juegos">
      {/* Banner de Bienvenida con créditos de Dayami */}
      <div className="banner-bienvenida-menu">
        <div className="contenido-banner">
          <span className="etiqueta-banner">
            <Sparkles size={16} /> CETIS No. 57 • Geometría Analítica
          </span>
          <h2 className="titulo-banner">¡Bienvenido a GeoMatrix!</h2>
          <p className="texto-banner">
            Videojuego arcade educativo desarrollado por <strong>Dayami Blanco Ramos</strong> bajo la metodología SDD.
            Selecciona un minijuego para poner a prueba tus reflejos geométricos:
          </p>
        </div>
      </div>

      {/* Rejilla de los 4 Minijuegos */}
      <div className="rejilla-tarjetas-juegos">
        {listaMinijuegos.map((juego) => {
          const IconoComponente = juego.icono;

          return (
            <div
              key={juego.id}
              className="tarjeta-juego-arcade"
              style={{ borderColor: juego.borde }}
            >
              <div
                className="icono-cabecera-juego"
                style={{ backgroundColor: juego.color + '22', color: juego.color }}
              >
                <IconoComponente size={28} />
              </div>

              <div className="cuerpo-tarjeta-juego">
                <div className="insignia-formula-tema">{juego.tema}</div>
                <h3 className="titulo-tarjeta-juego">{juego.titulo}</h3>
                <span className="subtitulo-tarjeta-juego">{juego.subtitulo}</span>
                <p className="descripcion-tarjeta-juego">{juego.descripcion}</p>
              </div>

              <button
                className="boton-iniciar-minijuego"
                style={{ backgroundColor: juego.color, color: '#090d16' }}
                onClick={() => iniciarJuego(juego.id)}
              >
                <Play size={18} fill="#090d16" /> ¡JUGAR AHORA!
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

