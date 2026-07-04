// EL OBSERVADOR DEL NEXO - Contenido basado en Ferrum Vorago / La Cicatriz

const ediciones = {
  1: {
    numero: "LC-0001",
    fecha: "Año 1050 P.E. | Día 302 | 11:20 HST",
    precio: "5 CR (digital) | 10 CR (impreso)",
    destacada: {
      alerta: "CRÓNICA DE SOCIEDAD",
      titulo:
        "ORFEO SIGUE SIN APARECER: EL SILENCIO DE LA ESFINGE CARMESÍ SE ALARGA",
      subtitulo:
        "» Cuatro meses sin funciones – La Esfinge Carmesí mantiene la versión oficial mientras crecen las preguntas",
      contenido: [
        "La voz más celebrada del sector continúa ausente de los escenarios. ORFEO, prima voce de La Esfinge Carmesí desde hace años, no se presenta en público desde su última actuación registrada en Forja Muerta. La nave-teatro insiste en que se trata de un 'retiro voluntario por agotamiento vocal', pero la prolongación del silencio empieza a generar inquietud entre mecenas y seguidores por igual.",
        "Fuentes cercanas al Consorcio de Mercaderes señalan que Lady Míriam Ashental, principal patrocinadora del contrato de Orfeo, habría solicitado en repetidas ocasiones una actualización médica directa, sin obtener respuesta satisfactoria por parte de la dirección de la nave. El Consorte Valerius Kaine, propietario nominal de La Esfinge, no ha concedido entrevistas desde hace semanas.",
        "Mientras tanto, Madame Vesper ha retomado los papeles principales que durante años cedió a su joven sucesor, una circunstancia que algunos círculos de la crítica califican de 'oportuna' y otros de 'previsible, dado su talento y experiencia'. La propia Vesper declinó hacer declaraciones cuando El Observador intentó contactarla en su última escala en El Nexo.",
        "Circulan versiones contradictorias entre el público: quienes hablan de una disputa artística con Valerius Kaine, quienes apuntan a un deterioro de salud discreto, e incluso quienes sugieren que Orfeo simplemente se ha cansado de la vida itinerante. La Esfinge Carmesí no ha programado nuevas fechas con su nombre en el cartel, y ninguna fuente oficial ha confirmado cuándo —o si— volverá a subir a un escenario.",
      ],
    },
    columnas: [
      [
        {
          titulo:
            "[BARONES DEL POLVO] Escaramuza por mano de obra entre Horno y Viento Rojo",
          contenido: [
            "Tensión creciente entre dos de los señores de la guerra que se disputan el control de Viento Rojo. Según testigos, una cuadrilla de reclutadores enviada por el Barón de Horno intentó 'persuadir' a un grupo de mineros de Viento Rojo para que cambiaran de bando, alegando mejores raciones y turnos más cortos. La respuesta no se hizo esperar: el señor local ordenó cerrar sus túneles a cualquier convoy proveniente de Horno hasta nuevo aviso.",
            "Ninguno de los dos Barones ha hecho declaraciones oficiales, pero fuentes de la zona hablan de al menos tres heridos en el altercado inicial. Los Barones del Polvo llevan generaciones sin lograr unificarse bajo un solo mando, y episodios como este recuerdan por qué: cada señor de la guerra vigila con recelo cualquier movimiento de sus vecinos. El Observador seguirá la situación por si escala a algo mayor.",
          ],
        },
        {
          titulo:
            "[FORJA MUERTA] La 'Clase Cigüeña' conquista las rutas comerciales",
          contenido: [
            "La Tecnocracia de Forja Muerta ha empezado a entregar en serie su nuevo modelo de carguero ligero, bautizado extraoficialmente como 'Clase Cigüeña' por su silueta alargada y sus característicos brazos de carga externos. El Gran Ingeniero de turno presume de un coste de producción un 40% inferior a los modelos anteriores, gracias a piezas modulares que cualquier taller del sector puede reparar sin depender de Forja Muerta para cada recambio.",
            "El resultado: decenas de comerciantes independientes de El Nexo y Verdante ya han hecho pedidos, y algunos círculos comerciales hablan de la Cigüeña como 'la nave que por fin cualquiera puede permitirse'. No faltan las voces críticas — varios pilotos veteranos desconfían de un blindaje que califican de 'preocupantemente ligero' — pero de momento la demanda supera con holgura a la producción.",
          ],
        },
      ],
      [
        {
          titulo:
            "[CENIZA PRIMA] Colapso parcial de la Cúpula Sur tras semanas de lluvia ácida",
          contenido: [
            "Una sección de la Cúpula Sur, una de las más antiguas del planeta, cedió parcialmente durante la madrugada tras semanas de lluvia ácida por encima de los niveles habituales. Los equipos de emergencia evacuaron a cerca de 3.000 residentes antes de que el sellado de contención pudiera estabilizar la brecha. No se reportan muertos, aunque decenas de personas fueron tratadas por inhalación de vapores corrosivos.",
            "Los cultivos hidropónicos de la zona afectada se dan por perdidos, y la extracción de cristales de azufre en el sector —una de las principales fuentes de ingresos del planeta— queda suspendida hasta que se complete la reparación. Ingenieros locales advierten que las cúpulas más antiguas 'no fueron diseñadas para aguantar otros mil años de esto', en referencia al deterioro medioambiental que se arrastra desde mucho antes de la Gran Escisión.",
          ],
        },
        {
          titulo:
            "[MAREA NEGRA] Marea fuera de ciclo hunde tres plataformas pesqueras",
          contenido: [
            "Un fenómeno de marea anómalo, muy por encima de los 50 metros habituales, sorprendió esta semana a tres plataformas flotantes dedicadas a la pesca industrial, hundiendo parcialmente dos de ellas y dejando la tercera inutilizable. Los equipos de rescate confirman al menos doce desaparecidos, aunque las corrientes dificultan cualquier búsqueda seria.",
            "Los pescadores más veteranos aseguran no haber visto nada parecido en décadas y apuntan a la actividad geológica de los continentes hundidos como posible causa, aunque nadie en Marea Negra tiene medios para confirmarlo con certeza. La pérdida de las plataformas golpeará el suministro de proteína de pescado del sector en las próximas semanas.",
          ],
        },
      ],
    ],
    mercados: {
      titulo: "[MERCADOS Y COTIZACIONES]",
      contenido: [
        {
          recurso: "Cristales de Azufre (Ceniza Prima)",
          variacion: "▲ +14%",
          texto:
            "Al alza tras el colapso de la Cúpula Sur — la oferta se resiente y los compradores se adelantan.",
        },
        {
          recurso: "Proteína de Pescado (Marea Negra)",
          variacion: "▲ +9%",
          texto: "Sube por la pérdida de plataformas pesqueras esta semana.",
        },
        {
          recurso: "Fletes 'Clase Cigüeña' (Forja Muerta)",
          variacion: "▼ -18%",
          texto:
            "El coste de transporte cae en picado con la nueva serie de cargueros baratos.",
        },
        {
          recurso: "Hierro de alta pureza (Viento Rojo)",
          variacion: "▼ -5%",
          texto:
            "Las rutas cerradas por la disputa con Horno frenan las exportaciones.",
        },
        {
          recurso: "Agua pura (Hielo Eterno)",
          variacion: "— estable",
          texto: "Sin cambios reseñables esta semana, oferta constante.",
        },
        {
          recurso: "Comida y biomasa (Verdante)",
          variacion: "▲ +3%",
          texto:
            "Ligero repunte por demanda de reservas ante la inestabilidad en otras rutas comerciales.",
        },
        {
          recurso: "Algas medicinales (Pantano Gris)",
          variacion: "▼ -6%",
          texto:
            "Cae la demanda tras varios lotes rechazados por control de calidad en El Nexo.",
        },
        {
          recurso: "Metales refractarios (Horno)",
          variacion: "▼ -11%",
          texto:
            "La disputa con Viento Rojo también resiente la producción del lado de Horno.",
        },
        {
          recurso: "Silicio ultra-puro (Cristal Roto)",
          variacion: "▲ +7%",
          texto:
            "Los tecnócratas de Forja Muerta compran más silicio para la nueva línea de sensores de la Cigüeña.",
        },
        {
          recurso: "Organismos bioluminiscentes (Hielo Eterno)",
          variacion: "— estable",
          texto:
            "Mercado de lujo sin sobresaltos; la demanda de Santuario Orbital se mantiene constante.",
        },
      ],
    },
    rumores: {
      titulo: "[RUMORES Y SUSURROS]",
      contenido: [
        {
          titulo: "Luces sin nombre",
          texto:
            "Vigías de una estación de tránsito menor aseguran haber registrado dos firmas de nave que no corresponden a ningún catálogo conocido del sector. Los operadores oficiales hablan de 'fallo de sensores'. No es la primera vez que corre este rumor, pero sí la primera con testigos dispuestos a repetirlo en público.",
        },
        {
          titulo: "Algo se mueve bajo el hielo",
          texto:
            "Pescadores de Hielo Eterno insisten en que las capturas recientes 'huyen hacia la superficie como si algo grande las empujara desde abajo'. Las Matriarcas no han hecho comentarios.",
        },
        {
          titulo: "Grietas en la Cigüeña",
          texto:
            "Un técnico de Forja Muerta, bajo anonimato, asegura que el blindaje de la nueva 'Clase Cigüeña' falla las pruebas de estrés estándar y que se están vendiendo unidades 'con el papeleo aún sin firmar'.",
        },
        {
          titulo: "Un Barón menos",
          texto:
            "Se rumorea que uno de los señores de la guerra de Horno podría estar perdiendo el control de su propio territorio a manos de un rival interno, aprovechando el desgaste del conflicto con Viento Rojo.",
        },
        {
          titulo: "Silencio en las Naves-Teatro",
          texto:
            "No es solo Orfeo: dos artistas menores de otra compañía itinerante llevan semanas sin dar señales de vida, según comenta un mecenas anónimo en El Nexo.",
        },
        {
          titulo: "Cuentas que no cuadran",
          texto:
            "Un contable despedido de un consorcio menor de El Nexo asegura que hay 'movimientos de crédito imposibles de justificar' entre varios mecenas de naves de entretenimiento. Nadie ha querido confirmar ni desmentir nada.",
        },
      ],
    },
    acciones: [
      {
        simbolo: "CIGÜ",
        nombre: "Tecnocracia de Forja Muerta",
        valor: "842 CR",
        variacion: "+6.2%",
      },
      {
        simbolo: "MRCD",
        nombre: "Consorcio de Mercaderes (El Nexo)",
        valor: "1.204 CR",
        variacion: "-1.8%",
      },
      {
        simbolo: "VRDT",
        nombre: "República de Verdante Agro-Exportaciones",
        valor: "615 CR",
        variacion: "+0.4%",
      },
      {
        simbolo: "KRTH",
        nombre: "Kartha Armamento",
        valor: "2.310 CR",
        variacion: "-3.1%",
      },
      {
        simbolo: "SNTR",
        nombre: "Hermandad de Santuario Médica",
        valor: "998 CR",
        variacion: "+2.0%",
      },
      {
        simbolo: "HELO",
        nombre: "Cooperativa Hielo Eterno",
        valor: "540 CR",
        variacion: "estable",
      },
      {
        simbolo: "ESFN",
        nombre: "La Esfinge Carmesí Producciones",
        valor: "412 CR",
        variacion: "-7.5%",
      },
      {
        simbolo: "PLVO",
        nombre: "Barones del Polvo Holdings",
        valor: "203 CR",
        variacion: "-4.3%",
      },
    ],
    tablon: {
      titulo: "[TABLÓN DE CONTRATOS]",
      contenido: [
        {
          tipo: "EN VENTA",
          texto:
            "Carguero 'Clase Cigüeña' de segunda mano, apenas 3 ciclos de uso, brazos de carga externos en perfecto estado. 38.000 CR negociables. Contactar Muelle 6, El Nexo.",
        },
        {
          tipo: "SE BUSCA",
          texto:
            "Pilotos con experiencia en rutas Viento Rojo–Horno. Pago por adelantado ante la situación actual. Preguntar por 'El Cartógrafo', Módulo 9.",
        },
        {
          tipo: "TRABAJO",
          texto:
            "Se necesitan manos para reforzar la Cúpula Sur de Ceniza Prima. Alojamiento y máscara de filtrado incluidos. 600 CR/semana. Contrato mínimo 4 semanas.",
        },
        {
          tipo: "RECOMPENSA",
          texto:
            "300 CR a quien recupere un contenedor de carga extraviado en la última tormenta sobre Viento Rojo. Marca de la Familia Drakon. Sin preguntas. Canal #CARGA-09.",
        },
        {
          tipo: "COMPRO",
          texto:
            "Silicio ultra-puro de Cristal Roto, cualquier cantidad, pago inmediato en créditos. Comprador serio, sin intermediarios. Módulo 3, Taller de Iren.",
        },
      ],
    },
    edictos: [
      {
        tipo: "TRÁNSITO",
        texto:
          "El Módulo 7 de El Nexo permanecerá cerrado a naves de más de 50 toneladas durante los próximos 6 ciclos por trabajos de refuerzo estructural. Rutas alternativas habilitadas en Módulos 4 y 9.",
      },
      {
        tipo: "SANIDAD",
        texto:
          "Se recuerda a comerciantes y viajeros la obligatoriedad de pasar control de esporas antes de atracar procedentes de Pantano Gris. Las infracciones conllevan cuarentena forzosa de hasta 10 días.",
      },
      {
        tipo: "MERCADO",
        texto:
          "El Consejo de la Cicatriz recuerda que toda disputa comercial entre facciones debe canalizarse a través de los cauces habituales en El Nexo. Los altercados armados fuera de zona neutral serán sancionados por igual a ambas partes, sin excepción.",
      },
      {
        tipo: "SEGURIDAD",
        texto:
          "Se solicita a la ciudadanía reportar cualquier avistamiento de naves no identificadas a la estación de tránsito más cercana. El Observador recuerda que, hasta la fecha, ninguna autoridad del sector ha confirmado el origen de dichas naves.",
      },
    ],
  },
};

