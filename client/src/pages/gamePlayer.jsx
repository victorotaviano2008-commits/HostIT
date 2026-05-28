import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import database from '../services/api';

const GamePlayer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [activeTab, setActiveTab] = useState('sobre');
    const [gameStarted, setGameStarted] = useState(false);
    const [isStarred, setIsStarred] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isForked, setIsForked] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getSafeFileUrl = (url) => {
        if (!url || typeof url !== 'string') return url;
        return url.replace(/^http:\/\/hostit-server\.up\.railway\.app(?::\d+)?(\/.*)?$/,
            (match, path = '/') => `https://hostit-server.up.railway.app${path}`
        );
    };

    const normalizeGameResponse = (data) => {
        if (!data || typeof data !== 'object') return data;
        const rawFileUrl = data.fileURL ?? data.fileUrl ?? data.url ?? null;
        return {
            ...data,
            fileURL: getSafeFileUrl(rawFileUrl)
        };
    };

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await database.get(`/games/${id}`);
                console.log('Game data fetched:', response.data);
                const safeData = normalizeGameResponse(response.data);
                console.log('Normalized game data:', safeData);
                if (!safeData.fileURL) {
                    throw new Error('Game file URL is missing');
                }
                setGame(safeData);
                setIsFavorited(!!safeData.isFavorited);
            } catch (err) {
                setError('Error loading game: ' + (err.response?.data?.message || err.message));
                console.error('Error fetching game:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg">Loading game...</p>
                </div>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-lg mb-4">{error || 'Game not found'}</p>
                    <a href="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition">
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* NAVBAR */}
      <nav className="border-b border-slate-900 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-black tracking-tight">
            Host<span className="text-indigo-500">IT</span>
          </a>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <button onClick={() => navigate('/explore')} className="hover:text-slate-100 transition-colors">Explorar</button>
            <button onClick={() => navigate('/profile')} className="bg-slate-900 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:border-slate-700 transition-colors">
              Minha Conta
            </button>
          </div>
        </div>
      </nav>

      {/* CABEÇALHO DO PROJETO (ESTILO GITHUB) */}
      <header className="bg-slate-900/40 border-b border-slate-900 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Identificação do Repositório */}
          <div className="flex items-center gap-2 text-lg sm:text-xl font-mono">
            <a href="/" className="text-indigo-400 hover:underline">@{game?.developer || 'unknown'}</a>
            <span className="text-slate-600">/</span>
            <a href="/" className="font-bold hover:underline text-slate-200">{(game?.title || '').toLowerCase().replace(/[^a-z0-9]/g, '-')}</a>
            <span className="text-xs font-sans bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full ml-2">{game?.visibility || 'Public'}</span>            <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full ml-2">{game?.codeOpenSource ? 'Open Source' : 'Closed Source'}</span>          </div>

          {/* Ações Sociais / Gamedev Stats */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button onClick={async () => {
                  try {
                    const res = await database.post(`/games/${id}/star`);
                    setGame(prev => ({ ...prev, stars: res.data.stars }));
                    setIsStarred(true);
                  } catch (e) {
                    console.error('Failed to star:', e);
                  }
                }} className={`flex items-center border border-slate-800 text-xs font-semibold rounded-lg overflow-hidden transition-colors ${isStarred ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-900 hover:bg-slate-800 text-slate-200'}`}>
              <span className="px-3 py-1.5 flex items-center gap-1 border-r border-slate-800">
                ⭐ Star
              </span>
              <span className="px-2.5 py-1.5 bg-slate-950 text-slate-400 font-mono">
                {game?.stars ?? 0}
              </span>
            </button>

            <button onClick={async () => {
                  try {
                    const res = await database.post(`/games/${id}/favorite`);
                    setIsFavorited(!!res.data.favorited);
                  } catch (e) {
                    console.error('Failed to toggle favorite:', e);
                  }
                }} className={`flex items-center border border-slate-800 text-xs font-semibold rounded-lg overflow-hidden transition-colors ${isFavorited ? 'bg-pink-600 text-white hover:bg-pink-500' : 'bg-slate-900 hover:bg-slate-800 text-slate-200'}`}>
              <span className="px-3 py-1.5 flex items-center gap-1 border-r border-slate-800">
                ♥ Favorite
              </span>
              <span className="px-2.5 py-1.5 bg-slate-950 text-slate-400 font-mono">
                {isFavorited ? 'Favorited' : 'Favorite'}
              </span>
            </button>

            <button onClick={() => setIsForked((prev) => !prev)} className={`flex items-center border border-slate-800 text-xs font-semibold rounded-lg overflow-hidden transition-colors ${isForked ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-900 hover:bg-slate-800 text-slate-200'}`}>
              <span className="px-3 py-1.5 flex items-center gap-1 border-r border-slate-800">
                ⑂ Fork
              </span>
              <span className="px-2.5 py-1.5 bg-slate-950 text-slate-400 font-mono">
                {(game?.forks ?? 0) + (isForked ? 1 : 0)}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ÁREA DO PLAYER OU DOWNLOAD */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        {game?.isWebGLLaunchable ? (
          /* CASO 1: JOGO EXECUTÁVEL NO NAVEGADOR */
          <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative aspect-video flex flex-col justify-center items-center group">
            {!gameStarted ? (
              // Tela de pré-carregamento/Clique para Jogar
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col justify-center items-center z-10 p-6 text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform cursor-pointer mb-4" onClick={() => setGameStarted(true)}>
                  ▶
                </div>
                <h2 className="text-xl font-bold tracking-tight">{game?.title}</h2>
                <p className="text-xs text-slate-500 mt-1 font-mono">Clique em "Jogar" para iniciar a build no modo de visualização.</p>
                <button onClick={() => setGameStarted(true)} className="mt-6 rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all">
                  Jogar agora
                </button>
              </div>
            ) : (
              <div className="w-full h-full bg-black relative overflow-hidden">
                <iframe
                  title="Game Player"
                  src={game?.fileURL}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="autoplay; fullscreen *; payment"
                />

                <div className="absolute bottom-0 inset-x-0 h-16 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/70 px-4 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-3 font-mono">
                    <button onClick={() => setGameStarted(false)} className="rounded-full border border-slate-800 px-3 py-1 hover:bg-slate-900 transition">Parar</button>
                    <button onClick={() => setIsMuted((prev) => !prev)} className="rounded-full border border-slate-800 px-3 py-1 hover:bg-slate-900 transition">{isMuted ? 'Som off' : 'Som on'}</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{game?.version || 'v1.0.0'}</span>
                    <button onClick={() => window.open(game?.fileURL, '_blank', 'noreferrer')} className="rounded-full bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-500 transition">
                      Abrir build
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* CASO 2: APENAS BAIXÁVEL (ESTILO CARD DE DOWNLOAD DO ITCH.IO) */
          <div className="w-full bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-8 text-center md:text-left md:flex md:items-center md:justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900 px-2.5 py-0.5 rounded-full">
                Versão Desktop
              </span>
              <h2 className="text-2xl font-black tracking-tight">{game?.title}</h2>
              <p className="text-sm text-slate-400 max-w-xl">
                Este projeto não possui suporte para execução direta pelo navegador. Baixe os arquivos compilados para a sua máquina de forma segura.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-1 text-xs font-mono text-slate-500">
                <span>📦 Tamanho: {game?.fileSize || '—'}</span>
                <span>•</span>
                <span>💻 Sistemas: {(game?.platforms || []).join(', ')}</span>
              </div>
            </div>
            
            <a href={game?.fileURL || '#'} target="_blank" rel="noreferrer" className="mt-6 md:mt-0 w-full md:w-auto whitespace-nowrap bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1a3 3 0 00-3-3H7a3 3 0 00-3 3zm5-6l3 3m0 0l3-3m-3 3V4"></path></svg>
              Baixar Jogo ({game?.fileSize || '—'})
            </a>
          </div>
        )}
      </section>

      {/* NAVEGAÇÃO DE ABAS INTERNAS (SISTEMA DE TABS) */}
      <main className="max-w-6xl mx-auto px-4 mt-12">
        <div className="border-b border-slate-900 flex gap-6 text-sm font-medium">
          <button 
            onClick={() => setActiveTab('sobre')}
            className={`pb-4 border-b-2 transition-all ${activeTab === 'sobre' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            📜 Sobre o Jogo
          </button>
        </div>

        {/* CONTEÚDO DAS ABAS */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA DA ESQUERDA: CONTEÚDO PRINCIPAL DA ABA */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeTab === 'sobre' && (
              <article className="prose prose-invert max-w-none space-y-4">
                <p className="text-slate-300 leading-relaxed text-base">
                  {game?.description}
                </p>
                <h3 className="text-lg font-bold tracking-tight text-slate-200 pt-4">Instruções e Controles</h3>
                <ul className="bg-slate-900/60 border border-slate-900 rounded-xl p-4 text-sm text-slate-400 space-y-2 font-mono">
                  <li>[ A / D ] ou [ Setas ] — Mover o Personagem</li>
                  <li>[ Barra de Espaço ] — Pulo duplo</li>
                  <li>[ E ] — Interagir com terminais virtuais</li>
                </ul>
              </article>
            )}

          </div>

          {/* COLUNA DA DIREITA: METADADOS E METRICS */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Metadados</h3>
              
              <div className="text-xs space-y-3 font-medium">
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">Publicado em</span>
                  <span className="text-slate-300">Março, 2026</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">Engine</span>
                  <span className="text-slate-300">Godot 4.x</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">Licença</span>
                  <span className="text-indigo-400 hover:underline cursor-pointer">{game?.license || 'Proprietary'}</span>
                </div>
                {game?.repositoryUrl && (
                  <div className="flex justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-slate-500">Repositório</span>
                    <a href={game.repositoryUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline text-sm truncate max-w-[9rem] text-right">
                      {game.repositoryUrl}
                    </a>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Tags do Projeto</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(game?.tags || []).map((tag, idx) => (
                    <span key={idx} className="text-[11px] font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
    );
};

export default GamePlayer;
