import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import AuthContext from '../contexts/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await register({ username, email, password });
            navigate('/auth');
        } catch (err) {
            setMessage(err.response?.data?.message || err.message || 'Erro ao registrar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white py-12">
        
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
                Crie sua conta de desenvolvedor
            </h1>
            <p className="text-xs text-slate-400 font-medium">
                Publique jogos, gerencie códigos e faça parte da comunidade.
            </p>
            </div>

            {/* DIVISOR VISUAL */}
            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-slate-800 after:flex-1 after:border-t after:border-slate-800">
            <span className="px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">ou preencha os dados</span>
            </div>

            {/* FORMULÁRIO TRADICIONAL */}
            <form className="space-y-4" onSubmit={handleSubmit}>
            {message && (
              <div className="rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-2 text-sm text-red-300">
                {message}
              </div>
            )}
            <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400">Nome de Usuário</label>
                <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-600 font-mono text-sm">
                    @
                </span>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="seu_usuario" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400">E-mail</label>
                <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="dev@exemplo.com" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
            </div>

            <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400">Senha</label>
                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 8 caracteres" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
            </div>

            {/* CHECKBOX DE TERMOS */}
            <div className="flex items-start gap-3 pt-1">
                <input 
                type="checkbox" 
                id="terms"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                className="mt-0.5 w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500/20 focus:ring-offset-0 cursor-pointer accent-indigo-500"
                />
                <label htmlFor="terms" className="text-xs text-slate-400 leading-normal cursor-pointer select-none">
                Aceito os <a href="#" className="text-indigo-400 hover:underline">Termos de Serviço</a> e concordo em manter os repositórios públicos em conformidade com as licenças escolhidas.
                </label>
            </div>

            {/* BOTÃO DE CRIAÇÃO */}
            <button 
                type="submit" 
                disabled={!agreedToTerms || loading}
                className={`w-full font-semibold py-2.5 rounded-lg transition-all text-sm text-white shadow-lg mt-2 ${
                agreedToTerms && !loading
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/10 cursor-pointer' 
                    : 'bg-slate-800 text-slate-500 shadow-none cursor-not-allowed border border-slate-800/50'
                }`}
            >
                {loading ? 'Criando conta...' : 'Criar Minha Conta'}
            </button>
            </form>

            {/* FOOTER DO CARD */}
            <p className="text-center text-xs text-slate-500 pt-2">
            Já possui uma conta?{' '}
            <button onClick={() => navigate('/auth')} className="cursor-pointer text-indigo-400 font-medium hover:underline">
                Faça login
            </button>
            </p>

        </div>

        {/* FOOTER DA PÁGINA */}
        <footer className="mt-12 text-[10px] font-mono text-slate-600 space-x-4">
            <a href="#" className="hover:text-slate-400">Políticas de Uso</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400">Código de Conduta</a>
        </footer>

        </div>
    );
}

export default RegisterPage;