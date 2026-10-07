import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Cpu, 
  Network, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  Send, 
  ArrowUpRight 
} from 'lucide-react';
import { Helmet3D } from './Helmet3D';

interface CalloutItem {
  id: string;
  tag: string;
  title: string;
  phrase: string;
  metric: string;
  icon: React.ElementType;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  targetDot: { x: number; y: number };
  elbowDot: { x: number; y: number };
  cardDot: { x: number; y: number };
}

const callouts: CalloutItem[] = [
  {
    id: 'automacao',
    tag: '01 HIPERAUTOMAÇÃO',
    title: 'Workflows Autônomos 24/7',
    phrase: 'Orquestração de ponta a ponta integrada aos sistemas corporativos.',
    metric: 'Automação Contínua',
    icon: Zap,
    position: 'top-left',
    targetDot: { x: 415, y: 235 },
    elbowDot: { x: 340, y: 190 },
    cardDot: { x: 250, y: 190 },
  },
  {
    id: 'ia',
    tag: '02 IA COGNITIVA',
    title: 'Inteligência Decisória',
    phrase: 'Agentes preditivos treinados nas regras e na arquitetura de dados do seu negócio.',
    metric: 'Inferência Rápida',
    icon: Cpu,
    position: 'top-right',
    targetDot: { x: 585, y: 235 },
    elbowDot: { x: 660, y: 190 },
    cardDot: { x: 750, y: 190 },
  },
  {
    id: 'integracoes',
    tag: '03 CONEXÃO TOTAL',
    title: 'Integração Sistêmica',
    phrase: 'Sincronização robusta entre ERPs, CRMs e bancos de dados legados.',
    metric: 'Arquitetura Aberta',
    icon: Network,
    position: 'bottom-left',
    targetDot: { x: 410, y: 400 },
    elbowDot: { x: 340, y: 435 },
    cardDot: { x: 250, y: 435 },
  },
  {
    id: 'blindagem',
    tag: '04 RESILIÊNCIA',
    title: 'Blindagem de Titã',
    phrase: 'Arquitetura de missão crítica inspirada na invulnerabilidade do autômato de Creta.',
    metric: 'Alta Disponibilidade',
    icon: ShieldCheck,
    position: 'bottom-right',
    targetDot: { x: 590, y: 400 },
    elbowDot: { x: 660, y: 435 },
    cardDot: { x: 750, y: 435 },
  }
];

