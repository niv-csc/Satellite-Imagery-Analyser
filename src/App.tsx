import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Globe, Satellite, History, Layers, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

import MapContainer, { MapControls } from './components/MapContainer';
import UploadModal from './components/UploadModal';
import AnalysisPanel from './components/AnalysisPanel';
import ThreeScene from './components/ThreeScene';
import SearchBar from './components/SearchBar';
import ImageGuidelines from './components/ImageGuidelines';
import ErrorBoundary from './components/ErrorBoundary';
import { SatelliteAnalysis } from './services/geminiService';
import { cn } from './utils/helpers';
import { safeArray } from './utils/safeArray';

export default function App() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<(SatelliteAnalysis & { fileUrl: string }) | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [mapMode, setMapMode] = useState<'earth' | 'solar' | 'universe'>('earth');
  
  const mapRef = useRef<MapControls>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/history');
      setHistory(safeArray(res.data.data));
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  const handleAnalysisComplete = (data: SatelliteAnalysis & { fileUrl: string }) => {
    setAnalysisData(data);
    mapRef.current?.clearMarkers();
    
    if (data.imageType === 'astronomy') {
      setMapMode('universe');
      toast.success('🌌 Astronomy image detected! Switching to Universe view...', { icon: '✨' });
    } else {
      setMapMode('earth');
      if (data.location?.lat && data.location?.lng) {
        setTimeout(() => {
          mapRef.current?.flyTo(data.location.lat, data.location.lng, data.location.name);
        }, 500);
      }
    }
    fetchHistory();
  };

  const handleLocationSelect = (location: any) => {
    setMapMode('earth');
    setAnalysisData(null);
    mapRef.current?.clearMarkers();
    
    setTimeout(() => {
      mapRef.current?.flyTo(location.lat, location.lng, location.name);
    }, 100);
  };

  return (
    <ErrorBoundary>
      <div className="relative w-screen h-screen bg-bg-primary overflow-hidden font-sans">
        <Toaster position="top-center" />

        {/* Main Map */}
        <MapContainer 
          ref={mapRef}
          mode={mapMode}
          pins={analysisData ? { lat: analysisData.location.lat, lng: analysisData.location.lng, name: analysisData.location.name } : null} 
        />

        {/* Three.js Scene */}
        {(mapMode === 'solar' || mapMode === 'universe') && (
          <ThreeScene mode={mapMode} astronomyData={analysisData?.astronomyData} />
        )}

        {/* Header / Search */}
        <div className="absolute top-6 left-6 right-6 z-[1000] flex justify-between items-start pointer-events-none">
          <div className="flex gap-4 pointer-events-auto">
            <div className="bg-bg-secondary/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex items-center gap-3 shadow-2xl">
              <div className="bg-accent-primary p-2 rounded-xl">
                <Satellite className="text-white" size={20} />
              </div>
              <div className="pr-4">
                <h1 className="text-sm font-bold tracking-tight">SATELLITE.AI</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Imagery Intelligence</p>
              </div>
            </div>

            <SearchBar onLocationSelect={handleLocationSelect} />
          </div>

          <div className="flex gap-3 pointer-events-auto">
            <button 
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="bg-bg-secondary/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl hover:bg-bg-tertiary transition-all shadow-2xl group"
            >
              <History size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="bg-accent-primary hover:bg-accent-secondary text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-2xl shadow-accent-primary/20"
            >
              <Upload size={18} />
              Analyze Imagery
            </button>
          </div>
        </div>

        {/* History Sidebar */}
        <AnimatePresence>
          {isHistoryOpen && (
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              className="fixed top-0 left-0 w-80 h-full bg-bg-secondary/95 backdrop-blur-2xl border-r border-border-color z-[1600] p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <History size={18} className="text-accent-primary" />
                  Recent Analyses
                </h2>
                <button onClick={() => setIsHistoryOpen(false)} className="p-1 hover:bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <Layers className="mx-auto text-gray-600 mb-4" size={40} />
                    <p className="text-sm text-gray-500">No recent scans found.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        const data = { ...item.analysis, fileUrl: `/uploads/${item.filename}` };
                        setAnalysisData(data);
                        if (data.imageType === 'astronomy') setMapMode('universe');
                        else setMapMode('earth');
                        setIsHistoryOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-primary/30 hover:bg-white/10 transition-all group"
                    >
                      <p className="text-xs font-bold text-accent-primary mb-1 truncate">{item.original_name}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{item.analysis.location.name}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[9px] text-gray-600">{new Date(item.created_at).toLocaleDateString()}</span>
                        <span className={cn(
                          "text-[8px] px-1.5 py-0.5 rounded uppercase font-bold",
                          item.analysis.authenticity.status === 'authentic' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                        )}>
                          {item.analysis.authenticity.status}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisData && (
            <AnalysisPanel data={analysisData} onClose={() => setAnalysisData(null)} />
          )}
        </AnimatePresence>

        {/* Upload Modal */}
        <UploadModal 
          isOpen={isUploadOpen} 
          onClose={() => setIsUploadOpen(false)} 
          onAnalysisComplete={handleAnalysisComplete}
        />

        {/* Bottom Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-[1000]">
          <div className="bg-bg-secondary/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl flex gap-1 shadow-2xl">
            <button 
              onClick={() => setMapMode('earth')}
              className={cn("p-3 rounded-xl transition-all", mapMode === 'earth' ? "bg-accent-primary text-white shadow-lg shadow-accent-primary/20" : "text-gray-400 hover:bg-white/5 hover:text-white")}
            >
              <Globe size={18} />
            </button>
            <button 
              onClick={() => setMapMode('solar')}
              className={cn("p-3 rounded-xl transition-all", mapMode === 'solar' ? "bg-accent-primary text-white shadow-lg shadow-accent-primary/20" : "text-gray-400 hover:bg-white/5 hover:text-white")}
            >
              <Layers size={18} />
            </button>
            <button 
              onClick={() => setMapMode('universe')}
              className={cn("p-3 rounded-xl transition-all", mapMode === 'universe' ? "bg-accent-primary text-white shadow-lg shadow-accent-primary/20" : "text-gray-400 hover:bg-white/5 hover:text-white")}
            >
              <Satellite size={18} />
            </button>
          </div>
        </div>

        <ImageGuidelines />
      </div>
    </ErrorBoundary>
  );
}
