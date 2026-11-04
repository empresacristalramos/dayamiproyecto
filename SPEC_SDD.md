# Software Design Document (SDD) - GeoMatrix: Batalla Analítica
**Proyecto:** GeoMatrix - Videojuego Web Educativo de Geometría Analítica  
**Institución de Referencia:** CETIS No. 57 (Estado de México)  
**Nivel Académico:** 3er Semestre de Bachillerato Tecnológico (DGETI)  
**Materia:** Geometría Analítica  
**Autora y Diseñadora Líder:** Dayami Blanco Ramos  
**Metodología de Desarrollo:** Spec-Driven Development (SDD)  
**Versión del Documento:** 1.0.0  
**Fecha:** Noviembre 2026  

---

## 1. Resumen Ejecutivo y Objetivos del Proyecto

### 1.1 Propósito
**GeoMatrix: Batalla Analítica** es una aplicación web interactiva y gamificada diseñada para reforzar los conceptos fundamentales de Geometría Analítica cursados en el tercer semestre de los Centros de Estudios Tecnológicos Industrial y de Servicios (CETIS).

El videojuego sustituye los exámenes teóricos y cuestionarios tradicionales por **mecánicas arcade visuales e intuitivas**. Los jugadores aprenden e interiorizan conceptos matemáticos mediante la manipulación directa de elementos en el plano cartesiano, experimentando en tiempo real con pendientes, distancias, coordenadas y relaciones de paralelismo.

### 1.2 Objetivos Específicos
1. **Gamificación pedagógica:** Traducir los 4 núcleos temáticos de la DGETI en 4 minijuegos interactivos de reflejos y cálculo visual.
2. **Arquitectura desacoplada y escalable:** Separar la interfaz visual (React en Vercel), la validación matemática (Python en Render) y la persistencia de datos (Supabase).
3. **Experiencia de usuario accesible:** Cero barreras de entrada; registro simple sin requerir correos electrónicos reales, compatibilidad táctil (celulares y tabletas) y de escritorio.
4. **Identidad y personalización:** Sistema de selección con 10 avatares geométricos cómicos y módulo de bienvenida personalizado presentado por el avatar de la creadora, **Dayami Blanco Ramos**.

---

## 2. Alineación Curricular (Temario DGETI - 3er Semestre)

| Unidad Temática Oficial | Contenido Conceptual Clave | Minijuego Asociado | Mecánica Interactiva |
| :--- | :--- | :--- | :--- |
| **Unidad 2: La Línea Recta** | Ecuación $y = mx + b$, pendiente ($m$), ordenada al origen ($b$) | **Minijuego 1: "Caza la Abeja"** (Homenaje al Profesor) | Ajuste visual de la pendiente del cañón láser para alcanzar el objetivo móvil en $(x, y)$. |
| **Unidad 1: Sistemas de Coordenadas** | Punto medio de un segmento de recta: $M = \left(\frac{x_1+x_2}{2}, \frac{y_1+y_2}{2}\right)$ | **Minijuego 2: "Rescate en el Punto Medio"** | Cálculo y pulsación rápida en el centro de gravedad del segmento antes de que colapse la plataforma. |
| **Unidad 1: Sistemas de Coordenadas** | Distancia entre dos puntos: $d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$ | **Minijuego 3: "Radar de Distancia Cósmica"** | Detección por radar de la amenaza más próxima a la base cartesiana para activar defensas perimetrales. |
| **Unidad 2: La Línea Recta** | Rectas paralelas ($m_1 = m_2$) y perpendiculares ($m_1 \cdot m_2 = -1$) | **Minijuego 4: "Vías Paralelas vs Perpendiculares"** | Orientación reactiva de rieles para salvar el convoy: paralelismo para desvío y perpendicularidad para freno. |

---

## 3. Arquitectura del Sistema

```
                      +---------------------------------------+
                      |               CLIENTE                 |
                      |        Navegador Web / Celular        |
                      +-------------------+-------------------+
                                          |
                        HTTPS (Web / API) |
                                          v
        +---------------------------------+---------------------------------+
        |                                                                   |
        v                                                                   v
+-------------------------------+                         +-----------------------------------+
|     FRONTEND (Vercel)         |                         |        BACKEND (Render)           |
|  - React 18 + Vite            |   Validación Matemática |  - Python 3.11 + FastAPI          |
|  - Tailwind CSS + Lucide      |<----------------------->|  - Motor de coordenadas y curvas  |
|  - Web Audio API (Efectos)    |   (Lógica en tiempo real) |  - Cálculo analítico de precisión |
|  - HTML5 Canvas Interactivo   |                         +-----------------+-----------------+
+---------------+---------------+                                           |
                |                                                           |
                |                 Conexión REST / Directa                   |
                +-----------------------------------------------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |         BASE DE DATOS (Supabase)      |
                      |  - PostgreSQL en la Nube              |
                      |  - Tabla `profiles` (Usuarios)        |
                      |  - Tabla `scores` (Clasificación)     |
                      +---------------------------------------+
```