let edicionActual = 1;

function renderizarEdicion(numeroEdicion) {
  const edicion = ediciones[numeroEdicion];
  if (!edicion) return;

  edicionActual = numeroEdicion;

  document.getElementById("editionInfo").textContent =
    `TRANSMISIÓN ${edicion.numero}`;
  document.getElementById("dateInfo").textContent = edicion.fecha;
  document.querySelector(".price-info").textContent =
    `PRECIO: ${edicion.precio}`;

  renderizarDestacada(edicion.destacada);
  renderizarColumnas(edicion.columnas);
  renderizarMercadosYRumores(edicion.mercados, edicion.rumores);
  renderizarTicker(edicion.acciones);
  renderizarTablon(edicion.tablon);
  renderizarEdictos(edicion.edictos);
  renderizarSelectorEdiciones();
}

function renderizarDestacada(destacada) {
  const section = document.getElementById("featuredNews");
  let html = destacada.alerta
    ? `<div class="alert-banner">${destacada.alerta}</div>`
    : "";
  html += `<h2 class="featured-title">${destacada.titulo}</h2>
             <p class="featured-subtitle">${destacada.subtitulo}</p>
             <div class="featured-content">`;
  destacada.contenido.forEach((p, i) => {
    html += `<p${i === 0 ? ' class="dropcap"' : ""}>${p}</p>`;
  });
  html += `</div>`;
  section.innerHTML = html;
}

