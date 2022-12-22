const mongoose = require('mongoose')

const DB = process.env.DATABASE_URI.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)

const connectDB = async () => {
    try {
        await mongoose.connect(DB)
    }
    catch(err) {
        console.log(err)
    }
}

module.exports = connectDB


