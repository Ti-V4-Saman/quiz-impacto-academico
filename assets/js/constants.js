export const TRACKING_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'campaign_id', 'adset_id', 'ad_id', 'creative_id', 'creative_name',
  'device', 'matchtype', 'adposition', 'network', 'loc', 'loci', 'targetid', 'placement',
  'gclid', 'wbraid', 'gbraid', 'fbclid', 'fbp', 'fbc'
];

export const ANSWER_KEYS = [
  'nome', 'telefone', 'telefone_pais', 'telefone_ddi', 'telefone_pais_outro', 'email', 'processo_imigratorio', 'localizacao', 'localizacao_outro', 'tipo_visto',
  'tempo_eua', 'tempo_visto', 'filhos_escola', 'nome_escola', 'idade_filho',
  'ano_escolar', 'enviar_filho', 'consultora'
];

export const STORAGE_KEYS = {
  sessionId: 'impacto_academico_session_id',
  resultId: 'impacto_academico_result_id',
  createdAt: 'impacto_academico_created_at',
  leadEventSent: 'impacto_academico_lead_event_sent'
};

export const TYPEBOT_VARIABLES = {
  nome: 'nome',
  telefone: 'telefone',
  telefone_pais: 'telefone_pais',
  telefone_ddi: 'telefone_ddi',
  telefone_pais_outro: 'telefone_pais_outro',
  email: 'email',
  processo_imigratorio: 'processo_imigratorio',
  localizacao: 'localizacao',
  localizacao_outro: 'localizacao_outro',
  tipo_visto: 'tipo_visto',
  tempo_eua: 'tempo_eua',
  tempo_visto: 'tempo_visto',
  filhos_escola: 'filhos_escola',
  nome_escola: 'nome_escola',
  idade_filho: 'idade_filho',
  ano_escolar: 'ano_escolar',
  enviar_filho: 'enviar_filho',
  consultora: 'consultora'
};

export const COUNTRY_OPTIONS = [
  { value: 'Brasil', label: 'Brasil', flag: '🇧🇷' },
  { value: 'Estados Unidos', label: 'Estados Unidos', flag: '🇺🇸' },
  { value: 'Canadá', label: 'Canadá', flag: '🇨🇦' },
  { value: 'Inglaterra', label: 'Inglaterra', flag: '🇬🇧' },
  { value: 'França', label: 'França', flag: '🇫🇷' },
  { value: 'Outro', label: 'Outro', flag: '🌍' }
];

