import React, { useState } from 'react';
import './TransliterationEditor.css'; // Import your custom styles if needed

const TransliterationEditor = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    if (text === '') {
      setOutputText('');
    } else if  (text.endsWith(' ')) {
      const inputText = text.trim().split(' ');
      const index = inputText.length - 1;
      callTransliterationAPI(inputText[index]);
    }
  };

  const callTransliterationAPI = async (englishWord) => {
    // Replace this with your actual API endpoint and handling logic
    try {
      const response = await fetch('https://api.dhruva.ai4bharat.org/services/inference/transliteration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'EAMe0BjX5OSO_Rw5BDQZKmhzW1kdXDOZM9eEKYrumLIMlCCHzrUllMn5UU9SZmHa',
          'Accept': '*/*',
        },
        body: JSON.stringify({
          input: [
            {
              source: englishWord,
            },
          ],
          config: {
            serviceId: 'ai4bharat/indicxlit--cpu-fsv2',
            language: {
              sourceLanguage: 'en',
              sourceScriptCode: '',
              targetLanguage: 'ks',
              targetScriptCode: '',
            },
            isSentence: false,
            numSuggestions: 5,
          },
          controlConfig: {
            dataTracking: true,
          },
        }),
      });

      const data = await response.json();
      // Assuming the API returns transliterated word in the 'output' field of the first item in 'output' array
      if (data.output && data.output.length > 0) {
        const responseWord = data.output[0].target[0]
        setOutputText((prevOutput) => prevOutput + ' ' + responseWord);
      }
    } catch (error) {
      console.error('Error calling transliteration API:', error);
    }
  };

  return (
    <div>
      <header>
        <h1>English Roman to Kashmiri Transliteration</h1>
      </header>
      <main>
        <textarea
          className='textarea'
          dir="rtl" // Set direction to right-to-left
          placeholder="Type in Roman English..."
          value={inputText}
          onChange={handleInputChange}
        />
        <textarea
          className='textarea'
          dir="rtl" // Set direction to right-to-left
          value={outputText}
          readOnly // Make this textarea read-only as it's only for display
        />
      </main>
      <footer>
        <p>Your footer content goes here...</p>
      </footer>
    </div>
  );
};

export default TransliterationEditor;
