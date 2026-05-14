import React from 'react';
import { Estimate } from './types';

export function HomeModule({ sales, onAddSale, onEditSale, onViewSale, onDeleteSale }: { sales: Estimate[], onAddSale: () => void, onEditSale: (inv: Estimate) => void, onViewSale: (inv: Estimate) => void, onDeleteSale?: (id: string) => void }) {
    const totalSales = sales.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const received = sales.reduce((sum, inv) => sum + (inv.receivedAmount || 0), 0);
    const balance = sales.reduce((sum, inv) => sum + inv.balance, 0);

    return (
        <div style={{ backgroundColor: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="module-header" style={{ padding: '16px 20px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb' }}>
                <h2 className="module-title" style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>Sale Invoices <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', verticalAlign: 'middle' }}></i></h2>
                <button className="btn btn-primary-red" onClick={onAddSale} style={{ backgroundColor: '#EF4444', color: '#fff', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', border: 'none', cursor: 'pointer', fontWeight: 500 }}><i className="fa-solid fa-plus"></i> Add Sale</button>
            </div>
            
            <div className="filters-bar" style={{ padding: '12px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px', fontSize: '13px', alignItems: 'center' }}>
                <span style={{ color: '#6b7280' }}>Filter by :</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <select className="filter-dropdown" style={{ padding: '4px 12px', border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: '#f9fafb' }}>
                        <option>This Month</option>
                    </select>
                    <div style={{ padding: '4px 12px', border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-regular fa-calendar" style={{ fontSize: '14px' }}></i> 01/05/2026 To 31/05/2026
                    </div>
                </div>
            </div>

            <div style={{ padding: '20px' }}>
                <div className="summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: 0 }}>
                    <div className="card" style={{ width: 'auto', border: '1px solid #e8e8fb', borderRadius: '8px', padding: '16px', boxShadow: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Sales (This Month)</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Rs {totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                            </div>
                            <div style={{ backgroundColor: '#e0f2fe', color: '#3b82f6', padding: '4px 10px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', fontWeight: 'bold' }}>100% <i className="fa-solid fa-arrow-trend-up"></i></div>
                                <div style={{ fontSize: '8px' }}>vs last month</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f3f4f6', fontSize: '12px' }}>
                            <span style={{ color: '#6b7280' }}>Received: <b style={{ color: '#111827' }}>Rs {received.toLocaleString('en-IN', {minimumFractionDigits: 2})}</b></span>
                            <span style={{ color: '#6b7280' }}>Balance: <b style={{ color: '#111827' }}>Rs {balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</b></span>
                        </div>
                    </div>
                </div>

                <div className="table-container" style={{ padding: '24px 0', minHeight: 'auto' }}>
                    <div className="table-header-row" style={{ padding: '0 0 16px 0' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>Transactions</h3>
                        <div style={{ display: 'flex', gap: '16px', color: '#6b7280', fontSize: '14px' }}>
                            <i className="fa-solid fa-magnifying-glass cursor-pointer"></i>
                            <i className="fa-solid fa-chart-simple cursor-pointer"></i>
                            <i className="fa-solid fa-file-excel cursor-pointer" style={{ color: '#10b981' }}></i>
                            <i className="fa-solid fa-print cursor-pointer"></i>
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Date <i className="fa-solid fa-filter" style={{ fontSize: '10px' }}></i></th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Invoice No. <i className="fa-solid fa-filter" style={{ fontSize: '10px' }}></i></th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Party Name <i className="fa-solid fa-filter" style={{ fontSize: '10px' }}></i></th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Type <i className="fa-solid fa-filter" style={{ fontSize: '10px' }}></i></th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Payment <i className="fa-solid fa-filter" style={{ fontSize: '10px' }}></i></th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Amount <i className="fa-solid fa-filter" style={{ fontSize: '10px' }}></i></th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Balance <i className="fa-solid fa-filter" style={{ fontSize: '10px' }}></i></th>
                                <th style={{ padding: '12px 16px', width: '100px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((inv) => (
                                <tr key={inv.id} style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }} className="hover:bg-slate-50 transition-colors" onClick={() => onViewSale(inv)}>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{inv.date}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{inv.refNo}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                        <div style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={inv.customerName}>
                                            {inv.customerName}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>Sale</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{inv.paymentType || 'Cash'}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'right', fontWeight: 500 }}>Rs {inv.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'right' }}>Rs {inv.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '12px', color: '#6b7280', justifyContent: 'flex-end' }}>
                                            <i className="fa-solid fa-pencil cursor-pointer hover:text-blue-600" onClick={(e) => { e.stopPropagation(); onEditSale(inv); }}></i>
                                            <i className="fa-solid fa-print cursor-pointer hover:text-blue-600" onClick={(e) => { e.stopPropagation(); onViewSale(inv); }}></i>
                                            <i className="fa-solid fa-trash cursor-pointer hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDeleteSale?.(inv.id); }}></i>
                                            <i className="fa-solid fa-share-nodes cursor-pointer hover:text-blue-600"></i>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sales.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
                                        <div style={{ marginBottom: '12px', fontSize: '24px' }}><i className="fa-solid fa-file-invoice"></i></div>
                                        <div>No sales recorded yet</div>
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
