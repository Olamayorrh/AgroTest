import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, Sparkles, Link2 } from 'lucide-react';
import Button from './Button';

// Curated realistic African agricultural equipment demo photos
export const PRESET_EQUIPMENT_IMAGES = [
  {
    category: 'Tractor',
    label: 'Utility Tractor in Field',
    url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
  },
  {
    category: 'Tractor',
    label: 'Heavy 4WD Farm Tractor',
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
  },
  {
    category: 'Harvester',
    label: 'Rice & Grain Combine Harvester',
    url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
  },
  {
    category: 'Tiller',
    label: 'Power Tiller / Walk-Behind Cultivator',
    url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&q=80',
  },
  {
    category: 'Irrigation',
    label: 'Diesel Irrigation Pump & Pipes',
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
  },
  {
    category: 'Planter',
    label: 'Precision Row Planter & Drill',
    url: 'https://images.unsplash.com/photo-1599033329459-cc8c31c7eb6c?w=800&q=80',
  },
  {
    category: 'Sprayer',
    label: 'Boom Sprayer for Crop Protection',
    url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&q=80',
  },
  {
    category: 'Thresher',
    label: 'Stationary Multi-Crop Grain Thresher',
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80',
  },
];

/**
 * ImageUpload component
 * Allows uploading real images from device, choosing from presets, or entering a URL.
 */
const ImageUpload = ({ value, onChange, label = 'Machinery Photo' }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'preset' | 'url'
  const [urlInput, setUrlInput] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    // Limit to 3MB to keep demo localStorage snappy
    if (file.size > 3 * 1024 * 1024) {
      setUploadError('File size is larger than 3MB. Please select a smaller photo.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Error reading the image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  const isDataUrl = value && value.startsWith('data:image');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-neutral-800">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
          >
            <X size={13} />
            Remove Photo
          </button>
        )}
      </div>

      {/* Preview if image is chosen */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-primary-500/50 bg-neutral-100 shadow-sm group">
          <img
            src={value}
            alt="Equipment Preview"
            className="w-full h-48 object-cover transition-transform group-hover:scale-[1.02] duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1.5 font-semibold bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              <Check size={14} className="text-secondary-400" />
              {isDataUrl ? 'Uploaded from Device' : 'Selected Photo'}
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-neutral-900 font-bold px-3 py-1 rounded-lg shadow-sm hover:bg-neutral-100 transition-colors"
            >
              Change Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-2xl p-4 bg-neutral-50/60 space-y-3">
          {/* Tabs */}
          <div className="flex rounded-xl bg-neutral-200/60 p-1 text-xs font-semibold text-neutral-600">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'upload' ? 'bg-white text-primary-800 shadow-xs' : 'hover:text-neutral-900'
              }`}
            >
              <Upload size={13} />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'preset' ? 'bg-white text-primary-800 shadow-xs' : 'hover:text-neutral-900'
              }`}
            >
              <Sparkles size={13} />
              Preset Photos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'url' ? 'bg-white text-primary-800 shadow-xs' : 'hover:text-neutral-900'
              }`}
            >
              <Link2 size={13} />
              Image URL
            </button>
          </div>

          {/* Tab 1: Upload from Device */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 hover:border-primary-500 rounded-xl p-5 text-center bg-white cursor-pointer transition-all hover:bg-primary-50/20 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload size={20} />
              </div>
              <p className="text-xs font-bold text-neutral-800">
                Click to browse or drag & drop photo
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Supports JPG, PNG, WEBP (Max 3MB)
              </p>
            </div>
          )}

          {/* Tab 2: Preset Photo Picker */}
          {activeTab === 'preset' && (
            <div className="space-y-2">
              <p className="text-[11px] text-neutral-500">
                Select a matching machinery photo from our curated African agricultural library:
              </p>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                {PRESET_EQUIPMENT_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChange(preset.url)}
                    className="relative group rounded-xl overflow-hidden border border-neutral-200 hover:border-primary-600 transition-all text-left bg-white"
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="p-1 bg-white">
                      <p className="text-[10px] font-bold text-neutral-800 truncate">{preset.label}</p>
                      <span className="text-[9px] text-neutral-400">{preset.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Paste URL */}
          {activeTab === 'url' && (
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/tractor-photo.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleApplyUrl}
                disabled={!urlInput.trim()}
              >
                Apply
              </Button>
            </div>
          )}

          {uploadError && (
            <p className="text-xs text-red-600 font-medium">{uploadError}</p>
          )}
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
