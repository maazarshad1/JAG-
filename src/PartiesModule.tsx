import React, { useState } from 'react';
import { Party, Estimate } from './types';

export function PartiesModule({ parties, sales, estimates, onAddParty }: { parties: Party[], sales: Estimate[], estimates: Estimate[], onAddParty: () => void }) {
    const [selectedParty, setSelectedParty] = useState<Party | null>(parties[0] || null);
    
    // Derived transactions for selected party
    const partySales = sales.filter(s => s.partyId === selectedParty?.id || s.customerName === selectedParty?.name).map(s => ({...s, txnType: 'Sale'}));
    const partyEstimates = estimates.filter(e => e.partyId === selectedParty?.id || e.customerName === selectedParty?.name).map(e => ({...e, txnType: 'Estimate'}));
    const partyTransactions = [...partySales, ...partyEstimates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div style={{ flex: 1, display: 'flex', backgroundColor: '#f3f4f6' }}>
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
                                alignItems: 'flex-start',
                                cursor: 'pointer',
                                background: selectedParty?.id === party.id ? '#e0f2fe' : '#fff'
                            }}
                            onClick={() => setSelectedParty(party)}
                        >
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', textTransform: 'uppercase' }}>
                                {party.name}
                            </div>
                            <div style={{ fontSize: '14px', color: party.balance >= 0 ? '#10b981' : '#ef4444', fontWeight: 500 }}>
                                {Math.abs(party.balance).toLocaleString('en-IN', {minimumFractionDigits: 2})}
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', textTransform: 'uppercase', margin: 0 }}>{selectedParty.name}</h2>
                                <i className="fa-solid fa-pen-to-square" style={{ color: '#3b82f6', fontSize: '14px', cursor: 'pointer' }}></i>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: '20px', cursor: 'pointer' }}></i>
                                <i className="fa-regular fa-clock" style={{ color: '#6b7280', fontSize: '20px', cursor: 'pointer' }}></i>
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
                                            <th style={{ width: '40px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {partyTransactions.map(txn => (
                                            <tr key={txn.id} style={{ borderBottom: '1px solid #e5e7eb' }} className="hover:bg-slate-50 cursor-pointer">
                                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{txn.txnType}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{txn.refNo}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{txn.date}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151', textAlign: 'right' }}>Rs {txn.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151', textAlign: 'right' }}>Rs {(txn.txnType === 'Sale' ? txn.balance : 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                                <td style={{ padding: '12px 16px', textAlign: 'center' }}><i className="fa-solid fa-ellipsis-vertical" style={{ color: '#9ca3af' }}></i></td>
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
