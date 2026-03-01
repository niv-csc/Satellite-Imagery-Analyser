import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function ImageGuidelines() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-30 right-6 w-12 h-12 rounded-full bg-bg-secondary border border-border-color flex items-center justify-center shadow-2xl hover:border-accent-primary transition-all group z-[1000]"
        title="Image Guidelines"
      >
        <HelpCircle size={24} className="text-gray-400 group-hover:text-accent-primary transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-bg-secondary w-full max-w-2xl rounded-3xl border border-border-color shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border-color flex justify-between items-center bg-bg-tertiary/50">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="text-accent-primary" size={20} />
                  Image Upload Guidelines
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                <section>
                  <h3 className="text-emerald-500 font-bold flex items-center gap-2 mb-4">
                    <CheckCircle2 size={18} />
                    Best for Earth Analysis
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">🌍 High-res satellite imagery</li>
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">🏞️ Clear natural landmarks</li>
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">🏙️ Urban grid patterns</li>
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">🌊 Distinct water bodies</li>
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">🏜️ Desert terrain patterns</li>
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">📷 Photos with GPS metadata</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-accent-secondary font-bold flex items-center gap-2 mb-4">
                    <Sparkles size={18} />
                    Best for Universe View
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">✨ Colorful Nebulas</li>
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">🌀 Spiral Galaxies</li>
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">⭐ Bright Star Clusters</li>
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">📡 Telescope captures</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-red-500 font-bold flex items-center gap-2 mb-4">
                    <AlertCircle size={18} />
                    Images to Avoid
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">🤳 Selfies or people</li>
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">🏠 Ground-level close-ups</li>
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">🎨 Drawings or paintings</li>
                    <li className="bg-white/5 p-3 rounded-xl border border-white/5">📱 Map screenshots</li>
                  </ul>
                </section>

                <div className="bg-accent-primary/10 border-l-4 border-accent-primary p-4 rounded-r-xl">
                  <p className="text-sm text-accent-primary font-medium">
                    💡 Tip: For best results, use wide-angle "big picture" shots that clearly show terrain or celestial structures.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
