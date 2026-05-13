import React, { useState } from 'react';
import { Party, Estimate } from './types';

export function PartiesModule({ parties, sales, estimates, onAddParty }: { parties: Party[], sales: Estimate[], estimates: Estimate[], onAddParty: () => void }) {
    const [selectedParty, setSelectedParty] = useState<Party | null>(parties[0] || null);
    
    // Derived transactions for selected party (mock)
    const partyTransactions = sales.filter(s => s.partyId === selectedParty?.id || s.customerName === selectedParty?.name);

    return (
        <div className="split-view">
            <div className="split-left">
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary-red" style={{ flex: 1 }} onClick={onAddParty}><i className="fa-solid fa-plus"></i> Add Party</button>
                    <button className="btn btn-icon" style={{ background: '#f3f4f6' }}><i className="fa-solid fa-filter"></i></button>
                </div>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
                    <div className="search-box" style={{ background: '#f3f4f6', flex: 1, border: 'none', color: '#6b7280' }}>
                        <i className="fa-solid fa-search" style={{ marginRight: '8px' }}></i>
                        <input type="text" placeholder="Search Party" style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }} />
                    </div>
                </div>
                <div style={{ padding: '12px 16px', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)' }}>
                    <span>Party</span>
                    <span>Amount</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {parties.map(party => (
                        <div 
                            key={party.id} 
                            style={{ 
                                padding: '16px', 
                                borderBottom: '1px solid var(--border-color)', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                cursor: 'pointer',
                                background: selectedParty?.id === party.id ? '#f3f4f6' : '#fff'
                            }}
                            onClick={() => setSelectedParty(party)}
                        >
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>{party.name}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{party.phone}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>Rs {party.balance}</div>
                                <div style={{ fontSize: '11px', color: party.balance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                    {party.balance >= 0 ? "You'll Get" : "You'll Pay"}
                                </div>
                            </div>
                        </div>
                    ))}
                    {parties.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No parties added yet</div>}
                </div>
            </div>
            
            <div className="split-right">
                {selectedParty ? (
                    <>
                        <div style={{ padding: '20px', background: '#fff', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>{selectedParty.name}</h2>
                                <p style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="fa-solid fa-phone"></i> {selectedParty.phone || 'No phone'}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn" style={{ background: '#f3f4f6', color: '#4b5563' }}><i className="fa-solid fa-download"></i> Report</button>
                            </div>
                        </div>
                        
                        <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
                            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>{selectedParty.balance >= 0 ? "You'll Get" : "You'll Pay"}</div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: selectedParty.balance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>Rs {Math.abs(selectedParty.balance).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                                </div>
                                <i className="fa-solid fa-money-bill-wave" style={{ fontSize: '32px', color: '#f3f4f6' }}></i>
                            </div>
                        </div>
                        
                        <div style={{ flex: 1, padding: '0 20px 20px', overflowY: 'auto' }}>
                            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: '#f9fafb' }}>
                                        <tr>
                                            <th>Date</th>
                                            <th>Txn Type</th>
                                            <th>Ref No</th>
                                            <th>Payment Type</th>
                                            <th className="text-right">Total</th>
                                            <th className="text-right">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {partyTransactions.map(txn => (
                                            <tr key={txn.id}>
                                                <td>{txn.date}</td>
                                                <td>Sale</td>
                                                <td>{txn.refNo}</td>
                                                <td>{txn.paymentType || 'Cash'}</td>
                                                <td className="text-right">Rs {txn.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                                <td className="text-right">Rs {txn.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                            </tr>
                                        ))}
                                        {partyTransactions.length === 0 && (
                                            <tr>
                                                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>No transactions found for this party</td>
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
