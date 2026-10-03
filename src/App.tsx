import React from 'react';
import { HeroSection } from './components/HeroSection';

export const App: React.FC = () => {
  return (
    <main className="relative min-h-screen w-full bg-talos-void overflow-x-hidden selection:bg-talos-copper-500/30 selection:text-talos-copper-200">
      <HeroSection />
    </main>
  );
};

export default App;
