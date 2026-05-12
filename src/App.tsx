/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, ReactNode, useRef, useEffect } from 'react';
import SignaturePad from 'signature_pad';
import { 
  Bell, 
  Settings, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Search, 
  ArrowLeft, 
  Image as ImageIcon,
  Home,
  LayoutDashboard,
  Box,
  Menu as MenuIcon,
  Monitor,
  CheckCircle2,
  MoreVertical,
  X,
  Triangle,
  Calendar,
  ClipboardList,
  Edit2,
  Pencil,
  Trash2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { View, Estimate, EstimateStatus, Item, CompanyData } from './types';

export default function App() {
  useEffect(() => {
    console.log("App Component Mounted. Current path:", window.location.pathname);
  }, []);

  const [currentView, setCurrentView] = useState<View>('MENU');
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: 'Jawad Aluminium and Glass Works',
    email: 'jawadaluminium786@gmail.com',
    phone: '03235528196',
    address: 'Shop#1 Habib Plaza Near River Bridge Main Double Road Phase 5 Ghouri Town Islamabad',
    logo: '',
    terms: 'Thanks for doing business with us! Advance payment 90% After completion 10% = Note This Quotation is valid for only two days'
  });
  const [estimates, setEstimates] = useState<Estimate[]>([
    {
      id: '1',
      refNo: 1,
      date: '12 May, 26',
      customerName: 'maaad',
      items: [
        { id: 'i1', name: 'Glass', quantity: 36, unit: 'SQR FEET', rate: 200, tax: 0, discount: 0 }
      ],
      status: EstimateStatus.OPEN,
      discountValue: 0,
      discountType: 'percentage',
      taxType: 'None',
      description: '',
      totalAmount: 7200,
      balance: 7200
    }
  ]);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [selectedEstimateForView, setSelectedEstimateForView] = useState<Estimate | null>(null);
  const [selectedEstimateForSale, setSelectedEstimateForSale] = useState<Estimate | null>(null);

  // Helper to handle navigation
  const navigate = (view: View) => setCurrentView(view);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentView === 'MENU' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MenuView 
              onNavigateToEstimates={() => navigate('ESTIMATE_LIST')} 
              onNavigateToSettings={() => navigate('PROFILE_EDIT')}
            />
          </motion.div>
        )}
        {currentView === 'ESTIMATE_LIST' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <EstimateListView 
              estimates={estimates} 
              onBack={() => navigate('MENU')} 
              onAdd={() => {
                setEditingEstimate(null);
                navigate('ESTIMATE_FORM');
              }}
              onEdit={(est) => {
                setEditingEstimate(est);
                navigate('ESTIMATE_FORM');
              }}
              onConvert={(est) => {
                setSelectedEstimateForSale(est);
                navigate('SALE_FORM');
              }}
              onViewInvoice={(est) => {
                setSelectedEstimateForView(est);
                navigate('INVOICE_VIEW');
              }}
            />
          </motion.div>
        )}
        {currentView === 'SALE_FORM' && selectedEstimateForSale && (
          <motion.div 
            key={`sale-${selectedEstimateForSale.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SaleFormView 
              initialData={selectedEstimateForSale}
              onBack={() => navigate('ESTIMATE_LIST')}
              onSave={(est, stay) => {
                const exists = estimates.find(e => e.id === est.id);
                if (exists) {
                  setEstimates(prev => prev.map(e => e.id === est.id ? est : e));
                } else {
                  setEstimates(prev => [...prev, est]);
                }

                if (stay) {
                  const newId = Math.random().toString(36).substr(2, 9);
                  const nextRef = estimates.length + 2;
                  setSelectedEstimateForSale({
                    id: newId,
                    refNo: nextRef,
                    date: new Date().toLocaleDateString('en-GB'),
                    customerName: '',
                    items: [],
                    status: EstimateStatus.OPEN,
                    totalAmount: 0,
                    balance: 0,
                    description: '',
                    isSale: true,
                    discountValue: 0,
                    discountType: 'percentage',
                    taxType: 'None'
                  });
                } else {
                  navigate('ESTIMATE_LIST');
                }
              }}
            />
          </motion.div>
        )}
        {currentView === 'ESTIMATE_FORM' && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <EstimateFormView 
              initialData={editingEstimate}
              onBack={() => navigate('ESTIMATE_LIST')}
              onSave={(est) => {
                if (editingEstimate) {
                  setEstimates(prev => prev.map(e => e.id === est.id ? est : e));
                } else {
                  setEstimates(prev => [...prev, est]);
                }
                navigate('ESTIMATE_LIST');
              }}
            />
          </motion.div>
        )}
        {currentView === 'INVOICE_VIEW' && selectedEstimateForView && (
          <motion.div 
            key="invoice"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <InvoiceView 
              estimate={selectedEstimateForView} 
              onBack={() => navigate('ESTIMATE_LIST')} 
              companyData={companyData}
              onUpdateCompany={(data) => setCompanyData(data)}
            />
          </motion.div>
        )}
        {currentView === 'PROFILE_EDIT' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ProfileEditView 
              companyData={companyData}
              onBack={() => navigate('MENU')}
              onSave={(data) => {
                setCompanyData(data);
                navigate('MENU');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav currentView={currentView} onNavigate={navigate} />
    </div>
  );
}

// Layout components
const BottomNav = ({ currentView, onNavigate }: { currentView: View, onNavigate: (view: View) => void }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center py-2 px-1 z-50">
    <button onClick={() => onNavigate('MENU')} className={`flex flex-col items-center gap-1 text-[10px] ${currentView === 'MENU' ? 'text-blue-600' : 'text-slate-500'} hover:text-blue-600 transition-colors`}>
      <Home size={20} />
      <span>HOME</span>
    </button>
    <button className="flex flex-col items-center gap-1 text-[10px] text-slate-500 hover:text-blue-600 transition-colors">
      <LayoutDashboard size={20} />
      <span>DASHBOARD</span>
    </button>
    <button className="flex flex-col items-center gap-1 text-[10px] text-slate-500 hover:text-blue-600 transition-colors">
      <Box size={20} />
      <span>ITEMS</span>
    </button>
    <button onClick={() => onNavigate('MENU')} className={`flex flex-col items-center gap-1 text-[10px] ${currentView === 'MENU' ? 'text-blue-600' : 'text-slate-500'}`}>
      <MenuIcon size={20} />
      <span>MENU</span>
    </button>
    <button className="flex flex-col items-center gap-1 text-[10px] text-slate-500 hover:text-blue-600 transition-colors">
      <div className="relative">
        <Monitor size={20} />
        <div className="absolute -top-1 -right-1 flex gap-0.5">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        </div>
      </div>
      <span>GET DESKTOP</span>
    </button>
  </div>
);

// --- VIEW COMPONENTS ---

function MenuView({ onNavigateToEstimates, onNavigateToSettings }: { onNavigateToEstimates: () => void, onNavigateToSettings?: () => void }) {
  const [saleExpanded, setSaleExpanded] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-slate-100"
    >
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center p-1 shadow-sm">
            {/* Logo */}
            <span className="text-white font-bold text-lg">AZ</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 uppercase">AluGlass CRM</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <div className="relative p-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">
            <Bell size={22} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border border-white" />
          </div>
          <div 
            onClick={() => onNavigateToSettings?.()}
            className="relative p-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
          >
            <Settings size={22} />
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex items-center justify-between relative overflow-hidden shadow-lg">
          <div className="flex-1 pr-6 z-10">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Professional Suite</p>
            <h3 className="text-white font-bold text-lg mb-4 leading-tight">Join 10,000+ Store Owners Using Our Desktop App</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2.5 px-6 rounded-md uppercase tracking-wider transition-all shadow-sm">
              Try for Free
            </button>
          </div>
          <div className="w-24 h-24 flex items-center justify-center relative scale-110">
            <div className="w-20 h-16 bg-slate-800 border border-slate-700 rounded shadow-2xl flex items-center justify-center">
              <Monitor className="text-blue-500" size={32} />
            </div>
            <div className="absolute -bottom-2 w-12 h-1.5 bg-slate-950 rounded-full opacity-50 shadow-xl" />
          </div>
          {/* Decorative elements */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full" />
        </div>
      </div>

      {/* Business Section */}
      <div className="px-4">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em]">Sales Hub</h2>
          </div>

          {/* Sale Category */}
          <div className="border-b border-slate-100 last:border-0">
            <button 
              onClick={() => setSaleExpanded(!saleExpanded)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <span className="text-sm font-bold opacity-70">₹</span>
                </div>
                <span className="font-bold text-slate-700 tracking-tight">Main Sales Channel</span>
              </div>
              {saleExpanded ? <ChevronDown size={18} className="text-blue-600" /> : <ChevronRight size={18} className="text-slate-400" />}
            </button>
            <AnimatePresence>
              {saleExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-50/50"
                >
                  <MenuItem label="Sale Invoice" />
                  <MenuItem label="Payment-In" />
                  <MenuItem label="Sale Return (Credit Note)" />
          <MenuItem label="Estimate/Quotation" onClick={onNavigateToEstimates} />
                  <MenuItem label="Sale Order" />
                  <MenuItem label="Delivery Note" />
                  <MenuItem label="Vyapar POS" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <MenuItemWithIcon icon={<Box size={18} className="text-slate-500" />} label="Inventory Management" />
          <MenuItemWithIcon icon={<Bell size={18} className="text-slate-500" />} label="Recent Expenses" />
          <MenuItemWithIcon icon={<Home size={18} className="text-slate-500" />} label="My Online Store" />
          <MenuItemWithIcon icon={<LayoutDashboard size={18} className="text-slate-500" />} label="Executive Reports" />
        </div>

        {/* Operations Section */}
        <div className="mt-6 mb-24 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em]">Operations & Finance</h2>
          </div>
          <MenuItemWithIcon icon={<Box size={18} />} label="Bank Accounts" />
          <MenuItemWithIcon icon={<Home size={18} />} label="Cash Operations" />
          <MenuItemWithIcon icon={<Box size={18} />} label="Cheque Processing" />
          <MenuItemWithIcon 
            icon={<Settings size={18} />} 
            label="Invoice Settings" 
            onClick={onNavigateToSettings}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ProfileEditView({ 
  companyData, 
  onBack, 
  onSave 
}: { 
  companyData: CompanyData, 
  onBack: () => void, 
  onSave: (data: CompanyData) => void 
}) {
  const [data, setData] = useState<CompanyData>(companyData);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigPad = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (showSignatureModal && canvasRef.current && !sigPad.current) {
      sigPad.current = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)'
      });
      
      const resizeCanvas = () => {
        if (canvasRef.current && sigPad.current) {
          const ratio = Math.max(window.devicePixelRatio || 1, 1);
          canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
          canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
          canvasRef.current.getContext("2d")?.scale(ratio, ratio);
          sigPad.current.clear();
        }
      };
      
      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();
      
      return () => {
        window.removeEventListener("resize", resizeCanvas);
        sigPad.current = null;
      };
    }
  }, [showSignatureModal]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSignature = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      const signature = sigPad.current.toDataURL('image/png');
      setData(prev => ({ ...prev, signature }));
      setShowSignatureModal(false);
    }
  };

  const clearSignature = () => {
    sigPad.current?.clear();
  };

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      exit={{ x: -20, opacity: 0 }}
      className="flex flex-col min-h-screen pb-24 bg-white"
    >
      <div className="bg-slate-900 px-4 py-4 flex items-center border-b border-slate-800 sticky top-0 z-40 gap-4 shadow-sm">
        <button onClick={onBack} className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-300">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg text-white tracking-tight uppercase">Invoice Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        {/* Logo Section */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Business Logo</h2>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center p-2 relative group bg-slate-50 overflow-hidden">
              {data.logo ? (
                <img src={data.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <ImageIcon size={32} className="text-slate-200" />
              )}
              <input 
                type="file" 
                id="profile-logo-upload" 
                className="hidden" 
                accept="image/*" 
                onChange={handleLogoUpload} 
              />
              <label 
                htmlFor="profile-logo-upload" 
                className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[10px] font-bold"
              >
                <Plus size={20} className="mb-1" />
                CHANGE
              </label>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm font-bold text-slate-900">Company Logo</p>
              <p className="text-xs text-slate-500 leading-relaxed">This logo will appear at the top of your estimates and invoices. Recommended size: 512x512px.</p>
              {data.logo && (
                <button 
                  onClick={() => setData(prev => ({ ...prev, logo: '' }))}
                  className="text-red-500 text-xs font-bold hover:underline"
                >
                  Remove Logo
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Company Information</h2>
          <div className="space-y-4">
            <div className="relative pt-2">
              <div className="absolute -top-1.5 left-3 bg-white px-2 z-10 text-[10px] font-bold text-slate-500">Business Name</div>
              <input 
                type="text" 
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="relative pt-2">
              <div className="absolute -top-1.5 left-3 bg-white px-2 z-10 text-[10px] font-bold text-slate-500">Address</div>
              <textarea 
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                rows={3}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative pt-2">
                <div className="absolute -top-1.5 left-3 bg-white px-2 z-10 text-[10px] font-bold text-slate-500">Phone</div>
                <input 
                  type="text" 
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="relative pt-2">
                <div className="absolute -top-1.5 left-3 bg-white px-2 z-10 text-[10px] font-bold text-slate-500">Email</div>
                <input 
                  type="email" 
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Signature Section */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Authorized Signature</h2>
          <div className="border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 relative group aspect-video flex flex-col items-center justify-center cursor-pointer p-4" onClick={() => setShowSignatureModal(true)}>
            {data.signature ? (
              <img src={data.signature} alt="Signature" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <Pencil size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">Click to set signature</span>
              </div>
            )}
            <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-slate-900 text-white p-2 rounded-full shadow-xl">
                <Edit2 size={20} />
              </div>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 font-medium">This signature will be automatically printed on all your final invoices.</p>
        </section>

        {/* Business Terms */}
        <section className="pb-10">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Invoice Terms</h2>
          <div className="relative pt-2">
            <div className="absolute -top-1.5 left-3 bg-white px-2 z-10 text-[10px] font-bold text-slate-500">Terms & Conditions</div>
            <textarea 
              value={data.terms}
              onChange={(e) => setData({ ...data, terms: e.target.value })}
              rows={4}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-40">
        <button 
          onClick={() => onSave(data)}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
        >
          <CheckCircle2 size={20} />
          Apply Changes
        </button>
      </div>

      {/* Signature Modal Overlay */}
      <AnimatePresence>
        {showSignatureModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110]"
              onClick={() => setShowSignatureModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-white rounded-2xl shadow-2xl z-[111] overflow-hidden"
            >
              <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Pencil size={20} />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Draw Signature</h3>
                </div>
                <button onClick={() => setShowSignatureModal(false)} className="hover:bg-slate-800 p-2 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden mb-6 h-64">
                  <canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={clearSignature} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={18} />
                    Reset
                  </button>
                  <button onClick={saveSignature} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                    <Check size={18} />
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
function numberToWords(num: number): string {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  function convertChunk(n: number): string {
    let str = '';
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      str += teens[n - 10] + ' ';
      n = 0;
    }
    if (n > 0) {
      str += units[n] + ' ';
    }
    return str.trim();
  }

  let result = '';
  let integerPart = Math.floor(num);
  
  if (integerPart >= 10000000) {
      let chunk = Math.floor(integerPart / 10000000);
      result += convertChunk(chunk) + ' Crore ';
      integerPart %= 10000000;
  }
  if (integerPart >= 100000) {
      let chunk = Math.floor(integerPart / 100000);
      result += convertChunk(chunk) + ' Lakh ';
      integerPart %= 100000;
  }
  if (integerPart >= 1000) {
      let chunk = Math.floor(integerPart / 1000);
      result += convertChunk(chunk) + ' Thousand ';
      integerPart %= 1000;
  }
  if (integerPart > 0) {
      result += convertChunk(integerPart);
  }

  return result.trim() + ' Rupees only';
}

function InvoiceView({ 
  estimate, 
  onBack,
  companyData,
  onUpdateCompany
}: { 
  estimate: Estimate, 
  onBack: () => void,
  companyData: CompanyData,
  onUpdateCompany: (data: CompanyData) => void
}) {
  const subtotal = estimate.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigPad = useRef<SignaturePad | null>(null);

  React.useEffect(() => {
    if (showSignatureModal && canvasRef.current && !sigPad.current) {
      sigPad.current = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)'
      });
      
      const resizeCanvas = () => {
        if (canvasRef.current && sigPad.current) {
          const ratio = Math.max(window.devicePixelRatio || 1, 1);
          canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
          canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
          canvasRef.current.getContext("2d")?.scale(ratio, ratio);
          sigPad.current.clear();
        }
      };
      
      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();
      
      return () => {
        window.removeEventListener("resize", resizeCanvas);
        sigPad.current = null;
      };
    }
  }, [showSignatureModal]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateCompany({ ...companyData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSignature = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      const signature = sigPad.current.toDataURL('image/png');
      onUpdateCompany({ ...companyData, signature });
      setShowSignatureModal(false);
    }
  };

  const clearSignature = () => {
    sigPad.current?.clear();
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice - ${estimate.customerName}`,
          text: `Invoice #${estimate.refNo} for ${estimate.customerName} - Total: Rs ${subtotal.toLocaleString('en-IN')}`,
          url: window.location.href,
        });
      } catch (err) {
        // Suppress logging if the user simply canceled the share
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback for desktop: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Invoice link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-200 overflow-y-auto"
    >
      <div className="max-w-5xl mx-auto p-4 sm:p-12 min-h-screen">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-200/90 backdrop-blur-md py-4 z-10 print:hidden">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white rounded-lg transition-colors border border-slate-300 bg-white/50">
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-bold text-slate-700">Invoice Preview</h2>
          </div>
          <div className="flex gap-3">
             <button onClick={() => setShowSettingsModal(true)} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded flex items-center gap-2 font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
                <Settings size={18} />
                Edit Info
             </button>
             <button onClick={() => window.print()} className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded flex items-center gap-2 font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
                Print / Save
             </button>
             <button onClick={handleShare} className="bg-slate-900 text-white px-6 py-2 rounded flex items-center gap-2 font-bold text-sm shadow-lg hover:bg-slate-800 transition-colors">
                Share
             </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="bg-white border border-slate-400 shadow-2xl p-4 sm:p-8 md:p-12 print:shadow-none print:border-none print:p-0 mx-auto w-full min-h-[297mm]">
          
          {/* Header Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-700 tracking-[0.1em] uppercase">
              {estimate.isSale ? 'Sale Invoice' : 'Estimate'}
            </h1>
          </div>

          {/* Business Header Box */}
          <div className="border border-slate-400 p-6 flex gap-6 mb-6">
            <div className="w-28 h-28 border border-slate-400 flex items-center justify-center relative group bg-slate-50 overflow-hidden rounded">
               <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
               {companyData.logo ? (
                 <img src={companyData.logo} alt="Logo" className="w-full h-full object-contain" />
               ) : (
                <div className="flex flex-col items-center gap-1 opacity-20">
                  <Monitor size={32} />
                  <span className="text-[10px] font-black uppercase">JAG</span>
                </div>
               )}
               <label htmlFor="logo-upload" className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white font-bold text-[10px] print:hidden">
                  <Edit2 size={18} className="mb-1" />
                  EDIT LOGO
               </label>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{companyData.name}</h2>
              <p className="text-sm text-slate-700 mb-3">{companyData.address}</p>
              <div className="grid grid-cols-2 text-sm font-medium">
                <p><span className="text-slate-400 mr-2">Phone:</span> {companyData.phone}</p>
                <p><span className="text-slate-400 mr-2">Email:</span> {companyData.email}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 border border-slate-400 mb-6 bg-white overflow-hidden text-sm">
            <div className="p-4 border-r border-slate-400 flex flex-col h-full">
              <span className="text-xs font-bold text-slate-900 underline mb-3 uppercase tracking-wider">
                {estimate.isSale ? 'Invoice For:' : 'Estimate For:'}
              </span>
              <span className="text-lg font-bold text-slate-800">{estimate.customerName}</span>
            </div>
            <div className="p-0 flex flex-col h-full">
               <div className="p-4 border-b border-slate-400 flex justify-between items-center bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-900 underline uppercase tracking-wider">
                    {estimate.isSale ? 'Invoice Details:' : 'Estimate Details:'}
                  </span>
               </div>
               <div className="p-4 space-y-1 font-bold text-slate-800">
                  <div className="flex"><span className="w-20 text-slate-400">No:</span> {estimate.refNo}</div>
                  <div className="flex"><span className="w-20 text-slate-400">Date:</span> {estimate.date}</div>
                  <div className="flex"><span className="w-20 text-slate-400">Time:</span> 06:01 PM</div>
               </div>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-400 mb-6 overflow-x-auto scrollbar-hide">
            <table className="w-full text-sm border-collapse min-w-[600px] sm:min-w-full">
              <thead className="bg-slate-50 font-bold border-b border-slate-400">
                <tr>
                  <th className="border-r border-slate-400 p-2 w-10 text-center">#</th>
                  <th className="border-r border-slate-400 p-2 text-left">Item name</th>
                  <th className="border-r border-slate-400 p-2 w-24 text-center">Quantity</th>
                  <th className="border-r border-slate-400 p-2 w-32 text-right">Price/ Unit (Rs)</th>
                  <th className="p-2 w-32 text-right">Amount(Rs)</th>
                </tr>
              </thead>
              <tbody className="font-medium text-slate-800">
                {estimate.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-400 last:border-b-0">
                    <td className="border-r border-slate-400 p-3 text-center">{idx + 1}</td>
                    <td className="border-r border-slate-400 p-3 break-all sm:break-normal">{item.name}</td>
                    <td className="border-r border-slate-400 p-3 text-center">{item.quantity}</td>
                    <td className="border-r border-slate-400 p-3 text-right">Rs {item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right font-bold">Rs {(item.quantity * item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                {/* Visual fill */}
                {[...Array(Math.max(0, 4 - estimate.items.length))].map((_, i) => (
                  <tr key={`empty-${i}`} className="h-10 border-b border-slate-400 last:border-b-0">
                    <td className="border-r border-slate-400"></td>
                    <td className="border-r border-slate-400"></td>
                    <td className="border-r border-slate-400"></td>
                    <td className="border-r border-slate-400"></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-slate-400 font-bold bg-slate-50/30">
                <tr>
                  <td colSpan={2} className="border-r border-slate-400 p-3 text-left">Total</td>
                  <td className="border-r border-slate-400 p-3 text-center">{estimate.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="border-r border-slate-400 p-3"></td>
                  <td className="p-3 text-right font-black">Rs {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary Box */}
          <div className="flex justify-end mb-8">
            <div className="w-full sm:w-80 border border-slate-400 text-xs font-bold divide-y divide-slate-400">
              <div className="flex">
                <div className="flex-1 p-2 bg-slate-50/50">Sub Total</div>
                <div className="w-1/2 p-2 text-right">: Rs {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
              {(estimate.discountValue || 0) > 0 && (
                <div className="flex text-orange-600">
                  <div className="flex-1 p-2 bg-orange-50/20">Discount {estimate.discountType === 'percentage' ? `(${estimate.discountValue}%)` : ''}</div>
                  <div className="w-1/2 p-2 text-right">: - Rs {(estimate.discountType === 'percentage' ? (subtotal * estimate.discountValue!) / 100 : estimate.discountValue!).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>
              )}
              <div className="flex border-t-2 border-slate-900/10">
                <div className="flex-1 p-2 bg-slate-50/50">Total</div>
                <div className="w-1/2 p-2 text-right">: Rs {(estimate.totalAmount || subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
              {estimate.isSale && (
                <>
                  <div className="flex text-green-600">
                    <div className="flex-1 p-2 bg-green-50/50">Received</div>
                    <div className="w-1/2 p-2 text-right">: Rs {(estimate.receivedAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className="flex text-red-600">
                    <div className="flex-1 p-2 bg-red-50/50">Balance Due</div>
                    <div className="w-1/2 p-2 text-right">: Rs {(estimate.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  </div>
                </>
              )}
              <div className="p-2">
                <span className="text-slate-400 block mb-1 uppercase text-[9px] tracking-widest">
                  {estimate.isSale ? 'Invoice' : 'Estimate'} Amount In Words :
                </span>
                <p className="text-slate-900 leading-snug">{numberToWords(subtotal)}</p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="border border-slate-400 mb-8 overflow-hidden rounded-sm cursor-pointer hover:bg-slate-50 group relative" onClick={() => setShowSettingsModal(true)}>
            <div className="bg-slate-50 p-2 border-b border-slate-400 text-[10px] font-black uppercase tracking-widest">
              Terms And Conditions:
            </div>
            <div className="p-4 text-[10px] font-bold text-slate-600 normal-case italic leading-relaxed">
              {companyData.terms}
            </div>
            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center print:hidden">
                <Pencil size={20} className="text-blue-600" />
            </div>
          </div>

          {/* Signature Box */}
          <div className="flex justify-end mt-12">
            <div className="w-72 border border-slate-400 h-40 flex flex-col relative group">
              <div 
                onClick={() => setShowSignatureModal(true)}
                className="flex-1 flex flex-col items-center justify-center p-4 cursor-pointer relative overflow-hidden"
              >
                {companyData.signature ? (
                  <img src={companyData.signature} alt="Signature" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 opacity-20 group-hover:opacity-100 transition-opacity">
                     <Pencil size={24} className="text-slate-400" />
                     <span className="text-[9px] font-black uppercase">Draw Authorized Signature</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center print:hidden">
                  <div className="bg-blue-600 text-white rounded-full p-2 shadow-lg">
                    <Edit2 size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Modal Overlay */}
      <AnimatePresence>
        {showSignatureModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110]"
              onClick={() => setShowSignatureModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-white rounded-2xl shadow-2xl z-[111] overflow-hidden"
            >
              <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Pencil size={20} />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Draw Signature</h3>
                </div>
                <button onClick={() => setShowSignatureModal(false)} className="hover:bg-slate-800 p-2 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden mb-6 h-64">
                  <canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={clearSignature} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={18} />
                    Reset Pad
                  </button>
                  <button onClick={saveSignature} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                    <Check size={18} />
                    Confirm Signature
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120]"
              onClick={() => setShowSettingsModal(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-[90vw] max-w-md bg-white shadow-2xl z-[121] flex flex-col"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings size={20} />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Company Settings</h3>
                </div>
                <button onClick={() => setShowSettingsModal(false)} className="hover:bg-slate-800 p-2 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
                  <input 
                    type="text" 
                    value={companyData.name} 
                    onChange={(e) => onUpdateCompany({ ...companyData, name: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Address</label>
                  <textarea 
                    value={companyData.address} 
                    onChange={(e) => onUpdateCompany({ ...companyData, address: e.target.value })}
                    rows={3}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone</label>
                    <input 
                      type="text" 
                      value={companyData.phone} 
                      onChange={(e) => onUpdateCompany({ ...companyData, phone: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
                    <input 
                      type="email" 
                      value={companyData.email} 
                      onChange={(e) => onUpdateCompany({ ...companyData, email: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Terms & Conditions</label>
                  <textarea 
                    value={companyData.terms} 
                    onChange={(e) => onUpdateCompany({ ...companyData, terms: e.target.value })}
                    rows={4}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MoreOptionsSheet({ onClose, estimate, onConvert }: { onClose: () => void, estimate: Estimate, onConvert: (est: Estimate) => void }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 z-[100] backdrop-blur-[2px]"
      />
      
      {/* Sheet */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[101] shadow-2xl overflow-hidden pb-8"
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">More Options</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-2">
          <OptionItem 
            icon={<Calendar size={20} className="text-slate-500" />} 
            label="Convert to Sale" 
            onClick={() => {
              onConvert(estimate);
              onClose();
            }}
          />
          <OptionItem 
            icon={<ClipboardList size={20} className="text-slate-500" />} 
            label="Convert to Sale Order" 
            onClick={() => {
              onConvert(estimate);
              onClose();
            }}
          />
        </div>
      </motion.div>
    </>
  );
}

function OptionItem({ icon, label, onClick }: { icon: ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group text-left"
    >
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-slate-500">
        {icon}
      </div>
      <span className="text-sm font-bold text-slate-700 tracking-tight flex-1">{label}</span>
      <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
    </button>
  );
}

function MenuItem({ label, onClick }: { label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between px-16 py-4 border-b border-slate-100 last:border-0 hover:bg-white transition-all"
    >
      <span className="text-sm text-slate-600">{label}</span>
      <ChevronRight size={16} className="text-slate-300" />
    </button>
  );
}

function MenuItemWithIcon({ icon, label, onClick }: { icon: ReactNode, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-all text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-blue-600">
          {icon}
        </div>
        <span className="font-bold text-slate-700 tracking-tight">{label}</span>
      </div>
      <ChevronRight size={18} className="text-slate-400 opacity-50" />
    </button>
  );
}

function EstimateListView({ 
  estimates, 
  onBack, 
  onAdd, 
  onEdit,
  onConvert,
  onViewInvoice
}: { 
  estimates: Estimate[], 
  onBack: () => void, 
  onAdd: () => void,
  onEdit: (est: Estimate) => void,
  onConvert: (est: Estimate) => void,
  onViewInvoice: (est: Estimate) => void
}) {
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptionsFor, setShowOptionsFor] = useState<Estimate | null>(null);

  const filteredEstimates = useMemo(() => {
    return estimates.filter(est => {
      const matchFilter = filter === 'ALL' || est.status === filter;
      const matchSearch = est.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [estimates, filter, searchQuery]);

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      exit={{ x: -20, opacity: 0 }}
      className="flex flex-col min-h-screen pb-24 bg-slate-50"
    >
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center border-b border-slate-200 sticky top-0 z-40 gap-4 shadow-sm">
        <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg text-slate-900 tracking-tight">Estimate Hub</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 flex gap-2 border-b border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {(['ALL', 'OPEN', 'CLOSED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider border transition-all ${
              filter === f 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {f === 'ALL' ? 'Show All' : f === 'OPEN' ? 'Active Estimates' : 'Closed Items'}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="bg-white rounded-lg border border-slate-200 flex items-center px-4 py-3 shadow-sm focus-within:border-blue-500 transition-colors">
          <Search size={18} className="text-slate-400 mr-3" />
          <input 
            type="text" 
            placeholder="Search by customer or ref..."
            className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-400 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="px-4 flex-1">
        {filteredEstimates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10">
            <div className="w-48 h-48 mb-6 opacity-40 bg-slate-200 rounded-full flex items-center justify-center">
              <ImageIcon size={64} className="text-slate-400" />
            </div>
            <h3 className="text-slate-900 font-bold mb-2">No Records Found</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">
              Your quotation database is currently empty. Start by creating a professional estimate for your client.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEstimates.map(est => (
              <motion.div 
                key={est.id} 
                layoutId={est.id}
                onClick={() => onEdit(est)}
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{est.customerName}</span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-[0.1em] ${
                    est.status === EstimateStatus.OPEN 
                      ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {est.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimate Value</span>
                    <span className="text-base font-bold text-slate-900">Rs {est.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reference</span>
                    <span className="text-sm font-semibold text-slate-600">#QTN-{est.refNo.toString().padStart(4, '0')}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Issued:</span>
                    <span className="text-[10px] font-bold text-slate-600">{est.date}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (est.status === EstimateStatus.OPEN) {
                        setShowOptionsFor(est);
                      } else {
                        onViewInvoice(est);
                      }
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold py-2 px-5 rounded uppercase tracking-wider transition-all shadow-sm"
                  >
                    {est.status === EstimateStatus.OPEN ? 'Process' : 'See Invoice'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button 
        onClick={onAdd}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2.5 px-8 py-4 rounded-lg shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all z-50 text-xs font-bold uppercase tracking-widest"
      >
        <Plus size={18} strokeWidth={3} />
        <span>Create New Estimate</span>
      </button>

      <AnimatePresence>
        {showOptionsFor && (
          <MoreOptionsSheet 
            onClose={() => setShowOptionsFor(null)} 
            estimate={showOptionsFor}
            onConvert={onConvert}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EstimateFormView({ 
  initialData, 
  onBack, 
  onSave 
}: { 
  initialData: Estimate | null, 
  onBack: () => void, 
  onSave: (est: Estimate) => void 
}) {
  const [refNo, setRefNo] = useState(initialData?.refNo || 2);
  const [date, setDate] = useState(initialData?.date || '12/05/2026');
  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [items, setItems] = useState<Item[]>(initialData?.items || []);
  const [description, setDescription] = useState(initialData?.description || '');
  const [discountValue, setDiscountValue] = useState(initialData?.discountValue || 0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(initialData?.discountType || 'percentage');
  const [taxType, setTaxType] = useState(initialData?.taxType || 'None');
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.quantity * item.rate), 0), [items]);
  const discountAmount = useMemo(() => {
    if (discountType === 'percentage') return (subtotal * discountValue) / 100;
    return discountValue;
  }, [subtotal, discountValue, discountType]);
  const totalAmount = subtotal - discountAmount;

  const handleAddItem = (item: Item, stay?: boolean) => {
    if (editingItemIndex !== null) {
      setItems(prev => prev.map((it, idx) => idx === editingItemIndex ? item : it));
    } else {
      setItems(prev => [...prev, item]);
    }
    
    if (!stay) {
      setShowItemModal(false);
      setEditingItemIndex(null);
    } else {
      setEditingItemIndex(null);
    }
  };

  const handleSave = () => {
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      refNo,
      date,
      customerName,
      items,
      status: initialData?.status || EstimateStatus.OPEN,
      discountValue,
      discountType,
      taxType,
      description,
      totalAmount,
      balance: totalAmount
    });
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: -20, opacity: 0 }}
      className="flex flex-col min-h-screen bg-slate-50"
    >
      {/* Header */}
      <div className="bg-slate-900 px-4 py-4 flex items-center border-b border-slate-800 sticky top-0 z-40 shadow-lg">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg mr-4 transition-colors text-slate-300">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg text-white tracking-tight flex-1">Create Estimate</h1>
        <button className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
          <Settings size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Top Info Cards */}
        <div className="grid grid-cols-2 border-b border-slate-200">
          <div className="p-6 bg-white border-r border-slate-200">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Reference ID</label>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 group">#QTN-{refNo.toString().padStart(4, '0')}</span>
              <ChevronDown size={14} className="text-slate-300" />
            </div>
          </div>
          <div className="p-6 bg-white">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Document Date</label>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">{date}</span>
              <ChevronDown size={14} className="text-slate-300" />
            </div>
          </div>
        </div>

        {/* Customer Input Section */}
        <div className="p-6">
          <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.1em] mb-5 border-b border-slate-100 pb-3">Client Information</h2>
            <div className="relative group">
              <div className="absolute -top-2.5 left-3 bg-white px-2 z-10">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customer Name *</label>
              </div>
              <input 
                type="text" 
                className="w-full border border-slate-300 rounded-md px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="e.g. Modern Heights Real Estate"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </section>
        </div>

        {/* Items Table Section */}
        <div className="px-6">
          <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Box size={18} className="text-slate-400" />
                <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.1em]">Quotation Line Items</h2>
              </div>
              <button 
                onClick={() => {
                  setEditingItemIndex(null);
                  setShowItemModal(true);
                }}
                className="text-blue-600 text-xs font-bold hover:underline"
              >
                + Add Custom Item
              </button>
            </div>

            {items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item Details</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-center">Qty</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32 text-right">Price</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr 
                        key={item.id} 
                        onClick={() => {
                          setEditingItemIndex(idx);
                          setShowItemModal(true);
                        }}
                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600">{item.name}</span>
                          <span className="block text-[10px] text-slate-400 font-medium uppercase mt-0.5">{item.unit}</span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-semibold text-slate-600">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Rs {item.rate.toFixed(1)}</td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">Rs {(item.quantity * item.rate).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center border-dashed border-2 border-slate-100 m-6 rounded-lg">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">No items billed yet</p>
                <button 
                  onClick={() => setShowItemModal(true)}
                  className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded text-[11px] uppercase tracking-wider hover:bg-blue-700 shadow-sm"
                >
                  Configure First Item
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Calculation Summary Side by Side */}
        <div className="grid grid-cols-12 gap-6 p-6 mt-4">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            {/* Notes Section */}
            <section className="bg-slate-800 rounded-lg shadow-sm p-6 text-white h-full">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Internal Sale Notes</h3>
              <textarea 
                placeholder="Internal comments on project specifications..."
                className="w-full bg-slate-700/50 border-none rounded p-4 text-xs text-slate-100 h-32 resize-none outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Auto-Saving Enabled</span>
                <span>Author: Sarah J.</span>
              </div>
            </section>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
              <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.1em] mb-2 border-b border-slate-100 pb-3">Quotation Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-widest">Subtotal</span>
                  <span className="text-slate-900 font-bold">Rs {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Discount Mode</label>
                    <div className="flex border border-slate-200 rounded overflow-hidden">
                      <input 
                        type="number" 
                        className="flex-1 px-3 py-1.5 text-xs outline-none bg-slate-50 font-bold" 
                        value={discountValue || ''}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                      />
                      <button 
                        onClick={() => setDiscountType(discountType === 'percentage' ? 'fixed' : 'percentage')}
                        className="bg-slate-900 text-white px-3 py-1.5 text-[9px] font-bold border-l border-slate-800"
                      >
                        {discountType === 'percentage' ? '%' : 'FIX'}
                      </button>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impact</span>
                    <span className="text-xs font-bold text-red-500">-Rs {discountAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Grand Total</span>
                  <span className="text-xl font-bold text-blue-600">Rs {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 h-20 flex border-t border-slate-200 z-50 bg-white p-4 gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <button className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg transition-all text-xs uppercase tracking-widest">
          Discard
        </button>
        <button 
          onClick={handleSave}
          className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md shadow-blue-500/20 flex items-center justify-center gap-3 transition-all text-xs uppercase tracking-[0.15em]"
        >
          Finalize Quotation
        </button>
        <button className="w-16 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
          <MoreVertical size={20} />
        </button>
      </div>

      <ItemModal 
        show={showItemModal} 
        onClose={() => setShowItemModal(false)} 
        onSave={handleAddItem}
        editingItem={editingItemIndex !== null ? items[editingItemIndex] : null}
      />
    </motion.div>
  );
}

function ItemModal({ 
  show, 
  onClose, 
  onSave,
  editingItem
}: { 
  show: boolean, 
  onClose: () => void, 
  onSave: (item: Item, stay?: boolean) => void,
  editingItem: Item | null
}) {
  const [name, setName] = useState(editingItem?.name || '');
  const [quantity, setQuantity] = useState(editingItem?.quantity || 1);
  const [rate, setRate] = useState(editingItem?.rate || 0);
  const [unit, setUnit] = useState(editingItem?.unit || 'Nos');
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  useEffect(() => {
    if (show) {
      setName(editingItem?.name || '');
      setQuantity(editingItem?.quantity || 1);
      setRate(editingItem?.rate || 0);
      setUnit(editingItem?.unit || 'Nos');
    }
  }, [show, editingItem]);

  if (!show) return null;

  const handleConfirm = () => {
    onSave({
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      name,
      quantity,
      rate,
      unit,
      tax: 0,
      discount: 0
    }, false);
  };

  const handleSaveAndNew = () => {
    onSave({
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      name,
      quantity,
      rate,
      unit,
      tax: 0,
      discount: 0
    }, true);
    // Reset fields
    setName('');
    setQuantity(1);
    setRate(0);
    setUnit('Nos');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-50 flex flex-col">
      <div className="px-5 py-5 flex items-center justify-between bg-slate-900 border-b border-slate-800 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-white tracking-tight">Configure Line Item</h1>
        </div>
        <Settings size={20} className="text-slate-400" />
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto">
        {/* Item Name */}
        <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Identification</h3>
          <div className="relative pt-2">
            <div className="absolute -top-2.5 left-3 bg-white px-2 z-10 text-[10px] font-bold text-blue-600">Name / Description</div>
            <input 
              type="text" 
              placeholder="e.g. Double Glazed Aluminum Window"
              className="w-full border border-slate-300 rounded-md px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </section>

        {/* Specs */}
        <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Specifications & Rate</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="relative pt-2">
              <div className="absolute -top-2.5 left-3 bg-white px-2 z-10 text-[10px] font-bold text-slate-500">Quantity</div>
              <input 
                type="number" 
                placeholder="0"
                className="w-full border border-slate-300 rounded-md px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={quantity || ''}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div 
              onClick={() => setShowUnitPicker(true)}
              className="relative pt-2 cursor-pointer group"
            >
              <div className="absolute -top-2.5 left-3 bg-white px-2 z-10 text-[10px] font-bold text-slate-500">Unit Type</div>
              <div className="w-full border border-slate-300 rounded-md px-4 py-3 flex items-center justify-between group-hover:border-slate-400 transition-all bg-slate-50">
                <span className={`text-sm font-bold ${unit ? 'text-slate-900' : 'text-slate-300'}`}>{unit || 'Select...'}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
            </div>
          </div>

          <div className="mt-6 relative pt-2">
            <div className="absolute -top-2.5 left-3 bg-white px-2 z-10 text-[10px] font-bold text-slate-500">Price Per Unit (Rs)</div>
             <input 
              type="number" 
              placeholder="0.00"
              className="w-full border border-slate-300 rounded-md px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={rate || ''}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>
        </section>

        {/* Total Badge */}
        <div className="bg-blue-600 rounded-lg p-5 flex items-center justify-between shadow-lg shadow-blue-500/20">
          <span className="text-xs font-bold text-blue-100 uppercase tracking-[0.2em]">Item Total</span>
          <span className="text-xl font-bold text-white">Rs {(quantity * rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Item Modal Buttons */}
      <div className="flex h-20 border-t border-slate-200 z-50 bg-white p-4 gap-4">
        <button 
          onClick={handleSaveAndNew}
          className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg transition-all text-xs uppercase tracking-widest"
        >
          Save & New
        </button>
        <button 
          onClick={handleConfirm}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center justify-center transition-all text-xs uppercase tracking-widest shadow-lg"
        >
          Confirm Item
        </button>
      </div>

      {showUnitPicker && (
        <UnitPicker 
          onClose={() => setShowUnitPicker(false)} 
          onSelect={(u) => {
            setUnit(u);
            setShowUnitPicker(false);
          }} 
        />
      )}
    </div>
  );
}

function UnitPicker({ onClose, onSelect }: { onClose: () => void, onSelect: (u: string) => void }) {
  const units = [
    'BAGS (Bag)', 'BOTTLES (Btl)', 'BOX (Box)', 'BUNDLES (Bdl)', 'CANS (Can)', 'CARTONS (Ctn)', 'DOZENS (Dzn)',
    'GRAMMES (Gm)', 'KILOGRAMS (Kg)', 'LITRE (Ltr)', 'METERS (Mtr)', 'MILILITRE (Ml)', 'NUMBERS (Nos)', 
    'PACKS (Pac)', 'PAIRS (Prs)', 'PIECES (Pcs)', 'QUINTAL (Qtl)', 'ROLLS (Rol)', 'SQUARE FEET (Sqf)', 'SQUARE METERS (Sqm)', 'TABLETS (Tbs)'
  ];

  return (
    <div className="fixed inset-0 z-[70] bg-slate-50 flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
      <div className="px-6 py-6 flex items-center gap-4 bg-slate-900 shadow-xl border-b border-slate-800">
        <h1 className="font-bold text-lg text-white flex-1 tracking-tight">Standard Units</h1>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400"><X size={24} /></button>
      </div>
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="border border-slate-200 rounded-lg flex items-center px-4 py-3 shadow-inner focus-within:border-blue-500 transition-colors bg-slate-50">
          <Search size={18} className="text-slate-400 mr-3" />
          <input 
            type="text" 
            placeholder="Search metric or standard units..."
            className="flex-1 outline-none text-sm font-medium"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        <button className="w-full text-left px-6 py-4 text-blue-600 font-bold border-b border-slate-100 hover:bg-slate-50 transition-colors text-xs uppercase tracking-widest">Add Custom Measurement Unit</button>
        {units.map(u => (
          <button 
            key={u} 
            onClick={() => onSelect(u.split(' ')[0])}
            className="w-full text-left px-6 py-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wider group-hover:text-blue-600 transition-colors">{u}</span>
              <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SaleFormView({ 
  initialData, 
  onBack, 
  onSave 
}: { 
  initialData: Estimate, 
  onBack: () => void, 
  onSave: (est: Estimate, stay?: boolean) => void 
}) {
  const [refNo, setRefNo] = useState(initialData.refNo);
  const [date, setDate] = useState(initialData.date);
  const [customerName, setCustomerName] = useState(initialData.customerName);
  const [items, setItems] = useState<Item[]>(initialData.items);
  const [discountValue, setDiscountValue] = useState(initialData.discountValue || 0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(initialData.discountType || 'percentage');
  const [taxType, setTaxType] = useState(initialData.taxType || 'None');
  const [isCredit, setIsCredit] = useState(true);
  const [receivedAmount, setReceivedAmount] = useState(initialData.totalAmount || 0);
  const [paymentType, setPaymentType] = useState<'Cash' | 'Cheque' | 'Online'>('Cash');
  const [isReceived, setIsReceived] = useState(true);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.quantity * item.rate), 0), [items]);
  const discountAmount = useMemo(() => {
    if (discountType === 'percentage') return (subtotal * discountValue) / 100;
    return discountValue;
  }, [subtotal, discountValue, discountType]);
  const totalAmount = subtotal - discountAmount;
  const balanceDue = totalAmount - (isReceived ? receivedAmount : 0);

  useEffect(() => {
    if (isReceived) {
      setReceivedAmount(totalAmount);
    }
  }, [isReceived, totalAmount]);

  const handleAddItem = (item: Item, stay?: boolean) => {
    if (editingItemIndex !== null) {
      const newItems = [...items];
      newItems[editingItemIndex] = item;
      setItems(newItems);
    } else {
      setItems([...items, item]);
    }
    
    if (!stay) {
      setShowItemModal(false);
    } else {
      setEditingItemIndex(null);
    }
  };

  const handleSave = () => {
    onSave({
      ...initialData,
      refNo,
      date,
      customerName,
      items,
      discountValue,
      discountType,
      taxType,
      totalAmount,
      receivedAmount: isReceived ? receivedAmount : 0,
      paymentType,
      balance: balanceDue,
      isSale: true,
      status: EstimateStatus.CLOSED
    }, false);
  };

  const handleSaveAndNew = () => {
    onSave({
      ...initialData,
      refNo,
      date,
      customerName,
      items,
      discountValue,
      discountType,
      taxType,
      totalAmount,
      receivedAmount: isReceived ? receivedAmount : 0,
      paymentType,
      balance: balanceDue,
      isSale: true,
      status: EstimateStatus.CLOSED
    }, true);
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: -20, opacity: 0 }}
      className="flex flex-col min-h-screen bg-slate-50"
    >
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg mr-4 transition-colors text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg text-slate-900 tracking-tight flex-1">Sale</h1>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setIsCredit(true)}
            className={`px-4 py-1 text-[10px] font-bold uppercase rounded transition-all ${isCredit ? 'bg-green-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            Credit
          </button>
          <button 
            onClick={() => setIsCredit(false)}
            className={`px-4 py-1 text-[10px] font-bold uppercase rounded transition-all ${!isCredit ? 'bg-green-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            Cash
          </button>
        </div>
        <button className="ml-4 p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
          <Settings size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Invoice Info */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-white shadow-sm">
          <div className="p-4 border-r border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Invoice No.</label>
            <input 
              type="text" 
              value={refNo}
              onChange={(e) => setRefNo(e.target.value)}
              className="w-full bg-transparent font-bold text-slate-900 text-sm outline-none"
            />
          </div>
          <div className="p-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Date</label>
            <input 
              type="text" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent font-bold text-slate-900 text-sm outline-none"
            />
          </div>
        </div>

        {/* Customer Section */}
        <div className="p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative pt-6 group transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
            <div className="absolute -top-2.5 left-3 bg-white px-2 z-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider group-focus-within:text-blue-500">Customer *</div>
            <input 
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm font-bold text-slate-900 outline-none"
            />
          </div>
        </div>

        {/* Billed Items Section */}
        <div className="px-4">
          <div className="bg-blue-100/50 border border-blue-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-blue-200/50 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-blue-600">
                  <Check size={12} strokeWidth={4} />
                </div>
                <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider">Billed Items</span>
              </div>
              <ChevronDown size={16} className="text-blue-600" />
            </div>

            <div className="p-4 bg-white/50">
              {items.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="mb-4 last:mb-0 cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors"
                  onClick={() => {
                    setEditingItemIndex(idx);
                    setShowItemModal(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-400">#{idx + 1}</div>
                      <span className="font-bold text-slate-900">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Rs {item.rate.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 pl-9">
                    <span>Item Subtotal</span>
                    <span>{item.quantity} {item.unit} x {item.rate} = Rs {(item.quantity * item.rate).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-y-2 text-[11px] font-bold text-slate-600">
                <span className="text-slate-400">Total Disc: 0.0</span>
                <span className="text-right text-slate-400">Total Tax Amt: 0.0</span>
                <span className="text-slate-400">Total Qty:{items.reduce((s, i) => s + i.quantity, 0)}</span>
                <span className="text-right text-slate-700">Subtotal: {subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setEditingItemIndex(null);
                setShowItemModal(true);
              }}
              className="w-full bg-white border-t border-blue-200 py-3 flex items-center justify-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors"
            >
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <Plus size={14} strokeWidth={4} />
              </div>
              Add Items
            </button>
          </div>
        </div>

        {/* Tax & Discount Section */}
        <div className="mt-8 px-4">
          <div className="bg-white border-t border-slate-100 p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-6">Tax & Discount</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="flex gap-4">
                <div className="w-1/4 pt-2 text-sm font-bold text-slate-700">Discount</div>
                <div className="flex-1 flex border border-slate-200 rounded overflow-hidden h-10">
                  <input 
                    type="number" 
                    value={discountValue || ''}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="flex-1 px-3 bg-white outline-none font-bold" 
                  />
                  <div 
                    onClick={() => setDiscountType('percentage')}
                    className={`px-3 flex items-center justify-center font-bold text-sm border-l border-slate-200 cursor-pointer transition-colors ${discountType === 'percentage' ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}
                  >
                    %
                  </div>
                  <div 
                    onClick={() => setDiscountType('fixed')}
                    className={`px-3 flex items-center justify-center font-bold text-sm border-l border-slate-200 cursor-pointer transition-colors ${discountType === 'fixed' ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}
                  >
                    Rs
                  </div>
                  <div className="w-24 px-3 bg-slate-50 flex items-center justify-end font-bold border-l border-slate-200 text-slate-700 tabular-nums">
                    {discountAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1/4 pt-2 text-sm font-bold text-slate-700">Tax</div>
                <div className="flex-1 flex gap-4 h-10">
                  <div className="flex-1 border border-slate-200 rounded px-3 flex items-center justify-between font-bold text-sm text-slate-600">
                    None
                    <ChevronDown size={14} />
                  </div>
                  <div className="w-24 border border-slate-200 rounded px-3 flex items-center justify-end font-bold text-sm text-slate-300 bg-slate-50">
                    0.00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Totals */}
        <div className="mt-8 bg-white border-t border-slate-100 p-4 space-y-6">
          <div className="flex items-center justify-between group">
            <span className="text-sm font-bold text-slate-900">Total Amount</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-600 tracking-tight">Rs</span>
                <span className="text-lg font-black text-slate-900 tabular-nums">{totalAmount.toFixed(2)}</span>
              </div>
              <div className="w-44 h-[1px] border-b-2 border-dotted border-slate-300 mt-1" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                onClick={() => setIsReceived(!isReceived)}
                className={`w-6 h-6 border-2 rounded flex items-center justify-center cursor-pointer transition-all ${isReceived ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}
              >
                {isReceived && <Check size={14} className="text-white" strokeWidth={4} />}
              </div>
              <span className="text-sm font-bold text-slate-700">Received</span>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-600 tracking-tight">Rs</span>
                <input 
                  type="number" 
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(Number(e.target.value))}
                  className="w-44 text-right bg-white font-bold text-slate-900 tabular-nums outline-none border-none p-0 h-auto"
                />
              </div>
              <div className="w-44 h-[1px] border-b-2 border-dotted border-slate-300 mt-1" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-bold text-green-600">Balance Due</span>
            <div className="flex items-center gap-2 font-black text-green-600">
              <span className="text-sm tracking-tight">Rs</span>
              <span className="text-lg tabular-nums">{balanceDue.toFixed(2)}</span>
            </div>
          </div>
          {/* Jagged edge divider simulation */}
          <div className="relative h-2 overflow-hidden -mx-4">
             <div className="absolute inset-0 flex">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-slate-50 rotate-45 -translate-y-2 border border-slate-100" />
                ))}
             </div>
          </div>
        </div>

        {/* Payment Type */}
        <div className="mt-8 bg-white border-t border-slate-100 p-4 pb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Type</span>
            <div className="flex gap-2">
              {(['Cash', 'Cheque', 'Online'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setPaymentType(type)}
                  className={`flex items-center gap-2 font-bold px-3 py-1.5 rounded-lg border transition-all ${
                    paymentType === type 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {type === 'Cash' && <div className="bg-green-500 p-0.5 rounded-sm"><span className="text-[10px] text-white">₹</span></div>}
                  <span className="text-sm">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <button className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.15em] hover:opacity-80 transition-opacity">
            <Plus size={18} strokeWidth={4} />
            Add Payment Type
          </button>
        </div>

        {/* Free Plan Notice */}
        <div className="bg-red-50 p-3 mx-4 rounded-md border border-red-100 flex items-center justify-between group cursor-pointer mt-4">
           <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight">Your current plan may not support some features.</span>
           <ChevronRight size={14} className="text-red-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 h-20 flex border-t border-slate-200 z-50 bg-white p-4 gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <button 
          onClick={handleSaveAndNew}
          className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg transition-all text-xs uppercase tracking-widest"
        >
          Save & New
        </button>
        <button 
          onClick={handleSave}
          className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all text-xs uppercase tracking-[0.15em]"
        >
          Save
        </button>
        <button className="w-16 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
          <MoreVertical size={20} />
        </button>
      </div>

      <ItemModal 
        show={showItemModal} 
        onClose={() => setShowItemModal(false)} 
        onSave={handleAddItem}
        editingItem={editingItemIndex !== null ? items[editingItemIndex] : null}
      />
    </motion.div>
  );
}

