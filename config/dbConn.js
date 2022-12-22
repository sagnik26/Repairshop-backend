const mongoose = require('mongoose')

const DB = process.env.DATABASE_URI

const connectDB = async () => {
    try {
        await mongoose.connect(DB)
    }
    catch(err) {
        console.log(err)
    }
}

module.exports = connectDB


