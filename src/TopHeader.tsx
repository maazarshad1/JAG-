import React from 'react';

export function TopHeader({ title, onAction }: { title: string, onAction: (action: string) => void }) {
    return (
        <header id="top-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: '56px', background: '#fff', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
            <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <div className="business-indicator" style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-red)', borderRadius: '50%' }}></div>
                <input type="text" className="business-name-input" value={title} readOnly placeholder="Enter Business Name" style={{ border: 'none', fontSize: '16px', color: '#111827', outline: 'none', width: '300px', fontWeight: 600 }} />
            </div>
            
            <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary-red" onClick={() => onAction('ADD_SALE')} style={{ padding: '6px 16px', fontSize: '13px', background: 'var(--accent-red)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}><i className="fa-solid fa-plus"></i> Add Sale</button>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', color: '#6b7280', fontSize: '18px' }}>
                    <i className="fa-solid fa-gear cursor-pointer" onClick={() => onAction('PROFILE_EDIT')}></i>
                    <i className="fa-solid fa-question-circle cursor-pointer"></i>
                </div>
            </div>
        </header>
    );
}
