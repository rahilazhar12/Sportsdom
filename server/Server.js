const express = require('express');
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv'); // Note that you might often see dotenv.config() invoked immediately like this.
const morgan = require('morgan');
const dbConnection = require('./database/dbcon');
const userrouter = require('./Routes/auth.routes');
const arenarouter = require('./Routes/Arena.routes');
const cron = require('node-cron');
const Arenas = require('./Models/Arenamodal')
const Arenamodal = require('./Models/Arenamodal');


// rest object 
const app = express();
// CORS configuration
const corsOptions = {
    origin: ['http://localhost:5173', 'https://sportsdom.online']  // Allow requests from both these origins
};

app.use(cors(corsOptions));

dotenv.config();

dbConnection()
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    next(err);
});

app.use((err, req, res, next) => {
    console.error(err); // Log error information to console or a file
    res.status(500).send('Internal Server Error');
});


// Helper function to get yesterday's day name in Pakistan format
function getYesterdayDayName() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday.toLocaleDateString('en-PK', { weekday: 'long' });
}

getYesterdayDayName()

// Schedule the task to run at midnight every day
cron.schedule('0 0 * * *', async () => {
    console.log('Resetting slots for the day that has just ended...');
    const dayToReset = getYesterdayDayName(); // Get the name of yesterday's day
    try {
        await Arenas.updateMany(
            { "slots.day": dayToReset },
            { $set: { "slots.$[elem].reserved": false, "slots.$[elem].reservedBy": null } },
            { arrayFilters: [{ "elem.day": dayToReset }] }
        );
        console.log(`All slots for ${dayToReset} have been reset successfully`);
    } catch (error) {
        console.error('Failed to reset slots:', error);
    }
})



// Cron job that runs every 30 seconds
// cron.schedule('*/30 * * * * *', async () => {
//     console.log('Resetting all slots...');
//     try {
//         await Arenas.updateMany(
//             {},
//             { $set: { "slots.$[].reserved": false, "slots.$[].reservedBy": null, "slots.$[].imageUrl": null, "slots.$[].sport": null } }
//         );
//         console.log('All slots have been reset successfully');
//     } catch (error) {
//         console.error('Failed to reset slots:', error);
//     }
// });

// cron.schedule('0 0 * * *', async () => {
//     console.log('Resetting all slots at midnight...');
//     try {
//         await Arenas.updateMany(
//             {},
//             { $set: { "slots.$[].reserved": false, "slots.$[].reservedBy": null } }
//         );
//         console.log('All slots have been reset successfully');
//     } catch (error) {
//         console.error('Failed to reset slots:', error);
//     }
// });


app.use("/api/v1/users", userrouter)
app.use("/api/v1/arena", arenarouter)

app.get('/he', (req, res) => {
    return res.status(200).send({ Message: "Hellow World" })
})

app.get('/get', async (req, res) => {
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
})


const port = process.env.PORT || 8000


app.listen(port, () => {
    console.log(`Server is running on port ${port}`.bgMagenta)
})