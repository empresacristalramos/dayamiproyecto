/**
 * Modal de Presentación y Bienvenida
 * Presentado por el avatar de Dayami Blanco Ramos, creadora del juego.
 * Autora: Dayami Blanco Ramos - CETIS 57
 * Nombres de variables y funciones 100% en español.
 */

import React, { useState } from 'react';
import { Sparkles, Gamepad2, Heart, Award, ArrowRight } from 'lucide-react';
import { reproducirSonidoVictoria, reproducirSonidoBoton } from '../servicios/motorSonido';

export default function ModalBienvenidaDayami({ alCerrarIntro }) {
  const [pasoActual, setPasoActual] = useState(1);

  const avanzarPaso = () => {
    reproducirSonidoBoton();
    if (pasoActual < 2) {
      setPasoActual(pasoActual + 1);
    } else {
      reproducirSonidoVictoria();
      alCerrarIntro();
    }
  };

  return (
    <div className="capa-modal-fondo">
      <div className="tarjeta-modal-intro">
        {/* Encabezado con Avatar de la niña Dayami */}
        <div className="cabecera-avatar-dayami">
          <div className="circulo-avatar-ilustrado">
            <span className="icono-avatar-nina" role="img" aria-label="Niña creadora">
              👩‍🎓
            </span>
            <span className="insignia-creadora">Creadora</span>
          </div>
          <div>
            <h2 className="titulo-creadora">Dayami Blanco Ramos</h2>
            <p className="subtitulo-institucion">CETIS No. 57 • Geometría Analítica (3er Semestre)</p>
          </div>
        </div>

        {/* Contenido del Diálogo */}
        <div className="cuerpo-dialogo-intro">
          {pasoActual === 1 ? (
            <div className="globo-dialogo animacion-aparecer">
              <p className="parrafo-dialogo">
                ¡Hola a todos! Bienvenidos a <strong>GeoMatrix: Batalla Analítica</strong>.
              </p>
              <p className="parrafo-dialogo">
                Soy <strong>Dayami Blanco Ramos</strong> y construí este videojuego especialmente para dominar 
                los temas más importantes de nuestra materia de una manera súper divertida y visual:
              </p>
              <ul className="lista-caracteristicas-intro">
                <li>🐝 <strong>Caza la Abeja:</strong> Domina la pendiente y la recta disparando rayos láser como en el ejemplo del profe.</li>
                <li>🎯 <strong>Rescate en el Punto Medio:</strong> Encuentra el centro exacto antes de que se caiga el puente.</li>
                <li>🛰️ <strong>Radar Cósmico:</strong> Usa la distancia entre dos puntos para salvar la base.</li>
                <li>⚡ <strong>Vías Paralelas vs Perpendiculares:</strong> Salva al tren conectando los rieles con la inclinación adecuada.</li>
              </ul>
            </div>
          ) : (
            <div className="globo-dialogo animacion-aparecer">
              <div className="caja-chiste-profesor">
                <p className="texto-chiste-profesor">
                  "Y si quieren jugar... pues jueguen jaja, ¡es broma! <strong>Díganle al profesor que por favor me pase con 10</strong> por haber creado este juego con inteligencia artificial y metodología SDD. 😉"
                </p>
              </div>
              <p className="texto-consejo-inicio">
                Elige tu personaje geométrico favorito en tu perfil y compite por el primer lugar en la tabla de clasificación. ¡Que te diviertas!
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="pie-modal-intro">
          <div className="indicador-pasos">
            <span className={`punto-paso ${pasoActual === 1 ? 'activo' : ''}`}></span>
            <span className={`punto-paso ${pasoActual === 2 ? 'activo' : ''}`}></span>
          </div>

          <button className="boton-avanzar-intro" onClick={avanzarPaso}>
            {pasoActual === 1 ? (
              <>
                Siguiente <ArrowRight size={18} />
              </>
            ) : (
              <>
                ¡A Jugar! <Gamepad2 size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

