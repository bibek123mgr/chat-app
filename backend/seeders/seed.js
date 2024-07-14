const {faker}=require('@faker-js/faker')
const User = require('../models/userModel')
const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASS, ADMIN_ROLE } = require('../config/config')

const seed = {
   userSeeder:async (number) => {
    try {
        const userPromise = []
        for (let i = 0; i < number; i++){
            const tempUser = User.create({
                name: faker.person.fullName,
                email: faker.internet.email,
                password:'password'
            })
            userPromise.push(tempUser)
        }
        await Promise.all(userPromise)
        console.log('user created',number)
        process.exit(1)
    } catch (error) {
        console.log(error)
        process.exit(1)      
    }
},
 adminSeeder:async (req,res) => {
    try {
        const user = await User.countDocuments()
        if (user == 0) {
            await User.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASS,
                role:ADMIN_ROLE
            })
            console.log('admin seeded')
        } else {
             console.log('admin already seeded')           
        }
    } catch (error) {
    console.log(error)        
    }
} 
}


module.exports=seed