'use strict'
import express from 'express'
import 'dotenv/config'
import sequelize from './src/config/database.js';
const app = express();
const port =process.env.PORT || 4000

async function connectDataBase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        }
     catch (error) {
        console.error('Unable to connect to the database:', error)
}
}
connectDataBase()


app.get('/',(req,res) => {
    res.send("HELLO ANH EM ")
})

app.listen( port, () => {
    console.log(`program is running on the http://localhost:${port}`);
})