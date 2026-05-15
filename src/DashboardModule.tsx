import React from 'react';
import { Estimate, Party, InventoryItem, View } from './types';

interface DashboardModuleProps {
    sales: Estimate[];
    parties: Party[];
    items: InventoryItem[];
    onNavigate?: (view: View) => void;
    onEditSale?: (sale: Estimate) => void;
    onDeleteSale?: (id: string) => void;
    onViewSale?: (sale: Estimate) => void;
    onConvertToSale?: (id: string, type: 'SALE' | 'SALE_ORDER') => void;
    onReceivePayment?: (sale: Estimate) => void;
}

export function DashboardModule({ sales, parties, items, onNavigate, onEditSale, onDeleteSale, onViewSale, onConvertToSale, onReceivePayment }: DashboardModuleProps) {
    const sortedSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const [searchQuery, setSearchQuery] = React.useState('');
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

    const filteredSales = sortedSales.filter(sale => {
        const matchesSearch = sale.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            sale.refNo?.toString().includes(searchQuery);
        
        if (!matchesSearch) return false;

        // If it's a closed estimate, check if there's a corresponding sale in the list
        if (!sale.isSale && sale.status === 'Closed') {
            const hasCorrespondingSale = sales.some(s => s.isSale && s.convertedFromId === sale.id);
            if (hasCorrespondingSale) return false;
        }

        return true;
    });

    const totalSales = sales.filter(s => s.isSale).reduce((sum, s) => sum + s.totalAmount, 0);
    const totalReceived = sales.filter(s => s.isSale).reduce((sum, s) => sum + (s.receivedAmount || 0), 0);
    const totalReceivable = totalSales - totalReceived;

    return (
        <div style={{ flex: 1, backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }} onClick={() => setOpenMenuId(null)}>
            <div className="module-header" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="module-title" style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>Dashboard <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px', marginLeft: '8px', color: '#6b7280' }}></i></h2>
                <button className="btn btn-primary-red" onClick={() => onNavigate?.('SALE_FORM')} style={{ backgroundColor: 'var(--accent-red)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '24px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <i className="fa-solid fa-plus"></i> Add Sale
                </button>
            </div>
            
            <div style={{ padding: '0 24px 24px 24px' }}>
                <div className="filters-bar" style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Filter by:</span>
                    <select className="filter-dropdown" style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', outline: 'none' }}><option>All Transactions</option></select>
                    <div className="filter-dropdown" style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <i className="fa-solid fa-search" style={{ color: '#6b7280' }}></i> 
                        <input 
                            type="text" 
                            placeholder="Search party or ref..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ border: 'none', outline: 'none', background: 'transparent' }} 
                        />
                    </div>
                </div>

                <div className="summary-cards" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <div className="card-title" style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>Total Sales</div>
                        <div className="card-amount" style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Rs {totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <div className="card-title" style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>Total Received</div>
                        <div className="card-amount" style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>Rs {totalReceived.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <div className="card-title" style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>To Be Received</div>
                        <div className="card-amount" style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>Rs {totalReceivable.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                    </div>
                </div>

                <div className="table-container" style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Inv No</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Cust Ref No</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Party Name</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>Total Amount</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Receive Status</th>
                                <th style={{ padding: '12px 16px', width: '200px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.slice(0, 15).map(sale => {
                                const party = parties.find(p => p.id === sale.partyId || p.name === sale.customerName);
                                const isClosed = sale.isSale 
                                    ? (sale.totalAmount === (sale.receivedAmount || 0)) 
                                    : (sale.status === 'Closed');

                                let receiveStatusText = 'Open';
                                let statusColor = '#0284c7';
                                let statusBg = '#e0f2fe';

                                if (isClosed) {
                                    receiveStatusText = 'Fully Received';
                                    statusColor = '#059669';
                                    statusBg = '#d1fae5';
                                } else if ((sale.receivedAmount || 0) > 0) {
                                    receiveStatusText = 'Partially Received';
                                    statusColor = '#d97706';
                                    statusBg = '#fef3c7';
                                }

                                return (
                                <tr key={sale.id} style={{ borderBottom: '1px solid #E5E7EB', cursor: 'pointer' }} className="hover:bg-slate-50 transition-colors" onClick={() => onViewSale?.(sale)}>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>{sale.refNo || sale.id.slice(0,4)}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>{party?.customerRefNo || '-'}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', fontWeight: 500 }}>
                                        <div style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={sale.customerName}>
                                            {sale.customerName}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', textAlign: 'right', fontWeight: 500 }}>Rs {sale.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, backgroundColor: statusBg, color: statusColor, textTransform: 'uppercase' }}>
                                            {receiveStatusText}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                                            {!sale.isSale && sale.status !== 'Closed' && (
                                                <button 
                                                    className="btn" 
                                                    style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
                                                    onClick={(e) => { e.stopPropagation(); onConvertToSale?.(sale.id, 'SALE'); }}
                                                >
                                                    Convert to Sale
                                                </button>
                                            )}
                                            <div className="relative inline-block text-left" style={{ position: 'relative' }}>
                                                <button 
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(openMenuId === sale.id ? null : sale.id);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-ellipsis-vertical px-1"></i>
                                                </button>
                                                {openMenuId === sale.id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 ring-1 ring-black ring-opacity-5 z-20 transition-all font-sans text-left">
                                                        <div className="py-1">
                                                            <button 
                                                                className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                                                                onClick={(e) => { e.stopPropagation(); onViewSale?.(sale); setOpenMenuId(null); }}
                                                            >
                                                                <i className="fa-solid fa-file-pdf w-5"></i> PDF Download
                                                            </button>
                                                            <button 
                                                                className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                                                                onClick={(e) => { e.stopPropagation(); onEditSale?.(sale); setOpenMenuId(null); }}
                                                            >
                                                                <i className="fa-solid fa-pen-to-square w-5"></i> Edit
                                                            </button>
                                                            {!sale.isSale && (
                                                                <button 
                                                                    className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                                                                    onClick={(e) => { 
                                                                        e.stopPropagation(); 
                                                                        if (onEditSale) {
                                                                            onEditSale({ ...sale, status: sale.status === 'Closed' ? 'Open' : 'Closed' } as any);
                                                                        }
                                                                        setOpenMenuId(null); 
                                                                    }}
                                                                >
                                                                    <i className={`fa-solid ${sale.status === 'Closed' ? 'fa-folder-open' : 'fa-folder-closed'} w-5`}></i> 
                                                                    Mark as {sale.status === 'Closed' ? 'Open' : 'Closed'}
                                                                </button>
                                                            )}
                                                            {sale.isSale && (sale.totalAmount > (sale.receivedAmount || 0)) && (
                                                                <button 
                                                                    className="group flex w-full items-center px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 border-t border-slate-100 mt-1 pt-1.5"
                                                                    onClick={(e) => { e.stopPropagation(); onReceivePayment?.(sale); setOpenMenuId(null); }}
                                                                >
                                                                    <i className="fa-solid fa-money-bill-wave w-5"></i> Receive Payment
                                                                </button>
                                                            )}
                                                            <button 
                                                                className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100 mt-1 pt-1.5"
                                                                onClick={(e) => { e.stopPropagation(); onDeleteSale?.(sale.id); setOpenMenuId(null); }}
                                                            >
                                                                <i className="fa-solid fa-trash w-5"></i> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                            {filteredSales.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
                                        <div style={{ marginBottom: '12px', fontSize: '24px' }}><i className="fa-solid fa-file-invoice"></i></div>
                                        <div>No transactions found</div>
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