function renderizarColumnas(columnas) {
  const container = document.querySelector(".news-columns");
  let html = "";
  columnas.forEach((columna) => {
    html += '<div class="column">';
    columna.forEach((articulo) => {
      if (articulo.tipo === "rumores") html += renderizarRumores(articulo);
      else
        html += `<article class="news-article"><h3>${articulo.titulo}</h3>${articulo.contenido.map((p) => `<p>${p}</p>`).join("")}</article>`;
    });
    html += "</div>";
  });
  container.innerHTML = html;
}

// Renderiza mercados (izquierda) y rumores (derecha) como sección de ancho completo,
// independiente de las dos columnas de noticias, para que ninguna de las dos quede apretada.
function renderizarMercadosYRumores(mercados, rumores) {
  const contenedor = document.getElementById("marketRumorSection");
  if (!contenedor) return;
  contenedor.innerHTML =
    renderizarMercados(mercados) + renderizarRumores(rumores);
}

// Cinta de cotizaciones bursátiles con desplazamiento infinito (estilo ticker de bolsa)
function renderizarTicker(acciones) {
  const track = document.getElementById("tickerTrack");
  if (!track || !acciones || acciones.length === 0) return;

  const itemHTML = (a) => {
    const clase = a.variacion.startsWith("+")
      ? "ticker-up"
      : a.variacion.startsWith("-")
        ? "ticker-down"
        : "ticker-flat";
    const flecha = a.variacion.startsWith("+")
      ? "▲"
      : a.variacion.startsWith("-")
        ? "▼"
        : "—";
    return `<span class="ticker-item"><span class="ticker-symbol">${a.simbolo}</span> ${a.nombre} <span class="ticker-price">${a.valor}</span> <span class="${clase}">${flecha} ${a.variacion}</span></span>`;
  };

  // Duplicamos la lista para que el bucle de la animación (translateX -50%) sea perfectamente continuo
  const contenido = acciones.map(itemHTML).join("");
  track.innerHTML = contenido + contenido;
}

