import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AuthContext from '../contexts/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [userGames, setUserGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getUserGames = async (username) => {
    setGamesLoading(true);
    try {
      const response = await api.get(`/games?developer=${encodeURIComponent(username)}`);
      setUserGames(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao buscar jogos do usuário:', error);
      setUserGames([]);
    } finally {
      setGamesLoading(false);
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await api.get('/currentUser');
      setUserInfo(response.data);
      if (response.data.username) {
        await getUserGames(response.data.username);
      }
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
    }
  };

    const username = userInfo?.username || 'Desenvolvedor';

  useEffect(() => {
    if (user) {
      getUserInfo();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-16">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-400 font-semibold">Perfil do Desenvolvedor</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-100">Olá, {username}</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">Gerencie suas informações, veja seu histórico de uploads e acesse recursos exclusivos para membros autenticados.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={handleLogout} className="cursor-pointer inline-flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition-all">
              Sair da Conta
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500 flex items-center justify-center text-2xl font-black text-white">{username[0]?.toUpperCase() || 'D'}</div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-[0.35em]">Usuário</p>
                  <p className="text-xl font-bold text-slate-100">{username}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span>Email</span>
                  <span className="text-slate-200">{userInfo?.email || 'Email não disponível'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span>Status</span>
                  <span className="text-green-400">Autenticado</span>
                </div>
                <div className="flex justify-between">
                  <span>Criado em</span>
                  <span className="text-slate-200">{userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'Data não disponível'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <h2 className="text-sm uppercase tracking-[0.35em] text-slate-500">Ações rápidas</h2>
              <button onClick={() => navigate('/upload')} className="cursor-pointer w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-all">
                Enviar novo jogo
              </button>
              <button onClick={() => navigate('/')} className="cursor-pointer w-full rounded-2xl border border-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-slate-700 transition-all">
                Voltar ao catálogo
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Resumo da conta</p>
                  <h2 className="text-2xl font-bold text-slate-100">Seu painel de desenvolvedor</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Uploads</p>
                  <p className="mt-3 text-3xl font-black text-indigo-400">{gamesLoading ? '...' : userGames.length}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Projetos Favoritos</p>
                  <p className="mt-3 text-3xl font-black text-slate-200">0</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Open Source</p>
                  <p className="mt-3 text-3xl font-black text-slate-200">Sim</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100">Seus jogos publicados</h3>
                <span className="text-xs uppercase tracking-[0.35em] text-slate-500">{gamesLoading ? 'Carregando...' : `${userGames.length} jogos`}</span>
              </div>
              {gamesLoading ? (
                <div className="flex items-center justify-center py-10 text-slate-400">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
                </div>
              ) : userGames.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-center text-slate-400">
                  Nenhum jogo publicado ainda. Use o botão acima para enviar o primeiro.
                </div>
              ) : (
                <div className="space-y-4">
                  {userGames.map((game) => (
                    <div key={game.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-400">{game.visibility || 'Público'}</p>
                          <h4 className="mt-1 text-lg font-semibold text-slate-100">{game.title}</h4>
                          <p className="mt-2 text-sm text-slate-400 line-clamp-2">{game.description}</p>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{game.version || 'v1.0.0'}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="rounded-full border border-slate-800 px-2 py-1">{(game.platforms || []).join(', ') || 'Sem plataforma'}</span>
                        <span className="rounded-full border border-slate-800 px-2 py-1">{game.fileSize || 'Tamanho não definido'}</span>
                        <span className="rounded-full border border-slate-800 px-2 py-1">{game.isWebGLLaunchable ? 'Web' : 'Desktop'}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(game.tags || []).slice(0, 4).map((tag, idx) => (
                          <span key={idx} className="text-[11px] bg-slate-900 border border-slate-800 px-2 py-1 rounded-full text-slate-400">{tag}</span>
                        ))}
                      </div>
                      <button onClick={() => navigate(`/game/${game.id}`)} className="mt-4 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all">
                        Ver jogo
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100">Informações de segurança</h3>
                <span className="text-xs uppercase tracking-[0.35em] text-slate-500">Recomendações</span>
              </div>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4">
                  <strong className="text-slate-200">Use senha forte</strong> e ative autenticação de dois fatores quando disponível.
                </li>
                <li className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4">
                  <strong className="text-slate-200">Mantenha seu email atualizado.</strong> Ele será usado para recuperação de conta.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProfilePage;