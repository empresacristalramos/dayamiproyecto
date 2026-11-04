/**
 * Servicio de Generación y Validación de Geometría Analítica
 * Implementa las fórmulas del temario oficial de CETIS 57 (DGETI)
 * Autora: Dayami Blanco Ramos
 * 100% en español.
 */

// ====================================================================
// 1. MINIJUEGO 1: CAZA LA ABEJA (Ecuación de la Recta y Pendiente)
// ====================================================================
export function generarNivelAbeja(numeroNivel = 1) {
  const limiteCoordenada = 3 + Math.min(numeroNivel, 4);
  
  // Coordenada X diferente de 0
  let abejaX = 0;
  while (abejaX === 0) {
    abejaX = Math.floor(Math.random() * (limiteCoordenada * 2 + 1)) - limiteCoordenada;
  }
  
  // Ordenada al origen del cañón (eje Y)
  const canonB = Math.floor(Math.random() * 7) - 3; // Entre -3 y 3
  
  // Pendientes pedagógicas sencillas
  const pendientesPosibles = [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5];
  const pendienteElegida = pendientesPosibles[Math.floor(Math.random() * pendientesPosibles.length)];
  
  // Posición Y de la abeja
  const abejaY = Number((pendienteElegida * abejaX + canonB).toFixed(1));
  const pendienteExacta = Number(((abejaY - canonB) / abejaX).toFixed(2));

  return {
    nivel: numeroNivel,
    canon: { x: 0, y: canonB },
    abeja: { x: abejaX, y: abejaY },
    pendienteEsperada: pendienteExacta,
    textoEcuacion: `y = (${pendienteExacta})x + (${canonB})`,
    pista: `Alinea el rayo desde (0, ${canonB}) hasta la abeja en (${abejaX}, ${abejaY})`
  };
}

export function verificarDisparoAbeja(canonB, abejaX, abejaY, pendienteJugador, tolerancia = 0.28) {
  const pendienteReal = (abejaY - canonB) / abejaX;
  const diferencia = Math.abs(pendienteJugador - pendienteReal);
  return {
    acierto: diferencia <= tolerancia,
    pendienteReal: Number(pendienteReal.toFixed(2)),
    diferencia: Number(diferencia.toFixed(3))
  };
}

// ====================================================================
// 2. MINIJUEGO 2: RESCATE EN EL PUNTO MEDIO (Coordenadas)
// ====================================================================
export function generarNivelPuntoMedio(numeroNivel = 1) {
  const dispersion = 2 + numeroNivel;
  const x1 = Math.floor(Math.random() * (dispersion * 2 + 1)) - dispersion;
  const y1 = Math.floor(Math.random() * (dispersion * 2 + 1)) - dispersion;

  const desplazamientos = numeroNivel <= 2 ? [-4, -2, 2, 4] : [-5, -3, 3, 5];
  const dx = desplazamientos[Math.floor(Math.random() * desplazamientos.length)];
  const dy = desplazamientos[Math.floor(Math.random() * desplazamientos.length)];

  const x2 = x1 + dx;
  const y2 = y1 + dy;

  const medioX = Number(((x1 + x2) / 2).toFixed(2));
  const medioY = Number(((y1 + y2) / 2).toFixed(2));

  return {
    nivel: numeroNivel,
    puntoA: { x: x1, y: y1 },
    puntoB: { x: x2, y: y2 },
    puntoMedioExacto: { x: medioX, y: medioY },
    pista: `Calcula el centro entre A(${x1}, ${y1}) y B(${x2}, ${y2})`
  };
}

export function verificarPuntoMedio(x1, y1, x2, y2, jugadorX, jugadorY, tolerancia = 0.8) {
  const exactoX = (x1 + x2) / 2;
  const exactoY = (y1 + y2) / 2;
  const distanciaError = Math.sqrt(Math.pow(jugadorX - exactoX, 2) + Math.pow(jugadorY - exactoY, 2));

  return {
    acierto: distanciaError <= tolerancia,
    puntoExacto: { x: Number(exactoX.toFixed(2)), y: Number(exactoY.toFixed(2)) },
    distanciaError: Number(distanciaError.toFixed(2))
  };
}

// ====================================================================
// 3. MINIJUEGO 3: RADAR DE DISTANCIA CÓSMICA
// ====================================================================
export function generarNivelRadar(numeroNivel = 1) {
  const base = { x: 0, y: 0 };
  const amenazas = [];
  const nombres = ["Asteroide Alfa", "Sonda Espacial Beta", "Cometa Gamma"];
  const colores = ["#f87171", "#fbbf24", "#38bdf8"];

  const rango = 4 + numeroNivel;
  for (let i = 0; i < 3; i++) {
    let px = Math.floor(Math.random() * (rango * 2 + 1)) - rango;
    let py = Math.floor(Math.random() * (rango * 2 + 1)) - rango;
    if (px === 0 && py === 0) px = 3;

    const distancia = Number(Math.sqrt(px * px + py * py).toFixed(2));
    amenazas.push({
      id: i + 1,
      nombre: nombres[i],
      color: colores[i],
      x: px,
      y: py,
      distancia: distancia
    });
  }

  const ordenadas = [...amenazas].sort((a, b) => a.distancia - b.distancia);
  const masCercana = ordenadas[0];

  return {
    nivel: numeroNivel,
    base: base,
    amenazas: amenazas,
    idMasCercana: masCercana.id,
    nombreMasCercana: masCercana.nombre,
    distanciaMinima: masCercana.distancia
  };
}

// ====================================================================
// 4. MINIJUEGO 4: VÍAS PARALELAS Y PERPENDICULARES
// ====================================================================
export function generarNivelVias(numeroNivel = 1) {
  const pendientesCatalogo = [
    { m: 1.0, perp: -1.0, texto: "1", textoPerp: "-1" },
    { m: 2.0, perp: -0.5, texto: "2", textoPerp: "-1/2 (-0.5)" },
    { m: 0.5, perp: -2.0, texto: "1/2 (0.5)", textoPerp: "-2" },
    { m: -1.0, perp: 1.0, texto: "-1", textoPerp: "1" },
    { m: -2.0, perp: 0.5, texto: "-2", textoPerp: "1/2 (0.5)" },
    { m: 3.0, perp: -0.33, texto: "3", textoPerp: "-1/3" },
  ];

  const seleccion = pendientesCatalogo[Math.floor(Math.random() * pendientesCatalogo.length)];
  const modo = Math.random() > 0.5 ? "paralela" : "perpendicular";

  const pendienteRequerida = modo === "paralela" ? seleccion.m : seleccion.perp;
  const instruccion = modo === "paralela"
    ? `¡Alerta de Colisión! Elige la vía PARALELA con pendiente m = ${seleccion.texto}`
    : `¡Freno de Emergencia! Cruza una vía PERPENDICULAR a m = ${seleccion.texto}`;

  const opciones = Array.from(new Set([
    seleccion.m,
    seleccion.perp,
    Number((seleccion.m + 1.5).toFixed(2)),
    Number((seleccion.perp - 1.0).toFixed(2))
  ])).slice(0, 4);

  // Barajar opciones
  opciones.sort(() => Math.random() - 0.5);

  return {
    nivel: numeroNivel,
    pendientePrincipal: seleccion.m,
    modo: modo,
    pendienteRequerida: pendienteRequerida,
    instruccion: instruccion,
    opciones: opciones
  };
}

