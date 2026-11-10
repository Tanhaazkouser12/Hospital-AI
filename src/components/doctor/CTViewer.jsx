import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function CTViewer({ activeScan, onOpenUploader }) {
  const { aiDiagnosticModel } = useApp();
  const { scanInfo } = aiDiagnosticModel;

  const currentScan = activeScan || {
    type: scanInfo.type,
    imageUrl: scanInfo.imageUrl,
    series: scanInfo.series,
    windowing: scanInfo.windowing,
    confidence: 94,
    scanDate: scanInfo.scanDate,
    accession: scanInfo.accession
  };

  const [zoomLevel, setZoomLevel] = useState(1);
  const [contrastLevel, setContrastLevel] = useState(100);
  const [showRoi, setShowRoi] = useState(true);

  const handleZoom = (direction) => {
    setZoomLevel(prev => Math.min(Math.max(prev + direction * 0.2, 0.8), 2.0));
  };

  const handleContrast = () => {
    setContrastLevel(prev => (prev === 100 ? 140 : prev === 140 ? 80 : 100));
  };

  const hasScanImage = Boolean(currentScan && currentScan.imageUrl);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden shadow-xs flex flex-col">
      <div className="p-3.5 border-b border-outline-variant/40 bg-surface flex justify-between items-center text-xs">
        <span className="font-bold text-on-surface">Source Scanner Viewport</span>
        <button
          onClick={onOpenUploader}
          className="px-2.5 py-1 bg-primary-container/15 text-primary-container hover:bg-primary-container hover:text-on-primary font-bold text-[11px] rounded-md transition-colors flex items-center gap-1 shadow-2xs"
        >
          <span className="material-symbols-outlined text-[14px]">file_upload</span>
          Import Scanner Image
        </button>
      </div>

      {/* Viewport Frame */}
      <div className="relative bg-black aspect-square overflow-hidden group select-none flex items-center justify-center">
        {hasScanImage ? (
          <>
            {/* Scan Image rendering */}
            <img
              src={currentScan.imageUrl}
              alt="Clinical Diagnostic Scanner Viewport"
              className="w-full h-full object-cover opacity-95 transition-all duration-200"
              style={{
                transform: `scale(${zoomLevel})`,
                filter: `contrast(${contrastLevel}%)`
              }}
            />

            {/* Series Metadata Overlays */}
            <div className="absolute top-2 left-2 text-[10px] text-white/90 font-mono drop-shadow-md pointer-events-none bg-black/50 px-1.5 py-0.5 rounded">
              {currentScan.type || scanInfo.series}
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] text-white/90 font-mono drop-shadow-md pointer-events-none bg-black/50 px-1.5 py-0.5 rounded">
              Contrast: {contrastLevel}%
            </div>

            {/* AI Bounding Box Overlay */}
            {showRoi && (
              <div className="absolute top-1/4 left-1/3 w-24 h-24 border-2 border-inverse-primary border-dashed rounded-xs flex items-start justify-end p-1 shadow-[0_0_15px_rgba(132,212,211,0.7)] animate-pulse">
                <span className="bg-inverse-primary text-on-primary-fixed text-[9px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs">
                  ROI {currentScan.confidence || 94}%
                </span>
              </div>
            )}

            {/* Hover Controls */}
            <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-lg p-1 backdrop-blur-xs z-10">
              <button
                onClick={() => handleZoom(1)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded transition-colors"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_in</span>
              </button>
              <button
                onClick={() => handleZoom(-1)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded transition-colors"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_out</span>
              </button>
              <button
                onClick={handleContrast}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded transition-colors"
                title="Toggle Contrast"
              >
                <span className="material-symbols-outlined text-[18px]">contrast</span>
              </button>
              <button
                onClick={() => setShowRoi(!showRoi)}
                className={`p-1.5 rounded transition-colors ${showRoi ? 'text-inverse-primary bg-white/20' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
                title="Toggle AI Bounding Box"
              >
                <span className="material-symbols-outlined text-[18px]">crop_free</span>
              </button>
            </div>
          </>
        ) : (
          /* Clean Viewport when NO Scanner file was uploaded */
          <div className="p-6 text-center space-y-3 text-white/80">
            <span className="material-symbols-outlined text-5xl text-white/40">no_photography</span>
            <div className="font-bold text-sm text-white">No Scanner File Uploaded</div>
            <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">
              This patient record was admitted via clinical symptom intake. Click "Import Scanner Image" to attach a CT, X-Ray, or MRI scan file.
            </p>
            <button
              onClick={onOpenUploader}
              className="px-3.5 py-1.5 bg-primary-container text-on-primary font-bold text-xs rounded-lg hover:bg-primary transition-colors shadow-xs"
            >
              Upload Scanner File Now
            </button>
          </div>
        )}
      </div>

      <div className="p-3 text-xs font-body-sm text-on-surface-variant bg-surface-container-lowest grid grid-cols-2 gap-2 border-t border-outline-variant/40">
        <div>
          <span className="text-[10px] uppercase tracking-wider block mb-0.5 opacity-70">Scan Modality</span>
          <span className="font-semibold text-on-surface truncate block">
            {hasScanImage ? (currentScan.type || 'CT Thorax') : 'Clinical Intake (No Scan)'}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider block mb-0.5 opacity-70">AI Confidence</span>
          <span className="font-semibold text-primary-container">{currentScan.confidence || 94}% Verified</span>
        </div>
      </div>
    </div>
  );
}
