const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')
mongoose.set('strictQuery', false)
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true
        })
        console.log('MongoDB Connected');
    } catch (err) {
        // Exit process with faluire
        console.log(err);
        process.exit(1)
    }
}

module.exports = connectDB