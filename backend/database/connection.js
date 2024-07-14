const mongoose = require('mongoose')
const { MONGO_URI } = require('../config/config')
const seed = require('../seeders/seed')

const connection = async() => {
    const connected = await mongoose.connect(MONGO_URI)
    if (connected) {
        seed.adminSeeder()
        console.log('connected to database')
    } else {
        console.log('error connecting database')
    }
}

module.exports=connection