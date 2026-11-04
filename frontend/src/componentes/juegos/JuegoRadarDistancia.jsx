/**
 * Minijuego 3: "Radar de Distancia Cósmica"
 * Tema: Distancia Euclidiana entre dos puntos: d = sqrt((x2 - x1)^2 + (y2 - y1)^2)
 * Autora: Dayami Blanco Ramos - CETIS 57
 * Variables y funciones 100% en español.
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Radar, RotateCcw, Award, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { generarNivelRadar } from '../../servicios/servicioMatematico';
import { reproducirSonidoAcierto, reproducirSonidoFallo, reproducirSonidoVictoria, reproducirSonidoBip } from '../../servicios/motorSonido';
import { guardarPuntaje } from '../../servicios/conexionSupabase';

export default function JuegoRadarDistancia({ usuarioActual, alVolverAlMenu, alActualizarPuntajeGlobal }) {
  const [nivel, setNivel] = useState(1);
  const [datosNivel, setDatosNivel] = useState(null);
  const [amenazaSeleccionada, setAmenazaSeleccionada] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(8);
  const [puntajePartida, setPuntajePartida] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const lienzoRef = useRef(null);

  useEffect(() => {
    cargarNuevoNivel(nivel);
  }, [nivel]);

  const cargarNuevoNivel = (numNivel) => {
    const nuevo = generarNivelRadar(numNivel);
    setDatosNivel(nuevo);
    setAmenazaSeleccionada(null);
    setTiempoRestante(Math.max(5, 9 - numNivel));
  };

  // Temporizador de reacción rápida
  useEffect(() => {
    if (juegoTerminado || amenazaSeleccionada || !datosNivel) return;

    if (tiempoRestante <= 0) {
      // Se agotó el tiempo
      manejarFalloTiempo();
      return;
    }

    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tiempoRestante, amenazaSeleccionada, juegoTerminado, datosNivel]);

  const manejarFalloTiempo = () => {
    reproducirSonidoFallo();
    setAmenazaSeleccionada({ tiempoAgotado: true });

    const vidasRestantes = vidas - 1;
    setVidas(vidasRestantes);

    if (vidasRestantes <= 0) {
      setJuegoTerminado(true);
    } else {
      setTimeout(() => {
        cargarNuevoNivel(nivel);
      }, 1500);
    }
  };

  // Dibujar el radar cartesiano
  useEffect(() => {
    if (!datosNivel || !lienzoRef.current) return;

    const canvas = lienzoRef.current;
    const ctx = canvas.getContext('2d');
    const ancho = canvas.width;
    const alto = canvas.height;

    const centroX = ancho / 2;
    const centroY = alto / 2;
    const radioMaximo = Math.min(ancho, alto) * 0.45;
    const escala = radioMaximo / 10;

    // Fondo oscuro de radar
    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, ancho, alto);

    // Círculos concéntricos del radar
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 1.2;
    for (let r = 2; r <= 10; r += 2) {
      ctx.beginPath();
      ctx.arc(centroX, centroY, r * escala, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Ejes verdes de radar
    ctx.beginPath();
    ctx.moveTo(centroX - radioMaximo, centroY);
    ctx.lineTo(centroX + radioMaximo, centroY);
    ctx.moveTo(centroX, centroY - radioMaximo);
    ctx.lineTo(centroX, centroY + radioMaximo);
    ctx.stroke();

    // Base central (0, 0)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(centroX, centroY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Base (0,0)', centroX + 10, centroY + 4);

    // Dibujar cada amenaza
    datosNivel.threats?.forEach ? null : null; // compatibilidad
    datosNivel.amenazas.forEach((amenaza) => {
      const px = centroX + amenaza.x * escala;
      const py = centroY - amenaza.y * escala;

      const esLaCorrecta = amenaza.id === datosNivel.idMasCercana;
      const fueElegida = amenazaSeleccionada && amenazaSeleccionada.id === amenaza.id;

      // Línea de distancia a la base
      ctx.strokeStyle = fueElegida ? '#facc15' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(centroX, centroY);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Marcador de amenaza
      ctx.fillStyle = amenaza.color;
      ctx.beginPath();
      ctx.arc(px, py, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Letra o número de la amenaza
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(amenaza.id), px, py);

      // Texto de coordenadas y distancia
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px sans-serif';
      ctx.fillText(`(${amenaza.x}, ${amenaza.y})`, px, py - 18);
      if (amenazaSeleccionada) {
        ctx.fillStyle = esLaCorrecta ? '#4ade80' : '#f87171';
        ctx.fillText(`d = ${amenaza.distancia} u`, px, py + 18);
      }
    });

  }, [datosNivel, amenazaSeleccionada]);

  // Selección de amenaza por el jugador
  const elegirAmenaza = async (amenaza) => {
    if (amenazaSeleccionada || juegoTerminado) return;

    setAmenazaSeleccionada(amenaza);
    const esCorrecta = amenaza.id === datosNivel.idMasCercana;

    if (esCorrecta) {
      reproducirSonidoAcierto();
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });

      const nuevosPuntos = puntajePartida + 140 * nivel + tiempoRestante * 10;
      setPuntajePartida(nuevosPuntos);

      if (usuarioActual) {
        await guardarPuntaje(usuarioActual.id, usuarioActual.username, 'radar', nivel, 140 * nivel);
        alActualizarPuntajeGlobal(140 * nivel);
      }

      setTimeout(() => {
        if (nivel < 5) {
          setNivel(nivel + 1);
        } else {
          reproducirSonidoVictoria();
          setJuegoTerminado(true);
        }
      }, 1500);
    } else {
      reproducirSonidoFallo();
      const vidasRestantes = vidas - 1;
      setVidas(vidasRestantes);

      if (vidasRestantes <= 0) {
        setJuegoTerminado(true);
      } else {
        setTimeout(() => {
          cargarNuevoNivel(nivel);
        }, 1600);
      }
    }
  };

  const reiniciarPartida = () => {
    setNivel(1);
    setVidas(3);
    setPuntajePartida(0);
    setJuegoTerminado(false);
    cargarNuevoNivel(1);
  };

  return (
    <div className="contenedor-pantalla-juego">
      <div className="cabecera-juego">
        <button className="boton-volver" onClick={alVolverAlMenu}>
          <ArrowLeft size={18} /> Volver al Menú
        </button>
        <div className="info-juego-centro">
          <h2 className="titulo-minijuego">🛰️ Radar de Distancia Cósmica</h2>
          <span className="subtitulo-tema">Distancia euclidiana: d = √((x₂-x₁)² + (y₂-y₁)²)</span>
        </div>
        <div className="estadisticas-juego">
          <span className={`etiqueta-tiempo ${tiempoRestante <= 3 ? 'tiempo-peligro' : ''}`}>
            ⏱️ {tiempoRestante}s
          </span>
          <span className="etiqueta-vidas">❤️ x {vidas}</span>
          <span className="etiqueta-puntos">🏆 {puntajePartida} pts</span>
        </div>
      </div>

      <div className="area-interactiva-juego">
        <div className="marcador-formula-neon">
          <div className="etiqueta-formula">Alerta de Seguridad:</div>
          <div className="texto-formula-dinamica">
            ¿Cuál amenaza está a <strong>MENOR DISTANCIA</strong> de la base (0,0)? ¡Tócala rápido!
          </div>
        </div>

        <div className="lienzo-contenedor">
          <canvas
            ref={lienzoRef}
            width={620}
            height={380}
            className="lienzo-cartesiano"
          />
        </div>

        {/* Tarjetas de opciones para tocar */}
        <div className="panel-botones-amenazas">
          {datosNivel?.amenazas.map((a) => (
            <button
              key={a.id}
              className={`boton-tarjeta-amenaza ${amenazaSeleccionada?.id === a.id ? (a.id === datosNivel.idMasCercana ? 'acierto' : 'error') : ''}`}
              style={{ borderColor: a.color }}
              onClick={() => elegirAmenaza(a)}
              disabled={Boolean(amenazaSeleccionada) || juegoTerminado}
            >
              <span className="numero-badge-amenaza" style={{ backgroundColor: a.color }}>
                #{a.id}
              </span>
              <div className="datos-amenaza-boton">
                <span className="nombre-amenaza-texto">{a.nombre}</span>
                <span className="coords-amenaza-texto">Coordenadas: ({a.x}, {a.y})</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {juegoTerminado && (
        <div className="capa-modal-fondo">
          <div className="tarjeta-modal-fin">
            <h3 className="titulo-fin-juego">
              {vidas > 0 ? '🛡️ ¡Base Protegida con Éxito!' : '💥 ¡Impacto en el Radar!'}
            </h3>
            <p className="descripcion-fin">
              {vidas > 0
                ? '¡Calculaste con agilidad relámpago las distancias euclidianas y salvaste la estación espacial!'
                : 'La amenaza más cercana no fue detectada a tiempo. ¡Prueba tus reflejos analíticos de nuevo!'}
            </p>
            <div className="puntos-finales">
              Puntaje Total Obtenido: <strong>{puntajePartida} pts</strong>
            </div>
            <div className="botones-modal-fin">
              <button className="boton-accion-secundario" onClick={reiniciarPartida}>
                <RotateCcw size={18} /> Jugar de Nuevo
              </button>
              <button className="boton-accion-primario" onClick={alVolverAlMenu}>
                <Award size={18} /> Ir al Menú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

