import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Video, Film, Cloud, Database, ExternalLink, Library, Check, Play, Search } from 'lucide-react';
import { FileEntry } from '../types';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (base64OrLink: string) => void;
  placeholder?: string;
  className?: string;
  hideUrlInput?: boolean;
  accept?: string;
  resourceType?: 'image' | 'video' | 'auto';
  allowMediaLibrary?: boolean;
}

export default function ImageUploadInput({
  label,
  value,
  onChange,
  placeholder = 'Or enter image / video URL link...',
  className = '',
  hideUrlInput = false,
  accept = 'image/*,video/*',
  resourceType = 'auto',
  allowMediaLibrary = true
}: ImageUploadInputProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('Uploading to Cloudinary & Database...');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [libraryFiles, setLibraryFiles] = useState<FileEntry[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState<'all' | 'image' | 'video'>('all');
  const [librarySearch, setLibrarySearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect whether current value is a video
  const isVideo = React.useMemo(() => {
    if (!value) return false;
    if (resourceType === 'video') return true;
    const lower = value.toLowerCase();
    return (
      lower.includes('.mp4') ||
      lower.includes('.webm') ||
      lower.includes('.mov') ||
      lower.includes('.m4v') ||
      lower.includes('/video/upload/') ||
      lower.startsWith('data:video/')
    );
  }, [value, resourceType]);

  // Detect whether current value is on Cloudinary
  const isCloudinary = React.useMemo(() => {
    if (!value) return false;
    const lower = value.toLowerCase();
    return lower.includes('res.cloudinary.com') || lower.includes('cloudinary');
  }, [value]);

  // Detect whether current value is stored in Neon/Database
  const isDatabase = React.useMemo(() => {
    if (!value) return false;
    return value.startsWith('/api/images/') || value.startsWith('data:') || isCloudinary;
  }, [value, isCloudinary]);

  // Load files for the media library modal
  const fetchLibraryFiles = async () => {
    setLibraryLoading(true);
    try {
      const res = await fetch('/api/files');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLibraryFiles(data);
          return;
        }
      }
      // Fallback to local storage if API is busy
      const local = localStorage.getItem('ps_files');
      if (local) {
        setLibraryFiles(JSON.parse(local));
      }
    } catch (_) {
      try {
        const local = localStorage.getItem('ps_files');
        if (local) {
          setLibraryFiles(JSON.parse(local));
        }
      } catch (_) {}
    } finally {
      setLibraryLoading(false);
    }
  };

  const openLibraryModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMediaLibrary(true);
    fetchLibraryFiles();
  };

  const processFile = (file: File) => {
    const isFileVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|mkv|m4v)$/i.test(file.name);
    const isFileImage = file.type.startsWith('image/') || /\.(png|jpg|jpeg|webp|svg|gif)$/i.test(file.name);

    if (resourceType === 'image' && !isFileImage) {
      alert('Only image files are permitted (PNG, JPG, WEBP, SVG)!');
      return;
    }
    if (resourceType === 'video' && !isFileVideo) {
      alert('Only video files are permitted (MP4, WEBM, MOV)!');
      return;
    }
    if (!isFileImage && !isFileVideo) {
      alert('Please upload an image or video file.');
      return;
    }

    setIsUploading(true);
    setUploadStatusText(isFileVideo ? 'Uploading video to Cloudinary & Database...' : 'Uploading image to Cloudinary & Database...');

    // Attempt multipart FormData first for efficiency and full binary support
    const uploadUsingFormData = async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('resource_type', isFileVideo ? 'video' : 'image');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const info = await res.json();
          if (info.url) {
            onChange(info.url);
            window.dispatchEvent(
              new CustomEvent('app-image-uploaded', {
                detail: {
                  url: info.url,
                  fileName: file.name,
                  resourceType: isFileVideo ? 'video' : 'image',
                  isCloudinary: Boolean(info.isCloudinary)
                }
              })
            );
            setIsUploading(false);
            return true;
          }
        }
      } catch (err) {
        console.warn('[ImageUploadInput] Multipart upload error, falling back to base64:', err);
      }
      return false;
    };

    // Fallback using FileReader Data URL
    const uploadUsingBase64 = () => {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                data: reader.result,
                filename: file.name,
                resource_type: isFileVideo ? 'video' : 'image'
              })
            });

            if (res.ok) {
              const info = await res.json();
              if (info.url) {
                onChange(info.url);
                window.dispatchEvent(
                  new CustomEvent('app-image-uploaded', {
                    detail: {
                      url: info.url,
                      fileName: file.name,
                      resourceType: isFileVideo ? 'video' : 'image',
                      isCloudinary: Boolean(info.isCloudinary)
                    }
                  })
                );
                return;
              }
            }
            // Fallback to local data URL
            onChange(reader.result);
            window.dispatchEvent(
              new CustomEvent('app-image-uploaded', {
                detail: { url: reader.result, fileName: file.name, resourceType: isFileVideo ? 'video' : 'image' }
              })
            );
          } catch (err) {
            console.warn('[ImageUploadInput] JSON upload fallback to local data:', err);
            onChange(reader.result);
            window.dispatchEvent(
              new CustomEvent('app-image-uploaded', {
                detail: { url: reader.result, fileName: file.name, resourceType: isFileVideo ? 'video' : 'image' }
              })
            );
          } finally {
            setIsUploading(false);
          }
        }
      };
      reader.onerror = () => {
        alert('Failed to read file from disk.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    };

    uploadUsingFormData().then((success) => {
      if (!success) {
        uploadUsingBase64();
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filtered files for the media library modal
  const filteredLibraryFiles = libraryFiles.filter((f) => {
    const isFVideo =
      f.resourceType === 'video' ||
      f.fileName.toLowerCase().endsWith('.mp4') ||
      f.fileName.toLowerCase().endsWith('.webm') ||
      f.url.toLowerCase().includes('.mp4') ||
      f.url.toLowerCase().includes('/video/upload/');

    if (libraryFilter === 'image' && isFVideo) return false;
    if (libraryFilter === 'video' && !isFVideo) return false;

    if (librarySearch) {
      const q = librarySearch.toLowerCase();
      return (
        f.fileName.toLowerCase().includes(q) ||
        (f.altText && f.altText.toLowerCase().includes(q)) ||
        f.url.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className={`space-y-1.5 text-left font-sans ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-slate-600 font-bold uppercase tracking-wider text-[9px]">
            {label}
          </label>
          {allowMediaLibrary && (
            <button
              type="button"
              onClick={openLibraryModal}
              className="text-[9px] font-bold text-indigo-650 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Library className="h-2.5 w-2.5" />
              <span>Browse Media Library</span>
            </button>
          )}
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border border-dashed rounded-xl p-3 text-center transition-all relative flex flex-col items-center justify-center min-h-[96px] cursor-pointer group ${
          dragActive
            ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]'
            : value
            ? 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
            : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
        } ${isUploading ? 'opacity-75 pointer-events-none' : ''}`}
      >
        {isUploading ? (
          <div className="space-y-2 py-3 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-7 w-7 border-2 border-indigo-600 border-t-transparent" />
              <Cloud className="h-3.5 w-3.5 text-indigo-600 absolute inset-0 m-auto" />
            </div>
            <div className="text-[10px] font-bold text-indigo-700 animate-pulse">{uploadStatusText}</div>
            <div className="text-[8px] text-slate-400">Storing in Cloudinary CDN & Neon Database</div>
          </div>
        ) : value ? (
          <div className="space-y-2 w-full flex flex-col items-center relative py-1">
            <div className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-900 flex items-center justify-center shadow-xs max-h-36 w-full max-w-xs group/thumb">
              {isVideo ? (
                <div className="relative w-full aspect-video flex items-center justify-center bg-black">
                  <video
                    src={value}
                    controls
                    className="h-full w-full object-contain max-h-32"
                    preload="metadata"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-indigo-600/90 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs pointer-events-none">
                    <Film className="h-2.5 w-2.5" /> Video
                  </span>
                </div>
              ) : (
                <div className="relative h-20 w-full flex items-center justify-center bg-slate-100">
                  <img
                    src={value}
                    className="h-full w-full object-contain"
                    alt="Upload thumbnail"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Clear button */}
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow-md transition-all z-20 cursor-pointer"
                title="Remove asset"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Cloudinary / Storage Status Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
              {isCloudinary ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  <Cloud className="h-2.5 w-2.5 text-sky-600" />
                  <span>Cloudinary CDN</span>
                </span>
              ) : isDatabase ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Database className="h-2.5 w-2.5 text-emerald-600" />
                  <span>Database Stored</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  <ExternalLink className="h-2.5 w-2.5 text-slate-500" />
                  <span>External URL</span>
                </span>
              )}

              <span className="text-[8.5px] text-slate-400 font-mono truncate max-w-[140px]" title={value}>
                {value.startsWith('data:') ? 'Base64 Encoded' : value.replace(/^https?:\/\//, '')}
              </span>
            </div>

            <div className="text-[8.5px] text-slate-400 group-hover:text-indigo-600 transition-colors">
              Click or drop to replace file
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 py-1">
            <div className="mx-auto w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              {resourceType === 'video' ? (
                <Video className="h-4 w-4" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </div>
            <div className="text-[10px] font-semibold text-slate-700">
              Drag file here or <span className="text-indigo-650 font-bold group-hover:underline">browse</span>
            </div>
            <p className="text-[8px] text-slate-400">
              {resourceType === 'video'
                ? 'MP4, WEBM, MOV up to 100MB (Cloudinary Video Streaming)'
                : resourceType === 'image'
                ? 'PNG, JPG, WEBP, SVG up to 100MB'
                : 'Images & Videos (Cloudinary CDN + Database Storage)'}
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* URL Input Bar */}
      {!hideUrlInput && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            {isVideo ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => {
              const val = e.target.value;
              onChange(val);
              if (val && (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:'))) {
                let name = 'External Asset';
                try {
                  const u = new URL(val);
                  const last = u.pathname.substring(u.pathname.lastIndexOf('/') + 1);
                  if (last && last.includes('.')) {
                    name = last;
                  }
                } catch (_) {}
                window.dispatchEvent(
                  new CustomEvent('app-image-uploaded', {
                    detail: { url: val, fileName: name, resourceType: isVideo ? 'video' : 'image' }
                  })
                );
              }
            }}
            className="w-full text-[10px] pl-7 pr-2 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium"
          />
        </div>
      )}

      {/* Media Library Picker Modal */}
      {showMediaLibrary && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            e.stopPropagation();
            setShowMediaLibrary(false);
          }}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/75">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                  <Library className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Select Media from Database & Cloudinary</h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Choose from previously uploaded images and videos stored in your media library
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaLibrary(false)}
                className="text-slate-400 hover:text-slate-650 p-1 rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-white">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setLibraryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                    libraryFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({libraryFiles.length})
                </button>
                <button
                  type="button"
                  onClick={() => setLibraryFilter('image')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                    libraryFilter === 'image'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Images
                </button>
                <button
                  type="button"
                  onClick={() => setLibraryFilter('video')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                    libraryFilter === 'video'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Videos
                </button>
              </div>

              <div className="relative w-48 sm:w-60">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-2 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>

            {/* Grid of files */}
            <div className="p-4 overflow-y-auto flex-1 min-h-[240px]">
              {libraryLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent" />
                  <span className="text-xs text-slate-500 font-medium">Loading media library from database...</span>
                </div>
              ) : filteredLibraryFiles.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <ImageIcon className="h-8 w-8 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">No media files found in library</p>
                  <p className="text-[10px]">Upload a file using the upload box above to add it to your library.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredLibraryFiles.map((file) => {
                    const isFVideo =
                      file.resourceType === 'video' ||
                      file.fileName.toLowerCase().endsWith('.mp4') ||
                      file.fileName.toLowerCase().endsWith('.webm') ||
                      file.url.toLowerCase().includes('.mp4') ||
                      file.url.toLowerCase().includes('/video/upload/');
                    const isSelected = value === file.url;

                    return (
                      <div
                        key={file.id || file.url}
                        onClick={() => {
                          onChange(file.url);
                          setShowMediaLibrary(false);
                        }}
                        className={`group relative border rounded-xl overflow-hidden cursor-pointer transition-all bg-slate-50 hover:border-indigo-500 hover:shadow-md ${
                          isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/30' : 'border-slate-200'
                        }`}
                      >
                        <div className="aspect-square w-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
                          {isFVideo ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <video
                                src={file.url}
                                className="w-full h-full object-cover opacity-80"
                                preload="metadata"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Play className="h-6 w-6 text-white fill-white/80" />
                              </div>
                              <span className="absolute top-1 left-1 bg-black/70 text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded">
                                VIDEO
                              </span>
                            </div>
                          ) : (
                            <img
                              src={file.url}
                              alt={file.altText || file.fileName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          )}

                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-indigo-600 text-white p-1 rounded-full shadow">
                              <Check className="h-3 w-3" />
                            </div>
                          )}

                          {file.url.includes('res.cloudinary.com') && (
                            <span className="absolute bottom-1 right-1 bg-sky-600/90 text-white text-[7px] font-black uppercase px-1 py-0.5 rounded flex items-center gap-0.5">
                              <Cloud className="h-2 w-2" /> CDN
                            </span>
                          )}
                        </div>

                        <div className="p-2 bg-white">
                          <p className="text-[10px] font-bold text-slate-800 truncate" title={file.fileName}>
                            {file.fileName}
                          </p>
                          <div className="flex items-center justify-between text-[8px] text-slate-400 mt-0.5">
                            <span>{file.size || 'Media file'}</span>
                            <span>{file.dateAdded || ''}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">
                {filteredLibraryFiles.length} media items stored in database
              </span>
              <button
                type="button"
                onClick={() => setShowMediaLibrary(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
