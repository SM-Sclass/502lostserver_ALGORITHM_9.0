'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileInputComp from '@/components/FileInputComp';
import OstoporosisForm from '@/components/OstoporosisForm';

const tabs = [
    {
        id: 'eyes-skin',
        label: 'Eyes & Skin',
        fileTypes: '.jpg,.jpeg,.png',
        acceptFirst: 'image/*',
        port: 5002,
        endpoint:['/anemia','/retina']
    },
    {
        id: 'bone-health',
        label: 'Bone Health',
        fileTypes: '.jpg,.jpeg,.png,.txt,.doc,.docx',
        acceptFirst: '*/*',
        port:5000,
    },
    {
        id: 'brain-signals',
        label: 'Brain signals & MRI',
        fileTypes: '.edf,.jpg,.jpeg,.png',
        acceptFirst: '.edf,image/*',
        port:5001
    },
    {
        id: 'xray-ct',
        label: 'Xray & CTscan',
        fileTypes: '.jpg,.jpeg,.png',
        acceptFirst: 'image/*',
        port:5003
    },
    {
        id: 'report',
        label: 'Report analysis',
        fileTypes: '.pdf,.jpg,.jpeg,.png',
        acceptFirst: '.pdf,image/*', // Changed to null since we only want one upload
        port:5004
    }
];

export default function DiagnosisPage() {
    const[tabState, setTabState] = useState({id: 'eyes-skin', label: 'Eyes & Skin', fileTypes: '.jpg,.jpeg,.png', acceptFirst: 'image/*', port:5002});
    const [activeTab, setActiveTab] = useState('eyes-skin');
    const [result, setResult] = useState(null);
    
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setResult(null);
        setTabState(tabs.find(t => t.id === tabId));
    };

    return (
        <div className="container mx-auto p-4 max-w-full overflow-hidden">
            {/* Tabs - Show dropdown on mobile */}
            <div className="mb-6">
                <div className="md:hidden">
                    <select
                        value={activeTab}
                        onChange={(e) => handleTabChange(e.target.value)}
                        className="w-full rounded-lg border-gray-300 p-2"
                    >
                        {tabs.map(tab => (
                            <option key={tab.id} value={tab.id}>
                                {tab.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="hidden md:flex flex-wrap gap-2 border border-neutral-300 rounded-xl p-5">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`px-4 py-2 rounded-lg my-2 transition-colors ${activeTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>


            {tabState.id !== 'bone-health' && <FileInputComp label={tabState.label} id={tabState.id} fileTypes={tabState.fileTypes} acceptFirst={tabState.acceptFirst} port={tabState.port}/>}
            {tabState.id === 'bone-health' && <OstoporosisForm/>}
            {/* Results */}
            <div className="mt-8">
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(result).map(([key, value]) => (
                                    <div key={key} className="bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold capitalize mb-2">{key}</h3>
                                        <p className="text-gray-600">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
