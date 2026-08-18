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
            "El resultado: decenas de comerciantes independientes de El Nexo y Verdal ya han hecho pedidos, y algunos círculos comerciales hablan de la Cigüeña como 'la nave que por fin cualquiera puede permitirse'. No faltan las voces críticas — varios pilotos veteranos desconfían de un blindaje que califican de 'preocupantemente ligero' — pero de momento la demanda supera con holgura a la producción.",
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
          recurso: "Comida y biomasa (Verdal)",
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
        nombre: "República de Verdal Agro-Exportaciones",
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

  2: {
    numero: "LC-0002",
    fecha: "Año 1050 P.E. | Día 309 | 20:05 HST",
    precio: "5 CR (digital) | 10 CR (impreso)",
    destacada: {
      alerta: "ÚLTIMA HORA",
      titulo:
        "VENAS ROJAS DEJA DE EXISTIR: EL SECTOR ASISTE ATÓNITO A LA DESAPARICIÓN DE UN MUNDO ENTERO",
      subtitulo:
        "» Estaciones de todo el Sistema Carmesí registran el fenómeno en directo — Nadie tiene una explicación",
      contenido: [
        "Lo que las estaciones de relevo del Sistema Carmesí captaron en la madrugada de ayer no admite comparación con nada registrado antes en el sector: una grieta de luz blanca se abrió en la superficie de Venas Rojas y se extendió en cuestión de segundos por medio continente, seguida de una onda que llegó a deformar visiblemente la curva del propio planeta. Cuando la imagen dejó de saturarse de luz, donde antes había un mundo solo quedaba una nube de escombros en expansión.",
        "Venas Rojas, operado desde hace años por El Barón como uno de los mayores complejos mineros industriales del sector, ha desaparecido por completo. No hay complejo que rescatar, ni superficie a la que enviar equipos: el planeta, sencillamente, ya no está. Representantes de El Barón en El Nexo no han facilitado cifras de personal presente en el momento del suceso, y el propio Barón no ha hecho declaraciones públicas desde hace semanas.",
        "Ningún especialista consultado por este periódico ha sabido ofrecer una explicación convincente. Los fenómenos geológicos conocidos no destruyen un planeta entero en segundos, lo que ha llevado a buena parte del sector a descartar la hipótesis del accidente natural. Crece el número de voces que apuntan a algún tipo de arma o tecnología de una capacidad sin precedentes, y no faltan quienes conectan el suceso con los avistamientos de naves no identificadas registrados semanas atrás en estaciones de tránsito menores, aunque ninguna autoridad del sector ha confirmado relación alguna.",
        "La nube de escombros continúa expandiéndose y ya se ha declarado zona de exclusión en toda la región. Ninguna nave se atreve a acercarse. El Observador seguirá informando a medida que lleguen más datos verificables, si es que llegan.",
      ],
    },
    columnas: [
      [
        {
          titulo:
            "[BARONES DEL POLVO] La disputa entre Horno y Viento Rojo estalla en combate abierto",
          contenido: [
            "La tensión que llevaba semanas en forma de escaramuzas menores entre los Barones de Horno y Viento Rojo se rompió del todo esta semana con un choque armado de mercenarios de ambos bandos, cerca de una de las rutas de tránsito compartidas. Los primeros informes hablan de al menos una decena de muertos confirmados, aunque la cifra real podría ser mayor: ninguno de los dos Barones ha permitido acceso a observadores externos.",
            "Varios comerciantes de la zona señalan que la desaparición de Venas Rojas ha dejado un vacío repentino en rutas de suministro que ambos Barones se disputaban con la operación de El Barón, y que la escalada podría estar ligada a la carrera por ocupar ese hueco. Ninguno de los dos señores de la guerra da muestras de querer negociar, y el corredor entre ambos territorios ya se evita por completo.",
          ],
        },
        {
          titulo:
            "[FORJA MUERTA] Primer incidente grave de la 'Clase Cigüeña' reaviva las críticas sobre su blindaje",
          contenido: [
            "Un carguero 'Clase Cigüeña' sufrió una brecha en el casco durante una tormenta electromagnética menor cerca de Viento Rojo, obligando a la tripulación a un aterrizaje de emergencia. No hay heridos graves, pero el incidente ha reavivado las dudas que varios pilotos venían expresando desde el lanzamiento del modelo sobre un blindaje que calificaban de 'preocupantemente ligero'.",
            "El Gran Ingeniero de Forja Muerta ha calificado el incidente de 'caso aislado atribuible a condiciones climáticas extremas' y descarta retirar unidades del mercado. Aun así, varios compradores han empezado a solicitar inspecciones adicionales antes de aceptar entregas, y algunas aseguradoras de El Nexo ya han empezado a encarecer las pólizas para naves de este modelo.",
          ],
        },
        {
          titulo:
            "[EL NEXO] Un golpe rompe las reglas no escritas del territorio neutral",
          contenido: [
            "Un ataque directo contra un cargamento de uno de los Cinco Capos ha sacudido El Nexo esta semana, en lo que varios testigos describen como una operación demasiado precisa para ser un simple robo oportunista. El incidente tuvo lugar en pleno Módulo 2, zona que tradicionalmente se respeta como terreno neutral entre facciones rivales.",
            "Ninguno de los Capos ha reclamado la autoría ni señalado a otro abiertamente, pero el ambiente en los círculos comerciales se ha tensado de forma notable. Varios comerciantes independientes ya hablan de reforzar su propia seguridad, temiendo que sea el primero de varios golpes que rompan un equilibrio que llevaba años sin alterarse.",
          ],
        },
      ],
      [
        {
          titulo:
            "[HIELO ETERNO] Pescadores confirman avistamiento cerca de Puerto Grieta",
          contenido: [
            "Lo que hace semanas era solo un rumor entre pescadores empieza a tomar forma: varias tripulaciones que faenaban cerca de Puerto Grieta aseguran haber visto 'algo grande moviéndose bajo el hielo', lo bastante cerca del asentamiento como para provocar el regreso anticipado de al menos tres embarcaciones. El Consejo de Matriarcas no ha hecho comentarios oficiales, pero fuentes locales confirman que se han reforzado las patrullas submarinas en la zona.",
            "Ninguna imagen ni registro sensorial del avistamiento ha sido compartido públicamente, y los más escépticos apuntan a que podría tratarse de fauna conocida del abismo reaccionando a actividad sísmica. Aun así, la pesca en la zona se ha reducido notablemente esta semana.",
          ],
        },
        {
          titulo:
            "[SANTUARIO ORBITAL] La Hermandad comparte un hallazgo captado durante una alineación que solo se repite cada 60 años",
          contenido: [
            "Una vez cada aproximadamente 60 ciclos, la órbita de Santuario y la posición del punto de Lagrange donde se asienta crean una ventana de observación excepcionalmente despejada hacia los confines del sector. La Hermandad aprovechó la alineación de esta semana para operar sus observatorios a máxima capacidad, y de forma poco habitual en ellos, ha decidido hacer públicos parte de los datos obtenidos en vez de guardarlos bajo llave como es costumbre.",
            "Según el comunicado oficial, las lecturas muestran estructuras de gran tamaño en los límites del sector, coherentes con restos asociados a la Gran Escisión, aunque el Primado Científico se ha negado a especular sobre su naturaleza exacta. La decisión de compartir los datos ha sorprendido a buena parte del sector, y ya hay quien se pregunta qué les ha llevado a romper con la costumbre.",
          ],
        },
        {
          titulo:
            "[VERDAL] Familias del Consejo de Agricultores chocan por el reparto del excedente",
          contenido: [
            "El Consejo de Agricultores de Verdal vive una de sus sesiones más tensas en años por el reparto del excedente de la última cosecha, con varias familias acusándose mutuamente de acaparar cupos de exportación en beneficio propio. La disputa lleva semanas gestándose, según fuentes internas, pero ha estallado tras la publicación de las cifras oficiales de reparto.",
            "Un consejero que pidió mantener el anonimato asegura que 'hay familias que llevan generaciones controlando las mismas rutas de venta, y otras que empiezan a hartarse de quedarse con las sobras'. El Consejo ha aplazado la votación final hasta la próxima sesión.",
          ],
        },
      ],
    ],
    mercados: {
      titulo: "[MERCADOS Y COTIZACIONES]",
      contenido: [
        {
          recurso: "Seguros de carga (sector completo)",
          variacion: "▲ +22%",
          texto:
            "El pánico tras Venas Rojas dispara las primas de las aseguradoras de El Nexo en todas las rutas del sector.",
        },
        {
          recurso: "Fletes 'Clase Cigüeña' (Forja Muerta)",
          variacion: "▼ -30%",
          texto:
            "Tras el incidente de blindaje, la confianza en el modelo se desploma.",
        },
        {
          recurso: "Hierro de alta pureza (Viento Rojo)",
          variacion: "▲ +12%",
          texto:
            "La tregua con Horno reabre las rutas de exportación cerradas.",
        },
        {
          recurso: "Metales refractarios (Horno)",
          variacion: "▲ +8%",
          texto:
            "Misma tregua, normalización parcial del intercambio comercial.",
        },
        {
          recurso: "Cristales de Azufre (Ceniza Prima)",
          variacion: "— estable",
          texto:
            "La Cúpula Sur ya reparada, la producción vuelve a niveles normales.",
        },
        {
          recurso: "Agua pura (Hielo Eterno)",
          variacion: "▲ +6%",
          texto:
            "El avistamiento cerca de Puerto Grieta reduce las expediciones de pesca y tensiona el suministro.",
        },
        {
          recurso: "Organismos bioluminiscentes (Hielo Eterno)",
          variacion: "▲ +10%",
          texto:
            "La escasez de recolectores dispuestos a acercarse a la zona dispara el precio de lo poco que llega al mercado.",
        },
        {
          recurso: "Comida y biomasa (Verdal)",
          variacion: "▲ +5%",
          texto:
            "Acumulación de reservas ante la incertidumbre general del sector.",
        },
        {
          recurso: "Silicio ultra-puro (Cristal Roto)",
          variacion: "— estable",
          texto: "Sin cambios relevantes esta semana.",
        },
        {
          recurso: "Operaciones de El Barón (Venas Rojas)",
          variacion: "SUSPENDIDA",
          texto:
            "Cotización suspendida indefinidamente: el planeta que albergaba sus operaciones ha dejado de existir.",
        },
      ],
    },
    rumores: {
      titulo: "[RUMORES Y SUSURROS]",
      contenido: [
        {
          titulo: "El Barón no responde",
          texto:
            "Nadie de su círculo cercano ha sido visto en El Nexo desde el incidente. Algunos aseguran que abandonó la zona días antes de la explosión, aunque nadie ha podido confirmarlo.",
        },
        {
          titulo: "Restos que no encajan",
          texto:
            "Técnicos que analizaron a distancia la nube de escombros hablan de fragmentos de nave que no corresponden a ningún modelo conocido de la flota de El Barón, alimentando la teoría de un ataque externo.",
        },
        {
          titulo: "El Maestro Kaine se derrumba",
          texto:
            "La Esfinge Carmesí ha cancelado varias funciones alegando 'problemas técnicos', aunque testigos en el último atraque hablan de una discusión a gritos entre el Maestro Kaine y su padre, el Consorte Valerius.",
        },
        {
          titulo: "Las cuentas de Venas Rojas no cuadraban",
          texto:
            "Un antiguo proveedor del complejo asegura que la contabilidad de Venas Rojas llevaba meses dando problemas, mucho antes de la explosión, aunque no ha querido dar más detalles.",
        },
        {
          titulo: "Puerto Grieta cierra filas",
          texto:
            "Hielo Eterno ha restringido el acceso de comerciantes externos a Puerto Grieta 'hasta nuevo aviso', sin dar explicaciones oficiales sobre el motivo.",
        },
        {
          titulo: "Grietas que se confirman",
          texto:
            "Tras el incidente de la Cigüeña en Viento Rojo, un segundo piloto denuncia haber recibido una unidad con el sellado del casco 'visiblemente defectuoso' antes de que Forja Muerta se lo llevara para 'revisión'.",
        },
      ],
    },
    acciones: [
      {
        simbolo: "CIGÜ",
        nombre: "Tecnocracia de Forja Muerta",
        valor: "738 CR",
        variacion: "-12.4%",
      },
      {
        simbolo: "MRCD",
        nombre: "Consorcio de Mercaderes (El Nexo)",
        valor: "1.264 CR",
        variacion: "+5.0%",
      },
      {
        simbolo: "VRDT",
        nombre: "República de Verdal Agro-Exportaciones",
        valor: "628 CR",
        variacion: "+2.1%",
      },
      {
        simbolo: "KRTH",
        nombre: "Kartha Armamento",
        valor: "2.525 CR",
        variacion: "+9.3%",
      },
      {
        simbolo: "SNTR",
        nombre: "Hermandad de Santuario Médica",
        valor: "1.033 CR",
        variacion: "+3.5%",
      },
      {
        simbolo: "HELO",
        nombre: "Cooperativa Hielo Eterno",
        valor: "508 CR",
        variacion: "-6.0%",
      },
      {
        simbolo: "ESFN",
        nombre: "La Esfinge Carmesí Producciones",
        valor: "349 CR",
        variacion: "-15.2%",
      },
      {
        simbolo: "PLVO",
        nombre: "Barones del Polvo Holdings",
        valor: "211 CR",
        variacion: "+4.0%",
      },
      {
        simbolo: "BARN",
        nombre: "El Barón — Operaciones Venas Rojas",
        valor: "— CR",
        variacion: "SUSPENDIDA",
      },
    ],
    tablon: {
      titulo: "[TABLÓN DE CONTRATOS]",
      contenido: [
        {
          tipo: "SE BUSCA",
          texto:
            "Pilotos dispuestos a acercarse a la zona de exclusión de Venas Rojas para tareas de reconocimiento. Alto riesgo, pago 5.000 CR por vuelo. Preguntar por 'El Cartógrafo', Módulo 9.",
        },
        {
          tipo: "COMPRO",
          texto:
            "Piezas de repuesto para 'Clase Cigüeña' con certificado de blindaje verificado. Pago inmediato, cualquier cantidad. Muelle 6, El Nexo.",
        },
        {
          tipo: "TRABAJO",
          texto:
            "Se buscan inspectores de carga para verificar mercancía antes de asegurarla, ante la reciente subida de primas. Experiencia valorada. Módulo 2, La Bolsa.",
        },
        {
          tipo: "RECOMPENSA",
          texto:
            "500 CR por cualquier fragmento identificable de la explosión de Venas Rojas para análisis independiente. Discreción garantizada. Canal #ECO-14.",
        },
        {
          tipo: "SE BUSCA",
          texto:
            "Guías con experiencia en rutas alternativas de Hielo Eterno, ante el cierre de accesos a Puerto Grieta. Pago negociable. Módulo 11.",
        },
      ],
    },
    edictos: [
      {
        tipo: "SEGURIDAD",
        texto:
          "El Consejo de la Cicatriz declara zona de exclusión temporal alrededor de Venas Rojas. Toda nave debe mantener una distancia mínima de 500 km hasta nuevo aviso.",
      },
      {
        tipo: "TRÁNSITO",
        texto:
          "Puerto Grieta (Hielo Eterno) restringe el acceso a comerciantes externos hasta nuevo aviso. Se recomienda planificar rutas alternativas.",
      },
      {
        tipo: "MERCADO",
        texto:
          "Se recuerda que la especulación con pólizas de seguro de carga durante emergencias declaradas está sujeta a sanción según las normas de El Nexo.",
      },
      {
        tipo: "SANIDAD",
        texto:
          "Toda tripulación que haya operado en rutas cercanas a Venas Rojas en los últimos 10 ciclos debe pasar una revisión médica voluntaria en la estación de tránsito más cercana.",
      },
    ],
  },

  3: {
    numero: "LC-0003",
    fecha: "Año 1050 P.E. | Día 316 | 09:15 HST",
    precio: "5 CR (digital) | 10 CR (impreso)",
    destacada: {
      alerta: "HITO HISTÓRICO",
      titulo:
        "SANTUARIO ORBITAL REABRE LA PUERTA DE SALTO A SINAIRE TRAS 150 AÑOS DE SILENCIO",
      subtitulo:
        "» La Hermandad confirma el primer contacto con Espesura Roja — una biosfera sin precedente alguno en todo el sector",
      contenido: [
        "Por primera vez en siglo y medio, una puerta de Salto del extremo del sector ha vuelto a abrirse. La Hermandad de Santuario confirmó ayer la reactivación completa del enlace hacia el sistema Sinaire, sellado desde antes de que ninguna generación viva pudiera recordarlo, y restableció contacto con Espesura Roja, el mundo que en su día dio nombre a toda la región antes de perderse en el silencio.",
        "Sinaire formó parte de las rutas conectadas del sector hasta hace 150 años, cuando el enlace se cerró y toda comunicación con Espesura Roja se interrumpió sin que trascendiera entonces —ni haya trascendido desde— una explicación oficial. La reapertura ha llegado como una sorpresa casi total incluso dentro de la propia Hermandad: ningún comunicado ha aclarado qué motivó retomar el enlace precisamente ahora, y el Primado Científico se ha limitado a calificarlo de 'un paso que llevábamos demasiado tiempo postergando', sin entrar en más detalle.",
        "Las primeras sondas enviadas a través del enlace describen un mundo teñido de un rojo intenso de un extremo a otro: la vegetación exuberante que cubre Espesura Roja no conserva nada del verde habitual, sino un carmesí que se extiende desde el dosel de la jungla hasta el fluido que corre por sus ríos. Prácticamente toda esa vegetación es depredadora en algún grado, desde plantas que atrapan insectos hasta enredaderas capaces de inmovilizar animales grandes por constricción. Más inquietante aún, los informes preliminares describen un único fluido circulatorio compartido por toda la biosfera, que corre por ríos y lagos con apariencia de agua corriente sin serlo en absoluto.",
        "El Primado Científico de la Hermandad ha pedido calma y prudencia: 'Hemos abierto una puerta, no un mercado. Lo que hay al otro lado no se parece a nada que conozcamos, y trataremos cada paso con el cuidado que exige'. Por ahora no existe explotación comercial de ningún tipo, y el acceso permanece restringido a personal autorizado de la propia Hermandad.",
        "Sinaire alberga varios cuerpos más además de Espesura Roja, según los primeros barridos orbitales, cada uno con una química radicalmente distinta a cualquier otra conocida en La Cicatriz. Ninguno ha sido explorado todavía. El Observador seguirá esta historia de cerca en las próximas semanas.",
      ],
    },
    columnas: [
      [
        {
          titulo:
            "[LOS CINCO CAPOS] Pugna silenciosa por el control del acceso a Sinaire",
          contenido: [
            "La reactivación de la puerta no ha tardado ni un día en convertirse en asunto de facciones. La Hermandad de Santuario reclama derecho preferente sobre el enlace por haberlo reabierto con medios y personal propios, una postura que no todos en el Consejo de la Cicatriz están dispuestos a aceptar sin más. La Tecnocracia de Forja Muerta ha solicitado formalmente acceso a Silicial, uno de los mundos del sistema, alegando interés científico en su vida basada en silicio y en las posibles aplicaciones industriales de un caparazón cristalino prácticamente indestructible.",
            "El Consorcio de Mercaderes, por su parte, presiona por que cualquier acuerdo de acceso pase por El Nexo como intermediario neutral, temiendo quedar excluido si la Hermandad y la Tecnocracia cierran un pacto bilateral a sus espaldas. Ninguna de las partes ha llegado a amenaza abierta, pero varios asistentes al último Consejo describen un ambiente 'tenso como cuerda de arpa'. Nadie quiere ser el último en sentarse a la mesa cuando se reparta Sinaire.",
          ],
        },
        {
          titulo:
            "[SANIDAD] La savia de Espesura Roja: primeros informes advierten de riesgo letal",
          contenido: [
            "El equipo médico desplegado junto a la primera expedición de la Hermandad ha remitido un informe preliminar que ya circula, filtrado, entre el personal de Santuario Orbital: el fluido circulatorio que recorre Espesura Roja —producido y reabsorbido constantemente por la propia vegetación del planeta— puede resultar nutritivo, tóxico o abiertamente narcótico según qué especie domine el punto exacto donde se extraiga, sin que exista todavía forma fiable de distinguir un caso de otro a simple vista.",
            "Más preocupante para cualquier futura operación de extracción: retirar el fluido provoca una reacción de 'cicatrización' agresiva en la vegetación circundante, cuya naturaleza exacta aún no se comprende. La Hermandad ha impuesto cuarentena provisional a todo el personal que regrese de Espesura Roja y recomienda encarecidamente que nadie ajeno a la expedición oficial intente replicar el contacto por su cuenta, al menos hasta que existan protocolos claros de manejo del fluido.",
          ],
        },
      ],
      [
        {
          titulo:
            "[SISTEMA CARMESÍ] Una semana después: los fragmentos de Venas Rojas no revelan nada",
          contenido: [
            "Siete días después de que Venas Rojas dejara de existir, la recompensa por fragmentos identificables ofrecida por este periódico y otras partes interesadas ha dado sus primeros frutos: varios cazadores independientes han entregado restos recuperados en el borde de la nube de escombros. El análisis preliminar, lejos de aclarar nada, ha añadido más preguntas. Los técnicos consultados hablan de composiciones minerales que no encajan con la geología conocida del planeta, y de al menos un fragmento cuya estructura interna 'no debería ser posible' según los estándares de metalurgia del sector.",
            "El Consejo de la Cicatriz mantiene la zona de exclusión sin cambios y se ha negado a hacer declaraciones más allá de un escueto comunicado reconociendo que 'la investigación continúa'. Ese silencio, lejos de calmar los ánimos, alimenta cada vez más teorías entre la población de El Nexo, donde ya circula la sospecha de que las autoridades saben más de lo que admiten.",
          ],
        },
        {
          titulo:
            "[ECONOMÍA] Doble sacudida: el vacío de Venas Rojas choca con la fiebre especulativa de Sinaire",
          contenido: [
            "El mercado del sector encaja esta semana dos golpes en direcciones opuestas. Por un lado, la cancelación formal de los contratos de futuros de Hematón vinculados a Venas Rojas ha dejado a varias correduras de El Nexo con pérdidas que no pueden maquillar por mucho tiempo: la Correduría del Umbral, la más expuesta, ha visto caer su cotización con fuerza esta semana, y no es la única entidad financiera que empieza a sudar frío ante la revisión de su cartera de contratos.",
            "Por otro lado, la noticia de Sinaire ha disparado la especulación en la dirección contraria: el equipo de exploración y protección química se vende por encima de su valor habitual pese a que ni una sola nave comercial tiene aún permiso para cruzar la puerta, y ya circulan en El Nexo los primeros papeles especulativos sobre un silicio de Silicial que todavía nadie ha extraído. Los analistas más cautos advierten de que ambos movimientos —el pánico financiero y la euforia especulativa— podrían estar alimentándose mutuamente, y que el sector podría estar sentando las bases de una corrección brusca si Sinaire tarda en dar resultados tangibles.",
          ],
        },
      ],
    ],
    mercados: {
      titulo: "[MERCADOS Y COTIZACIONES]",
      contenido: [
        {
          recurso: "Operaciones de El Barón (Venas Rojas)",
          variacion: "SUSPENDIDA",
          texto:
            "Séptimo día sin cotización. El mercado ya empieza a asumir que la suspensión es definitiva.",
        },
        {
          recurso: "Contratos de futuros de Hematón (El Nexo)",
          variacion: "CANCELADOS",
          texto:
            "Los contratos aún pendientes sobre entregas futuras de Hematón se declaran oficialmente sin valor. Varias correduras de El Nexo asumen pérdidas directas.",
        },
        {
          recurso: "Servicios de correduría y crédito (El Nexo)",
          variacion: "▼ -7%",
          texto:
            "La Correduría del Umbral encabeza la caída del sector financiero por su exposición directa a los contratos de Hematón ahora sin valor.",
        },
        {
          recurso: "Equipo de exploración y protección química (general)",
          variacion: "▲ +21%",
          texto:
            "La fiebre por Sinaire dispara la demanda especulativa de trajes de aislamiento y sensores de campo, pese a que aún no existe comercio oficial con el sistema.",
        },
        {
          recurso: "Contratos especulativos sobre silicio de Silicial (sin extraer)",
          variacion: "▲ +38%",
          texto:
            "Papel puramente especulativo: nadie ha extraído todavía un solo gramo, pero los inversores ya se pelean por reservar cupo antes de que se abra la explotación.",
        },
        {
          recurso: "Savia cicatrizante (El Manantial)",
          variacion: "▲ +4.5%",
          texto:
            "La Hermandad consulta a la cooperativa de El Manantial por su experiencia en extracción de savia, ante los retos que plantea el fluido de Espesura Roja.",
        },
        {
          recurso: "Compuesto de esporas médicas (Velo Ciego)",
          variacion: "▲ +5.5%",
          texto:
            "El prestigio de la Hermandad de Santuario tras la reapertura de la puerta arrastra al alza toda su cartera médica.",
        },
        {
          recurso: "Cristales de Azufre (Ceniza Prima)",
          variacion: "▲ +1%",
          texto: "Semana tranquila, sin sobresaltos en la producción.",
        },
        {
          recurso: "Hierro de alta pureza (Viento Rojo)",
          variacion: "▼ -1.6%",
          texto:
            "Ligero ajuste técnico tras varias semanas de subidas consecutivas.",
        },
        {
          recurso: "Tecnología limpia anti-EMP (El Manantial)",
          variacion: "▼ -2.9%",
          texto:
            "La atención del mercado se desvía hacia el equipo de exploración de Sinaire, en detrimento de otras líneas tecnológicas.",
        },
      ],
    },
    rumores: {
      titulo: "[RUMORES Y SUSURROS]",
      contenido: [
        {
          titulo: "La puerta ya hablaba antes de abrirse",
          texto:
            "Un técnico de Santuario Orbital, bajo anonimato estricto, asegura que los sensores del enlace llevaban semanas registrando actividad al otro lado antes del anuncio oficial, y que la 'reactivación' fue en realidad una respuesta apresurada a algo que la Hermandad ya había detectado. La Hermandad no ha respondido a las preguntas de este periódico sobre el asunto.",
        },
        {
          titulo: "Los archivos que faltan",
          texto:
            "Se rumorea que los registros de la Hermandad sobre Sinaire, previos al cierre de la puerta hace 150 años, están incompletos de forma 'demasiado conveniente', y que alguien los depuró antes de que el anuncio se hiciera público.",
        },
        {
          titulo: "Restos que siguen sin encajar",
          texto:
            "Un segundo analista independiente, contratado por un comprador anónimo para revisar los fragmentos de Venas Rojas, coincide con el primer informe: la composición 'no debería existir' según ningún catálogo conocido del sector.",
        },
        {
          titulo: "El Barón, en paradero desconocido",
          texto:
            "Una semana después, sigue sin haber rastro público de El Barón ni de su círculo cercano. Algunos apuntan a que nunca regresará a El Nexo; otros insisten en que solo espera el momento adecuado para reaparecer.",
        },
        {
          titulo: "Voluntarios que no quieren ser voluntarios",
          texto:
            "Circula la queja, no confirmada, de que parte del 'personal autorizado' que la Hermandad envió a Espesura Roja no se ofreció exactamente de forma voluntaria. Santuario Orbital lo niega tajantemente.",
        },
        {
          titulo: "Cuentas que tampoco cuadran aquí",
          texto:
            "Un empleado despedido de la Correduría del Umbral asegura que la exposición real a los contratos de Hematón cancelados es bastante mayor de lo que la empresa ha reconocido públicamente esta semana.",
        },
      ],
    },
    acciones: [
      {
        simbolo: "CIGÜ",
        nombre: "Tecnocracia de Forja Muerta",
        valor: "768 CR",
        variacion: "+4.1%",
      },
      {
        simbolo: "MRCD",
        nombre: "Consorcio de Mercaderes (El Nexo)",
        valor: "1.221 CR",
        variacion: "-3.4%",
      },
      {
        simbolo: "VRDT",
        nombre: "República de Verdal Agro-Exportaciones",
        valor: "629 CR",
        variacion: "+0.2%",
      },
      {
        simbolo: "KRTH",
        nombre: "Kartha Armamento",
        valor: "2.597 CR",
        variacion: "+2.8%",
      },
      {
        simbolo: "SNTR",
        nombre: "Hermandad de Santuario Médica",
        valor: "1.103 CR",
        variacion: "+6.8%",
      },
      {
        simbolo: "HELO",
        nombre: "Cooperativa Hielo Eterno",
        valor: "504 CR",
        variacion: "-0.7%",
      },
      {
        simbolo: "ESFN",
        nombre: "La Esfinge Carmesí Producciones",
        valor: "350 CR",
        variacion: "+0.3%",
      },
      {
        simbolo: "PLVO",
        nombre: "Barones del Polvo Holdings",
        valor: "215 CR",
        variacion: "+2.0%",
      },
      {
        simbolo: "BARN",
        nombre: "El Barón — Operaciones Venas Rojas",
        valor: "— CR",
        variacion: "SUSPENDIDA",
      },
    ],
    tablon: {
      titulo: "[TABLÓN DE CONTRATOS]",
      contenido: [
        {
          tipo: "SE BUSCA",
          texto:
            "Tripulación experimentada para expedición no oficial a Sinaire, antes de que se regulen los permisos de acceso. Riesgo alto, reparto de beneficios a negociar. Preguntar discretamente, Módulo 9.",
        },
        {
          tipo: "COMPRO",
          texto:
            "Cualquier dato, mapa o registro previo a la Escisión sobre el sistema Sinaire, verificado o no. Pago generoso y discreción garantizada. Canal #ARCH-03.",
        },
        {
          tipo: "SE BUSCA",
          texto:
            "Personal médico con experiencia en toxicología de campo para contrato temporal en cuarentena de Santuario Orbital. No se requiere experiencia previa con biología no catalogada. Módulo 4, Ala Médica.",
        },
        {
          tipo: "RECOMPENSA",
          texto:
            "Se mantiene la recompensa de 500 CR por fragmentos identificables de la explosión de Venas Rojas para análisis independiente. Discreción garantizada. Canal #ECO-14.",
        },
        {
          tipo: "TRABAJO",
          texto:
            "Se necesitan inspectores adicionales de carga tras la cancelación de los contratos de futuros de Hematón. Experiencia en auditoría financiera valorada. Módulo 2, La Bolsa.",
        },
      ],
    },
    edictos: [
      {
        tipo: "TRÁNSITO",
        texto:
          "El acceso a la puerta de Salto de Sinaire queda restringido exclusivamente a personal autorizado de la Hermandad de Santuario hasta nuevo aviso. Cualquier nave no autorizada que intente el cruce será interceptada.",
      },
      {
        tipo: "SANIDAD",
        texto:
          "Se declara cuarentena provisional obligatoria para todo el personal que regrese de Espesura Roja. Queda prohibido el contacto directo con el fluido circulatorio del planeta fuera de protocolos autorizados.",
      },
      {
        tipo: "SEGURIDAD",
        texto:
          "El Consejo de la Cicatriz mantiene sin cambios la zona de exclusión alrededor de Venas Rojas, a la espera de resultados concluyentes del análisis de fragmentos recuperados.",
      },
      {
        tipo: "MERCADO",
        texto:
          "Se recuerda que todo contrato de futuros vinculado a Hematón de Venas Rojas queda formalmente anulado. Las reclamaciones deben tramitarse a través de los cauces habituales en El Nexo.",
      },
    ],
  },
  4: {
    numero: "LC-0004",
    fecha: "Año 1050 P.E. | Día 323 | 08:40 HST",
    precio: "5 CR (digital) | 10 CR (impreso)",
    destacada: {
      alerta: "CONVOCATORIA EXTRAORDINARIA",
      titulo:
        "EL LEÓN DEL NEXO ROMPE SU SILENCIO: CONVOCA A TODA LA CICATRIZ",
      subtitulo:
        "» Aldric Von Drevan exige, por primera vez en memoria reciente, presencia formal de los Barones del Polvo en la Mesa Fragmentada",
      contenido: [
        "Aldric Von Drevan ha roto esta semana un silencio que se prolongaba desde la emisión de su hijo Hadria, convocando una sesión extraordinaria de la Mesa Fragmentada al completo. Por primera vez en memoria reciente, la citación exige presencia formal de los Barones del Polvo junto al resto de facciones del sector.",
        "Ningún archivo de este periódico recoge la última vez que la Mesa se reunió en pleno con carácter de urgencia. Ni los archiveros más veteranos de El Nexo logran precisar la fecha con exactitud — algunos aseguran, sin poder confirmarlo, que fue antes de que naciera la mayoría de nuestros lectores.",
        "La convocatoria no viene acompañada de declaración de intenciones. Aldric no ha desmentido a su hijo. Tampoco lo ha respaldado. Su silencio, cuidadosamente medido, se ha convertido en la noticia en sí misma.",
        "La Cicatriz entera espera ahora una fecha, un lugar, y sobre todo, una explicación.",
      ],
    },
    columnas: [
      [
        {
          titulo:
            "[ASHENTAL] Míriam Ashental rompe el contrato de Orfeo y declara la guerra a los Cinco Capos",
          contenido: [
            "En uno de los gestos más audaces de la semana, Lady Míriam Ashental ha anunciado públicamente la ruptura unilateral del contrato que la unía al cantante Orfeo. «Lo que le hicieron no fue parte de ningún trato que yo firmara», ha declarado, en una intervención breve pero cargada de una furia que pocos recuerdan haberle visto antes.",
            "Ashental no se ha quedado en la ruptura. Ha acusado abiertamente a uno o varios de los Cinco Capos de El Nexo de complicidad o encubrimiento en lo ocurrido a Orfeo, sin ofrecer nombres — de momento. En los últimos días se han reportado ya varios incidentes violentos en zonas bajo influencia de los Capos: un almacén incendiado en el sector portuario, un enfrentamiento entre guardia privada de Ashental y hombres no identificados, y al menos un cadáver hallado en circunstancias que las autoridades locales prefieren no detallar.",
            "Nunca antes una mecenas del sector había declarado la guerra a un Capo en público. La pregunta que recorre El Nexo esta semana no es si habrá represalia, sino cuál de los cinco la ejecutará primero.",
          ],
        },
        {
          titulo:
            "[CASA VON DREVAN] La orden partió del propio patriarca, según testigos",
          contenido: [
            "Fuentes próximas a los muelles privados de la Casa Von Drevan aseguran que la orden de convocatoria partió directamente del propio Aldric, sin pasar por consejero alguno ni por su hijo Theron, encargado hasta ahora de la gestión cotidiana de la casa en El Nexo.",
            "La citación, según estas mismas fuentes, no llegó por los canales administrativos habituales, sino en persona, por mensajero de la propia casa — un gesto que varios analistas consultados por este periódico interpretan como deliberadamente solemne.",
          ],
        },
        {
          titulo:
            "[SINAIRE] Exploración en pausa: la Hermandad choca con la Tecnocracia",
          contenido: [
            "La Hermandad de Santuario ha suspendido temporalmente las expediciones hacia el sistema Sinaire, citando «reorganización de prioridades tras los sucesos recientes». La Tecnocracia de Forja Muerta, que había solicitado formalmente acceso a Silicial hace apenas dos semanas, ha protestado ante el Consejo de la Cicatriz, acusando a la Hermandad de utilizar la crisis actual como excusa para retener en exclusiva el control del enlace.",
            "Fuentes internas de la Hermandad, consultadas bajo anonimato, no ocultan cierto alivio ante la pausa. Este periódico no puede evitar preguntarse si ese alivio tiene algo que ver con lo que la Hermandad lleva semanas sin explicar sobre sus propios sensores.",
          ],
        },
        {
          titulo:
            "[LOS CINCO CAPOS] División interna ante el caos general",
          contenido: [
            "Fuentes internas describen una reunión de urgencia entre los Cinco Capos, convocada en paralelo a la Mesa Fragmentada pero mantenida, como es habitual, fuera del alcance de este periódico. Al menos dos de ellos verían con buenos ojos aprovechar el caos generalizado —Hadria, los Barones, ahora Ashental— para expandir territorio propio. Otros, sin embargo, temen que la «Cuenta Final» prometida por Hadria acabe salpicando también a quienes mantienen tratos con esclavistas del sector.",
            "Entre los cinco, el silencio de Kartha «La Viuda» resulta especialmente notorio esta semana. Ni una declaración, ni un desmentido, ni una palabra sobre la acusación de Ashental.",
          ],
        },
      ],
      [
        {
          titulo:
            "[BARONES DEL POLVO] Tregua entre Viento Rojo y Horno: un miedo que nadie nombra",
          contenido: [
            "El Barón Skarr, de Viento Rojo, y su homólogo de Horno han anunciado una tregua temporal, presentada oficialmente como «cooperación ante amenazas externas comunes». Ambos han ordenado, según fuentes internas de sus respectivos territorios, inspecciones exhaustivas de reactores, factorías y sistemas de soporte — una paranoia que ninguno de los dos ha sabido, o querido, justificar en público.",
            "Rivales durante generaciones, ambos Barones se encuentran ahora unidos por un miedo que ninguno de los dos se atreve a nombrar en voz alta: la advertencia de Hadria Von Drevan de que «Venas Rojas no era la única» sigue resonando esta semana en cada reactor de la Cicatriz.",
          ],
        },
        {
          titulo:
            "[SANTIGUA] La declaración de un noble menor: mucho honor, ningún compromiso",
          contenido: [
            "Desde Santigua, el Duque Bellamiro Osvent ha emitido esta semana una extensa declaración sobre «el deber ancestral de las casas nobles con el pueblo de la Cicatriz», cargada de referencias al honor heredado y la protección debida a los débiles. La declaración no incluye, en ninguno de sus párrafos, un solo compromiso concreto de flotas, recursos o intervención directa.",
            "Su declaración se ha hecho pública. Sus flotas, de momento, no.",
          ],
        },
        {
          titulo:
            "[ECONOMÍA] La Bolsa cierra cautelarmente ante la volatilidad",
          contenido: [
            "El Consorcio de Mercaderes ha decretado la suspensión de cotización en La Bolsa (Módulo 2 de El Nexo) ante la volatilidad extrema registrada desde la emisión de Hadria Von Drevan. Los activos vinculados a instalaciones de los Barones han caído en picado en cuestión de días, mientras inversores nerviosos retiran capital sin que nadie en el sector sepa todavía cómo valorar el riesgo real de una guerra abierta.",
            "El Consorcio no ha ofrecido fecha de reapertura. Este periódico seguirá informando en cuanto la haya.",
          ],
        },
        {
          titulo:
            "[SOCIEDAD] La Esfinge Carmesí, a la deriva",
          contenido: [
            "La nave-teatro La Esfinge Carmesí atraviesa la peor semana de su historia reciente. Al menos cuatro funciones han sido canceladas sin explicación oficial, y varios de sus artistas de «La Colección» han sido trasladados discretamente a otras naves de mecenas menores, según fuentes del entorno portuario de El Nexo.",
            "El Consorte Valerius Kaine, propietario nominal de la nave y habitualmente pródigo en apariciones públicas, no ha hecho declaración alguna desde la emisión de Hadria — algo que, en sí mismo, ya empieza a comentarse en los salones del sector como una ausencia elocuente. Fuentes cercanas a la tripulación hablan de tensión creciente entre Kaine y el Maestro Kaine, director musical de la nave, aunque ninguna de las dos partes ha confirmado nada al respecto.",
            "Con Orfeo fuera de contrato y Madame Vesper reduciendo sus apariciones en escena semana tras semana, algunos en El Nexo empiezan a preguntarse en voz baja si «el símbolo de que la belleza sobrevive en la Cicatriz» no estará, también él, a punto de irse a pique.",
          ],
        },
      ],
    ],
    mercados: {
      titulo: "[MERCADOS Y COTIZACIONES]",
      contenido: [
        {
          recurso: "Operaciones de La Bolsa (Consorcio de Mercaderes)",
          variacion: "CIERRE CAUTELAR",
          texto:
            "El Consorcio de Mercaderes decreta la suspensión de cotización ante la volatilidad extrema registrada desde la emisión de Hadria Von Drevan. Sin fecha de reapertura.",
        },
        {
          recurso: "Activos vinculados a los Barones del Polvo (general)",
          variacion: "▼ -19%",
          texto:
            "Caída generalizada mientras los inversores no encuentran forma de valorar el riesgo de una guerra abierta contra los Barones.",
        },
        {
          recurso: "Contratos de La Esfinge Carmesí Producciones",
          variacion: "▼ -12%",
          texto:
            "Cuatro funciones canceladas esta semana y ningún artista de renombre en cartel. El mercado empieza a dudar de la solvencia de la nave-teatro.",
        },
        {
          recurso: "Seguros y protección privada (general)",
          variacion: "▲ +26%",
          texto:
            "Disparada la demanda de servicios de protección anti-sabotaje entre instalaciones de los Barones, tras la advertencia de Hadria sobre reactores y factorías.",
        },
        {
          recurso: "Equipo de exploración y protección química (general)",
          variacion: "▼ -8%",
          texto:
            "La pausa de la Hermandad en Sinaire enfría de golpe la fiebre especulativa de la semana pasada.",
        },
        {
          recurso: "Contratos especulativos sobre silicio de Silicial (sin extraer)",
          variacion: "▼ -11%",
          texto:
            "Sin expediciones activas, el papel especulativo pierde parte del brillo que tuvo la semana anterior.",
        },
        {
          recurso: "Kartha Armamento",
          variacion: "▲ +9%",
          texto:
            "La incertidumbre general dispara la demanda de armamento entre facciones que prefieren no llegar desarmadas a lo que venga.",
        },
        {
          recurso: "Hierro de alta pureza (Viento Rojo)",
          variacion: "▲ +3.1%",
          texto:
            "La tregua con Horno estabiliza las rutas de exportación tras semanas de tensión.",
        },
        {
          recurso: "Savia cicatrizante (El Manantial)",
          variacion: "▲ +2%",
          texto: "Semana estable, sin sobresaltos en la producción.",
        },
      ],
    },
    rumores: {
      titulo: "[RUMORES Y SUSURROS]",
      contenido: [
        {
          titulo: "Un mensajero, no un canal",
          texto:
            "Se insiste en que Aldric eligió deliberadamente el gesto formal del mensajero en persona en vez de la vía administrativa habitual — algunos lo leen como preparación de algo mayor que una simple reunión de facciones.",
        },
        {
          titulo: "Rumbo a Santigua",
          texto:
            "Testigos en los muelles de El Nexo aseguran que una nave con distintivo parcialmente oculto de la Casa Von Drevan partió hacia Santigua horas después de la emisión de Hadria, con el propio Hadria a bordo. Nadie ha confirmado si viaja como invitado, como protegido o como algo distinto de ambas cosas.",
        },
        {
          titulo: "Los sensores que no callan",
          texto:
            "Vuelve a circular la sospecha, ya apuntada la semana pasada, de que la Hermandad sabía más de lo que ha admitido sobre la actividad al otro lado de la puerta de Sinaire — y que la pausa actual tiene menos que ver con «prioridades» y más con contener lo que sea que encontraron.",
        },
        {
          titulo: "El nombre que Ashental no dice",
          texto:
            "Varias fuentes dan por hecho que la acusación de Lady Míriam Ashental contra los Cinco Capos apunta a uno en concreto, aunque nadie se atreve a nombrarlo en público. El silencio de Kartha «La Viuda» esta semana no ayuda a despejar la duda.",
        },
        {
          titulo: "Una nave que se hunde en silencio",
          texto:
            "Se comenta en los salones de El Nexo que la tensión entre el Consorte Valerius Kaine y el Maestro Kaine, director musical de La Esfinge Carmesí, ya no es solo profesional. Ninguno de los dos ha querido hacer declaraciones.",
        },
        {
          titulo: "Reactores bajo la lupa",
          texto:
            "Se rumorea que no solo Viento Rojo y Horno han ordenado inspecciones internas tras la advertencia de Hadria: al menos otros dos Barones habrían solicitado, en privado, servicios de detección de sabotaje a contratistas de fuera del sector.",
        },
      ],
    },
    acciones: [
      {
        simbolo: "CIGÜ",
        nombre: "Tecnocracia de Forja Muerta",
        valor: "768 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "MRCD",
        nombre: "Consorcio de Mercaderes (El Nexo)",
        valor: "— CR",
        variacion: "CIERRE CAUTELAR",
      },
      {
        simbolo: "VRDT",
        nombre: "República de Verdal Agro-Exportaciones",
        valor: "629 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "KRTH",
        nombre: "Kartha Armamento",
        valor: "2.597 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "SNTR",
        nombre: "Hermandad de Santuario Médica",
        valor: "1.103 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "HELO",
        nombre: "Cooperativa Hielo Eterno",
        valor: "504 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "ESFN",
        nombre: "La Esfinge Carmesí Producciones",
        valor: "350 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "PLVO",
        nombre: "Barones del Polvo Holdings",
        valor: "215 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "VDRV",
        nombre: "Casa Von Drevan (mercado gris, fuera de La Bolsa)",
        valor: "1.940 CR",
        variacion: "+15.4%",
      },
    ],
    tablon: {
      titulo: "[TABLÓN DE CONTRATOS]",
      contenido: [
        {
          tipo: "SE BUSCA",
          texto:
            "Personal de seguridad con experiencia en detección de sabotaje e inspección de reactores. Contrato temporal, pago en efectivo, discreción absoluta. Preguntar en Módulo 6.",
        },
        {
          tipo: "TRABAJO",
          texto:
            "Se necesita personal de escolta para la guardia privada de Lady Míriam Ashental. Riesgo alto, compensación acorde. Interesados presentarse en las oficinas de La Esfinge Carmesí.",
        },
        {
          tipo: "COMPRO",
          texto:
            "Cualquier información verificable sobre la reunión de urgencia de los Cinco Capos. Pago generoso y discreción garantizada. Canal #ECO-14.",
        },
        {
          tipo: "SE BUSCA",
          texto:
            "Auditores financieros para revisar carteras expuestas al cierre cautelar de La Bolsa. Experiencia en correduría valorada. Módulo 2, La Bolsa.",
        },
        {
          tipo: "TRABAJO",
          texto:
            "La Esfinge Carmesí Producciones busca personal técnico y artístico de sustitución tras varias bajas recientes. Consultar condiciones a bordo.",
        },
      ],
    },
    edictos: [
      {
        tipo: "CONVOCATORIA",
        texto:
          "Se convoca sesión extraordinaria de la Mesa Fragmentada, con presencia obligatoria de todas las facciones reconocidas del Consejo de la Cicatriz, incluidos los Barones del Polvo. Fecha y lugar se comunicarán a través de los canales oficiales.",
      },
      {
        tipo: "MERCADO",
        texto:
          "Queda suspendida la cotización en La Bolsa del Consorcio de Mercaderes hasta nuevo aviso. Toda operación pendiente queda congelada.",
      },
      {
        tipo: "TRÁNSITO",
        texto:
          "Se mantiene la restricción de acceso a la puerta de Salto de Sinaire, ahora también sin actividad de expedición autorizada por parte de la Hermandad de Santuario.",
      },
      {
        tipo: "SEGURIDAD",
        texto:
          "Se recomienda a la población de El Nexo evitar las zonas portuarias bajo influencia de los Cinco Capos hasta que se aclaren los recientes incidentes violentos.",
      },
    ],
  },
  5: {
    numero: "LC-0005",
    fecha: "Año 1050 P.E. | Día 330 | 10:05 HST",
    precio: "5 CR (digital) | 10 CR (impreso)",
    destacada: {
      alerta: "EL GRANERO ABRE SUS PUERTAS",
      titulo: "VERDAL APRUEBA POR MAYORÍA ABRUMADORA LA PROPUESTA DE HADRIA VON DREVAN",
      subtitulo:
        "» El Consejo de Agricultores vota 10 contra 2 a favor de destinar sus excedentes a las comunidades que se levantan contra los Barones — un resultado que ha sorprendido incluso a los propios consejeros",
      contenido: [
        "El Consejo de Agricultores de Verdal ha aprobado esta semana, por una mayoría mucho más amplia de lo que este periódico y buena parte del sector anticipaban, poner parte de sus excedentes al servicio de las comunidades que hoy rompen con la esclavitud y el dominio de los Barones. La votación, 10 votos a favor y solo 2 en contra, se produjo tras una sesión cerrada a la que este periódico no tuvo acceso.",
        "El resultado ha causado sorpresa entre observadores del sector. La postura pública conocida de buena parte del Consejo, mantenida durante meses, había sido siempre conservadora en materia de reservas: priorizar el mercado y evitar comprometer excedentes en causas ajenas a Verdal. Nadie, ni dentro ni fuera de la sala, conocía de antemano el contenido exacto de la propuesta que Hadria Von Drevan iba a presentar. Lo insólito, según coinciden varias fuentes, es la rapidez con la que esa postura se invirtió durante la propia sesión.",
        "Según al menos tres fuentes presentes en la sala, consultadas por separado y bajo condición de anonimato, Hadria Von Drevan compareció ante el Consejo sin escolta armada ni gesto de amenaza — algo que sorprendió a varios consejeros tras su discurso de hace dos semanas. Se dirigió a ellos, según estas fuentes, apelando no a la caridad sino al interés a largo plazo de Verdal: pidió específicamente los excedentes que se pudren en almacenes por motivos de precio, no las reservas estratégicas ni la cosecha destinada a sus propias comunidades, y propuso condiciones estrictas de registro y trazabilidad para cada cargamento.",
        "Este periódico no puede confirmar con exactitud qué se dijo dentro de la sala, ni qué llevó a un margen tan holgado. Contamos, eso sí, con una imagen fija de origen no oficial —posiblemente tomada por personal de servicio presente durante la sesión— que acompaña esta pieza, y con la declaración pública que el propio Hadria ofreció ante las cámaras minutos después de conocerse el resultado.",
        "«Esta tarde, el Consejo de Verdal ha aprobado la puesta a disposición de parte de sus excedentes para sostener a las comunidades que están rompiendo con la esclavitud, la coerción y el dominio de los Barones», declaró Hadria Von Drevan ante los periodistas congregados a las puertas del Consejo. «Les felicito. No por generosidad — la generosidad es admirable, pero rara vez cambia una galaxia. Les felicito por haber comprendido algo mucho más importante: que sus graneros no servirán únicamente para mantener mercados, sino también para sostener hombres libres.»",
        "«Quiero que recuerden de dónde llegó el primer cargamento», añadió. «De Verdal. Del Granero de la Cicatriz. Cuando esta guerra termine, habrá pueblos que recuerden durante generaciones quién les ordenó obedecer... y quién les dio de comer.»",
        "El Consejo no ha detallado aún volúmenes, rutas ni calendario de los primeros envíos. Este periódico seguirá informando.",
      ],
    },
    columnas: [
      [
        {
          titulo:
            "[MESA FRAGMENTADA] Santigua, sede por primera vez en la historia",
          contenido: [
            "La sesión extraordinaria convocada por Aldric Von Drevan se celebrará en Santigua, según ha podido confirmar este periódico. Es la primera vez, en toda la documentación disponible de este periódico, que la Mesa Fragmentada se reúne fuera de El Nexo.",
            "Ni la Casa Von Drevan ni el Consejo de la Cicatriz han explicado el motivo del cambio de sede. Analistas consultados por este periódico se dividen entre quienes lo interpretan como un gesto de neutralidad hacia los Barones convocados y quienes creen que es, precisamente, lo contrario: una forma de recordarles en terreno ajeno quién dicta ahora los términos.",
          ],
        },
        {
          titulo:
            "[LOS CINCO CAPOS] La guerra de Ashental se cobra sus primeras bajas de peso",
          contenido: [
            "La disputa abierta por Lady Míriam Ashental contra los Cinco Capos ha dejado esta semana sus primeras víctimas de rango medio-alto confirmadas. Zaviel Cortenz, mano derecha de Shen el Susurro desde hace más de una década, ha sido hallado muerto en circunstancias que ninguna fuente ha querido detallar. Nadie ha reclamado responsabilidad. Nadie la ha negado tampoco.",
            "Los Gemelos Vex, por su parte, lamentan la pérdida de tres de sus cargos de mayor confianza: Orelyen Bofort, Katrin Vornhov y Livia Cavaljeri, muertos en circunstancias distintas y hasta ahora sin relación aparente entre sí, aunque coincidentes en el tiempo con la escalada abierta por Ashental. Ninguno de los Cinco Capos ha ofrecido declaración oficial.",
          ],
        },
        {
          titulo:
            "[SANTIGUA] La Duquesa Castalvor exige explicaciones por la sede de la Mesa",
          contenido: [
            "No todas las voces de Santigua han recibido con entusiasmo la noticia de acoger la Mesa Fragmentada. La Duquesa Irenne Castalvor ha exigido públicamente explicaciones a Aldric Von Drevan por lo que califica de «traer la guerra de los Barones hasta nuestras propias puertas».",
            "«Observar desde la distancia era, hasta ahora, el único privilegio real que nos quedaba», habría declarado la Duquesa ante allegados, según una fuente cercana a su casa. Su postura contrasta abiertamente con la de otros nobles menores que han optado por el silencio o la retórica vacía en semanas anteriores, y deja entrever una fractura cada vez más visible dentro de la propia Santigua.",
          ],
        },
        {
          titulo: "[RUTAS COMERCIALES] Repunte de ataques piratas",
          contenido: [
            "Varios convoyes de carga menor han sido atacados esta semana en rutas secundarias del sector, en incidentes que este periódico no vincula, por el momento, a ninguna facción organizada. Con la atención de las principales potencias del sector puesta en la crisis política, varias tripulaciones independientes advierten de un repunte claro de la actividad pirata oportunista.",
            "Se recomienda precaución a cualquier nave que opere fuera de las rutas principales vigiladas.",
          ],
        },
      ],
      [
        {
          titulo: "[SOCIEDAD] La Esfinge Carmesí, sin rumbo",
          contenido: [
            "La nave-teatro La Esfinge Carmesí ha cancelado la temporada completa, según ha podido confirmar este periódico, agravando el declive iniciado semanas atrás. Varios artistas de «La Colección» han abandonado ya la nave rumbo a mecenas menores, y el Consorte Valerius Kaine continúa sin ofrecer declaración pública alguna desde la emisión de Hadria Von Drevan.",
            "Fuentes del entorno portuario de El Nexo aseguran que al menos un mecenas menor de la nave ha empezado a mover conversaciones discretas para adquirir participación adicional a precio reducido, ante lo que interpreta como una quiebra inminente. La propia Esfinge no ha respondido a las preguntas de este periódico.",
          ],
        },
        {
          titulo:
            "[TRABAJO] Descontento y revuelta se extienden por varios mundos industriales",
          contenido: [
            "El malestar que Hadria Von Drevan prometió despertar hace semanas sigue extendiéndose, aunque de forma desigual. En Ceniza y en Pantano Gris, trabajadores han detenido la producción en enfrentamientos abiertos con capataces y guardia privada, con al menos varios heridos reportados en ambos casos.",
            "En Horno, la situación es distinta: fuentes locales describen asambleas, pintadas y paros parciales, pero ninguna revuelta abierta. Varios trabajadores consultados, bajo anonimato, coinciden en una misma idea: levantarse sin plan ni respaldo externo, en un planeta donde depender del patrón equivale a depender del aire que se respira, es sencillamente firmar una sentencia de muerte.",
            "También se han reportado disturbios en Viento Rojo, en El Manantial y en su luna Yesca, todos bajo dominio del Barón Skarr. Este periódico, sin embargo, advierte de que varios relatos que circulan sobre la magnitud de lo ocurrido en Viento Rojo parecen notablemente exagerados frente a lo que describen fuentes sobre el terreno, y recomienda cautela a sus lectores hasta que se confirme una versión fiable.",
          ],
        },
        {
          titulo:
            "[SEGURIDAD PRIVADA] Los precios de la protección se disparan",
          contenido: [
            "La demanda de mercenarios y «consultores de seguridad» ha crecido de forma notable en las últimas dos semanas, según varias correduras de contratos consultadas por este periódico. Barones, nobles y hasta algún mecenas particular buscan blindar reactores, factorías y residencias privadas ante un clima que ya nadie se atreve a calificar de pasajero.",
            "Los precios de contratación a corto plazo han subido con fuerza, y varias compañías de seguridad de mediana entidad reportan listas de espera por primera vez en años.",
          ],
        },
      ],
    ],
    mercados: {
      titulo: "[MERCADOS Y COTIZACIONES]",
      contenido: [
        {
          recurso: "Operaciones de La Bolsa (Consorcio de Mercaderes)",
          variacion: "CIERRE CAUTELAR",
          texto:
            "Se mantiene la suspensión de cotización decretada la semana pasada. Sin fecha de reapertura confirmada.",
        },
        {
          recurso: "Mercenarios y contratos de seguridad privada (general)",
          variacion: "▲ +34%",
          texto:
            "Disparada la demanda entre Barones, nobles y mecenas particulares ante el clima de inestabilidad general.",
        },
        {
          recurso: "Seguros de carga en rutas secundarias (general)",
          variacion: "▲ +22%",
          texto:
            "El repunte de actividad pirata encarece con fuerza cualquier póliza fuera de las rutas principales vigiladas.",
        },
        {
          recurso: "Grano y excedentes agrícolas (Verdal)",
          variacion: "▲ +6%",
          texto:
            "Primeras reacciones especulativas tras la aprobación del Consejo de Agricultores, aún sin volúmenes ni calendario confirmados.",
        },
        {
          recurso: "Contratos de La Esfinge Carmesí Producciones",
          variacion: "▼ -30%",
          texto:
            "La cancelación de la temporada completa hunde aún más la confianza del mercado en la nave-teatro.",
        },
        {
          recurso: "Hierro de alta pureza (Viento Rojo)",
          variacion: "▼ -4%",
          texto:
            "Los disturbios reportados en el territorio del Barón Skarr introducen incertidumbre en la producción, pese a la falta de confirmación sobre su verdadero alcance.",
        },
        {
          recurso: "Savia cicatrizante (El Manantial)",
          variacion: "▼ -9%",
          texto:
            "La producción se resiente ante los disturbios reportados en el propio oasis.",
        },
        {
          recurso: "Kartha Armamento",
          variacion: "▲ +5%",
          texto:
            "La incertidumbre general sigue sosteniendo la demanda de armamento entre facciones del sector.",
        },
      ],
    },
    rumores: {
      titulo: "[RUMORES Y SUSURROS]",
      contenido: [
        {
          titulo: "El otro hermano",
          texto:
            "Circula el rumor, sin ninguna confirmación, de que Theron Von Drevan se comporta de forma extraña desde la convocatoria de la Mesa Fragmentada: reuniones a puerta cerrada, ausencias sin explicar, y un silencio público que contrasta con su papel habitual al frente de la gestión cotidiana de la Casa en El Nexo.",
        },
        {
          titulo: "Dos votos que no cuadran",
          texto:
            "Al menos dos de los consejeros que finalmente votaron a favor de la propuesta de Hadria eran conocidos, por su postura pública sostenida durante meses, como firmes defensores de conservar las reservas de Verdal. Ninguno ha querido explicar públicamente qué le hizo cambiar de posición durante la propia sesión, y ambos han rechazado hasta ahora cualquier entrevista con este periódico.",
        },
        {
          titulo: "El silencio de la Viuda",
          texto:
            "Kartha «La Viuda» continúa sin pronunciarse sobre las muertes de Zaviel Cortenz ni de los cargos de los Gemelos Vex, pese a mantener intereses propios en el mismo círculo golpeado por la guerra de Ashental. Ese silencio, cada semana más largo, empieza a llamar la atención de más de un analista del sector.",
        },
        {
          titulo: "Compradores discretos",
          texto:
            "Se apunta a que el mecenas menor interesado en ampliar su participación en La Esfinge Carmesí podría no estar actuando solo, sino en representación de un tercero que prefiere permanecer, de momento, fuera de todo registro público.",
        },
        {
          titulo: "Lo que de verdad pasó en Viento Rojo",
          texto:
            "Al menos dos tripulaciones independientes que operan en la zona aseguran que lo ocurrido en Viento Rojo dista mucho de la versión que circula por el resto del sector — aunque, según ellas mismas reconocen, en direcciones opuestas: unas hablan de una revuelta mucho más contenida de lo que se cuenta, otras de una represión mucho más dura de lo que el Barón Skarr admite.",
        },
      ],
    },
    acciones: [
      {
        simbolo: "CIGÜ",
        nombre: "Tecnocracia de Forja Muerta",
        valor: "775 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "MRCD",
        nombre: "Consorcio de Mercaderes (El Nexo)",
        valor: "— CR",
        variacion: "CIERRE CAUTELAR",
      },
      {
        simbolo: "VRDT",
        nombre: "República de Verdal Agro-Exportaciones",
        valor: "629 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "KRTH",
        nombre: "Kartha Armamento",
        valor: "2.597 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "SNTR",
        nombre: "Hermandad de Santuario Médica",
        valor: "1.103 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "HELO",
        nombre: "Cooperativa Hielo Eterno",
        valor: "504 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "ESFN",
        nombre: "La Esfinge Carmesí Producciones",
        valor: "350 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "PLVO",
        nombre: "Barones del Polvo Holdings",
        valor: "215 CR (último cierre)",
        variacion: "PAUSADA",
      },
      {
        simbolo: "VDRV",
        nombre: "Casa Von Drevan (mercado gris, fuera de La Bolsa)",
        valor: "2.240 CR",
        variacion: "+15.5%",
      },
    ],
    tablon: {
      titulo: "[TABLÓN DE CONTRATOS]",
      contenido: [
        {
          tipo: "SE BUSCA",
          texto:
            "Escoltas armados para convoyes de carga en rutas secundarias. Pago por trayecto, riesgo alto. Preguntar en Módulo 6.",
        },
        {
          tipo: "TRABAJO",
          texto:
            "Personal de seguridad con experiencia en instalaciones industriales, contrato temporal renovable. Discreción absoluta. Interesados presentarse en Módulo 6.",
        },
        {
          tipo: "COMPRO",
          texto:
            "Cualquier información verificable sobre lo ocurrido esta semana en Viento Rojo. Pago generoso, discreción garantizada. Canal #ECO-14.",
        },
        {
          tipo: "TRABAJO",
          texto:
            "Se buscan tripulaciones con experiencia para escolta de los primeros cargamentos agrícolas de Verdal hacia comunidades en revuelta. Consultar condiciones en Puerto Raíz.",
        },
        {
          tipo: "SE BUSCA",
          texto:
            "Personal técnico y artístico de sustitución en La Esfinge Carmesí Producciones. Consultar condiciones a bordo — urgente.",
        },
      ],
    },
    edictos: [
      {
        tipo: "CONVOCATORIA",
        texto:
          "Se confirma que la sesión extraordinaria de la Mesa Fragmentada se celebrará en Santigua. Fecha exacta pendiente de anuncio oficial.",
      },
      {
        tipo: "SEGURIDAD",
        texto:
          "Se recomienda extremar la precaución en rutas secundarias del sector ante el repunte de actividad pirata reportado esta semana.",
      },
      {
        tipo: "MERCADO",
        texto:
          "Se mantiene la suspensión de cotización en La Bolsa del Consorcio de Mercaderes hasta nuevo aviso.",
      },
      {
        tipo: "TRABAJO",
        texto:
          "El Consejo de Agricultores de Verdal anunciará en los próximos días el procedimiento de registro y trazabilidad para los cargamentos de ayuda a comunidades en revuelta.",
      },
    ],
  },
};

