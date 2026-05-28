import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import api from '../services/api';
import AuthContext from '../contexts/AuthContext';

const GameJamDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [jam, setJam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);

  useEffect(() => {
    const fetchGameJam = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/jams/${id}`);
        setJam(response.data);
      } catch (err) {
        console.error('Error fetching game jam:', err);
        setError('Não foi possível carregar os detalhes da game jam.');
      } finally {
        setLoading(false);
      }
    };

    fetchGameJam();
  }, [id]);

  const handleParticipate = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setIsParticipating(!isParticipating);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getJamStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'finished';
    return 'ongoing';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error || !jam) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <button onClick={() => navigate('/')} className="text-2xl font-black tracking-tight text-slate-100 hover:opacity-90">Host<span className="text-indigo-500">IT</span></button>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/jams')} className="text-sm text-slate-300 hover:text-slate-100 transition-colors">Voltar</button>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-6 text-red-200">
            {error || 'Game Jam não encontrada'}
          </div>
        </div>
      </div>
    );
  }

  const status = getJamStatus(jam.startDate, jam.endDate);
  const statusBadge = getStatusBadge(status);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button onClick={() => navigate('/')} className="text-2xl font-black tracking-tight text-slate-100 hover:opacity-90">Host<span className="text-indigo-500">IT</span></button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/jams')} className="text-sm text-slate-300 hover:text-slate-100 transition-colors">← Voltar</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        {/* Hero Banner */}
        <div className="rounded-3xl overflow-hidden border border-slate-800 mb-8">
          <div className="relative h-64 bg-slate-950/70 flex items-center justify-center text-slate-500">
            {jam.coverURL ? (
              <img src={jam.coverURL} alt={jam.title} className="h-full w-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                <p className="text-3xl font-bold text-slate-300">{jam.title}</p>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusBadge.color}`}>
                {statusBadge.text}
              </span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black tracking-tight text-slate-100 mb-3">{jam.title}</h1>
          <p className="text-lg text-slate-400">Organizado por <span className="text-slate-200 font-semibold">@{jam.organizer}</span></p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Participantes</p>
            <p className="mt-2 text-3xl font-black text-indigo-400">{jam.participants || 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tema</p>
            <p className="mt-2 text-lg font-bold text-slate-100">{jam.theme || 'Sem tema definido'}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Duração</p>
            <p className="mt-2 text-lg font-bold text-slate-100">{Math.ceil((new Date(jam.endDate) - new Date(jam.startDate)) / (1000 * 60 * 60 * 24))} dias</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold mb-4 text-slate-100">Sobre a Jam</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{jam.description}</p>
            </div>

            {/* Dates */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold mb-6 text-slate-100">Datas e Horários</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Início</p>
                  <p className="mt-1 text-lg font-semibold text-slate-200">{formatDate(jam.startDate)}</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Término</p>
                  <p className="mt-1 text-lg font-semibold text-slate-200">{formatDate(jam.endDate)}</p>
                </div>
              </div>
            </div>

            {/* Rules */}
            {jam.rules && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
                <h2 className="text-2xl font-bold mb-4 text-slate-100">Regras</h2>
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{jam.rules}</div>
              </div>
            )}

            {/* Prize */}
            {jam.prize && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
                <h2 className="text-2xl font-bold mb-4 text-slate-100">Prêmios</h2>
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{jam.prize}</div>
              </div>
            )}

            {/* Tags */}
            {jam.tags && jam.tags.length > 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
                <h2 className="text-2xl font-bold mb-4 text-slate-100">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {jam.tags.map((tag, idx) => (
                    <span key={idx} className="text-sm bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-full px-4 py-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 sticky top-24 space-y-4">
              <button
                onClick={handleParticipate}
                className={`w-full rounded-full px-6 py-3 text-lg font-semibold transition-all ${
                  isParticipating
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isParticipating ? '✓ Participando' : 'Participar da Jam'}
              </button>

              {jam.website && (
                <a
                  href={jam.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 px-6 py-3 text-lg font-semibold text-slate-100 transition-all"
                >
                  Site Oficial
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}

              <div className="pt-4 border-t border-slate-700 space-y-3">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Informações</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Organizador</span>
                    <span className="text-slate-200 font-semibold">@{jam.organizer}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge.color}`}>
                      {statusBadge.text}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Visibilidade</span>
                    <span className="text-slate-200 font-semibold">{jam.visibility || 'Pública'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameJamDetailsPage;
