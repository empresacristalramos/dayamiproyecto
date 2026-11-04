/**
 * Minijuego 2: "Rescate en el Punto Medio"
 * Tema: Coordenadas del Punto Medio de un segmento.
 * Autora: Dayami Blanco Ramos - CETIS 57
 * Variables y funciones 100% en español.
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Target, RotateCcw, Award, CheckCircle2, Crosshair } from 'lucide-react';
import { generarNivelPuntoMedio, verificarPuntoMedio } from '../../servicios/servicioMatematico';
import { reproducirSonidoAcierto, reproducirSonidoFallo, reproducirSonidoVictoria, reproducirSonidoBip } from '../../servicios/motorSonido';
import { guardarPuntaje } from '../../servicios/conexionSupabase';

export default function JuegoPuntoMedio({ usuarioActual, alVolverAlMenu, alActualizarPuntajeGlobal }) {
  const [nivel, setNivel] = useState(1);
  const [datosNivel, setDatosNivel] = useState(null);
  const [puntoMarcado, setPuntoMarcado] = useState(null);
  const [resultadoIntento, setResultadoIntento] = useState(null);
  const [puntajePartida, setPuntajePartida] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const lienzoRef = useRef(null);

  useEffect(() => {
    cargarNuevoNivel(nivel);
  }, [nivel]);

  const cargarNuevoNivel = (numNivel) => {
    const nuevo = generarNivelPuntoMedio(numNivel);
    setDatosNivel(nuevo);
    setPuntoMarcado(null);
    setResultadoIntento(null);
  };

  // Renderizar el lienzo
  useEffect(() => {
    if (!datosNivel || !lienzoRef.current) return;

    const canvas = lienzoRef.current;
    const ctx = canvas.getContext('2d');
    const ancho = canvas.width;
    const alto = canvas.height;

    const centroX = ancho / 2;
    const centroY = alto / 2;
    const escala = 28;

    // Fondo oscuro espacial
    ctx.fillStyle = '#090d16';
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

    // Ejes Cartesianos
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centroY);
    ctx.lineTo(ancho, centroY);
    ctx.moveTo(centroX, 0);
    ctx.lineTo(centroX, alto);
    ctx.stroke();

    // Estaciones A y B
    const ax = centroX + datosNivel.puntoA.x * escala;
    const ay = centroY - datosNivel.puntoA.y * escala;
    const bx = centroX + datosNivel.puntoB.x * escala;
    const by = centroY - datosNivel.puntoB.y * escala;

    // Cable de energía entre A y B
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // Dibujar Estación A
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(ax, ay, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`A(${datosNivel.puntoA.x}, ${datosNivel.puntoA.y})`, ax + 12, ay - 6);

    // Dibujar Estación B
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(bx, by, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(`B(${datosNivel.puntoB.x}, ${datosNivel.puntoB.y})`, bx + 12, by - 6);

    // Si el jugador marcó un punto
    if (puntoMarcado) {
      const px = centroX + puntoMarcado.x * escala;
      const py = centroY - puntoMarcado.y * escala;

      ctx.fillStyle = resultadoIntento?.acierto ? '#4ade80' : '#f87171';
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(`Tú(${puntoMarcado.x.toFixed(1)}, ${puntoMarcado.y.toFixed(1)})`, px + 12, py + 16);
    }

    // Mostrar el punto medio exacto al resolver
    if (resultadoIntento) {
      const mx = centroX + datosNivel.puntoMedioExacto.x * escala;
      const my = centroY - datosNivel.puntoMedioExacto.y * escala;

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mx, my, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.fillText(
        `M Exacto(${datosNivel.puntoMedioExacto.x}, ${datosNivel.puntoMedioExacto.y})`,
        mx - 30,
        my - 18
      );
    }
  }, [datosNivel, puntoMarcado, resultadoIntento]);

  // Manejar clic en el canvas para soltar la cápsula en el punto medio
  const manejarClicLienzo = async (evento) => {
    if (resultadoIntento || juegoTerminado || !datosNivel) return;

    const canvas = lienzoRef.current;
    const rect = canvas.getBoundingClientRect();
    const clicX = evento.clientX - rect.left;
    const clicY = evento.clientY - rect.top;

    const centroX = canvas.width / 2;
    const centroY = canvas.height / 2;
    const escala = 28;

    const cartX = (clicX - centroX) / escala;
    const cartY = (centroY - clicY) / escala;

    setPuntoMarcado({ x: cartX, y: cartY });

    const verificacion = verificarPuntoMedio(
      datosNivel.puntoA.x,
      datosNivel.puntoA.y,
      datosNivel.puntoB.x,
      datosNivel.puntoB.y,
      cartX,
      cartY
    );

    setResultadoIntento(verificacion);

    if (verificacion.acierto) {
      reproducirSonidoAcierto();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });

      const nuevosPuntos = puntajePartida + 160 * nivel;
      setPuntajePartida(nuevosPuntos);

      if (usuarioActual) {
        await guardarPuntaje(usuarioActual.id, usuarioActual.username, 'punto_medio', nivel, 160 * nivel);
        alActualizarPuntajeGlobal(160 * nivel);
      }

      setTimeout(() => {
        if (nivel < 5) {
          setNivel(nivel + 1);
        } else {
          reproducirSonidoVictoria();
          setJuegoTerminado(true);
        }
      }, 1400);
    } else {
      reproducirSonidoFallo();
      const vidasRestantes = vidas - 1;
      setVidas(vidasRestantes);

      if (vidasRestantes <= 0) {
        setJuegoTerminado(true);
      } else {
        setTimeout(() => {
          setPuntoMarcado(null);
          setResultadoIntento(null);
        }, 1500);
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
          <h2 className="titulo-minijuego">🎯 Rescate en el Punto Medio</h2>
          <span className="subtitulo-tema">Fórmula: M = ((x1+x2)/2, (y1+y2)/2)</span>
        </div>
        <div className="estadisticas-juego">
          <span className="etiqueta-nivel">Nivel {nivel}/5</span>
          <span className="etiqueta-vidas">❤️ x {vidas}</span>
          <span className="etiqueta-puntos">🏆 {puntajePartida} pts</span>
        </div>
      </div>

      <div className="area-interactiva-juego">
        <div className="marcador-formula-neon">
          <div className="etiqueta-formula">Instrucción:</div>
          <div className="texto-formula-dinamica">
            Toca el cable en el <strong>puro centro</strong> entre A y B para soltar la cápsula de soporte.
          </div>
        </div>

        <div className="lienzo-contenedor">
          <canvas
            ref={lienzoRef}
            width={620}
            height={380}
            onClick={manejarClicLienzo}
            className="lienzo-cartesiano cursor-mira"
          />
        </div>

        <div className="panel-informacion-punto-medio">
          {resultadoIntento ? (
            <div className={`alerta-resultado ${resultadoIntento.acierto ? 'exito' : 'fallo'}`}>
              {resultadoIntento.acierto ? (
                <>
                  <CheckCircle2 size={20} />
                  <span>
                    ¡Precisión fantástica! El punto medio exacto es ({resultadoIntento.puntoExacto.x}, {resultadoIntento.puntoExacto.y}).
                  </span>
                </>
              ) : (
                <span>
                  Te desviaste por {resultadoIntento.distanciaError} unidades. El centro exacto era ({resultadoIntento.puntoExacto.x}, {resultadoIntento.puntoExacto.y}).
                </span>
              )}
            </div>
          ) : (
            <div className="pista-interactiva">
              <Crosshair size={18} /> Haz clic o toca en la pantalla donde calculas que está el centro del segmento.
            </div>
          )}
        </div>
      </div>

      {juegoTerminado && (
        <div className="capa-modal-fondo">
          <div className="tarjeta-modal-fin">
            <h3 className="titulo-fin-juego">
              {vidas > 0 ? '🏆 ¡Héroe del Punto Medio!' : '⚡ ¡El puente colapsó!'}
            </h3>
            <p className="descripcion-fin">
              {vidas > 0
                ? '¡Dominaste a la perfección el cálculo y la intuición visual del punto medio cartesiano!'
                : 'La cápsula no cayó en el centro. ¡Vuelve a intentarlo para salvar la estación!'}
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

