import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';
import AuthContext from '../contexts/AuthContext';

const UploadPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        genre: '',
        gameFile: null,
        coverImage: null,
        version: 'v1.0.0',
        fileSize: '',
        platforms: '',
        tags: '',
        visibility: 'Public',
        isPaid: false,
        sharePercent: 5,
        price: '',
        codeOpenSource: false,
        repoVisibility: 'Public',
        license: 'mit',
        repositoryUrl: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [successGameId, setSuccessGameId] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            setFormData(prev => ({
                ...prev,
                gameFile: file,
                fileSize: `${sizeMB} MB`
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setSuccessGameId(null);

        try {
            if (!formData.title || !formData.description || !formData.gameFile) {
                setMessage('Por favor, preencha todos os campos obrigatórios');
                setLoading(false);
                return;
            }

            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('genre', formData.genre);
            submitData.append('gameFile', formData.gameFile);
            submitData.append('developer', user?.email?.split('@')[0] || 'anonymous');
            submitData.append('version', formData.version);
            submitData.append('fileSize', formData.fileSize);
            submitData.append('platforms', formData.platforms);
            submitData.append('tags', formData.tags);
            submitData.append('visibility', formData.visibility);
            submitData.append('isPaid', formData.isPaid);
            submitData.append('sharePercent', formData.isPaid ? formData.sharePercent : 0);
            submitData.append('price', formData.isPaid ? formData.price : 0);
            submitData.append('codeOpenSource', formData.codeOpenSource);
            submitData.append('repoVisibility', formData.repoVisibility);
            submitData.append('license', formData.codeOpenSource ? formData.license : 'proprietary');
            submitData.append('repositoryUrl', formData.codeOpenSource ? formData.repositoryUrl : '');

            const response = await api.post('/upload', submitData, {
                timeout: 120000 // 120 segundos para uploads grandes
            });

            setMessage('✓ Jogo enviado com sucesso!');
            setSuccessGameId(response.data.gameId);

            setFormData({ 
                title: '', 
                description: '', 
                genre: '', 
                gameFile: null,
                coverImage: null,
                version: 'v1.0.0',
                fileSize: '',
                platforms: '',
                tags: '',
                visibility: 'Public',
                isPaid: false,
                sharePercent: 5,
                price: '',
                codeOpenSource: false,
                repoVisibility: 'Public',
                license: 'mit',
                repositoryUrl: ''
            });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            setMessage('✗ ' + (error.response?.data?.message || error.message || 'Erro ao fazer upload'));
        } finally {
            setLoading(false);
        }
    };

    return (
       <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* NAVBAR SIMPLIFICADA PARA FOCO NO UPLOAD */}
      <nav className="border-b border-slate-900 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-black tracking-tight">
              Host<span className="text-indigo-500">IT</span>
            </a>
            <span className="text-slate-700">/</span>
            <span className="text-sm font-medium text-slate-400">Novo Projeto</span>
          </div>
          <a href="/" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            Cancelar
          </a>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-3xl mx-auto px-4 mt-12">
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight">Hospedar novo projeto</h1>
          <p className="text-slate-400 mt-2">
            Configure sua build jogável e, se desejar, vincule ou crie um repositório Git para o seu código.
          </p>
        </header>

        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-3">
              <span>01.</span> Informações Básicas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Título do Jogo</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Cyber Knight" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Engine / Tecnologia</label>
                <select 
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer">
                  <option value="">Selecione uma opção</option>
                  <option value="godot">Godot Engine</option>
                  <option value="unity">Unity</option>
                  <option value="unreal">Unreal Engine</option>
                  <option value="web">HTML5 / JavaScript Nativo</option>
                  <option value="other">Outra</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Breve Descrição</label>
              <input 
                type="text" 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Uma linha que resume o seu jogo para os cards de busca..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </section>

          {/* SEÇÃO 2: ARQUIVOS E CAPA (ESTILO ITCH.IO) */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-3">
              <span>02.</span> Upload de Mídia e Build
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload da Capa */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Imagem de Capa (400x250)</label>
                <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 text-center cursor-pointer bg-slate-950 transition-colors relative group h-40 flex flex-col justify-center items-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.files[0]?.name || null }))}
                  />
                  <svg className="w-8 h-8 text-slate-500 mb-2 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <p className="text-xs text-slate-400 font-medium">
                    {formData.coverImage ? formData.coverImage : "Arraste uma imagem ou clique para buscar"}
                  </p>
                </div>
              </div>

              {/* Upload do Jogo */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Arquivo do Jogo (ZIP para WebGL/HTML5)</label>
                <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 text-center cursor-pointer bg-slate-950 transition-colors relative group h-40 flex flex-col justify-center items-center">
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    name="gameFile"
                    accept=".zip" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleFileChange}
                  />
                  <svg className="w-8 h-8 text-slate-500 mb-2 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p className="text-xs text-slate-400 font-medium">
                    {formData.gameFile ? formData.gameFile.name : "Envie a build compactada (.zip)"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SEÇÃO 3: JOGO PAGO E REPARTIÇÃO */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                <span>03.</span> Venda e Repartição de Receita
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Este jogo será pago?</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 cursor-pointer hover:border-indigo-500 transition-colors">
                    <input
                      type="radio"
                      name="isPaid"
                      value={true}
                      checked={formData.isPaid === true}
                      onChange={() => setFormData(prev => ({ ...prev, isPaid: true }))}
                      className="accent-indigo-500"
                    />
                    <span className="text-sm text-slate-200">Sim</span>
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 cursor-pointer hover:border-indigo-500 transition-colors">
                    <input
                      type="radio"
                      name="isPaid"
                      value={false}
                      checked={formData.isPaid === false}
                      onChange={() => setFormData(prev => ({ ...prev, isPaid: false }))}
                      className="accent-indigo-500"
                    />
                    <span className="text-sm text-slate-200">Não</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Receita para HostIT</label>
                <p className="text-sm text-slate-500">Escolha quanto você aceita repassar ao HostIT quando o jogo for vendido.</p>
              </div>
            </div>

            {formData.isPaid && (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  {[5, 10, 20].map((percent) => (
                    <button
                      type="button"
                      key={percent}
                      onClick={() => setFormData(prev => ({ ...prev, sharePercent: percent }))}
                      className={`rounded-3xl border px-5 py-6 text-left transition-all ${
                        formData.sharePercent === percent
                          ? 'border-indigo-500 bg-indigo-600/10 shadow-sm shadow-indigo-500/20'
                          : 'border-slate-800 bg-slate-950 hover:border-indigo-500/60'
                      }`}
                    >
                      <div className="text-3xl font-black text-slate-100">{percent}%</div>
                      <p className="mt-2 text-sm text-slate-400">Receba o restante da receita e repasse {percent}% ao HostIT.</p>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs text-slate-300">
                        <span className="font-semibold text-indigo-300">HostIT</span>
                        <span>{percent}%</span>
                      </div>
                    </button>
                  ))}
                  <div className="grid gap-4 md:grid-cols-1 md:col-span-3">
                    <h1>Compartilhe 5% para distribuir, 10% para acrecentar na divulgação de seu jogo e 20% para estar participando da central da comunidade e ajuda financeira no projeto após analise previa.</h1>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <label className="block text-sm font-semibold text-slate-300">Preço do jogo</label>
                  <div className="flex items-center gap-3 max-w-sm">
                    <span className="inline-flex items-center justify-center rounded-l-2xl border border-r-0 border-slate-800 bg-slate-900 px-4 text-sm text-slate-400">R$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full rounded-r-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Informe o valor do jogo para sua loja. O HostIT receberá a porcentagem escolhida sobre cada venda.</p>
                </div>
              </>
            )}
          </section>

          {/* SEÇÃO 4: INTEGRAÇÃO SOCIAL E CÓDIGO (ESTILO GITHUB) */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                <span>04.</span> Configurações de Código-Fonte
              </h2>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox"
                  name="codeOpenSource"
                  checked={formData.codeOpenSource}
                  onChange={(e) => setFormData(prev => ({ ...prev, codeOpenSource: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 border border-slate-800"></div>
                <span className="ml-3 text-sm font-medium text-slate-300">Open Source</span>
              </label>
            </div>

            {formData.codeOpenSource ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs leading-relaxed flex gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>
                    <strong>Código aberto ativo:</strong> Outros desenvolvedores poderão ver o seu repositório, abrir <em>issues</em> e contribuir com forks.
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Repositório Git</label>
                  <input
                    type="url"
                    name="repositoryUrl"
                    value={formData.repositoryUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/seu-usuario/seu-jogo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Visibilidade do Repositório</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer border ${formData.repoVisibility === 'Public' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'}`}>
                      <input
                        type="radio"
                        name="repoVisibility"
                        value="Public"
                        checked={formData.repoVisibility === 'Public'}
                        onChange={handleChange}
                        className="mt-1 accent-indigo-500"
                      />
                      <div>
                        <span className="block text-sm font-semibold text-slate-200">Público</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Qualquer pessoa no HostIT pode ver o código fonte deste jogo.</span>
                      </div>
                    </label>
                    <label className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer border ${formData.repoVisibility === 'Private' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'}`}>
                      <input
                        type="radio"
                        name="repoVisibility"
                        value="Private"
                        checked={formData.repoVisibility === 'Private'}
                        onChange={handleChange}
                        className="mt-1 accent-indigo-500"
                      />
                      <div>
                        <span className="block text-sm font-semibold text-slate-200">Privado</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Apenas você e colaboradores convidados podem ver o código (informativo).</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-sm font-semibold text-slate-300">Licença Open Source</label>
                  <select
                    name="license"
                    value={formData.license}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="MIT">Licença MIT (Recomendado para jogos simples)</option>
                    <option value="GPLv3">GNU GPL v3</option>
                    <option value="Apache-2.0">Apache 2.0</option>
                    <option value="CC-BY-NC">Creative Commons BY-NC</option>
                  </select>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                Seu projeto será publicado como código fechado. Usuários só poderão jogar, sem acesso aos arquivos de desenvolvimento.
              </p>
            )}
          </section>

          {/* SEÇÃO 3: METADADOS E TAGS */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-3">
              <span>04.</span> Metadados e Classificação
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Versão</label>
                <input 
                  type="text" 
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  placeholder="v1.0.0" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Tamanho do arquivo</label>
                <input 
                  type="text" 
                  name="fileSize"
                  value={formData.fileSize}
                  readOnly
                  placeholder="Detectado automaticamente" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-400 placeholder-slate-600 focus:outline-none transition-all cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Visibilidade</label>
                <select 
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer">
                  <option value="Public">Público</option>
                  <option value="Private">Privado</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Plataformas (separe por vírgula)</label>
              <input 
                type="text" 
                name="platforms"
                value={formData.platforms}
                onChange={handleChange}
                placeholder="Ex: Windows, Linux, macOS" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Tags (separe por vírgula)</label>
              <input 
                type="text" 
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Ex: Action, Platformer, Indie" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </section>

          {/* MENSAGEM DE FEEDBACK */}
          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${
              message.includes('✓') 
                ? 'bg-green-950/30 border border-green-500/30 text-green-300' 
                : 'bg-red-950/30 border border-red-500/30 text-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* BOTÕES DE AÇÃO */}
          <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-900">
            <button 
              type="button" 
              onClick={() => navigate('/')}
              className="px-5 py-2 rounded-lg border border-slate-800 text-slate-400 font-medium hover:text-slate-200 hover:border-slate-700 transition-colors text-sm"
            >
              Voltar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 disabled:opacity-50 font-semibold px-6 py-2 rounded-lg transition-all text-sm shadow-lg shadow-indigo-600/20 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Publicar Projeto'}
            </button>
          </div>

        </form>
      </main>
    </div>

    );
}

export default UploadPage;
