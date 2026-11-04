/**
 * Selector de los 10 Personajes Geométricos Cómicos
 * Autora: Dayami Blanco Ramos - CETIS 57
 * Variables y funciones 100% en español.
 */

import React from 'react';
import { LISTA_PERSONAJES } from '../datos/personajesGeometricos';
import { Check, Sparkles } from 'lucide-react';
import { cambiarAvatarUsuario } from '../servicios/conexionSupabase';
import { reproducirSonidoAcierto, reproducirSonidoBoton } from '../servicios/motorSonido';

export default function SelectorPersonajes({ usuarioActual, alActualizarAvatar }) {
  const avatarSeleccionadoId = usuarioActual?.avatar_id || 1;

  const seleccionarPersonaje = async (personaje) => {
    reproducirSonidoBoton();
    if (personaje.id === avatarSeleccionadoId) return;

    reproducirSonidoAcierto();
    await cambiarAvatarUsuario(usuarioActual.id, personaje.id);
    alActualizarAvatar(personaje.id);
  };

  return (
    <div className="seccion-personajes">
      <div className="cabecera-seccion">
        <h2 className="titulo-seccion">
          <Sparkles size={24} className="icono-dorado" /> Elige tu Personaje Geométrico
        </h2>
        <p className="descripcion-seccion">
          Selecciona tu avatar favorito para competir en la tabla de clasificación de CETIS 57:
        </p>
      </div>

      <div className="rejilla-personajes">
        {LISTA_PERSONAJES.map((personaje) => {
          const estaActivo = personaje.id === avatarSeleccionadoId;

          return (
            <div
              key={personaje.id}
              className={`tarjeta-personaje ${estaActivo ? 'seleccionado' : ''}`}
              style={{
                borderColor: estaActivo ? personaje.colorBorde : 'rgba(255,255,255,0.1)',
                boxShadow: estaActivo ? `0 0 20px ${personaje.colorFondo}55` : 'none'
              }}
              onClick={() => seleccionarPersonaje(personaje)}
            >
              {estaActivo && (
                <div className="etiqueta-activo">
                  <Check size={14} /> Seleccionado
                </div>
              )}

              <div
                className="circulo-icono-personaje"
                style={{
                  backgroundColor: personaje.colorFondo + '22',
                  borderColor: personaje.colorBorde
                }}
              >
                <span className="simbolo-grande">{personaje.simbolo}</span>
              </div>

              <h3 className="nombre-personaje" style={{ color: personaje.colorBorde }}>
                {personaje.nombre}
              </h3>
              <span className="apodo-personaje">"{personaje.apodo}"</span>
              <p className="descripcion-personaje">{personaje.descripcion}</p>

              <button
                className={`boton-elegir-avatar ${estaActivo ? 'boton-elegido' : ''}`}
                style={{
                  backgroundColor: estaActivo ? personaje.colorBorde : 'transparent',
                  borderColor: personaje.colorBorde,
                  color: estaActivo ? '#fff' : personaje.colorBorde
                }}
              >
                {estaActivo ? 'En Uso' : 'Seleccionar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

