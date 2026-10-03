import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Sparkles, Monitor, Info, CheckCircle2, RotateCw } from 'lucide-react';

interface Helmet3DProps {
  activeFeature?: string | null;
}

export const Helmet3D: React.FC<Helmet3DProps> = ({ activeFeature }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback2D, setUseFallback2D] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // References for 3D state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    lightCopper: THREE.DirectionalLight;
    lightPurpleLeft: THREE.DirectionalLight;
    lightPurpleRight: THREE.DirectionalLight;
    dirTop: THREE.DirectionalLight;
  } | null>(null);

  // Mouse & Touch Drag State
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    rotationX: 0,
    rotationY: 0,
    targetRotX: 0,
    targetRotY: 0,
    autoRotY: 0,
  });

  useEffect(() => {
    if (useFallback2D) return;
    if (!containerRef.current) return;
    const container = containerRef.current;
    let mounted = true;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    // 1. Tenta inicializar o WebGLRenderer 3D diretamente
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        precision: 'highp',
        stencil: false,
        depth: true,
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      rendererRef.current = renderer;
    } catch (e) {
      console.warn('Falha ao inicializar WebGL 3D, ativando versão 2.5D com aviso:', e);
      if (mounted) {
        setUseFallback2D(true);
        setLoading(false);
      }
      return;
    }

    container.appendChild(renderer.domElement);

    // Trata perda de contexto WebGL
    const onContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('Contexto WebGL perdido, alternando para 2.5D');
      if (mounted) {
        setUseFallback2D(true);
        setLoading(false);
      }
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    // 2. Cena & Câmera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.2);

    // 3. Sistema de Iluminação Cinemática PBR (Bronze Metálico & Circuitos Roxos)
    const ambientLight = new THREE.AmbientLight(0x0a1435, 1.5);
    scene.add(ambientLight);

    // Luz Zenital (dourada suave)
    const dirTop = new THREE.DirectionalLight(0xffedd5, 2.6);
    dirTop.position.set(0, 5, 2.5);
    scene.add(dirTop);

    // Fill frontal
    const dirFill = new THREE.DirectionalLight(0xcfa071, 1.2);
    dirFill.position.set(0, -2.5, 3);
    scene.add(dirFill);

    // Luz de borda esquerda (circuito violeta)
    const lightPurpleLeft = new THREE.DirectionalLight(0xc084fc, 3.2);
    lightPurpleLeft.position.set(-3.5, 0.8, 1.8);
    scene.add(lightPurpleLeft);

    // Luz de borda direita (circuito roxo elétrico)
    const lightPurpleRight = new THREE.DirectionalLight(0xa855f7, 3.2);
    lightPurpleRight.position.set(3.5, 0.8, 1.8);
    scene.add(lightPurpleRight);

    // Luz de realce no visor
    const lightCopper = new THREE.DirectionalLight(0xf59e58, 1.8);
    lightCopper.position.set(0, -0.6, 2.8);
    scene.add(lightCopper);

    lightsRef.current = { lightCopper, lightPurpleLeft, lightPurpleRight, dirTop };

    // 4. Carrega o Modelo 3D Original
    const loader = new GLTFLoader();
    const pivotGroup = new THREE.Group();
    scene.add(pivotGroup);
    modelRef.current = pivotGroup;

    let isModelLoaded = false;
    let warmupFrames = 0;

    loader.load(
      '/assets/3d-helmet.glb',
      (gltf) => {
        if (!mounted) return;
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.15 / maxDim;
        model.scale.setScalar(scale);

        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale - 0.04;
        model.position.z = -center.z * scale;

        // Materiais PBR ajustados para reflexos ricos de bronze
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.38;
              mat.metalness = 0.84;
              mat.needsUpdate = true;
            }
          }
        });

        pivotGroup.add(model);
        setLoading(false);
        isModelLoaded = true;
      },
      undefined,
      (err) => {
        console.warn('Erro ao carregar modelo 3D, usando fallback 2.5D:', err);
        if (mounted) {
          setUseFallback2D(true);
          setLoading(false);
        }
      }
    );

    // 5. Controles de rotação por arraste (Mouse & Touch)
    const onMouseDown = (e: MouseEvent) => {
      dragRef.current.isDragging = true;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;

      dragRef.current.targetRotY += dx * 0.01;
      dragRef.current.targetRotX += dy * 0.01;
      dragRef.current.targetRotX = Math.max(-0.4, Math.min(0.4, dragRef.current.targetRotX));
    };

    const onMouseUp = () => {
      dragRef.current.isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        dragRef.current.isDragging = true;
        dragRef.current.startX = e.touches[0].clientX;
        dragRef.current.startY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragRef.current.startX;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      dragRef.current.startX = e.touches[0].clientX;
      dragRef.current.startY = e.touches[0].clientY;

      dragRef.current.targetRotY += dx * 0.012;
      dragRef.current.targetRotX += dy * 0.012;
      dragRef.current.targetRotX = Math.max(-0.4, Math.min(0.4, dragRef.current.targetRotX));
    };

    const onTouchEnd = () => {
      dragRef.current.isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 6. Loop de Animação com Watchdog de Desempenho
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameTimes: number[] = [];

    const animate = (currentTime: number) => {
      if (!mounted) return;
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) {
        lastTime = currentTime;
        return;
      }

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      const frameDuration = currentTime - lastTime;
      lastTime = currentTime;
      const elapsed = currentTime / 1000;

      // Watchdog de FPS: caso a máquina do usuário não dê conta do 3D (< 22 FPS)
      if (isModelLoaded) {
        warmupFrames++;
        if (warmupFrames > 35 && frameTimes.length < 35) {
          frameTimes.push(frameDuration);
          if (frameTimes.length === 35) {
            const avgDuration = frameTimes.reduce((a, b) => a + b, 0) / 35;
            // Se a média por frame for maior que 45ms (< 22 FPS), ativa o 2.5D
            if (avgDuration > 45) {
              console.info('FPS insuficiente detectado na máquina (< 22 FPS), ativando 2.5D');
              cancelAnimationFrame(animationFrameId);
              if (container.contains(domElement)) {
                container.removeChild(domElement);
              }
              try {
                renderer.dispose();
              } catch {
                // Ignore
              }
              setUseFallback2D(true);
              return;
            }
          }
        }
      }

      // Suavização do arraste
      dragRef.current.rotationX += (dragRef.current.targetRotX - dragRef.current.rotationX) * 0.1;
      dragRef.current.rotationY += (dragRef.current.targetRotY - dragRef.current.rotationY) * 0.1;

      // Rotação contínua automática
      if (!dragRef.current.isDragging) {
        dragRef.current.autoRotY += delta * 0.70;
      }

      if (pivotGroup) {
        // Flutuação física
        pivotGroup.position.y = Math.sin(elapsed * 1.8) * 0.08;

        // Rotação composta
        pivotGroup.rotation.y = dragRef.current.autoRotY + dragRef.current.rotationY;
        pivotGroup.rotation.x = Math.sin(elapsed * 0.9) * 0.04 + dragRef.current.rotationX;
        pivotGroup.rotation.z = Math.cos(elapsed * 1.2) * 0.02;

        // Pulsação suave das luzes dos circuitos
        if (lightsRef.current) {
          const { lightCopper, lightPurpleLeft, lightPurpleRight } = lightsRef.current;
          lightCopper.intensity = 1.8 + Math.sin(elapsed * 2.0) * 0.4;
          lightPurpleLeft.intensity = 3.2 + Math.cos(elapsed * 2.3) * 0.8;
          lightPurpleRight.intensity = 3.2 + Math.sin(elapsed * 2.3) * 0.8;
        }
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 7. Redimensionamento responsivo
    const handleResize = () => {
      if (!container || !mounted) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Limpeza
    return () => {
      mounted = false;
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('webglcontextlost', onContextLost);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      try {
        renderer.dispose();
      } catch {
        // Ignore
      }
    };
  }, [useFallback2D, retryCount]);

  // Resposta dinâmica da iluminação ao hover dos cards
  useEffect(() => {
    if (!lightsRef.current) return;
    const { lightCopper, lightPurpleLeft, lightPurpleRight } = lightsRef.current;

    if (activeFeature === 'ia' || activeFeature === 'blindagem') {
      lightPurpleLeft.intensity = 5.2;
      lightPurpleRight.intensity = 5.2;
      lightCopper.intensity = 1.2;
    } else if (activeFeature === 'automacao' || activeFeature === 'integracoes') {
      lightCopper.intensity = 3.4;
      lightPurpleLeft.intensity = 2.2;
      lightPurpleRight.intensity = 2.2;
    } else {
      lightCopper.intensity = 1.8;
      lightPurpleLeft.intensity = 3.2;
      lightPurpleRight.intensity = 3.2;
    }
  }, [activeFeature]);

  // ================= VERSÃO 2.5D IMPECÁVEL COM AVISO AO PASSAR O MOUSE =================
  if (useFallback2D) {
    return (
      <div 
        className="relative w-full h-full flex items-center justify-center select-none pointer-events-auto"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        {/* Glow de Circuito e Bronze de Fundo */}
        <div className="absolute inset-0 bg-radial from-talos-copper-500/20 via-talos-circuit-500/15 to-transparent blur-3xl rounded-full scale-90 animate-pulse"></div>

        {/* Imagem Frontal com Flutuação Física 2.5D Fluida a 60 FPS */}
        <div 
          className="relative w-full h-full flex items-center justify-center animate-float-slow transition-transform duration-700 cursor-pointer"
          onClick={() => setTooltipVisible((prev) => !prev)}
        >
          <img 
            src="/assets/Helmet-noBG.png" 
            alt="TALOS — Capacete de Bronze Frontal" 
            className="w-full h-full object-contain filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] hover:scale-[1.02] transition-transform duration-500"
          />
        </div>

        {/* Badge Sutil de Informação na Base do Capacete */}
        <div 
          className="absolute -bottom-7 sm:bottom-2 left-1/2 -translate-x-1/2 z-30 cursor-pointer pointer-events-auto whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation();
            setTooltipVisible((prev) => !prev);
          }}
          title="Clique ou passe o mouse para mais detalhes"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-talos-navy-950/80 border border-talos-bronze-400/25 backdrop-blur-md text-[10px] font-mono text-talos-bronze-300 tracking-wider shadow-lg hover:border-talos-copper-400/60 transition-all">
            <Sparkles className="w-3 h-3 text-talos-copper-glow animate-pulse" />
            <span>Versão 2.5D Otimizada</span>
            <Info className="w-3 h-3 text-talos-copper-300 ml-0.5" />
          </div>
        </div>

        {/* Tooltip Explicativo Elegante ao Passar o Mouse */}
        {tooltipVisible && (
          <div 
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[340px] p-5 rounded-2xl bg-[#030718]/95 border border-talos-bronze-400/50 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-talos-copper-500/15 border border-talos-copper-400/30 text-talos-copper-300 shrink-0 mt-0.5">
                <Monitor className="w-5 h-5" />
              </div>
              
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      Experiência 3D Interativa
                    </h4>
                    <span className="w-1.5 h-1.5 rounded-full bg-talos-copper-glow animate-ping"></span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setTooltipVisible(false);
                    }}
                    className="text-slate-400 hover:text-white text-xs p-1"
                    title="Fechar"
                  >
                    ✕
                  </button>
                </div>
                
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Para visualizar o capacete 3D com rotação em 360° e reflexos dinâmicos em tempo real, utilize um navegador baseado no <strong>Chromium</strong> com aceleração de hardware:
                </p>

                {/* Chips de Navegadores Recomendados */}
                <div className="flex items-center gap-2 mt-1 pt-2 border-t border-white/10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Google Chrome
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Microsoft Edge
                  </span>
                </div>
                
                <p className="text-[9px] text-slate-400 mt-0.5">
                  * No Firefox, ative a aceleração em <em>Configurações &gt; Geral &gt; Desempenho</em>.
                </p>

                {/* Botão para re-tentar modo 3D */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTooltipVisible(false);
                    setUseFallback2D(false);
                    setLoading(true);
                    setRetryCount((c) => c + 1);
                  }}
                  className="mt-2 w-full py-1.5 rounded-xl bg-gradient-to-r from-talos-copper-500/20 to-talos-circuit-500/20 border border-talos-copper-400/40 text-[10px] font-semibold text-talos-copper-200 hover:border-talos-copper-400 hover:text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Tentar Modo 3D Novamente</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ================= VERSÃO 3D FULL PBR (EDGE, CHROME E SISTEMAS COM ACELERAÇÃO) =================
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div 
        ref={containerRef} 
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        title="Clique e arraste para girar o capacete 3D"
      />

      {/* Badge Informativa do Modo 3D com Opção de Alternar */}
      {!loading && (
        <div className="absolute -bottom-7 sm:bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-auto whitespace-nowrap">
          <div 
            onClick={() => setUseFallback2D(true)}
            title="Clique para alternar para a versão 2.5D ultraleve"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-talos-navy-950/80 border border-talos-bronze-400/25 backdrop-blur-md text-[10px] font-mono text-talos-bronze-300 tracking-wider shadow-lg hover:border-talos-copper-400/60 cursor-pointer transition-all"
          >
            <Sparkles className="w-3 h-3 text-talos-copper-glow animate-pulse" />
            <span>3D Interativo • Arraste para girar</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-talos-void/50 backdrop-blur-sm z-30 transition-opacity duration-500 pointer-events-none">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-talos-copper-500/20 border-t-talos-copper-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-talos-circuit-500/20 border-b-talos-circuit-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-talos-bronze-300">
            Sintetizando 3D...
          </span>
        </div>
      )}
    </div>
  );
};
