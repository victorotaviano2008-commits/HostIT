import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await api.post('/auth/forgot-password', { email });
            setMessage(response.data.message || 'Email de reset enviado com sucesso!');
            setSubmitted(true);
            
            // Se em desenvolvimento, mostrar o link de reset
            if (response.data.resetLink) {
                setMessage(`${response.data.message}\n\nLink de reset (dev only): ${response.data.resetLink}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao solicitar reset de senha');
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
            <button onClick={() => navigate('/')} className="text-3xl font-black tracking-tight inline-block hover:opacity-90 transition-opacity">
                Host<span className="text-indigo-500">IT</span>
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-slate-200">
                Redefinir Senha
            </h1>
            <p className="text-sm text-slate-400 font-medium">
                Digite seu email para receber um link de reset de senha.
            </p>
            </div>

            {/* FORMULÁRIO */}
            {!submitted ? (
                <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-2 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400">E-mail</label>
                    <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                </div>

                {/* BOTÃO DE SUBMIT */}
                <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors mt-6"
                >
                {loading ? 'Processando...' : 'Enviar Link de Reset'}
                </button>
            </form>
            ) : (
                <div className="space-y-4">
                    <div className="rounded-xl border border-green-500/20 bg-green-950/40 px-4 py-3 text-sm text-green-300">
                        {message.includes('\n') ? (
                            <div className="space-y-2">
                                {message.split('\n').map((line, idx) => (
                                    <p key={idx}>{line}</p>
                                ))}
                            </div>
                        ) : (
                            message
                        )}
                    </div>
                    <p className="text-sm text-slate-400 text-center">
                        Verifique seu email para o link de reset de senha. O link é válido por 15 minutos.
                    </p>
                </div>
            )}

            {/* LINK PARA LOGIN */}
            <div className="flex items-center justify-center gap-1 text-xs">
            <span className="text-slate-400">Lembrou da senha?</span>
            <button onClick={() => navigate('/auth')} className="text-indigo-400 hover:underline font-semibold">
                Voltar ao login
            </button>
            </div>
        </div>
        </div>
    );
};

export default ForgotPasswordPage;
