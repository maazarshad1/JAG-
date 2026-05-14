import React from 'react';
import { Estimate, Party, InventoryItem } from './types';

export function DashboardModule({ sales, parties, items, onNavigate, onExportExcel }: { sales: Estimate[], parties: Party[], items: InventoryItem[], onNavigate?: (view: any) => void, onExportExcel?: () => void }) {
    const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalPartiesBalance = parties.reduce((sum, p) => sum + (p.balance || 0), 0);
    const totalItems = items.length;
    const stockValue = items.reduce((sum, i) => sum + (i.stock * i.price), 0);

    const lowStockItems = items.filter(i => i.stock <= (i.minStock || 0));

    return (
        <div style={{ padding: '24px', backgroundColor: '#f3f4f6', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>Business Overview</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={onExportExcel}
                        style={{ padding: '8px 16px', background: '#10b981', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="fa-solid fa-file-excel"></i> Export Excel
                    </button>
                    <button 
                        onClick={() => onNavigate?.('PROFILE_EDIT')}
                        style={{ padding: '8px 16px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="fa-solid fa-building"></i> Company Info
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                <button 
                    onClick={() => onNavigate?.('SALE_FORM')}
                    style={{ padding: '16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'transform 0.2s' }}
                >
                    <i className="fa-solid fa-file-invoice" style={{ fontSize: '20px' }}></i>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>New Sale</span>
                </button>
                <button 
                    onClick={() => onNavigate?.('ESTIMATE_FORM')}
                    style={{ padding: '16px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fa-solid fa-file-lines" style={{ fontSize: '20px' }}></i>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>New Estimate</span>
                </button>
                <button 
                    onClick={() => onNavigate?.('PARTIES_LIST')}
                    style={{ padding: '16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fa-solid fa-users" style={{ fontSize: '20px' }}></i>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Parties</span>
                </button>
                <button 
                    onClick={() => onNavigate?.('ITEMS_LIST')}
                    style={{ padding: '16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fa-solid fa-box-archive" style={{ fontSize: '20px' }}></i>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Inventory</span>
                </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Sales (This Month)</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>Rs {totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                </div>
                
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Receivable</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>Rs {totalPartiesBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
                        From {parties.filter(p => p.balance > 0).length} parties
                    </div>
                </div>

                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Stock Value</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>Rs {stockValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
                        Across {totalItems} items
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Recent Transactions</h3>
                        <button onClick={() => onNavigate?.('SALE_LIST')} style={{ fontSize: '13px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>Date</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>Party</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.slice(-5).reverse().map(sale => (
                                <tr key={sale.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{sale.date}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{sale.customerName}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'right', fontWeight: 500 }}>Rs {sale.totalAmount.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                            {sales.length === 0 && (
                                <tr><td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>No recent transactions</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Stock Alerts Section */}
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#ef4444' }}>
                            <i className="fa-solid fa-triangle-exclamation"></i> Stock Alerts
                        </h3>
                    </div>
                    <div style={{ padding: '0 16px' }}>
                        {lowStockItems.length > 0 ? (
                            lowStockItems.map(item => (
                                <div key={item.id} style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.name}</div>
                                        <div style={{ fontSize: '11px', color: '#6b7280' }}>Remaining: {item.stock} {item.unit}</div>
                                    </div>
                                    <button 
                                        onClick={() => onNavigate?.('ITEMS_LIST')}
                                        style={{ fontSize: '12px', color: '#4f46e5', background: '#f5f3ff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Manage
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '32px', textAlign: 'center', color: '#10b981', fontSize: '13px' }}>
                                <i className="fa-solid fa-check-circle"></i> All items in stock
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
