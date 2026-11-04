/**
 * NotificadorEspia - Personaje sorpresa asomándose o cruzando
 * Sale cada 2 minutos durante la primera hora de sesión
 * Muestra a un personaje diferente al del usuario con frases divertidas
 * Diseñado para no estorbar en celulares ni en juegos activos
 * Autora: Dayami Blanco Ramos
 */

import React, { useState, useEffect } from 'react';
import { LISTA_PERSONAJES } from '../datos/personajesGeometricos';
import { FRASES_POR_PERSONAJE } from '../datos/frasesPersonajes';
import { X } from 'lucide-react';
import { reproducirSonidoBip } from '../servicios/motorSonido';

export default function NotificadorEspia({ avatarUsuarioId = 1 }) {
  const [notificacionActiva, setNotificacionActiva] = useState(null);
  const [animacionModo, setAnimacionModo] = useState('asomado'); // 'asomado' | 'cruzando' | 'arriba'

  useEffect(() => {
    // Control de la primera hora (60 minutos)
    const tiempoInicio = Date.now();
    const DURACION_UNA_HORA = 60 * 60 * 1000;

    const lanzarNotificacionAleatoria = () => {
      const tiempoTranscurrido = Date.now() - tiempoInicio;
      if (tiempoTranscurrido > DURACION_UNA_HORA) {
        return; // Terminó la primera hora
      }

      // Filtrar personajes para que NO sea el personaje que usa el usuario actual
      const personajesDisponibles = LISTA_PERSONAJES.filter(
        (p) => p.id !== Number(avatarUsuarioId)
      );

      if (personajesDisponibles.length === 0) return;

      const personajeElegido = personajesDisponibles[
        Math.floor(Math.random() * personajesDisponibles.length)
      ];

      const listaFrases = FRASES_POR_PERSONAJE[personajeElegido.id] || [
        "¡Psst! ¡La geometría mola un montón!",
        "¡Aquí ando espiando tus jugadas!"
      ];

      const fraseElegida = listaFrases[
        Math.floor(Math.random() * listaFrases.length)
      ];

      const modos = ['asomado', 'cruzando', 'arriba'];
      const modoElegido = modos[Math.floor(Math.random() * modos.length)];

      setAnimacionModo(modoElegido);
      setNotificacionActiva({
        personaje: personajeElegido,
        frase: fraseElegida
      });

      reproducirSonidoBip();

      // Desaparece automáticamente después de 7 segundos
      setTimeout(() => {
        setNotificacionActiva(null);
      }, 7000);
    };

    // Primera aparición rápida a los 15 segundos para que la vea en la demo
    const timerInicial = setTimeout(() => {
      lanzarNotificacionAleatoria();
    }, 15000);

    // Luego cada 2 minutos (120,000 ms)
    const intervalo = setInterval(() => {
      lanzarNotificacionAleatoria();
    }, 120000);

    return () => {
      clearTimeout(timerInicial);
      clearInterval(intervalo);
    };
  }, [avatarUsuarioId]);

  if (!notificacionActiva) return null;

  const { personaje, frase } = notificacionActiva;

  return (
    <div className={`contenedor-notificacion-espia modo-${animacionModo}`}>
      <div
        className="burbuja-espia"
        style={{
          borderColor: personaje.colorBorde,
          boxShadow: `0 4px 20px ${personaje.colorFondo}44`
        }}
      >
        <button
          className="boton-cerrar-espia"
          onClick={() => setNotificacionActiva(null)}
          aria-label="Cerrar notificación"
        >
          <X size={14} />
        </button>

        <div className="fila-contenido-espia">
          <div
            className="avatar-espia-circulo"
            style={{
              backgroundColor: personaje.colorFondo + '33',
              borderColor: personaje.colorBorde
            }}
          >
            <span className="simbolo-espia">{personaje.simbolo}</span>
          </div>

          <div className="texto-espia-bloque">
            <span className="nombre-espia" style={{ color: personaje.colorBorde }}>
              {personaje.nombre}
            </span>
            <p className="frase-espia">{frase}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

