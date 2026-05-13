import React, { useState } from 'react';
import { Estimate } from './types';
import { FileText } from 'lucide-react';

export function EstimatesModule({ estimates, onAddEstimate, onConvertToSale, onEditEstimate, onViewEstimate }: { estimates: Estimate[], onAddEstimate: () => void, onConvertToSale: (id: string, type: 'SALE' | 'SALE_ORDER') => void, onEditEstimate: (est: Estimate) => void, onViewEstimate: (est: Estimate) => void }) {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const totalQuotations = estimates.reduce((sum, e) => sum + e.totalAmount, 0);
    const converted = estimates.filter(e => e.status === 'Converted').reduce((sum, e) => sum + e.totalAmount, 0);
    const open = estimates.filter(e => e.status !== 'Converted').reduce((sum, e) => sum + e.totalAmount, 0);

    return (
        <div style={{ flex: 1, backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
            <div className="module-header" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="module-title" style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>Estimate/Quotation <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px', marginLeft: '8px', color: '#6b7280' }}></i></h2>
                <button className="btn btn-primary-red" onClick={onAddEstimate} style={{ backgroundColor: 'var(--accent-red)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '24px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <i className="fa-solid fa-plus"></i> Add Estimate
                </button>
            </div>
            
            <div style={{ padding: '0 24px 24px 24px' }}>
                <div className="filters-bar" style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Filter by:</span>
                    <select className="filter-dropdown" style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', outline: 'none' }}><option>This Month</option></select>
                    <div className="filter-dropdown" style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <i className="fa-regular fa-calendar" style={{ color: '#6b7280' }}></i> 01/05/2026 To 31/05/2026
                    </div>
                    <select className="filter-dropdown" style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', outline: 'none' }}><option>All Firms</option></select>
                </div>

                <div className="summary-cards" style={{ width: '350px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                            <div className="card-title" style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>Total Quotations</div>
                            <div className="card-amount" style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Rs {totalQuotations.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                        </div>
                        <div style={{ background: '#d1fae5', color: '#10b981', padding: '6px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i className="fa-solid fa-arrow-up"></i> 100%</div>
                            <span style={{ fontSize: '9px', fontWeight: 'normal', color: '#6b7280' }}>vs last month</span>
                        </div>
                    </div>
                    <div className="card-footer" style={{ display: 'flex', fontSize: '12px', color: '#6b7280', borderTop: '1px solid #f3f4f6', paddingTop: '12px', justifyContent: 'space-between' }}>
                        <span>Converted: <b style={{ color: '#111827' }}>Rs {converted.toLocaleString('en-IN')}</b></span>
                        <span style={{ color: '#d1d5db' }}>|</span>
                        <span>Open: <b style={{ color: '#111827' }}>Rs {open.toLocaleString('en-IN')}</b></span>
                    </div>
                </div>

                <div className="table-container" style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    {estimates.length === 0 ? (
                        <div style={{ padding: '64px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ width: '120px', height: '120px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                <FileText size={48} className="text-blue-400" />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>No Transactions to show</h3>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>You haven't added any transactions yet.</p>
                            <button className="btn btn-primary-red" onClick={onAddEstimate} style={{ backgroundColor: 'var(--accent-red)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '24px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fa-solid fa-plus"></i> Add Estimate
                            </button>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Date</th>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Reference No</th>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Party Name</th>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>Balance</th>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estimates.map(est => {
                                    const isOpen = est.status !== 'Converted';
                                    return (
                                        <tr key={est.id} style={{ borderBottom: '1px solid #E5E7EB', cursor: 'pointer' }} className="hover:bg-slate-50 transition-colors" onClick={() => onViewEstimate(est)}>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>{est.date}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>{est.refNo}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', fontWeight: 500, maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{est.customerName}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', textAlign: 'right' }}>Rs {est.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', textAlign: 'right' }}>Rs {est.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center' }}>
                                                <span style={{ backgroundColor: isOpen ? '#fef3c7' : '#d1fae5', color: isOpen ? '#d97706' : '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                                                    {isOpen ? 'Open' : 'Converted'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    {isOpen && (
                                                        <div style={{ display: 'inline-block', position: 'relative' }}>
                                                            <span 
                                                                style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 500, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }} 
                                                                onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === est.id ? null : est.id); }}
                                                            >
                                                                Convert <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
                                                            </span>
                                                            {openDropdownId === est.id && (
                                                                <div style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', zIndex: 10, width: '150px', textAlign: 'left', overflow: 'hidden' }}>
                                                                    <div style={{ padding: '8px 16px', cursor: 'pointer', color: '#374151', fontSize: '13px' }} onClick={(e) => { e.stopPropagation(); onConvertToSale(est.id, 'SALE'); setOpenDropdownId(null); }} className="hover:bg-slate-50">Convert to Sale</div>
                                                                    <div style={{ padding: '8px 16px', cursor: 'pointer', color: '#374151', fontSize: '13px' }} onClick={(e) => { e.stopPropagation(); onConvertToSale(est.id, 'SALE_ORDER'); setOpenDropdownId(null); }} className="hover:bg-slate-50">Convert to Sale Order</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <i className="fa-solid fa-pencil" style={{ color: '#3b82f6', cursor: 'pointer', padding: '4px' }} onClick={(e) => { e.stopPropagation(); onEditEstimate(est); }}></i>
                                                    <i className="fa-solid fa-ellipsis-vertical" style={{ color: '#9ca3af', cursor: 'pointer', padding: '4px' }}></i>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
