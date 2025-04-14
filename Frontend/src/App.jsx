import { useEffect, useState } from 'react'
import axios from 'axios'
import { GoogleGenAI } from "@google/genai";
import Textgenration from './Components/Textgenration';
import Imageprocessor from './Components/Imageprocessor';
import GeminiCap from './Components/GeminiCap';

function App() {
  
    return (
    
    <>
      {/* <Textgenration></Textgenration> */}
      {/* <Imageprocessor/> */}
      <GeminiCap></GeminiCap>

      </>
  )
}

export default App    
