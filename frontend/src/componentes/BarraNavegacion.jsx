/**
 * Barra de Navegación Superior
 * Autora: Dayami Blanco Ramos - CETIS 57
 * Variables y funciones 100% en español.
 */

import React from 'react';
import { Gamepad2, Users, Trophy, LogOut, Sparkles } from 'lucide-react';
import { obtenerPersonajePorId } from '../datos/personajesGeometricos';
import { reproducirSonidoBoton } from '../servicios/motorSonido';

export default function BarraNavegacion({
  usuarioActual,
  vistaActual,
  alCambiarVista,
  alCerrarSesion
}) {
  const personaje = obtenerPersonajePorId(usuarioActual?.avatar_id || 1);

  const cambiarPestana = (nuevaVista) => {
    reproducirSonidoBoton();
    alCambiarVista(nuevaVista);
  };

  return (
    <header className="barra-superior">
      <div className="contenedor-barra">
        {/* Logotipo y Título del Proyecto */}
        <div className="bloque-marca" onClick={() => cambiarPestana('menu_juegos')}>
          <div className="icono-marca">
            <span role="img" aria-label="Logo">📐</span>
          </div>
          <div>
            <h1 className="titulo-marca">GeoMatrix</h1>
            <span className="subtitulo-autora">Por: Dayami Blanco Ramos • CETIS 57</span>
          </div>
        </div>

        {/* Botones de Navegación */}
        <nav className="enlaces-navegacion">
          <button
            className={`boton-nav ${vistaActual === 'menu_juegos' ? 'activo' : ''}`}
            onClick={() => cambiarPestana('menu_juegos')}
          >
            <Gamepad2 size={18} />
            <span>Juegos</span>
          </button>

          <button
            className={`boton-nav ${vistaActual === 'personajes' ? 'activo' : ''}`}
            onClick={() => cambiarPestana('personajes')}
          >
            <Users size={18} />
            <span>Personajes</span>
          </button>

          <button
            className={`boton-nav ${vistaActual === 'clasificacion' ? 'activo' : ''}`}
            onClick={() => cambiarPestana('clasificacion')}
          >
            <Trophy size={18} />
            <span>Récords</span>
          </button>
        </nav>

        {/* Perfil del Alumno Actual */}
        <div className="bloque-perfil-usuario">
          <div
            className="ficha-avatar-activo"
            style={{ borderColor: personaje.colorBorde, backgroundColor: personaje.colorFondo + '22' }}
            title={`Personaje: ${personaje.nombre}`}
            onClick={() => cambiarPestana('personajes')}
          >
            <span className="simbolo-avatar">{personaje.simbolo}</span>
            <div className="datos-alumno">
              <span className="nombre-alumno">
                {usuarioActual?.nombre || usuarioActual?.username}
              </span>
              <span className="puntos-alumno">
                <Sparkles size={12} /> {usuarioActual?.puntos_totales || 0} pts
              </span>
            </div>
          </div>

          <button
            className="boton-cerrar-sesion"
            title="Cerrar sesión"
            onClick={alCerrarSesion}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

