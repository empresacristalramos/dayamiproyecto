/**
 * Formulario de Autenticación Escolar (Registro e Inicio de Sesión)
 * Solicita: Nombre, Apellido, Nombre de Usuario (único) y Contraseña en texto plano.
 * Autora: Dayami Blanco Ramos - CETIS 57
 * Variables y funciones 100% en español.
 */

import React, { useState } from 'react';
import { User, KeyRound, Sparkles, AlertCircle, CheckCircle2, UserPlus, LogIn } from 'lucide-react';
import { registrarAlumno, iniciarSesionAlumno } from '../servicios/conexionSupabase';
import { reproducirSonidoBoton, reproducirSonidoAcierto, reproducirSonidoFallo } from '../servicios/motorSonido';

export default function FormularioAutenticacion({ alAutenticarCorrectamente }) {
  const [esModoRegistro, setEsModoRegistro] = useState(true);

  // Estados del formulario en español
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
          alAutenticarCorrectamente(respuesta.usuario, true); // Es nuevo usuario -> mostrar intro de Dayami
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
      setMensajeError('Ocurrió un error inesperado. Intenta de nuevo.');
      reproducirSonidoFallo();
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="pantalla-autenticacion">
      <div className="tarjeta-formulario-autenticacion">
        {/* Encabezado con estética retro/neón */}
        <div className="encabezado-formulario">
          <div className="icono-grande-geomatrix">📐</div>
          <h1 className="titulo-geomatrix">GeoMatrix</h1>
          <p className="subtitulo-geomatrix">Batalla Analítica • CETIS 57</p>
          <div className="etiqueta-creadora">
            <Sparkles size={14} /> Creado por: <strong>Dayami Blanco Ramos</strong>
          </div>
        </div>

        {/* Pestañas para alternar entre Registro e Inicio de Sesión */}
        <div className="pestanas-autenticacion">
          <button
            type="button"
            className={`pestana-auth ${esModoRegistro ? 'activa' : ''}`}
            onClick={() => cambiarModo(true)}
          >
            <UserPlus size={16} />
            <span>Crear Cuenta</span>
          </button>
          <button
            type="button"
            className={`pestana-auth ${!esModoRegistro ? 'activa' : ''}`}
            onClick={() => cambiarModo(false)}
          >
            <LogIn size={16} />
            <span>Iniciar Sesión</span>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarEnvio} className="cuerpo-formulario">
          {mensajeError && (
            <div className="alerta-error">
              <AlertCircle size={18} />
              <span>{mensajeError}</span>
            </div>
          )}

          {esModoRegistro && (
            <div className="fila-campos-doble">
              <div className="grupo-entrada">
                <label className="etiqueta-campo">Nombre:</label>
                <input
                  type="text"
                  className="entrada-texto"
                  placeholder="Ej. Carlos"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required={esModoRegistro}
                />
              </div>

              <div className="grupo-entrada">
                <label className="etiqueta-campo">Apellido:</label>
                <input
                  type="text"
                  className="entrada-texto"
                  placeholder="Ej. González"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required={esModoRegistro}
                />
              </div>
            </div>
          )}

          <div className="grupo-entrada">
            <label className="etiqueta-campo">
              <User size={15} /> Nombre de Usuario (Único):
            </label>
            <input
              type="text"
              className="entrada-texto"
              placeholder="Ej. carlitos_cetis57"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
          </div>

          <div className="grupo-entrada">
            <label className="etiqueta-campo">
              <KeyRound size={15} /> Contraseña:
            </label>
            <input
              type="text"
              className="entrada-texto"
              placeholder="Contraseña sencilla"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <span className="pista-campo">
              * Identificación escolar simple para que no olvides tu cuenta.
            </span>
          </div>

          <button
            type="submit"
            className="boton-enviar-formulario"
            disabled={cargando}
          >
            {cargando ? 'Cargando...' : esModoRegistro ? 'Registrarme y Jugar' : 'Entrar a Mi Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}

