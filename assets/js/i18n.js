/* =====================================================
   BFC — i18n SYSTEM
   ES (default) · EN · PT-BR
   Usage: <element data-i18n="key.sub"> or data-i18n-html for HTML content
   ===================================================== */

const BFC_I18N = {
  es: {
    choose: { title: '¿Qué querés entrenar?', k1: 'K1 / Muay Thai', k1by: 'Con Walter Bonati y Gastón Silva', mma: 'MMA / Wrestling', mmaby: 'Con Tapa Team' },
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
      sub: 'Kickboxing K1, Muay Thai y MMA en Godoy Cruz, Mendoza. Desde 2010.',
      cta1: 'Comenzar a entrenar',
      cta2: 'Ver la academia',
      scroll: 'Deslizá para ver más'
    },
    counters: {
      years: 'Año de fundación',
      students: 'Alumnos activos',
      champsValue: '2',
      champs: 'Clases de prueba gratis'
    },
    marquee: [
      'K1 · Muay Thai · MMA · Wrestling',
      'Balcarce 230, Godoy Cruz',
      '2 clases de prueba gratis',
      'Campeón Sudamericano FFG 2025',
      '#SiempreBFC'
    ],
    disc: {
      eyebrow: '01 — Disciplinas',
      title: 'Kickboxing, Muay Thai <b>y MMA.</b>',
      lead: 'K1, Muay Thai, MMA y Wrestling. Grupos para quien empieza y para quien compite.',
      k1: {
        kicker: '08:30 a 23:00',
        name: 'K1 Kickboxing',
        desc: 'Golpes de puño, patadas y rodillas con reglas K1. Clases con Walter Bonati y Gastón «Tonga» Silva, de lunes a viernes.',
        cta: 'Ver horarios'
      },
      mt: {
        kicker: '08:30 a 23:00',
        name: 'Muay Thai',
        desc: 'Boxeo tailandés: puños, codos, rodillas, patadas y clinch. Mismos profesores y horarios que K1.',
        cta: 'Ver horarios'
      },
      mma: {
        kicker: 'Lun · Mié · Vie · 20:00',
        name: 'MMA & Wrestling',
        desc: 'Artes marciales mixtas y lucha con Tapa Team, en el club desde 2025.',
        cta: 'Ver Tapa Team'
      }
    },
    champions: {
      eyebrow: '02 — Campeones',
      quote: 'Un campeón sudamericano <b>da clases acá.</b>',
      role: 'Atleta y profesor del club',
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
      title: 'Desde 2010 <b>en Godoy Cruz.</b>',
      p1: 'Bonati Fight Club es una academia de deportes de combate en Godoy Cruz, Mendoza, fundada en 2010 por Walter Bonati. Está en Balcarce 230 y da clases de lunes a viernes, con turnos de mañana, tarde y noche. Enseña K1 Kickboxing y Muay Thai con Walter Bonati y Gastón «Tonga» Silva, campeón sudamericano FFG en 2025, y MMA y Wrestling con Tapa Team, el equipo que funciona en el club desde 2025. Recibe desde principiantes hasta competidores, y las 2 primeras clases son gratis.',
      p2: 'En la cuarentena de 2020 siguió entrenando con protocolo sanitario, y <a href="https://www.elsol.com.ar/el-sol/las-artes-marciales-vuelven-a-las-raices-durante-la-cuarentena/" target="_blank" rel="noopener">el diario El Sol</a> la incluyó en su nota sobre las academias de artes marciales de Mendoza.',
      quote: 'Aquí en Bonati prevalece la decisión de hacer las cosas.',
      quoteBy: 'Walter Bonati · Head Coach',
      tl: [
        { y: '2010', t: 'Fundación', d: 'Walter Bonati abre las puertas del gimnasio en Godoy Cruz.' },
        { y: '2019', t: 'Primer medallero sudamericano', d: 'Gastón "Tonga" Silva trae la medalla de oro WKF.' },
        { y: '2020', t: 'Se adapta y resiste', d: 'BFC sigue entrenando en cuarentena, con protocolo sanitario, y aparece en el diario El Sol.' },
        { y: '2025', t: 'Nace Tapa Team', d: 'Se incorpora el equipo de MMA y Wrestling dentro del gym.' },
        { y: '2025', t: 'Campeón Sudamericano FFG', d: 'Gana por KO a Jonas Coelho en Brasil. El Senado de Mendoza lo distingue.' }
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
          'Entrena peleadores desde 2010'
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
      title: 'Horarios <b>de clases.</b>',
      lead: 'Clases de lunes a viernes para todos los niveles. ¿Sin horario? Escribinos y armamos uno.',
      cta: 'Consultar por clases',
      walter: { coach: 'Walter Bonati', days: 'Lun a Vie' },
      gaston: { coach: 'Gastón Silva', days1: 'LUN · MAR · MIÉ · JUE · VIE', days2: 'LUN · MAR · JUE' },
      disc1: 'K1 / Muay Thai',
      disc2: 'Técnica / Sparring',
      disc3: 'MMA / Wrestling',
      tapa: { coach: 'Tapa Team', days: 'LUN · MIÉ · VIE' }
    },
    tapa: {
      eyebrow: '06 — Tapa Team',
      title: 'Tapa Team. <b>MMA & Wrestling.</b>',
      lead: 'El equipo de MMA y Wrestling de Bonati Fight Club. Nació en 2025 y ya compite en eventos locales y nacionales.',
      s1: 'Fundado', s1v: '2025',
      s2: '20:00 a 21:30', s2v: 'Lun · Mié · Vie',
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
      empty:           'Subí la primera foto de la comunidad.',
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
      title:      'Reseñas de <b>alumnos.</b>',
      lead:       'Opiniones reales de nuestros alumnos.',
      rating:     '4,9 ★ en Google · 112 reseñas (octubre 2026)',
      formTitle:  'Dejá tu reseña',
      namePlaceholder: 'Tu nombre',
      textPlaceholder: '¿Qué te pareció el gimnasio?',
      submit:     'Enviar reseña',
      googleBtn:  'Dejar reseña en Google →',
      or:         'o dejala acá, en la web:'
    },
    spot: {
      title: 'La academia. <b>Sin filtros.</b>',
      lead: 'Video en loop: un vistazo a la energía, la disciplina y el día a día del gimnasio.',
      cta: 'Conocer la academia'
    },
    faq: {
      eyebrow: '09 — Preguntas frecuentes',
      title: 'Antes de tu <b>primera clase.</b>',
      lead: 'Lo que más nos preguntan quienes están por empezar.',
      q1: '¿Necesito experiencia previa para empezar?',
      a1: 'No. La mayoría de nuestros alumnos empieza desde cero. Cada clase se adapta al nivel de la persona y siempre hay un profesor corrigiendo la técnica desde el primer día.',
      q2: '¿Qué disciplinas puedo entrenar en Bonati Fight Club?',
      a2: 'K1 Kickboxing, Muay Thai, MMA y Wrestling. El striking lo dictan Walter Bonati y Gastón «Tonga» Silva; MMA y Wrestling funcionan dentro del club a través de Tapa Team.',
      q3: '¿Dónde están y en qué horarios entrenan?',
      a3: 'Estamos en Balcarce 230, Godoy Cruz, Mendoza. Entrenamos de lunes a viernes con turnos de mañana (08:30 y 10:00), tarde (15:00, 16:30 y 17:30) y noche (19:00 y 20:30). El turno de las 22:00 es lunes, martes y jueves. MMA y Wrestling (Tapa Team): lunes, miércoles y viernes de 20:00 a 21:30.',
      q4: '¿Tienen clases para principiantes y para todos los niveles?',
      a4: 'Sí. Los grupos son mixtos y el trabajo es progresivo: desde quien entrena por salud y estado físico hasta atletas que compiten a nivel nacional e internacional.',
      q5: '¿Cómo me anoto para una clase de prueba?',
      a5: 'Escribinos por WhatsApp al +54 9 261 571-0531 para K1 y Muay Thai, o al +54 9 261 467-1743 para MMA y Wrestling, y coordinamos el día y el horario de tu primera clase. Las 2 primeras clases son gratis.',
      q6: '¿Cuánto cuesta la cuota?',
      a6: 'Depende de cuántos días por semana entrenes: 3, 4 o 5. Escribinos por WhatsApp indicando cuántos días querés entrenar y te enviamos el valor de tu plan.',
      q7: '¿Desde qué edad se puede entrenar?',
      a7: 'Desde los 12 años, en todas las disciplinas.',
      q8: '¿Qué tengo que llevar a la primera clase?',
      a8: 'Nada. Para la primera clase no hace falta llevar equipo ni tener experiencia previa.'
    },
    contact: {
      eyebrow: '10 — Contacto',
      title: 'Entrená con <b>nosotros.</b>',
      lead: 'Las 2 primeras clases son gratis. Escribí a la línea de tu disciplina.',
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
      tag: 'Academia de K1, Muay Thai, MMA y Wrestling en Balcarce 230, Godoy Cruz, Mendoza. Desde 2010.',
      h1: 'Academia',
      h2: 'Info',
      h3: 'Seguinos',
      copyright: '© 2026 Bonati Fight Club · Godoy Cruz, Mendoza, Argentina',
      legal: 'Aviso legal', privacy: 'Privacidad', cookies: 'Cookies', withdraw: 'Botón de arrepentimiento',
      credit: 'Sitio desarrollado por <b>MTSolutions</b>, by JP',
      hash: '#SiempreBFC'
    }
  },

  en: {
    choose: { title: 'What do you want to train?', k1: 'K1 / Muay Thai', k1by: 'With Walter Bonati and Gastón Silva', mma: 'MMA / Wrestling', mmaby: 'With Tapa Team' },
    nav: {
      home: 'Home', academy: 'Academy', schedule: 'Schedule', coaches: 'Coaches',
      tapa: 'Tapa Team', store: 'Store', contact: 'Contact', cta: 'Train now'
    },
    hero: {
      location: 'Godoy Cruz · Mendoza · Argentina',
      tag: 'K1 · Muay Thai · MMA · Wrestling',
      l1: 'Bonati', l2: 'Fight', l3: 'Club',
      sub: 'K1 kickboxing, Muay Thai and MMA in Godoy Cruz, Mendoza. Since 2010.',
      cta1: 'Start training', cta2: 'Explore the gym',
      scroll: 'Scroll to discover'
    },
    counters: {
      years: 'Year founded',
      students: 'Active students',
      champsValue: '2',
      champs: 'Free trial classes'
    },
    marquee: [
      'K1 · Muay Thai · MMA · Wrestling',
      'Balcarce 230, Godoy Cruz',
      '2 free trial classes',
      'FFG South American Champion 2025',
      '#SiempreBFC'
    ],
    disc: {
      eyebrow: '01 — Disciplines',
      title: 'Kickboxing, Muay Thai <b>and MMA.</b>',
      lead: 'K1, Muay Thai, MMA and Wrestling. Groups for beginners and for competitors.',
      k1: { kicker: '8:30 am to 11 pm', name: 'K1 Kickboxing', desc: 'Punches, kicks and knees under K1 rules. Classes with Walter Bonati and Gastón "Tonga" Silva, Monday to Friday.', cta: 'See schedule' },
      mt: { kicker: '8:30 am to 11 pm', name: 'Muay Thai', desc: 'Thai boxing: fists, elbows, knees, kicks and clinch. Same coaches and schedule as K1.', cta: 'See schedule' },
      mma: { kicker: 'Mon · Wed · Fri · 8 pm', name: 'MMA & Wrestling', desc: 'Mixed martial arts and wrestling with Tapa Team, part of the club since 2025.', cta: 'See Tapa Team' }
    },
    champions: {
      eyebrow: '02 — Champions',
      quote: 'A South American champion <b>teaches here.</b>',
      role: 'Athlete and coach at the club',
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
      title: 'Since 2010 <b>in Godoy Cruz.</b>',
      p1: 'Bonati Fight Club is a combat sports academy in Godoy Cruz, Mendoza, founded in 2010 by Walter Bonati. It is at Balcarce 230 and holds classes Monday to Friday, with morning, afternoon and evening slots. It teaches K1 Kickboxing and Muay Thai with Walter Bonati and Gastón "Tonga" Silva, 2025 FFG South American champion, and MMA and Wrestling with Tapa Team, the team based at the club since 2025. It welcomes everyone from beginners to competitors, and the first 2 classes are free.',
      p2: 'During the 2020 lockdown it kept training under health protocols, and <a href="https://www.elsol.com.ar/el-sol/las-artes-marciales-vuelven-a-las-raices-durante-la-cuarentena/" target="_blank" rel="noopener">the newspaper El Sol</a> featured it in a story on Mendoza\'s martial arts academies.',
      quote: 'At Bonati, the will to get things done prevails.',
      quoteBy: 'Walter Bonati · Head Coach',
      tl: [
        { y: '2010', t: 'Founded',                       d: 'Walter Bonati opens the doors of the gym in Godoy Cruz.' },
        { y: '2019', t: 'First South American medal',    d: 'Gastón "Tonga" Silva brings home the WKF gold medal.' },
        { y: '2020', t: 'Adapting and resisting',        d: 'BFC keeps training through the lockdown under health protocols and is featured in El Sol.' },
        { y: '2025', t: 'Tapa Team is born',             d: 'MMA and Wrestling team launches inside the gym.' },
        { y: '2025', t: 'FFG South American Champion',   d: 'Wins by KO over Jonas Coelho in Brazil. Honored by the Mendoza Senate.' }
      ]
    },
    prof: {
      eyebrow: '04 — Coaches',
      title: 'Head coach <b>and champion.</b>',
      walter: { role: 'Founder · Head Coach', quote: 'At Bonati, the will to get things done prevails.', bullets: ['Specialty: K1 & Muay Thai','Training fighters since 2010'] },
      gaston: { role: 'Athlete · Coach',       quote: 'If you walk in, you walk in to leave something.', bullets: ['FFG South American Champion 2025','ISKA Argentine Champion 2023','FFG Argentine Champion 2021','WKF South American Gold 2019','Honored by the Senate of Mendoza'] },
      ig: 'View Instagram'
    },
    sch: {
      eyebrow: '05 — Schedule',
      title: 'Class <b>schedule.</b>',
      lead: 'Classes Monday to Friday for all levels. No slot works? Write us and we build one.',
      cta: 'Ask about classes',
      walter: { coach: 'Walter Bonati', days: 'Mon to Fri' },
      gaston: { coach: 'Gastón Silva', days1: 'MON · TUE · WED · THU · FRI', days2: 'MON · TUE · THU' },
      disc1: 'K1 / Muay Thai', disc2: 'Technique / Sparring',
      disc3: 'MMA / Wrestling', tapa: { coach: 'Tapa Team', days: 'MON · WED · FRI' }
    },
    tapa: {
      eyebrow: '06 — Tapa Team',
      title: 'Tapa Team. <b>MMA & Wrestling.</b>',
      lead: 'Bonati Fight Club\'s MMA and Wrestling team. Founded in 2025 and already competing in local and national events.',
      s1: 'Founded', s1v: '2025',
      s2: '8:00 to 9:30 pm', s2v: 'Mon · Wed · Fri',
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
      title:      'Student <b>reviews.</b>',
      lead:       'Real opinions from our students.',
      rating:     '4.9 ★ on Google · 112 reviews (October 2026)',
      formTitle:  'Leave a review',
      namePlaceholder: 'Your name',
      textPlaceholder: 'What did you think of the gym?',
      submit:     'Send review',
      googleBtn:  'Leave a Google review →',
      or:         'or leave it here, on the site:'
    },
    spot: {
      title: 'The academy. <b>No filters.</b>',
      lead: 'Looped video: a glimpse of the energy, discipline and daily life of the gym.',
      cta: 'Meet the academy'
    },
    faq: {
      eyebrow: '09 — FAQ',
      title: 'Before your <b>first class.</b>',
      lead: 'The questions we get most from people about to start.',
      q1: 'Do I need previous experience to start?',
      a1: 'No. Most of our students start from zero. Every class adapts to the person\u2019s level and a coach corrects your technique from day one.',
      q2: 'Which disciplines can I train at Bonati Fight Club?',
      a2: 'K1 Kickboxing, Muay Thai, MMA and Wrestling. Striking is taught by Walter Bonati and Gast\u00f3n \u201cTonga\u201d Silva; MMA and Wrestling run inside the club through Tapa Team.',
      q3: 'Where are you and what are your class times?',
      a3: 'We are at Balcarce 230, Godoy Cruz, Mendoza. We train Monday to Friday with morning slots (08:30 and 10:00), afternoon (15:00, 16:30 and 17:30) and evening (19:00 and 20:30). The 22:00 slot runs Monday, Tuesday and Thursday. MMA and Wrestling (Tapa Team): Monday, Wednesday and Friday from 20:00 to 21:30.',
      q4: 'Do you have classes for beginners and all levels?',
      a4: 'Yes. Groups are mixed and the work is progressive: from people training for health and fitness to athletes competing nationally and internationally.',
      q5: 'How do I book a trial class?',
      a5: 'Message us on WhatsApp at +54 9 261 571-0531 for K1 and Muay Thai, or +54 9 261 467-1743 for MMA and Wrestling, and we will set the day and time of your first class. Your first 2 classes are free.',
      q6: 'How much is the monthly fee?',
      a6: 'It depends on how many days a week you train: 3, 4 or 5. Message us on WhatsApp with the number of days you want to train and we will send you the price of your plan.',
      q7: 'From what age can I train?',
      a7: 'From age 12, in every discipline.',
      q8: 'What should I bring to my first class?',
      a8: 'Nothing. You don\'t need gear or previous experience for your first class.'
    },
    contact: {
      eyebrow: '10 — Contact',
      title: 'Train with <b>us.</b>',
      lead: 'Your first 2 classes are free. Message the line for your discipline.',
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
      tag: 'K1, Muay Thai, MMA and Wrestling academy at Balcarce 230, Godoy Cruz, Mendoza. Since 2010.',
      h1: 'Academy', h2: 'Info', h3: 'Follow us',
      copyright: '© 2026 Bonati Fight Club · Godoy Cruz, Mendoza, Argentina',
      legal: 'Legal notice', privacy: 'Privacy', cookies: 'Cookies', withdraw: 'Cancel a purchase',
      credit: 'Website by <b>MTSolutions</b>, by JP',
      hash: '#SiempreBFC'
    }
  },

  pt: {
    choose: { title: 'O que você quer treinar?', k1: 'K1 / Muay Thai', k1by: 'Com Walter Bonati e Gastón Silva', mma: 'MMA / Wrestling', mmaby: 'Com o Tapa Team' },
    nav: {
      home: 'Início', academy: 'Academia', schedule: 'Horários', coaches: 'Professores',
      tapa: 'Tapa Team', store: 'Loja', contact: 'Contato', cta: 'Treinar agora'
    },
    hero: {
      location: 'Godoy Cruz · Mendoza · Argentina',
      tag: 'K1 · Muay Thai · MMA · Wrestling',
      l1: 'Bonati', l2: 'Fight', l3: 'Club',
      sub: 'Kickboxing K1, Muay Thai e MMA em Godoy Cruz, Mendoza. Desde 2010.',
      cta1: 'Começar a treinar', cta2: 'Conhecer a academia',
      scroll: 'Deslize para descobrir'
    },
    counters: {
      years: 'Ano de fundação',
      students: 'Alunos ativos',
      champsValue: '2',
      champs: 'Aulas experimentais grátis'
    },
    marquee: [
      'K1 · Muay Thai · MMA · Wrestling',
      'Balcarce 230, Godoy Cruz',
      '2 aulas experimentais grátis',
      'Campeão Sul-Americano FFG 2025',
      '#SiempreBFC'
    ],
    disc: {
      eyebrow: '01 — Modalidades',
      title: 'Kickboxing, Muay Thai <b>e MMA.</b>',
      lead: 'K1, Muay Thai, MMA e Wrestling. Turmas para quem está começando e para quem compete.',
      k1: { kicker: '08h30 às 23h', name: 'K1 Kickboxing', desc: 'Socos, chutes e joelhadas com regras K1. Aulas com Walter Bonati e Gastón "Tonga" Silva, de segunda a sexta.', cta: 'Ver horários' },
      mt: { kicker: '08h30 às 23h', name: 'Muay Thai', desc: 'Boxe tailandês: punhos, cotovelos, joelhos, chutes e clinch. Mesmos professores e horários do K1.', cta: 'Ver horários' },
      mma: { kicker: 'Seg · Qua · Sex · 20h', name: 'MMA & Wrestling', desc: 'Artes marciais mistas e luta com o Tapa Team, no clube desde 2025.', cta: 'Ver Tapa Team' }
    },
    champions: {
      eyebrow: '02 — Campeões',
      quote: 'Um campeão sul-americano <b>dá aulas aqui.</b>',
      role: 'Atleta e professor do clube',
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
      title: 'Desde 2010 <b>em Godoy Cruz.</b>',
      p1: 'Bonati Fight Club é uma academia de esportes de combate em Godoy Cruz, Mendoza, fundada em 2010 por Walter Bonati. Fica na Balcarce 230 e tem aulas de segunda a sexta, com turnos de manhã, tarde e noite. Ensina K1 Kickboxing e Muay Thai com Walter Bonati e Gastón "Tonga" Silva, campeão sul-americano FFG em 2025, e MMA e Wrestling com o Tapa Team, a equipe que funciona no clube desde 2025. Recebe de iniciantes a competidores, e as 2 primeiras aulas são grátis.',
      p2: 'Na quarentena de 2020 continuou treinando com protocolo sanitário, e <a href="https://www.elsol.com.ar/el-sol/las-artes-marciales-vuelven-a-las-raices-durante-la-cuarentena/" target="_blank" rel="noopener">o jornal El Sol</a> a incluiu em sua matéria sobre as academias de artes marciais de Mendoza.',
      quote: 'Aqui em Bonati prevalece a decisão de fazer as coisas.',
      quoteBy: 'Walter Bonati · Head Coach',
      tl: [
        { y: '2010', t: 'Fundação',                        d: 'Walter Bonati abre as portas da academia em Godoy Cruz.' },
        { y: '2019', t: 'Primeira medalha sul-americana', d: 'Gastón "Tonga" Silva conquista o ouro na WKF.' },
        { y: '2020', t: 'Adapta-se e resiste',             d: 'BFC segue treinando na quarentena, com protocolo sanitário, e aparece no jornal El Sol.' },
        { y: '2025', t: 'Nasce o Tapa Team',               d: 'Time de MMA e Wrestling entra na academia.' },
        { y: '2025', t: 'Campeão Sul-Americano FFG',       d: 'Vence Jonas Coelho por KO no Brasil. Homenageado pelo Senado de Mendoza.' }
      ]
    },
    prof: {
      eyebrow: '04 — Professores',
      title: 'Head coach <b>e campeão.</b>',
      walter: { role: 'Fundador · Head Coach', quote: 'Aqui em Bonati prevalece a decisão de fazer as coisas.', bullets: ['Especialidade: K1 e Muay Thai','Treina lutadores desde 2010'] },
      gaston: { role: 'Atleta · Professor',     quote: 'Se você entra aqui, entra para deixar algo.', bullets: ['Campeão Sul-Americano FFG 2025','Campeão Argentino ISKA 2023','Campeão Argentino FFG 2021','Medalha de Ouro Sul-Americano WKF 2019','Homenageado pelo Senado de Mendoza'] },
      ig: 'Ver Instagram'
    },
    sch: {
      eyebrow: '05 — Horários',
      title: 'Horários <b>das aulas.</b>',
      lead: 'Aulas de segunda a sexta para todos os níveis. Sem horário? Escreva e a gente monta.',
      cta: 'Consultar aulas',
      walter: { coach: 'Walter Bonati', days: 'Seg a Sex' },
      gaston: { coach: 'Gastón Silva', days1: 'SEG · TER · QUA · QUI · SEX', days2: 'SEG · TER · QUI' },
      disc1: 'K1 / Muay Thai', disc2: 'Técnica / Sparring',
      disc3: 'MMA / Wrestling', tapa: { coach: 'Tapa Team', days: 'SEG · QUA · SEX' }
    },
    tapa: {
      eyebrow: '06 — Tapa Team',
      title: 'Tapa Team. <b>MMA & Wrestling.</b>',
      lead: 'A equipe de MMA e Wrestling do Bonati Fight Club. Nasceu em 2025 e já compete em eventos locais e nacionais.',
      s1: 'Fundado', s1v: '2025',
      s2: '20h às 21h30', s2v: 'Seg · Qua · Sex',
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
      title:      'Avaliações de <b>alunos.</b>',
      lead:       'Opiniões reais dos nossos alunos.',
      rating:     '4,9 ★ no Google · 112 avaliações (outubro 2026)',
      formTitle:  'Deixe sua avaliação',
      namePlaceholder: 'Seu nome',
      textPlaceholder: 'O que você achou da academia?',
      submit:     'Enviar avaliação',
      googleBtn:  'Avaliar no Google →',
      or:         'ou deixe aqui, no site:'
    },
    spot: {
      title: 'A academia. <b>Sem filtros.</b>',
      lead: 'Vídeo em loop: um vislumbre da energia, disciplina e rotina da academia.',
      cta: 'Conhecer a academia'
    },
    faq: {
      eyebrow: '09 — Perguntas frequentes',
      title: 'Antes da sua <b>primeira aula.</b>',
      lead: 'O que mais nos perguntam quem está começando.',
      q1: 'Preciso de experiência prévia para começar?',
      a1: 'Não. A maioria dos nossos alunos começa do zero. Cada aula se adapta ao nível da pessoa e há sempre um professor corrigindo a técnica desde o primeiro dia.',
      q2: 'Quais modalidades posso treinar no Bonati Fight Club?',
      a2: 'K1 Kickboxing, Muay Thai, MMA e Wrestling. O striking é ministrado por Walter Bonati e Gastón «Tonga» Silva; MMA e Wrestling funcionam dentro do clube através do Tapa Team.',
      q3: 'Onde ficam e quais são os horários?',
      a3: 'Estamos na Balcarce 230, Godoy Cruz, Mendoza. Treinamos de segunda a sexta com turnos de manhã (08:30 e 10:00), tarde (15:00, 16:30 e 17:30) e noite (19:00 e 20:30). O turno das 22:00 é segunda, terça e quinta. MMA e Wrestling (Tapa Team): segunda, quarta e sexta das 20:00 às 21:30.',
      q4: 'Têm aulas para iniciantes e para todos os níveis?',
      a4: 'Sim. As turmas são mistas e o trabalho é progressivo: de quem treina por saúde e condicionamento a atletas que competem em nível nacional e internacional.',
      q5: 'Como marco uma aula experimental?',
      a5: 'Fale conosco no WhatsApp pelo +54 9 261 571-0531 para K1 e Muay Thai, ou +54 9 261 467-1743 para MMA e Wrestling, e combinamos o dia e o horário da sua primeira aula. As 2 primeiras aulas são grátis.',
      q6: 'Quanto custa a mensalidade?',
      a6: 'Depende de quantos dias por semana você treina: 3, 4 ou 5. Escreva para nós no WhatsApp informando quantos dias quer treinar e enviaremos o valor do seu plano.',
      q7: 'A partir de que idade posso treinar?',
      a7: 'A partir dos 12 anos, em todas as modalidades.',
      q8: 'O que preciso levar na primeira aula?',
      a8: 'Nada. Na primeira aula não é preciso levar equipamento nem ter experiência.'
    },
    contact: {
      eyebrow: '10 — Contato',
      title: 'Treine com a <b>gente.</b>',
      lead: 'As 2 primeiras aulas são grátis. Fale com a linha da sua modalidade.',
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
      tag: 'Academia de K1, Muay Thai, MMA e Wrestling na Balcarce 230, Godoy Cruz, Mendoza. Desde 2010.',
      h1: 'Academia', h2: 'Info', h3: 'Siga',
      copyright: '© 2026 Bonati Fight Club · Godoy Cruz, Mendoza, Argentina',
      legal: 'Aviso legal', privacy: 'Privacidade', cookies: 'Cookies', withdraw: 'Botão de arrependimento',
      credit: 'Site desenvolvido por <b>MTSolutions</b>, by JP',
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
