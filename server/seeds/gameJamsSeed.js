// Exemplos de Game Jams para inserir no banco de dados
// Use esses dados para popular a tabela game_jams

const gameJamsExamples = [
  {
    title: "Global Game Jam 2024",
    description: "A maior game jam do mundo! Game makers de todo o planeta se unem para criar jogos em apenas 48 horas. Este é um evento anual que reúne criadores indie, estudantes e profissionais da indústria de jogos.\n\nO tema será anunciado no início do evento e você terá exatamente 48 horas para criar um jogo que siga o tema.",
    coverURL: "https://globalgamejam.org/sites/default/files/ggj-social-2024.jpg",
    organizer: "Global Game Jam Organization",
    startDate: "2024-02-02",
    endDate: "2024-02-04",
    status: "finished",
    theme: "\"Deixe-me deixá-lo sair\"",
    participants: 15000,
    prize: "Certificados de participação, visibilidade na comunidade, e prêmios especiais de patrocinadores.",
    rules: "1. Sua jogo deve ser criado durante o evento\n2. Você pode usar assets pré-existentes\n3. Equipes de até 4 pessoas\n4. Deve funcionar em pelo menos uma plataforma\n5. Será avaliado por comunidade",
    website: "https://globalgamejam.org",
    tags: JSON.stringify(["48-horas", "internacional", "multiplayer", "indie"])
  },
  {
    title: "Ludum Dare 56",
    description: "Ludum Dare é a maior game jam online do mundo! Participantes criam jogos do zero em apenas 48 horas (ou 72 para a versão 'Jam' mais relaxada).\n\nEste é um evento de votação comunitária onde seus pares avaliam seu jogo em categorias como: Apresentação, Criatividade, Diversão, Tema e Inovação.",
    coverURL: "https://ldjam.com/favicon/favicon-192x192.png",
    organizer: "Ludum Dare Team",
    startDate: "2024-04-27",
    endDate: "2024-04-29",
    status: "finished",
    theme: "\"Risco & Recompensa\"",
    participants: 8500,
    prize: "Troféus da comunidade para categorias vencedoras, destaque no site e exposição media",
    rules: "1. Competição: 48 horas | Jam: 72 horas\n2. Crie seu jogo from scratch\n3. Use apenas assets criados durante o evento\n4. Siga o tema\n5. Solo ou em equipes pequenas",
    website: "https://ldjam.com",
    tags: JSON.stringify(["online", "votação-comunitária", "indie", "theme"])
  },
  {
    title: "Game Jam Brasil 2024",
    description: "A maior game jam da América Latina! Desenvolvedores brasileiros se unem para criar jogos inovadores em 48 horas.\n\nSe você é desenvolvedor brasileiro ou busca criar jogos com temática brasileira, esta é a jam perfeita para você!",
    coverURL: "https://gamejambrasil.org/images/banner-2024.jpg",
    organizer: "Associação Brasileira de Game Developers",
    startDate: "2024-09-14",
    endDate: "2024-09-16",
    status: "upcoming",
    theme: "\"Identidade Brasileira\"",
    participants: 3200,
    prize: "Prêmios em dinheiro para os 3 primeiros lugares, publicação de jogos, e parcerias com editoras indie",
    rules: "1. Equipes de 1 a 4 pessoas\n2. Podem ser remotas ou presenciais\n3. Tema obrigatório\n4. Mínimo 2 horas de gameplay\n5. Código aberto opcional",
    website: "https://gamejambrasil.org",
    tags: JSON.stringify(["brasil", "local", "latino-americana", "prêmios"])
  },
  {
    title: "One Game a Month",
    description: "Desafie-se a criar um jogo por mês! One Game a Month é uma competição mensal que incentiva desenvolvedores a completar projetos e melhorar suas habilidades consistentemente.\n\nCada mês tem um novo tema e você tem 30 dias para criar algo único e divertido.",
    coverURL: "https://onegameamonth.com/images/ogam-logo.png",
    organizer: "One Game a Month Foundation",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    status: "upcoming",
    theme: "\"Reflexão\"",
    participants: 2100,
    prize: "Feedback da comunidade, exposição, e reconhecimento mensal",
    rules: "1. Um jogo por participante\n2. Criado durante o mês\n3. Mínimo 1 hora de gameplay\n4. Tema do mês é obrigatório\n5. Qualquer plataforma é válida",
    website: "https://onegameamonth.com",
    tags: JSON.stringify(["mensal", "indie", "comunidade", "aprendizado"])
  },
  {
    title: "Trijam 2024",
    description: "Uma jam curta e intensa! Você tem apenas 3 horas para criar um jogo completo. Apesar do tempo limitado, essa é uma ótima oportunidade para praticar prototipagem rápida e criatividade sob pressão.\n\nPerfeit para desenvolvedores que querem explorar novas ideias de forma rápida.",
    coverURL: "https://trijam.org/images/banner.jpg",
    organizer: "Trijam Community",
    startDate: "2024-11-16",
    endDate: "2024-11-16",
    status: "ongoing",
    theme: "\"Apenas Uma Cor\"",
    participants: 1500,
    prize: "Prêmios comunitários e exposição no site oficial",
    rules: "1. 3 horas de desenvolvimento\n2. Qualquer engine é válida\n3. Tema deve ser seguido\n4. Solo ou pequenas equipes\n5. Entrega via forma indicada",
    website: "https://trijam.org",
    tags: JSON.stringify(["3-horas", "rápida", "intense", "prototipagem"])
  },
  {
    title: "Indie Game Developers Challenge 2024",
    description: "O maior desafio para desenvolvedores indie! Durante 2 semanas, você e seu time vão criar um jogo totalmente original com mecânicas inovadoras.\n\nEste é um evento mais relaxado que permite mais tempo e planejamento, perfeito para teams que querem entregar algo mais polido.",
    coverURL: "https://indiegamedevs.org/images/igdc-2024.jpg",
    organizer: "Indie Game Developers Alliance",
    startDate: "2024-10-01",
    endDate: "2024-10-14",
    status: "finished",
    theme: "\"Futuro Distópico\"",
    participants: 4500,
    prize: "Prêmios em dinheiro, distribuição em plataformas indie, e contratos potenciais com publishers",
    rules: "1. Equipes de 2 a 6 pessoas\n2. Período de 2 semanas\n3. Tema é obrigatório\n4. Mínimo 30 minutos de gameplay\n5. Todas as plataformas aceitas",
    website: "https://indiegamedevs.org",
    tags: JSON.stringify(["2-semanas", "inovação", "indie", "prêmios-altos"])
  }
];

// Para inserir esses dados no banco de dados usando Sequelize:
// No seu servidor, você pode executar:
/*
const GameJams = require('./models/gameJams.js');

async function seedGameJams() {
  try {
    await GameJams.bulkCreate(gameJamsExamples);
    console.log('Game Jams inseridas com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir game jams:', error);
  }
}

seedGameJams();
*/

module.exports = gameJamsExamples;
