const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path")
const port = process.env.PORT || 5000;

const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")))
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
;

const Todo = require('./models/Todo');

app.get('/todos', async (req,res) => {
    const todos = await Todo.find();

    res.json(todos);
});

app.post('/todo/new', (req,res) => {
    const todo = new Todo({
        text: req.body.text
    });
    todo.save();
    res.json(todo);
})

app.delete('/todo/delete/:id', async (req,res) => {
    const result = await Todo.findByIdAndDelete(req.params.id);

    res.json(result);
});

app.get('/todo/complete/:id', async (req,res) => {
    const todo = await Todo.findById(req.params.id);

    todo.complete = !todo.complete;
    
    todo.save();

    res.json(todo);

});



app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => console.log("server started on 3001"));
