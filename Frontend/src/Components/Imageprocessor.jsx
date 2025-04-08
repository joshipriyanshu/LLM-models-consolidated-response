import React, { useState } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai"

const Imageprocessor = () => {
  const [image, setImage] = useState(null)        // for preview
  const [base64Image, setBase64Image] = useState("") // for sending to API

  const handleClick = (e) => {
    const file = e.target.files[0]

    if (file) {
      setImage(URL.createObjectURL(file))  // Preview Image

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setBase64Image(reader.result.split(',')[1])  // Remove meta info
      }
    }
  }

  const handleSubmit = async () => {
    if (!base64Image) {
      alert("Please select an image first")
      return
    }

    const genAI = new GoogleGenerativeAI("AIzaSyD9IKqazh0KVED1s1kPuGQcQ4d9OIo1NDo")

    const fileToGenerativePart = (base64Data, mimeType) => {
      return {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

      const prompt = "Explain the image shown"

      const imageParts = [
        fileToGenerativePart(base64Image, "image/jpeg")
      ]

      const result = await model.generateContent([prompt, ...imageParts])

      const text = await result.response.text()

      console.log(text)
      alert(text)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h2>Image Processor</h2>

      <input type='file' accept='image/*' onChange={handleClick} />

      <button type='submit' onClick={handleSubmit}>Upload & Ask AI</button>

      <div>
        <h3>Preview</h3>
        {image && (
          <img src={image} alt="Img" width='200px' />
        )}
      </div>
    </div>
  )
}

export default Imageprocessor