export const HeroSection: React.FC = () => {
  const [activeCallout, setActiveCallout] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [desafio, setDesafio] = useState('automacao');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, desafio }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar a solicitação.');
      }

      setFormSent(true);
      setTimeout(() => {
        setModalOpen(false);
        setFormSent(false);
        setName('');
        setEmail('');
        setDesafio('automacao');
      }, 2200);
    } catch (error: any) {
      setErrorMsg(error.message || 'Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-talos-void select-none">
      
      {/* ================= BACKGROUND ATMOSFÉRICO DE ALTO IMPACTO ================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        
        {/* Base Gradient: Profundidade Cósmica do Azul-Marinho ao Void */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060B1E] via-[#040816] to-[#02040B]"></div>

        {/* Feixe de Luz Zenital Primário (Cônico e elegante como na referência) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] max-w-6xl h-[680px] light-ray-beam opacity-40"></div>
        
        {/* Feixe de Luz Secundário (Luz suave de cobre dourado) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl h-[560px] light-ray-beam-secondary opacity-35"></div>

        {/* Backlight Halo Central (Ilumina as costas do capacete 3D) */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[680px] h-[680px] rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
          activeCallout === 'ia' || activeCallout === 'blindagem'
            ? 'bg-radial from-talos-circuit-500/25 via-talos-circuit-glow/10 to-transparent'
            : activeCallout === 'automacao' || activeCallout === 'integracoes'
            ? 'bg-radial from-talos-copper-500/25 via-talos-bronze-500/10 to-transparent'
            : 'bg-radial from-talos-copper-glow/15 via-talos-circuit-500/10 to-transparent'
        }`}></div>

        {/* Grid Tecnológico Minimalista Sutil */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #E29555 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        ></div>

        {/* Vinheta nas bordas para focar a atenção no centro */}
        <div className="absolute inset-0 bg-radial from-transparent via-talos-void/30 to-talos-void/90"></div>
      </div>

      {/* ================= HEADER / NAVBAR FLUTUANTE ================= */}
      <header className="relative z-40 w-full px-5 sm:px-10 lg:px-16 pt-5 sm:pt-7 flex items-center justify-between">
        
        {/* Logotipo TALOS à Esquerda */}
        <a href="#" className="flex items-center gap-3.5 group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-talos-navy-950/80 border border-talos-bronze-400/40 flex items-center justify-center p-1 shadow-xl group-hover:border-talos-copper-400/80 transition-all duration-300 backdrop-blur-md overflow-hidden">
            <img 
              src="/talos-logo.png" 
              alt="TALOS — Automação & IA" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(226,149,85,0.4)] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -inset-0.5 rounded-xl bg-talos-copper-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-[0.16em] text-white">
                TALOS
              </span>
              <span className="w-1.5 h-1.5 rounded-sm bg-talos-copper-500"></span>
            </div>
            <span className="text-[10px] tracking-wider uppercase text-talos-bronze-300/80 font-medium">
              Automação Empresarial & IA
            </span>
          </div>
        </a>

        {/* Navegação Central em Barra Horizontal (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 border-b border-talos-bronze-400/20 px-4 py-2">
          <button 
            onClick={() => setActiveCallout(activeCallout === 'automacao' ? null : 'automacao')}
            className={`text-xs tracking-wider uppercase transition-colors font-medium ${activeCallout === 'automacao' ? 'text-talos-copper-300 font-bold' : 'text-slate-300 hover:text-talos-copper-300'}`}
          >
            Automação
          </button>
          <button 
            onClick={() => setActiveCallout(activeCallout === 'ia' ? null : 'ia')}
            className={`text-xs tracking-wider uppercase transition-colors font-medium ${activeCallout === 'ia' ? 'text-talos-circuit-300 font-bold' : 'text-slate-300 hover:text-talos-circuit-300'}`}
          >
            Inteligência Artificial
          </button>
          <button 
            onClick={() => setActiveCallout(activeCallout === 'integracoes' ? null : 'integracoes')}
            className={`text-xs tracking-wider uppercase transition-colors font-medium ${activeCallout === 'integracoes' ? 'text-talos-copper-300 font-bold' : 'text-slate-300 hover:text-talos-copper-300'}`}
          >
            Integrações
          </button>
          <button 
            onClick={() => setActiveCallout(activeCallout === 'blindagem' ? null : 'blindagem')}
            className={`text-xs tracking-wider uppercase transition-colors font-medium ${activeCallout === 'blindagem' ? 'text-talos-circuit-300 font-bold' : 'text-slate-300 hover:text-talos-circuit-300'}`}
          >
            Resiliência
          </button>
        </nav>

        {/* Ações da Direita */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-talos-copper-500/15 border border-talos-copper-400/40 hover:border-talos-copper-400 text-talos-copper-200 hover:text-white text-xs font-semibold tracking-wider uppercase backdrop-blur-md transition-all duration-300 hover:bg-talos-copper-500/25"
                      >
                        <span>Diagnóstico</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Botão de Menu Mobile */}
                    <button 
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="md:hidden relative w-11 h-11 rounded-full bg-talos-navy-950/70 hover:bg-talos-navy-900 border border-talos-bronze-400/40 hover:border-talos-copper-400/80 flex items-center justify-center text-slate-200 transition-all duration-300 shadow-md backdrop-blur-md group"
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-talos-copper-300 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Menu className="w-5 h-5 text-talos-copper-300 group-hover:scale-110 transition-transform duration-300" />
            )}
            <div className="absolute inset-0 rounded-full bg-talos-copper-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </header>

      {/* Dropdown Menu Mobile */}
      {mobileMenuOpen && (
        <div className="relative z-50 md:hidden mx-4 mt-2 p-5 rounded-2xl bg-talos-navy-950/95 border border-talos-bronze-400/35 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-3 text-center">
            {callouts.map((item) => (
              <button 
                key={item.id}
                onClick={() => { setActiveCallout(item.id); setMobileMenuOpen(false); }}
                className="text-sm uppercase tracking-widest text-slate-200 hover:text-talos-copper-300 py-2 border-b border-white/5"
              >
                {item.title}
              </button>
            ))}
            <button 
              onClick={() => { setModalOpen(true); setMobileMenuOpen(false); }}
              className="mt-2 text-sm uppercase tracking-widest text-talos-copper-300 font-bold py-2.5 rounded-xl bg-talos-copper-500/15 border border-talos-copper-400/30"
            >
              Solicitar Diagnóstico Estratégico
            </button>
          </div>
        </div>
      )}

      {/* ================= PALCO CENTRAL: "TALOS" + CAPACETE 3D ROTATIVO + HUD SETAS ================= */}
      <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-center my-auto min-h-[460px] sm:min-h-[580px] lg:min-h-[680px]">
        
        {/* Contêiner de Proporção Flexível e Responsivo para Desktop e Mobile */}
        <div className="relative w-full max-w-[1240px] h-[450px] sm:h-[580px] lg:h-[660px] flex items-center justify-center">

          {/* 1. CAMADA DE PROFUNDIDADE: Título "TALOS" Calibrado com Elegância e Destaque (Z-10) */}
                    <div className="absolute top-[2%] sm:top-[3%] md:top-[4%] left-1/2 -translate-x-1/2 w-full text-center flex flex-col items-center select-none pointer-events-none z-10 px-4">
            
                      {/* Subtítulo com linha decorativa */}
                      <div className="inline-flex items-center gap-3 mb-1.5 sm:mb-2">
                        <div className="w-8 h-px bg-talos-copper-500/60"></div>
                        <div className="w-1.5 h-1.5 bg-talos-copper-400"></div>
                        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] sm:tracking-[0.26em] text-talos-bronze-200 font-semibold">
                          Automação Empresarial & IA
                        </span>
                        <div className="w-1.5 h-1.5 bg-talos-copper-400"></div>
                        <div className="w-8 h-px bg-talos-copper-500/60"></div>
                      </div>

                      {/* Nome "TALOS" — Escala Refinada, Grandiosa e Perfeita para Mobile & Desktop */}
                      <h1 className="font-display font-extrabold text-[2.8rem] sm:text-[4.8rem] md:text-[6.4rem] lg:text-[7.8rem] xl:text-[8.8rem] tracking-[0.14em] sm:tracking-[0.2em] leading-none uppercase text-gradient-bronze drop-shadow-[0_15px_40px_rgba(0,0,0,0.95)] opacity-95">
                        TALOS
                      </h1>
                    </div>

          {/* 2. O CAPACETE 3D FLUTUANTE E ROTATIVO (Z-30) */}
          <div className="relative z-30 w-[270px] sm:w-[380px] md:w-[450px] lg:w-[490px] aspect-square flex items-center justify-center mt-6 sm:mt-10 pointer-events-auto">
            <Helmet3D activeFeature={activeCallout} />
          </div>

          {/* 3. OVERLAY VETORIAL HUD: SETAS & LINHAS PONTILHADAS CONECTADAS COM PRECISÃO (Z-25) */}
          <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-25">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 1000 600" 
              preserveAspectRatio="xMidYMid meet"
              fill="none"
            >
              {/* Linha 1: Superior Esquerda (Hiperautomação) */}
              <g className={`transition-all duration-300 ${activeCallout && activeCallout !== 'automacao' ? 'opacity-20' : 'opacity-100'}`}>
                {/* Linha Pontilhada */}
                <path 
                  d="M 250 190 L 340 190 L 415 235" 
                  stroke="#E29555" 
                  strokeWidth={activeCallout === 'automacao' ? '2.4' : '1.6'} 
                  strokeDasharray="4 4" 
                />
                {/* Alvo / Pinpoint no Nó do Circuito Esquerdo */}
                <circle cx="415" cy="235" r="5" fill="#E29555" className="animate-ping" opacity="0.85" />
                <circle cx="415" cy="235" r="3.5" fill="#FFF2DE" />
                <circle cx="415" cy="235" r="7.5" stroke="#E29555" strokeWidth="1.2" />
                {/* Terminal no Card */}
                <circle cx="250" cy="190" r="3.5" fill="#E29555" />
              </g>

              {/* Linha 2: Superior Direita (IA Cognitiva) */}
              <g className={`transition-all duration-300 ${activeCallout && activeCallout !== 'ia' ? 'opacity-20' : 'opacity-100'}`}>
                {/* Linha Pontilhada */}
                <path 
                  d="M 750 190 L 660 190 L 585 235" 
                  stroke="#E29555" 
                  strokeWidth={activeCallout === 'ia' ? '2.4' : '1.6'} 
                  strokeDasharray="4 4" 
                />
                {/* Alvo / Pinpoint no Nó do Circuito Direito */}
                <circle cx="585" cy="235" r="5" fill="#E29555" className="animate-ping" opacity="0.85" />
                <circle cx="585" cy="235" r="3.5" fill="#FFF2DE" />
                <circle cx="585" cy="235" r="7.5" stroke="#E29555" strokeWidth="1.2" />
                {/* Terminal no Card */}
                <circle cx="750" cy="190" r="3.5" fill="#E29555" />
              </g>

              {/* Linha 3: Inferior Esquerda (Integração de Sistemas) */}
              <g className={`transition-all duration-300 ${activeCallout && activeCallout !== 'integracoes' ? 'opacity-20' : 'opacity-100'}`}>
                {/* Linha Pontilhada */}
                <path 
                  d="M 250 435 L 340 435 L 410 400" 
                  stroke="#E29555" 
                  strokeWidth={activeCallout === 'integracoes' ? '2.4' : '1.6'} 
                  strokeDasharray="4 4" 
                />
                {/* Alvo / Pinpoint na Bochecha Esquerda */}
                <circle cx="410" cy="400" r="5" fill="#E29555" className="animate-ping" opacity="0.85" />
                <circle cx="410" cy="400" r="3.5" fill="#FFF2DE" />
                <circle cx="410" cy="400" r="7.5" stroke="#E29555" strokeWidth="1.2" />
                {/* Terminal no Card */}
                <circle cx="250" cy="435" r="3.5" fill="#E29555" />
              </g>

              {/* Linha 4: Inferior Direita (Blindagem Operacional) */}
              <g className={`transition-all duration-300 ${activeCallout && activeCallout !== 'blindagem' ? 'opacity-20' : 'opacity-100'}`}>
                {/* Linha Pontilhada */}
                <path 
                  d="M 750 435 L 660 435 L 590 400" 
                  stroke="#E29555" 
                  strokeWidth={activeCallout === 'blindagem' ? '2.4' : '1.6'} 
                  strokeDasharray="4 4" 
                />
                {/* Alvo / Pinpoint na Bochecha Direita */}
                <circle cx="590" cy="400" r="5" fill="#E29555" className="animate-ping" opacity="0.85" />
                <circle cx="590" cy="400" r="3.5" fill="#FFF2DE" />
                <circle cx="590" cy="400" r="7.5" stroke="#E29555" strokeWidth="1.2" />
                {/* Terminal no Card */}
                <circle cx="750" cy="435" r="3.5" fill="#E29555" />
              </g>
            </svg>
          </div>

          {/* 4. CARDS DE TEXTO FLUTUANTES DO HUD (DESKTOP) (Z-30) */}
          <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-30">
            
            {/* Card 1: Superior Esquerdo (Hiperautomação) */}
            <div 
              onMouseEnter={() => setActiveCallout('automacao')}
              onMouseLeave={() => setActiveCallout(null)}
              className={`absolute top-[20%] left-[2%] lg:left-[4%] max-w-[270px] cursor-pointer group pointer-events-auto transition-all duration-300 ${activeCallout === 'automacao' ? 'scale-105' : 'hover:-translate-y-1'}`}
            >
              <div className={`p-4 rounded-2xl bg-talos-navy-950/85 border backdrop-blur-xl shadow-hud-badge transition-all duration-300 ${activeCallout === 'automacao' ? 'border-talos-copper-400 ring-2 ring-talos-copper-400/25 bg-talos-navy-900/90' : 'border-talos-bronze-400/30 hover:border-talos-copper-400/70'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-talos-copper-300 bg-talos-copper-500/10 px-2.5 py-0.5 border border-talos-copper-500/20">
                    01 AUTOMAÇÃO
                  </span>
                  <span className="text-[11px] font-semibold text-talos-bronze-200">
                    Automação Contínua
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-talos-copper-200 transition-colors">
                  Workflows Autônomos
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  Processos orquestrados 24/7 sem atritos manuais ou interrupções.
                </p>
              </div>
            </div>

            {/* Card 2: Superior Direito (IA Cognitiva) */}
            <div 
              onMouseEnter={() => setActiveCallout('ia')}
              onMouseLeave={() => setActiveCallout(null)}
              className={`absolute top-[20%] right-[2%] lg:right-[4%] max-w-[270px] cursor-pointer group pointer-events-auto text-right transition-all duration-300 ${activeCallout === 'ia' ? 'scale-105' : 'hover:-translate-y-1'}`}
            >
              <div className={`p-4 rounded-2xl bg-talos-navy-950/85 border backdrop-blur-xl shadow-hud-badge transition-all duration-300 ${activeCallout === 'ia' ? 'border-talos-copper-400 ring-2 ring-talos-copper-400/25 bg-talos-navy-900/90' : 'border-talos-bronze-400/30 hover:border-talos-copper-400/70'}`}>
                <div className="flex items-center justify-between mb-1.5 flex-row-reverse">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-talos-copper-300 bg-talos-copper-500/10 px-2.5 py-0.5 border border-talos-copper-500/20">
                    02 IA COGNITIVA
                  </span>
                  <span className="text-[11px] font-semibold text-talos-bronze-200">
                    Inferência Rápida
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-talos-copper-200 transition-colors">
                  Inteligência Decisória
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  Agentes preditivos treinados nas regras e dados do seu negócio.
                </p>
              </div>
            </div>

            {/* Card 3: Inferior Esquerdo (Integração) */}
            <div 
              onMouseEnter={() => setActiveCallout('integracoes')}
              onMouseLeave={() => setActiveCallout(null)}
              className={`absolute bottom-[16%] left-[2%] lg:left-[4%] max-w-[270px] cursor-pointer group pointer-events-auto transition-all duration-300 ${activeCallout === 'integracoes' ? 'scale-105' : 'hover:-translate-y-1'}`}
            >
              <div className={`p-4 rounded-2xl bg-talos-navy-950/85 border backdrop-blur-xl shadow-hud-badge transition-all duration-300 ${activeCallout === 'integracoes' ? 'border-talos-copper-400 ring-2 ring-talos-copper-400/25 bg-talos-navy-900/90' : 'border-talos-bronze-400/30 hover:border-talos-copper-400/70'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-talos-copper-300 bg-talos-copper-500/10 px-2.5 py-0.5 border border-talos-copper-500/20">
                    03 CONEXÃO TOTAL
                  </span>
                  <span className="text-[11px] font-semibold text-talos-bronze-200">
                    Arquitetura Aberta
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-talos-copper-200 transition-colors">
                  Integração Sistêmica
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  Comunicação unificada entre ERPs, CRMs, APIs e bancos legados.
                </p>
              </div>
            </div>

            {/* Card 4: Inferior Direito (Blindagem) */}
            <div 
              onMouseEnter={() => setActiveCallout('blindagem')}
              onMouseLeave={() => setActiveCallout(null)}
              className={`absolute bottom-[16%] right-[2%] lg:right-[4%] max-w-[270px] cursor-pointer group pointer-events-auto text-right transition-all duration-300 ${activeCallout === 'blindagem' ? 'scale-105' : 'hover:-translate-y-1'}`}
            >
              <div className={`p-4 rounded-2xl bg-talos-navy-950/85 border backdrop-blur-xl shadow-hud-badge transition-all duration-300 ${activeCallout === 'blindagem' ? 'border-talos-copper-400 ring-2 ring-talos-copper-400/25 bg-talos-navy-900/90' : 'border-talos-bronze-400/30 hover:border-talos-copper-400/70'}`}>
                <div className="flex items-center justify-between mb-1.5 flex-row-reverse">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-talos-copper-300 bg-talos-copper-500/10 px-2.5 py-0.5 border border-talos-copper-500/20">
                    04 RESILIÊNCIA
                  </span>
                  <span className="text-[11px] font-semibold text-talos-bronze-200">
                    Alta Disponibilidade
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-talos-copper-200 transition-colors">
                  Blindagem de Titã
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  Arquitetura auditável e blindada inspirada no guardião mitológico.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* --- Visualização Mobile: Cards Adaptativos em Grid para Smartphones --- */}
      <div className="relative z-30 grid grid-cols-1 sm:grid-cols-2 gap-2.5 px-4 md:hidden my-3">
        {callouts.map((item) => {
          const Icon = item.icon;
          const isSelected = activeCallout === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => setActiveCallout(isSelected ? null : item.id)}
              className={`p-3 rounded-xl bg-talos-navy-950/90 border text-left backdrop-blur-md flex items-start gap-3 transition-all ${isSelected ? 'border-talos-copper-400 bg-talos-navy-900 shadow-hud-badge' : 'border-talos-bronze-400/25'}`}
            >
              <div className="p-2 rounded-lg bg-talos-copper-500/10 border border-talos-copper-500/20 text-talos-copper-300 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                  <span className="text-[10px] font-mono text-talos-copper-400 font-semibold">{item.metric}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">{item.phrase}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= FOOTER / CTA PILL INFERIOR ================= */}
      <footer className="relative z-30 pb-7 sm:pb-10 pt-2 flex flex-col items-center justify-center">
        <button 
          onClick={() => setModalOpen(true)}
          className="group relative inline-flex items-center gap-3.5 px-9 sm:px-12 py-3.5 sm:py-4 rounded-lg bg-talos-navy-950/80 border border-talos-copper-400/40 hover:border-talos-copper-300 text-slate-100 hover:text-white font-medium text-xs sm:text-sm tracking-wider uppercase backdrop-blur-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
        >
          {/* Fundo do Botão */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-talos-copper-500/10 via-talos-bronze-400/20 to-talos-copper-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <span className="relative z-10 font-bold tracking-[0.18em] text-talos-copper-200">
            INICIAR DIAGNÓSTICO
          </span>

          <div className="relative z-10 w-6 h-6 rounded-md bg-talos-copper-500/20 border border-talos-copper-400/40 flex items-center justify-center group-hover:bg-talos-copper-500/40 group-hover:translate-x-1 transition-all duration-300">
            <ChevronRight className="w-3.5 h-3.5 text-talos-copper-300" />
          </div>
        </button>
      </footer>

      {/* ================= MODAL DE DIAGNÓSTICO ESTRATÉGICO ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-talos-void/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg rounded-3xl bg-talos-navy-900 border border-talos-bronze-400/40 p-6 sm:p-8 shadow-2xl">
            
            {/* Fechar */}
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {formSent ? (
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-talos-copper-500/20 border border-talos-copper-400/40 flex items-center justify-center text-talos-copper-300 mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-2">Solicitação Recebida</h3>
                <p className="text-sm text-slate-300">Nossa equipe de engenharia e inteligência artificial entrará em contato para agendar seu diagnóstico técnico.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-5 h-5 rounded-md bg-talos-navy-950 border border-talos-bronze-400/40 p-0.5 flex items-center justify-center">
                    <img src="/talos-logo.png" alt="TALOS" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-talos-bronze-300">Diagnóstico de Automação & IA</span>
                </div>
                <h3 className="text-2xl font-bold font-display text-white mb-2">Otimização Industrial</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6">
                  Avaliação técnica de infraestrutura para integração de agentes autônomos e automação de processos.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Seu Nome / Cargo</label>
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Carlos Mendes — Diretor de Operações"
                      className="w-full px-4 py-2.5 rounded-xl bg-talos-navy-950/90 border border-white/10 focus:border-talos-copper-400 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">E-mail Corporativo</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="carlos@suaempresa.com.br"
                      className="w-full px-4 py-2.5 rounded-xl bg-talos-navy-950/90 border border-white/10 focus:border-talos-copper-400 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Principal desafio operacional</label>
                    <select 
                      value={desafio}
                      onChange={(e) => setDesafio(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-talos-navy-950/90 border border-white/10 focus:border-talos-copper-400 text-sm text-white outline-none transition-colors"
                    >
                      <option value="automacao">Processos manuais lentos e propensos a falhas</option>
                      <option value="integracoes">Sistemas e ERPs desconectados (silos de dados)</option>
                      <option value="ia">Implementação de IA generativa e agentes autônomos</option>
                      <option value="geral">Quero uma consultoria diagnóstica completa</option>
                    </select>
                  </div>

                  {errorMsg && (
                    <p className="text-red-400 text-xs font-medium">{errorMsg}</p>
                  )}

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-talos-copper-500 to-talos-bronze-500 hover:from-talos-copper-400 hover:to-talos-bronze-400 text-talos-void font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {isLoading ? 'Enviando...' : 'Solicitar Diagnóstico Estratégico'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
