import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/games');
        setGames(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Não foi possível carregar os jogos no momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = games.filter((game) => {
    const query = searchQuery.toLowerCase();
    return (
      game.title?.toLowerCase().includes(query) ||
      game.description?.toLowerCase().includes(query) ||
      game.developer?.toLowerCase().includes(query) ||
      (game.tags || []).some((tag) => tag.toLowerCase().includes(query)) ||
      (game.genre || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button onClick={() => navigate('/')} className="text-2xl font-black tracking-tight text-slate-100 hover:opacity-90">Host<span className="text-indigo-500">IT</span></button>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button onClick={() => navigate('/explore')} className="text-slate-100 font-semibold">Explorar</button>
            <button onClick={() => navigate('/upload')} className="hover:text-slate-100 transition-colors">Enviar</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/upload')} className="hidden sm:inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-md shadow-indigo-600/10">Enviar Projeto</button>
            <button onClick={() => navigate('/auth')} className="text-sm text-slate-300 hover:text-slate-100 transition-colors">Minha Conta</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-400">Explorar</p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-slate-100">Todos os jogos publicados</h1>
              <p className="mt-4 max-w-2xl text-slate-400">Navegue por jogos, plataformas, tags e desenvolvedores. Clique em qualquer card para ver mais detalhes.</p>
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-sm font-semibold mr-2 text-slate-300 mb-2 inline-block">Buscar jogos</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Procure por título, desenvolvedor, tag..."
                className="w-full sm:w-80 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[42vh] items-center justify-center text-slate-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-6 text-red-200">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGames.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                Nenhum jogo encontrado para sua pesquisa.
              </div>
            ) : (
              filteredGames.map((game) => (
                <article key={game.id} className="group rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl transition-all hover:border-indigo-500/40 hover:-translate-y-0.5">
                  <div className="relative h-48 bg-slate-950/70 flex items-center justify-center text-slate-500 text-sm font-semibold uppercase tracking-[0.2em]">
                    {game.gamerCoverURL ? (
                      <img src={game.gamerCoverURL} alt={game.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="px-6 text-center">
                        <span className="block text-xs uppercase text-slate-500 tracking-[0.3em]">Imagem não disponível</span>
                        <p className="mt-2 text-2xl font-bold text-slate-200">{game.title?.slice(0, 18) || 'Jogo'}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3 text-xs text-slate-500 uppercase tracking-[0.3em]">
                        <span>{game.genre ? game.genre.toUpperCase() : 'Gênero livre'}</span>
                        <span>{game.visibility || 'Público'}</span>
                      </div>
                      <h2 className="font-semibold text-xl text-slate-100 leading-tight">
                        {game.title}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-slate-400 line-clamp-3">
                        {game.description || 'Descrição não disponível.'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap gap-2">
                        {(game.tags || []).slice(0, 4).map((tag, idx) => (
                          <span key={idx} className="text-[11px] bg-slate-950 border border-slate-800 text-slate-400 rounded-full px-2.5 py-1">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>por @{game.developer || 'anônimo'}</span>
                        <span>{game.fileSize || 'Tamanho não definido'}</span>
                      </div>

                      <button
                        onClick={() => navigate(`/game/${game.id}`)}
                        className="w-full rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExplorePage;
