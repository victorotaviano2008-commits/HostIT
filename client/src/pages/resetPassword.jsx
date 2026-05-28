import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import api from '../services/api';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            setVerifying(true);
            setError('');

            if (!token) {
                setError('Token não fornecido. Solicite um novo link de reset.');
                setVerifying(false);
                return;
            }

            try {
                const response = await api.get('/auth/verify-reset-token', {
                    params: { token }
                });
                setTokenValid(true);
            } catch (err) {
                setError(err.response?.data?.message || 'Link inválido ou expirado');
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('As senhas não correspondem');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/reset-password', {
                token,
                newPassword,
                confirmPassword
            });
            setMessage(response.data.message || 'Senha redefinida com sucesso!');
            setSubmitted(true);
            setTimeout(() => navigate('/auth'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao redefinir senha');
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
        
        {/* Efeito sutil de iluminação de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10" />

        {/* CONTAINER DO CARD */}
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
            
            {/* LOGO E CABEÇALHO */}
            <div className="text-center space-y-2">
            <button onClick={() => navigate('/')} className="text-3xl font-black tracking-tight inline-block hover:opacity-90 transition-opacity">
                Host<span className="text-indigo-500">IT</span>
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-slate-200">
                Nova Senha
            </h1>
            <p className="text-sm text-slate-400 font-medium">
                Digite sua nova senha abaixo.
            </p>
            </div>

            {/* ERRO DE TOKEN INVÁLIDO */}
            {!tokenValid && (
                <div className="space-y-4">
                    <div className="rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                        {error || 'Link inválido ou expirado'}
                    </div>
                    <button 
                    onClick={() => navigate('/auth/forgot-password')}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
                    >
                        Solicitar novo link
                    </button>
                </div>
            )}

            {/* FORMULÁRIO */}
            {tokenValid && !submitted && (
                <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-2 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400">Nova Senha</label>
                    <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <p className="text-[11px] text-slate-500">Mínimo 6 caracteres</p>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400">Confirmar Senha</label>
                    <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                </div>

                {/* BOTÃO DE SUBMIT */}
                <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors mt-6"
                >
                {loading ? 'Processando...' : 'Redefinir Senha'}
                </button>
            </form>
            )}

            {/* SUCESSO */}
            {submitted && (
                <div className="space-y-4">
                    <div className="rounded-xl border border-green-500/20 bg-green-950/40 px-4 py-3 text-sm text-green-300">
                        {message}
                    </div>
                    <p className="text-sm text-slate-400 text-center">
                        Redirecionando para login em 2 segundos...
                    </p>
                </div>
            )}

            {/* LINK PARA LOGIN */}
            <div className="flex items-center justify-center gap-1 text-xs">
            <span className="text-slate-400">Voltar ao</span>
            <button onClick={() => navigate('/auth')} className="text-indigo-400 hover:underline font-semibold">
                Login
            </button>
            </div>
        </div>
        </div>
    );
};

export default ResetPasswordPage;
