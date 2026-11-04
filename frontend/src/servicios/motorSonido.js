/**
 * Motor de Sonidos Arcade utilizando la Web Audio API nativa del navegador.
 * No requiere descargar archivos MP3 pesados, asegurando máxima fluidez y velocidad.
 * Autora: Dayami Blanco Ramos - CETIS 57
 * Nombres y funciones 100% en español.
 */

let contextoAudio = null;

function obtenerContextoAudio() {
  if (!contextoAudio) {
    const AudioContextClase = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClase) {
      contextoAudio = new AudioContextClase();
    }
  }
  if (contextoAudio && contextoAudio.state === 'suspended') {
    contextoAudio.resume();
  }
  return contextoAudio;
}

/**
 * Sonido de disparo láser para el juego de la abeja (ecuación de la recta)
 */
export function reproducirSonidoLaser() {
  try {
    const ctx = obtenerContextoAudio();
    if (!ctx) return;

    const oscilador = ctx.createOscillator();
    const ganancia = ctx.createGain();

    oscilador.type = 'sawtooth';
    oscilador.frequency.setValueAtTime(880, ctx.currentTime);
    oscilador.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.25);

    ganancia.gain.setValueAtTime(0.15, ctx.currentTime);
    ganancia.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    oscilador.connect(ganancia);
    ganancia.connect(ctx.destination);

    oscilador.start();
    oscilador.stop(ctx.currentTime + 0.25);
  } catch (error) {
    console.warn("Audio no disponible:", error);
  }
}

/**
 * Sonido agradable de acierto / objetivo alcanzado
 */
export function reproducirSonidoAcierto() {
  try {
    const ctx = obtenerContextoAudio();
    if (!ctx) return;

    const notas = [523.25, 659.25, 783.99, 1046.5]; // Do, Mi, Sol, Do alto
    notas.forEach((frecuencia, indice) => {
      const osc = ctx.createOscillator();
      const gan = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frecuencia, ctx.currentTime + indice * 0.06);

      gan.gain.setValueAtTime(0.12, ctx.currentTime + indice * 0.06);
      gan.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + indice * 0.06 + 0.18);

      osc.connect(gan);
      gan.connect(ctx.destination);

      osc.start(ctx.currentTime + indice * 0.06);
      osc.stop(ctx.currentTime + indice * 0.06 + 0.18);
    });
  } catch (error) {
    console.warn("Audio no disponible:", error);
  }
}

/**
 * Sonido suave de error / fallo de cálculo
 */
export function reproducirSonidoFallo() {
  try {
    const ctx = obtenerContextoAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gan = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.3);

    gan.gain.setValueAtTime(0.2, ctx.currentTime);
    gan.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gan);
    gan.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (error) {
    console.warn("Audio no disponible:", error);
  }
}

/**
 * Sonido de celebración y victoria de nivel
 */
export function reproducirSonidoVictoria() {
  try {
    const ctx = obtenerContextoAudio();
    if (!ctx) return;

    const melodia = [
      { f: 523.25, t: 0.0 }, // C5
      { f: 659.25, t: 0.12 }, // E5
      { f: 783.99, t: 0.24 }, // G5
      { f: 1046.5, t: 0.36 }, // C6
    ];

    melodia.forEach((nota) => {
      const osc = ctx.createOscillator();
      const gan = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(nota.f, ctx.currentTime + nota.t);

      gan.gain.setValueAtTime(0.18, ctx.currentTime + nota.t);
      gan.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + nota.t + 0.35);

      osc.connect(gan);
      gan.connect(ctx.destination);

      osc.start(ctx.currentTime + nota.t);
      osc.stop(ctx.currentTime + nota.t + 0.35);
    });
  } catch (error) {
    console.warn("Audio no disponible:", error);
  }
}

/**
 * Sonido sutil al presionar botones de la interfaz
 */
export function reproducirSonidoBoton() {
  try {
    const ctx = obtenerContextoAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gan = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);

    gan.gain.setValueAtTime(0.08, ctx.currentTime);
    gan.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gan);
    gan.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (error) {
    console.warn("Audio no disponible:", error);
  }
}

/**
 * Sonido bip para avisos o temporizadores
 */
export function reproducirSonidoBip() {
  reproducirSonidoBoton();
}

