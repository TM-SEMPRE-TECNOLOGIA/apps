import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AppView, ServiceOption, FileData } from './types';
import { 
  FileOutput, 
  FileSearch, 
  FileDiff, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Loader2, 
  Download,
  ArrowLeft,
  FolderArchive,
  FolderUp,
  FileSpreadsheet,
  FileType,
  HelpCircle,
  BookOpen,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  Mail,
  User,
  MousePointerClick,
  UploadCloud
} from 'lucide-react';
import { FileUpload } from './components/FileUpload';



// --- Components for Views ---

const ServiceCard: React.FC<{ 
  option: ServiceOption; 
  onClick: () => void 
}> = ({ option, onClick }) => (
  <div 
    onClick={onClick}
    className="
      group relative bg-white border border-tm-border rounded-[18px] p-6 
      shadow-tm-md hover:shadow-tm-lg transition-all duration-300 cursor-pointer 
      hover:-translate-y-1 h-full flex flex-col justify-between overflow-hidden
    "
  >
    {/* Decorative background blob */}
    <div className={`
      absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150
      ${option.colorClass}
    `}></div>

    <div>
      <div className="flex justify-between items-start mb-4">
        <div className={`
          w-14 h-14 rounded-2xl flex items-center justify-center shadow-tm-sm
          ${option.colorClass} bg-opacity-15 text-tm-dark
        `}>
          {option.icon}
        </div>
        {option.badge && (
          <span className="px-2.5 py-1 rounded-full bg-tm-secondary/10 text-tm-secondary text-[10px] font-extrabold uppercase tracking-wide border border-tm-secondary/20">
            {option.badge}
          </span>
        )}
      </div>

      <h3 className="text-lg font-extrabold text-gray-800 mb-2 group-hover:text-tm-primary transition-colors">
        {option.title}
      </h3>
      <p className="text-sm text-gray-500 font-medium leading-relaxed">
        {option.description}
      </p>
    </div>

    <div className="mt-6 flex items-center text-xs font-bold text-gray-400 group-hover:text-tm-primary transition-colors">
      <span>Começar agora</span>
      <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

interface ProcessViewProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
  onBack: () => void;
  inputType: 'single' | 'multiple' | 'dual';
  fileConfig?: {
    label: string;
    accept: string;
    helper: string;
    icon?: React.ReactNode;
  };
}

