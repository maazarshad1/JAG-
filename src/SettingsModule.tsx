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
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#4b5563', marginBottom: '8px' }}>Terms & Conditions</label>
                            <textarea 
                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', minHeight: '120px', resize: 'vertical' }} 
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
                    </div>
                </div>
            </div>
        </div>
    );
}
