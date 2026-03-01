import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/helpers';
import { toast } from 'react-hot-toast';

interface MapContainerProps {
  pins?: { lat: number; lng: number; name: string } | null;
  mode: 'earth' | 'solar' | 'universe';
}

export interface MapControls {
  flyTo: (lat: number, lng: number, name?: string) => void;
  clearMarkers: () => void;
}

const MapContainer = forwardRef<MapControls, MapContainerProps>(({ pins, mode }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  useImperativeHandle(ref, () => ({
    flyTo: (lat, lng, name) => {
      if (!map.current) return;
      
      map.current.flyTo({
        center: [lng, lat],
        zoom: 12,
        essential: true,
        duration: 2000
      });

      addPulsingMarker(lat, lng);
      if (name) toast.success(`📍 Showing: ${name}`);
    },
    clearMarkers: () => {
      if (!map.current) return;
      if (map.current.getLayer('pulsing-marker')) {
        map.current.removeLayer('pulsing-marker');
        map.current.removeSource('pulsing-marker');
      }
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
    }
  }));

  const addPulsingMarker = (lat: number, lng: number) => {
    if (!map.current) return;

    const size = 150;
    const pulsingDot: any = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
      context: null as CanvasRenderingContext2D | null,

      onAdd: function() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      render: function() {
        const duration = 1500;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
        context.fillStyle = `rgba(239, 68, 68, ${1 - t})`;
        context.fill();

        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(239, 68, 68, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        this.data = context.getImageData(0, 0, this.width, this.height).data;
        map.current?.triggerRepaint();
        return true;
      }
    };

    if (map.current.hasImage('pulsing-dot')) {
      map.current.removeImage('pulsing-dot');
    }
    
    map.current.addImage('pulsing-dot', pulsingDot as any, { pixelRatio: 2 });

    if (map.current.getLayer('pulsing-marker')) {
      map.current.removeLayer('pulsing-marker');
      map.current.removeSource('pulsing-marker');
    }

    map.current.addSource('pulsing-marker', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {}
      }
    });

    map.current.addLayer({
      id: 'pulsing-marker',
      type: 'symbol',
      source: 'pulsing-marker',
      layout: {
        'icon-image': 'pulsing-dot',
        'icon-allow-overlap': true
      }
    });
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [0, 20],
      zoom: 1.5,
      maxZoom: 19
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;
      
      map.current.addSource('satellite', {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: '© Esri'
      });

      map.current.addLayer({
        id: 'satellite-layer',
        type: 'raster',
        source: 'satellite',
        layout: {
          visibility: 'visible'
        }
      });
    });

    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    if (!map.current || mode !== 'earth') return;

    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }

    if (pins) {
      marker.current = new maplibregl.Marker({ color: '#ef4444' })
        .setLngLat([pins.lng, pins.lat])
        .addTo(map.current);
    }
  }, [pins, mode]);

  return (
    <div className={cn("relative w-full h-full transition-opacity duration-1000", mode === 'earth' ? "opacity-100" : "opacity-0 pointer-events-none")}>
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md p-2 rounded-lg border border-white/10 text-[10px] text-gray-400">
        Satellite Imagery © Esri
      </div>
    </div>
  );
});

export default MapContainer;
