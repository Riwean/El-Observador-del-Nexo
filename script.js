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
            "[VERDANTE] Familias del Consejo de Agricultores chocan por el reparto del excedente",
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
