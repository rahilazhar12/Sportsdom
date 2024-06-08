import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { urlapi } from '../../Components/Envroutes';
import toast from 'react-hot-toast';

function SlotForm() {
  const { id, fieldId } = useParams(); // Assume you have both arenaId and fieldId from the route params
  const [slots, setSlots] = useState([]);
  
  useEffect(() => {
    handleAddSlot(); // Automatically add slots on component mount
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiUrl = `${urlapi}/api/v1/arena/add-slots/${id}/${fieldId}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slots })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Slots added successfully!');
      } else {
        toast.error(data.message);
      }
      console.log(data);
    } catch (error) {
      console.error('Failed to add slots:', error);
      toast.error('Failed to add slots.');
    }
  };

  const handleChange = (index, field, value) => {
    const newSlots = slots.map((slot, idx) => {
      if (idx === index) {
        return { ...slot, [field]: value };
      }
      return slot;
    });
    setSlots(newSlots);
  };

  const handleAddSlot = () => {
    const newSlots = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (let day of days) {
      for (let i = 0; i < 24; i++) {
        let startTime = `${i < 10 ? '0' : ''}${i}:00`;
        let endTime = `${i < 9 ? '0' : ''}${i + 1}:00`;
        newSlots.push({ day, startTime, endTime, reserved: false });
      }
    }
    setSlots(newSlots);
  };

  const handleRemoveSlot = (index) => {
    const newSlots = slots.filter((_, idx) => idx !== index);
    setSlots(newSlots);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {slots.map((slot, index) => (
          <div key={index} className="grid grid-cols-4 gap-3 items-end">
            <select
              value={slot.day}
              onChange={(e) => handleChange(index, 'day', e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
            <input
              type="text"
              value={slot.startTime}
              readOnly
              className="p-2 border rounded"
            />
            <input
              type="text"
              value={slot.endTime}
              readOnly
              className="p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveSlot(index)}
              className="text-white bg-red-500 hover:bg-red-700 p-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSlot}
          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
        >
          Add Slots
        </button>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white p-2 rounded"
        >
          Submit Slots
        </button>
      </form>
    </div>
  );
}

export default SlotForm;
