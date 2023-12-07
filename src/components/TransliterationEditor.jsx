import React, { useState } from 'react';
import './TransliterationEditor.css'; // Import your custom styles if needed
// import logo.png from images
 import logo from '../images/logo.png'; // Import your logo image if needed

const TransliterationEditor = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [lastWord, setLastWord] = useState('');

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    if (text === '') {
      setOutputText('');
      setLastWord('');
    } else if  (text.endsWith(' ')) {
      const inputText = text.trim().split(' ');
      const index = inputText.length - 1;
      const word = inputText[index];
      if (word !== lastWord) {
        callTransliterationAPI(word);
        setLastWord(word);
      }
  }
  };

  const callTransliterationAPI = async (englishWord) => {
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
      <header className="header">
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
      <footer className="footer">
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="AI4Bharat logo" className="logo" />
            <p style={{ marginLeft: '10px' }}>Made with <span className="heart">❤</span></p>
          </div>
        </div>
        <p>
        Courtesy to AI4Bharat
      </p>
      </footer>
    </div>
  );
};

export default TransliterationEditor;
