# 📐 GeoMatrix: Batalla Analítica
**Videojuego Web Educativo de Geometría Analítica**  
**Institución:** CETIS No. 57 (Estado de México)  
**Semestre:** 3er Semestre de Bachillerato Tecnológico (DGETI)  
**Autora:** Dayami Blanco Ramos  
**Metodología:** Spec-Driven Development (SDD)  

---

## 🎮 Acerca del Proyecto
**GeoMatrix** es un videojuego web arcade diseñado para aprender y repasar los temas centrales de Geometría Analítica del CETIS 57 de forma visual e intuitiva (¡sin cuestionarios aburridos!).

### 🕹️ Los 4 Minijuegos Incluidos:
1. **🐝 Caza la Abeja (Pendiente y Recta):** Homenaje didáctico al profesor. Ajusta la pendiente ($m$) y la ordenada al origen ($b$) para disparar un rayo láser que neutralice a la abeja en el plano cartesiano.
2. **🎯 Rescate en el Punto Medio:** Encuentra visualmente el centro de gravedad del segmento entre dos estaciones ($M = \frac{x_1+x_2}{2}, \frac{y_1+y_2}{2}$) antes de que colapse el puente.
3. **🛰️ Radar de Distancia Cósmica:** Analiza las coordenadas de tres amenazas espaciales y detecta a toda velocidad cuál está más cerca de la base usando la distancia euclidiana ($d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$).
4. **⚡ Vías Paralelas vs Perpendiculares:** Salva al tren de descarrilar eligiendo la inclinación correcta: paralelas ($m_1 = m_2$) o perpendiculares ($m_1 \cdot m_2 = -1$).

---

## 👥 10 Personajes Geométricos Cómicos:
* El Triángulo Bélico, Don Círculo Mareado, La Parábola Rebelde, El Cuadrado Cuadrado, El Rombo Fresa, El Trapecio Fitness, Doña Hipérbola Dramática, El Vector Veloz, El Punto Perdido y La Abeja del Profe.

---

## 🚀 Cómo Ejecutar el Proyecto en tu Computadora

### 1. Iniciar la Pantalla Web (Frontend - React + Vite)
Abre una terminal y ejecuta:
```bash
cd frontend
npm install
npm run dev
```
Abre en tu navegador la dirección que te indique (por ejemplo: `http://localhost:5173`).

### 2. Iniciar el Servidor de Cálculo (Backend - Python FastAPI)
En otra terminal ejecuta:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:aplicacion --reload --port 8000
```

---

## ☁️ Guía de Despliegue en la Nube

### Paso 1: Configurar Supabase
1. Entra a tu cuenta en [supabase.com](https://supabase.com) y crea un nuevo proyecto (ej. `geomatrix-db`).
2. En el menú izquierdo ve a **SQL Editor**.
3. Abre el archivo `supabase/schema.sql`, copia todo su contenido y pégalo en el editor de Supabase.
4. Presiona el botón verde **Run**. ¡Tus tablas de alumnos y puntajes ya están listas!
5. En la configuración de tu proyecto en Supabase (**Project Settings > API**), copia:
   - `Project URL`
   - `anon public key`
6. En tu carpeta `frontend`, crea un archivo llamado `.env` con esas claves:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase_aqui
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
   ```

### Paso 2: Subir a GitHub
Inicia el repositorio y súbelo a tu cuenta de GitHub:
```bash
git init
git add .
git commit -m "GeoMatrix v1.0 - Proyecto de Geometria Analitica por Dayami Blanco Ramos"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/GeoMatrix.git
git push -u origin main
```

### Paso 3: Desplegar la Pantalla en Vercel
1. Entra a [vercel.com](https://vercel.com) con tu cuenta de GitHub.
2. Haz clic en **Add New Project** y selecciona tu repositorio `GeoMatrix`.
3. En **Root Directory**, selecciona la carpeta `frontend`.
4. En **Environment Variables**, añade:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Haz clic en **Deploy**. ¡En 30 segundos tendrás un enlace web público para compartirlo con tu hermana, amigos y profesor!

### Paso 4: Desplegar el API en Render
1. Entra a [render.com](https://render.com).
2. Haz clic en **New > Web Service** y conecta tu repositorio `GeoMatrix`.
3. Configura:
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:aplicacion --host 0.0.0.0 --port $PORT`
4. Haz clic en **Create Web Service**.

