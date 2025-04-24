import React, { useState } from "react";


import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonrepair } from 'jsonrepair'



const GeminiCap = () => {
  const [fileName, setFileName] = useState("");
  const [base64Pdf, setBase64Pdf] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        setBase64Pdf(base64);
      };
    }
  };

  const handleSubmit = async () => {
    if (!base64Pdf) {
      alert("Please select a PDF file first");
      return;
    }

    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyD9IKqazh0KVED1s1kPuGQcQ4d9OIo1NDo"
      ); // Replace with your actual API key
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Extract the data from the provided PDF and return it as a JSON object. 
        
        The JSON object should have the following structure:
        {
          "seller": "string",
          "date": "string (YYYY-MM-DD)",
          "bill_no": "string",
          "gstin": "string",
          "total_amount": "number",
          "items": [
            {
              "name": "string",
              "qty": "number",
              "price": "number",
              "discount": "number",
              "amount": "number"
            }
          ]
        }
        
        Ensure the JSON is valid and parsable. Do not include any extra text or explanations.
        If a field cannot be extracted, use null as the value.
      `;

      const pdfPart = {
        inlineData: {
          data: base64Pdf,
          mimeType: "application/pdf",
        },
      };

      const result = await model.generateContent([prompt, pdfPart]);
      const text = result.response.text();
      console.log("Gemini Response:", text);

      try {
        const repaired = jsonrepair(text)
        const parsed = JSON.parse(repaired)
        setResponse(parsed)
      } catch (e) {
        alert("Even after fixing, the response isn't valid JSON.")
      }
    } catch (err) {
      console.error("❌ Gemini API error:", err);
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Gemini Invoice Extractor (PDF)</h2>

      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleSubmit} style={{ marginLeft: "10px" }}>
        Generate Invoice JSON
      </button>

      {fileName && (
        <p>
          <strong>Selected File:</strong> {fileName}
        </p>
      )}

      {loading && <p>⏳ Processing PDF with Gemini...</p>}

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>Invoice Details from Gemini:</h3>
          <p>
            <strong>Seller:</strong> {response.seller}
          </p>
          <p>
            <strong>Date:</strong> {response.date}
          </p>
          <p>
            <strong>Bill No:</strong> {response.bill_no}
          </p>
          <p>
            <strong>GSTIN:</strong> {response.gstin}
          </p>
          <p>
            <strong>Total Amount:</strong> ₹{response.total_amount}
          </p>

          <h4>Items:</h4>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {response.items?.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{item.price}</td>
                  <td>{item.discount}</td>
                  <td>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GeminiCap;