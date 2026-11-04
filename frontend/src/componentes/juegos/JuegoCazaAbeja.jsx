/**
 * Minijuego 1: "Caza la Abeja" (Optimizado, Visual, Claro y Seguro)
 * - Fondo en color pizarra suave (azul pizarra suave / lavanda oscura) con alto contraste.
 * - La Abeja siempre se mantiene dentro de los límites visuales visibles.
 * - Cañón rosa fijo en (0, b) sobre el Eje Y.
 * - Guía visual del láser que impacta si la línea cruza a la abeja.
 * - Validación y sanitización contra inyecciones / trampas en el front.
 * Autora: Dayami Blanco Ramos - CETIS 57
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Zap, RotateCcw, Award, CheckCircle2, Info, HelpCircle } from 'lucide-react';
import { reproducirSonidoLaser, reproducirSonidoAcierto, reproducirSonidoFallo, reproducirSonidoVictoria } from '../../servicios/motorSonido';
import { guardarPuntaje } from '../../servicios/conexionSupabase';

// Sanitización de seguridad contra valores alterados en la consola del navegador
function sanitizarNumero(valor, minimo, maximo, valorPorDefecto = 0) {
  const num = parseFloat(valor);
  if (isNaN(num) || !isFinite(num)) return valorPorDefecto;
  return Math.min(Math.max(num, minimo), maximo);
}

export default function JuegoCazaAbeja({ usuarioActual, alVolverAlMenu, alActualizarPuntajeGlobal }) {
  const [nivel, setNivel] = useState(1);
  const [datosNivel, setDatosNivel] = useState(null);
  const [pendienteJugador, setPendienteJugador] = useState(0);
  const [disparando, setDisparando] = useState(false);
  const [resultadoDisparo, setResultadoDisparo] = useState(null);
  const [puntajePartida, setPuntajePartida] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mostrarGuia, setMostrarGuia] = useState(false);

  const lienzoRef = useRef(null);

  // Generación segura del nivel garantizando que la abeja siempre esté dentro del lienzo
  const generarNivelSeguro = (numNivel) => {
    // Coordenadas acotadas para que NUNCA se salga del canvas
    const posiblesX = [-4, -3, -2, 2, 3, 4];
    const abejaX = posiblesX[Math.floor(Math.random() * posiblesX.length)];
    const canonB = Math.floor(Math.random() * 5) - 2; // b entre -2 y 2

    // Pendientes sencillas para que la abeja quede en Y entre -5 y 5
    const pendientesValidas = [-1.5, -1, -0.5, 0.5, 1, 1.5];
    const m = pendientesValidas[Math.floor(Math.random() * pendientesValidas.length)];
    const abejaY = Number((m * abejaX + canonB).toFixed(1));

    return {
      nivel: numNivel,
      canon: { x: 0, y: canonB },
      abeja: { x: abejaX, y: abejaY },
      pendienteEsperada: m,
      formula: `y = (${m})x + (${canonB})`
    };
  };

  useEffect(() => {
    const nuevo = generarNivelSeguro(nivel);
    setDatosNivel(nuevo);
    setPendienteJugador(0);
    setResultadoDisparo(null);
    setDisparando(false);
  }, [nivel]);

  const b = datosNivel?.canon.y ?? 0;
  const m = sanitizarNumero(pendienteJugador, -5, 5, 0);
  const corteX = m !== 0 ? Number((-b / m).toFixed(1)) : null;

  // Dibujado ultra nítido con fondo suave pizarra
  useEffect(() => {
    if (!datosNivel || !lienzoRef.current) return;

    const canvas = lienzoRef.current;
    const ctx = canvas.getContext('2d');
    const ancho = canvas.width;
    const alto = canvas.height;

    const centroX = ancho / 2;
    const centroY = alto / 2;
    const escala = 34; // Píxeles por unidad (amplio y claro)

    // 1. Fondo suave color Pizarra Lavanda / Azul Suave
    ctx.fillStyle = '#1e1b2e';
    ctx.fillRect(0, 0, ancho, alto);

    // 2. Cuadrícula suave y visible
    ctx.strokeStyle = '#2f2b48';
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

    // 3. Ejes Cartesianos destacados
    ctx.strokeStyle = '#60a5fa'; // Azul claro brillante
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centroY);
    ctx.lineTo(ancho, centroY);
    ctx.moveTo(centroX, 0);
    ctx.lineTo(centroX, alto);
    ctx.stroke();

    // Números de la cuadrícula
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = -7; i <= 7; i++) {
      if (i !== 0) {
        ctx.fillText(String(i), centroX + i * escala, centroY + 14);
        ctx.fillText(String(i), centroX - 14, centroY - i * escala);
      }
    }
    ctx.fillText('0', centroX - 10, centroY + 12);

    // 4. Rayo Láser / Recta y = mx + b
    const xMin = -9;
    const xMax = 9;
    const yMin = m * xMin + b;
    const yMax = m * xMax + b;

    const pX1 = centroX + xMin * escala;
    const pY1 = centroY - yMin * escala;
    const pX2 = centroX + xMax * escala;
    const pY2 = centroY - yMax * escala;

    ctx.strokeStyle = disparando
      ? resultadoDisparo === 'acierto' ? '#34d399' : '#f87171'
      : '#fbbf24'; // Amarillo ámbar visible
    ctx.lineWidth = disparando ? 5 : 2.5;
    ctx.setLineDash(disparando ? [] : [6, 4]);

    ctx.beginPath();
    ctx.moveTo(pX1, pY1);
    ctx.lineTo(pX2, pY2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. CAÑÓN FIJO en (0, b) sobre el Eje Y (Rosa Brillante)
    const canonPixelX = centroX;
    const canonPixelY = centroY - b * escala;

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(canonPixelX, canonPixelY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#ffe4e6';
    ctx.font = 'bold 12px system-ui';
    ctx.fillText(`Cañón (0, ${b})`, canonPixelX + 48, canonPixelY - 2);

    // 6. Corte en el Eje X (Punto Morado)
    if (corteX !== null && Math.abs(corteX) <= 8) {
      const cortePixelX = centroX + corteX * escala;
      const cortePixelY = centroY;

      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.arc(cortePixelX, cortePixelY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#e9d5ff';
      ctx.fillText(`(${corteX}, 0)`, cortePixelX, cortePixelY + 20);
    }

    // 7. LA ABEJITA (Siempre dentro y destacada con halo brillante)
    const abejaPixelX = centroX + datosNivel.abeja.x * escala;
    const abejaPixelY = centroY - datosNivel.abeja.y * escala;

    // Halo circular para verla al instante
    ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
    ctx.beginPath();
    ctx.arc(abejaPixelX, abejaPixelY, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Emoji de la abeja
    ctx.font = '26px system-ui';
    ctx.fillText('🐝', abejaPixelX, abejaPixelY);

    // Etiqueta clara del objetivo
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 12px system-ui';
    ctx.fillText(`Abeja (${datosNivel.abeja.x}, ${datosNivel.abeja.y})`, abejaPixelX, abejaPixelY - 26);

  }, [datosNivel, pendienteJugador, disparando, resultadoDisparo, corteX, b, m]);

  // Disparo con verificación precisa
  const realizarDisparo = async () => {
    if (disparando || juegoTerminado || !datosNivel) return;

    // Seguridad: sanitizar el valor ingresado
    const mSegura = sanitizarNumero(pendienteJugador, -5, 5, 0);
    setDisparando(true);
    reproducirSonidoLaser();

    // Verificación: ¿El rayo pasa por la coordenada de la abeja?
    // En x = abeja.x, la recta da y = m * abeja.x + b
    const yRayoEnAbeja = mSegura * datosNivel.abeja.x + datosNivel.canon.y;
    const diferenciaY = Math.abs(yRayoEnAbeja - datosNivel.abeja.y);

    // Tolerancia generosa de 0.35 para que el juego sea divertido y justo
    const esAcierto = diferenciaY <= 0.35;

    if (esAcierto) {
      setResultadoDisparo('acierto');
      reproducirSonidoAcierto();
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });

      const nuevosPuntos = puntajePartida + 150 * nivel;
      setPuntajePartida(nuevosPuntos);

      if (usuarioActual?.id) {
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
      }, 1200);
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
        }, 1200);
      }
    }
  };

  const reiniciarPartida = () => {
    setNivel(1);
    setVidas(3);
    setPuntajePartida(0);
    setJuegoTerminado(false);
  };

  return (
    <div className="contenedor-pantalla-juego">
      {/* Cabecera */}
      <div className="cabecera-juego">
        <button className="boton-volver" onClick={alVolverAlMenu}>
          <ArrowLeft size={18} /> Menú
        </button>

        <div className="info-juego-centro">
          <h2 className="titulo-minijuego">🐝 Caza la Abeja (Ecuación de la Recta)</h2>
          <span className="subtitulo-tema">Ajusta la inclinación de la línea para golpear el objetivo</span>
        </div>

        <div className="estadisticas-juego">
          <button
            className="boton-ayuda-guia"
            onClick={() => setMostrarGuia(!mostrarGuia)}
            title="¿Cómo funciona?"
          >
            <HelpCircle size={18} /> {mostrarGuia ? 'Ocultar Guía' : '¿Cómo se juega?'}
          </button>
          <span className="etiqueta-nivel">Nivel {nivel}/5</span>
          <span className="etiqueta-vidas">❤️ x {vidas}</span>
          <span className="etiqueta-puntos">🏆 {puntajePartida} pts</span>
        </div>
      </div>

      {/* Guía explicativa desplegable */}
      {mostrarGuia && (
        <div className="panel-explicacion-datos animacion-aparecer">
          <h4 className="titulo-guia"><Info size={16} /> ¿Qué representa cada punto en la pantalla?</h4>
          <ul className="lista-guia-datos">
            <li>🎯 <strong>Cañón Rosa (0, {b}):</strong> Es el punto fijo donde nace el láser (llamado <em>ordenada al origen</em> en tu libreta).</li>
            <li>🐝 <strong>Abeja ({datosNivel?.abeja.x}, {datosNivel?.abeja.y}):</strong> Es el objetivo cartesiano al que debes disparar.</li>
            <li>🟣 <strong>Punto Morado ({corteX ?? '—'}, 0):</strong> Es donde la línea cruza el suelo horizontal (Eje X).</li>
            <li>⚡ <strong>Tu Misión:</strong> Mueve el control de abajo hasta que la línea amarilla apunte directo hacia la abeja y dale a <strong>DISPARAR LÁSER</strong>.</li>
          </ul>
        </div>
      )}

      {/* Área interactiva */}
      <div className="area-interactiva-juego">
        {/* Marcador claro con datos analíticos */}
        <div className="marcador-formula-neon">
          <div className="bloque-datos-libreta">
            <span className="etiqueta-formula">Ecuación Actual:</span>
            <span className="texto-formula-dinamica">
              y = <strong className="resalte-pendiente">{m.toFixed(2)}</strong>x + ({b})
            </span>
          </div>

          <div className="bloque-intersecciones-libreta">
            <span className="badge-corte eje-y" title="Cañón fijo en el eje vertical">
              Cañón Eje Y: (0, {b})
            </span>
            <span className="badge-corte eje-x" title="Corte con el eje horizontal">
              Corte Eje X: {corteX !== null ? `(${corteX}, 0)` : 'Horizontal'}
            </span>
          </div>
        </div>

        {/* Canvas Cartesiano */}
        <div className="lienzo-contenedor">
          <canvas
            ref={lienzoRef}
            width={640}
            height={390}
            className="lienzo-cartesiano"
          />
        </div>

        {/* Panel de Controles */}
        <div className="panel-control-pendiente">
          <div className="control-deslizador">
            <div className="fila-etiqueta-control">
              <label className="etiqueta-control">
                Girar Inclinación / Pendiente (m): <strong className="valor-m-destacado">{m.toFixed(2)}</strong>
              </label>
              <span className="pista-inclinacion">
                {m < 0 ? '↘ Inclinada hacia abajo' : m > 0 ? '↗ Inclinada hacia arriba' : '— Línea Horizontal'}
              </span>
            </div>

            <input
              type="range"
              min="-4"
              max="4"
              step="0.25"
              value={pendienteJugador}
              onChange={(e) => setPendienteJugador(sanitizarNumero(e.target.value, -4, 4, 0))}
              disabled={disparando || juegoTerminado}
              className="deslizador-rango"
            />

            <div className="marcas-deslizador">
              <span>-4.0 (Muy inclinada abajo)</span>
              <span>0.0 (Plana)</span>
              <span>+4.0 (Muy inclinada arriba)</span>
            </div>
          </div>

          <button
            className="boton-disparar-laser"
            onClick={realizarDisparo}
            disabled={disparando || juegoTerminado}
          >
            <Zap size={20} /> ¡DISPARAR LÁSER!
          </button>
        </div>
      </div>

      {/* Modal de Fin de Partida */}
      {juegoTerminado && (
        <div className="capa-modal-fondo">
          <div className="tarjeta-modal-fin">
            <h3 className="titulo-fin-juego">
              {vidas > 0 ? '🎉 ¡Caza Exitosa!' : '💥 ¡La abeja escapó!'}
            </h3>
            <p className="descripcion-fin">
              {vidas > 0
                ? '¡Completaste todos los niveles acertando las pendientes y los cortes de la recta!'
                : 'Se terminaron las vidas. ¡Vuelve a intentarlo para superar tu récord!'}
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
