// Datos extraídos de Atlas_Estelar_Completo.docx
const SYSTEMS = {
  mortaja: {
    name: 'Sistema Mortaja',
    starName: 'Sudario · estrella del sistema',
    starColor: 0x9fb4c8,
    starType: 'Enana fría, luz gris-azulada',
    mapPos: { x: 22, y: 32 },
    bodies: [
      {
        name: 'Venas Rojas', type: 'Mundo destruido · campo de escombros planetario', pop: 'Ver ficha completa',
        economia: '—', peculiaridad: 'Origen de los PJ · destruido hace generaciones, hoy un cúmulo de fragmentos que aún conserva forma esférica · ver sección "Mundos inhóspitos"',
        color: 0xb0453a, size: 0.34, orbit: 2.6, speed: 0.18, debris: true, detail: null
      },
      {
        name: 'Rescaldo', type: 'Puesto minero abandonado', pop: '~0',
        economia: 'Extracción de restos metálicos residuales, apoyo logístico a Herrumbre',
        peculiaridad: 'Dependencia total de Herrumbre para repuestos',
        enfermedades: 'Intoxicación por metales pesados',
        recurso: 'Chatarra procesada de baja calidad',
        color: 0x6b5e52, size: 0.26, orbit: 4.1, speed: 0.15, detail: null
      },
      {
        name: 'Herrumbre', type: 'Luna chatarrera de Sudario', pop: '~100',
        economia: 'Desguace de naves',
        peculiaridad: 'Única colonia tras la destrucción de Venas Rojas original',
        enfermedades: 'Cáncer por exposición a materiales tóxicos de desguace',
        recurso: 'Piezas de nave recuperadas',
        color: 0x9a5a34, size: 0.18, orbit: 1.05, speed: 0.5, parentIndex: 4, detail: 'mortaja/herrumbre/herrumbre_planeta.html'
      },
      {
        name: 'Hueso', type: 'Luna de Sudario · campo de trabajo funerario/arqueológico', pop: '~10',
        economia: 'Recolección de fragmentos óseo-minerales',
        peculiaridad: 'El nombre sugiere restos de algo mayor',
        enfermedades: 'Enfermedades respiratorias por polvo mineral',
        recurso: 'Mínimo, apenas de subsistencia',
        color: 0xcfc3ab, size: 0.13, orbit: 1.3, speed: 0.42, parentIndex: 4, detail: null
      },
      {
        name: 'Sudario', type: 'Gigante gaseoso con dos lunas', pop: '~100 (en una luna)',
        economia: 'Recolección de gas, desguace secundario',
        peculiaridad: 'Colonia marginal dependiente de rutas de paso',
        enfermedades: 'Atrofia muscular por gravedad baja',
        recurso: 'Gases industriales',
        color: 0x5c7a58, size: 0.62, orbit: 5.6, speed: 0.07, detail: null
      },
      {
        name: 'Letargo', type: 'Planeta helado con máquinas gigantes custodiándolo', pop: '0',
        economia: 'Sin información',
        peculiaridad: 'Sugiere que hay algo enterrado esperando a despertar',
        color: 0xc7d8dc, size: 0.3, orbit: 7.1, speed: 0.05, detail: null
      }
    ]
  },

  erosion: {
    name: 'Sistema Erosión',
    starName: 'Sol Óxido',
    starColor: 0xc46a3a,
    starType: 'Enana naranja en fase de enfriamiento, luz rojiza permanente',
    mapPos: { x: 62, y: 20 },
    bodies: [
      { name: 'Viento Rojo', type: 'Mundo de subsistencia', pop: 'Ver ficha completa', economia: '—', peculiaridad: 'Ver sección "Mundos de subsistencia"', color: 0xb5432c, size: 0.36, orbit: 2.3, speed: 0.17, detail: null },
      { name: 'Espina', type: 'Planeta rocoso, base minera colapsada, vertedero de los Barones', pop: '~4.000', economia: 'Recuperación de desechos tóxicos, "minería de basura"', peculiaridad: 'Literalmente viven de lo que otros tiran', enfermedades: 'Intoxicación crónica, cáncer, malformaciones congénitas', recurso: 'Metales recuperados de residuos', color: 0x8a6a4a, size: 0.34, orbit: 3.0, speed: 0.14, detail: null },
      { name: 'Yesca', type: 'Cantera de hierro (luna de Viento Rojo)', pop: '~6.000 esclavos en turnos', economia: 'Minería de hierro', peculiaridad: 'Mano de obra esclava permanente', enfermedades: 'Silicosis, agotamiento fatal', recurso: 'Hierro', color: 0x7a6656, size: 0.2, orbit: 3.6, speed: 0.13, detail: null },
      { name: 'El Cinturón Oxidado', type: 'Campo de asteroides', pop: '~1.000 flotante', economia: 'Pillaje, contrabando', peculiaridad: 'Sin autoridad ni ley reconocida', recurso: 'Bienes robados, mercancía de contrabando', color: 0x77726a, size: 0.24, orbit: 4.3, speed: 0.11, isBelt: true, detail: null },
      { name: 'Los Hermanos (Ceniciento)', type: 'Planeta enano + lunas Primo, Menor y Último', pop: '~1.500 en Ceniciento', economia: 'Minería mínima', peculiaridad: 'Solo el cuerpo mayor sostiene algo de vida', recurso: 'Minerales de baja calidad', color: 0x8f8378, size: 0.24, orbit: 5.0, speed: 0.095, detail: null },
      { name: 'Sepulcro', type: 'Planetoide cubierto de restos metálicos, cementerio de batalla', pop: '~500 saqueadores', economia: 'Saqueo de restos de guerra', peculiaridad: 'Tormentas EM propias, sin ley ni apoyo de ninguna facción', recurso: 'Tecnología y metal recuperados', color: 0x5f5a56, size: 0.26, orbit: 5.7, speed: 0.085, detail: null },
      { name: 'El Susurro', type: 'Asteroide con frecuencia de radio sin origen conocido, sagrado para los Faroleros', pop: '~300', economia: 'Prácticamente ninguna', peculiaridad: 'Escuchan la frecuencia como rito religioso', recurso: 'Ninguno', color: 0x6a5a7a, size: 0.16, orbit: 6.3, speed: 0.08, detail: null },
      { name: 'Forjafría', type: 'Planeta rocoso volcánico apagado, yacimientos tóxicos', pop: '~2.000', economia: 'Extracción tóxica de bajo rendimiento', peculiaridad: 'Nadie lo ha explotado con seguridad ni eficiencia', enfermedades: 'Envenenamiento por exposición prolongada', recurso: 'Minerales tóxicos de valor industrial', color: 0x704838, size: 0.3, orbit: 7.0, speed: 0.07, detail: null },
      { name: 'Descarte', type: 'Planeta enano helado, lugar de destierro', pop: '~2.500 exiliados', economia: 'Subsistencia mínima', peculiaridad: 'Literalmente el basurero social del sistema', enfermedades: 'Hipotermia, depresión endémica', color: 0xa8b8c0, size: 0.22, orbit: 7.7, speed: 0.06, detail: null },
      { name: 'Cuenca — el Reloj de Agua', type: 'Planeta enano, cráter de impacto, microatmósfera (Oasis fantasma)', pop: '~8.000', peculiaridad: 'Agua líquida transitoria diaria; vida sincronizada al "mediodía orbital"', color: 0x4a7a8c, size: 0.24, orbit: 8.4, speed: 0.055, detail: null },
      { name: 'Tajo', type: 'Asteroide alargado con fractura que "respira"', pop: '~400 puesto de escucha', economia: 'Señal/comunicaciones, apoyo a rutas de paso', peculiaridad: 'Chirrido metálico constante', color: 0x6e6a64, size: 0.14, orbit: 9.0, speed: 0.05, detail: null },
      { name: 'Tolvanera', type: 'Luna diminuta de Espina, nube de polvo, visibilidad cero', pop: '0 estable', peculiaridad: 'Inviable incluso para los más desesperados', color: 0x9a8a70, size: 0.1, orbit: 0.55, speed: 0.5, parentIndex: 1, detail: null },
      { name: 'El Manantial', type: 'Único oasis del sistema, fuente de agua líquida', pop: '~40.000', economia: 'Purificación de agua, agricultura protegida, tecnología limpia inmune a EMP', peculiaridad: 'Protegido de las tormentas EM por formación rocosa natural', recurso: 'Agua purificada, tecnología resistente a EMP', color: 0x3f8a7a, size: 0.32, orbit: 9.8, speed: 0.045, detail: null }
    ]
  },

  eden: {
    name: 'Sistema Edén',
    starName: 'Sol Manso',
    starColor: 0xf5d98a,
    starType: 'Enana amarilla estable, gemela de un sol terrestre',
    mapPos: { x: 44, y: 62 },
    bodies: [
      { name: 'Rocío', type: 'Planeta interior con tormenta de vapor gigante permanente', pop: '~200 (puesto científico)', economia: 'Monitorización, ninguna extracción real', peculiaridad: 'Mancha blanca fija visible desde Verdal', enfermedades: 'Aislamiento extremo', recurso: 'Datos meteorológicos', color: 0xd8ccc0, size: 0.26, orbit: 2.4, speed: 0.2, detail: null },
      { name: 'Cascada', type: 'Órbita muy excéntrica entre Rocío y Verdal, dos temporadas extremas', pop: 'Colonia adaptada a dos ciclos', peculiaridad: 'Perihelio: ríos que se evaporan formando anillos de vapor. Afelio: todo se congela', color: 0x5aa0c0, size: 0.24, orbit: 3.7, speed: 0.17, detail: null },
      { name: 'Verdal', type: 'Mundo de jungla densa · El Granero del Sector', pop: '~5 millones', economia: 'Agricultura • Exportación de alimentos', peculiaridad: 'Único planeta genuinamente habitable de La Cicatriz', color: 0x2f7a3a, size: 0.5, orbit: 5.1, speed: 0.14, detail: 'eden/verdal/verdal.html' },
      { name: 'Umbra (Umbraluz)', type: 'Luna de Verdal', pop: 'Ver "El Nexo" en Estaciones espaciales', peculiaridad: 'Genera ciclos de "media-noche, media-luz" que afectan a la fauna nocturna de Verdal', color: 0xb8c4cc, size: 0.14, orbit: 0.95, speed: 0.5, parentIndex: 2, detail: null },
      { name: 'El Nexo', type: 'Estación comercial en el punto de Lagrange Verdal-Umbra', pop: 'Hub comercial del sector', economia: 'Comercio, tránsito, sede del Sindicato del Nexo', peculiaridad: 'Punto de encuentro fijo entre Verdal y su luna Umbra', color: 0xd8b878, size: 0.09, orbit: 1.25, speed: 0.5, parentIndex: 2, detail: 'eden/nexo/el_nexo.html' },
      { name: 'Yermo', type: 'Planeta rocoso exterior, seco', pop: '~3.000', economia: 'Cantera de materiales para El Nexo', peculiaridad: 'Existe solo para alimentar la construcción de la estación', enfermedades: 'Enfermedades respiratorias por polvo de cantera', recurso: 'Materiales de construcción', color: 0xa08a68, size: 0.28, orbit: 6.7, speed: 0.1, detail: null },
      { name: 'Baluarte', type: 'Pequeña luna de Yermo, puesto militar de vigilancia', pop: 'Guarnición de la República de Verdal', peculiaridad: 'Sin recursos propios de interés', color: 0x788078, size: 0.1, orbit: 0.55, speed: 0.55, parentIndex: 5, detail: null },
      { name: 'Telar', type: 'Luna/planeta enano con estructuras filamentosas que "cantan"', pop: '~600 (puesto de escucha/culto)', economia: 'Mínima, casi de subsistencia', peculiaridad: 'Canto grave audible por resonancia con el viento solar', enfermedades: 'Trastornos por exposición prolongada al sonido de fondo', recurso: 'Fragmentos cristalinos, valor ornamental/científico', color: 0x8a7ab0, size: 0.2, orbit: 8.2, speed: 0.08, detail: null },
      { name: 'Poniente', type: 'Planeta rocoso, órbita inclinada ~40°, crepúsculos eternos', pop: 'Colonia/culto adaptado a la luz rasante', peculiaridad: 'El sol nunca sube ni baja del todo, solo se desliza en círculo bajo', color: 0xc98a56, size: 0.26, orbit: 9.7, speed: 0.065, detail: null }
    ]
  }
};
