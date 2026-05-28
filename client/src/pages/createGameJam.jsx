import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';
import AuthContext from '../contexts/AuthContext';

const CreateGameJamPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [organizer, setOrganizer] = useState(user?.email || '');
  const [coverURL, setCoverURL] = useState('');
  const [website, setWebsite] = useState('');
  const [rules, setRules] = useState('');
  const [prize, setPrize] = useState('');
  const [tags, setTags] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!title || !description || !organizer || !startDate || !endDate) {
      setError('Preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError('A data de início deve ser anterior à data de término.');
      setLoading(false);
      return;
    }

    const payload = {
      title,
      description,
      theme,
      organizer,
      coverURL,
      website,
      rules,
      prize,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      startDate,
      endDate,
      visibility
    };

    try {
      const response = await api.post('/jams', payload);
      setMessage('Game Jam criada com sucesso! Redirecionando...');
      setTimeout(() => navigate(`/jams/${response.data.id}`), 1200);
    } catch (err) {
      console.error('Erro ao criar game jam:', err);
      setError(err.response?.data?.message || 'Falha ao criar game jam.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button onClick={() => navigate('/')} className="text-2xl font-black tracking-tight text-slate-100 hover:opacity-90">Host<span className="text-indigo-500">IT</span></button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/jams')} className="text-sm text-slate-300 hover:text-slate-100 transition-colors">Voltar às Game Jams</button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-400">Nova Game Jam</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-slate-100">Iniciar uma nova Game Jam</h1>
          <p className="mt-4 max-w-2xl text-slate-400">Crie uma nova competição, defina tema, regras e campanhas para a sua comunidade de desenvolvedores.</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          {error && (
            <div className="rounded-3xl border border-red-500/20 bg-red-950/30 p-4 text-sm text-red-200 mb-6">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-3xl border border-green-500/20 bg-green-950/30 p-4 text-sm text-green-200 mb-6">
              {message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nome da game jam"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Tema</label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Tema da jam (ex: Futuro Distópico)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a proposta, o público e os critérios principais"
                rows="5"
                className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Organizador</label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="Nome ou equipe organizadora"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">URL de capa</label>
                <input
                  type="url"
                  value={coverURL}
                  onChange={(e) => setCoverURL(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Data de início</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Data de término</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Website oficial</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://seusite.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Visibilidade</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Public">Pública</option>
                  <option value="Private">Privada</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Regras</label>
              <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder="Descreva as regras básicas da game jam"
                rows="4"
                className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Prêmios</label>
              <textarea
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                placeholder="Quais prêmios serão oferecidos?"
                rows="3"
                className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="insira tags separadas por vírgula"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-500">Ex: escola, rápido, design, multiplayer</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:bg-indigo-600/50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Iniciar Game Jam'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateGameJamPage;
