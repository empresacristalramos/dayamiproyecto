"""
GeoMatrix: Batalla Analítica - Servidor API (Python / FastAPI)
CETIS No. 57 - Geometría Analítica (3er Semestre DGETI)
Autora: Dayami Blanco Ramos
Despliegue: Render
Todas las variables, funciones y rutas están en español para máxima claridad didáctica.
"""

import math
import random
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Inicialización de la aplicación FastAPI
aplicacion = FastAPI(
    title="GeoMatrix API - Servidor de Geometría Analítica",
    description="Motor de cálculo matemático y generador de niveles para GeoMatrix",
    version="1.0.0"
)

# Configuración de permisos CORS para comunicación con Vercel y pruebas locales
aplicacion.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@aplicacion.get("/")
def ruta_principal():
    return {
        "estado": "en_linea",
        "videojuego": "GeoMatrix: Batalla Analítica",
        "creadora": "Dayami Blanco Ramos",
        "escuela": "CETIS 57",
        "materia": "Geometría Analítica"
    }

@aplicacion.get("/api/salud")
def revision_salud():
    return {"estado": "correcto", "servicio": "Motor Matemático de Render Activo"}

# ====================================================================
# MODELOS DE DATOS PARA VALIDACIÓN (EN ESPAÑOL)
# ====================================================================

class VerificacionPendiente(BaseModel):
    canon_b: float
    objetivo_x: float
    objetivo_y: float
    pendiente_jugador: float
    tolerancia: float = 0.25