const ProcessView: React.FC<ProcessViewProps> = ({ 
  title, 
  description, 
  icon, 
  actionLabel, 
  onBack, 
  inputType,
  fileConfig
}) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleProcess = () => {
    if (files.length === 0) return;
    setStatus('processing');
    
    // Simulate API call to Python backend
    setTimeout(() => {
      setStatus('success');
    }, 2500);
  };

  const currentFileConfig = fileConfig || {
    label: inputType === 'multiple' ? "Arraste seus arquivos DOCX" : "Selecione o arquivo DOCX",
    accept: ".docx",
    helper: "Suporta apenas arquivos .docx"
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header of View */}
      <div className="mb-8 text-center">
        <button 
          onClick={onBack}
          className="mb-6 inline-flex items-center text-xs font-bold text-gray-400 hover:text-tm-primary transition-colors"
        >
          <ArrowLeft size={14} className="mr-1" />
          Voltar para Dashboard
        </button>
        <h2 className="text-3xl font-extrabold text-tm-dark mb-3 flex items-center justify-center gap-3">
          {icon}
          {title}
        </h2>
        <p className="text-gray-500 font-medium">{description}</p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-tm-border rounded-[24px] shadow-tm-lg p-2 md:p-8 overflow-hidden relative">
        {status === 'processing' && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
             <div className="w-16 h-16 relative mb-4">
               <div className="absolute inset-0 border-4 border-tm-muted rounded-full"></div>
               <div className="absolute inset-0 border-4 border-tm-primary rounded-full border-t-transparent animate-spin"></div>
             </div>
             <p className="font-bold text-gray-700">Processando documentos...</p>
             <p className="text-xs text-gray-400 mt-2">Nossos robôs estão trabalhando.</p>
          </div>
        )}

        {status === 'success' ? (
           <div className="text-center py-12 animate-in zoom-in-50 duration-300">
             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-sm">
                <Check size={40} strokeWidth={3} />
             </div>
             <h3 className="text-2xl font-extrabold text-gray-800 mb-2">Sucesso!</h3>
             <p className="text-gray-500 mb-8">O seu relatório foi gerado e está pronto para download.</p>
             
             <div className="flex justify-center gap-4">
               <button 
                 onClick={() => setStatus('idle')}
                 className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
               >
                 Processar outro
               </button>
               <button className="px-6 py-3 rounded-xl bg-tm-primary text-white font-bold text-sm shadow-lg hover:bg-green-600 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                 <Download size={18} />
                 Baixar Relatório (.docx)
               </button>
             </div>
           </div>
        ) : (
          <div className="space-y-8 p-4">
             {inputType === 'dual' ? (
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <span className="text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">Documento Word</span>
                      <FileUpload 
                        label="Arraste o Doc Word" 
                        accept=".docx"
                        helperText="Suporta apenas arquivos .docx"
                        icon={<FileType size={24} strokeWidth={2.5} />}
                        onFilesSelected={(f) => setFiles(prev => [...prev, ...f])} 
                      />
                   </div>
                   <div className="space-y-2">
                      <span className="text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">Planilha Excel</span>
                      <FileUpload 
                        label="Arraste a Planilha" 
                        accept=".xlsx,.xls,.csv"
                        helperText="Suporta .xlsx, .xls, .csv"
                        icon={<FileSpreadsheet size={24} strokeWidth={2.5} />}
                        onFilesSelected={(f) => setFiles(prev => [...prev, ...f])} 
                      />
                   </div>
                </div>
             ) : (
                <FileUpload 
                  label={currentFileConfig.label}
                  accept={currentFileConfig.accept}
                  helperText={currentFileConfig.helper}
                  icon={currentFileConfig.icon}
                  multiple={inputType === 'multiple'}
                  onFilesSelected={setFiles}
                />
             )}

             <div className="flex justify-end pt-4 border-t border-gray-100">
                <button 
                  disabled={files.length === 0}
                  onClick={handleProcess}
                  className={`
                    px-8 py-4 rounded-xl font-extrabold text-sm flex items-center gap-2 transition-all duration-300
                    ${files.length > 0 
                      ? 'bg-tm-dark text-white shadow-xl hover:shadow-2xl hover:-translate-y-1' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                  `}
                >
                  <Sparkles size={16} className={files.length > 0 ? "text-yellow-300" : ""} />
                  {actionLabel}
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
         <div className="p-4 rounded-2xl bg-white border border-tm-border shadow-sm">
            <p className="text-2xl font-black text-tm-dark">0.2s</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">Tempo Médio</p>
         </div>
         <div className="p-4 rounded-2xl bg-white border border-tm-border shadow-sm">
            <p className="text-2xl font-black text-tm-dark">100%</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">Precisão</p>
         </div>
         <div className="p-4 rounded-2xl bg-white border border-tm-border shadow-sm">
            <p className="text-2xl font-black text-tm-dark">Secure</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">Python Core</p>
         </div>
      </div>
    </div>
  );
};

