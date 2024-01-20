"use client"
import Image from "next/image";
import LoginModal2 from "@/components/LoginModal2";
import { useState, useEffect } from 'react';
import * as React from 'react';
import CardDisplay from '@/components/CardDisplay';

const QuestionPage = () => {
  const [questionData, setQuestionData] = useState<Array<{ _id: string; questionText: string; choices: Array<{ id: string; text: string }> }>>([]);
    const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const fetchQuestionData = async () => {
    const response = {
      data: [
        {
          _id:"1",
          questionText: "Have you entered a hackathon before?",
          choices: [
            { id: "1", text: "Yes" },
            { id: "2", text: "No" },
            { id: "3", text: "Maybe" }
          ]
        }, 
        {
          _id:"2",
          questionText: "Have you given up during a hackathon before?",
          choices: [
            { id: "1", text: "Yes" },
            { id: "2", text: "No" },
            { id: "3", text: "Definitely" }
          ]
        }, 
      ]
    };

    setQuestionData(response.data);
  };useEffect(() => {
    fetchQuestionData();
  }, []);

  const handleChoiceSelect = (choiceIds: string[]) => {
    setSelectedChoices(choiceIds);
  };

  const handleSubmit = async (question: { _id: string; questionText: string; choices: { id: string; text: string }[] }) => {
    if (selectedChoices.length === 0) {
      alert('Please select at least one choice');
      return;
    }
    alert(selectedChoices)
    //setIsClicked(true)
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ questionId: question._id, selectedChoices })
      });
      console.log(response)
      // Check for successful response and handle accordingly
    } catch (error) {
      console.error('Error submitting choices:', error);
    }
  };

  const mappedQuestionData = questionData.map(question => ({
    _id: question._id,
    questionText: question.questionText,
    choices: question.choices.map(choice => ({
      id: choice.id,
      text: choice.text
    }))
  }));

  return (
    <div>
        <LoginModal2/>
        <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        
    <div>
          {mappedQuestionData.map((question, index) => (
            <CardDisplay
              key={index}
              questionData={question}
              handleChoiceSelect={handleChoiceSelect}
              handleSubmit={handleSubmit}
            />
          ))}
        </div>
        </div>
        
    </main>
    </div>
      );
};

export default QuestionPage;