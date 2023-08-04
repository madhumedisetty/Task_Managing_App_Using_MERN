import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemSecondaryAction, IconButton, Checkbox } from '@mui/material';
import { Delete } from '@mui/icons-material';
import axios from 'axios';

const BASE_URL = 'http://localhost:3008/api/tasks';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/all`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = async () => {
    if (inputValue.trim() !== '') {
      try {
        const newTodo = { title: inputValue, completed: false, editing: true };
        const response = await axios.post(`${BASE_URL}/add`, newTodo);
        setTodos([...todos, response.data]);
        setInputValue('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      const updatedTodos = todos.filter((todo) => todo._id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    console.log({ completed })
    try {
      const updatedTodo = { ...todos.find((todo) => todo._id === id), completed };
      console.log({ updatedTodo })
      await axios.put(`${BASE_URL}/update/${id}`, updatedTodo);
      const updatedTodos = todos.map((todo) =>
        todo._id === id ? { ...todo, completed } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleTextUpdate = async (id, newText) => {
    try {
      const updatedTodo = { ...todos.find((todo) => todo._id === id), title: newText };
      await axios.put(`${BASE_URL}/update/${id}`, updatedTodo);
      const updatedTodos = todos.map((todo) =>
        todo._id === id ? { ...todo, title: newText } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo text:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        To-Do List
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <TextField
          variant="outlined"
          fullWidth
          label="Enter your task..."
          value={inputValue}
          onChange={handleInputChange}
          sx={{ flex: 1, marginRight: '10px' }}
        />
        <Button variant="contained" onClick={handleAddTodo} sx={{ backgroundColor: '#28a745', color: '#fff' }}>
          Add
        </Button>
      </div>
      <List>
        {todos.map((todo) => (

          <ListItem key={todo._id}>
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo._id, !todo.completed)}
            />
            <TextField
              fullWidth
              value={todo.title}
              InputProps={{
                readOnly: !todo.editing,
              }}
              onBlur={() => {
                if (todo.editing) {
                  handleTextUpdate(todo._id, todo.title);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && todo.editing) {
                  e.target.blur();
                }
              }}
              onChange={(e) =>
                setTodos((prevTodos) =>
                  prevTodos.map((prevTodo) =>
                    prevTodo._id === todo._id ? { ...prevTodo, title: e.target.value } : prevTodo
                  )
                )
              }
              onClick={() => {
                setTodos((prevTodos) =>
                  prevTodos.map((prevTodo) =>
                    prevTodo._id === todo._id ? { ...prevTodo, editing: true } : { ...prevTodo, editing: false }
                  )
                );
              }}
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTodo(todo._id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
