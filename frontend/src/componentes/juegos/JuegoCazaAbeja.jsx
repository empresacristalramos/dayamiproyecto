/**
 * Minijuego 1: "Caza la Abeja" (Homenaje al Profesor de CETIS 57)
 * Tema: Aplicación gráfica de la ecuación de la recta (y = mx + b e intersecciones con los ejes)
 * Basado exactamente en los apuntes del Bloque 1 de Geometría Analítica del CETIS 57.
 * Autora: Dayami Blanco Ramos
 * Variables y funciones 100% en español.
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Target, Zap, RotateCcw, Award, CheckCircle2, BookOpen } from 'lucide-react';
import { generarNivelAbeja, verificarDisparoAbeja } from '../../servicios/servicioMatematico';
import { reproducirSonidoLaser, reproducirSonidoAcierto, reproducirSonidoFallo, reproducirSonidoVictoria } from '../../servicios/motorSonido';
import { guardarPuntaje } from '../../servicios/conexionSupabase';

export default function JuegoCazaAbeja({ usuarioActual, alVolverAlMenu, alActualizarPuntajeGlobal }) {
  const [nivel, setNivel] = useState(1);
  const [datosNivel, setDatosNivel] = useState(null);
  const [pendienteJugador, setPendienteJugador] = useState(0);
  const [disparando, setDisparando] = useState(false);
  const [resultadoDisparo, setResultadoDisparo] = useState(null);
  const [puntajePartida, setPuntajePartida] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const lienzoRef = useRef(null);

  useEffect(() => {
    cargarNuevoNivel(nivel);
  }, [nivel]);

  const cargarNuevoNivel = (numNivel) => {
    const nuevo = generarNivelAbeja(numNivel);
    setDatosNivel(nuevo);
    setPendienteJugador(0);
    setResultadoDisparo(null);
    setDisparando(false);
  };

  // Cálculo analítico de las intersecciones con los ejes (Igual que en la libreta del CETIS 57)
  const b = datosNivel?.canon.y ?? 0;
  const m = pendienteJugador;
  // Corte con eje X: cuando y = 0 => 0 = mx + b => x = -b / m
  const corteX = m !== 0 ? Number((-b / m).toFixed(1)) : null;

  // Dibujar el plano cartesiano con los cortes exactos de la libreta
  useEffect(() => {
    if (!datosNivel || !lienzoRef.current) return;

    const canvas = lienzoRef.current;
    const ctx = canvas.getContext('2d');
    const ancho = canvas.width;
    const alto = canvas.height;

    const centroX = ancho / 2;
    const centroY = alto / 2;
    const escala = 26;

    // Fondo oscuro espacial
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, ancho, alto);

    // Cuadrícula tenue
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = centroX % escala; x < ancho; x += escala) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, alto);
      ctx.stroke();
    }
    for (let y = centroY % escala; y < alto; y += escala) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ancho, y);
      ctx.stroke();
    }

    // Ejes Cartesianos X e Y
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centroY);
    ctx.lineTo(ancho, centroY);
    ctx.moveTo(centroX, 0);
    ctx.lineTo(centroX, alto);
    ctx.stroke();

    // Marcas de números en los ejes
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    for (let i = -10; i <= 10; i += 2) {
      if (i !== 0) {
        ctx.fillText(String(i), centroX + i * escala - 4, centroY + 14);
        ctx.fillText(String(i), centroX + 6, centroY - i * escala + 3);
      }
    }

    // Coordenadas del Cañón en el Eje Y: (0, b)
    const canonPixelX = centroX;
    const canonPixelY = centroY - b * escala;

    // Coordenadas de la Abeja: (x, y)
    const abejaPixelX = centroX + datosNivel.abeja.x * escala;
    const abejaPixelY = centroY - datosNivel.abeja.y * escala;

    // Trazar la Recta y = mx + b
    const xMin = -12;
    const xMax = 12;
    const yMin = m * xMin + b;
    const yMax = m * xMax + b;

    const pX1 = centroX + xMin * escala;
    const pY1 = centroY - yMin * escala;
    const pX2 = centroX + xMax * escala;
    const pY2 = centroY - yMax * escala;

    ctx.strokeStyle = disparando
      ? resultadoDisparo === 'acierto'
        ? '#4ade80'
        : '#f87171'
      : '#facc15';
    ctx.lineWidth = disparando ? 4 : 2;
    if (!disparando) ctx.setLineDash([5, 5]);
    else ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(pX1, pY1);
    ctx.lineTo(pX2, pY2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Puntos de corte con los ejes (igual que en los apuntes de la libreta)
    // 1. Corte con Eje Y: (0, b)
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(canonPixelX, canonPixelY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#f472b6';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`(0, ${b})`, canonPixelX + 10, canonPixelY + 4);

    // 2. Corte con Eje X: (corteX, 0)
    if (corteX !== null && Math.abs(corteX) <= 12) {
      const cortePixelX = centroX + corteX * escala;
      const cortePixelY = centroY;

      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(cortePixelX, cortePixelY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`(${corteX}, 0)`, cortePixelX - 15, cortePixelY + 20);
    }

    // Dibujar la Abeja
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐝', abejaPixelX, abejaPixelY);

    // Coordenadas de la abeja
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(
      `Objetivo (${datosNivel.abeja.x}, ${datosNivel.abeja.y})`,
      abejaPixelX,
      abejaPixelY - 20
    );

  }, [datosNivel, pendienteJugador, disparando, resultadoDisparo, corteX, b, m]);

  const realizarDisparo = async () => {
    if (disparando || juegoTerminado) return;

    setDisparando(true);
    reproducirSonidoLaser();

    const resultado = verificarDisparoAbeja(
      datosNivel.canon.y,
      datosNivel.abeja.x,
      datosNivel.abeja.y,
      pendienteJugador
    );

    if (resultado.acierto) {
      setResultadoDisparo('acierto');
      reproducirSonidoAcierto();
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });

      const nuevosPuntos = puntajePartida + 150 * nivel;
      setPuntajePartida(nuevosPuntos);

      if (usuarioActual) {
        await guardarPuntaje(usuarioActual.id, usuarioActual.username, 'caza_abeja', nivel, 150 * nivel);
        alActualizarPuntajeGlobal(150 * nivel);
      }

      setTimeout(() => {
        if (nivel < 5) {
          setNivel(nivel + 1);
        } else {
          reproducirSonidoVictoria();
          setJuegoTerminado(true);
        }
      }, 1300);
    } else {
      setResultadoDisparo('fallo');
      reproducirSonidoFallo();

      const vidasRestantes = vidas - 1;
      setVidas(vidasRestantes);

      if (vidasRestantes <= 0) {
        setJuegoTerminado(true);
      } else {
        setTimeout(() => {
          setDisparando(false);
          setResultadoDisparo(null);
        }, 1300);
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
      {/* Cabecera del juego */}
      <div className="cabecera-juego">
        <button className="boton-volver" onClick={alVolverAlMenu}>
          <ArrowLeft size={18} /> Volver al Menú
        </button>
        <div className="info-juego-centro">
          <h2 className="titulo-minijuego">🐝 Caza la Abeja (Bloque 1: La Recta)</h2>
          <span className="subtitulo-tema">Aplicación Gráfica de y = mx + b • CETIS 57</span>
        </div>
        <div className="estadisticas-juego">
          <span className="etiqueta-nivel">Nivel {nivel}/5</span>
          <span className="etiqueta-vidas">❤️ x {vidas}</span>
          <span className="etiqueta-puntos">🏆 {puntajePartida} pts</span>
        </div>
      </div>

      <div className="area-interactiva-juego">
        {/* Panel Didáctico Idéntico a la Libreta de Clases */}
        <div className="marcador-formula-neon">
          <div className="bloque-datos-libreta">
            <span className="etiqueta-formula">Ecuación de la Recta:</span>
            <span className="texto-formula-dinamica">
              y = <strong className="resalte-pendiente">{pendienteJugador.toFixed(2)}</strong>x + ({b})
            </span>
          </div>

          <div className="bloque-intersecciones-libreta">
            <span className="badge-corte eje-y">Corte Y: (0, {b})</span>
            <span className="badge-corte eje-x">
              Corte X: {corteX !== null ? `(${corteX}, 0)` : 'Paralela'}
            </span>
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

        {/* Panel de Control de la Pendiente */}
        <div className="panel-control-pendiente">
          <div className="control-deslizador">
            <label className="etiqueta-control">
              Ajustar Pendiente (m): <strong>{pendienteJugador.toFixed(2)}</strong>
              {pendienteJugador < 0 && <span className="pista-inclinacion"> (Inclinación hacia abajo como en tu libreta)</span>}
              {pendienteJugador > 0 && <span className="pista-inclinacion"> (Inclinación hacia arriba)</span>}
            </label>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.25"
              value={pendienteJugador}
              onChange={(e) => setPendienteJugador(parseFloat(e.target.value))}
              disabled={disparando || juegoTerminado}
              className="deslizador-rango"
            />
            <div className="marcas-deslizador">
              <span>m = -4 (Decreciente empinada)</span>
              <span>m = 0 (Horizontal)</span>
              <span>m = +4 (Creciente)</span>
            </div>
          </div>

          <div className="botones-accion-juego">
            <button
              className="boton-disparar-laser"
              onClick={realizarDisparo}
              disabled={disparando || juegoTerminado}
            >
              <Zap size={20} /> ¡DISPARAR LÁSER!
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Fin de Partida */}
      {juegoTerminado && (
        <div className="capa-modal-fondo">
          <div className="tarjeta-modal-fin">
            <h3 className="titulo-fin-juego">
              {vidas > 0 ? '🎉 ¡Maestría en la Ecuación de la Recta!' : '💥 ¡La abeja escapó!'}
            </h3>
            <p className="descripcion-fin">
              {vidas > 0
                ? '¡Completaste los 5 niveles dominando la pendiente, la ordenada al origen y los cortes con los ejes exactamente como en clase!'
                : 'Se acabaron las vidas, pero la práctica analítica hace al maestro del CETIS 57.'}
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
