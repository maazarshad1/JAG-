import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { View, Estimate, CompanyData, Party, InventoryItem } from './types';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { HomeModule } from './HomeModule';
import { DashboardModule } from './DashboardModule';
import { ReportsModule } from './ReportsModule';
import { EstimatesModule } from './EstimatesModule';
import { PartiesModule } from './PartiesModule';
import { ItemsModule } from './ItemsModule';
import { InvoiceView } from './InvoiceView';
import { InvoiceForm } from './InvoiceForm';
import { PartyFormModal } from './PartyFormModal';
import { ItemFormModal } from './ItemFormModal';
import { SettingsModule } from './SettingsModule';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { PaymentInModal } from './PaymentInModal';
import { PaymentInModule } from './PaymentInModule';
import { 
  getAuthService, getDatabaseService, googleProvider, 
  handleFirestoreError, OperationType, 
  testConnection 
} from './firebase';
import { 
  signInWithPopup, signInAnonymously, onAuthStateChanged, User, signOut 
} from 'firebase/auth';
import { 
  doc, setDoc, getDoc, getDocs, 
  collection, query, where, onSnapshot, 
  writeBatch, deleteDoc, updateDoc 
} from 'firebase/firestore';
import { RefreshCw, FileDown, Settings } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function App() {
  const auth = getAuthService();
  const db = getDatabaseService();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataSyncing, setDataSyncing] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [currentInvoice, setCurrentInvoice] = useState<Estimate | null>(null);
  const [paymentInSale, setPaymentInSale] = useState<Estimate | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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
      if (u) {
        setUser(u);
        setAuthLoading(false);
      } else {
        // Sign in anonymously so everyone can access shared Firestore database
        signInAnonymously(auth).catch((error) => console.error("Anonymous auth failed", error));
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync data with Firestore
  useEffect(() => {
    if (!user) {
      // Load local data if no user
      const savedSales = localStorage.getItem('vyapar_sales');
      const savedEstimates = localStorage.getItem('vyapar_estimates');
      const savedParties = localStorage.getItem('vyapar_parties');
      const savedItems = localStorage.getItem('vyapar_items');
      const savedCompany = localStorage.getItem('vyapar_company');

      if (savedSales) setSales(JSON.parse(savedSales));
      if (savedEstimates) setEstimates(JSON.parse(savedEstimates));
      if (savedParties) setParties(JSON.parse(savedParties));
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedCompany) setCompanyData(JSON.parse(savedCompany));
      
      return;
    };

    // Check for local data migration on first sync
    const hasLocalData = localStorage.getItem('vyapar_company') || 
                        localStorage.getItem('vyapar_sales') || 
                        localStorage.getItem('vyapar_items');
    
    if (hasLocalData) {
      console.log("Local data found, initiating silent migration...");
      migrateToCloud();
    }

    // Subscribe to collections
    setDataSyncing(true);
    
    // 1. Shared Business Profile
    const companyProfileRef = doc(db, 'settings', 'company');
    const unsubCompanyProfile = onSnapshot(companyProfileRef, async (snap) => {
      if (snap.exists()) {
        setCompanyData(snap.data() as CompanyData);
      } else {
        // Initialize shared profile if it doesn't exist
        await setDoc(companyProfileRef, companyData);
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/company'));

    // 2. Shared Parties
    const unsubParties = onSnapshot(collection(db, 'parties'), (snap) => {
      setParties(snap.docs.map(d => ({ ...d.data(), id: d.id }) as Party));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'parties'));

    // 3. Shared Items
    const unsubItems = onSnapshot(collection(db, 'inventory'), (snap) => {
      setItems(snap.docs.map(d => ({ ...d.data(), id: d.id }) as InventoryItem));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'inventory'));

    // 4. Shared Transactions
    const unsubTxns = onSnapshot(collection(db, 'transactions'), (snap) => {
      const allTxns = snap.docs.map(d => ({ ...d.data(), id: d.id }) as Estimate);
      setSales(allTxns.filter(t => t.isSale));
      setEstimates(allTxns.filter(t => !t.isSale));
      setDataSyncing(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'transactions'));

    return () => {
      unsubCompanyProfile();
      unsubParties();
      unsubItems();
      unsubTxns();
    };
  }, [user]);

  // Persist local data if no user
  useEffect(() => {
    if (user) return;
    localStorage.setItem('vyapar_sales', JSON.stringify(sales));
    localStorage.setItem('vyapar_estimates', JSON.stringify(estimates));
    localStorage.setItem('vyapar_parties', JSON.stringify(parties));
    localStorage.setItem('vyapar_items', JSON.stringify(items));
    localStorage.setItem('vyapar_company', JSON.stringify(companyData));
  }, [sales, estimates, parties, items, companyData, user]);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Sign in failed", error);
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError(`Domain ${window.location.hostname} is not authorized. Please add it to Firebase Console.`);
      } else {
        setAuthError(`Sign-in failed: ${error.message}`);
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
      batch.set(doc(db, 'settings', 'company'), companyData);

      // Migrate Parties
      const savedParties = localStorage.getItem('vyapar_parties');
      if (savedParties) {
        const pList = JSON.parse(savedParties) as Party[];
        pList.forEach(p => {
          const ref = doc(db, 'parties', String(p.id!));
          batch.set(ref, p);
        });
      }

      // Migrate Items
      const savedItems = localStorage.getItem('vyapar_items');
      if (savedItems) {
        const iList = JSON.parse(savedItems) as InventoryItem[];
        iList.forEach(i => {
          const ref = doc(db, 'inventory', String(i.id!));
          batch.set(ref, i);
        });
      }

      // Migrate Sales
      const savedSales = localStorage.getItem('vyapar_sales');
      if (savedSales) {
        const sList = JSON.parse(savedSales) as Estimate[];
        sList.forEach(s => {
          const ref = doc(db, 'transactions', s.id);
          batch.set(ref, { ...s, isSale: true });
        });
      }

      // Migrate Estimates
      const savedEstimates = localStorage.getItem('vyapar_estimates');
      if (savedEstimates) {
        const eList = JSON.parse(savedEstimates) as Estimate[];
        eList.forEach(e => {
          const ref = doc(db, 'transactions', e.id);
          batch.set(ref, { ...e, isSale: false });
        });
      }

      await batch.commit();
      console.log("Migration successful");
      localStorage.clear();
    } catch (error: any) {
      console.error("Migration failed detailed error:", error);
    } finally {
      setDataSyncing(false);
    }
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Sales Sheet
    const salesData = sales.map(s => ({
        'Ref No': s.refNo,
        'Type': s.isSale ? 'Sale' : 'Estimate',
        'Date': s.date,
        'Customer': s.customerName,
        'Phone': s.customerPhone || '',
        'Total Amount': s.totalAmount,
        'Amount Received': s.amountReceived,
        'Balance Due': s.totalAmount - s.amountReceived,
        'Status': s.status
    }));
    const wsSales = XLSX.utils.json_to_sheet(salesData);
    XLSX.utils.book_append_sheet(wb, wsSales, "Transactions");

    // Parties Sheet
    const partiesData = parties.map(p => ({
        'Name': p.name,
        'Phone': p.phone,
        'Email': p.email || '',
        'Address': p.billingAddress || '',
        'Balance': p.balance,
        'Type': p.type
    }));
    const wsParties = XLSX.utils.json_to_sheet(partiesData);
    XLSX.utils.book_append_sheet(wb, wsParties, "Parties");

    // Inventory Sheet
    const inventoryData = items.map(i => ({
        'Item Name': i.name,
        'Stock': i.stock,
        'Unit': i.unit,
        'Sale Price': i.price,
        'Purchase Price': i.purchasePrice || 0,
        'Category': i.category || ''
    }));
    const wsInventory = XLSX.utils.json_to_sheet(inventoryData);
    XLSX.utils.book_append_sheet(wb, wsInventory, "Inventory");

    XLSX.writeFile(wb, `BusinessData_${companyData.name || 'Export'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleAction = (action: string) => {
    if (action === 'ADD_SALE') setCurrentView('SALE_FORM');
    if (action === 'ADD_ESTIMATE') setCurrentView('ESTIMATE_FORM');
    if (action === 'ADD_PARTY') {
        const nextRef = (parties || []).reduce((max, p) => {
          const val = parseInt(String(p?.customerRefNo || 0), 10);
          return isNaN(val) ? max : Math.max(max, val);
        }, 0) + 1;
        setEditingParty({ customerRefNo: isNaN(nextRef) ? 1 : nextRef });
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
          await updateDoc(ref, { ...partyData });
        } else {
          const ref = doc(collection(db, 'parties'));
          await setDoc(ref, { 
            ...partyData, 
            customerRefNo: Number(partyData.customerRefNo) || (parties || []).reduce((max, p) => {
              const val = parseInt(String(p?.customerRefNo || 0), 10);
              return isNaN(val) ? max : Math.max(max, val);
            }, 0) + 1,
            id: ref.id, 
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
              customerRefNo: Number(partyData.customerRefNo) || parties.reduce((max, p) => {
                const val = Number(p.customerRefNo);
                return isNaN(val) ? max : Math.max(max, val);
              }, 0) + 1,
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

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const handleSaveItem = async (itemData: Partial<InventoryItem>) => {
    if (user) {
      try {
        if (itemData.id) {
          await updateDoc(doc(db, 'inventory', itemData.id as string), { ...itemData });
        } else {
          const ref = doc(collection(db, 'inventory'));
          await setDoc(ref, { 
            ...itemData, 
            id: ref.id, 
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
    setCurrentView(inv.isSale ? 'SALE_FORM' : 'ESTIMATE_FORM');
  };

  const [deleteAction, setDeleteAction] = useState<{type: 'transaction'|'party'|'item', id: string, name?: string} | null>(null);

  const handleDeleteSale = async (id: string) => {
    setDeleteAction({ type: 'transaction', id });
  };

  const handleSavePaymentIn = async (
    saleId: string | null, 
    amount: number, 
    paymentType: 'Cash' | 'Cheque' | 'Online', 
    newPartyBalance: number,
    partyDataInput?: { name: string, id?: string | number },
    date?: string,
    refNo?: number,
    description?: string
  ) => {
    let finalPartyId = partyDataInput?.id;
    let finalPartyName = (partyDataInput?.name || 'Customer').trim();
    let finalPartyRefNo = parties.find(p => p.id === finalPartyId)?.customerRefNo;

    // 1. Ensure party exists
    if (finalPartyName && !finalPartyId) {
       const existingParty = parties.find(p => p.name.toLowerCase() === finalPartyName.toLowerCase().trim());
       if (existingParty) {
          finalPartyId = existingParty.id;
          finalPartyName = existingParty.name;
          finalPartyRefNo = existingParty.customerRefNo;
       } else if (user) {
          // Create new party for this payment-in
          const nextRef = parties.reduce((max, p) => {
            const val = Number(p.customerRefNo);
            return isNaN(val) ? max : Math.max(max, val);
          }, 0) + 1;
          const partyRef = doc(collection(db, 'parties'));
          await setDoc(partyRef, {
             id: partyRef.id,
             name: finalPartyName,
             phone: '',
             email: '',
             billingAddress: '',
             customerRefNo: nextRef,
             balance: -amount,
             type: 'receive'
          });
          finalPartyId = partyRef.id;
          finalPartyRefNo = nextRef;
       }
    }

    if (saleId && saleId !== '') {
      // Update existing sale
      const isSale = !!sales.find(s => s.id === saleId);
      const saleList = isSale ? sales : estimates;
      const sale = saleList.find(s => s.id === saleId);
      if (!sale) return;

      const newReceived = (sale.receivedAmount || 0) + amount;
      const newBalance = sale.totalAmount - newReceived;

      const newSaleData = {
        ...sale,
        receivedAmount: newReceived,
        balance: newBalance,
        paymentType: paymentType,
        status: (newBalance <= 0) ? 'Closed' : sale.status
      };

      if (user) {
        try {
          await setDoc(doc(db, 'transactions', saleId), newSaleData);
          if (sale.partyId) {
            await setDoc(doc(db, 'parties', String(sale.partyId)), { balance: newPartyBalance }, { merge: true });
          }
        } catch (err) { handleFirestoreError(err, OperationType.WRITE, `transactions/${saleId}`); }
      } else {
        if (isSale) {
          setSales(prev => prev.map(s => s.id === saleId ? newSaleData as Estimate : s));
        } else {
          setEstimates(prev => prev.map(s => s.id === saleId ? newSaleData as Estimate : s));
        }
        if (sale.partyId) {
          setParties(prev => prev.map(p => p.id === sale.partyId ? { ...p, balance: newPartyBalance } as Party : p));
        }
      }
    } else {
      // Create new general payment-in
      const txnId = Date.now().toString();
      const newPayment: Estimate = {
        id: txnId,
        refNo: refNo || 0,
        date: date || new Date().toISOString().split('T')[0],
        customerName: finalPartyName,
        partyId: String(finalPartyId) || undefined,
        customerRefNo: finalPartyRefNo,
        items: [],
        totalAmount: 0,
        receivedAmount: amount,
        balance: -amount,
        isSale: true,
        paymentType: paymentType,
        status: 'Closed',
        discountValue: 0,
        discountType: 'fixed',
        taxType: 'none',
        description: description || 'Payment-In received'
      };

      // Auto-apply to open transactions (estimates first, then sales)
      let remaining = amount;
      const updatedTxns: Estimate[] = [];
      if (finalPartyId) {
          const openTxns = [...estimates, ...sales]
            .filter(t => t.partyId === finalPartyId && t.status !== 'Closed' && t.balance > 0)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          for (const txn of openTxns) {
              if (remaining <= 0) break;
              const apply = Math.min(remaining, txn.balance);
              const newRec = (txn.receivedAmount || 0) + apply;
              const newBal = txn.totalAmount - newRec;
              updatedTxns.push({
                  ...txn,
                  receivedAmount: newRec,
                  balance: newBal,
                  status: (newBal <= 0) ? 'Closed' : txn.status
              });
              remaining -= apply;
          }
      }

      if (user) {
        try {
          const batch = writeBatch(db);
          const txnRef = doc(collection(db, 'transactions'));
          newPayment.id = txnRef.id;
          batch.set(txnRef, newPayment);
          
          updatedTxns.forEach(ut => {
              batch.set(doc(db, 'transactions', ut.id), ut);
          });

          if (newPayment.partyId) {
             const isNew = !partyDataInput?.id && !parties.find(p => p.name.toLowerCase() === finalPartyName.toLowerCase().trim());
             if (!isNew) {
               batch.update(doc(db, 'parties', String(newPayment.partyId)), { balance: newPartyBalance });
             }
          }
          await batch.commit();
        } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'transactions'); }
      } else {
        setSales(prev => {
            const updatedSales = [...prev];
            updatedTxns.filter(t => t.isSale).forEach(ut => {
                const idx = updatedSales.findIndex(s => s.id === ut.id);
                if (idx !== -1) updatedSales[idx] = ut;
            });
            return [...updatedSales, newPayment];
        });
        setEstimates(prev => {
            const updatedEsts = [...prev];
            updatedTxns.filter(t => !t.isSale).forEach(ut => {
                const idx = updatedEsts.findIndex(s => s.id === ut.id);
                if (idx !== -1) updatedEsts[idx] = ut;
            });
            return updatedEsts;
        });
        if (newPayment.partyId) {
          setParties(prev => prev.map(p => p.id === newPayment.partyId ? { ...p, balance: newPartyBalance } as Party : p));
        }
      }
    }

    setPaymentInSale(null);
    setCurrentView('PAYMENT_IN_LIST');
  };

  const executeDelete = async () => {
    if (!deleteAction) return;
    const { type, id } = deleteAction;

    if (type === 'transaction') {
      if (user) {
        try {
          await deleteDoc(doc(db, 'transactions', id));
        } catch (err) {
          console.error("Delete failed:", err);
          handleFirestoreError(err, OperationType.DELETE, `transactions/${id}`);
        }
      } else {
        setSales(prev => prev.filter(s => s.id !== id));
        setEstimates(prev => prev.filter(e => e.id !== id));
      }
    } else if (type === 'party') {
      if (user) {
        try { await deleteDoc(doc(db, 'parties', id)); }
        catch (err) { handleFirestoreError(err, OperationType.DELETE, `parties/${id}`); }
      } else {
        setParties(prev => prev.filter(p => p.id !== id));
      }
      setShowPartyModal(false);
      setEditingParty(null);
    } else if (type === 'item') {
      if (user) {
        try { await deleteDoc(doc(db, 'inventory', id)); }
        catch (err) { handleFirestoreError(err, OperationType.DELETE, `inventory/${id}`); }
      } else {
        setItems(prev => prev.filter(i => i.id !== id));
      }
      setShowItemModal(false);
      setEditingItem(null);
    }

    setDeleteAction(null);
  };

  const handleDeleteItem = (id: string | number) => {
    setDeleteAction({ type: 'item', id: String(id) });
  };

  const handleDeleteParty = (id: string | number) => {
    setDeleteAction({ type: 'party', id: String(id) });
  };

  const handleEditEstimate = (est: Estimate) => {
    setEditingInvoice(est);
    setCurrentView('ESTIMATE_FORM');
  };

  const handleViewInvoice = (inv: Estimate) => {
    // If it's a closed estimate, try to find the sale it was converted to
    if (!inv.isSale && inv.status === 'Closed') {
      const associatedSale = sales.find(s => s.convertedFromId === inv.id);
      if (associatedSale) {
        setCurrentInvoice(associatedSale);
        setCurrentView('INVOICE_VIEW');
        return;
      }
    }
    setCurrentInvoice(inv);
    setCurrentView('INVOICE_VIEW');
  };

  const handleSaveInvoice = async (inv: Estimate, isSale: boolean, printAndPreview: boolean) => {
      inv.isSale = isSale;
      if (user) {
        try {
          // 1. Party management (common for both edit and new)
          if (inv.customerName) {
            const partyIndex = parties.findIndex(p => p.name.toLowerCase().trim() === inv.customerName.toLowerCase().trim());
            if (partyIndex >= 0) {
              const party = parties[partyIndex];
              inv.customerRefNo = party.customerRefNo;
              inv.partyId = party.id;
              
              // Sync other details too
              inv.customerPhone = inv.customerPhone || party.phone;
              inv.billingAddress = inv.billingAddress || party.billingAddress;
              
              // Only update balance if it's a new sale or we can calculate delta
              // For simplicity, we merge balance if it's a sale
              if (isSale && !editingInvoice) {
                await updateDoc(doc(db, 'parties', party.id as string), {
                  balance: (party.balance || 0) + inv.totalAmount
                });
              } else if (isSale && editingInvoice && editingInvoice.totalAmount !== inv.totalAmount) {
                // Adjust balance for edited sale
                const delta = inv.totalAmount - editingInvoice.totalAmount;
                await updateDoc(doc(db, 'parties', party.id as string), {
                  balance: (party.balance || 0) + delta
                });
              }
            } else {
              // Create new party
              const nextRef = (parties || []).reduce((max, p) => {
                const val = parseInt(String(p?.customerRefNo || 0), 10);
                return isNaN(val) ? max : Math.max(max, val);
              }, 0) + 1;
              const partyRef = doc(collection(db, 'parties'));
              const newParty = {
                id: partyRef.id,
                name: inv.customerName.trim(),
                phone: inv.customerPhone || '',
                email: '',
                billingAddress: inv.billingAddress || '',
                customerRefNo: isNaN(nextRef) ? 1 : nextRef,
                balance: isSale ? inv.totalAmount : 0,
                type: 'receive'
              };
              await setDoc(partyRef, newParty);
              inv.partyId = partyRef.id;
              inv.customerRefNo = isNaN(nextRef) ? 1 : nextRef;
            }
          }

          // 2. Transaction save
          if (editingInvoice) {
            await updateDoc(doc(db, 'transactions', editingInvoice.id), { ...inv });
            setEditingInvoice(null);
          } else {
            if (isSale && convertingEstimateId) {
              inv.convertedFromId = convertingEstimateId;
              await updateDoc(doc(db, 'transactions', convertingEstimateId), { status: 'Closed' });
              setConvertingEstimateId(null);
            }
            const txnRef = doc(collection(db, 'transactions'));
            inv.id = txnRef.id;
            await setDoc(txnRef, inv);
          }
        } catch (err) { 
          console.error("Save Invoice Error:", err);
          handleFirestoreError(err, OperationType.WRITE, 'transactions'); 
        }
      } else {
        // LOCAL FALLBACK
        // ... (existing local logic)
        if (editingInvoice) {
            if (isSale) {
                setSales(prev => prev.map(s => s.id === editingInvoice.id ? { ...inv, id: editingInvoice.id } : s));
            } else {
                setEstimates(prev => prev.map(e => e.id === editingInvoice.id ? { ...inv, id: editingInvoice.id } : e));
            }
            setEditingInvoice(null);
        } else {
            if (isSale && convertingEstimateId) {
                inv.convertedFromId = convertingEstimateId;
                setEstimates(prev => prev.map(e => e.id === convertingEstimateId ? { ...e, status: 'Closed' } : e));
                setConvertingEstimateId(null);
            }
            
            if (inv.customerName) {
                let updatedParties = [...parties];
                let partyIndex = updatedParties.findIndex(p => p.name.toLowerCase().trim() === inv.customerName.toLowerCase().trim());
                if (partyIndex >= 0) {
                    const party = updatedParties[partyIndex];
                    inv.customerRefNo = party.customerRefNo;
                    if (isSale) updatedParties[partyIndex] = { ...party, balance: (party.balance || 0) + inv.totalAmount };
                } else {
                  const nextRef = (parties || []).reduce((max, p) => {
                    const val = parseInt(String(p?.customerRefNo || 0), 10);
                    return isNaN(val) ? max : Math.max(max, val);
                  }, 0) + 1;
                  const safeNextRef = isNaN(nextRef) ? 1 : nextRef;
                  const newParty: Party = { id: Date.now().toString() + "_party", name: inv.customerName.trim(), phone: inv.customerPhone || '', email: '', billingAddress: inv.billingAddress || '', customerRefNo: safeNextRef, balance: isSale ? inv.totalAmount : 0, type: 'receive' };
                  updatedParties.push(newParty);
                  inv.partyId = newParty.id;
                  inv.customerRefNo = safeNextRef;
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
        await setDoc(doc(db, 'settings', 'company'), newData, { merge: true });
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'settings/company'); }
    } else {
      setCompanyData(newData);
    }
  };

  const maxRefNo = Math.max(...[...sales, ...estimates].map(s => Number(s.refNo || 0)), 0);

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
        <TopHeader title={companyData.name} onAction={handleAction} onSearch={setSearchQuery} />
        
        <div id="module-container">
          {currentView === 'HOME' && (
            <DashboardModule 
              sales={[...sales, ...estimates]}
              parties={parties}
              items={items}
              onNavigate={setCurrentView} 
              onEditSale={handleEditSale}
              onDeleteSale={handleDeleteSale}
              onViewSale={handleViewInvoice}
              onConvertToSale={handleConvertToSale}
              onReceivePayment={(sale) => {
                 setPaymentInSale(sale);
                 setCurrentView('PAYMENT_IN_FORM');
              }}
            />
          )}
          {currentView === 'REPORTS' && <ReportsModule sales={sales} parties={parties} items={items} onNavigate={setCurrentView} onExportExcel={exportToExcel} />}
          {currentView === 'SALE_LIST' && (
            <HomeModule 
              sales={sales.filter(s => s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || String(s.refNo).includes(searchQuery))} 
              onAddSale={() => setCurrentView('SALE_FORM')} 
              onEditSale={handleEditSale} 
              onViewSale={handleViewInvoice} 
              onDeleteSale={handleDeleteSale}
              onMoneyIn={(sale) => {
                  setPaymentInSale(sale);
                  setCurrentView('PAYMENT_IN_FORM');
              }}
            />
          )}
          {currentView === 'PAYMENT_IN_LIST' && (
            <PaymentInModule 
              sales={sales} 
              onViewSale={handleViewInvoice}
              onAddPaymentIn={() => {
                  setPaymentInSale(null);
                  setCurrentView('PAYMENT_IN_FORM');
              }}
            />
          )}
          {currentView === 'PAYMENT_IN_FORM' && (
            <PaymentInModal
              parties={parties}
              initialData={paymentInSale || undefined}
              onClose={() => setCurrentView('PAYMENT_IN_LIST')}
              onSave={(data: any) => handleSavePaymentIn(
                paymentInSale?.id || null, 
                data.receivedAmount, 
                data.paymentType, 
                (parties.find(p => p.id === data.partyId)?.balance || 0) - data.receivedAmount, 
                { id: data.partyId, name: data.customerName }, 
                data.date, 
                paymentInSale?.refNo || 0,
                data.description
              )}
            />
          )}
          {currentView === 'PARTIES_LIST' && (
            <PartiesModule 
              parties={parties} 
              sales={sales} 
              estimates={estimates} 
              onAddParty={() => { 
                const nextRef = (parties || []).reduce((max, p) => {
                  const val = parseInt(String(p?.customerRefNo || 0), 10);
                  return isNaN(val) ? max : Math.max(max, val);
                }, 0) + 1;
                setEditingParty({ customerRefNo: isNaN(nextRef) ? 1 : nextRef }); 
                setShowPartyModal(true); 
              }} 
              onEditParty={handleEditParty}
              onEditSale={handleEditSale}
              onEditEstimate={handleEditEstimate}
              onViewTransaction={handleViewInvoice}
            />
          )}
          {currentView === 'ITEMS_LIST' && <ItemsModule items={items} onAddItem={() => { setEditingItem({}); setShowItemModal(true); }} onEditItem={handleEditItem} />}
          {currentView === 'ESTIMATE_LIST' && (
            <EstimatesModule 
              estimates={estimates} 
              onAddEstimate={() => setCurrentView('ESTIMATE_FORM')} 
              onConvertToSale={handleConvertToSale} 
              onEditEstimate={handleEditEstimate} 
              onViewEstimate={handleViewInvoice} 
              onDeleteEstimate={handleDeleteSale}
            />
          )}
          {currentView === 'SALE_FORM' && <InvoiceForm isSale={true} allTransactions={[...sales, ...estimates]} onSave={(sale) => handleSaveInvoice(sale, true, false)} onCancel={() => { setConvertingEstimateId(null); setEditingInvoice(null); setCurrentView('SALE_LIST'); }} initialData={editingInvoice || (convertingEstimateId ? estimates.find(e => e.id === convertingEstimateId) : undefined)} parties={parties} inventoryItems={items} />}
          {currentView === 'ESTIMATE_FORM' && <InvoiceForm isSale={false} allTransactions={[...sales, ...estimates]} onSave={(est) => handleSaveInvoice(est, false, false)} onCancel={() => { setEditingInvoice(null); setCurrentView('ESTIMATE_LIST'); }} initialData={editingInvoice || undefined} parties={parties} inventoryItems={items} />}
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
      {deleteAction && (
        <DeleteConfirmModal
            title={`Delete ${deleteAction.type}`}
            message={`Are you sure you want to delete this ${deleteAction.type}? This action cannot be undone.`}
            onConfirm={executeDelete}
            onCancel={() => setDeleteAction(null)}
        />
      )}
    </div>
  );
}


