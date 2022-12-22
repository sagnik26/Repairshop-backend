require('dotenv').config()
const mongoose = require('mongoose')

const DB = process.env.DATABASE

const connectDB = async () => {
    try {
        await mongoose.connect(DB)
    }
    catch(err) {
        console.log(err)
    }
}

module.exports = connectDB


