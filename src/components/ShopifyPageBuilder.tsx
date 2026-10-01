import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  CustomPage, PageSection, Product, Collection, BlogPost, LayoutSettings 
} from '../types';
import { 
  Eye, EyeOff, GripVertical, ChevronDown, ChevronRight, Plus, Trash2, 
  Copy, MoveUp, MoveDown, Monitor, Smartphone, Maximize2, Undo2, Redo2, 
  Save, X, Search, Check, Layers, Image as ImageIcon, Sparkles, User, 
  Columns, Award, MessageSquare, LayoutGrid, BookOpen, Calendar, ShoppingBag, 
  FolderHeart, PlaySquare, Video, FileText, Compass, Flame, HelpCircle, 
  ArrowLeft, MoreHorizontal, Sliders, ExternalLink, RefreshCw, ChevronLeft, 
  Link as LinkIcon, Palette, AlignLeft, AlignCenter, AlignRight, Tag,
  Globe, CheckCircle2, ChevronUp, Bell, Package, FileCode, CheckSquare
} from 'lucide-react';
import ImageUploadInput from './ImageUploadInput';
import { AVAILABLE_SECTION_TEMPLATES, getSectionIcon, getSectionLabel } from './AdminDashboard';

export interface ShopifyPageBuilderProps {
  page: CustomPage;
  allPages: CustomPage[];
  onSelectPage: (pageId: string) => void;
  onUpdatePage: (updatedPage: CustomPage) => void;
  onExit: () => void;
  products: Product[];
  collections: Collection[];
  blogs?: BlogPost[];
  layoutSettings?: LayoutSettings;
  onSave: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}

