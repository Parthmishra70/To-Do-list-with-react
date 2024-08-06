const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Create a new todo
router.post('/', async (req, res) => {
    // Create a new Todo instance with the data from the request body
    const todo = new Todo({
        title: req.body.title,
        description: req.body.description
    });

    try {
        // Save the new Todo to the database
        const newTodo = await todo.save();
        // Respond with a 201 status code and the newly created Todo
        res.status(201).json(newTodo);
    } catch (err) {
        // Respond with a 400 status code if there's an error
        res.status(400).json({ message: err.message });
    }
});



// Fetch all todos
router.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        console.error('Error fetching todos:', err.message);
        res.status(500).json({ message: err.message });
    }
});


// Edit a todo
router.put('/edit/:id', async (req, res) => {
    try {
        console.log('Edit request received for ID:', req.params.id);

        // 1. Find the todo item by its ID
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            console.log('Todo not found with ID:', req.params.id);
            return res.status(404).json({ message: 'Todo not found' });
        }

        // 2. Update the todo item with the new data
        todo.title = req.body.title || todo.title;
        todo.description = req.body.description || todo.description;

        // 3. Save the updated todo item back to the database
        const updatedTodo = await todo.save();
        console.log('Todo updated with ID:', req.params.id);

        // 4. Respond to the client with the updated todo item
        res.json(updatedTodo);
    } catch (err) {
        console.error('Error occurred while editing todo:', err.message);
        res.status(500).json({ message: err.message });
    }
});




// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        console.log('Delete request received for ID:', req.params.id);

        // 1. Find the todo item by its ID
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            console.log('Todo not found with ID:', req.params.id);
            return res.status(404).json({ message: 'Todo not found' });
        }

        // 2. Remove the todo item from the database using deleteOne
        await Todo.deleteOne({ _id: req.params.id });
        console.log('Todo deleted with ID:', req.params.id);

        // 3. Respond to the client with a success message
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        console.error('Error occurred while deleting todo:', err.message);
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
