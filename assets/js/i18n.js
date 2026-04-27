/* =====================================================
   BFC — i18n SYSTEM
   ES (default) · EN · PT-BR
   Usage: <element data-i18n="key.sub"> or data-i18n-html for HTML content
   ===================================================== */

const BFC_I18N = {
  es: {
    nav: {
      home: 'Inicio',
      academy: 'Academia',
      schedule: 'Horarios',
      coaches: 'Profesores',
      tapa: 'Tapa Team',
      store: 'Tienda',
      contact: 'Contacto',
      cta: 'Entrenar ahora'
    },
    hero: {
      location: 'Godoy Cruz · Mendoza · Argentina',
      tag: 'K1 · Muay Thai · MMA · Wrestling',
      l1: 'Bonati',
      l2: 'Fight',
      l3: 'Club',
      sub: 'Donde se forjan los campeones del kickboxing sudamericano.',
      cta1: 'Comenzar a entrenar',
      cta2: 'Ver la academia',
      scroll: 'Desliza para descubrir'
    },
    counters: {
      years: 'Años formando atletas',
      students: 'Alumnos activos',
      champs: 'Campeones sudamericanos'
    },
    marquee: [
      'Donde se forjan campeones',
      'K1 · Muay Thai · MMA · Wrestling',
      'Godoy Cruz, Mendoza',
      '#SiempreBFC',
      'Walter Bonati Head Coach',
      'Desde Cuyo para el mundo'
    ],
    disc: {
      eyebrow: '01 — Disciplinas',
      title: 'Arte marcial. <b>Mentalidad de guerra.</b>',
      lead: 'Cuatro disciplinas, una sola filosofía: disciplina, respeto y voluntad para competir al más alto nivel.',
      k1: {
        kicker: 'Stand-up striking',
        name: 'K1 Kickboxing',
        desc: 'Técnica de golpeo japonés que combina boxeo con patadas. Ritmo, explosividad y precisión.',
        cta: 'Conocer la clase'
      },
      mt: {
        kicker: 'The art of eight limbs',
        name: 'Muay Thai',
        desc: 'Boxeo tailandés: puños, codos, rodillas y patadas. La disciplina más completa de pie.',
        cta: 'Conocer la clase'
      },
      mma: {
        kicker: 'Tapa Team',
        name: 'MMA & Wrestling',
        desc: 'Artes marciales mixtas y lucha. El futuro del combate completo en Mendoza.',
        cta: 'Ver Tapa Team'
      }
    },
    champions: {
      eyebrow: '02 — Campeones',
      quote: 'En Bonati Fight Club formamos <b>campeones para la vida.</b>',
      role: 'Nuestro atleta estrella',
      titles: [
        { year: '2019', name: 'Medalla de Oro — Sudamericano WKF',     belt: 'Seleccionado' },
        { year: '2021', name: 'Campeón Argentino — FFG',                belt: 'Título Nacional' },
        { year: '2023', name: 'Campeón Argentino — ISKA',               belt: 'Título Nacional' },
        { year: '2025', name: 'Campeón Sudamericano — FFG (KO vs Jonas Coelho, Brasil)', belt: 'Título Continental' },
        { year: '2025', name: 'Distinguido por el Senado de Mendoza',   belt: 'Honor Provincial' }
      ]
    },
    history: {
      eyebrow: '03 — Historia',
      title: 'Quince años <b>forjando leyendas</b> en Cuyo.',
      p1: 'Walter Bonati fundó el club desde la pasión, con un objetivo claro: llevar el kickboxing mendocino al nivel profesional. Lo que empezó como un proyecto de barrio creció hasta convertirse en una de las academias más reconocidas de Argentina.',
      p2: 'Durante la pandemia (2020–2021) fue reconocida entre las academias destacadas de Mendoza por su capacidad de adaptación y continuidad. Hoy alberga las disciplinas de K1 y Muay Thai, y a través de Tapa Team, MMA y Wrestling.',
      quote: 'Aquí en Bonati prevalece la decisión de hacer las cosas.',
      quoteBy: 'Walter Bonati · Head Coach',
      tl: [
        { y: '2010', t: 'Fundación', d: 'Walter Bonati abre las puertas del gimnasio en Godoy Cruz.' },
        { y: '2019', t: 'Primer medallero sudamericano', d: 'Gastón "Tonga" Silva trae la medalla de oro WKF.' },
        { y: '2021', t: 'Se adapta y resiste', d: 'BFC reconocida por su continuidad durante la pandemia.' },
        { y: '2023', t: 'Nace Tapa Team', d: 'Se incorpora el equipo de MMA y Wrestling dentro del gym.' },
        { y: '2025', t: 'Campeón Sudamericano FFG', d: 'KO histórico vs Jonas Coelho en Brasil. Senado de Mendoza reconoce al atleta.' }
      ]
    },
    prof: {
      eyebrow: '04 — Profesores',
      title: 'Head coach <b>y campeón.</b>',
      walter: {
        role: 'Fundador · Head Coach',
        quote: 'Aquí en Bonati prevalece la decisión de hacer las cosas.',
        bullets: [
          'Especialidad: K1 y Muay Thai',
          'Más de 15 años de coaching profesional',
          'Fundador de Bonati Fight Club'
        ]
      },
      gaston: {
        role: 'Atleta · Profesor',
        quote: 'Si entrás acá, entrás para dejar algo.',
        bullets: [
          'Campeón Sudamericano FFG 2025',
          'Campeón Argentino ISKA 2023',
          'Campeón Argentino FFG 2021',
          'Medalla Oro Sudamericano WKF 2019',
          'Distinguido por el Senado de Mendoza'
        ]
      },
      ig: 'Ver Instagram'
    },
    sch: {
      eyebrow: '05 — Horarios',
      title: 'Elegí tu <b>round.</b>',
      lead: 'Clases de lunes a viernes para todos los niveles. Sin horario? Escribinos y armamos uno.',
      cta: 'Consultar por clases',
      walter: { coach: 'Walter Bonati', days: 'Lun a Vie' },
      gaston: { coach: 'Gastón Silva', days1: 'LUN · MAR · MIÉ · JUE · VIE', days2: 'LUN · MAR · JUE' },
      disc1: 'K1 / Muay Thai',
      disc2: 'Técnica / Sparring'
    },
    tapa: {
      eyebrow: '06 — Tapa Team',
      title: 'Tapa Team. <b>MMA & Wrestling.</b>',
      lead: 'El equipo de MMA y Wrestling que opera dentro de BFC. Fundado hace aproximadamente un año y ya compite en eventos locales y nacionales — el futuro de las artes marciales mixtas mendocinas.',
      s1: 'Fundado', s1v: '2024',
      s2: 'Eventos', s2v: 'Locales y nacionales',
      s3: 'Disciplinas', s3v: 'MMA · Wrestling · Submission',
      cta1: 'WhatsApp MMA',
      cta2: 'Ver página completa'
    },
    comm: {
      eyebrow: '07 — Comunidad',
      title: 'Comunidad <b>BFC.</b>',
      lead: 'Las fotos de nuestra gente. El gimnasio visto desde adentro.',
      filterAll:       'Todos',
      filterTraining:  'Entrenamientos',
      filterTournaments: 'Torneos',
      filterTeam:      'Equipo',
      empty:           'Sé el primero en subir una foto de la comunidad.',
      uploadBtn:       'Subir mi foto',
      modal: {
        title:            'Subir mi foto',
        drop:             'Arrastrá tu foto aquí o hacé clic para seleccionar',
        authorPlaceholder:'Tu nombre (opcional)',
        submit:           'Enviar foto',
        note:             'Tu foto será revisada antes de publicarse.'
      }
    },
    rev: {
      eyebrow:    '08 — Reseñas',
      title:      'Lo que dice <b>nuestra comunidad.</b>',
      lead:       'Opiniones reales de nuestros alumnos.',
      formTitle:  'Dejá tu reseña',
      namePlaceholder: 'Tu nombre',
      textPlaceholder: '¿Qué te pareció el gimnasio?',
      submit:     'Enviar reseña',
      googleBtn:  'Dejar reseña en Google →'
    },
    spot: {
      title: 'La academia. <b>Sin filtros.</b>',
      lead: 'Video en loop: un vistazo a la energía, la disciplina y el día a día del gimnasio.',
      cta: 'Conocer la academia'
    },
    contact: {
      eyebrow: '09 — Contacto',
      title: 'Entrená con <b>nosotros.</b>',
      lead: 'Estamos en el corazón de Godoy Cruz. Reservá 2 clases de prueba gratuitas.',
      addr: 'Balcarce 230',
      city: 'Godoy Cruz, Mendoza',
      walter: 'Walter · K1 / Muay Thai',
      tapa: 'Tapa Team · MMA / Wrestling',
      ig: 'Instagram oficial',
      formName: 'Tu nombre',
      formPlaceholderName: 'Nombre y apellido',
      formAge: 'Tu edad',
      formAgePlaceholder: 'Ej: 25',
      formModality: 'Modalidad que te interesa',
      modK1: 'K1 / Muay Thai',
      modMMA: 'MMA / Wrestling',
      formTime: 'Franja horaria',
      timeMorning: 'Mañana',
      timeAfternoon: 'Tarde',
      formSend: 'Enviar por WhatsApp'
    },
    footer: {
      tag: 'Desde 2010 formando atletas de élite en el corazón de Godoy Cruz, Mendoza.',
      h1: 'Academia',
      h2: 'Info',
      h3: 'Síguenos',
      copyright: '© 2025 Bonati Fight Club · Godoy Cruz, Mendoza, Argentina',
      hash: '#SiempreBFC'
    }
  },

  en: {
    nav: {
      home: 'Home', academy: 'Academy', schedule: 'Schedule', coaches: 'Coaches',
      tapa: 'Tapa Team', store: 'Store', contact: 'Contact', cta: 'Train now'
    },
    hero: {
      location: 'Godoy Cruz · Mendoza · Argentina',
      tag: 'K1 · Muay Thai · MMA · Wrestling',
      l1: 'Bonati', l2: 'Fight', l3: 'Club',
      sub: 'Where South American kickboxing champions are forged.',
      cta1: 'Start training', cta2: 'Explore the gym',
      scroll: 'Scroll to discover'
    },
    counters: {
      years: 'Years training athletes',
      students: 'Active students',
      champs: 'South American champions'
    },
    marquee: [
      'Where champions are forged',
      'K1 · Muay Thai · MMA · Wrestling',
      'Godoy Cruz, Mendoza',
      '#SiempreBFC',
      'Walter Bonati Head Coach',
      'From Cuyo to the world'
    ],
    disc: {
      eyebrow: '01 — Disciplines',
      title: 'Martial art. <b>Warrior mindset.</b>',
      lead: 'Four disciplines, one philosophy: discipline, respect and the will to compete at the highest level.',
      k1: { kicker: 'Stand-up striking', name: 'K1 Kickboxing', desc: 'Japanese striking that blends boxing with kicks. Rhythm, explosiveness, precision.', cta: 'Learn more' },
      mt: { kicker: 'The art of eight limbs', name: 'Muay Thai', desc: 'Thai boxing: fists, elbows, knees and kicks. The most complete stand-up discipline.', cta: 'Learn more' },
      mma: { kicker: 'Tapa Team', name: 'MMA & Wrestling', desc: 'Mixed martial arts and wrestling. The future of complete combat in Mendoza.', cta: 'See Tapa Team' }
    },
    champions: {
      eyebrow: '02 — Champions',
      quote: 'At Bonati Fight Club we build <b>champions for life.</b>',
      role: 'Our flagship athlete',
      titles: [
        { year: '2019', name: 'Gold Medal — WKF South American', belt: 'National team' },
        { year: '2021', name: 'Argentine Champion — FFG',        belt: 'National title' },
        { year: '2023', name: 'Argentine Champion — ISKA',       belt: 'National title' },
        { year: '2025', name: 'South American Champion — FFG (KO vs Jonas Coelho, Brazil)', belt: 'Continental title' },
        { year: '2025', name: 'Honored by the Senate of Mendoza',  belt: 'Provincial honor' }
      ]
    },
    history: {
      eyebrow: '03 — History',
      title: 'Fifteen years <b>forging legends</b> in Cuyo.',
      p1: 'Walter Bonati founded the club out of passion, with one goal: take Mendozan kickboxing to the professional level. What started as a neighborhood project grew into one of the most respected martial arts academies in Argentina.',
      p2: 'During the pandemic (2020–2021) it was recognized among the leading academies in Mendoza for its resilience. Today it houses K1 and Muay Thai, plus MMA and Wrestling through Tapa Team.',
      quote: 'At Bonati, the will to get things done prevails.',
      quoteBy: 'Walter Bonati · Head Coach',
      tl: [
        { y: '2010', t: 'Founded',                       d: 'Walter Bonati opens the doors of the gym in Godoy Cruz.' },
        { y: '2019', t: 'First South American medal',    d: 'Gastón "Tonga" Silva brings home the WKF gold medal.' },
        { y: '2021', t: 'Adapting and resisting',        d: 'BFC recognized for its continuity during the pandemic.' },
        { y: '2023', t: 'Tapa Team is born',             d: 'MMA and Wrestling team launches inside the gym.' },
        { y: '2025', t: 'FFG South American Champion',   d: 'Historic KO vs Jonas Coelho in Brazil. Mendoza Senate honors the athlete.' }
      ]
    },
    prof: {
      eyebrow: '04 — Coaches',
      title: 'Head coach <b>and champion.</b>',
      walter: { role: 'Founder · Head Coach', quote: 'At Bonati, the will to get things done prevails.', bullets: ['Specialty: K1 & Muay Thai','15+ years of professional coaching','Founder of Bonati Fight Club'] },
      gaston: { role: 'Athlete · Coach',       quote: 'If you walk in, you walk in to leave something.', bullets: ['FFG South American Champion 2025','ISKA Argentine Champion 2023','FFG Argentine Champion 2021','WKF South American Gold 2019','Honored by the Senate of Mendoza'] },
      ig: 'View Instagram'
    },
    sch: {
      eyebrow: '05 — Schedule',
      title: 'Pick your <b>round.</b>',
      lead: 'Classes Monday to Friday for all levels. No slot works? Write us and we build one.',
      cta: 'Ask about classes',
      walter: { coach: 'Walter Bonati', days: 'Mon to Fri' },
      gaston: { coach: 'Gastón Silva', days1: 'MON · TUE · WED · THU · FRI', days2: 'MON · TUE · THU' },
      disc1: 'K1 / Muay Thai', disc2: 'Technique / Sparring'
    },
    tapa: {
      eyebrow: '06 — Tapa Team',
      title: 'Tapa Team. <b>MMA & Wrestling.</b>',
      lead: 'The MMA and Wrestling team operating inside BFC. Founded roughly a year ago and already competing in local and national events — the future of mixed martial arts in Mendoza.',
      s1: 'Founded', s1v: '2024',
      s2: 'Events', s2v: 'Local and national',
      s3: 'Disciplines', s3v: 'MMA · Wrestling · Submission',
      cta1: 'WhatsApp MMA', cta2: 'Full page'
    },
    comm: {
      eyebrow: '07 — Community',
      title: 'BFC <b>Community.</b>',
      lead: 'Photos from our people. The gym seen from the inside.',
      filterAll:         'All',
      filterTraining:    'Training',
      filterTournaments: 'Tournaments',
      filterTeam:        'Team',
      empty:             'Be the first to upload a community photo.',
      uploadBtn:         'Upload my photo',
      modal: {
        title:            'Upload my photo',
        drop:             'Drag your photo here or click to select',
        authorPlaceholder:'Your name (optional)',
        submit:           'Send photo',
        note:             'Your photo will be reviewed before publishing.'
      }
    },
    rev: {
      eyebrow:    '08 — Reviews',
      title:      'What our <b>community says.</b>',
      lead:       'Real opinions from our students.',
      formTitle:  'Leave a review',
      namePlaceholder: 'Your name',
      textPlaceholder: 'What did you think of the gym?',
      submit:     'Send review',
      googleBtn:  'Leave a Google review →'
    },
    spot: {
      title: 'The academy. <b>No filters.</b>',
      lead: 'Looped video: a glimpse of the energy, discipline and daily life of the gym.',
      cta: 'Meet the academy'
    },
    contact: {
      eyebrow: '09 — Contact',
      title: 'Train with <b>us.</b>',
      lead: 'We are in the heart of Godoy Cruz. Book your 2 free trial classes.',
      addr: '230 Balcarce St.', city: 'Godoy Cruz, Mendoza',
      walter: 'Walter · K1 / Muay Thai', tapa: 'Tapa Team · MMA / Wrestling', ig: 'Official Instagram',
      formName: 'Your name', formPlaceholderName: 'Full name',
      formAge: 'Your age', formAgePlaceholder: 'E.g. 25',
      formModality: 'Discipline you are interested in',
      modK1: 'K1 / Muay Thai', modMMA: 'MMA / Wrestling',
      formTime: 'Preferred time slot',
      timeMorning: 'Morning', timeAfternoon: 'Afternoon',
      formSend: 'Send via WhatsApp'
    },
    footer: {
      tag: 'Training elite athletes in the heart of Godoy Cruz, Mendoza since 2010.',
      h1: 'Academy', h2: 'Info', h3: 'Follow us',
      copyright: '© 2025 Bonati Fight Club · Godoy Cruz, Mendoza, Argentina',
      hash: '#SiempreBFC'
    }
  },

  pt: {
    nav: {
      home: 'Início', academy: 'Academia', schedule: 'Horários', coaches: 'Professores',
      tapa: 'Tapa Team', store: 'Loja', contact: 'Contato', cta: 'Treinar agora'
    },
    hero: {
      location: 'Godoy Cruz · Mendoza · Argentina',
      tag: 'K1 · Muay Thai · MMA · Wrestling',
      l1: 'Bonati', l2: 'Fight', l3: 'Club',
      sub: 'Onde se forjam os campeões do kickboxing sul-americano.',
      cta1: 'Começar a treinar', cta2: 'Conhecer a academia',
      scroll: 'Deslize para descobrir'
    },
    counters: {
      years: 'Anos formando atletas',
      students: 'Alunos ativos',
      champs: 'Campeões sul-americanos'
    },
    marquee: [
      'Onde se forjam campeões',
      'K1 · Muay Thai · MMA · Wrestling',
      'Godoy Cruz, Mendoza',
      '#SiempreBFC',
      'Walter Bonati Head Coach',
      'Do Cuyo para o mundo'
    ],
    disc: {
      eyebrow: '01 — Modalidades',
      title: 'Arte marcial. <b>Mentalidade de guerra.</b>',
      lead: 'Quatro modalidades, uma filosofia: disciplina, respeito e vontade de competir no mais alto nível.',
      k1: { kicker: 'Stand-up striking', name: 'K1 Kickboxing', desc: 'Golpeio japonês que mistura boxe e chutes. Ritmo, explosão e precisão.', cta: 'Saiba mais' },
      mt: { kicker: 'A arte das oito armas', name: 'Muay Thai', desc: 'Boxe tailandês: punhos, cotovelos, joelhos e chutes. A modalidade em pé mais completa.', cta: 'Saiba mais' },
      mma: { kicker: 'Tapa Team', name: 'MMA & Wrestling', desc: 'Artes marciais mistas e luta olímpica. O futuro do combate completo em Mendoza.', cta: 'Ver Tapa Team' }
    },
    champions: {
      eyebrow: '02 — Campeões',
      quote: 'No Bonati Fight Club formamos <b>campeões para a vida.</b>',
      role: 'Nosso atleta destaque',
      titles: [
        { year: '2019', name: 'Medalha de Ouro — Sul-Americano WKF',  belt: 'Seleção' },
        { year: '2021', name: 'Campeão Argentino — FFG',              belt: 'Título Nacional' },
        { year: '2023', name: 'Campeão Argentino — ISKA',             belt: 'Título Nacional' },
        { year: '2025', name: 'Campeão Sul-Americano — FFG (KO vs Jonas Coelho, Brasil)', belt: 'Título Continental' },
        { year: '2025', name: 'Homenageado pelo Senado de Mendoza',   belt: 'Honra Provincial' }
      ]
    },
    history: {
      eyebrow: '03 — História',
      title: 'Quinze anos <b>forjando lendas</b> no Cuyo.',
      p1: 'Walter Bonati fundou o clube por paixão, com um objetivo: levar o kickboxing mendocino ao nível profissional. O que começou como um projeto de bairro virou uma das academias mais respeitadas da Argentina.',
      p2: 'Durante a pandemia (2020–2021) foi reconhecida entre as principais academias de Mendoza pela capacidade de adaptação. Hoje abriga K1 e Muay Thai, e através do Tapa Team, MMA e Wrestling.',
      quote: 'Aqui em Bonati prevalece a decisão de fazer as coisas.',
      quoteBy: 'Walter Bonati · Head Coach',
      tl: [
        { y: '2010', t: 'Fundação',                        d: 'Walter Bonati abre as portas da academia em Godoy Cruz.' },
        { y: '2019', t: 'Primeira medalha sul-americana', d: 'Gastón "Tonga" Silva conquista o ouro na WKF.' },
        { y: '2021', t: 'Adapta-se e resiste',             d: 'BFC reconhecida pela continuidade durante a pandemia.' },
        { y: '2023', t: 'Nasce o Tapa Team',               d: 'Time de MMA e Wrestling entra na academia.' },
        { y: '2025', t: 'Campeão Sul-Americano FFG',       d: 'KO histórico sobre Jonas Coelho no Brasil. Senado de Mendoza homenageia o atleta.' }
      ]
    },
    prof: {
      eyebrow: '04 — Professores',
      title: 'Head coach <b>e campeão.</b>',
      walter: { role: 'Fundador · Head Coach', quote: 'Aqui em Bonati prevalece a decisão de fazer as coisas.', bullets: ['Especialidade: K1 e Muay Thai','Mais de 15 anos de coaching profissional','Fundador do Bonati Fight Club'] },
      gaston: { role: 'Atleta · Professor',     quote: 'Se você entra aqui, entra para deixar algo.', bullets: ['Campeão Sul-Americano FFG 2025','Campeão Argentino ISKA 2023','Campeão Argentino FFG 2021','Medalha de Ouro Sul-Americano WKF 2019','Homenageado pelo Senado de Mendoza'] },
      ig: 'Ver Instagram'
    },
    sch: {
      eyebrow: '05 — Horários',
      title: 'Escolha seu <b>round.</b>',
      lead: 'Aulas de segunda a sexta para todos os níveis. Sem horário? Escreva e a gente monta.',
      cta: 'Consultar aulas',
      walter: { coach: 'Walter Bonati', days: 'Seg a Sex' },
      gaston: { coach: 'Gastón Silva', days1: 'SEG · TER · QUA · QUI · SEX', days2: 'SEG · TER · QUI' },
      disc1: 'K1 / Muay Thai', disc2: 'Técnica / Sparring'
    },
    tapa: {
      eyebrow: '06 — Tapa Team',
      title: 'Tapa Team. <b>MMA & Wrestling.</b>',
      lead: 'Time de MMA e Wrestling que opera dentro do BFC. Fundado há cerca de um ano e já competindo em eventos locais e nacionais — o futuro do MMA mendocino.',
      s1: 'Fundado', s1v: '2024',
      s2: 'Eventos', s2v: 'Locais e nacionais',
      s3: 'Modalidades', s3v: 'MMA · Wrestling · Submission',
      cta1: 'WhatsApp MMA', cta2: 'Página completa'
    },
    comm: {
      eyebrow: '07 — Comunidade',
      title: 'Comunidade <b>BFC.</b>',
      lead: 'Fotos da nossa turma. A academia vista por dentro.',
      filterAll:         'Todos',
      filterTraining:    'Treinos',
      filterTournaments: 'Torneios',
      filterTeam:        'Equipe',
      empty:             'Seja o primeiro a enviar uma foto da comunidade.',
      uploadBtn:         'Enviar minha foto',
      modal: {
        title:            'Enviar minha foto',
        drop:             'Arraste sua foto aqui ou clique para selecionar',
        authorPlaceholder:'Seu nome (opcional)',
        submit:           'Enviar foto',
        note:             'Sua foto será revisada antes de ser publicada.'
      }
    },
    rev: {
      eyebrow:    '08 — Avaliações',
      title:      'O que diz <b>nossa comunidade.</b>',
      lead:       'Opiniões reais dos nossos alunos.',
      formTitle:  'Deixe sua avaliação',
      namePlaceholder: 'Seu nome',
      textPlaceholder: 'O que você achou da academia?',
      submit:     'Enviar avaliação',
      googleBtn:  'Avaliar no Google →'
    },
    spot: {
      title: 'A academia. <b>Sem filtros.</b>',
      lead: 'Vídeo em loop: um vislumbre da energia, disciplina e rotina da academia.',
      cta: 'Conhecer a academia'
    },
    contact: {
      eyebrow: '09 — Contato',
      title: 'Treine com a <b>gente.</b>',
      lead: 'Estamos no coração de Godoy Cruz. Marque suas 2 aulas experimentais gratuitas.',
      addr: 'Balcarce 230', city: 'Godoy Cruz, Mendoza',
      walter: 'Walter · K1 / Muay Thai', tapa: 'Tapa Team · MMA / Wrestling', ig: 'Instagram oficial',
      formName: 'Seu nome', formPlaceholderName: 'Nome e sobrenome',
      formAge: 'Sua idade', formAgePlaceholder: 'Ex: 25',
      formModality: 'Modalidade de interesse',
      modK1: 'K1 / Muay Thai', modMMA: 'MMA / Wrestling',
      formTime: 'Faixa de horário',
      timeMorning: 'Manhã', timeAfternoon: 'Tarde',
      formSend: 'Enviar pelo WhatsApp'
    },
    footer: {
      tag: 'Formando atletas de elite no coração de Godoy Cruz, Mendoza desde 2010.',
      h1: 'Academia', h2: 'Info', h3: 'Siga',
      copyright: '© 2025 Bonati Fight Club · Godoy Cruz, Mendoza, Argentina',
      hash: '#SiempreBFC'
    }
  }
};