// Ediciones especiales: fuera de la numeración semanal normal (no son "3.5" ni similar).
// Usan un layout distinto (sin mercados/rumores/tablón/edictos) y pueden incluir
// imágenes de una retransmisión en directo con el presentador Arcturus Morn,
// reservado exclusivamente para hechos de esta magnitud.
const especiales = {
  esp1: {
    numero: "ESP-01",
    fecha: "Año 1050 P.E. | Día 320 | 22:10 HST — EMISIÓN EN DIRECTO",
    etiqueta: "EDICIÓN ESPECIAL",
    programa: "EL OBSERVADOR DEL NEXO — CON ARCTURUS MORN",
    lema: "LA VERDAD TRASCIENDE. EL PODER CORROMPE.",
    destacada: {
      alerta: "TRANSMISIÓN DE EMERGENCIA",
      titulo:
        "HADRIA VON DREVAN ROMPE EL SILENCIO: «LA CASA VON DREVAN DECLARA LA GUERRA»",
      subtitulo:
        "» Lo que debía ser una entrevista de rutina con Arcturus Morn se convirtió en la transmisión más vista del sector: un heredero al que se daba por perdido reaparece armado, acompañado por Orfeo, y promete incendiar el orden establecido",
      imagen: "especial-hadria-01.png",
      contenido: [
        "El plató de Arcturus Morn está acostumbrado a nobles calculadores, comerciantes evasivos y militares que responden con monosílabos. No estaba preparado para esto. La emisión de esta noche se anunció como una entrevista más — perfil de sociedad, quizá una nota sobre la Casa Von Drevan tras años sin apariciones públicas de su heredero bastardo. En su lugar, El Nexo entero ha presenciado en directo una declaración de guerra.",
        "Arcturus Morn apenas alcanzó a formular su primera pregunta. Hadria Von Drevan, de pie junto al sillón que se suponía debía ocupar, con la armadura ceremonial de su casa y una espada en alto, levantó una mano y cortó la entrevista antes de que empezara: «No comencemos con una pregunta». Lo que siguió fue un monólogo ininterrumpido de más de veinte minutos que este periódico ha podido registrar íntegro.",
        "A su lado, en silencio durante toda la emisión, estaba sentado Orfeo — la voz más célebre del sector, desaparecida de los escenarios desde hace meses. La cicatriz en su garganta, allí donde le seccionaron las cuerdas vocales, quedó perfectamente visible ante las cámaras. No pronunció una sola palabra. No hizo falta: Hadria habló también por él.",
        "El contenido de la emisión —una acusación directa contra los Barones, la reivindicación de la destrucción de Venas Rojas y una declaración de guerra formal en nombre de la Casa Von Drevan sin confirmación alguna de su patriarca, Aldric— desborda con mucho el formato habitual de este periódico. Por eso, y solo por eso, El Observador del Nexo rompe su numeración semanal para dedicar esta edición especial, íntegramente, a lo ocurrido esta noche.",
      ],
    },
    piezas: [
      {
        titulo: "QUIÉN ES HADRIA VON DREVAN",
        contenido: [
          "Hijo bastardo reconocido de Aldric Von Drevan, «el León del Nexo», y de Hellena, una de las cantantes más célebres que ha dado la estación, Hadria perdió a su madre cuando tenía dieciséis años, en un accidente de vehículo que los registros oficiales de El Nexo nunca llegaron a esclarecer del todo. Poco se sabe con certeza de lo que ocurrió en los años siguientes dentro de la Casa.",
          "Este periódico ha intentado sin éxito acceder al expediente completo de aquel accidente; las pocas fuentes que han accedido a hablar, siempre bajo anonimato, coinciden en un detalle: nadie en la Casa Von Drevan quiso que se investigara demasiado a fondo.",
          "Según su propio relato de anoche, sirvió ocho años al Credo del Intercambio — el templo-orden de acreedores de El Nexo — hasta alcanzar el cargo de Mediador de Corporaciones. En su primera misión oficial fue secuestrado por piratas y vendido como esclavo a Venas Rojas, donde pasó los años siguientes.",
        ],
      },
      {
        titulo: "LA EMISIÓN, MINUTO A MINUTO",
        imagen: "especial-hadria-02.png",
        contenido: [
          "Hadria se presentó a sí mismo con títulos que ninguna casa le ha concedido oficialmente: «Verdugo de Venas Rojas», «Portador del Último Fuego». Relató sin pudor su propia caída — el secuestro, la venta, los años en las minas — antes de girar hacia la acusación central de la noche: que la destrucción de Venas Rojas, el suceso que ha ocupado nuestras portadas durante dos semanas, fue obra suya. Sin detallar el mecanismo ni reconocer cómplices, lanzó un aviso que ya corre por todo el sector: «Venas Rojas no era la única».",
          "A partir de ahí, la declaración formal: la Casa Von Drevan exige a todo Barón que posea esclavos la renuncia de sus títulos, la liberación de sus trabajadores forzados, la apertura de sus registros y la disolución de sus ejércitos privados. Quien no lo haga «por las buenas», advirtió, lo hará por las malas. Anunció además la publicación esta misma noche de un «Manifiesto de la Cuenta Final» con los procedimientos exactos.",
          "Cerró dirigiéndose directamente a su propia familia, adelantándose a cualquier intento de desacreditarlo con los escándalos de su juventud: «¿Devuelve eso la voz a Orfeo?». Ni la Casa Von Drevan ni Aldric han emitido comunicado alguno hasta el cierre de esta edición.",
        ],
      },
      {
        titulo: "LOS OTROS ROSTROS DEL DISCURSO",
        contenido: [
          "Hadria no habló solo en su propio nombre. Citó reiteradamente a tres personas más como «adalides» de lo que llamó una revolución: Kael «53» Vostok, técnico de Horno señalado como responsable de la catástrofe que intentó evitar; Radjem, buscador de agua de Viento Rojo esclavizado por reclamar un recurso básico; y Thomas Marrow — más conocido en ciertos círculos como «Nikola» —, científico de Santuario Orbital y sobrino del Magíster Elían Marrow, cabeza de la Orden de la Carne, que demostró que el llamado «gen aristocrático» de la élite de la estación no existe, antes de presenciar la represión sangrienta conocida como La Larga Noche.",
          "Ninguno de los tres apareció en el plató. Solo Orfeo, sentado junto a Hadria durante toda la emisión, puso rostro visible a las palabras del heredero — un silencio que, según coinciden varios analistas consultados por este periódico, pesó tanto como cualquiera de sus frases.",
        ],
      },
      {
        titulo: "PRIMERAS REACCIONES",
        contenido: [
          "El Nexo amaneció esta noche sin saber muy bien qué acaba de presenciar. Fuentes cercanas a Los Cinco Capos hablan de una reunión de urgencia convocada antes incluso de que terminara la transmisión. Los Barones, por su parte, guardan un silencio que este periódico no sabe interpretar todavía como prudencia o como pánico. De la Casa Von Drevan, ni una palabra.",
          "El Observador del Nexo seguirá esta historia en las próximas horas y días, según se conozcan más detalles y reacciones oficiales.",
        ],
      },
    ],
  },
};

