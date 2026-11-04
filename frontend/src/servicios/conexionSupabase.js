/**
 * Conexión y Gestión de Base de Datos Supabase (con respaldo LocalStorage)
 * Permite registrar alumnos de CETIS 57, iniciar sesión y guardar puntajes.
 * Autora: Dayami Blanco Ramos
 * 100% en español.
 */

import { createClient } from '@supabase/supabase-js';

// Lectura de variables de entorno (configuradas en Vercel o en archivo .env local)
const urlSupabase = import.meta.env.VITE_SUPABASE_URL || '';
const claveAnonSupabase = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Inicializar cliente Supabase solo si existen credenciales válidas
export const clienteSupabase = (urlSupabase && claveAnonSupabase)
  ? createClient(urlSupabase, claveAnonSupabase)
  : null;

const CLAVE_LOCAL_USUARIO = 'geomatrix_usuario_activo';
const CLAVE_LOCAL_USUARIOS_REGISTRADOS = 'geomatrix_alumnos_registrados';
const CLAVE_LOCAL_PUNTAJES = 'geomatrix_tabla_puntajes';

/**
 * Obtener lista de usuarios guardados localmente
 */
function obtenerUsuariosLocales() {
  try {
    const datos = localStorage.getItem(CLAVE_LOCAL_USUARIOS_REGISTRADOS);
    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
}

/**
 * Guardar lista de usuarios localmente
 */
function guardarUsuariosLocales(lista) {
  localStorage.setItem(CLAVE_LOCAL_USUARIOS_REGISTRADOS, JSON.stringify(lista));
}

/**
 * Registrar un nuevo alumno
 */
export async function registrarAlumno(nombre, apellido, username, password, avatarId = 1) {
  const usuarioLimpio = username.trim().toLowerCase();

  // 1. Intentar con Supabase si está conectado
  if (clienteSupabase) {
    try {
      // Verificar si ya existe el nombre de usuario
      const { data: usuarioExistente } = await clienteSupabase
        .from('usuarios')
        .select('id')
        .eq('username', usuarioLimpio)
        .maybeSingle();

      if (usuarioExistente) {
        return { exito: false, mensaje: "Ese nombre de usuario ya está en uso. ¡Elige otro!" };
      }

      const { data: nuevoUsuario, error } = await clienteSupabase
        .from('usuarios')
        .insert([
          {
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            username: usuarioLimpio,
            password: password,
            avatar_id: avatarId,
            has_seen_intro: false,
            puntos_totales: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;

      guardarSesionLocal(nuevoUsuario);
      return { exito: true, usuario: nuevoUsuario };
    } catch (error) {
      console.warn("Fallo conexión Supabase, usando respaldo local:", error);
    }
  }

  // 2. Respaldo LocalStorage (Garantiza que siempre funcione sin trabas)
  const usuariosLocales = obtenerUsuariosLocales();
  const existe = usuariosLocales.some((u) => u.username === usuarioLimpio);
  if (existe) {
    return { exito: false, mensaje: "Ese nombre de usuario ya está registrado en este navegador." };
  }

  const usuarioNuevo = {
    id: `alumno_${Date.now()}`,
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    username: usuarioLimpio,
    password: password,
    avatar_id: avatarId,
    has_seen_intro: false,
    puntos_totales: 0
  };

  usuariosLocales.push(usuarioNuevo);
  guardarUsuariosLocales(usuariosLocales);
  guardarSesionLocal(usuarioNuevo);

  return { exito: true, usuario: usuarioNuevo };
}

/**
 * Iniciar sesión con usuario y contraseña
 */
export async function iniciarSesionAlumno(username, password) {
  const usuarioLimpio = username.trim().toLowerCase();

  if (clienteSupabase) {
    try {
      const { data: usuario, error } = await clienteSupabase
        .from('usuarios')
        .select('*')
        .eq('username', usuarioLimpio)
        .eq('password', password)
        .maybeSingle();

      if (error) throw error;

      if (!usuario) {
        return { exito: false, mensaje: "Usuario o contraseña incorrectos." };
      }

      guardarSesionLocal(usuario);
      return { exito: true, usuario: usuario };
    } catch (error) {
      console.warn("Fallo conexión Supabase, intentando respaldo local:", error);
    }
  }

  // Respaldo local
  const usuariosLocales = obtenerUsuariosLocales();
  const coincidencia = usuariosLocales.find(
    (u) => u.username === usuarioLimpio && u.password === password
  );

  if (!coincidencia) {
    return { exito: false, mensaje: "Usuario o contraseña incorrectos." };
  }

  guardarSesionLocal(coincidencia);
  return { exito: true, usuario: coincidencia };
}

/**
 * Marcar que el usuario ya vio la introducción de Dayami
 */
export async function marcarIntroVista(usuarioId) {
  const usuarioActual = obtenerSesionLocal();
  if (usuarioActual && usuarioActual.id === usuarioId) {
    usuarioActual.has_seen_intro = true;
    guardarSesionLocal(usuarioActual);
  }

  if (clienteSupabase) {
    try {
      await clienteSupabase
        .from('usuarios')
        .update({ has_seen_intro: true })
        .eq('id', usuarioId);
    } catch (error) {
      console.warn("Error al actualizar intro en Supabase:", error);
    }
  }
}

/**
 * Cambiar el avatar del usuario
 */
export async function cambiarAvatarUsuario(usuarioId, nuevoAvatarId) {
  const usuarioActual = obtenerSesionLocal();
  if (usuarioActual && usuarioActual.id === usuarioId) {
    usuarioActual.avatar_id = nuevoAvatarId;
    guardarSesionLocal(usuarioActual);
  }

  if (clienteSupabase) {
    try {
      await clienteSupabase
        .from('usuarios')
        .update({ avatar_id: nuevoAvatarId })
        .eq('id', usuarioId);
    } catch (error) {
      console.warn("Error actualizando avatar:", error);
    }
  }
}

/**
 * Guardar puntaje de un minijuego
 */
export async function guardarPuntaje(usuarioId, username, juegoId, nivel, puntaje) {
  // Actualizar sesión local
  const usuarioActual = obtenerSesionLocal();
  if (usuarioActual) {
    usuarioActual.puntos_totales = (usuarioActual.puntos_totales || 0) + puntaje;
    guardarSesionLocal(usuarioActual);
  }

  if (clienteSupabase) {
    try {
      await clienteSupabase
        .from('puntajes_minijuegos')
        .insert([{
          user_id: usuarioId,
          username: username,
          juego_id: juegoId,
          nivel: nivel,
          puntaje: puntaje
        }]);

      // Incrementar puntos totales
      await clienteSupabase.rpc('incrementar_puntos', {
        id_usuario: usuarioId,
        cantidad: puntaje
      }).catch(() => {
        // Si no existe la función rpc, actualizar directamente
        clienteSupabase
          .from('usuarios')
          .update({ puntos_totales: (usuarioActual?.puntos_totales || puntaje) })
          .eq('id', usuarioId);
      });
    } catch (error) {
      console.warn("Error al guardar puntaje en Supabase:", error);
    }
  }

  // Guardar en tabla local
  try {
    const puntajesLocales = JSON.parse(localStorage.getItem(CLAVE_LOCAL_PUNTAJES) || '[]');
    puntajesLocales.push({
      id: Date.now(),
      username: username,
      juego_id: juegoId,
      nivel: nivel,
      puntaje: puntaje,
      fecha: new Date().toLocaleDateString()
    });
    localStorage.setItem(CLAVE_LOCAL_PUNTAJES, JSON.stringify(puntajesLocales));
  } catch (e) {
    console.warn("Error guardando puntaje local:", e);
  }
}

/**
 * Obtener la tabla de clasificación
 */
export async function obtenerClasificacion(juegoId = null) {
  if (clienteSupabase) {
    try {
      let consulta = clienteSupabase
        .from('puntajes_minijuegos')
        .select('*')
        .order('puntaje', { ascending: false })
        .limit(10);

      if (juegoId) {
        consulta = consulta.eq('juego_id', juegoId);
      }

      const { data, error } = await consulta;
      if (!error && data && data.length > 0) return data;
    } catch (error) {
      console.warn("No se pudo obtener tabla de Supabase, usando local:", error);
    }
  }

  try {
    const locales = JSON.parse(localStorage.getItem(CLAVE_LOCAL_PUNTAJES) || '[]');
    const filtrados = juegoId ? locales.filter(p => p.juego_id === juegoId) : locales;
    return filtrados.sort((a, b) => b.puntaje - a.puntaje).slice(0, 10);
  } catch {
    return [];
  }
}

// ====================================================================
// MANEJO DE SESIÓN LOCAL
// ====================================================================

export function guardarSesionLocal(usuario) {
  localStorage.setItem(CLAVE_LOCAL_USUARIO, JSON.stringify(usuario));
}

export function obtenerSesionLocal() {
  try {
    const str = localStorage.getItem(CLAVE_LOCAL_USUARIO);
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
}

export function cerrarSesionLocal() {
  localStorage.removeItem(CLAVE_LOCAL_USUARIO);
}