export default function ShopifyPageBuilder({
  page,
  allPages,
  onSelectPage,
  onUpdatePage,
  onExit,
  products,
  collections,
  blogs = [],
  layoutSettings,
  onSave,
  isSaving,
  hasUnsavedChanges,
  onDirtyChange
}: ShopifyPageBuilderProps) {
  // Device viewport preview state
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile' | 'fullscreen'>('desktop');
  
  // Selected section & block state
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(() => {
    return page.sections && page.sections.length > 0 ? page.sections[0].id : null;
  });
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Expanded section blocks in left sidebar (sectionId -> boolean)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Top Page Selector dropdown open state & search query
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  const [pageSearchQuery, setPageSearchQuery] = useState('');
  const pageDropdownRef = useRef<HTMLDivElement>(null);

  // Add Section dropdown popover open state & search
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [addSectionQuery, setAddSectionQuery] = useState('');
  const addSectionDropdownRef = useRef<HTMLDivElement>(null);

  // Free image stock modal
  const [showStockImageModal, setShowStockImageModal] = useState<string | null>(null);

  // Drag and drop state for reordering
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [dragOverSectionIndex, setDragOverSectionIndex] = useState<number | null>(null);

  // References for middle canvas scrolling and section element anchors
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Automatically scroll middle canvas to selected section when selected
  useEffect(() => {
    if (selectedSectionId && sectionRefs.current[selectedSectionId]) {
      sectionRefs.current[selectedSectionId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedSectionId]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pageDropdownRef.current && !pageDropdownRef.current.contains(event.target as Node)) {
        setIsPageDropdownOpen(false);
      }
      if (addSectionDropdownRef.current && !addSectionDropdownRef.current.contains(event.target as Node)) {
        setIsAddSectionOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Currently selected section object
  const selectedSection = useMemo(() => {
    return page.sections.find(s => s.id === selectedSectionId) || null;
  }, [page.sections, selectedSectionId]);

  // Section updating helper
  const updateSectionSettings = (sectionId: string, newSettings: Record<string, any>) => {
    const updatedSections = page.sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          settings: {
            ...s.settings,
            ...newSettings
          }
        };
      }
      return s;
    });

    onUpdatePage({
      ...page,
      sections: updatedSections,
      updatedAt: 'Just now'
    });
    if (onDirtyChange) onDirtyChange(true);
  };

  // Section reordering
  const moveSection = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= page.sections.length || fromIndex === toIndex) return;
    const updatedSections = [...page.sections];
    const [moved] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, moved);

    onUpdatePage({
      ...page,
      sections: updatedSections,
      updatedAt: 'Just now'
    });
    if (onDirtyChange) onDirtyChange(true);
  };

  // Duplicate section
  const duplicateSection = (sectionId: string) => {
    const secIndex = page.sections.findIndex(s => s.id === sectionId);
    if (secIndex === -1) return;
    const sec = page.sections[secIndex];
    const newSec: PageSection = {
      ...JSON.parse(JSON.stringify(sec)),
      id: `sec-${Date.now()}`,
      settings: {
        ...sec.settings,
        title: sec.settings.title ? `${sec.settings.title} (Copy)` : undefined
      }
    };

    const updatedSections = [...page.sections];
    updatedSections.splice(secIndex + 1, 0, newSec);

    onUpdatePage({
      ...page,
      sections: updatedSections,
      updatedAt: 'Just now'
    });
    setSelectedSectionId(newSec.id);
    if (onDirtyChange) onDirtyChange(true);
  };

  // Remove section
  const removeSection = (sectionId: string) => {
    const updatedSections = page.sections.filter(s => s.id !== sectionId);
    onUpdatePage({
      ...page,
      sections: updatedSections,
      updatedAt: 'Just now'
    });
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(updatedSections.length > 0 ? updatedSections[0].id : null);
    }
    if (onDirtyChange) onDirtyChange(true);
  };

  // Toggle visibility of section
  const toggleSectionVisibility = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const sec = page.sections.find(s => s.id === sectionId);
    if (!sec) return;
    const isHidden = sec.settings.hidden === true;
    updateSectionSettings(sectionId, { hidden: !isHidden });
  };

  // Add new section from available templates
  const handleAddNewSection = (type: any) => {
    const template = AVAILABLE_SECTION_TEMPLATES.find(t => t.type === type);
    const newSection: PageSection = {
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: type,
      settings: {
        title: template ? template.label : 'New Section',
        subtitle: 'PREMIUM STORE CURATION',
        description: 'Refined modern silhouettes tailored with virgin wool and organic cotton.',
        buttonText: 'SHOP COLLECTION',
        buttonLink: '/collections/all',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
        backgroundColor: '#FFFFFF',
        headingColor: '#111827',
        textColor: '#4B5563',
        height: 'Large',
        overlayOpacity: 30,
        alignment: 'Center',
        fullWidth: true,
        itemsCount: 4,
        columnsDesktop: 4,
        selectedCollectionId: 'all',
        blocks: [
          { id: `blk-1-${Date.now()}`, type: 'heading', title: template?.label || 'Heading' },
          { id: `blk-2-${Date.now()}`, type: 'text', text: 'Pair text with an image to focus on your chosen product, collection, or blog post.' },
          { id: `blk-3-${Date.now()}`, type: 'buttons', buttonText: 'Explore More', buttonLink: '/collections/all' }
        ]
      }
    };

    const updatedSections = [...page.sections, newSection];
    onUpdatePage({
      ...page,
      sections: updatedSections,
      updatedAt: 'Just now'
    });
    setSelectedSectionId(newSection.id);
    setIsAddSectionOpen(false);
    if (onDirtyChange) onDirtyChange(true);
  };

  // Filtered pages in top selector
  const filteredPages = useMemo(() => {
    if (!pageSearchQuery.trim()) return allPages;
    return allPages.filter(p => 
      p.title.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(pageSearchQuery.toLowerCase())
    );
  }, [allPages, pageSearchQuery]);

  // Stock photography archive for quick one-click selection
  const stockImages = [
    { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80', label: 'Luxury Fashion Model' },
    { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80', label: 'Coat Styling Archive' },
    { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80', label: 'Boutique Shopping Tour' },
    { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80', label: 'Haute Editorial Streetwear' },
    { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80', label: 'Runway High Fashion' },
    { url: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1600&q=80', label: 'Atelier Tailoring' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#f1f2f4] flex flex-col font-sans select-none overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR (SHOPIFY EXACT REPLICA)                                 */}
      {/* ========================================================================= */}
      <header className="h-14 bg-[#1a1a1a] text-white border-b border-[#2d2d2d] flex items-center justify-between px-3 shrink-0 z-40 select-none shadow-md">
        
        {/* Left tools: Exit button & store indicators */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExit}
            className="p-2 hover:bg-[#2e2e2e] text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Exit theme customizer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <div className="h-4 w-px bg-[#333] mx-1" />

          {/* Theme & Preset Tags */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-white flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-[#3070f0]" />
              Jade Tailor
            </span>
            <span className="bg-[#2a2a2a] text-slate-300 text-[10px] px-1.5 py-0.5 rounded border border-[#3d3d3d] font-medium">
              Live
            </span>
            <span className="hidden md:inline-block text-[11px] text-slate-400">
              • Store default
            </span>
          </div>
        </div>

        {/* Center: Interactive Page Selector Dropdown */}
        <div className="relative" ref={pageDropdownRef}>
          <button
            type="button"
            onClick={() => setIsPageDropdownOpen(!isPageDropdownOpen)}
            className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333333] text-white px-3.5 py-1.5 rounded-lg border border-[#404040] transition-colors cursor-pointer text-xs font-semibold shadow-xs"
          >
            <span>{page.title || (page.isHomepage ? 'Home page' : 'Custom Page')}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isPageDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu Modal */}
          {isPageDropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              
              {/* Search input in page picker */}
              <div className="p-2.5 border-b border-slate-100 bg-slate-50">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search online store pages..."
                    value={pageSearchQuery}
                    onChange={(e) => setPageSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                    autoFocus
                  />
                </div>
              </div>

              {/* Pages & Templates List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                {/* Home page item */}
                <div className="p-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1 tracking-wider">Store Templates</div>
                  {filteredPages.map(p => {
                    const isCurrent = p.id === page.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          onSelectPage(p.id);
                          setIsPageDropdownOpen(false);
                          setPageSearchQuery('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                          isCurrent ? 'bg-[#eef4ff] text-[#005bd3] font-bold' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {p.isHomepage ? (
                            <span className="text-sm">🏠</span>
                          ) : (
                            <FileCode className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="block truncate">{p.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{p.isHomepage ? '/' : `/pages/${p.slug}`}</span>
                          </div>
                        </div>
                        {isCurrent && <Check className="h-4 w-4 text-[#005bd3] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Standard Shopify navigation targets */}
                <div className="p-1 text-slate-650">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1 tracking-wider">Catalog & Store Views</div>
                  <div className="px-3 py-1.5 flex items-center justify-between text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer">
                    <span className="flex items-center gap-2"><span>🛍️</span> Products catalog</span>
                    <span className="text-[10px] text-slate-400">/collections/all</span>
                  </div>
                  <div className="px-3 py-1.5 flex items-center justify-between text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer">
                    <span className="flex items-center gap-2"><span>📰</span> Style Journal</span>
                    <span className="text-[10px] text-slate-400">/blogs</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right actions: Viewport switchers & Save button */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Device Viewport switchers */}
          <div className="hidden sm:flex items-center bg-[#2a2a2a] p-0.5 rounded-lg border border-[#3d3d3d]">
            <button
              type="button"
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewportMode === 'desktop' ? 'bg-[#3b3b3b] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Desktop preview"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewportMode === 'mobile' ? 'bg-[#3b3b3b] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile device preview"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('fullscreen')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewportMode === 'fullscreen' ? 'bg-[#3b3b3b] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full canvas preview"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-[#333] hidden sm:block" />

          {/* Prominent Save Pill Button */}
          <button
            type="button"
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-sm cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-[#005bd3] hover:bg-[#004bb5] text-white shadow-blue-500/20 animate-pulse'
                : 'bg-[#2a2a2a] text-slate-400 cursor-not-allowed border border-[#3d3d3d]'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : hasUnsavedChanges ? (
              <span className="h-2 w-2 rounded-full bg-emerald-400 mr-0.5" />
            ) : (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            )}
            <span>{isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save' : 'Saved'}</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN 3-PANEL LAYOUT CONTAINER (LEFT SIDEBAR | MIDDLE OUTPUT | RIGHT SETTINGS) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex min-h-0 w-full overflow-hidden">
        
        {/* ===================================================================== */}
        {/* PANEL 1: LEFT SIDEBAR (SECTIONS & BLOCKS TREE)                       */}
        {/* ===================================================================== */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-xs z-20">
          
          {/* Left panel header */}
          <div className="p-3.5 px-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 truncate">
              {page.title || 'Page Template'}
            </h2>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {page.sections.length} sections
            </span>
          </div>

          {/* Scrollable list of Header, Template Sections, and Footer */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
            
            {/* GROUP 1: HEADER */}
            <div className="p-3 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-2 mb-1.5">
                Header
              </span>

              {/* Announcement Bar item */}
              <div 
                onClick={() => {
                  canvasContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs text-slate-700 font-medium group transition-colors cursor-pointer"
                title="Scroll to Announcement bar"
              >
                <div className="flex items-center gap-2 truncate">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  <Bell className="h-3.5 w-3.5 text-slate-500" />
                  <span className="truncate">Announcement bar</span>
                </div>
                <Eye className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Header item */}
              <div 
                onClick={() => {
                  canvasContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs text-slate-700 font-medium group transition-colors cursor-pointer"
                title="Scroll to Header"
              >
                <div className="flex items-center gap-2 truncate">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  <Layers className="h-3.5 w-3.5 text-slate-500" />
                  <span className="truncate">Header</span>
                </div>
                <Eye className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* GROUP 2: TEMPLATE (MAIN DRAGGABLE SECTIONS & BLOCKS) */}
            <div className="p-3 space-y-1.5">
              <div className="flex items-center justify-between px-2 mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Template
                </span>
                <span className="text-[9px] text-slate-400">Drag to reorder</span>
              </div>

              {/* Sections Tree List */}
              <div className="space-y-1">
                {page.sections.map((sec, idx) => {
                  const isSelected = selectedSectionId === sec.id;
                  const isExpanded = !!expandedSections[sec.id];
                  const isHidden = sec.settings.hidden === true;
                  const isDragOver = dragOverSectionIndex === idx;

                  // Inner blocks from section settings or synthesize reasonable default blocks
                  const blocks = Array.isArray(sec.settings.blocks) && sec.settings.blocks.length > 0 
                    ? sec.settings.blocks 
                    : [
                        { id: `blk-head-${sec.id}`, type: 'heading', title: sec.settings.title || 'Heading' },
                        ...(sec.settings.buttonText ? [{ id: `blk-btn-${sec.id}`, type: 'buttons', title: sec.settings.buttonText }] : [])
                      ];

                  return (
                    <div 
                      key={sec.id}
                      className={`relative transition-all duration-150 ${isDragOver ? 'border-t-2 border-[#005bd3] pt-1' : ''}`}
                    >
                      {/* Section Item Row */}
                      <div
                        draggable
                        onDragStart={(e) => {
                          setDraggedSectionIndex(idx);
                          e.dataTransfer.setData('text/plain', String(idx));
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOverSectionIndex(idx);
                        }}
                        onDragLeave={() => {
                          if (dragOverSectionIndex === idx) setDragOverSectionIndex(null);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOverSectionIndex(null);
                          if (draggedSectionIndex !== null && draggedSectionIndex !== idx) {
                            moveSection(draggedSectionIndex, idx);
                          }
                          setDraggedSectionIndex(null);
                        }}
                        onClick={() => {
                          setSelectedSectionId(sec.id);
                          setSelectedBlockId(null);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer group ${
                          isSelected
                            ? 'bg-[#005bd3] text-white shadow-xs'
                            : 'hover:bg-slate-100 text-slate-700 bg-white border border-transparent'
                        } ${isHidden ? 'opacity-40 line-through' : ''}`}
                      >
                        {/* Left icon + expand + title */}
                        <div className="flex items-center gap-1.5 truncate pr-1">
                          
                          {/* Block expand chevron */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedSections(prev => ({ ...prev, [sec.id]: !prev[sec.id] }));
                            }}
                            className={`p-0.5 rounded hover:bg-black/10 transition-transform ${isSelected ? 'text-white' : 'text-slate-400'}`}
                          >
                            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                          </button>

                          {/* Section icon */}
                          <div className={`p-1 rounded shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                            {getSectionIcon(sec.type)}
                          </div>

                          {/* Section label */}
                          <span className="truncate">{getSectionLabel(sec.type)}</span>
                        </div>

                        {/* Right tools: Eye visibility toggle + Drag handle */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => toggleSectionVisibility(sec.id, e)}
                            className={`p-1 rounded hover:bg-black/10 transition-opacity ${
                              isSelected ? 'text-white' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                            }`}
                            title={isHidden ? "Show section" : "Hide section"}
                          >
                            {isHidden ? <EyeOff className="h-3.5 w-3.5 text-rose-400" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>

                          <div 
                            className={`p-1 cursor-grab active:cursor-grabbing ${
                              isSelected ? 'text-white' : 'text-slate-300 group-hover:text-slate-500'
                            }`}
                            title="Drag to reorder section"
                          >
                            <GripVertical className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Nested Blocks Sub-items (Shopify Subtree) */}
                      {isExpanded && (
                        <div className="pl-6 pr-1 pt-1 pb-1 space-y-0.5 border-l-2 border-slate-200 ml-3.5 mt-0.5">
                          {/* Add block button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSectionId(sec.id);
                              const newBlock = {
                                id: `blk-${Date.now()}`,
                                type: 'text',
                                title: 'New Text Block'
                              };
                              const currentBlocks = sec.settings.blocks || [];
                              updateSectionSettings(sec.id, {
                                blocks: [...currentBlocks, newBlock]
                              });
                            }}
                            className="w-full flex items-center gap-1.5 p-1 px-2 text-[11px] font-semibold text-[#005bd3] hover:bg-[#eef4ff] rounded transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add block</span>
                          </button>

                          {/* Render child blocks */}
                          {blocks.map((blk: any, bIdx: number) => {
                            const isBlockSelected = selectedSectionId === sec.id && selectedBlockId === blk.id;
                            return (
                              <div
                                key={blk.id || bIdx}
                                onClick={() => {
                                  setSelectedSectionId(sec.id);
                                  setSelectedBlockId(blk.id);
                                }}
                                className={`flex items-center justify-between p-1.5 px-2 rounded text-[11px] font-medium transition-colors cursor-pointer group/block ${
                                  isBlockSelected
                                    ? 'bg-[#eef4ff] text-[#005bd3] font-bold'
                                    : 'hover:bg-slate-100 text-slate-600'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="font-serif font-black text-slate-400 text-xs">T</span>
                                  <span className="truncate">{blk.title || blk.type || 'Block item'}</span>
                                </div>
                                <GripVertical className="h-3 w-3 text-slate-300 opacity-0 group-hover/block:opacity-100" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Section Button with Dropdown (Shopify Feature from screenshot) */}
              <div className="pt-2 relative" ref={addSectionDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsAddSectionOpen(!isAddSectionOpen)}
                  className="w-full py-2 px-3 border border-dashed border-slate-300 hover:border-[#005bd3] hover:bg-[#f0f6ff] text-[#005bd3] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add section</span>
                </button>

                {/* Add Section Dropdown Popover */}
                {isAddSectionOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-76 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Add Section</span>
                      <button onClick={() => setIsAddSectionOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Search sections */}
                    <div className="p-2 border-b border-slate-100">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search sections..."
                          value={addSectionQuery}
                          onChange={(e) => setAddSectionQuery(e.target.value)}
                          className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005bd3]"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Templates list */}
                    <div className="max-h-64 overflow-y-auto p-1.5 divide-y divide-slate-100 text-xs">
                      {AVAILABLE_SECTION_TEMPLATES.filter(item =>
                        item.label.toLowerCase().includes(addSectionQuery.toLowerCase()) ||
                        item.desc.toLowerCase().includes(addSectionQuery.toLowerCase()) ||
                        item.type.toLowerCase().includes(addSectionQuery.toLowerCase())
                      ).map(t => (
                        <button
                          key={t.type}
                          type="button"
                          onClick={() => handleAddNewSection(t.type)}
                          className="w-full text-left p-2 hover:bg-[#eef4ff] rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer group"
                        >
                          <div className="p-1 rounded bg-slate-100 group-hover:bg-white text-slate-600 group-hover:text-[#005bd3] transition-colors shrink-0">
                            {getSectionIcon(t.type)}
                          </div>
                          <div className="truncate">
                            <span className="block font-bold text-slate-800 group-hover:text-[#005bd3] truncate">{t.label}</span>
                            <span className="block text-[10px] text-slate-400 line-clamp-1">{t.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* GROUP 3: FOOTER */}
            <div className="p-3 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-2 mb-1.5">
                Footer
              </span>

              {/* Add section in footer */}
              <button
                type="button"
                onClick={() => handleAddNewSection('Trust badges')}
                className="w-full flex items-center gap-1.5 p-1.5 px-2 text-[11px] font-semibold text-[#005bd3] hover:bg-[#eef4ff] rounded-lg transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Add section</span>
              </button>

              {/* Footer item */}
              <div 
                onClick={() => {
                  if (canvasContainerRef.current) {
                    canvasContainerRef.current.scrollTo({ 
                      top: canvasContainerRef.current.scrollHeight, 
                      behavior: 'smooth' 
                    });
                  }
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs text-slate-700 font-medium group transition-colors cursor-pointer"
                title="Scroll to Footer"
              >
                <div className="flex items-center gap-2 truncate">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  <LayoutGrid className="h-3.5 w-3.5 text-slate-500" />
                  <span className="truncate">Footer</span>
                </div>
                <Eye className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

          </div>
        </aside>

        {/* ===================================================================== */}
        {/* PANEL 2: MIDDLE CANVAS (LIVE INTERACTIVE SECTION OUTPUT)              */}
        {/* ===================================================================== */}
        <main 
          ref={canvasContainerRef}
          className="flex-1 h-full min-h-0 overflow-y-auto overflow-x-hidden bg-[#f1f2f4] p-4 sm:p-6 select-auto relative scroll-smooth focus:outline-none"
          tabIndex={0}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#94a3b8 #e2e8f0',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Quick scroll controls floating inside canvas */}
          <div className="fixed bottom-6 right-90 z-40 hidden md:flex flex-col gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => canvasContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 bg-white text-slate-700 hover:text-black hover:bg-slate-50 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-105 cursor-pointer"
              title="Scroll to top of canvas"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (canvasContainerRef.current) {
                  canvasContainerRef.current.scrollTo({ 
                    top: canvasContainerRef.current.scrollHeight, 
                    behavior: 'smooth' 
                  });
                }
              }}
              className="p-2 bg-white text-slate-700 hover:text-black hover:bg-slate-50 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-105 cursor-pointer"
              title="Scroll to bottom of canvas"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          
          {/* Viewport frame wrapper */}
          <div className={`transition-all duration-300 w-full mx-auto ${
            viewportMode === 'mobile' 
              ? 'max-w-[390px] my-4 bg-white rounded-[40px] shadow-2xl border-[10px] border-slate-900 ring-1 ring-slate-800' 
              : viewportMode === 'fullscreen'
              ? 'max-w-none'
              : 'max-w-5xl shadow-sm rounded-xl'
          } bg-white min-h-[85vh] mb-24`}>

            {/* Browser frame mock for desktop */}
            {viewportMode === 'desktop' && (
              <div className="bg-[#e5e7eb] px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white px-6 py-1 rounded-md text-[11px] font-mono text-slate-600 border border-slate-250 truncate max-w-sm">
                  jadetailor.com{page.isHomepage ? '' : `/pages/${page.slug}`}
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </div>
            )}

            {/* Mobile notch simulator */}
            {viewportMode === 'mobile' && (
              <div className="h-6 bg-slate-900 flex items-center justify-center">
                <div className="w-24 h-3 bg-slate-950 rounded-b-xl" />
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* STOREFRONT PREVIEW HEADER                                       */}
            {/* --------------------------------------------------------------- */}
            <div className="border-b border-slate-200 bg-white">
              {/* Top announcement */}
              <div className="bg-[#111111] text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
                <span>COMPLIMENTARY CONCIERGE STYLING CONSULTATION ON ORDERS OVER £250</span>
              </div>
              
              {/* Header logo & nav */}
              <div className="py-4 px-6 flex items-center justify-between">
                <div className="font-serif text-lg font-bold tracking-widest text-[#111111]">
                  {layoutSettings?.headerLogoText || 'JADE TAILOR'}
                </div>
                <div className="hidden sm:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-slate-700">
                  <span className="hover:text-black cursor-pointer">HOME</span>
                  <span className="hover:text-black cursor-pointer">SHOP</span>
                  <span className="hover:text-black cursor-pointer">MY SERVICES</span>
                  <span className="hover:text-black cursor-pointer">STYLE JOURNAL</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Search className="h-4 w-4" />
                  <ShoppingBag className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* DYNAMIC SECTIONS CANVAS                                         */}
            {/* --------------------------------------------------------------- */}
            <div className="divide-y divide-transparent">
              {page.sections.length === 0 ? (
                <div className="py-32 text-center text-slate-400 space-y-3">
                  <ImageIcon className="h-12 w-12 mx-auto text-slate-300 stroke-[1.5]" />
                  <p className="text-sm font-semibold">Your template has no sections yet</p>
                  <button
                    type="button"
                    onClick={() => setIsAddSectionOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#005bd3] text-white rounded-lg text-xs font-bold shadow-sm"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add your first section
                  </button>
                </div>
              ) : (
                page.sections.map((sec, sIdx) => {
                  const isSelected = selectedSectionId === sec.id;
                  const isHidden = sec.settings.hidden === true;

                  if (isHidden) return null; // Section is toggled hidden

                  const settings = sec.settings || {};
                  const bg = settings.backgroundColor || '#FFFFFF';
                  const titleColor = settings.headingColor || '#111827';
                  const textColor = settings.textColor || '#4B5563';
                  const alignment = (settings.alignment || 'Center').toLowerCase();
                  const alignClass = alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center';

                  return (
                    <div
                      key={sec.id}
                      ref={(el) => { sectionRefs.current[sec.id] = el; }}
                      id={`canvas-section-${sec.id}`}
                      onClick={() => {
                        setSelectedSectionId(sec.id);
                        setSelectedBlockId(null);
                      }}
                      className={`relative group/sec transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? 'ring-2 ring-[#005bd3] ring-offset-2 z-10' 
                          : 'hover:outline hover:outline-2 hover:outline-dashed hover:outline-slate-300'
                      }`}
                      style={{ backgroundColor: bg }}
                    >
                      {/* ======================================================= */}
                      {/* SHOPIFY SELECTED BLUE TAG BADGE (FROM USER SCREENSHOT)  */}
                      {/* ======================================================= */}
                      {isSelected && (
                        <div className="absolute top-0 left-0 -translate-y-full z-30 flex items-center">
                          <span className="bg-[#005bd3] text-white text-[11px] font-bold px-2.5 py-1 rounded-t-md shadow-xs flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            {getSectionLabel(sec.type)}
                          </span>
                        </div>
                      )}

                      {/* ======================================================= */}
                      {/* SHOPIFY FLOATING QUICK ACTIONS TOOLBAR (SCREENSHOT)      */}
                      {/* ======================================================= */}
                      {isSelected && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 bg-[#1a1a1a]/95 backdrop-blur-md text-white p-1 px-2 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-1.5 text-xs animate-in fade-in slide-in-from-bottom-2">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); duplicateSection(sec.id); }}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                            title="Duplicate section"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(sec.id, e); }}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                            title="Hide section"
                          >
                            <EyeOff className="h-3.5 w-3.5" />
                          </button>
                          <div className="h-3 w-px bg-slate-700 mx-0.5" />
                          <button
                            type="button"
                            disabled={sIdx === 0}
                            onClick={(e) => { e.stopPropagation(); moveSection(sIdx, sIdx - 1); }}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white disabled:opacity-30"
                            title="Move up"
                          >
                            <MoveUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={sIdx === page.sections.length - 1}
                            onClick={(e) => { e.stopPropagation(); moveSection(sIdx, sIdx + 1); }}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white disabled:opacity-30"
                            title="Move down"
                          >
                            <MoveDown className="h-3.5 w-3.5" />
                          </button>
                          <div className="h-3 w-px bg-slate-700 mx-0.5" />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeSection(sec.id); }}
                            className="p-1.5 hover:bg-rose-900/60 rounded-lg text-rose-400 hover:text-rose-300 transition-colors"
                            title="Delete section"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      {/* ======================================================= */}
                      {/* SECTION OUTPUT RENDERING (LIVE VISUALS)                  */}
                      {/* ======================================================= */}
                      <div className="py-12 px-6">
                        
                        {/* 1. IMAGE BANNER / HERO BANNER */}
                        {(sec.type === 'Image banner' || sec.type === 'Hero banner') && (
                          <div 
                            className={`relative rounded-2xl overflow-hidden min-h-[420px] flex items-center justify-center p-8 bg-cover bg-center ${alignClass}`}
                            style={{ 
                              backgroundImage: `url(${settings.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80'})` 
                            }}
                          >
                            {/* Dark gradient overlay with live opacity control */}
                            <div 
                              className="absolute inset-0 bg-black" 
                              style={{ opacity: (settings.overlayOpacity ?? 40) / 100 }} 
                            />
                            
                            {/* Banner Content Card */}
                            <div className={`relative z-10 max-w-xl mx-auto space-y-4 text-white ${
                              settings.showContainer ? 'bg-[#111111]/85 backdrop-blur-md p-8 rounded-2xl border border-white/10' : ''
                            }`}>
                              {settings.subtitle && (
                                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#d4af37] block">
                                  {settings.subtitle}
                                </span>
                              )}
                              <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-white leading-tight">
                                {settings.title || 'Browse our latest products'}
                              </h2>
                              {settings.description && (
                                <p className="text-sm font-light text-slate-200 leading-relaxed">
                                  {settings.description}
                                </p>
                              )}
                              {settings.buttonText && (
                                <div className="pt-2">
                                  <span className="inline-block px-6 py-2.5 bg-white text-slate-900 font-bold text-xs uppercase tracking-wider rounded-md hover:bg-slate-100 transition-colors shadow-md">
                                    {settings.buttonText}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 2. FEATURED COLLECTION */}
                        {sec.type === 'Featured collection' && (
                          <div className={`space-y-6 ${alignClass}`}>
                            <div className="space-y-1">
                              <h2 className="text-2xl font-serif font-bold" style={{ color: titleColor }}>
                                {settings.title || 'Featured Collection'}
                              </h2>
                              <p className="text-xs" style={{ color: textColor }}>
                                {settings.description || 'Explore our seasonal ready-to-wear curations.'}
                              </p>
                            </div>

                            {/* Live product cards grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                              {products.slice(0, settings.itemsCount || 4).map((p) => (
                                <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white text-left group/card shadow-2xs">
                                  <div className="aspect-3/4 bg-slate-100 overflow-hidden relative">
                                    <img 
                                      src={p.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80'} 
                                      alt={p.title}
                                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                                    />
                                    <span className="absolute top-2 left-2 bg-[#111] text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                                      New
                                    </span>
                                  </div>
                                  <div className="p-3 space-y-1">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{p.category || 'Atelier'}</span>
                                    <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                                    <span className="text-xs font-black text-slate-900 block">£{p.price?.toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 3. COLLECTION LIST */}
                        {sec.type === 'Collection list' && (
                          <div className={`space-y-6 ${alignClass}`}>
                            <div className="space-y-1">
                              <h2 className="text-2xl font-serif font-bold" style={{ color: titleColor }}>
                                {settings.title || 'Collections'}
                              </h2>
                              <p className="text-xs" style={{ color: textColor }}>
                                {settings.description || 'Handcrafted wardrobe capsules.'}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {collections.slice(0, 3).map((col) => (
                                <div key={col.id} className="relative rounded-xl overflow-hidden aspect-4/3 bg-slate-900 group/col shadow-sm">
                                  <img 
                                    src={col.image || 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80'} 
                                    alt={col.title}
                                    className="w-full h-full object-cover opacity-75 group-hover/col:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                                    <span className="text-white font-serif font-bold text-sm tracking-wide">{col.title}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 4. IMAGE WITH TEXT */}
                        {sec.type === 'Image with text' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 shadow-md">
                              <img 
                                src={settings.imageUrl || 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80'} 
                                alt="Section visual"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className={`space-y-4 ${alignClass}`}>
                              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#d4af37] block">
                                {settings.subtitle || 'CURATED ELEGANCE'}
                              </span>
                              <h2 className="text-2xl sm:text-3xl font-serif font-bold" style={{ color: titleColor }}>
                                {settings.title || 'Image with text'}
                              </h2>
                              <p className="text-sm font-light leading-relaxed" style={{ color: textColor }}>
                                {settings.description || 'Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or even provide a review.'}
                              </p>
                              {settings.buttonText && (
                                <button className="px-5 py-2.5 bg-[#111111] text-white font-bold text-xs uppercase tracking-wider rounded-md hover:bg-black transition-colors">
                                  {settings.buttonText}
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 5. DEFAULT FALLBACK FOR OTHER SECTION TYPES */}
                        {!['Image banner', 'Hero banner', 'Featured collection', 'Collection list', 'Image with text'].includes(sec.type) && (
                          <div className={`py-6 space-y-3 ${alignClass}`}>
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d4af37] block">
                              {settings.subtitle || sec.type}
                            </span>
                            <h2 className="text-2xl font-serif font-bold" style={{ color: titleColor }}>
                              {settings.title || getSectionLabel(sec.type)}
                            </h2>
                            <p className="text-xs max-w-lg mx-auto leading-relaxed" style={{ color: textColor }}>
                              {settings.description || 'Live interactive storefront module. Customize all parameters in the settings panel.'}
                            </p>
                            {settings.buttonText && (
                              <button className="px-5 py-2 bg-[#111] text-white text-xs font-bold uppercase rounded">
                                {settings.buttonText}
                              </button>
                            )}
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* --------------------------------------------------------------- */}
            {/* STOREFRONT PREVIEW FOOTER                                       */}
            {/* --------------------------------------------------------------- */}
            <div className="border-t border-slate-200 bg-[#111111] text-white p-8 space-y-6 text-center text-xs font-light">
              <div className="font-serif text-base tracking-widest text-[#d4af37]">
                {layoutSettings?.footerLogoText || 'JADE TAILOR'}
              </div>
              <p className="max-w-md mx-auto text-slate-400 text-[11px] leading-relaxed">
                {layoutSettings?.footerLogoDescription || 'Luxury personal styling, bespoke capsule curations, and private boutique shopping tours.'}
              </p>
              <div className="text-[10px] text-slate-500">
                © {new Date().getFullYear()} {layoutSettings?.storeName || 'Jade Tailor Store'}. Powered by Atelier Engine.
              </div>
            </div>

          </div>
        </main>

        {/* ===================================================================== */}
        {/* PANEL 3: RIGHT SIDEBAR (SECTION & BLOCK SETTINGS REPLICA)             */}
        {/* ===================================================================== */}
        <aside className="w-84 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-xs z-20">
          
          {selectedSection ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Top Settings Header */}
              <div className="p-3.5 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <div className="p-1 rounded bg-slate-100 text-slate-700 shrink-0">
                    {getSectionIcon(selectedSection.type)}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {getSectionLabel(selectedSection.type)}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => duplicateSection(selectedSection.id)}
                    className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-800 transition-colors"
                    title="Duplicate section"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(selectedSection.id)}
                    className="p-1.5 hover:bg-rose-50 rounded-md text-slate-500 hover:text-rose-600 transition-colors"
                    title="Delete section"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSectionId(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                    title="Close settings"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Settings Controls (exact Shopify controls from screenshot) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs divide-y divide-slate-100 scrollbar-thin">
                
                {/* 1. MEDIA / IMAGE PICKER 1 & 2 */}
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">Image 1</label>
                    <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50 space-y-2">
                      {selectedSection.settings.imageUrl ? (
                        <div className="relative rounded-lg overflow-hidden aspect-16/9 bg-slate-200 group">
                          <img 
                            src={selectedSection.settings.imageUrl} 
                            alt="Selected" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => updateSectionSettings(selectedSection.id, { imageUrl: '' })}
                            className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black text-white rounded-md text-[10px] font-bold transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-slate-250 rounded-lg p-4 text-center text-slate-400">
                          <ImageIcon className="h-6 w-6 mx-auto mb-1 text-slate-300" />
                          <span className="text-[11px] block">No image selected</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <label className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-250 rounded-lg text-center font-bold text-slate-700 text-xs cursor-pointer shadow-2xs transition-colors">
                          Select
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = async () => {
                                if (typeof reader.result === 'string') {
                                  try {
                                    const res = await fetch('/api/upload', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ data: reader.result })
                                    });
                                    if (res.ok) {
                                      const data = await res.json();
                                      updateSectionSettings(selectedSection.id, { imageUrl: data.url });
                                    }
                                  } catch (_) {
                                    updateSectionSettings(selectedSection.id, { imageUrl: reader.result });
                                  }
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowStockImageModal(selectedSection.id)}
                          className="py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-250 rounded-lg text-slate-600 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Explore free images
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Optional Image 2 */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">Image 2 (Optional)</label>
                    <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowStockImageModal(selectedSection.id)}
                          className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-250 rounded-lg text-center font-bold text-slate-700 text-xs shadow-2xs transition-colors"
                        >
                          Select Image 2
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. OVERLAY OPACITY SLIDER (FROM USER SCREENSHOT) */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700">Overlay opacity</label>
                    <span className="text-[11px] font-mono font-bold text-slate-600">
                      {selectedSection.settings.overlayOpacity ?? 40}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedSection.settings.overlayOpacity ?? 40}
                    onChange={(e) => updateSectionSettings(selectedSection.id, { overlayOpacity: Number(e.target.value) })}
                    className="w-full accent-[#005bd3] cursor-pointer"
                  />
                </div>

                {/* 3. HEIGHT & ANIMATION DROPDOWNS (FROM SCREENSHOT) */}
                <div className="pt-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Height</label>
                    <select
                      value={selectedSection.settings.height || 'Large'}
                      onChange={(e) => updateSectionSettings(selectedSection.id, { height: e.target.value })}
                      className="w-full p-2 border border-slate-250 rounded-lg bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#005bd3] focus:outline-none"
                    >
                      <option value="Adapt to image">Adapt to image</option>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Animation</label>
                    <select
                      value={selectedSection.settings.animation || 'None'}
                      onChange={(e) => updateSectionSettings(selectedSection.id, { animation: e.target.value })}
                      className="w-full p-2 border border-slate-250 rounded-lg bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#005bd3] focus:outline-none"
                    >
                      <option value="None">None</option>
                      <option value="Fade in">Fade in</option>
                      <option value="Ambient movement">Ambient movement</option>
                      <option value="Zoom in">Zoom in</option>
                    </select>
                  </div>
                </div>

                {/* 4. CONTENT ALIGNMENT & POSITION (FROM SCREENSHOT) */}
                <div className="pt-4 space-y-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Content</span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Position</label>
                    <select
                      value={selectedSection.settings.position || 'Bottom Center'}
                      onChange={(e) => updateSectionSettings(selectedSection.id, { position: e.target.value })}
                      className="w-full p-2 border border-slate-250 rounded-lg bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#005bd3] focus:outline-none"
                    >
                      <option value="Top Left">Top Left</option>
                      <option value="Top Center">Top Center</option>
                      <option value="Top Right">Top Right</option>
                      <option value="Middle Left">Middle Left</option>
                      <option value="Middle Center">Middle Center</option>
                      <option value="Middle Right">Middle Right</option>
                      <option value="Bottom Left">Bottom Left</option>
                      <option value="Bottom Center">Bottom Center</option>
                      <option value="Bottom Right">Bottom Right</option>
                    </select>
                  </div>

                  {/* Alignment Segmented Buttons */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Alignment</label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-250">
                      {['Left', 'Center', 'Right'].map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => updateSectionSettings(selectedSection.id, { alignment: align })}
                          className={`py-1 text-xs font-semibold rounded-md transition-colors ${
                            (selectedSection.settings.alignment || 'Center') === align
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Container toggle */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="text-[11px] font-bold text-slate-700 cursor-pointer">Show container</label>
                    <input
                      type="checkbox"
                      checked={!!selectedSection.settings.showContainer}
                      onChange={(e) => updateSectionSettings(selectedSection.id, { showContainer: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#005bd3] cursor-pointer"
                    />
                  </div>

                  {/* Color Scheme Picker */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Color scheme</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { bg: '#FFFFFF', text: '#111827', label: 'Scheme 1' },
                        { bg: '#F9FAFB', text: '#1F2937', label: 'Scheme 2' },
                        { bg: '#111827', text: '#F9FAFB', label: 'Scheme 3' },
                        { bg: '#05164E', text: '#FFFFFF', label: 'Accent 1' },
                        { bg: '#1E1B4B', text: '#E0E7FF', label: 'Accent 2' }
                      ].map((scheme, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => updateSectionSettings(selectedSection.id, {
                            backgroundColor: scheme.bg,
                            headingColor: scheme.text,
                            textColor: scheme.text === '#FFFFFF' ? '#E5E7EB' : '#4B5563'
                          })}
                          className={`h-9 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-transform hover:scale-105 ${
                            selectedSection.settings.backgroundColor === scheme.bg ? 'border-[#005bd3] ring-2 ring-blue-300' : 'border-slate-250'
                          }`}
                          style={{ backgroundColor: scheme.bg, color: scheme.text }}
                        >
                          Aa
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. TEXT CONTENT & BUTTON CONTROLS */}
                <div className="pt-4 space-y-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Typography & Links</span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Heading</label>
                    <input
                      type="text"
                      value={selectedSection.settings.title || ''}
                      onChange={(e) => updateSectionSettings(selectedSection.id, { title: e.target.value })}
                      placeholder="e.g. Browse our latest products"
                      className="w-full p-2 border border-slate-250 rounded-lg text-slate-800 font-medium text-xs focus:ring-2 focus:ring-[#005bd3] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Subheading</label>
                    <input
                      type="text"
                      value={selectedSection.settings.subtitle || ''}
                      onChange={(e) => updateSectionSettings(selectedSection.id, { subtitle: e.target.value })}
                      placeholder="e.g. Spring 2026 Collection"
                      className="w-full p-2 border border-slate-250 rounded-lg text-slate-800 font-medium text-xs focus:ring-2 focus:ring-[#005bd3] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Description Text</label>
                    <textarea
                      rows={3}
                      value={selectedSection.settings.description || ''}
                      onChange={(e) => updateSectionSettings(selectedSection.id, { description: e.target.value })}
                      placeholder="Pair text with an image to focus on your chosen product, collection, or blog post."
                      className="w-full p-2 border border-slate-250 rounded-lg text-slate-800 font-medium text-xs focus:ring-2 focus:ring-[#005bd3] focus:outline-none"
                    />
                  </div>

                  {/* Button label & link */}
                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Button label</label>
                      <input
                        type="text"
                        value={selectedSection.settings.buttonText || ''}
                        onChange={(e) => updateSectionSettings(selectedSection.id, { buttonText: e.target.value })}
                        placeholder="e.g. Shop all"
                        className="w-full p-2 border border-slate-250 rounded-lg text-slate-800 font-medium text-xs focus:ring-2 focus:ring-[#005bd3] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Button link</label>
                      <input
                        type="text"
                        value={selectedSection.settings.buttonLink || ''}
                        onChange={(e) => updateSectionSettings(selectedSection.id, { buttonLink: e.target.value })}
                        placeholder="/collections/all"
                        className="w-full p-2 border border-slate-250 rounded-lg text-slate-800 font-medium text-xs focus:ring-2 focus:ring-[#005bd3] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. MOBILE LAYOUT CONTROLS (FROM SCREENSHOT) */}
                <div className="pt-4 space-y-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Mobile layout</span>

                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 cursor-pointer">Stack images</label>
                    <input
                      type="checkbox"
                      checked={!!selectedSection.settings.stackImages}
                      onChange={(e) => updateSectionSettings(selectedSection.id, { stackImages: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#005bd3] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Alignment</label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-250">
                      {['Left', 'Center', 'Right'].map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => updateSectionSettings(selectedSection.id, { mobileAlignment: align })}
                          className={`py-1 text-xs font-semibold rounded-md transition-colors ${
                            (selectedSection.settings.mobileAlignment || 'Center') === align
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 7. REMOVE SECTION (BOTTOM ACTION) */}
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => removeSection(selectedSection.id)}
                    className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-650 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete section</span>
                  </button>
                </div>

              </div>
            </div>
          ) : (
            /* If no section is selected: General Page settings */
            <div className="p-4 space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Page Settings</h3>
                <p className="text-slate-400 text-[11px]">Select a section on the left or in the canvas to edit its properties.</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={page.title}
                  onChange={(e) => {
                    onUpdatePage({ ...page, title: e.target.value });
                    if (onDirtyChange) onDirtyChange(true);
                  }}
                  className="w-full p-2 border border-slate-250 rounded-lg text-slate-800 font-medium text-xs focus:ring-2 focus:ring-[#005bd3] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Route URL Slug</label>
                <input
                  type="text"
                  value={page.slug}
                  disabled={page.isHomepage}
                  onChange={(e) => {
                    onUpdatePage({ ...page, slug: e.target.value });
                    if (onDirtyChange) onDirtyChange(true);
                  }}
                  className="w-full p-2 border border-slate-250 rounded-lg text-slate-800 font-medium text-xs disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Visibility</label>
                <select
                  value={page.visibility}
                  onChange={(e) => {
                    onUpdatePage({ ...page, visibility: e.target.value as any });
                    if (onDirtyChange) onDirtyChange(true);
                  }}
                  className="w-full p-2 border border-slate-250 rounded-lg text-slate-800 font-medium text-xs"
                >
                  <option value="Visible">Visible</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
            </div>
          )}

        </aside>

      </div>

      {/* ========================================================================= */}
      {/* FREE STOCK PHOTO EXPLORER MODAL                                           */}
      {/* ========================================================================= */}
      {showStockImageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Explore Free Images</h3>
                <p className="text-slate-400 text-xs">High-resolution editorial and luxury fashion photography.</p>
              </div>
              <button 
                onClick={() => setShowStockImageModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
              {stockImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (showStockImageModal) {
                      updateSectionSettings(showStockImageModal, { imageUrl: img.url });
                    }
                    setShowStockImageModal(null);
                  }}
                  className="group rounded-xl overflow-hidden aspect-4/3 relative bg-slate-100 cursor-pointer border hover:border-[#005bd3] transition-all"
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-white text-[10px] font-bold truncate">{img.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowStockImageModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
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