export const QUIZ_STEPS = {
  hero: {
    id: 'hero',
    type: 'hero',
    progress: 0
  },
  nome: {
    id: 'nome',
    type: 'input',
    field: 'nome',
    inputType: 'text',
    autocomplete: 'name',
    title: 'Para começar, qual é o seu nome e sobrenome?',
    subtitle: 'Assim conseguimos personalizar melhor a sua orientação.',
    placeholder: 'Digite seu nome e sobrenome',
    buttonLabel: 'Continuar',
    support: 'Vou te guiar com perguntas rápidas para entender o momento da sua família.',
    progress: 1
  },
  telefone: {
    id: 'telefone',
    type: 'input',
    field: 'telefone',
    inputType: 'tel',
    autocomplete: 'tel',
    title: 'Qual é o seu WhatsApp para contato?',
    subtitle: 'Usaremos esse número apenas para dar continuidade ao atendimento.',
    placeholder: 'Digite seu WhatsApp',
    buttonLabel: 'Continuar',
    support: 'Escolha o país do WhatsApp no menu. Se marcar Outro, informe de qual país é o número e digite com o DDI.',
    progress: 2
  },
  email: {
    id: 'email',
    type: 'input',
    field: 'email',
    inputType: 'email',
    autocomplete: 'email',
    title: 'E qual é o seu e-mail?',
    subtitle: 'Esse e-mail será muito importante. Após o agendamento, o link da free consultation será enviado por ele.',
    placeholder: 'Digite seu melhor e-mail',
    buttonLabel: 'Continuar',
    support: 'Use um e-mail que você acompanha com frequência. Ele será importante para materiais, orientações e para o envio do link da call.',
    progress: 3
  },
  processo_imigratorio: {
    id: 'processo_imigratorio',
    type: 'choice',
    field: 'processo_imigratorio',
    title: 'Você está em processo imigratório ou já mora hoje nos EUA?',
    subtitle: 'Escolha a opção que mais combina com a situação da sua família.',
    support: 'Não existe resposta certa. A ideia é entender o momento de vocês.',
    progress: 4,
    options: [
      { label: 'Sim', value: 'Sim', description: 'Já estou em processo ou moro nos EUA.', icon: '🇺🇸' },
      { label: 'Pensando em morar nos EUA', value: 'Pensando em morar nos EUA', description: 'Ainda estou no início da decisão.', icon: '🧭' },
      { label: 'Pensando em enviar meu filho para os EUA', value: 'Pensando em enviar meu filho para os EUA', description: 'Meu foco é High School ou College.', icon: '🎓' }
    ]
  },
  localizacao: {
    id: 'localizacao',
    type: 'select',
    field: 'localizacao',
    title: 'Em qual país vocês moram atualmente?',
    subtitle: 'Selecione o país para personalizar melhor a orientação acadêmica da sua família.',
    placeholder: 'Selecione o país',
    buttonLabel: 'Continuar',
    support: 'Selecione o país no menu. Se escolher Outro, escreva logo abaixo de onde vocês são.',
    progress: 5
  },
  tipo_visto: {
    id: 'tipo_visto',
    type: 'choice',
    field: 'tipo_visto',
    title: 'Qual é o tipo de visto que você está aplicando?',
    subtitle: 'Pode escolher a opção mais próxima da sua realidade.',
    progress: 6,
    options: [
      { label: 'Residente', value: 'Residente', description: 'Green card, residência ou caminho semelhante.', icon: '🏡' },
      { label: 'Estudante', value: 'Estudante', description: 'Visto ligado a estudo ou formação.', icon: '📚' },
      { label: 'Outros', value: 'Outros', description: 'Outro tipo de visto ou ainda não definido.', icon: '📝' }
    ]
  },
  tempo_visto: {
    id: 'tempo_visto',
    type: 'choice',
    field: 'tempo_visto',
    title: 'Quanto tempo falta para sua família receber o visto?',
    subtitle: 'Uma estimativa já ajuda a indicar o próximo passo.',
    progress: 7,
    options: [
      { label: 'Menos de 12 meses', value: 'Menos de 12 meses', description: 'Estamos relativamente próximos da mudança.', icon: '⚡' },
      { label: 'Mais de 12 meses', value: 'Mais de 12 meses', description: 'Ainda temos uma janela maior de preparação.', icon: '📅' }
    ]
  },
  tempo_eua: {
    id: 'tempo_eua',
    type: 'choice',
    field: 'tempo_eua',
    title: 'Há quanto tempo vocês estão nos EUA?',
    subtitle: 'Essa informação ajuda a entender a fase de adaptação escolar.',
    progress: 6,
    options: [
      { label: 'Até 3 meses', value: 'Até 3 meses', description: 'Chegamos recentemente.', icon: '🛬' },
      { label: 'Entre 3 e 6 meses', value: 'Entre 3 e 6 meses', description: 'Ainda estamos em adaptação.', icon: '🧩' },
      { label: 'Entre 6 e 9 meses', value: 'Entre 6 e 9 meses', description: 'Já começamos a entender o sistema.', icon: '📌' },
      { label: 'Entre 9 e 12 meses', value: 'Entre 9 e 12 meses', description: 'Estamos consolidando os próximos passos.', icon: '📈' },
      { label: 'Mais de 12 meses', value: 'Mais de 12 meses', description: 'Já vivemos essa rotina há mais tempo.', icon: '✅' }
    ]
  },
  filhos_escola: {
    id: 'filhos_escola',
    type: 'choice',
    field: 'filhos_escola',
    title: 'Seus filhos já estão na escola?',
    subtitle: 'Isso mostra se a orientação deve focar matrícula, adaptação ou estratégia acadêmica.',
    progress: 7,
    options: [
      { label: 'Sim', value: 'Sim', description: 'Eles já estudam em uma escola nos EUA.', icon: '🏫' },
      { label: 'Não', value: 'Não', description: 'Ainda estamos avaliando ou organizando a matrícula.', icon: '🔎' }
    ]
  },
  nome_escola: {
    id: 'nome_escola',
    type: 'input',
    field: 'nome_escola',
    inputType: 'text',
    autocomplete: 'organization',
    title: 'Qual é o nome da escola?',
    subtitle: 'Se não lembrar o nome completo, escreva como você souber.',
    placeholder: 'Nome da escola nos EUA',
    buttonLabel: 'Continuar',
    progress: 8
  },
  idade_filho: {
    id: 'idade_filho',
    type: 'choice',
    field: 'idade_filho',
    title: 'Qual é a idade do seu filho?',
    subtitle: 'A fase escolar muda bastante o tipo de orientação.',
    progress: 9,
    options: [
      { label: '0 a 10 anos', value: '0 a 10 anos', description: 'Educação infantil ou elementary school.', icon: '🧒' },
      { label: '11 a 13 anos', value: '11 a 13 anos', description: 'Fase de middle school.', icon: '📘' },
      { label: '14 a 18 anos', value: '14 a 18 anos', description: 'Fase de high school e preparação para college.', icon: '🎯' }
    ]
  },
  enviar_filho: {
    id: 'enviar_filho',
    type: 'choice',
    field: 'enviar_filho',
    title: 'Você pensa em High School ou College?',
    subtitle: 'Escolha o caminho que mais se aproxima do objetivo da sua família.',
    progress: 5,
    options: [
      { label: 'High School', value: 'High School', description: 'Ensino médio nos Estados Unidos.', icon: '🏫' },
      { label: 'College', value: 'College', description: 'Faculdade ou preparação para universidade.', icon: '🎓' }
    ]
  },
  ano_escolar: {
    id: 'ano_escolar',
    type: 'choice',
    field: 'ano_escolar',
    title: 'Seu filho está entre o 9º ano e o 3º ano do Ensino Médio?',
    subtitle: 'Essa etapa costuma ser uma das mais estratégicas para estudar fora.',
    progress: 6,
    options: [
      { label: 'Sim', value: 'Sim', description: 'Está dentro dessa fase escolar.', icon: '✅' },
      { label: 'Não', value: 'Não', description: 'Ainda está antes ou depois dessa etapa.', icon: '📚' }
    ]
  }
};

