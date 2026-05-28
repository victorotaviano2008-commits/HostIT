import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import AuthContext from '../contexts/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setMessage(err.response?.data?.message || err.message || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
        
        {/* Efeito sutil de iluminação de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10" />

        {/* CONTAINER DO CARD */}
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
            
            {/* LOGO E CABEÇALHO */}
            <div className="text-center space-y-2">
            <a href="#" className="text-3xl font-black tracking-tight inline-block hover:opacity-90 transition-opacity">
                Host<span className="text-indigo-500">IT</span>
            </a>
            <h1 className="text-xl font-bold tracking-tight text-slate-200">
                Bem-vindo de volta, dev
            </h1>
            <p className="text-xs text-slate-400 font-medium">
                Conecte-se para gerenciar seus jogos e repositórios.
            </p>
            </div>

            {/* DIVISOR VISUAL */}
            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-slate-800 after:flex-1 after:border-t after:border-slate-800">
            <span className="px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">ou via e-mail</span>
            </div>

            {/* FORMULÁRIO TRADICIONAL */}
            <form className="space-y-4" onSubmit={handleSubmit}>
            {message && (
              <div className="rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-2 text-sm text-red-300">
                {message}
              </div>
            )}
            <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400">E-mail corporativo ou pessoal</label>
                <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-400">Senha</label>
                <button type="button" onClick={() => navigate('/auth/forgot-password')} className="text-[11px] text-indigo-400 hover:underline">Esqueceu a senha?</button>
                </div>
                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
            </div>

            {/* BOTÃO DE SUBMIT */}
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 font-semibold py-2.5 rounded-lg transition-all text-sm text-white shadow-lg shadow-indigo-600/10 mt-2 disabled:cursor-not-allowed"
            >
                {loading ? 'Entrando...' : 'Acessar Plataforma'}
            </button>
            </form>

            {/* FOOTER DO CARD */}
            <p className="text-center text-xs text-slate-500 pt-2">
            Novo no HostIT?{' '}
            <button onClick={() => navigate('/auth/register')} className="cursor-pointer text-indigo-400 font-medium hover:underline">
                Crie sua conta agora
            </button>
            </p>

        </div>

        {/* FOOTER DA PÁGINA */}
        <footer className="mt-12 text-[10px] font-mono text-slate-600 space-x-4">
            <a href="#" className="hover:text-slate-400">Proteção de Dados</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400">Suporte Técnico</a>
        </footer>

        </div>
    );
}

export default LoginPage;