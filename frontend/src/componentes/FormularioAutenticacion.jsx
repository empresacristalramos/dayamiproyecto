/**
 * Formulario de Autenticación Escolar
 * Temática: Dayami Blanco Ramos - Estudiante de Prótesis Dental en CETIS 57
 * Ilustración SVG personalizada de la chica técnica en prótesis dental
 * con cubrebocas quirúrgico, cofia/bata y estilo profesional.
 * Autora: Dayami Blanco Ramos
 */

import React, { useState } from 'react';
import { User, KeyRound, Sparkles, AlertCircle, UserPlus, LogIn, Activity } from 'lucide-react';
import { registrarAlumno, iniciarSesionAlumno } from '../servicios/conexionSupabase';
import { reproducirSonidoBoton, reproducirSonidoAcierto, reproducirSonidoFallo } from '../servicios/motorSonido';

export default function FormularioAutenticacion({ alAutenticarCorrectamente }) {
  const [esModoRegistro, setEsModoRegistro] = useState(true);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);

  const cambiarModo = (modoRegistro) => {
    reproducirSonidoBoton();
    setEsModoRegistro(modoRegistro);
    setMensajeError('');
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setMensajeError('');

    if (!nombreUsuario.trim() || !contrasena.trim()) {
      setMensajeError('Por favor ingresa tu usuario y contraseña.');
      reproducirSonidoFallo();
      return;
    }

    if (esModoRegistro && (!nombre.trim() || !apellido.trim())) {
      setMensajeError('Por favor completa tu nombre y apellido.');
      reproducirSonidoFallo();
      return;
    }

    setCargando(true);

    try {
      if (esModoRegistro) {
        const respuesta = await registrarAlumno(nombre, apellido, nombreUsuario, contrasena);
        if (respuesta.exito) {
          reproducirSonidoAcierto();
          alAutenticarCorrectamente(respuesta.usuario, true);
        } else {
          reproducirSonidoFallo();
          setMensajeError(respuesta.mensaje || 'Error al registrar.');
        }
      } else {
        const respuesta = await iniciarSesionAlumno(nombreUsuario, contrasena);
        if (respuesta.exito) {
          reproducirSonidoAcierto();
          const esPrimeraVez = !respuesta.usuario.has_seen_intro;
          alAutenticarCorrectamente(respuesta.usuario, esPrimeraVez);
        } else {
          reproducirSonidoFallo();
          setMensajeError(respuesta.mensaje || 'Datos incorrectos.');
        }
      }
    } catch (error) {
      console.error("Error en autenticación:", error);
      setMensajeError('Ocurrió un error inesperado. Intenta de nuevo.');
      reproducirSonidoFallo();
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="pantalla-autenticacion-roja">
      {/* Fondo con figuras geométricas flotantes */}
      <div className="fondo-figuras-geometricas">
        <span className="figura-flotante f-triangulo">▲</span>
        <span className="figura-flotante f-circulo">●</span>
        <span className="figura-flotante f-cuadrado">■</span>
        <span className="figura-flotante f-rombo">◆</span>
        <span className="figura-flotante f-parabola">∪</span>
        <span className="figura-flotante f-abeja">🐝</span>
      </div>

      <div className="tarjeta-formulario-roja">
        {/* Cabecera con Avatar Ilustrado de la chica de Prótesis Dental */}
        <div className="encabezado-formulario-rojo">
          <div className="contenedor-avatar-protesis">
            {/* Ilustración SVG vectorizada de Dayami con cubrebocas y cofia clínica */}
            <svg viewBox="0 0 100 100" className="svg-avatar-protesis" width="80" height="80">
              <defs>
                <linearGradient id="gradPiel" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="gradCubrebocas" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* Círculo de fondo clínico */}
              <circle cx="50" cy="50" r="48" fill="#1e1b4b" stroke="#e11d48" strokeWidth="3" />

              {/* Cabello largo */}
              <path d="M 24 50 C 22 28, 78 28, 76 50 C 76 68, 78 78, 80 85 C 72 82, 68 70, 68 62 C 32 62, 28 82, 20 85 C 22 78, 24 68, 24 50 Z" fill="#261a15" />

              {/* Rostro */}
              <ellipse cx="50" cy="52" rx="22" ry="24" fill="url(#gradPiel)" />

              {/* Flequillo / Cabello frontal */}
              <path d="M 28 42 C 38 32, 62 32, 72 42 C 65 36, 35 36, 28 42 Z" fill="#382218" />

              {/* Ojos expresivos de concentración */}
              <ellipse cx="40" cy="46" rx="3.5" ry="4" fill="#1c1917" />
              <ellipse cx="60" cy="46" rx="3.5" ry="4" fill="#1c1917" />
              <circle cx="41.5" cy="44.5" r="1.3" fill="#ffffff" />
              <circle cx="61.5" cy="44.5" r="1.3" fill="#ffffff" />

              {/* Cejas estilizadas */}
              <path d="M 35 41 Q 40 38 45 40" stroke="#1c1917" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M 55 40 Q 60 38 65 41" stroke="#1c1917" strokeWidth="1.8" fill="none" strokeLinecap="round" />

              {/* Cubrebocas Quirúrgico Azul Clínico */}
              <path d="M 30 52 C 30 50, 70 50, 70 52 C 70 68, 62 76, 50 76 C 38 76, 30 68, 30 52 Z" fill="url(#gradCubrebocas)" stroke="#bae6fd" strokeWidth="1.2" />

              {/* Pliegues del cubrebocas */}
              <line x1="33" y1="58" x2="67" y2="58" stroke="#0369a1" strokeWidth="1" />
              <line x1="35" y1="65" x2="65" y2="65" stroke="#0369a1" strokeWidth="1" />

              {/* Elásticos del cubrebocas a las orejas */}
              <path d="M 30 54 Q 24 58 29 65" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />
              <path d="M 70 54 Q 76 58 71 65" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />

              {/* Insignia de instrumento / diente brillante */}
              <g transform="translate(62, 60) scale(0.28)">
                <path d="M12 2C8 2 5 5 5 9C5 12 7 15 8 18C9 21 10 23 12 23C14 23 15 21 16 18C17 15 19 12 19 9C19 5 16 2 12 2Z" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
              </g>

              {/* Cuello y bata blanca */}
              <path d="M 32 76 L 30 100 L 70 100 L 68 76 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
              <path d="M 44 76 L 50 86 L 56 76" stroke="#e11d48" strokeWidth="1.5" fill="none" />
            </svg>

            <span className="insignia-especialidad">
              <Activity size={12} /> Prótesis Dental • CETIS 57
            </span>
          </div>

          <h1 className="titulo-geomatrix-rojo">GeoMatrix</h1>
          <p className="subtitulo-institucion-rojo">Batalla de Geometría Analítica</p>

          <div className="etiqueta-creadora-roja">
            <Sparkles size={14} className="icono-brillo" />
            Creado por: <strong>Dayami Blanco Ramos</strong>
          </div>
        </div>

        {/* Pestañas Registro / Iniciar Sesión */}
        <div className="pestanas-autenticacion-rojas">
          <button
            type="button"
            className={`pestana-roja ${esModoRegistro ? 'activa' : ''}`}
            onClick={() => cambiarModo(true)}
          >
            <UserPlus size={16} />
            <span>Crear Cuenta</span>
          </button>
          <button
            type="button"
            className={`pestana-roja ${!esModoRegistro ? 'activa' : ''}`}
            onClick={() => cambiarModo(false)}
          >
            <LogIn size={16} />
            <span>Iniciar Sesión</span>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarEnvio} className="cuerpo-formulario-rojo">
          {mensajeError && (
            <div className="alerta-error-roja">
              <AlertCircle size={18} />
              <span>{mensajeError}</span>
            </div>
          )}

          {esModoRegistro && (
            <div className="fila-campos-doble-roja">
              <div className="grupo-entrada">
                <label className="etiqueta-campo-roja">Nombre:</label>
                <input
                  type="text"
                  className="entrada-texto-roja"
                  placeholder="Ej. Dayami"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required={esModoRegistro}
                />
              </div>

              <div className="grupo-entrada">
                <label className="etiqueta-campo-roja">Apellido:</label>
                <input
                  type="text"
                  className="entrada-texto-roja"
                  placeholder="Ej. Ramos"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required={esModoRegistro}
                />
              </div>
            </div>
          )}

          <div className="grupo-entrada">
            <label className="etiqueta-campo-roja">
              <User size={15} /> Nombre de Usuario:
            </label>
            <input
              type="text"
              className="entrada-texto-roja"
              placeholder="Ej. dayami_cetis57"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
          </div>

          <div className="grupo-entrada">
            <label className="etiqueta-campo-roja">
              <KeyRound size={15} /> Contraseña:
            </label>
            <input
              type="text"
              className="entrada-texto-roja"
              placeholder="Escribe tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <span className="pista-campo-roja">
              * Identificación escolar simple para que nunca la olvides.
            </span>
          </div>

          <button
            type="submit"
            className="boton-enviar-formulario-rojo"
            disabled={cargando}
          >
            {cargando ? 'Conectando con Supabase...' : esModoRegistro ? '¡Comenzar la Aventura!' : 'Entrar a Jugar'}
          </button>
        </form>
      </div>
    </div>
  );
}
