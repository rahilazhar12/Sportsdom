import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa'; // Import the WhatsApp icon
import { urlapi } from '../../Components/Envroutes';
import toast from 'react-hot-toast';

const Arenadetails = () => {
  const [arenaDetails, setArenaDetails] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [selectedSlots, setSelectedSlots] = useState({});
  const [slotSports, setSlotSports] = useState({});
  const [whatsappMessageSent, setWhatsappMessageSent] = useState({}); // Track if message has been sent

  const { id } = useParams();
  const User = sessionStorage.getItem("user");
  const token = User ? JSON.parse(User).token : null;
  const username = User ? JSON.parse(User).username : null;
  const role = User ? JSON.parse(User).role : null;

  const fetchArenaDetails = async () => {
    try {
      const response = await axios.get(`${urlapi}/api/v1/arena/get-arena-onid/${id}`);
      const data = response.data;
      const groupedFields = data.fields.map(field => {
        return {
          ...field,
          slots: groupSlotsByDay(field.slots)
        };
      });
      setArenaDetails({ ...data, fields: groupedFields });
    } catch (error) {
      console.error('Error fetching arena details:', error);
    }
  };


  const reserveSlots = async (fieldId, day) => {
    if (!whatsappMessageSent[`${fieldId}-${day}`]) {
      toast.error('Please send the WhatsApp message before reserving slots.');
      return;
    }

    const slotIndices = selectedSlots[`${fieldId}-${day}`] || [];
    if (slotIndices.length === 0) {
      toast.error('Please select slots to reserve.');
      return;
    }

    // Check if all selected slots have a sport selected
    for (const index of slotIndices) {
      if (!slotSports[`${fieldId}-${day}`] || !slotSports[`${fieldId}-${day}`][index]) {
        toast.error('Please select a sport for each selected slot.');
        return;
      }
    }

    // Collect reservations in the required format
    const slotReservations = slotIndices.map(index => {
      return {
        day: day,
        startTime: arenaDetails.fields.find(field => field._id === fieldId).slots[day][index].startTime,
        sport: slotSports[`${fieldId}-${day}`][index]
      };
    });

    try {
      const response = await axios.post(
        `${urlapi}/api/v1/arena/reserve-slot/${id}/${fieldId}`,
        { slotReservations },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (response.status === 200) {
        toast.success('Slots reserved successfully!');
        // Optionally reset the selected slots and sports
        setSelectedSlots(prev => ({ ...prev, [`${fieldId}-${day}`]: [] }));
        setSlotSports(prev => ({ ...prev, [`${fieldId}-${day}`]: {} }));
        // Optionally reset the WhatsApp message sent state if needed
        setWhatsappMessageSent(prev => ({ ...prev, [`${fieldId}-${day}`]: false }));
        fetchArenaDetails()
      } else {
        throw new Error(data.message || 'Failed to reserve slots');
      }
    } catch (error) {
      console.error('Error reserving slots:', error);
      toast.error(error.message);
    }
  };

  const handleSlotSelection = (fieldId, day, index, isSelected) => {
    const key = `${fieldId}-${day}`;
    const newSelection = { ...selectedSlots };
    if (!newSelection[key]) newSelection[key] = [];
    if (isSelected) {
      newSelection[key].push(index);
    } else {
      newSelection[key] = newSelection[key].filter(i => i !== index);
    }
    setSelectedSlots(newSelection);
  };

  const handleSportSelection = (fieldId, day, index, sport) => {
    const key = `${fieldId}-${day}`;
    const newSports = { ...slotSports };
    if (!newSports[key]) newSports[key] = {};
    newSports[key][index] = sport;
    setSlotSports(newSports);
  };

  const handleWhatsAppMessageSent = (fieldId, day) => {
    const key = `${fieldId}-${day}`;
    setWhatsappMessageSent(prev => ({ ...prev, [key]: true }));
  };

  useEffect(() => {
    fetchArenaDetails();
  }, [id]);

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

  const generateReservedSlotsMessage = (fieldId, day) => {
    const selectedSlotIndices = selectedSlots[`${fieldId}-${day}`] || [];
    const reservedSlots = selectedSlotIndices.map(index => {
      const slot = arenaDetails.fields.find(field => field._id === fieldId).slots[day][index];
      return {
        startTime: formatTime(slot.startTime),
        endTime: formatTime(slot.endTime)
      };
    });
    const fieldName = arenaDetails.fields.find(field => field._id === fieldId).name;
    const message = `Reserved Slots for ${day} at ${fieldName}:\n\n${reservedSlots.map(slot => `${slot.startTime} - ${slot.endTime}`).join('\n')}\n- Reserved by: ${username}`;
    return encodeURIComponent(message);
  };

  const formatTime = (time24) => {
    const [hour, minute] = time24.split(':');
    const hour12 = (hour % 12) || 12;
    const ampm = hour < 12 || hour === 24 ? 'AM' : 'PM';
    return `${hour12}:${minute} ${ampm}`;
  };

  const handleSlotCancellation = async (fieldId, day, index) => {
    // Confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!isConfirmed) {
      return; // Early return if the user cancels the action
    }

    try {
      const slotId = arenaDetails.fields.find(field => field._id === fieldId).slots[day][index]._id;
      const response = await axios.put(`${urlapi}/api/v1/arena/update-reservation/${arenaDetails._id}/${fieldId}/${slotId}`);
      const data = response.data;
      if (response.status === 200) {
        const updatedSlot = data.slot; // Assuming the backend sends back the updated slot
        const newArenaDetails = { ...arenaDetails };
        const field = newArenaDetails.fields.find(field => field._id === fieldId);
        field.slots[day][index] = updatedSlot;
        setArenaDetails(newArenaDetails);
        toast.success('Booking cancelled successfully!');
      } else {
        throw new Error(data.message || 'Failed to update slot reservation');
      }
    } catch (error) {
      console.error('Error updating slot reservation:', error);
      toast.error(error.message);
    }
  };

  if (!arenaDetails) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4 text-indigo-700">
        {arenaDetails.name} - Fields and Slots
      </h1>
      <div className="mb-4">
        <label htmlFor="fieldSelect" className="block text-lg font-semibold mb-2">Select Field:</label>
        <select
          id="fieldSelect"
          value={selectedFieldId}
          onChange={(e) => setSelectedFieldId(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
        >
          <option value="" disabled>Select Field</option>
          {arenaDetails.fields.map(field => (
            <option key={field._id} value={field._id}>{field.name} - Price: {field.pricePerHour}/hr</option>
          ))}
        </select>
      </div>
      {selectedFieldId && arenaDetails.fields.filter(field => field._id === selectedFieldId).map(field => (
        <div key={field._id} className="bg-white shadow-lg rounded-lg p-6 mb-4">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600">{field.name}</h2>
          <p className="text-lg font-medium text-gray-700">Price: ${field.pricePerHour}/hr</p>
          {Object.entries(field.slots).map(([day, slots]) => (
            <div key={day} className="mb-4">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">{day}</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  reserveSlots(field._id, day);
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
                          <td className="py-2 px-4">{formatTime(slot.startTime)}</td>
                          <td className="py-2 px-4">{formatTime(slot.endTime)}</td>
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
                                  handleSportSelection(field._id, day, index, e.target.value)
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
                                disabled={whatsappMessageSent[`${field._id}-${day}`]}
                                checked={selectedSlots[`${field._id}-${day}`]?.includes(index)}
                                onChange={(e) =>
                                  handleSlotSelection(field._id, day, index, e.target.checked)
                                }
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              />
                            )}
                          </td>
                          <td>
                            {!slot.reserved && selectedSlots[`${field._id}-${day}`]?.length > 0 && (
                              <a
                                href={`https://api.whatsapp.com/send?phone=${
                                  arenaDetails.contact
                                }&text=${generateReservedSlotsMessage(field._id, day)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleWhatsAppMessageSent(field._id, day)}
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
                                  handleSlotCancellation(field._id, day, index)
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
      ))}
    </div>
  );
};

export default Arenadetails;
