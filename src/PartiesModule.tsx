import React, { useState } from 'react';
import { Party, Estimate } from './types';

export function PartiesModule({ parties, sales, estimates, onAddParty, onEditParty, onEditSale, onEditEstimate, onViewTransaction }: { 
    parties: Party[], 
    sales: Estimate[], 
    estimates: Estimate[], 
    onAddParty: () => void, 
    onEditParty: (party: Party) => void,
    onEditSale: (sale: Estimate) => void,
    onEditEstimate: (estimate: Estimate) => void,
    onViewTransaction: (txn: Estimate) => void
}) {
    const [selectedParty, setSelectedParty] = useState<Party | null>(parties[0] || null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    
    // Derived transactions for selected party
    const partySales = sales.filter(s => s.partyId === selectedParty?.id || s.customerName === selectedParty?.name).map(s => ({...s, txnType: 'Sale'}));
    const partyEstimates = estimates.filter(e => e.partyId === selectedParty?.id || e.customerName === selectedParty?.name).map(e => ({...e, txnType: 'Estimate'}));
    const partyTransactions = [...partySales, ...partyEstimates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleEditTxn = (txn: any) => {
        if (txn.txnType === 'Sale') {
            onEditSale(txn);
        } else {
            onEditEstimate(txn);
        }
        setMenuOpenId(null);
    };

    return (
        <div style={{ flex: 1, display: 'flex', backgroundColor: '#f3f4f6' }} onClick={() => setMenuOpenId(null)}>
            {/* Left Sidebar */}
            <div style={{ width: '320px', backgroundColor: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <i className="fa-solid fa-search" style={{ position: 'absolute', left: '12px', top: '10px', color: '#9ca3af', fontSize: '14px' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search Party Name" 
                            style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                        />
                    </div>
                </div>
                
                <div style={{ padding: '8px 16px', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Party Name <i className="fa-solid fa-filter" style={{ color: '#ef4444', fontSize: '10px' }}></i></div>
                    <div>Amount</div>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {parties.map(party => (
                        <div 
                            key={party.id} 
                            style={{ 
                                padding: '16px', 
                                borderBottom: '1px solid #e5e7eb', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                cursor: 'pointer',
                                background: selectedParty?.id === party.id ? '#e0f2fe' : '#fff'
                            }}
                            onClick={() => setSelectedParty(party)}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', textTransform: 'uppercase', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={party.name}>
                                    {party.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{party.phone || 'No phone'}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '14px', color: party.balance >= 0 ? '#10b981' : '#ef4444', fontWeight: 500 }}>
                                    {Math.abs(party.balance).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                                </div>
                                <div style={{ fontSize: '10px', color: '#9ca3af' }}>{party.balance >= 0 ? 'Receivable' : 'Payable'}</div>
                            </div>
                        </div>
                    ))}
                    {parties.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No parties added yet</div>}
                </div>
                
                <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', backgroundColor: '#ecfdf5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-regular fa-address-book" style={{ color: '#10b981', fontSize: '20px' }}></i>
                        <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.2 }}>Use contacts from your Phone or<br/>Gmail to <b>quickly create parties</b></span>
                     </div>
                     <i className="fa-solid fa-chevron-right" style={{ color: '#10b981', fontSize: '12px' }}></i>
                </div>
            </div>
            
            {/* Right Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedParty ? (
                    <>
                        <div style={{ padding: '16px 24px', background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', color: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                                    {selectedParty.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', textTransform: 'uppercase', margin: 0, maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={selectedParty.name}>{selectedParty.name}</h2>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Phone: <b>{selectedParty.phone || 'NA'}</b></span>
                                        <i className="fa-solid fa-pen-to-square" style={{ color: '#3b82f6', fontSize: '12px', cursor: 'pointer' }} onClick={() => onEditParty(selectedParty)}></i>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ textAlign: 'right', marginRight: '16px' }}>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Current Balance</div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: selectedParty.balance >= 0 ? '#10b981' : '#ef4444' }}>
                                        Rs {Math.abs(selectedParty.balance).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                                        <span style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: '4px' }}>{selectedParty.balance >= 0 ? '(Cr)' : '(Dr)'}</span>
                                    </div>
                                </div>
                                <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: '24px', cursor: 'pointer' }}></i>
                                <i className="fa-solid fa-file-pdf" style={{ color: '#ef4444', fontSize: '24px', cursor: 'pointer' }}></i>
                            </div>
                        </div>
                        
                        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                             <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                                <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#374151', margin: 0 }}>Transactions</h3>
                                    <div style={{ display: 'flex', gap: '16px', color: '#6b7280' }}>
                                        <i className="fa-solid fa-magnifying-glass" style={{ cursor: 'pointer' }}></i>
                                        <i className="fa-solid fa-print" style={{ cursor: 'pointer' }}></i>
                                        <i className="fa-solid fa-file-excel" style={{ color: '#10b981', cursor: 'pointer' }}></i>
                                    </div>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Type <i className="fa-solid fa-filter" style={{ fontSize: '10px', marginLeft: '4px' }}></i></th>
                                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Number <i className="fa-solid fa-filter" style={{ fontSize: '10px', marginLeft: '4px' }}></i></th>
                                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Date <i className="fa-solid fa-filter" style={{ fontSize: '10px', marginLeft: '4px' }}></i></th>
                                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textAlign: 'right' }}>Total <i className="fa-solid fa-filter" style={{ fontSize: '10px', marginLeft: '4px' }}></i></th>
                                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textAlign: 'right' }}>Balance <i className="fa-solid fa-filter" style={{ fontSize: '10px', marginLeft: '4px' }}></i></th>
                                            <th style={{ width: '60px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {partyTransactions.map(txn => (
                                            <tr key={txn.id} style={{ borderBottom: '1px solid #e5e7eb' }} className="hover:bg-slate-50">
                                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }} onClick={() => onViewTransaction(txn)}>{txn.txnType}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }} onClick={() => onViewTransaction(txn)}>{txn.refNo}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }} onClick={() => onViewTransaction(txn)}>{txn.date}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151', textAlign: 'right' }} onClick={() => onViewTransaction(txn)}>Rs {txn.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151', textAlign: 'right' }} onClick={() => onViewTransaction(txn)}>Rs {(txn.txnType === 'Sale' ? txn.balance : 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                                <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}>
                                                    <i 
                                                        className="fa-solid fa-ellipsis-vertical cursor-pointer p-2 hover:bg-slate-200 rounded-full" 
                                                        style={{ color: '#9ca3af' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMenuOpenId(menuOpenId === txn.id ? null : txn.id);
                                                        }}
                                                    ></i>
                                                    {menuOpenId === txn.id && (
                                                        <div style={{ position: 'absolute', right: '10px', top: '35px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', zIndex: 10, width: '120px' }}>
                                                            <div 
                                                                style={{ padding: '8px 12px', fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}
                                                                className="hover:bg-slate-100"
                                                                onClick={(e) => { e.stopPropagation(); onViewTransaction(txn); setMenuOpenId(null); }}
                                                            >
                                                                <i className="fa-solid fa-eye" style={{ marginRight: '8px', color: '#6b7280' }}></i> View
                                                            </div>
                                                            <div 
                                                                style={{ padding: '8px 12px', fontSize: '13px', textAlign: 'left', cursor: 'pointer', borderTop: '1px solid #f3f4f6' }}
                                                                className="hover:bg-slate-100"
                                                                onClick={(e) => { e.stopPropagation(); handleEditTxn(txn); }}
                                                            >
                                                                <i className="fa-solid fa-pen" style={{ marginRight: '8px', color: '#3b82f6' }}></i> Edit
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {partyTransactions.length === 0 && (
                                            <tr>
                                                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '14px' }}>No transactions found for this party</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
                        <i className="fa-solid fa-users" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.2 }}></i>
                        <p>Select a party to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
