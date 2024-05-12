import React, { useState } from 'react';
import { urlapi } from '../../Components/Envroutes';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function Uploadarenaimages() {
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState([]);
    const { id } = useParams();

    const handleFileChange = (event) => {
        setFiles([...event.target.files]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        for (let file of files) {
            formData.append('pictures', file);
        }

        try {
            setUploading(true);
            const response = await fetch(`${urlapi}/api/v1/arena/add-images/${id}`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                toast.success('Pictures uploaded successfully');
                setFiles([]); // Clear the selection
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error uploading pictures:', error);
            alert('Failed to upload pictures');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="mb-4">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded file:border-0
                               file:text-sm file:font-semibold
                               file:bg-blue-50 file:text-blue-700
                               hover:file:bg-blue-100
                               cursor-pointer"
                    disabled={uploading}
                />
            </div>
            <button
                onClick={handleUpload}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={uploading || files.length === 0}
            >
                Upload Images
            </button>
            {uploading && (
                <p className="text-center text-blue-500 mt-2">Uploading...</p>
            )}
        </div>
    );
}

export default Uploadarenaimages;