function renderizarTablon(articulo) {
  const contenedor = document.getElementById("tablonSection");
  if (!contenedor) return;
  contenedor.innerHTML = `<article class="news-article classifieds-section"><h3>${articulo.titulo}</h3>${articulo.contenido
    .map(
      (a) =>
        `<div class="classified-ad"><strong>${a.tipo}:</strong> ${a.texto}</div>`,
    )
    .join("")}</article>`;
}

function renderizarRumores(articulo) {
  return `<article class="news-article rumores-section"><h3>${articulo.titulo}</h3>${articulo.contenido
    .map(
      (r) =>
        `<div class="rumor-item"><h4>${r.titulo}</h4><p>${r.texto}</p></div>`,
    )
    .join("")}</article>`;
}

function renderizarMercados(articulo) {
  return `<article class="news-article markets-section"><h3>${articulo.titulo}</h3>${articulo.contenido
    .map((m) => {
      const claseVariacion = m.variacion.startsWith("▲")
        ? "market-up"
        : m.variacion.startsWith("▼")
          ? "market-down"
          : "market-flat";
      return `<div class="market-item"><h4>${m.recurso} <span class="${claseVariacion}">${m.variacion}</span></h4><p>${m.texto}</p></div>`;
    })
    .join("")}</article>`;
}

