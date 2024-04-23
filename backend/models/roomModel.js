const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name for the room']
    },
    description: {
        type: String,
        required: [true, 'Please add a description for the room']
    },
    capacity: {
        type: Number,
        required: [true, 'Please add a capacity for the room']
    },
    resources: {
        type: [String],
        default: [],
        validate: {
            validator: function(resources){
                return resources.every(resources => typeof resources === 'string')
            },
            message: 'Resources must be Strings'
        }
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Room', roomSchema)
