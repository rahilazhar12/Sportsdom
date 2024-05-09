import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservedSlotsPage = () => {
  const [reservedSlots, setReservedSlots] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const userId = '66280a87b05650a18c36cb69'; // Replace this with your actual userId

  useEffect(() => {
    const fetchReservedSlots = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/arena/slots/${userId}`);
        setReservedSlots(response.data);
      } catch (error) {
        console.error('Error fetching reserved slots:', error);
      }
    };

    fetchReservedSlots();
  }, [userId]);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleOverlayClick = (event) => {
    if (event.target.id === "modal-overlay") {
      closeModal();
    }
  };

  const updateSlotStatus = async (arenaId, slotIndex, newStatus) => {
    console.log(arenaId)
    console.log(slotIndex)
    console.log(newStatus)
    
    try {
      const response = await axios.patch(`http://localhost:5000/api/v1/arena/update-slot-status/${arenaId}/${slotIndex}`, {
        status: newStatus
      });
      if (response.status === 200) {
        // Update the local state to reflect the new status
        const updatedSlots = reservedSlots.map(arena => {
          if (arena._id === arenaId) {
            const updatedArenaSlots = arena.slots.map((slot, index) => {
              if (index === slotIndex) {
                return { ...slot, status: newStatus };
              }
              return slot;
            });
            return { ...arena, slots: updatedArenaSlots };
          }
          return arena;
        });
        setReservedSlots(updatedSlots);
        console.log(updatedSlots)
      }
    } catch (error) {
      console.error('Error updating slot status:', error);
    }
  };

  console.log(reservedSlots)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">Reserved Slots</h1>
      {reservedSlots.length > 0 ? reservedSlots.map((arena, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{arena.arenaName}</h2>
          <h2 className="text-xl font-semibold mb-2">ID{arena.arenaid}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {arena.slots.map((slot, slotIndex) => (
              <div key={slotIndex} className="bg-gray-200 rounded-lg p-4">
                <img src={`http://localhost:5000/${slot.imageUrl}`} alt="Slot" className="mb-3 w-full h-96 rounded cursor-pointer" onClick={() => openModal(`http://localhost:5000/${slot.imageUrl}`)} />
                <p className="text-lg font-semibold mb-2">{slot.day}</p>
                <p className="text-sm text-gray-600">Time: {slot.startTime} - {slot.endTime}</p>
                <p className="text-sm text-gray-600">Sport: {slot.sport}</p>
                <p className="text-sm text-gray-600">Sport: {slot.status}</p>
               
              </div>
            ))}
          </div>
        </div>
      )) : <p>No slots reserved.</p>}
      {isModalOpen && (
        <div id="modal-overlay" className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={handleOverlayClick}>
          <div className="bg-white p-4 rounded-lg max-w-md mx-auto" onClick={e => e.stopPropagation()}>
            <img src={selectedImage} alt="Enlarged slot" className="max-w-full h-auto rounded" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservedSlotsPage;
