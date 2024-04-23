const asyncHandler = require('express-async-handler')
const Room = require('../models/roomModel')

// @desc Get room
// @route GET /api/room
// @access Private.
const getRooms = asyncHandler(async(req, res) => {
    try {

        //get rooms from the database
        const room = await Room.find()

        //check if there is any rooms
        if(room.length === 0){
            return res.status(404).json({ message: 'Rooms not found'})
        }

        res.status(200).json(room)
        
    } catch (error) {
        console.error('Error retrieving rooms:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Get room
// @route GET /api/room/:id
// @access Private.
const getRoom = asyncHandler(async(req, res) =>{
    try {
        //getting the room from the database
        const room = await Room.findById(req.params.id)

        //check if the room exists
        if(!room){
            return res.status(404).json({ message: 'Room not found'})
        }

        res.status(200).json(room)
        
    } catch (error) {
        console.error('Error retrieving room:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})


// @desc Set room
// @route POST /api/room
// @access Private
const setRoom = asyncHandler(async(req, res) => {
    try {
        const {name, description, capacity, resources} = req.body

        //validate checks
        if (!name || !description || !capacity) {
            return res.status(400).json({ message: 'Name, description, and capacity are required for the room' });
        }

        //check for room with same name
        const room = await Room.findOne({ name: name})

        //If there is a room with same name handling that
        if(room){
            return res.status(400).json({ message: 'Already have a room with the same name'})
        }

        //create new room
        const newroom = await Room.create({
            name: name,
            description: description,
            capacity: capacity,
            resources: resources || []//handling the situation where there are no resources

        })

        res.status(201).json(newroom)

        
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})


// @desc Update room
// @route PUT /api/room/:id
// @access Private
const updateRoom = asyncHandler(async(req, res) => {
    try {
        //checek wether the room is existing in the database
        const room = await Room.findById(req.params.id)

        //if not found handling that
        if(!room){
            return res.status(404).json({ message: 'Room not found'})
        }

        // Validate required fields
        const { name, description, capacity, resources } = req.body;
        if (!name || !description || !capacity) {
            return res.status(400).json({ message: 'Name, description, and capacity are required for the room' });
        }

        //update the room in database
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id,
            {   name: name,
                description: description,
                capacity: capacity,
                $addToSet: { resources: { $each: resources || [] } } // Add new resources without overwriting existing ones
            }, {
            new: true
        })

        res.status(200).json(updatedRoom)


    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Delete room
// @route DELETE /api/room/:id
// @access Private
const deleteRoom = asyncHandler(async(req, res) => {
    try {
        //finding and deleting the room
        const deletedRoom = await Room.findByIdAndDelete(req.params.id)

        //check wether the room was available
        if(!deletedRoom){
            return res.status(404).json({ message: 'Room not found'})
        }

        res.status(200).json({ id: req.params.id, message: 'Room deleted succesfully'})

    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = {
    getRoom,
    getRooms,
    setRoom,
    updateRoom,
    deleteRoom
}