/**
 * Componente Principal de GeoMatrix
 * Autora: Dayami Blanco Ramos - CETIS 57
 * Variables y funciones 100% en español.
 */

import React, { useState, useEffect } from 'react';
import './estilos/juego.css';

// Componentes del sistema
import BarraNavegacion from './componentes/BarraNavegacion';
import FormularioAutenticacion from './componentes/FormularioAutenticacion';
import ModalBienvenidaDayami from './componentes/ModalBienvenidaDayami';
import MenuJuegos from './componentes/MenuJuegos';
import SelectorPersonajes from './componentes/SelectorPersonajes';
import TablaClasificacion from './componentes/TablaClasificacion';

// Los 4 Minijuegos de Geometría Analítica
import JuegoCazaAbeja from './componentes/juegos/JuegoCazaAbeja';
import JuegoPuntoMedio from './componentes/juegos/JuegoPuntoMedio';
import JuegoRadarDistancia from './componentes/juegos/JuegoRadarDistancia';
import JuegoViasParalelas from './componentes/juegos/JuegoViasParalelas';

// Servicios
import {
  obtenerSesionLocal,
  cerrarSesionLocal,
  marcarIntroVista
} from './servicios/conexionSupabase';
import { reproducirSonidoBoton } from './servicios/motorSonido';

export default function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [vistaActual, setVistaActual] = useState('menu_juegos');
  const [mostrarIntroDayami, setMostrarIntroDayami] = useState(false);

  // Cargar sesión persistente al abrir la página
  useEffect(() => {
    const usuarioGuardado = obtenerSesionLocal();
    if (usuarioGuardado) {
      setUsuarioActual(usuarioGuardado);
      if (!usuarioGuardado.has_seen_intro) {
        setMostrarIntroDayami(true);
      }
    }
  }, []);

  const manejarAutenticacion = (usuario, debeMostrarIntro = false) => {
    setUsuarioActual(usuario);
    setVistaActual('menu_juegos');
    if (debeMostrarIntro || !usuario.has_seen_intro) {
      setMostrarIntroDayami(true);
    }
  };

  const manejarCerrarIntro = async () => {
    setMostrarIntroDayami(false);
    if (usuarioActual) {
      await marcarIntroVista(usuarioActual.id);
      setUsuarioActual((prev) => (prev ? { ...prev, has_seen_intro: true } : prev));
    }
  };

  const manejarCerrarSesion = () => {
    reproducirSonidoBoton();
    cerrarSesionLocal();
    setUsuarioActual(null);
    setVistaActual('menu_juegos');
    setMostrarIntroDayami(false);
  };

  const manejarActualizarAvatar = (nuevoAvatarId) => {
    setUsuarioActual((prev) => (prev ? { ...prev, avatar_id: nuevoAvatarId } : prev));
  };

  const manejarActualizarPuntajeGlobal = (puntosGanados) => {
    setUsuarioActual((prev) => (
      prev ? { ...prev, puntos_totales: (prev.puntos_totales || 0) + puntosGanados } : prev
    ));
  };

  // 1. Si no hay usuario activo, mostrar pantalla de registro / inicio de sesión
  if (!usuarioActual) {
    return <FormularioAutenticacion alAutenticarCorrectamente={manejarAutenticacion} />;
  }

  // 2. Pantalla principal del videojuego
  return (
    <div className="aplicacion-geomatrix">
      {/* Barra superior de navegación */}
      <BarraNavegacion
        usuarioActual={usuarioActual}
        vistaActual={vistaActual}
        alCambiarVista={setVistaActual}
        alCerrarSesion={manejarCerrarSesion}
      />

      {/* Contenido dinámico según la vista seleccionada */}
      <main className="area-principal-contenido">
        {vistaActual === 'menu_juegos' && (
          <MenuJuegos alSeleccionarJuego={(idJuego) => setVistaActual(idJuego)} />
        )}

        {vistaActual === 'personajes' && (
          <SelectorPersonajes
            usuarioActual={usuarioActual}
            alActualizarAvatar={manejarActualizarAvatar}
          />
        )}

        {vistaActual === 'clasificacion' && <TablaClasificacion />}

        {/* Minijuego 1: Caza la Abeja (Pendiente) */}
        {vistaActual === 'caza_abeja' && (
          <JuegoCazaAbeja
            usuarioActual={usuarioActual}
            alVolverAlMenu={() => setVistaActual('menu_juegos')}
            alActualizarPuntajeGlobal={manejarActualizarPuntajeGlobal}
          />
        )}

        {/* Minijuego 2: Rescate en el Punto Medio */}
        {vistaActual === 'punto_medio' && (
          <JuegoPuntoMedio
            usuarioActual={usuarioActual}
            alVolverAlMenu={() => setVistaActual('menu_juegos')}
            alActualizarPuntajeGlobal={manejarActualizarPuntajeGlobal}
          />
        )}

        {/* Minijuego 3: Radar de Distancia Cósmica */}
        {vistaActual === 'radar' && (
          <JuegoRadarDistancia
            usuarioActual={usuarioActual}
            alVolverAlMenu={() => setVistaActual('menu_juegos')}
            alActualizarPuntajeGlobal={manejarActualizarPuntajeGlobal}
          />
        )}

        {/* Minijuego 4: Vías Paralelas vs Perpendiculares */}
        {vistaActual === 'vias' && (
          <JuegoViasParalelas
            usuarioActual={usuarioActual}
            alVolverAlMenu={() => setVistaActual('menu_juegos')}
            alActualizarPuntajeGlobal={manejarActualizarPuntajeGlobal}
          />
        )}
      </main>

      {/* Modal de Bienvenida e Introducción presentado por el avatar de Dayami */}
      {mostrarIntroDayami && (
        <ModalBienvenidaDayami alCerrarIntro={manejarCerrarIntro} />
      )}
    </div>
  );
}
