import React, { useState } from 'react';
import { Estimate } from './types';
import { FileText } from 'lucide-react';

export function EstimatesModule({ estimates, onAddEstimate, onConvertToSale, onEditEstimate, onViewEstimate, onDeleteEstimate }: { estimates: Estimate[], onAddEstimate: () => void, onConvertToSale: (id: string, type: 'SALE' | 'SALE_ORDER') => void, onEditEstimate: (est: Estimate) => void, onViewEstimate: (est: Estimate) => void, onDeleteEstimate?: (id: string) => void }) {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const totalQuotations = estimates.reduce((sum, e) => sum + e.totalAmount, 0);
    const converted = estimates.filter(e => e.status === 'Closed').reduce((sum, e) => sum + e.totalAmount, 0);
    const open = estimates.filter(e => e.status !== 'Closed').reduce((sum, e) => sum + e.totalAmount, 0);

    return (
        <div style={{ flex: 1, backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }} onClick={() => setOpenDropdownId(null)}>
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
                        <span>Closed: <b style={{ color: '#111827' }}>Rs {converted.toLocaleString('en-IN')}</b></span>
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
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Inv No</th>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Ref No</th>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Party Name</th>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>Balance</th>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estimates.map(est => {
                                    const isOpen = est.status !== 'Closed';
                                    return (
                                        <tr key={est.id} style={{ borderBottom: '1px solid #E5E7EB', cursor: 'pointer' }} className="hover:bg-slate-50 transition-colors" onClick={() => onViewEstimate(est)}>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>{est.date}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>{est.refNo}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>{est.customerRefNo || '-'}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', fontWeight: 500 }}>
                                                <div style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={est.customerName}>
                                                    {est.customerName}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', textAlign: 'right' }}>Rs {est.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', textAlign: 'right' }}>Rs {est.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center' }}>
                                                <span style={{ backgroundColor: isOpen ? '#fef3c7' : '#d1fae5', color: isOpen ? '#d97706' : '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                                                    {isOpen ? 'Open' : 'Closed'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="relative inline-block text-left">
                                                    <button 
                                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenDropdownId(openDropdownId === est.id ? null : est.id);
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-ellipsis-vertical px-1"></i>
                                                    </button>
                                                    {openDropdownId === est.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 ring-1 ring-black ring-opacity-5 z-10 transition-all">
                                                            <div className="py-1">
                                                                <button 
                                                                    className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                                                                    onClick={(e) => { e.stopPropagation(); onViewEstimate(est); setOpenDropdownId(null); }}
                                                                >
                                                                    <i className="fa-solid fa-print w-5"></i> Print / PDF
                                                                </button>
                                                                <button 
                                                                    className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                                                                    onClick={(e) => { e.stopPropagation(); onEditEstimate(est); setOpenDropdownId(null); }}
                                                                >
                                                                    <i className="fa-solid fa-pen-to-square w-5"></i> Edit
                                                                </button>
                                                                {isOpen && (
                                                                    <>
                                                                        <button 
                                                                            className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 border-t border-slate-100 mt-1 pt-1.5"
                                                                            onClick={(e) => { e.stopPropagation(); onConvertToSale(est.id, 'SALE'); setOpenDropdownId(null); }}
                                                                        >
                                                                            <i className="fa-solid fa-file-invoice-dollar w-5 text-emerald-500"></i> Convert to Sale
                                                                        </button>
                                                                        <button 
                                                                            className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                                                                            onClick={(e) => { e.stopPropagation(); onConvertToSale(est.id, 'SALE_ORDER'); setOpenDropdownId(null); }}
                                                                        >
                                                                            <i className="fa-solid fa-file-signature w-5 text-emerald-500"></i> Convert to Order
                                                                        </button>
                                                                    </>
                                                                )}
                                                                <button 
                                                                    className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100 mt-1 pt-1.5"
                                                                    onClick={(e) => { e.stopPropagation(); onDeleteEstimate?.(est.id); setOpenDropdownId(null); }}
                                                                >
                                                                    <i className="fa-solid fa-trash w-5"></i> Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
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