class VerificacionPuntoMedio(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float
    jugador_x: float
    jugador_y: float
    tolerancia: float = 0.5

class VerificacionDistancia(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float
    distancia_jugador: float
    tolerancia: float = 0.3

# ====================================================================
# GENERACIÓN DE NIVELES PARA LOS 4 MINIJUEGOS (EN ESPAÑOL)
# ====================================================================

@aplicacion.get("/api/niveles/caza-abeja/{nivel}")
def obtener_nivel_caza_abeja(nivel: int) -> Dict[str, Any]:
    """
    Minijuego 1: Ecuación de la recta y cálculo de pendiente (y = mx + b).
    Genera la posición de la abeja (x, y) y la ordenada al origen del cañón (0, b).
    """
    rango_coordenadas = 3 + min(nivel, 5)
    
    # Elegir coordenada X evitando el cero
    objetivo_x = random.choice([x for x in range(-rango_coordenadas, rango_coordenadas + 1) if x != 0])
    canon_b = random.randint(-4, 4)
    
    # Pendientes amigables y variadas
    pendientes_posibles = [-3, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 3]
    pendiente_elegida = random.choice(pendientes_posibles)
    objetivo_y = round(pendiente_elegida * objetivo_x + canon_b, 1)

    pendiente_exacta = (objetivo_y - canon_b) / objetivo_x

    return {
        "nivel": nivel,
        "canon": {"x": 0, "y": canon_b},
        "abeja": {"x": objetivo_x, "y": objetivo_y},
        "pendiente_esperada": round(pendiente_exacta, 2),
        "formula_texto": f"y = ({round(pendiente_exacta, 2)})x + ({canon_b})",
        "pista": f"Apunta la recta desde (0, {canon_b}) hasta la abeja en ({objetivo_x}, {objetivo_y})"
    }

@aplicacion.get("/api/niveles/punto-medio/{nivel}")
def obtener_nivel_punto_medio(nivel: int) -> Dict[str, Any]:
    """
    Minijuego 2: Coordenadas del Punto Medio.
    M = ((x1 + x2)/2, (y1 + y2)/2)
    """
    rango_dispersion = 2 + nivel
    x1 = random.randint(-rango_dispersion, rango_dispersion)
    y1 = random.randint(-rango_dispersion, rango_dispersion)
    
    # Para los niveles iniciales aseguramos números que den resultados enteros
    desplazamiento_x = random.choice([-4, -2, 2, 4]) if nivel <= 2 else random.randint(-6, 6)
    desplazamiento_y = random.choice([-4, -2, 2, 4]) if nivel <= 2 else random.randint(-6, 6)
    
    x2 = x1 + desplazamiento_x
    y2 = y1 + desplazamiento_y

    medio_x = round((x1 + x2) / 2.0, 2)
    medio_y = round((y1 + y2) / 2.0, 2)

    return {
        "nivel": nivel,
        "punto_a": {"x": x1, "y": y1},
        "punto_b": {"x": x2, "y": y2},
        "punto_medio": {"x": medio_x, "y": medio_y},
        "pista": f"El centro exacto entre ({x1}, {y1}) y ({x2}, {y2}) es ({medio_x}, {medio_y})"
    }

@aplicacion.get("/api/niveles/radar/{nivel}")
def obtener_nivel_radar(nivel: int) -> Dict[str, Any]:
    """
    Minijuego 3: Distancia euclidiana entre dos puntos.
    d = sqrt((x2 - x1)^2 + (y2 - y1)^2)
    """
    base_x, base_y = 0, 0
    lista_amenazas = []
    
    nombres_amenazas = ["Asteroide Alfa", "Sonda Espacial Beta", "Cometa Gamma"]
    for i in range(3):
        pos_x = random.randint(-8, 8)
        pos_y = random.randint(-8, 8)
        if pos_x == 0 and pos_y == 0:
            pos_x = 3
        distancia = round(math.sqrt(pos_x**2 + pos_y**2), 2)
        lista_amenazas.append({
            "id": i + 1,
            "nombre": nombres_amenazas[i],
            "x": pos_x,
            "y": pos_y,
            "distancia": distancia
        })

    amenazas_ordenadas = sorted(lista_amenazas, key=lambda elemento: elemento["distancia"])
    amenaza_mas_cercana = amenazas_ordenadas[0]

    return {
        "nivel": nivel,
        "base": {"x": base_x, "y": base_y},
        "amenazas": lista_amenazas,
        "id_amenaza_mas_cercana": amenaza_mas_cercana["id"],
        "nombre_amenaza_mas_cercana": amenaza_mas_cercana["nombre"],
        "distancia_minima": amenaza_mas_cercana["distancia"]
    }

@aplicacion.get("/api/niveles/vias/{nivel}")
def obtener_nivel_vias(nivel: int) -> Dict[str, Any]:
    """
    Minijuego 4: Rectas paralelas y perpendiculares.
    Paralelas: m2 = m1
    Perpendiculares: m1 * m2 = -1 => m2 = -1 / m1
    """
    pendientes_disponibles = [
        {"m": 1.0, "perp": -1.0, "texto": "1", "texto_perp": "-1"},
        {"m": 2.0, "perp": -0.5, "texto": "2", "texto_perp": "-1/2 (-0.5)"},
        {"m": 0.5, "perp": -2.0, "texto": "1/2 (0.5)", "texto_perp": "-2"},
        {"m": -1.0, "perp": 1.0, "texto": "-1", "texto_perp": "1"},
        {"m": -2.0, "perp": 0.5, "texto": "-2", "texto_perp": "1/2 (0.5)"},
    ]
    seleccion = random.choice(pendientes_disponibles)
    modo = random.choice(["paralela", "perpendicular"])

    if modo == "paralela":
        pendiente_requerida = seleccion["m"]
        instruccion = f"¡Alerta de Choque! Conecta una vía PARALELA con pendiente m = {seleccion['texto']}"
    else:
        pendiente_requerida = seleccion["perp"]
        instruccion = f"¡Freno de Emergencia! Cruza una vía PERPENDICULAR a m = {seleccion['texto']} (m = {seleccion['texto_perp']})"

    opciones = [seleccion["m"], seleccion["perp"], round(seleccion["m"] + 1, 1), round(seleccion["perp"] - 1, 1)]
    random.shuffle(opciones)

    return {
        "nivel": nivel,
        "pendiente_principal": seleccion["m"],
        "modo": modo,
        "pendiente_requerida": pendiente_requerida,
        "instruccion": instruccion,
        "opciones": list(set(opciones))[:4]
    }

# ====================================================================
# ENDPOINTS DE VERIFICACIÓN MATEMÁTICA
# ====================================================================

@aplicacion.post("/api/verificar/pendiente")
def verificar_pendiente(datos: VerificacionPendiente):
    pendiente_objetivo = (datos.objetivo_y - datos.canon_b) / datos.objetivo_x
    diferencia = abs(datos.pendiente_jugador - pendiente_objetivo)
    acierto = diferencia <= datos.tolerancia
    return {
        "acierto": acierto,
        "pendiente_jugador": datos.pendiente_jugador,
        "pendiente_exacta": round(pendiente_objetivo, 2),
        "diferencia": round(diferencia, 3)
    }

@aplicacion.post("/api/verificar/punto-medio")
def verificar_punto_medio(datos: VerificacionPuntoMedio):
    exacto_x = (datos.x1 + datos.x2) / 2.0
    exacto_y = (datos.y1 + datos.y2) / 2.0
    distancia_error = math.sqrt((datos.jugador_x - exacto_x)**2 + (datos.jugador_y - exacto_y)**2)
    acierto = distancia_error <= datos.tolerancia
    return {
        "acierto": acierto,
        "punto_medio_exacto": {"x": round(exacto_x, 2), "y": round(exacto_y, 2)},
        "punto_jugador": {"x": datos.jugador_x, "y": datos.jugador_y},
        "distancia_error": round(distancia_error, 3)
    }
