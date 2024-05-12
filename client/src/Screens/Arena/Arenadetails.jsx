import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa'; // Import the WhatsApp icon
import { urlapi } from '../../Components/Envroutes';
import toast from 'react-hot-toast';

const Arenadetails = () => {
  const [arenaDetails, setArenaDetails] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [slotImages, setSlotImages] = useState({}); // New state for storing images
  const [slotSports, setSlotSports] = useState({});
  const [whatsappMessageSent, setWhatsappMessageSent] = useState({}); // Track if message has been sent

  const { id } = useParams();
  const User = sessionStorage.getItem("user");
  const token = User ? JSON.parse(User).token : null;
  const username = User ? JSON.parse(User).username : null;
  const role = User ? JSON.parse(User).role : null;
   

  const reserveSlots = async (day) => {
    if (!whatsappMessageSent[day]) {
        toast.error('Please send the WhatsApp message before reserving slots.');
        return;
    }

    // Check if a sport has been selected for each slot that is being reserved
    const slotIndices = selectedSlots[day] || [];
    for (let index of slotIndices) {
        if (!slotSports[day] || !slotSports[day][index]) {
            toast.error('Please select a sport for each slot you wish to reserve.');
            return;
        }
    }

    try {
        const formData = new FormData();
        formData.append('slotReservations', JSON.stringify([{
            day: day,
            slotIndices: slotIndices,
            sports: slotIndices.map(index => slotSports[day][index])
        }]));

        slotIndices.forEach(index => {
            if (slotImages[day] && slotImages[day][index]) {
                formData.append('image', slotImages[day][index]);
            }
        });

        const response = await fetch(`${urlapi}/api/v1/arena/reserve-slot/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            alert('Slots reserved successfully!');
            // Optionally reset the message sent state if needed
            // setWhatsappMessageSent(prev => ({ ...prev, [day]: false }));
        } else {
            throw new Error(data.message || 'Failed to reserve slots');
        }
    } catch (error) {
        console.error('Error reserving slots:', error);
        alert(error.message);
    }
};


const handleWhatsAppMessageSent = (day) => {
  setWhatsappMessageSent(prev => ({ ...prev, [day]: true }));
};

  

  useEffect(() => {
    const fetchArenaDetails = async () => {
      try {
        const response = await axios.get(`${urlapi}/api/v1/arena/get-arena-onid/${id}`);
        const data = response.data;
        const groupedSlots = groupSlotsByDay(data.slots);
        setArenaDetails({ ...data, slots: groupedSlots });
      } catch (error) {
        console.error('Error fetching arena details:', error);
      }
    };

    fetchArenaDetails();
  }, [arenaDetails]);

  const groupSlotsByDay = (slots) => {
    return slots.reduce((acc, slot) => {
      const { day } = slot;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(slot);
      return acc;
    }, {});
  };

  const handleSlotSelection = (day, index, isSelected) => {
    const newSelection = { ...selectedSlots };
    if (!newSelection[day]) newSelection[day] = [];
    if (isSelected) {
      newSelection[day].push(index);
    } else {
      newSelection[day] = newSelection[day].filter(i => i !== index);
    }
    setSelectedSlots(newSelection);
  };

  const handleImageSelection = (day, index, file) => {
    const newImages = { ...slotImages };
    if (!newImages[day]) newImages[day] = {};
    newImages[day][index] = file;
    setSlotImages(newImages);
  };

  const handleSportSelection = (day, index, sport) => {
    const newSports = { ...slotSports };
    if (!newSports[day]) newSports[day] = {};
    newSports[day][index] = sport;
    setSlotSports(newSports);
  };
  
  const generateReservedSlotsMessage = (day) => {
    const selectedSlotIndices = selectedSlots[day] || [];
    const reservedSlots = selectedSlotIndices.map(index => arenaDetails.slots[day][index]);
    console.log(reservedSlots , 'rahil')
    const message = `Reserved Slots for ${day}:\n\n${reservedSlots.map(slot => `${slot.startTime} - ${slot.endTime}`).join('\n')}\n- Reserved by: ${username}`;
    return encodeURIComponent(message);
  };
  
  

  if (!arenaDetails) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const handleSlotCancellation = async (day, index) => {
    // Confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!isConfirmed) {
      return; // Early return if the user cancels the action
    }
  
    try {
      const response = await axios.put(`${urlapi}/api/v1/arena/update-reservation/${arenaDetails._id}/${arenaDetails.slots[day][index]._id}`);
      const data = response.data;
      if (response.ok) {
        const updatedSlot = data.slot; // Assuming the backend sends back the updated slot
        const newArenaDetails = { ...arenaDetails };
        newArenaDetails.slots[day][index] = updatedSlot;
        setArenaDetails(newArenaDetails);
        alert('Booking cancelled successfully!');
      } else {
        throw new Error(data.message || 'Failed to update slot reservation');
      }
    } catch (error) {
      console.error('Error updating slot reservation:', error);
      alert(error.message);
    }
  };
  
  

  return (
    <div className="max-w-6xl mx-auto p-4" >
    <h1 className="text-3xl font-bold text-center mb-4 text-indigo-700">
        {arenaDetails.name} - Slots
    </h1>
    {Object.entries(arenaDetails.slots).map(([day, slots]) => (
        <div key={day} className="bg-white shadow-lg rounded-lg p-6 mb-4">
            <h3 className="text-2xl font-semibold mb-3 text-indigo-600">{day}</h3>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    reserveSlots(day);
                }}
            >
                <button
                    type="submit"
                    className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
                >
                    Reserve Selected Slots
                </button>
                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full">
                        <thead className="bg-indigo-100">
                            <tr>
                                <th className="text-left py-2 px-4">Start Time</th>
                                <th className="text-left py-2 px-4">End Time</th>
                                <th className="text-left py-2 px-4">Status</th>
                                <th className="text-left py-2 px-4">Reserved by</th>
                                <th className="text-left py-2 px-4">Sport</th>
                                <th className="text-left py-2 px-4">Select</th>
                                <th className="text-left py-2 px-4">WhatsApp</th>
                                {role === "Admin" && (
                                    <th className="text-left py-2 px-4">Cancel Booking</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {slots.map((slot, index) => (
                                <tr
                                    key={slot._id}
                                    className={`border-b ${slot.reserved ? "bg-red-200" : "bg-blue-50"}`}
                                >
                                    <td className="py-2 px-4">{slot.startTime}</td>
                                    <td className="py-2 px-4">{slot.endTime}</td>
                                    <td className="py-2 px-4">
                                        {slot.reserved ? "Reserved" : "Available"}
                                    </td>
                                    <td className="py-2 px-4">
                                        {slot.reserved ? slot.reservedBy.userName : ""}
                                    </td>
                                    <td className="py-2 px-4">
                                        {slot.reserved ? (
                                            slot.sport
                                        ) : (
                                            <select
                                                defaultValue=""
                                                onChange={(e) =>
                                                    handleSportSelection(day, index, e.target.value)
                                                }
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                                disabled={slot.reserved}
                                            >
                                                <option value="" disabled>
                                                    Select Sport
                                                </option>
                                                <option value="Football">Football</option>
                                                <option value="Cricket">Cricket</option>
                                            </select>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {slot.reserved ? (
                                            <></> // No checkbox if already reserved
                                        ) : (
                                            <input
                                                type="checkbox"
                                                disabled={whatsappMessageSent[day]}
                                                checked={selectedSlots[day]?.includes(index)}
                                                onChange={(e) =>
                                                    handleSlotSelection(day, index, e.target.checked)
                                                }
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                        )}
                                    </td>
                                    <td>
                                        {!slot.reserved && selectedSlots[day]?.length > 0 && (
                                            <a
                                                href={`https://api.whatsapp.com/send?phone=${
                                                    arenaDetails.contact
                                                }&text=${generateReservedSlotsMessage(day)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => handleWhatsAppMessageSent(day)}
                                                className="block text-center"
                                            >
                                                <FaWhatsapp className="ml-2 cursor-pointer text-xl text-green-500" />
                                            </a>
                                        )}
                                    </td>
                                    {role === "Admin" && (
                                        <td>
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() =>
                                                    handleSlotCancellation(day, index)
                                                }
                                            >
                                                {slot.reserved ? "Cancel Booking" : null}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>
        </div>
    ))}
</div>


  );
};

export default Arenadetails;
