import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { urlapi } from '../../Components/Envroutes';

function ArenaImages() {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const { id } = useParams();  // Retrieves the 'id' parameter from the URL

    useEffect(() => {
        async function fetchImages() {
            try {
                const response = await fetch(`${urlapi}/api/v1/arena/get-pictures/${id}`);
                const data = await response.json();
                if (response.status === 200) {
                    setImages(data.pictures);
                } else {
                    console.error('Failed to fetch images:', data.message);
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        }

        fetchImages();
    }, [id]);  // Ensures useEffect runs again if the 'id' changes

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index} className="cursor-pointer">
                            <img
                                src={`api.sportsdom.online/${image}`}
                                alt={`Arena Image ${index + 1}`}
                                className="w-full h-64 object-cover rounded-lg"
                                onClick={() => { setSelectedImage(image); setIsOpen(true); }}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">No images available.</div>
                )}
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white p-2 rounded-lg max-w-full max-h-full overflow-auto">
                        <img src={`api.sportsdom.online/${selectedImage}`} alt="Selected Arena" className="max-w-full max-h-full"/>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded absolute top-2 right-2">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ArenaImages;
