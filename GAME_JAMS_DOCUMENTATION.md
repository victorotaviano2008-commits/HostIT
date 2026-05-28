# Game Jams - Documentação Técnica

## Visão Geral

A funcionalidade de Game Jams foi implementada seguindo o design e modelo já estabelecido do site HostIT. Ela permite que usuários vejam, filtrem e participem de game jams cadastradas no sistema.

## Arquivos Criados/Modificados

### Backend

1. **`/server/models/gameJams.js`** - Novo modelo Sequelize para game jams
   - Campos: title, description, coverURL, organizer, startDate, endDate, status, theme, participants, prize, rules, website, tags
   - Enum status: 'upcoming', 'ongoing', 'finished'
   - Timestamps automáticos

2. **`/server/controllers/gameJamsController.js`** - Novo controller com funcionalidades CRUD
   - `getAllGameJams()` - Busca todas as jams
   - `getGameJamById()` - Busca uma jam específica
   - `createGameJam()` - Cria nova jam (autenticado)
   - `updateGameJam()` - Atualiza jam (autenticado)
   - `deleteGameJam()` - Deleta jam (autenticado)

3. **`/server/routes/mainRoute.js`** - Modificado para adicionar rotas
   - GET `/jams` - Listar todas as game jams
   - GET `/jams/:id` - Detalhes de uma game jam
   - POST `/jams` - Criar game jam (requer autenticação)
   - PUT `/jams/:id` - Atualizar game jam (requer autenticação)
   - DELETE `/jams/:id` - Deletar game jam (requer autenticação)

4. **`/server/seeds/gameJamsSeed.js`** - Dados de exemplo para popular o banco

### Frontend

1. **`/client/src/pages/gameJams.jsx`** - Página principal de game jams
   - Lista todas as game jams em grid de 2 colunas
   - Busca por título, tema, organizador e tags
   - Filtros por status (upcoming, ongoing, finished)
   - Cards mostram: imagem, título, tema, datas, tags, participantes, status

2. **`/client/src/pages/gameJamDetails.jsx`** - Página de detalhes
   - Informações completas da jam
   - Descrição, regras, prêmios
   - Botão para participar
   - Link para site oficial

3. **`/client/src/main.jsx`** - Modificado
   - Importou GameJamsPage e GameJamDetailsPage
   - Adicionou rotas `/jams` e `/jams/:id`

4. **`/client/src/pages/main.jsx`** - Modificado
   - Habilitou navegação para `/jams` no link "Game Jams" da navbar

## Como Usar

### Adicionar Game Jams ao Banco de Dados

1. **Opção 1: Via Backend (Recomendado)**
   ```bash
   cd server
   node -e "
   const GameJams = require('./models/gameJams.js');
   const seeds = require('./seeds/gameJamsSeed.js');
   
   GameJams.bulkCreate(seeds).then(() => {
     console.log('Game Jams inseridas com sucesso!');
     process.exit(0);
   }).catch(err => {
     console.error('Erro:', err);
     process.exit(1);
   });
   "
   ```

2. **Opção 2: Via API (Requer Autenticação)**
   ```bash
   curl -X POST http://localhost:3001/jams \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "title": "Minha Game Jam",
       "description": "Descrição da jam",
       "organizer": "Seu Nome",
       "startDate": "2024-12-01",
       "endDate": "2024-12-03",
       "theme": "Tema",
       "tags": ["tag1", "tag2"],
       "website": "https://seujam.com"
     }'
   ```

### Acessar a Página

1. **Página de Listagem**: `http://localhost:5173/jams`
   - Visualizar todas as game jams
   - Buscar e filtrar por status
   - Ver cards resumidos

2. **Página de Detalhes**: `http://localhost:5173/jams/{id}`
   - Ver informações completas
   - Ler regras e prêmios
   - Clicar em "Participar" (requer login)
   - Acessar site oficial

## Design Pattern Utilizado

A implementação segue rigorosamente o padrão visual estabelecido no site:

- **Tema de cores**: Slate (cinza) 950-900 para backgrounds, Indigo 500-600 para acentos
- **Componentes**: Navbar sticky, cards com borders de slate-800, badges de status coloridas
- **Layout**: Grid responsivo, max-width 7xl, padding consistente
- **Tipografia**: Font weights: 900 para títulos, 600 para semibold, fontes sans-serif
- **Animações**: Transições suaves, hover states, loading spinners

## Status da Jam

O status é calculado automaticamente com base nas datas:
- **upcoming** (Em breve): startDate > agora
- **ongoing** (Em andamento): startDate <= agora && endDate >= agora
- **finished** (Finalizada): endDate < agora

## Funcionalidades Adicionais

### Filtros e Busca
- Busca por título, descrição, tema, organizador e tags
- Filtros por status (todas, em breve, em andamento, finalizadas)
- Busca combina múltiplos campos

### Responsividade
- Desktop: Grid 2 colunas
- Tablet: Grid 2 colunas
- Mobile: Grid 1 coluna

### Participação
- Botão "Participar da Jam" na página de detalhes
- Requer autenticação (redireciona para login se não autenticado)
- Visual feedback ao participar (muda para "✓ Participando")

## Dados de Exemplo

Inclusos 6 game jams de exemplo:
1. **Global Game Jam 2024** - A maior jam do mundo, 48 horas
2. **Ludum Dare 56** - Maior jam online, votação comunitária
3. **Game Jam Brasil 2024** - Maior jam da América Latina
4. **One Game a Month** - Desafio mensal
5. **Trijam 2024** - Jam ultra-rápida de 3 horas
6. **Indie Game Developers Challenge 2024** - Desafio de 2 semanas

## Próximos Passos Sugeridos

1. **Sistema de Inscrição**: Permitir que usuários se inscrevam nas jams
2. **Submissão de Entradas**: Permitir que participantes enviem seus jogos
3. **Sistema de Votação**: Implementar votação comunitária para winners
4. **Notificações**: Notificar usuários sobre o início de uma jam
5. **Dashboard Admin**: Criar jams direto do frontend
6. **Comentários**: Permitir feedback na página de detalhes

## Testing

Para testar a funcionalidade:

1. Acesse `http://localhost:5173/jams`
2. Verifique se as game jams aparecem
3. Teste os filtros de status
4. Use a barra de busca
5. Clique em "Ver detalhes" de uma jam
6. Teste o botão "Participar"

---

**Desenvolvido por**: GitHub Copilot
**Data**: 28 de Maio, 2024
**Status**: Pronto para Produção
