const Arenamodal = require('../Models/Arenamodal');

const ArenaRegistration = async (req, res) => {
    try {
        const { name, location, opentime, closetime, charges , contact } = req.body;

        // Basic validation
        if (!name || !location || !opentime || !closetime || !charges || !contact) {
            return res.status(400).send({ message: "Please fill all the fields." });
        }

        // Check if the arena already exists
        const existingArena = await Arenamodal.findOne({ name, location });
        if (existingArena) {
            return res.status(400).send({ message: "Arena already registered with this name and location." });
        }

        // Create a new arena
        const newArena = new Arenamodal({
            name, location, opentime, closetime, charges , contact
        });

        const result = await newArena.save();
        return res.status(201).send({ message: "Arena registered successfully", name  , contact});

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).send({ message: "Failed to register Arena." });
    }
};


const ArenaGetonId = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Arenamodal.findById(id)
        if (result) {
            res.status(200).send(result)
        } else {
            res.status(400).send({ Message: "Invalid Id" })
        }
    } catch (error) {
        console.log(error)
    }
}



const AddSlotsToArena = async (req, res) => {
    try {
        const { arenaId } = req.params;
        const { slots } = req.body; // Expect slots to include a 'day' field

        // Check if the arena exists
        const existingArena = await Arenamodal.findById(arenaId);
        if (!existingArena) {
            return res.status(404).send({ message: "Arena not found." });
        }

        // Filter out existing slots for each day and add new slots
        slots.forEach(slot => {
            // Check if a slot for the same day and time already exists
            const slotExists = existingArena.slots.some(existingSlot =>
                existingSlot.day === slot.day &&
                existingSlot.startTime === slot.startTime &&
                existingSlot.endTime === slot.endTime);

            if (!slotExists) {
                existingArena.slots.push({
                    ...slot,
                    reserved: false // Initialize each slot as not reserved
                });
            }
        });

        const result = await existingArena.save();
        return res.status(201).send({ message: "Slots added successfully", slots: existingArena.slots });

    } catch (error) {
        console.error("Slot Addition Error:", error);
        return res.status(500).send({ message: "Failed to add slots to Arena." });
    }
};


// 



// const ReserveSlot = async (req, res) => {
//     console.log("Received day:", req.body.slotReservations[0].day, "Received slotIndices:", req.body.slotReservations[0].slotIndices);

//     try {
//         const { arenaId } = req.params;
//         const { slotReservations } = req.body; // Expect an array of objects with day and slotIndices
//         const userId = req.user.id;
//         const userName = req.user.name;

//         // Check if the arena exists
//         const existingArena = await Arenamodal.findById(arenaId);
//         if (!existingArena) {
//             return res.status(404).send({ message: "Arena not found." });
//         }

//         // Process each day's reservation request
//         const reservedSlots = [];
//         for (const reservation of slotReservations) {
//             const { day, slotIndices } = reservation;
//             const daySlots = existingArena.slots.filter(slot => slot.day === day);
//             for (const slotIndex of slotIndices) {
//                 if (slotIndex < 0 || slotIndex >= daySlots.length) {
//                     continue; // Skip invalid indices
//                 }
//                 const slot = daySlots[slotIndex];
//                 if (!slot.reserved) { // Check if slot is not reserved
//                     slot.reserved = true;
//                     slot.reservedBy = { userId, userName };
//                     reservedSlots.push({ day, slotIndex });
//                 }
//             }
//         }



//         if (reservedSlots.length > 0) {
//             await existingArena.save();
//             return res.status(200).send({ message: "Slots reserved successfully.", reservedSlots });
//         } else {
//             return res.status(400).send({ message: "No slots reserved, they may already be reserved or indices are invalid." });
//         }

//     } catch (error) {
//         console.error("Slot Reservation Error:", error);
//         return res.status(500).send({ message: "Failed to reserve slots." });
//     }
// };

const ReserveSlot = async (req, res) => {
    try {
        const { arenaId } = req.params;
        const userId = req.user.id;
        const userName = req.user.name;

        const slotReservations = JSON.parse(req.body.slotReservations);

        const existingArena = await Arenamodal.findById(arenaId);
        if (!existingArena) {
            return res.status(404).send({ message: "Arena not found." });
        }

        const reservedSlots = [];
        for (const reservation of slotReservations) {
            const { day, slotIndices, sports } = reservation;
            const daySlots = existingArena.slots.filter(slot => slot.day === day);
            for (let i = 0; i < slotIndices.length; i++) {
                const slotIndex = slotIndices[i];
                const sport = sports[i];  // Extract the sport for the current slot index
                if (slotIndex < 0 || slotIndex >= daySlots.length) {
                    continue;
                }
                const slot = daySlots[slotIndex];
                if (!slot.reserved) {
                    slot.reserved = true;
                    slot.reservedBy = { userId, userName };
                    slot.imageUrl = req.file ? req.file.path : ''; // Save image URL or path
                    slot.sport = sport; // Assign the sport
                    reservedSlots.push({ day, slotIndex, sport, imageUrl: slot.imageUrl });
                }
            }
        }

        if (reservedSlots.length > 0) {
            await existingArena.save();
            return res.status(200).send({ message: "Slots reserved successfully.", reservedSlots });
        } else {
            return res.status(400).send({ message: "No slots reserved, they may already be reserved or indices are invalid." });
        }
    } catch (error) {
        console.error("Slot Reservation Error:", error);
        return res.status(500).send({ message: "Failed to reserve slots." });
    }
};

const UpdateSlotReservation = async (req, res) => {
    try {
        const { arenaId, slotId } = req.params;
        
        const arena = await Arenamodal.findById(arenaId);
        if (!arena) {
            return res.status(404).send({ message: "Arena not found." });
        }

        const slot = arena.slots.id(slotId);
        if (!slot) {
            return res.status(404).send({ message: "Slot not found." });
        }

        // Toggle the reservation status
        slot.reserved = !slot.reserved;

        // If the slot is now unreserved, reset relevant fields
        if (!slot.reserved) {
            slot.reservedBy = null;
            slot.imageUrl = '';
            slot.sport = null;
        }

        await arena.save();
        res.status(200).send({ message: "Slot reservation updated.", slot });

    } catch (error) {
        console.error("Update Slot Reservation Error:", error);
        res.status(500).send({ message: "Failed to update slot reservation." });
    }
};





const GetallArenas = async (req, res) => {
    try {
        const Arena = await Arenamodal.find();
        if (Arena.length > 0) {
            return res.status(200).send(Arena);
        } else {
            return res.status(200).send({ Message: "No Arena Found" });
        }
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
};






module.exports = { ArenaRegistration, GetallArenas, AddSlotsToArena, ReserveSlot, ArenaGetonId , UpdateSlotReservation }