const SupportView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const faqs = [
    {
      q: "Quais formatos de arquivo são suportados?",
      a: "Atualmente suportamos nativamente arquivos Microsoft Word (.docx), Planilhas Excel (.xlsx, .xls, .csv) e arquivos compactados (.zip, .rar) para o processamento em lote."
    },
    {
      q: "Meus dados ficam salvos na plataforma?",
      a: "Não. Por questões de segurança e privacidade, todos os arquivos enviados são processados temporariamente em nossos servidores seguros e deletados permanentemente imediatamente após a geração do resultado."
    },
    {
      q: "Existe limite de tamanho para upload?",
      a: "O limite atual é de 50MB por arquivo individual. Para arquivos compactados contendo múltiplos documentos, o limite é de 200MB."
    },
    {
      q: "Como funciona a comparação de documentos?",
      a: "Nosso algoritmo Python analisa parágrafo por parágrafo do texto original e do revisado (ou dados da planilha), destacando inserções, remoções e alterações de formatação em um novo documento de relatório."
    }
  ];

  const handleSendForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('sent');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-10">
        <button 
          onClick={onBack}
          className="mb-6 inline-flex items-center text-xs font-bold text-gray-400 hover:text-tm-primary transition-colors"
        >
          <ArrowLeft size={14} className="mr-1" />
          Voltar para Dashboard
        </button>
        <h2 className="text-3xl font-extrabold text-tm-dark mb-3 flex items-center gap-3">
          <HelpCircle className="text-tm-secondary" size={32} />
          Central de Suporte
        </h2>
        <p className="text-gray-500 font-medium">Tutoriais, dúvidas frequentes e canal direto com nossa equipe.</p>
      </div>

      <div className="space-y-12">
        {/* Section 1: Tutorial */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="text-tm-primary" size={20} />
            <h3 className="text-xl font-bold text-gray-800">Como funciona</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <MousePointerClick size={24} />, title: "1. Selecione", desc: "Escolha no dashboard a ferramenta ideal para sua necessidade: Gerar, Extrair ou Comparar." },
              { icon: <UploadCloud size={24} />, title: "2. Envie", desc: "Arraste seus arquivos Word, Excel ou Pastas compactadas para a área de upload segura." },
              { icon: <Download size={24} />, title: "3. Baixe", desc: "Nossa IA processa tudo em segundos e disponibiliza o relatório final formatado para download." },
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-tm-border p-6 rounded-[18px] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: FAQ */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="text-tm-primary" size={20} />
            <h3 className="text-xl font-bold text-gray-800">Perguntas Frequentes</h3>
          </div>
          <div className="bg-white border border-tm-border rounded-[18px] overflow-hidden shadow-sm">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-100 last:border-0">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-gray-700 text-sm">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-1">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Contact Form */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="text-tm-primary" size={20} />
            <h3 className="text-xl font-bold text-gray-800">Fale Conosco</h3>
          </div>
          
          <div className="bg-white border border-tm-border rounded-[24px] shadow-tm-md p-8">
            {formStatus === 'sent' ? (
              <div className="text-center py-12 animate-in zoom-in-50">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Check size={32} />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Mensagem Enviada!</h4>
                <p className="text-gray-500 mb-6">Nossa equipe responderá em breve no seu email.</p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendForm} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Seu Nome</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <User size={18} />
                      </div>
                      <input 
                        required
                        type="text" 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tm-primary/20 focus:border-tm-primary transition-all text-sm font-medium text-gray-700"
                        placeholder="Ex: Thiago Barbosa"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Seu Email</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input 
                        required
                        type="email" 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tm-primary/20 focus:border-tm-primary transition-all text-sm font-medium text-gray-700"
                        placeholder="exemplo@empresa.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col h-full">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Sua Mensagem</label>
                  <textarea 
                    required
                    className="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tm-primary/20 focus:border-tm-primary transition-all text-sm font-medium text-gray-700 resize-none min-h-[120px]"
                    placeholder="Descreva sua dúvida ou problema..."
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end">
                   <button 
                     type="submit"
                     disabled={formStatus === 'sending'}
                     className="px-8 py-3 bg-tm-dark text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                   >
                     {formStatus === 'sending' ? (
                       <>
                         <Loader2 size={16} className="animate-spin" />
                         Enviando...
                       </>
                     ) : (
                       <>
                         <Send size={16} />
                         Enviar Mensagem
                       </>
                     )}
                   </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};