let edicionActual = 1;
let modoEspecial = false;

function renderizarEdicion(numeroEdicion) {
  const edicion = ediciones[numeroEdicion];
  if (!edicion) return;

  modoEspecial = false;
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
  renderizarSelector();
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

// --- EDICIONES ESPECIALES ---
// Layout reducido: portada con imagen + piezas en profundidad a ancho completo.
// Sin mercados, rumores, tablón ni edictos — se limpian esas secciones para que
// no quede contenido residual de la última edición semanal visitada.
function renderizarEdicionEspecial(clave) {
  const especial = especiales[clave];
  if (!especial) return;

  modoEspecial = true;
  edicionActual = clave;

  document.getElementById("editionInfo").textContent =
    `${especial.etiqueta} ${especial.numero}`;
  document.getElementById("dateInfo").textContent = especial.fecha;
  document.querySelector(".price-info").textContent = especial.programa;

  renderizarDestacadaEspecial(especial.destacada, especial.lema);
  renderizarPiezasEspecial(especial.piezas);

  // Limpieza de secciones que no aplican a un especial
  const ticker = document.getElementById("tickerTrack");
  if (ticker) ticker.innerHTML = "";
  const marketRumor = document.getElementById("marketRumorSection");
  if (marketRumor) marketRumor.innerHTML = "";
  const tablon = document.getElementById("tablonSection");
  if (tablon) tablon.innerHTML = "";
  const oficial = document.querySelector(".official-notices .official-content");
  if (oficial) oficial.innerHTML = "";

  renderizarSelector();
}

function renderizarDestacadaEspecial(destacada, lema) {
  const section = document.getElementById("featuredNews");
  let html = destacada.alerta
    ? `<div class="alert-banner">${destacada.alerta}</div>`
    : "";
  if (lema) html += `<p class="especial-lema">${lema}</p>`;
  html += `<h2 class="featured-title">${destacada.titulo}</h2>
             <p class="featured-subtitle">${destacada.subtitulo}</p>`;
  if (destacada.imagen) {
    html += `<img class="especial-portada-img" src="${destacada.imagen}" alt="${destacada.titulo}">`;
  }
  html += `<div class="featured-content">`;
  destacada.contenido.forEach((p, i) => {
    html += `<p${i === 0 ? ' class="dropcap"' : ""}>${p}</p>`;
  });
  html += `</div>`;
  section.innerHTML = html;
}

function renderizarPiezasEspecial(piezas) {
  const container = document.querySelector(".news-columns");
  if (!container) return;
  const html = piezas
    .map((pieza) => {
      const imagenHtml = pieza.imagen
        ? `<img class="especial-pieza-img" src="${pieza.imagen}" alt="${pieza.titulo}">`
        : "";
      return `<article class="news-article especial-pieza"><h3>${pieza.titulo}</h3>${imagenHtml}${pieza.contenido.map((p) => `<p>${p}</p>`).join("")}</article>`;
    })
    .join("");
  container.innerHTML = `<div class="column especial-columna-unica">${html}</div>`;
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

// Genera automáticamente un botón por cada edición normal Y por cada especial.
// Añadir una edición o un especial a sus objetos respectivos es suficiente para
// que aparezca aquí sin tocar el HTML. Los especiales se distinguen con su propia
// clase visual, y no ocupan hueco en la numeración semanal (no son "3.5").
function renderizarSelector() {
  const selector = document.getElementById("editionSelector");
  if (!selector) return;

  const numeros = Object.keys(ediciones)
    .map(Number)
    .sort((a, b) => a - b);
  const clavesEspeciales = Object.keys(especiales);

  if (numeros.length <= 1 && clavesEspeciales.length === 0) {
    selector.innerHTML = "";
    return;
  }

  // Orden de publicación real: cada edición normal y cada especial lleva un
  // número de "día" en su campo fecha. Los combinamos y ordenamos por ese día
  // para que el selector siga el orden cronológico en el que se publicaron,
  // en vez de mostrar siempre primero todas las normales y luego los especiales.
  const extraerDia = (fecha) => {
    const match = fecha.match(/Día (\d+)/);
    return match ? Number(match[1]) : 0;
  };

  const itemsNormales = numeros.map((n) => ({
    tipo: "normal",
    clave: n,
    dia: extraerDia(ediciones[n].fecha),
  }));
  const itemsEspeciales = clavesEspeciales.map((clave) => ({
    tipo: "especial",
    clave,
    dia: extraerDia(especiales[clave].fecha),
  }));

  const itemsOrdenados = [...itemsNormales, ...itemsEspeciales].sort(
    (a, b) => a.dia - b.dia,
  );

  const html = itemsOrdenados
    .map((item) => {
      if (item.tipo === "normal") {
        const activa =
          !modoEspecial && item.clave === edicionActual ? " active" : "";
        return `<button class="edition-btn${activa}" data-edicion="${item.clave}">${item.clave}</button>`;
      }
      const activa =
        modoEspecial && item.clave === edicionActual ? " active" : "";
      return `<button class="edition-btn edition-btn-especial${activa}" data-especial="${item.clave}">${especiales[item.clave].numero}</button>`;
    })
    .join("");

  selector.innerHTML = html;

  selector.querySelectorAll(".edition-btn[data-edicion]").forEach((btn) => {
    btn.addEventListener("click", () =>
      cambiarEdicion(Number(btn.dataset.edicion)),
    );
  });
  selector.querySelectorAll(".edition-btn[data-especial]").forEach((btn) => {
    btn.addEventListener("click", () =>
      cambiarAEspecial(btn.dataset.especial),
    );
  });
}

function cambiarEdicion(n) {
  if (ediciones[n]) {
    modoEspecial = false;
    renderizarEdicion(n);
    localStorage.setItem("edicionActual", String(n));
  }
}

function cambiarAEspecial(clave) {
  if (especiales[clave]) {
    renderizarEdicionEspecial(clave);
    localStorage.setItem("edicionActual", clave);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const guardada = localStorage.getItem("edicionActual");
  if (guardada && especiales[guardada]) {
    renderizarEdicionEspecial(guardada);
    return;
  }
  const numeroGuardado = parseInt(guardada, 10);
  const inicial = ediciones[numeroGuardado]
    ? numeroGuardado
    : Math.min(...Object.keys(ediciones).map(Number));
  renderizarEdicion(inicial);
});

window.observadorDelNexo = { cambiarEdicion, cambiarAEspecial, ediciones, especiales };
