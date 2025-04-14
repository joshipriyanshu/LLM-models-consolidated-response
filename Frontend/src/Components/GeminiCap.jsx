import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiCap = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // Remove the metadata part "data:image/jpeg;base64,"
        const base64 = reader.result.split(",")[1];
        setBase64Image(base64);
      };
    }
  };

  const handleSubmit = async () => {
    if (!base64Image) {
      alert("Please select an image first");
      return;
    }

    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyD9IKqazh0KVED1s1kPuGQcQ4d9OIo1NDo"); // <-- safe in dev only

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt =
        "Please saggergate the data in the picture in different lines .";

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      };

      const result = await model.generateContent([prompt, imagePart]);

      const text = await result.response.text();

      setResponse(text);
    } catch (err) {
      console.error("Error generating content:", err);
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Image → Gemini Vision → AI Jingle</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Generate AI Jingle</button>

      {imagePreview && <img src={imagePreview} alt="Preview" width="200px" />}
      {loading && <p>Loading...</p>}

      {response && (
        <div>
          <h3>AI Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiCap;
