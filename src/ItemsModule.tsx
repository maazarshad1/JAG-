import React, { useState } from 'react';
import { InventoryItem } from './types';

export function ItemsModule({ items, onAddItem, onEditItem }: { items: InventoryItem[], onAddItem: () => void, onEditItem: (item: InventoryItem) => void }) {
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(items[0] || null);

    return (
        <div className="split-view">
            <div className="split-left">
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary-red" style={{ flex: 1 }} onClick={onAddItem}><i className="fa-solid fa-plus"></i> Add Item</button>
                    <button className="btn btn-icon" style={{ background: '#f3f4f6' }}><i className="fa-solid fa-filter"></i></button>
                </div>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
                    <div className="search-box" style={{ background: '#f3f4f6', flex: 1, border: 'none', color: '#6b7280' }}>
                        <i className="fa-solid fa-search" style={{ marginRight: '8px' }}></i>
                        <input type="text" placeholder="Search Item" style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }} />
                    </div>
                </div>
                <div style={{ padding: '12px 16px', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)' }}>
                    <span>Item Name</span>
                    <span>Quantity</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {items.map(item => (
                        <div 
                            key={item.id} 
                            style={{ 
                                padding: '16px', 
                                borderBottom: '1px solid var(--border-color)', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                cursor: 'pointer',
                                background: selectedItem?.id === item.id ? '#f3f4f6' : '#fff'
                            }}
                            onClick={() => setSelectedItem(item)}
                        >
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '4px', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.name}>{item.name}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Sales Price: Rs {item.price}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '14px', fontWeight: 500, color: item.stock < item.minStock ? 'var(--accent-red)' : '#111827', marginBottom: '4px' }}>
                                    {item.stock} {item.unit}
                                </div>
                                {item.stock < item.minStock && <div style={{ fontSize: '10px', color: 'var(--accent-red)' }}>Low Stock</div>}
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No items added yet</div>}
                </div>
            </div>
            
            <div className="split-right">
                {selectedItem ? (
                    <>
                        <div style={{ padding: '20px', background: '#fff', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>{selectedItem.name}</h2>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn" style={{ background: '#f3f4f6', color: '#4b5563' }} onClick={() => onEditItem(selectedItem)}><i className="fa-solid fa-pen"></i> Edit</button>
                            </div>
                        </div>
                        
                        <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
                            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', flex: 1 }}>
                                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Sales Price</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>Rs {selectedItem.price.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                            </div>
                            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', flex: 1 }}>
                                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Stock Quantity</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: selectedItem.stock < selectedItem.minStock ? 'var(--accent-red)' : '#111827' }}>{selectedItem.stock} {selectedItem.unit}</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
                        <i className="fa-solid fa-box-open" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.2 }}></i>
                        <p>Select an item to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