function renderizarEdictos(edictos) {
  document.querySelector(".official-notices .official-content").innerHTML =
    edictos
      .map((e) => `<p><strong>${e.tipo}:</strong> ${e.texto}</p>`)
      .join("");
}

// Genera automáticamente un botón por cada edición existente en el objeto `ediciones`.
// Añadir una edición nueva al objeto es suficiente para que aparezca aquí sin tocar el HTML.
function renderizarSelectorEdiciones() {
  const selector = document.getElementById("editionSelector");
  if (!selector) return;

  const numeros = Object.keys(ediciones)
    .map(Number)
    .sort((a, b) => a - b);

  if (numeros.length <= 1) {
    selector.innerHTML = "";
    return;
  }

  selector.innerHTML = numeros
    .map((n) => {
      const activa = n === edicionActual ? " active" : "";
      return `<button class="edition-btn${activa}" data-edicion="${n}">${n}</button>`;
    })
    .join("");

  selector.querySelectorAll(".edition-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      cambiarEdicion(Number(btn.dataset.edicion)),
    );
  });
}

function cambiarEdicion(n) {
  if (ediciones[n]) {
    renderizarEdicion(n);
    localStorage.setItem("edicionActual", n);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const guardada = parseInt(localStorage.getItem("edicionActual"), 10);
  const inicial = ediciones[guardada]
    ? guardada
    : Math.min(...Object.keys(ediciones).map(Number));
  renderizarEdicion(inicial);
});

window.observadorDelNexo = { cambiarEdicion, ediciones };