### 3.1 Componentes de Infraestructura
* **Frontend (Alojado en Vercel):** Single Page Application (SPA) construida con React y Vite. Prioriza un tiempo de carga inferior a 1 segundo, renderizado en canvas de 60 FPS y cero librerías pesadas.
* **Backend (Alojado en Render):** Microservicio en Python utilizando FastAPI. Gestiona las semillas de los niveles, las fórmulas analíticas de validación y la comunicación opcional de respaldo.
* **Base de Datos (Supabase):** Instancia Postgres para almacenar perfiles escolares y récord de puntos con soporte de lectura y escritura instantánea.

---

## 4. Modelo de Datos (Supabase)

### Tabla: `usuarios` (o `profiles`)
Almacena las credenciales simplificadas de los estudiantes del plantel para identificación rápida sin fricción.

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default `gen_random_uuid()` | Identificador universal único del usuario |
| `nombre` | `TEXT` | NOT NULL | Nombre real del alumno |
| `apellido` | `TEXT` | NOT NULL | Apellido del alumno |
| `username` | `TEXT` | UNIQUE, NOT NULL | Nombre de usuario único para inicio de sesión |
| `password` | `TEXT` | NOT NULL | Contraseña en texto plano (requisito escolar de auditoría) |
| `avatar_id` | `INTEGER` | DEFAULT 1 (Rango 1-10) | Identificador del personaje geométrico seleccionado |
| `has_seen_intro` | `BOOLEAN` | DEFAULT FALSE | Bandera para desplegar la bienvenida de Dayami una sola vez |
| `puntos_totales` | `INTEGER` | DEFAULT 0 | Sumatoria global de puntos obtenidos en todos los juegos |
| `created_at` | `TIMESTAMP` | DEFAULT `NOW()` | Fecha y hora de creación de la cuenta |

### Tabla: `puntajes_minijuegos`
| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `BIGSERIAL` | Primary Key | Identificador del registro |
| `user_id` | `UUID` | Foreign Key -> `usuarios.id` | Alumno que consiguió el récord |
| `juego_id` | `TEXT` | NOT NULL | Identificador (`caza_abeja`, `punto_medio`, `radar`, `vias`) |
| `nivel` | `INTEGER` | NOT NULL | Nivel superado (1 a 5) |
| `puntaje` | `INTEGER` | NOT NULL | Puntos alcanzados |
| `fecha` | `TIMESTAMP` | DEFAULT `NOW()` | Momento del récord |

---

## 5. Especificación Funcional de los Módulos

### 5.1 Módulo de Autenticación Escolar
* **Registro de Cuenta:** Formulario limpio con Nombre, Apellido, Nombre de Usuario (con validación de no repetición) y Contraseña.
* **Inicio de Sesión:** Validación directa contra Supabase por nombre de usuario y contraseña.
* **Persistencia Local:** La sesión se mantiene en el navegador mediante `localStorage` para que el alumno no deba reescribir sus datos si recarga la página.

### 5.2 Módulo de Bienvenida e Introducción (Onboarding)
Se activa únicamente la primera vez que un alumno ingresa a su cuenta (`has_seen_intro === false`).
* **Visual:** Modal cinemático animado con el avatar ilustrado de una estudiante con bata/mochila representativa de CETIS.
* **Guion del Personaje:**
  > *"¡Hola a todos! Mi nombre es **Dayami Blanco Ramos** y soy la creadora y arquitecta de **GeoMatrix**.*  
  > *En este juego pondrás a prueba tus reflejos con la geometría analítica del CETIS 57: dominarás pendientes, calcularás puntos medios y cazarás abejas traviesas...*  
  > *Y si quieren jugar... pues jueguen jaja, es broma, **¡diganle al profesor que por favor me pase!** 😉"*
* **Acción:** Botón *"¡Entendido, vamos a jugar!"* que actualiza `has_seen_intro = true` en la base de datos y desbloquea el menú principal.

