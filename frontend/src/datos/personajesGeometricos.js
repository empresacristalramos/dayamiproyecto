/**
 * Lista de los 10 personajes geométricos cómicos para GeoMatrix
 * Autora: Dayami Blanco Ramos - CETIS 57
 * Nombres y atributos 100% en español
 */

export const LISTA_PERSONAJES = [
  {
    id: 1,
    nombre: "El Triángulo Bélico",
    apodo: "Capitán Hipotenusa",
    descripcion: "Equipado con casco militar y un ángulo de 45° afilado. ¡Listo para defender el plano cartesiano!",
    colorFondo: "#10b981",
    colorBorde: "#059669",
    simbolo: "▲",
    forma: "triangulo"
  },
  {
    id: 2,
    nombre: "Don Círculo Mareado",
    apodo: "El Sin Vértices",
    descripcion: "Tiene espirales en los ojos de tanto girar sobre su radio y diámetro. ¡Nunca sabe dónde empieza!",
    colorFondo: "#3b82f6",
    colorBorde: "#2563eb",
    simbolo: "●",
    forma: "circulo"
  },
  {
    id: 3,
    nombre: "La Parábola Rebelde",
    apodo: "Cresta Infinita",
    descripcion: "Lleva una cresta punk morada que se abre hacia el infinito positivo. No cree en los límites del eje Y.",
    colorFondo: "#a855f7",
    colorBorde: "#9333ea",
    simbolo: "∪",
    forma: "parabola"
  },
  {
    id: 4,
    nombre: "El Cuadrado Cuadrado",
    apodo: "Profesor 90 Grados",
    descripcion: "Usa corbatín y regla T. Se estresa si un ángulo mide 89.9 grados; todo en su vida debe ser perfecto.",
    colorFondo: "#06b6d4",
    colorBorde: "#0891b2",
    simbolo: "■",
    forma: "cuadrado"
  },
  {
    id: 5,
    nombre: "El Rombo Fresa",
    apodo: "Diamante VIP",
    descripcion: "Lleva gafas de sol oscuras y bufanda cara. Solo se junta con diagonales mayores y menores exclusivas.",
    colorFondo: "#ec4899",
    colorBorde: "#db2777",
    simbolo: "◆",
    forma: "rombo"
  },
  {
    id: 6,
    nombre: "El Trapecio Fitness",
    apodo: "Musculoso Isósceles",
    descripcion: "Tiene banda elástica en la frente y mancuernas. Su rutina favorita: sentadillas sobre su base mayor.",
    colorFondo: "#f59e0b",
    colorBorde: "#d97706",
    simbolo: "⏢",
    forma: "trapecio"
  },
  {
    id: 7,
    nombre: "Doña Hipérbola Dramática",
    apodo: "La Incomprendida",
    descripcion: "Llora desconsolada con su pañuelo porque tiene dos ramas gemelas que jamás se podrán abrazar.",
    colorFondo: "#ef4444",
    colorBorde: "#dc2626",
    simbolo: ")(",
    forma: "hiperbola"
  },
  {
    id: 8,
    nombre: "El Vector Veloz",
    apodo: "Rayo con Tenis",
    descripcion: "Lleva tenis de carreras y un propulsor a chorro. Tiene magnitud, dirección, sentido y mucha prisa.",
    colorFondo: "#84cc16",
    colorBorde: "#65a30d",
    simbolo: "➔",
    forma: "vector"
  },
  {
    id: 9,
    nombre: "El Punto Perdido",
    apodo: "Buscador (0,0)",
    descripcion: "Es un puntito tierno con lupa gigante y brújula. Se desorientó en el cuadrante III y busca el origen.",
    colorFondo: "#64748b",
    colorBorde: "#475569",
    simbolo: "•",
    forma: "punto"
  },
  {
    id: 10,
    nombre: "La Abeja del Profe",
    apodo: "As de la Pendiente",
    descripcion: "Homenaje al dibujo del profesor de CETIS 57. Lleva gafas de piloto y presume esquivar ecuaciones de la recta.",
    colorFondo: "#eab308",
    colorBorde: "#ca8a04",
    simbolo: "🐝",
    forma: "abeja"
  }
];

export function obtenerPersonajePorId(idPersonaje) {
  return LISTA_PERSONAJES.find((p) => p.id === Number(idPersonaje)) || LISTA_PERSONAJES[0];
}

