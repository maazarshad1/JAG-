import React from 'react';

export function TopHeader({ title, onAction }: { title: string, onAction: (action: string) => void }) {
    return (
        <header id="top-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: '56px', background: '#fff', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
            <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <div className="business-indicator" style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-red)', borderRadius: '50%' }}></div>
                <input type="text" className="business-name-input" value={title} readOnly placeholder="Enter Business Name" style={{ border: 'none', fontSize: '16px', color: '#111827', outline: 'none', width: '200px', fontWeight: 600 }} />
                
                <div className="global-search" style={{ position: 'relative', marginLeft: '20px', flex: 1, maxWidth: '400px' }}>
                    <i className="fa-solid fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '14px' }}></i>
                    <input 
                        type="text" 
                        placeholder="Search items, parties, bills (Ctrl+F)" 
                        style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f9fafb', outline: 'none' }}
                    />
                </div>
            </div>
            
            <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '11px', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: '14px' }}></i>
                        <span style={{ fontWeight: 500 }}>WhatsApp Support</span>
                    </div>
                    <span style={{ fontSize: '9px', color: '#9ca3af' }}>(+971) 501 759 794</span>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary-red" onClick={() => onAction('ADD_SALE')} style={{ padding: '6px 16px', fontSize: '13px', background: 'var(--accent-red)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}><i className="fa-solid fa-plus"></i> Add Sale</button>
                    <button className="btn btn-purchase-light" style={{ background: '#DBEAFE', color: '#3B82F6', padding: '6px 16px', fontSize: '13px', fontWeight: 500, border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fa-solid fa-plus"></i> Add Purchase</button>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', color: '#6b7280', fontSize: '18px' }}>
                    <i className="fa-solid fa-gear cursor-pointer" onClick={() => onAction('PROFILE_EDIT')}></i>
                    <i className="fa-solid fa-question-circle cursor-pointer"></i>
                </div>
            </div>
        </header>
    );
}
