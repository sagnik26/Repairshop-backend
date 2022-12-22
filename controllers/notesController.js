const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')

// Get all notes
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()

    if(!notes?.length) {
        return res.status(400).json({
            message: 'No note found'
        })
    }

    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean()
        return {...note, username: user.username}
    }))

    res.json(notesWithUser)
})

// Create new note
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    if(!user | !title | !text) {
        res.status(400).json({ message: 'All fields required' })
    }

    const duplicate = await Note.findOne({title}).lean().exec()
    
    if(duplicate) {
        res.status(409).json({message: 'Duplicate title'})
    }

    const note = await Note.create({ user, title, text })

    if(note) {
        res.status(201).json({ message : 'Note successfully created' })
    }
    else {
        res.status(400).json({ message : 'Invalid note data found' })
    }
})

// Update a note
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    if(!id | !user | !title | !text | typeof completed !== 'boolean' ) {
        res.status(400).json({ message: 'All fields required' })
    }
    
    const note = await Note.findOne({id}).exec()

    if(!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const duplicate = await Note.findOne({title}).lean().exec()
    
    if(duplicate && duplicate._id.toString() !== id) {
        res.status(409).json({message: 'Duplicate note title'})
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json(`'${updatedNote.title}' updated`)

})

// Delete a note
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    if(!id) {
        res.status(400).json({message: 'id required'})
    }

    const note = await Note.findById(id).exec()

    if(!note) {
        res.status(400).json({message: 'Note not found'})
    }
    
    const result = await note.deleteOne()

    const reply = `Note '${result.title}' with id '${result._id}' deleted`

    res.json(reply)
})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}

