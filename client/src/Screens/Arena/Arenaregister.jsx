import React, { useState } from 'react';
import { urlapi } from '../../Components/Envroutes';
import toast from 'react-hot-toast';

function ArenaForm() {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        opentime: '',
        closetime: '',
        charges: '',
        contact: '',
        fields: []
    });

    const [fieldData, setFieldData] = useState({
        name: '',
        pricePerHour: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Submitting Form Data:", formData);
            const response = await fetch(`${urlapi}/api/v1/arena/register-arena`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Failed to submit form:', error);
            toast.error('Failed to register arena.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'contact') {
            newValue = newValue.replace(/\D/g, '');
            if (newValue.startsWith('0')) {
                newValue = '92' + newValue.slice(1);
            }
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFieldData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddField = () => {
        setFormData(prev => ({
            ...prev,
            fields: [...prev.fields, { ...fieldData, slots: [] }]
        }));
        setFieldData({ name: '', pricePerHour: '' });
    };

    return (
        <section className='bg-cover bg-center p-4 md:p-8' style={{ backgroundImage: 'url(https://img.freepik.com/premium-photo/cricket-game-advertisement-generative-ai_895561-3784.jpg?w=996)', backdropFilter: 'blur(8px)' }}>
            <div className="max-w-2xl mx-auto bg-white bg-opacity-60 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Register Arena</h3>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" name="name" id="name" required onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" name="location" id="location" required onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="opentime" className="block text-sm font-medium text-gray-700">Open Time</label>
                            <input type="text" name="opentime" id="opentime" required onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="closetime" className="block text-sm font-medium text-gray-700">Close Time</label>
                            <input type="text" name="closetime" id="closetime" required onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
                            <input type="text" name="contact" id="contact" required onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="charges" className="block text-sm font-medium text-gray-700">Charges</label>
                            <input type="text" name="charges" id="charges" required onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Add Fields</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700">Field Name</label>
                                    <input type="text" name="name" id="fieldName" value={fieldData.name} onChange={handleFieldChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                                </div>
                                <div>
                                    <label htmlFor="fieldPrice" className="block text-sm font-medium text-gray-700">Price Per Hour</label>
                                    <input type="text" name="pricePerHour" id="fieldPrice" value={fieldData.pricePerHour} onChange={handleFieldChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                                </div>
                                <button type="button" onClick={handleAddField} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Field</button>
                            </div>
                            {formData.fields.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-md font-medium text-gray-900">Fields:</h4>
                                    <ul className="list-disc list-inside">
                                        {formData.fields.map((field, index) => (
                                            <li key={index}>{field.name} - {field.pricePerHour}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Register Arena</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default ArenaForm;
