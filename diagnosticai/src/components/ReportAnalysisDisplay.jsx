import React from 'react';
import { motion } from 'framer-motion';

const ReportAnalysisDisplay = ({ result }) => {
    // Parse the response string to extract structured data
    const parsedData = result.response ? parseReportData(result.response) : null;

    return (
        <div className="space-y-6">
            {parsedData && (
                <>
                    {/* Personal Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500"
                    >
                        <h3 className="text-xl font-semibold text-blue-800 mb-4">Personal Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {Object.entries(parsedData.personal).map(([key, value]) => (
                                <div key={key}>
                                    <span className="font-medium text-gray-700">{key}: </span>
                                    <span className="text-gray-600">{value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Health Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500"
                    >
                        <h3 className="text-xl font-semibold text-green-800 mb-4">Health Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {Object.entries(parsedData.health).map(([key, value]) => (
                                <div key={key}>
                                    <span className="font-medium text-gray-700">{key}: </span>
                                    <span className="text-gray-600">{value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Allergies Section */}
                    {parsedData.allergies.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500"
                        >
                            <h3 className="text-xl font-semibold text-red-800 mb-4">Allergies</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {parsedData.allergies.map((allergy, index) => (
                                    <li key={index} className="text-gray-700">{allergy}</li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Medications Section */}
                    {parsedData.medications.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500"
                        >
                            <h3 className="text-xl font-semibold text-purple-800 mb-4">Medications</h3>
                            {parsedData.medications.map((med, index) => (
                                <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                                    <h4 className="font-semibold text-gray-800">{med.name}</h4>
                                    <div className="grid md:grid-cols-2 gap-2 mt-2">
                                        <p><span className="font-medium">Date:</span> {med.date}</p>
                                        <p><span className="font-medium">Dose:</span> {med.instructions}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
};

function parseReportData(responseString) {
    const lines = responseString.split('\n');
    const data = {
        personal: {},
        health: {},
        allergies: [],
        medications: []
    };

    let currentSection = '';
    let currentMedication = {};

    lines.forEach(line => {
        if (line.includes('PREPARED FOR')) {
            data.personal.name = line.split('PREPARED FOR\n')[1];
        } else if (line.startsWith('HEIGHT')) {
            data.health.height = line.split('HEIGHT\n')[1];
        } else if (line.startsWith('WEIGHT')) {
            data.health.weight = line.split('WEIGHT\n')[1];
        } else if (line.startsWith('BLOOD PRESSURE')) {
            data.health.bloodPressure = line.split('BLOOD PRESSURE\n')[1];
        } else if (line.includes('ALLERGIES')) {
            currentSection = 'allergies';
        } else if (line.includes('MEDICATIONS')) {
            currentSection = 'medications';
        } else if (line.startsWith('!') && currentSection === 'allergies') {
            data.allergies.push(line.replace('!', '').trim());
        } else if (line.includes('MEDICATION NAME') && currentSection === 'medications') {
            if (Object.keys(currentMedication).length > 0) {
                data.medications.push(currentMedication);
            }
            currentMedication = {
                name: line.split('MEDICATION NAME\n')[1],
                date: '',
                instructions: ''
            };
        }
    });

    if (Object.keys(currentMedication).length > 0) {
        data.medications.push(currentMedication);
    }

    return data;
}

export default ReportAnalysisDisplay;