// ---------- RUNTIME ----------
(function() {
  const DEFAULT_LANG = document.documentElement.dataset.lang || 'es';
  const STORAGE_KEY = 'bfc_lang';

  function resolvePath(obj, path) {
    return path.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
  }

  function apply(lang) {
    const dict = BFC_I18N[lang] || BFC_I18N.es;
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;

    // Text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = resolvePath(dict, el.dataset.i18n);
      if (typeof v === 'string') el.textContent = v;
    });
    // HTML nodes (with <b>, <em>, etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = resolvePath(dict, el.dataset.i18nHtml);
      if (typeof v === 'string') el.innerHTML = v;
    });
    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const v = resolvePath(dict, el.dataset.i18nPlaceholder);
      if (typeof v === 'string') el.placeholder = v;
    });
    // Lang switch UI
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });

    // Custom arrays (champion titles, timeline, gallery captions, marquee)
    const champEl = document.querySelector('[data-i18n-list="champions.titles"]');
    if (champEl && Array.isArray(dict.champions.titles)) {
      champEl.innerHTML = dict.champions.titles.map(t => `
        <div class="title-line">
          <span class="title-year">${t.year}</span>
          <span class="title-name">${t.name}</span>
          <span class="title-belt">${t.belt}</span>
        </div>
      `).join('');
    }
    const tlEl = document.querySelector('[data-i18n-list="history.tl"]');
    if (tlEl && Array.isArray(dict.history.tl)) {
      tlEl.innerHTML = dict.history.tl.map(t => `
        <div class="tl-item">
          <div class="tl-year">${t.y}</div>
          <div class="tl-title">${t.t}</div>
          <div class="tl-desc">${t.d}</div>
        </div>
      `).join('');
    }
    const galTags = document.querySelectorAll('[data-gal-tag]');
    if (galTags.length && Array.isArray(dict.gal.items)) {
      galTags.forEach((el, i) => {
        if (dict.gal.items[i]) el.textContent = dict.gal.items[i];
      });
    }
    const walterBul = document.querySelector('[data-i18n-list="prof.walter.bullets"]');
    if (walterBul && Array.isArray(dict.prof.walter.bullets)) {
      walterBul.innerHTML = dict.prof.walter.bullets.map(b => `<li>${b}</li>`).join('');
    }
    const gastonBul = document.querySelector('[data-i18n-list="prof.gaston.bullets"]');
    if (gastonBul && Array.isArray(dict.prof.gaston.bullets)) {
      gastonBul.innerHTML = dict.prof.gaston.bullets.map(b => `<li>${b}</li>`).join('');
    }
    const marqueeEl = document.querySelector('[data-i18n-list="marquee"]');
    if (marqueeEl && Array.isArray(dict.marquee)) {
      const items = dict.marquee.concat(dict.marquee); // duplicate for seamless loop
      marqueeEl.innerHTML = items.map(s => `
        <span class="marquee-item">${s} <span class="star" aria-hidden="true"></span></span>
      `).join('');
    }
  }

  function setLang(lang) {
    if (!BFC_I18N[lang]) lang = 'es';
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    apply(lang);
    document.dispatchEvent(new CustomEvent('bfc:lang', { detail: { lang } }));
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    const initial = saved || DEFAULT_LANG;
    apply(initial);

    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
  });

  // Expose
  window.BFC = window.BFC || {};
  window.BFC.i18n = { setLang, get: () => document.documentElement.dataset.lang, dict: BFC_I18N };
})();
