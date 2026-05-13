import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { View, Estimate, CompanyData, Party, InventoryItem } from './types';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { HomeModule } from './HomeModule';
import { DashboardModule } from './DashboardModule';
import { EstimatesModule } from './EstimatesModule';
import { PartiesModule } from './PartiesModule';
import { ItemsModule } from './ItemsModule';
import { InvoiceView } from './InvoiceView';
import { InvoiceForm } from './InvoiceForm';
import { PartyFormModal } from './PartyFormModal';
import { SettingsModule } from './SettingsModule';

// Mock invoice generator (for PDF)
import { X, Search } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [currentInvoice, setCurrentInvoice] = useState<Estimate | null>(null);
  
  const [companyData, setCompanyData] = useState<CompanyData>(() => {
    const saved = localStorage.getItem('vyapar_company');
    return saved ? JSON.parse(saved) : {
      name: 'Jawad Aluminium and Glass Works',
      email: 'jawadaluminium786@gmail.com',
      phone: '03235528196',
      address: 'Shop#1 Habib Plaza Near River Bridge Main Double Road Phase 5 Ghouri Town Islamabad',
      terms: 'Thanks for doing business with us! Advance payment 90% After complation10%=Note This Quotation is vailid for only two days'
    };
  });

  const [sales, setSales] = useState<Estimate[]>(() => {
    const saved = localStorage.getItem('vyapar_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [estimates, setEstimates] = useState<Estimate[]>(() => {
    const saved = localStorage.getItem('vyapar_estimates');
    return saved ? JSON.parse(saved) : [];
  });

  const [parties, setParties] = useState<Party[]>(() => {
    const saved = localStorage.getItem('vyapar_parties');
    return saved ? JSON.parse(saved) : [];
  });

  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('vyapar_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [convertingEstimateId, setConvertingEstimateId] = useState<string | null>(null);
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [editingParty, setEditingParty] = useState<Partial<Party> | null>(null);

  useEffect(() => {
    localStorage.setItem('vyapar_company', JSON.stringify(companyData));
  }, [companyData]);

  useEffect(() => {
    localStorage.setItem('vyapar_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('vyapar_estimates', JSON.stringify(estimates));
  }, [estimates]);

  useEffect(() => {
    localStorage.setItem('vyapar_parties', JSON.stringify(parties));
  }, [parties]);

  useEffect(() => {
    localStorage.setItem('vyapar_items', JSON.stringify(items));
  }, [items]);

  const handleAction = (action: string) => {
    if (action === 'ADD_SALE') setCurrentView('SALE_FORM');
    if (action === 'ADD_ESTIMATE') setCurrentView('ESTIMATE_FORM');
    if (action === 'ADD_PARTY') {
        setEditingParty({});
        setShowPartyModal(true);
    };
    if (action === 'ADD_ITEM') alert('Add item - Coming soon!');
    if (action === 'PROFILE_EDIT') setCurrentView('PROFILE_EDIT');
  };

  const handleEditParty = (party: Party) => {
    setEditingParty(party);
    setShowPartyModal(true);
  };

  const handleSaveParty = (partyData: Partial<Party>) => {
    if (partyData.id) {
        setParties(prev => prev.map(p => p.id === partyData.id ? { ...p, ...partyData as Party } : p));
    } else {
        const newParty: Party = {
            ...partyData as Party,
            id: Date.now().toString(),
            balance: partyData.balance || 0,
            type: 'receive'
        };
        setParties([...parties, newParty]);
    }
    setShowPartyModal(false);
    setEditingParty(null);
  };

  const handleDeleteParty = (id: string | number) => {
    setParties(prev => prev.filter(p => p.id !== id));
    setShowPartyModal(false);
    setEditingParty(null);
  };

  const handleConvertToSale = (estimateId: string, type: 'SALE' | 'SALE_ORDER') => {
    if (type === 'SALE') {
        setConvertingEstimateId(estimateId);
        setCurrentView('SALE_FORM');
    } else {
        setEstimates(prev => prev.map(e => e.id === estimateId ? { ...e, status: 'Converted' } : e));
    }
  };

  const [editingInvoice, setEditingInvoice] = useState<Estimate | null>(null);

  const handleEditSale = (inv: Estimate) => {
    setEditingInvoice(inv);
    setCurrentView('SALE_FORM');
  };

  const handleEditEstimate = (est: Estimate) => {
    setEditingInvoice(est);
    setCurrentView('ESTIMATE_FORM');
  };

  const handleViewInvoice = (inv: Estimate) => {
    setCurrentInvoice(inv);
    setCurrentView('INVOICE_VIEW');
  };

  const handleSaveInvoice = (inv: Estimate, isSale: boolean, printAndPreview: boolean) => {
      // Check if it's an update
      if (editingInvoice) {
          if (isSale) {
              setSales(prev => prev.map(s => s.id === editingInvoice.id ? { ...inv, id: editingInvoice.id } : s));
          } else {
              setEstimates(prev => prev.map(e => e.id === editingInvoice.id ? { ...inv, id: editingInvoice.id } : e));
          }
          setEditingInvoice(null);
      } else {
          // Check if it's a conversion from an estimate
          if (isSale && convertingEstimateId) {
              setEstimates(prev => prev.map(e => e.id === convertingEstimateId ? { ...e, status: 'Converted' } : e));
              setConvertingEstimateId(null);
          }
          
          // Automatic party management
          if (inv.customerName && inv.customerName !== 'Walk-in Customer') {
              let updatedParties = [...parties];
              let partyIndex = updatedParties.findIndex(p => p.name.toLowerCase() === inv.customerName.toLowerCase());
              
              if (partyIndex >= 0) {
                  if (isSale) {
                      updatedParties[partyIndex] = {
                          ...updatedParties[partyIndex],
                          balance: (updatedParties[partyIndex].balance || 0) + inv.totalAmount
                      };
                  }
              } else {
                  updatedParties.push({
                      id: Date.now().toString() + "_party",
                      name: inv.customerName,
                      phone: '',
                      email: '',
                      address: '',
                      balance: isSale ? inv.totalAmount : 0
                  });
              }
              setParties(updatedParties);
              
              if (partyIndex === -1) {
                  inv.partyId = updatedParties[updatedParties.length - 1].id;
              } else {
                  inv.partyId = updatedParties[partyIndex].id;
              }
          }

          if (isSale) {
              setSales([...sales, inv]);
          } else {
              setEstimates([...estimates, inv]);
          }
      }

      if (printAndPreview) {
          setCurrentInvoice(inv);
          setCurrentView('INVOICE_VIEW');
      } else {
          setCurrentView(isSale ? 'SALE_LIST' : 'ESTIMATE_LIST');
      }
  };

  return (
    <div id="app-container">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onAction={handleAction} companyData={companyData} />
      <main id="main-content">
        <TopHeader title={companyData.name} onAction={handleAction} />
        
        <div id="module-container">
          {currentView === 'HOME' && <DashboardModule sales={sales} parties={parties} items={items} onNavigate={setCurrentView} />}
          {currentView === 'SALE_LIST' && <HomeModule sales={sales} onAddSale={() => setCurrentView('SALE_FORM')} onEditSale={handleEditSale} onViewSale={handleViewInvoice} />}
          {currentView === 'PARTIES_LIST' && <PartiesModule parties={parties} sales={sales} estimates={estimates} onAddParty={() => { setEditingParty({}); setShowPartyModal(true); }} onEditParty={handleEditParty} />}
          {currentView === 'ITEMS_LIST' && <ItemsModule items={items} onAddItem={() => {}} onEditItem={(item) => alert('Edit Item: ' + item.name)} />}
          {currentView === 'ESTIMATE_LIST' && <EstimatesModule estimates={estimates} onAddEstimate={() => setCurrentView('ESTIMATE_FORM')} onConvertToSale={handleConvertToSale} onEditEstimate={handleEditEstimate} onViewEstimate={handleViewInvoice} />}
          {currentView === 'SALE_FORM' && <InvoiceForm isSale={true} onSave={(sale, print) => handleSaveInvoice(sale, true, print)} onCancel={() => { setConvertingEstimateId(null); setEditingInvoice(null); setCurrentView('SALE_LIST'); }} initialData={editingInvoice || (convertingEstimateId ? estimates.find(e => e.id === convertingEstimateId) : undefined)} parties={parties} />}
          {currentView === 'ESTIMATE_FORM' && <InvoiceForm isSale={false} onSave={(est, print) => handleSaveInvoice(est, false, print)} onCancel={() => { setEditingInvoice(null); setCurrentView('ESTIMATE_LIST'); }} initialData={editingInvoice || undefined} parties={parties} />}
          {currentView === 'INVOICE_VIEW' && currentInvoice && (
             <InvoiceView 
                estimate={currentInvoice} 
                companyData={companyData} 
                setCompanyData={setCompanyData} 
                onBack={() => setCurrentView(currentInvoice.isSale ? 'SALE_LIST' : 'ESTIMATE_LIST')} 
             />
          )}
          {currentView === 'PROFILE_EDIT' && (
             <SettingsModule 
                companyData={companyData} 
                onChange={setCompanyData} 
                onBack={() => setCurrentView('HOME')} 
             />
          )}
        </div>
      </main>

      {showPartyModal && editingParty && (
          <PartyFormModal 
            party={editingParty}
            onSave={handleSaveParty}
            onCancel={() => { setShowPartyModal(false); setEditingParty(null); }}
            onDelete={handleDeleteParty}
          />
      )}
    </div>
  );
}

