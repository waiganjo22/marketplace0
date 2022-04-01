// mongoose database
const mongoose = require('mongoose');

const DBConnection = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
           
        })
        console.log(`Database Connected`)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}
module.exports = DBConnection