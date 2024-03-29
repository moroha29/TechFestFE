"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Card, IconButton} from "@mui/material";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import SettingsIcon from '@material-ui/icons/Settings';
import Navbar from "@/components/NavBar";
export default function SimpleBottomNavigation() {
    const [value, setValue] = useState(0);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<string[]>(['']);
    const handleOptionChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
        const newOptions = options.map((option, i) => i === index ? event.target.value : option);
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, '']); // Add a new empty option
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const fetchSuggestedQuery = async () => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch('http://localhost:8000/gpt/generated_question/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setQuestion(data.question); // Update the question
            setOptions(data.options); // Update the options
        } catch (error) {
            console.error('Error fetching suggested query:', error);
        }
    };
    const handleSuggestQuery = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        fetchSuggestedQuery();
    };

    const handleSubmitQuestion = async (event: FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const payload = {
            question: question,
            options: options.filter(option => option.trim() !== ''), // Filter out empty options
            answer: []
        };

        try {
            const response = await fetch('http://localhost:8000/questions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle successful question submission
            // E.g., clear the form, display a success message, etc.
            setQuestion('');
        } catch (error) {
            console.error('Error submitting question:', error);
        }
    };

    return (

        <div className='bg-gradient-to-b from-pink-100 h-screen'>

        <main className="flex flex-col items-center justify-between pt-10 py-2">
        <div className="z-10 items-center justify-between font-mono text-sm lg:flex">
            
        <div>
        <Card className="bg-gradient-to-b from-pink-100" >
                    <Box sx={{ width: "80%", justifyContent: "centre", alignItems: 'center', margin:"auto", marginTop :"10px"}} className="from-blue-300 flex flex-col items-center justify-between">
                        
                        <Box component="form" onSubmit={handleSubmitQuestion} className="from-blue-300">
                            <TextField
                                fullWidth
                                label="Question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                id="outlined-multiline-flexible"
                                multiline
                                maxRows={4}
                                style={{ paddingBottom: '10px'}}
                            />
                            {options.map((option, index) => (
                                <Box key={index} display="flex" alignItems="center" gap={2}>
                                    <TextField
                                        fullWidth
                                        label={`Option ${index + 1}`}
                                        value={option}
                                        onChange={handleOptionChange(index)}
                                        variant="outlined"
                                        id="outlined-multiline-flexible"
                                        multiline
                                        maxRows={2}
                                        style={{ paddingBottom: '10px' }}
                                    />
                                    <IconButton onClick={() => handleRemoveOption(index)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button startIcon={<AddIcon />} onClick={handleAddOption} variant="outlined" sx={{ width: "100%", marginBottom: "10px", marginTop: "10px"}} >
                                Add Option
                            </Button>
                            <Button startIcon={<SettingsIcon />} variant="outlined" color="primary" sx={{ width: "100%", marginBottom: "10px"}} onClick={handleSuggestQuery}>
                                Suggest Query
                            </Button>
                            <Button type="submit" variant="outlined" color="secondary" sx={{ width: "100%", marginBottom: "10px"}}>
                                Submit Question
                            </Button>
                        </Box>
                        
                </Box>
            </Card>
            </div>
            </div>
            
        </main>
        <Box sx={{ width: "100%" }} className="fixed z-10 bottom-0">
                    <Navbar />
                </Box>
        </div>
    );
}
