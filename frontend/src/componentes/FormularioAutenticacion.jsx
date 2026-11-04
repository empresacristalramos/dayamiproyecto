/**
 * Formulario de Autenticación Escolar (Estilo Rojo Elegante & Femenino)
 * Diseño con figuras geométricas flotantes, fondo de contraste y tonos favoritos de Dayami
 * Adaptado a pantallas móviles de cualquier tamaño
 * Autora: Dayami Blanco Ramos - CETIS 57
 */

import React, { useState } from 'react';
import { User, KeyRound, Sparkles, AlertCircle, Heart, UserPlus, LogIn } from 'lucide-react';
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
      {/* Figuras geométricas flotantes decorativas en el fondo */}
      <div className="fondo-figuras-geometricas">
        <span className="figura-flotante f-triangulo">▲</span>
        <span className="figura-flotante f-circulo">●</span>
        <span className="figura-flotante f-cuadrado">■</span>
        <span className="figura-flotante f-rombo">◆</span>
        <span className="figura-flotante f-parabola">∪</span>
        <span className="figura-flotante f-estrella">✦</span>
        <span className="figura-flotante f-abeja">🐝</span>
      </div>

      <div className="tarjeta-formulario-roja">
        {/* Cabecera con bienvenida elegante y toques femeninos */}
        <div className="encabezado-formulario-rojo">
          <div className="insignia-corazon-creadora">
            <Heart size={14} fill="#f43f5e" color="#f43f5e" />
            <span>GeoMatrix • Edición Especial</span>
            <Heart size={14} fill="#f43f5e" color="#f43f5e" />
          </div>

          <h1 className="titulo-geomatrix-rojo">GeoMatrix</h1>
          <p className="subtitulo-institucion-rojo">CETIS No. 57 • Geometría Analítica</p>

          <div className="etiqueta-creadora-roja">
            <Sparkles size={14} className="icono-brillo" />
            Creado por: <strong>Dayami Blanco Ramos</strong>
          </div>
        </div>

        {/* Pestañas Registro / Login */}
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
              placeholder="Escribe una contraseña sencilla"
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
