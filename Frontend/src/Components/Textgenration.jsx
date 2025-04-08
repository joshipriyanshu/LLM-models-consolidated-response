import React from 'react';
import { useState } from 'react'
import  '../App.css';
import { GoogleGenAI } from "@google/genai";



function Textgenration() {
  const [aiResponse, setAiResponse] = useState("")
  const [value, setValue] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleClick = (e) => {
    e.pre
    console.log(e)
    setValue(e.target.value)
    
    
  }

  const handleSubmit = async () => {
    setValue(" ")
    setIsSubmitted(true)
       const ai = new GoogleGenAI({
      apiKey: "AIzaSyD9IKqazh0KVED1s1kPuGQcQ4d9OIo1NDo"
    })
       try {
        console.log(value)
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: value ,
          
        });

        const result = response.text; // Assuming response.text is correct
        console.log(result);
        setAiResponse(result);  // Store in state to show in UI
      } catch (error) {
        console.log("Error:", error);
      }
      
    
  }

  

  return (
    
    <>
      <h1>Google GenAI Response</h1>
      
      <input type='text' value={value} onChange={handleClick} ></input>
      <button formAction='submit' type='submit' onClick={handleSubmit}> Submit</button>
      <p> Response from chat GPT:- </p>   
      
      <div className='gptResponse-container'>
        
      
        { isSubmitted ?   aiResponse||"loading the response....":  "how i can help you today?"}</div>

    </>
  )
}

export default Textgenration;