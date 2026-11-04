/**
 * Componente Principal de GeoMatrix
 * Autora: Dayami Blanco Ramos - CETIS 57
 * Con Capturador de Errores y Notificaciones Espía sorpresa
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
import NotificadorEspia from './componentes/NotificadorEspia';
import CapturadorErrores from './componentes/CapturadorErrores';

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

  useEffect(() => {
    try {
      const usuarioGuardado = obtenerSesionLocal();
      if (usuarioGuardado) {
        setUsuarioActual(usuarioGuardado);
        if (!usuarioGuardado.has_seen_intro) {
          setMostrarIntroDayami(true);
        }
      }
    } catch (e) {
      console.warn("Error cargando sesión:", e);
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

  // 1. Pantalla de inicio de sesión / registro con temática roja geométrica
  if (!usuarioActual) {
    return (
      <CapturadorErrores>
        <FormularioAutenticacion alAutenticarCorrectamente={manejarAutenticacion} />
      </CapturadorErrores>
    );
  }

  // 2. Pantalla principal del videojuego
  return (
    <CapturadorErrores>
      <div className="aplicacion-geomatrix">
        {/* Barra superior de navegación adaptada a móvil */}
        <BarraNavegacion
          usuarioActual={usuarioActual}
          vistaActual={vistaActual}
          alCambiarVista={setVistaActual}
          alCerrarSesion={manejarCerrarSesion}
        />

        {/* Notificaciones sorpresa de personajes asomándose cada 2 minutos */}
        <NotificadorEspia avatarUsuarioId={usuarioActual.avatar_id || 1} />

        {/* Contenido dinámico */}
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

          {vistaActual === 'caza_abeja' && (
            <JuegoCazaAbeja
              usuarioActual={usuarioActual}
              alVolverAlMenu={() => setVistaActual('menu_juegos')}
              alActualizarPuntajeGlobal={manejarActualizarPuntajeGlobal}
            />
          )}

          {vistaActual === 'punto_medio' && (
            <JuegoPuntoMedio
              usuarioActual={usuarioActual}
              alVolverAlMenu={() => setVistaActual('menu_juegos')}
              alActualizarPuntajeGlobal={manejarActualizarPuntajeGlobal}
            />
          )}

          {vistaActual === 'radar' && (
            <JuegoRadarDistancia
              usuarioActual={usuarioActual}
              alVolverAlMenu={() => setVistaActual('menu_juegos')}
              alActualizarPuntajeGlobal={manejarActualizarPuntajeGlobal}
            />
          )}

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
    </CapturadorErrores>
  );
}