### 5.3 Los 10 Avatares Geométricos Chuscos
1. **El Triángulo Bélico:** Con casco de combate verde, ojos concentrados y ángulo de $45^\circ$ listo para la acción.
2. **Don Círculo Mareado:** Espirales hipnóticas en los ojos por no tener vértices donde detenerse.
3. **La Parábola Rebelde:** Cresta punk morada que se abre hacia el infinito positivo.
4. **El Cuadrado Cuadrado:** Lentes de pasta, corbatín y regla T; estricto guardián de los cuatro ángulos rectos.
5. **El Rombo Fresa:** Lentes oscuros de sol, brillo dorado y actitud de estrella de pasarela.
6. **El Trapecio Fitness:** Cinta elástica en la frente, mancuernas y base mayor tonificada.
7. **Doña Hipérbola Dramática:** Lágrimas teatrales y dos ramas asíntotas que nunca logran juntarse.
8. **El Vector Veloz:** Flecha dinámica con zapatillas deportivas de carreras y propulsores.
9. **El Punto Perdido:** Lupa gigante y brújula buscando desesperadamente sus coordenadas $(0,0)$.
10. **La Abeja del Profe:** Con gafas de aviador vintage, zumbando sobre el plano cartesiano y presumiendo esquivar rectas.

---

## 6. Especificación de los 4 Minijuegos

### Minijuego 1: "Caza la Abeja" (Unidad: La Línea Recta)
* **Objetivo:** Destruir o atrapar a la abeja que flota en el plano antes de que pique.
* **Controles:** Deslizador o teclas arriba/abajo para graduar la pendiente $m$ (de $-5$ a $+5$) y la ordenada $b$.
* **Efecto Pedagógico:** En la esquina superior se dibuja la ecuación dinámica $y = (m)x + (b)$. El rayo láser se dispara trazando exactamente la recta analítica.
* **Dificultad Progresiva:** En niveles altos, la abeja se mueve en patrones oscilatorios.

### Minijuego 2: "Rescate en el Punto Medio" (Unidad: Coordenadas)
* **Objetivo:** Lanzar una boya de salvamento al punto equidistante exacto entre dos estaciones espaciales $(x_1, y_1)$ y $(x_2, y_2)$.
* **Controles:** El usuario da clic o toca sobre la barra tensada en la posición estimada del punto medio.
* **Tolerancia:** Nivel 1: $\pm 10\%$ de margen de error. Nivel 5: $\pm 2\%$ de margen de error.
* **Efecto:** Muestra la fórmula evaluada y desata destellos dorados al acertar con precisión quirúrgica.

### Minijuego 3: "Radar de Distancia Cósmica" (Unidad: Distancia entre puntos)
* **Objetivo:** Activar el domo protector en la dirección del asteroide que se encuentra a menor distancia de la torre central.
* **Mecánica:** Se presentan 3 coordenadas simultáneas. El jugador analiza visualmente la cuadrícula para seleccionar la más cercana en una ventana de 5 segundos.
* **Feedback:** El sistema proyecta la hipotenusa de Pitágoras mostrando la distancia euclidiana exacta calculada.

### Minijuego 4: "Vías Paralelas vs Perpendiculares" (Unidad: Posición relativa de rectas)
* **Objetivo:** Evitar que el vagón minero se descarrile al aproximarse a una bifurcación geométrica.
* **Mecánica:** Aparece una vía con pendiente conocida $m_1$. Si el semáforo exige *"Desvío Paralelo"*, el usuario debe alinear el riel con $m_2 = m_1$. Si exige *"Freno Perpendicular"*, el usuario debe cruzar el riel a $m_2 = -1/m_1$.
* **Feedback:** Efectos de chispas en los rieles y sonido de frenado de tren.

---

## 7. Efectos Audiovisuales y Rendimiento
* **Diseño Visual:** Estética *Cyber-Grid* oscura con acentos neón (cian, magenta, amarillo fósforo y verde lima), garantizando alto contraste y legibilidad.
* **Efectos de Partículas:** Explosiones de confeti y chispas geométricas renderizadas mediante funciones matemáticas directas en canvas o CSS liviano, sin sobrecargar la memoria del dispositivo.
* **Efectos Sonoros:** Generados mediante la **Web Audio API** nativa del navegador (beeps arcade, lásers de frecuencia senoidal, fanfarrias de victoria sintetizadas), eliminando la necesidad de descargar archivos MP3 pesados.

---

## 8. Plan de Despliegue y Pruebas
1. **Fase 1 (Estructura Local):** Inicialización de la aplicación React con Vite y motor de componentes.
2. **Fase 2 (Esquema Supabase):** Creación del script SQL para las tablas de usuarios y puntajes.
3. **Fase 3 (Integración de Juegos):** Implementación de los 4 lienzos de juego interactivos y los 10 avatares.
4. **Fase 4 (Microservicio Render):** Configuración del API Python con FastAPI para validación de niveles.
5. **Fase 5 (Despliegue Vercel & Render):** Configuración de variables de entorno y pruebas en línea desde dispositivos móviles y de escritorio.

