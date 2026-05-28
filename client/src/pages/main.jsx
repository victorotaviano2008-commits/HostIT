import api from "../services/api";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../contexts/AuthContext";

const Main = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchGames = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/games');
            setGames(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching games:', error);
            setError('Não foi possível carregar os jogos no momento.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

    const displayedGames = searchQuery.trim() ? filteredGames : games;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Links Esquerdos */}
          <div className="flex items-center gap-8">
              <button onClick={() => navigate('/')} className="text-2xl font-black tracking-tight text-slate-100 hover:opacity-90">
              Host<span className="text-indigo-500">IT</span>
              </button>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
              <button onClick={() => navigate('/explore')} className="hover:text-slate-100 transition-colors">Explorar</button>
              <button onClick={() => navigate('/upload')} className="hover:text-slate-100 transition-colors">Enviar</button>
              <button onClick={() => navigate('/jams')} className="hover:text-slate-100 transition-colors">Game Jams</button>
              </div>
          </div>

          {/* Barra de Busca Central */}
          <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input
                  type="text"
                  placeholder="Buscar jogos, desenvolvedores, código..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              </div>
          </div>

          {/* Ações Direitas */}
          <div className="flex items-center gap-4">
              <button onClick={() => navigate('/upload')} className="cursor-pointer hidden sm:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-md shadow-indigo-600/10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Enviar Projeto
              </button>
              <button onClick={() => navigate(user ? '/profile' : '/auth')} className="cursor-pointer text-slate-200 text-sm font-semibold hover:text-slate-100 transition-colors">
                  {user ? 'Perfil' : 'Minha Conta'}
              </button>
          </div>

          </div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
          HOST<span className="text-transparent bg-clip-text bg-gradient-to-r select-none from-indigo-400 to-purple-400">IT</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto font-medium">
          Explore criações independentes, hospede jogos gratuitamente e conecte-se com uma comunidade apaixonada por desenvolvimento de jogos. Publique seus projetos, compartilhe código e faça parte da revolução indie!
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate('/explore')} className="bg-slate-900 border border-slate-800 hover:border-slate-700 font-semibold px-6 py-2.5 rounded-lg transition-all">
              Ver Jogos Publicados
          </button>
          <button onClick={() => navigate('/upload')} className="bg-indigo-600 hover:bg-indigo-500 font-semibold px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-600/20">
              Publicar Seu Jogo
          </button>
          </div>
      </header>

      {/* FEED PRINCIPAL DE JOGOS */}
      <main id="jogos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8 border-b border-slate-900 pb-4">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Últimos jogos publicados
          </h2>
          <div className="flex gap-2 text-sm text-slate-400">
              <button className="px-3 py-1 bg-slate-900 text-indigo-400 font-medium rounded-md border border-slate-800">Tudo</button>
              <button className="px-3 py-1 hover:text-slate-200 rounded-md transition-colors">Open Source</button>
              <button className="px-3 py-1 hover:text-slate-200 rounded-md transition-colors">Web GL</button>
          </div>
          </div>

          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center text-slate-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-6 text-red-200">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedGames.map((game) => (
                <div 
                key={game.id} 
                className="group rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
                >
                <div className="relative overflow-hidden h-48 bg-slate-950">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),transparent_36%)]" />
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs font-semibold uppercase tracking-[0.3em]">
                      {game.gamerCoverURL ? (
                        <img src={game.gamerCoverURL} alt={game.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="px-6 text-center">
                          <span className="block text-[10px] uppercase text-slate-500 tracking-[0.4em]">Sem capa</span>
                          <p className="mt-2 text-2xl font-bold text-slate-200 line-clamp-1">{game.title?.slice(0, 20) || 'Sem título'}</p>
                        </div>
                      )}
                    </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-bold text-lg leading-snug hover:text-indigo-400 cursor-pointer transition-colors line-clamp-1">
                        {game.title}
                        </h3>
                        <span className="text-sm font-bold text-amber-400 flex items-center gap-0.5 whitespace-nowrap">
                        ★ {game.stars ?? 0}
                        </span>
                    </div>

                    <p className="text-xs font-mono text-slate-500 mb-3">
                        por <span className="hover:text-indigo-400 cursor-pointer">@{game.developer || 'anônimo'}</span>
                    </p>

                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                        {game.description || 'Sem descrição fornecida.'}
                    </p>
                    </div>

                    <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {(game.tags || []).slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[11px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                            {tag}
                        </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                        {game.isWebGLLaunchable ? 'WebGL' : 'Download'}
                        </span>
                        <button onClick={() => navigate(`/game/${game.id}`)} className="text-indigo-400 font-semibold group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                        Ver
                        <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                    </div>
                </div>
                
                </div>
              ))}
            </div>
          )}
      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-slate-900 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>© {new Date().getFullYear()} HostIT. Built for Gamedevs.</div>
          <div className="flex gap-6">
              <button className="hover:text-slate-300">Termos</button>
              <button className="hover:text-slate-300">GitHub da Plataforma</button>
          </div>
          </div>
      </footer>

      </div>
    );
};

export default Main;
