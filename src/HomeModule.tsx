import React from 'react';
import { Estimate } from './types';

export function HomeModule({ 
    sales, 
    onAddSale, 
    onEditSale, 
    onViewSale,
    onDeleteSale,
    onMoneyIn
}: { 
    sales: Estimate[], 
    onAddSale: () => void, 
    onEditSale: (sale: Estimate) => void, 
    onViewSale: (sale: Estimate) => void,
    onDeleteSale?: (id: string) => void,
    onMoneyIn?: (sale: Estimate) => void
}) {
    const totalSales = sales.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const balance = sales.reduce((sum, inv) => sum + inv.balance, 0);
    const received = sales.reduce((sum, inv) => sum + (inv.receivedAmount || 0), 0);
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

    return (
        <div style={{ flex: 1, backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }} onClick={() => setOpenMenuId(null)}>
            <div className="module-header" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="module-title" style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>Sale Invoices <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px', marginLeft: '8px', color: '#6b7280' }}></i></h2>
                <button className="btn btn-primary-red" onClick={onAddSale} style={{ backgroundColor: 'var(--accent-red)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '24px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <i className="fa-solid fa-plus"></i> Add Sale
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
                            <div className="card-title" style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>Total Sales</div>
                            <div className="card-amount" style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Rs {totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                        </div>
                        <div style={{ background: '#d1fae5', color: '#10b981', padding: '6px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i className="fa-solid fa-arrow-up"></i> 100%</div>
                            <span style={{ fontSize: '9px', fontWeight: 'normal', color: '#6b7280' }}>vs last month</span>
                        </div>
                    </div>
                    <div className="card-footer" style={{ display: 'flex', fontSize: '12px', color: '#6b7280', borderTop: '1px solid #f3f4f6', paddingTop: '12px', justifyContent: 'space-between' }}>
                        <span>Received: <b style={{ color: '#111827' }}>Rs {received.toLocaleString('en-IN', {minimumFractionDigits: 2})}</b></span>
                        <span style={{ color: '#d1d5db' }}>|</span>
                        <span>Balance: <b style={{ color: '#111827' }}>Rs {balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</b></span>
                    </div>
                </div>

                <div className="table-container" style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Invoice No.</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Party Name</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Type</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Payment</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>Balance</th>
                                <th style={{ padding: '12px 16px', width: '100px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((inv) => {
                                const isFullyPaid = (inv.receivedAmount || 0) >= inv.totalAmount;
                                
                                return (
                                <tr key={inv.id} style={{ borderBottom: '1px solid #E5E7EB', cursor: 'pointer' }} className="hover:bg-slate-50 transition-colors" onClick={() => onViewSale(inv)}>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>{inv.date}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>{inv.refNo}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', fontWeight: 500 }}>
                                        <div style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={inv.customerName}>
                                            {inv.customerName}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>Sale</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>{inv.paymentType || 'Cash'}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'right', color: '#111827' }}>Rs {inv.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'right', color: '#111827' }}>Rs {inv.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block text-left">
                                            <button 
                                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === inv.id ? null : inv.id);
                                                }}
                                            >
                                                <i className="fa-solid fa-ellipsis-vertical px-1"></i>
                                            </button>
                                            {openMenuId === inv.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 ring-1 ring-black ring-opacity-5 z-10 transition-all">
                                                    <div className="py-1">
                                                        <button 
                                                            className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                                                            onClick={(e) => { e.stopPropagation(); onViewSale(inv); setOpenMenuId(null); }}
                                                        >
                                                            <i className="fa-solid fa-print w-5"></i> Print / PDF
                                                        </button>
                                                        <button 
                                                            className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                                                            onClick={(e) => { e.stopPropagation(); onEditSale(inv); setOpenMenuId(null); }}
                                                        >
                                                            <i className="fa-solid fa-pen-to-square w-5"></i> Edit
                                                        </button>
                                                        {!isFullyPaid && (
                                                            <button 
                                                                className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 border-t border-slate-100 mt-1 pt-1.5"
                                                                onClick={(e) => { e.stopPropagation(); onMoneyIn?.(inv); setOpenMenuId(null); }}
                                                            >
                                                                <i className="fa-solid fa-money-bill-wave w-5 text-emerald-500"></i> Money In
                                                            </button>
                                                        )}
                                                        <button 
                                                            className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100 mt-1 pt-1.5"
                                                            onClick={(e) => { e.stopPropagation(); onDeleteSale?.(inv.id); setOpenMenuId(null); }}
                                                        >
                                                            <i className="fa-solid fa-trash w-5"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )})}
                            {sales.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ padding: '64px 20px', textAlign: 'center' }}>
                                        <div style={{ width: '120px', height: '120px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', margin: '0 auto' }}>
                                            <i className="fa-solid fa-file-invoice text-blue-400" style={{ fontSize: '48px' }}></i>
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>No Transactions to show</h3>
                                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>You haven't added any sale invoices yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