// --- Main Application ---

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const services: ServiceOption[] = [
    {
      id: AppView.GENERATE,
      title: "Gerar Relatório",
      description: "Crie documentos complexos a partir de pastas de dados e arquivos compactados.",
      icon: <FileOutput size={28} strokeWidth={2} />,
      colorClass: "bg-blue-500 text-blue-600",
      badge: "Popular"
    },
    {
      id: AppView.EXTRACT,
      title: "Extrair Dados",
      description: "Retire tabelas, parágrafos específicos ou metadados de múltiplos arquivos .docx simultaneamente.",
      icon: <FileSearch size={28} strokeWidth={2} />,
      colorClass: "bg-purple-500 text-purple-600"
    },
    {
      id: AppView.COMPARE,
      title: "Comparar Versões",
      description: "Visualize diferenças entre dois documentos com destaque de alterações e análise de conteúdo.",
      icon: <FileDiff size={28} strokeWidth={2} />,
      colorClass: "bg-amber-500 text-amber-600",
      badge: "Novo"
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case AppView.GENERATE:
        return (
          <ProcessView 
            title="Gerador Automático" 
            description="Transforme pastas de dados e arquivos compactados em documentos formatados."
            icon={<FileOutput size={32} className="text-blue-500"/>}
            actionLabel="Gerar Documento"
            onBack={() => setCurrentView(AppView.DASHBOARD)}
            inputType="single"
            fileConfig={{
              label: "Selecione Pasta ou Compactado",
              accept: ".zip,.rar,.7z,.docx",
              helper: "Suporta arquivos .zip, .rar ou pastas",
              icon: <FolderArchive size={28} strokeWidth={2} />
            }}
          />
        );
      case AppView.EXTRACT:
        return (
          <ProcessView 
            title="Extrator de Dados" 
            description="Inteligência para ler e estruturar informações de documentos."
            icon={<FileSearch size={32} className="text-purple-500"/>}
            actionLabel="Extrair Informações"
            onBack={() => setCurrentView(AppView.DASHBOARD)}
            inputType="multiple"
          />
        );
      case AppView.COMPARE:
        return (
          <ProcessView 
            title="Comparador Inteligente" 
            description="Identifique cada alteração entre versões de contratos ou laudos."
            icon={<FileDiff size={32} className="text-amber-500"/>}
            actionLabel="Comparar Versões"
            onBack={() => setCurrentView(AppView.DASHBOARD)}
            inputType="dual"
          />
        );
      case AppView.SUPPORT:
        return (
          <SupportView onBack={() => setCurrentView(AppView.DASHBOARD)} />
        );
      default:
        return (
          <div className="space-y-10">
            <div className="text-center space-y-4 py-8">
              <h1 className="text-4xl md:text-5xl font-black text-tm-dark tracking-tight">
                Olá, Thiago Barbosa, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-tm-primary to-tm-secondary">
                  vamos acelerar seu trabalho.
                </span>
              </h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                Selecione uma das ferramentas abaixo para manipular seus arquivos Word com a potência dos nossos algoritmos Python.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  option={service} 
                  onClick={() => setCurrentView(service.id)} 
                />
              ))}
            </div>

            {/* Quick Actions / Recent (Mock) */}
            <div className="mt-12">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-extrabold text-tm-dark">Atividades Recentes</h2>
                  <button className="text-tm-primary text-xs font-bold hover:underline">Ver histórico completo</button>
               </div>
               
               <div className="bg-white border border-tm-border rounded-[18px] shadow-tm-sm overflow-hidden">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                             DOC
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-800">Relatório_Financeiro_Q{i}.docx</p>
                             <p className="text-xs text-gray-400">Processado há {i * 2} horas • Gerador</p>
                          </div>
                       </div>
                       <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                          Concluído
                       </span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;