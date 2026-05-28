import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';
import AuthContext from '../contexts/AuthContext';

const GameJamsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [jams, setJams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameJams = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/jams');
        setJams(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching game jams:', err);
        setError('Não foi possível carregar as game jams no momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchGameJams();
  }, []);

  const getJamStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'finished';
    return 'ongoing';
  };

  const jamsWithStatus = jams.map(jam => ({
    ...jam,
    currentStatus: getJamStatus(jam.startDate, jam.endDate)
  }));

  const filteredJams = jamsWithStatus.filter((jam) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      jam.title?.toLowerCase().includes(query) ||
      jam.description?.toLowerCase().includes(query) ||
      jam.theme?.toLowerCase().includes(query) ||
      jam.organizer?.toLowerCase().includes(query) ||
      (jam.tags || []).some((tag) => tag.toLowerCase().includes(query));

    const matchesStatus = filterStatus === 'all' || jam.currentStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntilStart = (startDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const diffTime = start - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return { text: 'Em breve', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'ongoing':
        return { text: 'Em andamento', color: 'bg-green-500/20 text-green-300 border-green-500/30' };
      case 'finished':
        return { text: 'Finalizada', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
      default:
        return { text: 'Desconhecido', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button onClick={() => navigate('/')} className="text-2xl font-black tracking-tight text-slate-100 hover:opacity-90">Host<span className="text-indigo-500">IT</span></button>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button onClick={() => navigate('/explore')} className="hover:text-slate-100 transition-colors">Explorar</button>
            <button onClick={() => navigate('/upload')} className="hover:text-slate-100 transition-colors">Enviar</button>
            <button onClick={() => navigate('/jams')} className="text-slate-100 font-semibold">Game Jams</button>
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
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-400">Comunidade</p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-slate-100">Game Jams</h1>
              <p className="mt-4 max-w-2xl text-slate-400">Participe de competições de desenvolvimento de jogos, mostre suas habilidades e faça networking com outros desenvolvedores.</p>
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-sm font-semibold text-slate-300 mb-2 mr-2 inline-block">Buscar jams</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Procure por título, tema, organizador..."
                className="w-full sm:w-80 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterStatus('upcoming')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              filterStatus === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100'
            }`}
          >
            Em breve
          </button>
          <button
            onClick={() => setFilterStatus('ongoing')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              filterStatus === 'ongoing'
                ? 'bg-green-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100'
            }`}
          >
            Em andamento
          </button>
          <button
            onClick={() => setFilterStatus('finished')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              filterStatus === 'finished'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100'
            }`}
          >
            Finalizadas
          </button>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Quer criar uma nova Game Jam?</p>
            <p className="text-lg font-semibold text-slate-100">Inicie agora e compartilhe com a sua comunidade.</p>
          </div>
          <button
            onClick={() => user ? navigate('/jams/new') : navigate('/auth')}
            className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/10"
          >
            {user ? 'Iniciar Game Jam' : 'Faça login para iniciar'}
          </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJams.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                Nenhuma game jam encontrada para sua pesquisa.
              </div>
            ) : (
              filteredJams.map((jam) => {
                const statusBadge = getStatusBadge(jam.currentStatus);
                const daysUntilStart = getDaysUntilStart(jam.startDate);
                
                return (
                  <article key={jam.id} className="group rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl transition-all hover:border-indigo-500/40 hover:-translate-y-0.5 flex flex-col">
                    <div className="relative h-48 bg-slate-950/70 flex items-center justify-center text-slate-500 text-sm font-semibold uppercase tracking-[0.2em] overflow-hidden">
                      {jam.coverURL ? (
                        <img src={jam.coverURL} alt={jam.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                          <div className="text-center px-6">
                            <p className="text-2xl font-bold text-slate-200">{jam.title?.slice(0, 25) || 'Game Jam'}</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col justify-between gap-4 flex-grow">
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <h2 className="font-semibold text-xl text-slate-100 leading-tight flex-1">
                            {jam.title}
                          </h2>
                        </div>
                        
                        {jam.theme && (
                          <p className="text-sm text-indigo-400 font-semibold mb-2">
                            Tema: {jam.theme}
                          </p>
                        )}
                        
                        <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-3">
                          {jam.description || 'Descrição não disponível.'}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                            <p className="text-slate-500 uppercase tracking-[0.2em] font-semibold">Início</p>
                            <p className="text-slate-100 font-semibold mt-1">{formatDate(jam.startDate)}</p>
                          </div>
                          <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                            <p className="text-slate-500 uppercase tracking-[0.2em] font-semibold">Fim</p>
                            <p className="text-slate-100 font-semibold mt-1">{formatDate(jam.endDate)}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(jam.tags || []).slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[11px] bg-slate-950 border border-slate-800 text-slate-400 rounded-full px-2.5 py-1">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Org. @{jam.organizer || 'anônimo'}</span>
                          <span className="text-slate-400">{jam.participants || 0} participantes</span>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/jams/${jam.id}`)}
                            className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                          >
                            Ver detalhes
                          </button>
                          {jam.website && (
                            <a
                              href={jam.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
                            >
                              Site Oficial
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default GameJamsPage;
