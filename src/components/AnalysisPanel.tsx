import React from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck, ShieldAlert, MapPin, Activity, Globe, Info } from 'lucide-react';
import { SatelliteAnalysis } from '../services/geminiService';
import { cn } from '../utils/helpers';

interface AnalysisPanelProps {
  data: SatelliteAnalysis & { fileUrl: string };
  onClose: () => void;
}

export default function AnalysisPanel({ data, onClose }: AnalysisPanelProps) {
  const isAuthentic = data.authenticity.status === 'authentic';
  const isSuspicious = data.authenticity.status === 'suspicious';
  const isAstronomy = data.imageType === 'astronomy';

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      className="fixed top-0 right-0 w-full max-w-md h-full bg-bg-secondary border-l border-border-color shadow-2xl z-[1500] flex flex-col"
    >
      <div className="p-6 border-bottom border-border-color flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity size={18} className="text-accent-primary" />
          {isAstronomy ? 'Celestial Analysis' : 'Geospatial Analysis'}
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Preview */}
        <div className="rounded-xl overflow-hidden border border-border-color aspect-video relative group">
          <img src={data.fileUrl} alt="Satellite" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <p className="text-xs text-white/80 truncate">{data.metadata.satellite}</p>
          </div>
        </div>

        {/* Astronomy Info */}
        {isAstronomy && data.astronomyData && (
          <section className="bg-accent-secondary/10 p-4 rounded-xl border border-accent-secondary/20">
            <h3 className="text-xs font-bold text-accent-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
              <Globe size={14} />
              Celestial Object Detected
            </h3>
            <p className="text-lg font-bold text-white">{data.astronomyData.title}</p>
            <p className="text-sm text-accent-secondary font-medium mt-1 uppercase tracking-wider">{data.astronomyData.type}</p>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">{data.astronomyData.description}</p>
          </section>
        )}

        {/* Authenticity */}
        <section>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck size={14} />
            Authenticity Verification
          </h3>
          <div className={cn(
            "p-4 rounded-xl border flex gap-4",
            isAuthentic ? "bg-emerald-500/5 border-emerald-500/20" : 
            isSuspicious ? "bg-amber-500/5 border-amber-500/20" : 
            "bg-red-500/5 border-red-500/20"
          )}>
            <div className={cn(
              "p-2 rounded-lg h-fit",
              isAuthentic ? "bg-emerald-500/20 text-emerald-500" : 
              isSuspicious ? "bg-amber-500/20 text-amber-500" : 
              "bg-red-500/20 text-red-500"
            )}>
              {isAuthentic ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
            </div>
            <div>
              <p className="font-semibold capitalize">{data.authenticity.status}</p>
              <p className="text-sm text-gray-400 mt-1">{data.authenticity.reason}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-current transition-all duration-1000" 
                    style={{ width: `${data.authenticity.confidence * 100}%` }} 
                  />
                </div>
                <span className="text-[10px] font-mono">{(data.authenticity.confidence * 100).toFixed(0)}% Match</span>
              </div>
            </div>
          </div>
        </section>

        {/* Geospatial Metrics - Only for Earth */}
        {!isAstronomy && (
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Globe size={14} />
              Geospatial Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard label="Vegetation" value={`${data.geospatial.vegetation}%`} color="bg-emerald-500" />
              <MetricCard label="Urban Area" value={`${data.geospatial.urban}%`} color="bg-blue-500" />
              <MetricCard label="Cloud Cover" value={`${data.geospatial.cloudCover}%`} color="bg-gray-400" />
              <MetricCard label="Agriculture" value={`${data.geospatial.agriculture}%`} color="bg-amber-500" />
            </div>
            <div className="mt-4 p-4 bg-bg-tertiary rounded-xl border border-border-color">
              <p className="text-xs text-gray-500 mb-1">Primary Land Use</p>
              <p className="font-medium">{data.geospatial.landUse}</p>
            </div>
          </section>
        )}

        {/* Location - Only for Earth */}
        {!isAstronomy && (
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin size={14} />
              Location Intelligence
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Coordinates</span>
                <span className="text-sm font-mono text-accent-primary">
                  {data.location.lat.toFixed(4)}, {data.location.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Region</span>
                <span className="text-sm font-medium">{data.location.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Country</span>
                <span className="text-sm font-medium">{data.location.country}</span>
              </div>
              {data.location.inferred && (
                <div className="flex items-center gap-2 text-[10px] text-amber-500 bg-amber-500/10 px-2 py-1 rounded w-fit">
                  <Info size={10} />
                  Inferred from visual features
                </div>
              )}
            </div>
          </section>
        )}

        {/* Description */}
        <section className="pb-8">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">AI Summary</h3>
          <p className="text-sm text-gray-400 leading-relaxed italic">
            "{data.metadata.description}"
          </p>
        </section>
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-bg-tertiary p-3 rounded-xl border border-border-color">
      <p className="text-[10px] text-gray-500 uppercase mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-lg font-bold">{value}</span>
        <div className={cn("w-1.5 h-1.5 rounded-full mb-1.5", color)} />
      </div>
    </div>
  );
}