export const FINAL_SCREENS = {
  approved: {
    status: 'approved',
    icon: '✅',
    title: 'Tudo certo! Agora vamos agendar sua free consultation.',
    text: 'Independentemente do seu caminho, o próximo passo é agendar sua conversa com a especialista da Impacto Acadêmico.',
    note: 'Após o agendamento, o link da free consultation será enviado para o e-mail informado no quiz.',
    warning: '🚨 Após a realização do agendamento, não poderá realizá-lo novamente 🚨',
    buttonLabel: 'Agendar free consultation',
    redirectKey: 'CALENDAR_PRIMARY_URL'
  },
  'guia-digital': {
    status: 'guia-digital',
    icon: '📘',
    title: 'Tudo certo! Agora vamos agendar sua free consultation.',
    text: 'Com base nas suas respostas, vamos te direcionar para o agendamento da free consultation.',
    note: 'Após o agendamento, o link da free consultation será enviado para o e-mail informado no quiz.',
    warning: '🚨 Após a realização do agendamento, não poderá realizá-lo novamente 🚨',
    buttonLabel: 'Agendar free consultation',
    redirectKey: 'CALENDAR_PRIMARY_URL'
  },
  ebook: {
    status: 'ebook',
    icon: '📗',
    title: 'Tudo certo! Agora vamos agendar sua free consultation.',
    text: 'Com base nas suas respostas, vamos te direcionar para o agendamento da free consultation.',
    note: 'Após o agendamento, o link da free consultation será enviado para o e-mail informado no quiz.',
    warning: '🚨 Após a realização do agendamento, não poderá realizá-lo novamente 🚨',
    buttonLabel: 'Agendar free consultation',
    redirectKey: 'CALENDAR_PRIMARY_URL'
  },
  refugo: {
    status: 'refugo',
    icon: '💡',
    title: 'Tudo certo! Agora vamos agendar sua free consultation.',
    text: 'Com base nas suas respostas, vamos te direcionar para o agendamento da free consultation.',
    note: 'Após o agendamento, o link da free consultation será enviado para o e-mail informado no quiz.',
    warning: '🚨 Após a realização do agendamento, não poderá realizá-lo novamente 🚨',
    buttonLabel: 'Agendar free consultation',
    redirectKey: 'CALENDAR_PRIMARY_URL'
  }
};