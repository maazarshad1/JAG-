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
import { ItemFormModal } from './ItemFormModal';
import { SettingsModule } from './SettingsModule';
import { 
  auth, db, googleProvider, 
  handleFirestoreError, OperationType, 
  testConnection 
} from './firebase';
import { 
  signInWithPopup, onAuthStateChanged, User, signOut 
} from 'firebase/auth';
import { 
  doc, setDoc, getDoc, getDocs, 
  collection, query, where, onSnapshot, 
  writeBatch, deleteDoc, updateDoc 
} from 'firebase/firestore';
import { LogIn, LogOut, Cloud, CloudOff, RefreshCw } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataSyncing, setDataSyncing] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [currentInvoice, setCurrentInvoice] = useState<Estimate | null>(null);
  
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    terms: ''
  });

  const [sales, setSales] = useState<Estimate[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);

  const [convertingEstimateId, setConvertingEstimateId] = useState<string | null>(null);
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [editingParty, setEditingParty] = useState<Partial<Party> | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<InventoryItem> | null>(null);

  // Initialize Firebase Connection test
  useEffect(() => {
    testConnection();
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync data with Firestore when user is logged in
  useEffect(() => {
    if (!user) {
      // Load from localStorage if not logged in (fallback/preview mode)
      const savedCompany = localStorage.getItem('vyapar_company');
      if (savedCompany) setCompanyData(JSON.parse(savedCompany));
      
      const savedSales = localStorage.getItem('vyapar_sales');
      if (savedSales) setSales(JSON.parse(savedSales));
      
      const savedEstimates = localStorage.getItem('vyapar_estimates');
      if (savedEstimates) setEstimates(JSON.parse(savedEstimates));
      
      const savedParties = localStorage.getItem('vyapar_parties');
      if (savedParties) setParties(JSON.parse(savedParties));
      
      const savedItems = localStorage.getItem('vyapar_items');
      if (savedItems) setItems(JSON.parse(savedItems));
      
      return;
    }

    // Subscribe to collections
    setDataSyncing(true);
    
    // 1. Settings
    const profileRef = doc(db, 'users', user.uid, 'settings', 'profile');
    const unsubProfile = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) setCompanyData(snap.data() as CompanyData);
    }, (err) => handleFirestoreError(err, OperationType.GET, `users/${user.uid}/settings/profile`));

    // 2. Parties
    const partiesQuery = query(collection(db, 'parties'), where('userId', '==', user.uid));
    const unsubParties = onSnapshot(partiesQuery, (snap) => {
      setParties(snap.docs.map(d => ({ ...d.data(), id: d.id }) as Party));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'parties'));

    // 3. Items
    const itemsQuery = query(collection(db, 'inventory'), where('userId', '==', user.uid));
    const unsubItems = onSnapshot(itemsQuery, (snap) => {
      setItems(snap.docs.map(d => ({ ...d.data(), id: d.id }) as InventoryItem));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'inventory'));

    // 4. Transactions
    const txnsQuery = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubTxns = onSnapshot(txnsQuery, (snap) => {
      const allTxns = snap.docs.map(d => ({ ...d.data(), id: d.id }) as Estimate);
      setSales(allTxns.filter(t => t.isSale));
      setEstimates(allTxns.filter(t => !t.isSale));
      setDataSyncing(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'transactions'));

    return () => {
      unsubProfile();
      unsubParties();
      unsubItems();
      unsubTxns();
    };
  }, [user]);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Sign in failed", error);
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("Sign-in window was closed by the user or a browser extension. If you saw a 'Domain not authorized' error inside the popup, please add this domain to your Firebase Authorized Domains.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        setAuthError("Sign-in attempt was interrupted. Please retry.");
      } else if (error.code === 'auth/popup-blocked') {
        setAuthError("Popup blocked! Enable popups in your browser and try again.");
      } else if (error.code === 'auth/unauthorized-domain') {
        setAuthError(`Domain ${window.location.hostname} is not authorized. Please copy this EXACT domain and add it to "Authorized Domains" in your Firebase Auth console (Settings > Authorized Domains).`);
      } else {
        setAuthError(`Sign-in failed: ${error.message || 'Please check for popup blockers or network issues.'}`);
      }
    }
  };

  const handleSignOut = () => signOut(auth);

  const migrateToCloud = async () => {
    if (!user) return;
    setDataSyncing(true);
    try {
      const batch = writeBatch(db);
      
      // Migrate Company
      const savedCompany = localStorage.getItem('vyapar_company');
      if (savedCompany) {
        batch.set(doc(db, 'users', user.uid, 'settings', 'profile'), { ...JSON.parse(savedCompany), userId: user.uid });
      } else {
        batch.set(doc(db, 'users', user.uid, 'settings', 'profile'), { ...companyData, userId: user.uid });
      }

      // Migrate Parties
      const savedParties = localStorage.getItem('vyapar_parties');
      if (savedParties) {
        const pList = JSON.parse(savedParties) as Party[];
        pList.forEach(p => {
          const ref = doc(collection(db, 'parties'));
          batch.set(ref, { ...p, userId: user.uid, id: ref.id });
        });
      }

      // Migrate Items
      const savedItems = localStorage.getItem('vyapar_items');
      if (savedItems) {
        const iList = JSON.parse(savedItems) as InventoryItem[];
        iList.forEach(i => {
          const ref = doc(collection(db, 'inventory'));
          batch.set(ref, { ...i, userId: user.uid, id: ref.id });
        });
      }

      // Migrate Sales
      const savedSales = localStorage.getItem('vyapar_sales');
      if (savedSales) {
        const sList = JSON.parse(savedSales) as Estimate[];
        sList.forEach(s => {
          const ref = doc(collection(db, 'transactions'));
          batch.set(ref, { ...s, userId: user.uid, id: ref.id, isSale: true });
        });
      }

      // Migrate Estimates
      const savedEstimates = localStorage.getItem('vyapar_estimates');
      if (savedEstimates) {
        const eList = JSON.parse(savedEstimates) as Estimate[];
        eList.forEach(e => {
          const ref = doc(collection(db, 'transactions'));
          batch.set(ref, { ...e, userId: user.uid, id: ref.id, isSale: false });
        });
      }

      await batch.commit();
      alert("Backup to Cloud successful!");
      // Clear local storage to avoid confusion? Better keep for offline.
    } catch (error: any) {
      console.error("Migration failed detailed error:", error);
      if (error.code === 'permission-denied') {
        alert("Backup failed: Permission Denied. Please check your Firestore rules.");
      } else {
        alert(`Backup failed: ${error.message || 'Unknown error'}. Check console for details.`);
      }
    } finally {
      setDataSyncing(false);
    }
  };

  const handleAction = (action: string) => {
    if (action === 'ADD_SALE') setCurrentView('SALE_FORM');
    if (action === 'ADD_ESTIMATE') setCurrentView('ESTIMATE_FORM');
    if (action === 'ADD_PARTY') {
        setEditingParty({});
        setShowPartyModal(true);
    };
    if (action === 'ADD_ITEM') {
        setEditingItem({});
        setShowItemModal(true);
    };
    if (action === 'PROFILE_EDIT') setCurrentView('PROFILE_EDIT');
  };

  const handleEditParty = (party: Party) => {
    setEditingParty(party);
    setShowPartyModal(true);
  };

  const handleSaveParty = async (partyData: Partial<Party>) => {
    if (user) {
      try {
        if (partyData.id) {
          const ref = doc(db, 'parties', partyData.id as string);
          await updateDoc(ref, { ...partyData, userId: user.uid });
        } else {
          const ref = doc(collection(db, 'parties'));
          await setDoc(ref, { 
            ...partyData, 
            id: ref.id, 
            userId: user.uid,
            balance: partyData.balance || 0,
            type: 'receive'
          });
        }
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'parties'); }
    } else {
      // Local fallback
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
    }
    setShowPartyModal(false);
    setEditingParty(null);
  };

  const handleDeleteParty = async (id: string | number) => {
    if (user) {
      try { await deleteDoc(doc(db, 'parties', id as string)); }
      catch (err) { handleFirestoreError(err, OperationType.DELETE, `parties/${id}`); }
    } else {
      setParties(prev => prev.filter(p => p.id !== id));
    }
    setShowPartyModal(false);
    setEditingParty(null);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const handleSaveItem = async (itemData: Partial<InventoryItem>) => {
    if (user) {
      try {
        if (itemData.id) {
          await updateDoc(doc(db, 'inventory', itemData.id as string), { ...itemData, userId: user.uid });
        } else {
          const ref = doc(collection(db, 'inventory'));
          await setDoc(ref, { 
            ...itemData, 
            id: ref.id, 
            userId: user.uid,
            stock: itemData.stock || 0,
            minStock: itemData.minStock || 0
          });
        }
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'inventory'); }
    } else {
      if (itemData.id) {
          setItems(prev => prev.map(i => i.id === itemData.id ? { ...i, ...itemData as InventoryItem } : i));
      } else {
          const newItem: InventoryItem = {
              ...itemData as InventoryItem,
              id: Date.now().toString(),
              stock: itemData.stock || 0,
              minStock: itemData.minStock || 0
          };
          setItems([...items, newItem]);
      }
    }
    setShowItemModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async (id: string | number) => {
    if (user) {
      try { await deleteDoc(doc(db, 'inventory', id as string)); }
      catch (err) { handleFirestoreError(err, OperationType.DELETE, `inventory/${id}`); }
    } else {
      setItems(prev => prev.filter(i => i.id !== id));
    }
    setShowItemModal(false);
    setEditingItem(null);
  };

  const handleConvertToSale = async (estimateId: string, type: 'SALE' | 'SALE_ORDER') => {
    // Both SALE and SALE_ORDER conversions should open the Sale Form with estimate data
    setConvertingEstimateId(estimateId);
    setCurrentView('SALE_FORM');
    
    // Optionally mark it as closed if it's a one-way conversion, 
    // but typically we wait for the sale to be saved.
    // However, the original code for SALE_ORDER was closing it immediately.
    // Let's stick to opening the form for both as requested.
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

  const handleSaveInvoice = async (inv: Estimate, isSale: boolean, printAndPreview: boolean) => {
      if (user) {
        inv.userId = user.uid;
        inv.isSale = isSale;
        try {
          if (editingInvoice) {
            await updateDoc(doc(db, 'transactions', editingInvoice.id), { ...inv });
            setEditingInvoice(null);
          } else {
            if (isSale && convertingEstimateId) {
              await updateDoc(doc(db, 'transactions', convertingEstimateId), { status: 'Closed' });
              setConvertingEstimateId(null);
            }
            
            // Party management
            if (inv.customerName) {
              const partyIndex = parties.findIndex(p => p.name.toLowerCase() === inv.customerName.toLowerCase());
              if (partyIndex >= 0) {
                if (isSale) {
                  await updateDoc(doc(db, 'parties', parties[partyIndex].id as string), {
                    balance: (parties[partyIndex].balance || 0) + inv.totalAmount
                  });
                }
                inv.partyId = parties[partyIndex].id;
              } else {
                const partyRef = doc(collection(db, 'parties'));
                const newParty = {
                  id: partyRef.id,
                  userId: user.uid,
                  name: inv.customerName,
                  phone: inv.customerPhone || '',
                  email: '',
                  billingAddress: inv.billingAddress || '',
                  balance: isSale ? inv.totalAmount : 0,
                  type: 'receive'
                };
                await setDoc(partyRef, newParty);
                inv.partyId = partyRef.id;
              }
            }
            
            // Transaction save
            const txnRef = doc(collection(db, 'transactions'));
            inv.id = txnRef.id;
            await setDoc(txnRef, inv);
          }
        } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'transactions'); }
      } else {
        // LOCAL FALLBACK
        if (editingInvoice) {
            if (isSale) {
                setSales(prev => prev.map(s => s.id === editingInvoice.id ? { ...inv, id: editingInvoice.id } : s));
            } else {
                setEstimates(prev => prev.map(e => e.id === editingInvoice.id ? { ...inv, id: editingInvoice.id } : e));
            }
            setEditingInvoice(null);
        } else {
            if (isSale && convertingEstimateId) {
                setEstimates(prev => prev.map(e => e.id === convertingEstimateId ? { ...e, status: 'Closed' } : e));
                setConvertingEstimateId(null);
            }
            
            if (inv.customerName) {
                let updatedParties = [...parties];
                let partyIndex = updatedParties.findIndex(p => p.name.toLowerCase() === inv.customerName.toLowerCase());
                if (partyIndex >= 0) {
                    if (isSale) updatedParties[partyIndex] = { ...updatedParties[partyIndex], balance: (updatedParties[partyIndex].balance || 0) + inv.totalAmount };
                } else {
                    const newParty: Party = { id: Date.now().toString() + "_party", name: inv.customerName, phone: inv.customerPhone || '', email: '', billingAddress: inv.billingAddress || '', balance: isSale ? inv.totalAmount : 0, type: 'receive' };
                    updatedParties.push(newParty);
                    inv.partyId = newParty.id;
                }
                setParties(updatedParties);
            }
            
            if (isSale) setSales([...sales, inv]);
            else setEstimates([...estimates, inv]);
        }
      }

      if (printAndPreview) {
          setCurrentInvoice(inv);
          setCurrentView('INVOICE_VIEW');
      } else {
          setCurrentView(isSale ? 'SALE_LIST' : 'ESTIMATE_LIST');
      }
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <RefreshCw size={40} className="text-indigo-600 animate-spin" />
      </div>
    );
  }

  const handleUpdateCompanyData = async (newData: CompanyData) => {
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'settings', 'profile'), { ...newData, userId: user.uid });
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/settings/profile`); }
    } else {
      setCompanyData(newData);
    }
  };

  return (
    <div id="app-container">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onAction={handleAction} 
        companyData={companyData} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <main id="main-content">
        <TopHeader title={companyData.name} onAction={handleAction} />
        
        {/* Auth Banner */}
        <div className="bg-white border-b border-slate-200 px-6 py-2 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Cloud size={16} className="text-green-500" />
                <span className="text-slate-600">Cloud Sync Active ({user.email})</span>
              </>
            ) : (
              <>
                <CloudOff size={16} className="text-slate-400" />
                <span className="text-slate-600">
                  {authError ? (
                    <span className="text-red-500 font-medium">{authError}</span>
                  ) : (
                    "Local Data Only. Sign in to back up."
                  )}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button 
                  onClick={migrateToCloud}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
                  disabled={dataSyncing}
                >
                  <RefreshCw size={14} className={dataSyncing ? 'animate-spin' : ''} />
                  Backup Now
                </button>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={handleSignIn}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <LogIn size={14} />
                Sign In with Google
              </button>
            )}
          </div>
        </div>

        <div id="module-container">
          {currentView === 'HOME' && <DashboardModule sales={sales} parties={parties} items={items} onNavigate={setCurrentView} />}
          {currentView === 'SALE_LIST' && <HomeModule sales={sales} onAddSale={() => setCurrentView('SALE_FORM')} onEditSale={handleEditSale} onViewSale={handleViewInvoice} />}
          {currentView === 'PARTIES_LIST' && (
            <PartiesModule 
              parties={parties} 
              sales={sales} 
              estimates={estimates} 
              onAddParty={() => { setEditingParty({}); setShowPartyModal(true); }} 
              onEditParty={handleEditParty}
              onEditSale={handleEditSale}
              onEditEstimate={handleEditEstimate}
              onViewTransaction={handleViewInvoice}
            />
          )}
          {currentView === 'ITEMS_LIST' && <ItemsModule items={items} onAddItem={() => { setEditingItem({}); setShowItemModal(true); }} onEditItem={handleEditItem} />}
          {currentView === 'ESTIMATE_LIST' && <EstimatesModule estimates={estimates} onAddEstimate={() => setCurrentView('ESTIMATE_FORM')} onConvertToSale={handleConvertToSale} onEditEstimate={handleEditEstimate} onViewEstimate={handleViewInvoice} />}
          {currentView === 'SALE_FORM' && <InvoiceForm isSale={true} onSave={(sale, print) => handleSaveInvoice(sale, true, print)} onCancel={() => { setConvertingEstimateId(null); setEditingInvoice(null); setCurrentView('SALE_LIST'); }} initialData={editingInvoice || (convertingEstimateId ? estimates.find(e => e.id === convertingEstimateId) : undefined)} parties={parties} items={items} />}
          {currentView === 'ESTIMATE_FORM' && <InvoiceForm isSale={false} onSave={(est, print) => handleSaveInvoice(est, false, print)} onCancel={() => { setEditingInvoice(null); setCurrentView('ESTIMATE_LIST'); }} initialData={editingInvoice || undefined} parties={parties} items={items} />}
          {currentView === 'INVOICE_VIEW' && currentInvoice && (
             <InvoiceView 
                estimate={currentInvoice} 
                companyData={companyData} 
                setCompanyData={handleUpdateCompanyData} 
                onBack={() => setCurrentView(currentInvoice.isSale ? 'SALE_LIST' : 'ESTIMATE_LIST')} 
             />
          )}
          {currentView === 'PROFILE_EDIT' && (
             <SettingsModule 
                companyData={companyData} 
                onChange={handleUpdateCompanyData} 
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
      {showItemModal && editingItem && (
          <ItemFormModal 
            item={editingItem}
            onSave={handleSaveItem}
            onCancel={() => { setShowItemModal(false); setEditingItem(null); }}
            onDelete={handleDeleteItem}
          />
      )}
    </div>
  );
}


