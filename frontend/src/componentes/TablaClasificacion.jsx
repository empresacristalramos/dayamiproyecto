/**
 * Tabla de Clasificación Escolar (Leaderboard)
 * Muestra a los mejores jugadores y récords de CETIS 57
 * Autora: Dayami Blanco Ramos
 * Variables y funciones 100% en español.
 */

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Flame, RefreshCw } from 'lucide-react';
import { obtenerClasificacion } from '../servicios/conexionSupabase';
import { reproducirSonidoBoton } from '../servicios/motorSonido';

export default function TablaClasificacion() {
  const [filtroJuego, setFiltroJuego] = useState('todos');
  const [listaPuntajes, setListaPuntajes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async (juego = null) => {
    setCargando(true);
    const resultado = await obtenerClasificacion(juego === 'todos' ? null : juego);
    setListaPuntajes(resultado || []);
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos(filtroJuego);
  }, [filtroJuego]);

  const cambiarFiltro = (nuevoFiltro) => {
    reproducirSonidoBoton();
    setFiltroJuego(nuevoFiltro);
  };

  const formatearNombreJuego = (idJuego) => {
    switch (idJuego) {
      case 'caza_abeja': return '🐝 Caza la Abeja';
      case 'punto_medio': return '🎯 Punto Medio';
      case 'radar': return '🛰️ Radar Cósmico';
      case 'vias': return '⚡ Vías Paralelas';
      default: return '🎮 Juego Arcade';
    }
  };

  return (
    <div className="seccion-clasificacion">
      <div className="cabecera-seccion">
        <h2 className="titulo-seccion">
          <Trophy size={26} className="icono-dorado" /> Tabla de Récords Escolares
        </h2>
        <p className="descripcion-seccion">
          Los mejores promedios y puntuaciones en Geometría Analítica de CETIS 57:
        </p>
      </div>

      {/* Botones de filtro por minijuego */}
      <div className="barra-filtros-clasificacion">
        {[
          { id: 'todos', etiqueta: '🏆 Todos los Juegos' },
          { id: 'caza_abeja', etiqueta: '🐝 Caza la Abeja' },
          { id: 'punto_medio', etiqueta: '🎯 Punto Medio' },
          { id: 'radar', etiqueta: '🛰️ Radar Cósmico' },
          { id: 'vias', etiqueta: '⚡ Vías' }
        ].map((f) => (
          <button
            key={f.id}
            className={`boton-filtro-score ${filtroJuego === f.id ? 'activo' : ''}`}
            onClick={() => cambiarFiltro(f.id)}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      {/* Tabla con diseño de podio */}
      <div className="tarjeta-tabla-scores">
        {cargando ? (
          <div className="cargando-tabla">
            <RefreshCw className="animacion-girar" size={24} />
            <p>Consultando récords en Supabase...</p>
          </div>
        ) : listaPuntajes.length === 0 ? (
          <div className="sin-registros-tabla">
            <p>Aún no hay récords guardados en este juego.</p>
            <p className="subtexto-sin-registros">¡Sé el primer alumno en imponer una marca legendaria!</p>
          </div>
        ) : (
          <div className="contenedor-filas-clasificacion">
            {listaPuntajes.map((item, indice) => {
              const posicion = indice + 1;
              const esOro = posicion === 1;
              const esPlata = posicion === 2;
              const esBronce = posicion === 3;

              return (
                <div
                  key={item.id || indice}
                  className={`fila-clasificacion ${esOro ? 'podio-oro' : esPlata ? 'podio-plata' : esBronce ? 'podio-bronce' : ''}`}
                >
                  <div className="columna-posicion">
                    {esOro && <Medal className="medalla medalla-oro" size={22} />}
                    {esPlata && <Medal className="medalla medalla-plata" size={22} />}
                    {esBronce && <Medal className="medalla medalla-bronce" size={22} />}
                    {!esOro && !esPlata && !esBronce && <span className="numero-posicion">#{posicion}</span>}
                  </div>

                  <div className="columna-jugador">
                    <span className="nombre-jugador-score">{item.username}</span>
                    <span className="etiqueta-juego-score">{formatearNombreJuego(item.juego_id)} (Nivel {item.nivel})</span>
                  </div>

                  <div className="columna-puntos">
                    <span className="puntos-valor">
                      <Flame size={16} className="icono-fuego" /> {item.puntaje} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

