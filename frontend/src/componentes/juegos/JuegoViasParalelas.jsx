/**
 * Minijuego 4: "Vías Paralelas vs Perpendiculares"
 * Tema: Relación entre rectas paralelas (m1 = m2) y perpendiculares (m1 * m2 = -1)
 * Autora: Dayami Blanco Ramos - CETIS 57
 * Variables y funciones 100% en español.
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, GitCommit, RotateCcw, Award, CheckCircle2, AlertOctagon, TrainTrack } from 'lucide-react';
import { generarNivelVias } from '../../servicios/servicioMatematico';
import { reproducirSonidoAcierto, reproducirSonidoFallo, reproducirSonidoVictoria, reproducirSonidoBoton } from '../../servicios/motorSonido';
import { guardarPuntaje } from '../../servicios/conexionSupabase';

export default function JuegoViasParalelas({ usuarioActual, alVolverAlMenu, alActualizarPuntajeGlobal }) {
  const [nivel, setNivel] = useState(1);
  const [datosNivel, setDatosNivel] = useState(null);
  const [opcionElegida, setOpcionElegida] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [puntajePartida, setPuntajePartida] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const lienzoRef = useRef(null);

  useEffect(() => {
    cargarNuevoNivel(nivel);
  }, [nivel]);

  const cargarNuevoNivel = (numNivel) => {
    const nuevo = generarNivelVias(numNivel);
    setDatosNivel(nuevo);
    setOpcionElegida(null);
    setResultado(null);
  };

  // Renderizar las vías en el canvas
  useEffect(() => {
    if (!datosNivel || !lienzoRef.current) return;

    const canvas = lienzoRef.current;
    const ctx = canvas.getContext('2d');
    const ancho = canvas.width;
    const alto = canvas.height;

    const centroX = ancho / 2;
    const centroY = alto / 2;
    const escala = 26;

    // Fondo nocturno de vías
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, ancho, alto);

    // Ejes tenues
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centroY);
    ctx.lineTo(ancho, centroY);
    ctx.moveTo(centroX, 0);
    ctx.lineTo(centroX, alto);
    ctx.stroke();

    // Dibujar Vía Principal (Recta con pendiente m1)
    const m1 = datosNivel.pendientePrincipal;
    const b1 = -1; // Ordenada para la vía 1

    const x1 = -8;
    const x2 = 8;
    const y1 = m1 * x1 + b1;
    const y2 = m1 * x2 + b1;

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(centroX + x1 * escala, centroY - y1 * escala);
    ctx.lineTo(centroX + x2 * escala, centroY - y2 * escala);
    ctx.stroke();

    // Etiqueta de la vía principal
    ctx.fillStyle = '#67e8f9';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(
      `Vía Principal (m₁ = ${m1})`,
      centroX + x1 * escala + 10,
      centroY - y1 * escala - 12
    );

    // Dibujar la Vía Conectora (Si el usuario ya eligió una opción o muestra preliminar)
    const m2 = opcionElegida !== null ? opcionElegida : datosNivel.pendientePrincipal;
    const b2 = 1.5; // Ordenada para la vía 2

    const cx1 = -7;
    const cx2 = 7;
    const cy1 = m2 * cx1 + b2;
    const cy2 = m2 * cx2 + b2;

    ctx.strokeStyle = resultado
      ? resultado.esCorrecta
        ? '#4ade80'
        : '#f87171'
      : '#facc15';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(centroX + cx1 * escala, centroY - cy1 * escala);
    ctx.lineTo(centroX + cx2 * escala, centroY - cy2 * escala);
    ctx.stroke();

    // Texto de la vía conectada
    ctx.fillStyle = '#fef08a';
    ctx.fillText(
      `Vía Seleccionada (m₂ = ${m2})`,
      centroX + cx2 * escala - 140,
      centroY - cy2 * escala - 10
    );

  }, [datosNivel, opcionElegida, resultado]);

  const seleccionarOpcionPendiente = async (valorPendiente) => {
    if (opcionElegida !== null || juegoTerminado) return;

    reproducirSonidoBoton();
    setOpcionElegida(valorPendiente);

    const esCorrecta = Math.abs(valorPendiente - datosNivel.pendienteRequerida) < 0.05;
    setResultado({ esCorrecta });

    if (esCorrecta) {
      reproducirSonidoAcierto();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });

      const nuevosPuntos = puntajePartida + 150 * nivel;
      setPuntajePartida(nuevosPuntos);

      if (usuarioActual) {
        await guardarPuntaje(usuarioActual.id, usuarioActual.username, 'vias', nivel, 150 * nivel);
        alActualizarPuntajeGlobal(150 * nivel);
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
          <h2 className="titulo-minijuego">⚡ Vías Paralelas vs Perpendiculares</h2>
          <span className="subtitulo-tema">Paralelas: m₁ = m₂ | Perpendiculares: m₁ · m₂ = -1</span>
        </div>
        <div className="estadisticas-juego">
          <span className="etiqueta-nivel">Nivel {nivel}/5</span>
          <span className="etiqueta-vidas">❤️ x {vidas}</span>
          <span className="etiqueta-puntos">🏆 {puntajePartida} pts</span>
        </div>
      </div>

      <div className="area-interactiva-juego">
        <div className="marcador-formula-neon">
          <div className="etiqueta-formula">Orden de la Estación:</div>
          <div className="texto-formula-dinamica">{datosNivel?.instruccion}</div>
        </div>

        <div className="lienzo-contenedor">
          <canvas
            ref={lienzoRef}
            width={620}
            height={380}
            className="lienzo-cartesiano"
          />
        </div>

        {/* Botones de opciones de pendientes */}
        <div className="panel-opciones-vias">
          <div className="etiqueta-elige-pendiente">Elige la pendiente (m₂) adecuada:</div>
          <div className="rejilla-botones-vias">
            {datosNivel?.opciones.map((mVal, i) => (
              <button
                key={i}
                className={`boton-opcion-via ${opcionElegida === mVal ? (resultado?.esCorrecta ? 'acierto' : 'error') : ''}`}
                onClick={() => seleccionarOpcionPendiente(mVal)}
                disabled={opcionElegida !== null || juegoTerminado}
              >
                m = {mVal}
              </button>
            ))}
          </div>
        </div>
      </div>

      {juegoTerminado && (
        <div className="capa-modal-fondo">
          <div className="tarjeta-modal-fin">
            <h3 className="titulo-fin-juego">
              {vidas > 0 ? '🚅 ¡Maquinista Analítico Supremo!' : '💥 ¡Descarrilamiento!'}
            </h3>
            <p className="descripcion-fin">
              {vidas > 0
                ? '¡Alineaste todas las vías paralelas y perpendiculares sin cometer un solo choque!'
                : 'La pendiente elegida no correspondía a la condición analítica. ¡Vuelve a intentarlo!'}
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

