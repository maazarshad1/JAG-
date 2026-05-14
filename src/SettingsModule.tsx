import React from 'react';
import { CompanyData } from './types';
import { Save, ArrowLeft, Building, Mail, Phone, MapPin, FileText } from 'lucide-react';

interface SettingsModuleProps {
    companyData: CompanyData;
    onChange: (data: CompanyData) => void;
    onBack: () => void;
}

export function SettingsModule({ companyData, onChange, onBack }: SettingsModuleProps) {
    return (
        <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100%', overflowY: 'auto' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                    <button 
                        onClick={onBack}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#6b7280' }}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Business Settings</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                    {/* General Information */}
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Building size={20} color="#3b82f6" /> Business Information
                        </h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#4b5563', marginBottom: '8px' }}>Business Name</label>
                                <input 
                                    type="text" 
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }} 
                                    value={companyData.name} 
                                    onChange={e => onChange({...companyData, name: e.target.value})}
                                    placeholder="Enter business name"
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#4b5563', marginBottom: '8px' }}>
                                    <Mail size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Email Address
                                </label>
                                <input 
                                    type="email" 
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }} 
                                    value={companyData.email} 
                                    onChange={e => onChange({...companyData, email: e.target.value})}
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#4b5563', marginBottom: '8px' }}>
                                    <Phone size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Phone Number
                                </label>
                                <input 
                                    type="text" 
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }} 
                                    value={companyData.phone} 
                                    onChange={e => onChange({...companyData, phone: e.target.value})}
                                    placeholder="e.g. +91 00000 00000"
                                />
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#4b5563', marginBottom: '8px' }}>
                                    <MapPin size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Business Address
                                </label>
                                <textarea 
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', minHeight: '100px', resize: 'vertical' }} 
                                    value={companyData.address} 
                                    onChange={e => onChange({...companyData, address: e.target.value})}
                                    placeholder="Full street address, city, state, zip"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Invoice Settings */}
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={20} color="#3b82f6" /> Document Settings
                        </h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#4b5563', marginBottom: '8px' }}>Business Logo</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '80px', height: '80px', border: '2px dashed #d1d5db', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', overflow: 'hidden' }}>
                                        {companyData.logo ? (
                                            <img src={companyData.logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <Building size={32} color="#9ca3af" />
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        style={{ display: 'none' }} 
                                        id="logo-upload"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => onChange({...companyData, logo: reader.result as string});
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <label htmlFor="logo-upload" style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }}>
                                        Change Logo
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#4b5563', marginBottom: '8px' }}>Authorized Signature</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '120px', height: '80px', border: '2px dashed #d1d5db', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', overflow: 'hidden' }}>
                                        {companyData.signature ? (
                                            <img src={companyData.signature} alt="Signature" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <FileText size={32} color="#9ca3af" />
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        style={{ display: 'none' }} 
                                        id="sig-upload"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => onChange({...companyData, signature: reader.result as string});
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <label htmlFor="sig-upload" style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }}>
                                        Upload Signature
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#4b5563', marginBottom: '8px' }}>Terms & Conditions</label>
                            <textarea 
                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', minHeight: '100px', resize: 'vertical' }} 
                                value={companyData.terms || ''} 
                                onChange={e => onChange({...companyData, terms: e.target.value})}
                                placeholder="These will appear at the bottom of your invoices and estimates"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                        <button 
                            onClick={onBack}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                padding: '12px 32px', 
                                backgroundColor: '#3b82f6', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                fontSize: '16px', 
                                fontWeight: 600, 
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
                        >
                            <Save size={18} /> Save Settings
                        </button>
                        <div style={{ marginTop: '20px', borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444', marginBottom: '8px' }}>Danger Zone</h3>
                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>This will permanently clear all your locally stored data. Cloud data must be managed via the dashboard.</p>
                            <button 
                                onClick={() => {
                                    if(confirm("Are you sure you want to clear all data? This cannot be undone.")) {
                                        localStorage.clear();
                                        window.location.reload();
                                    }
                                }}
                                style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                            >
                                Reset All Local Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
