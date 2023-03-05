import React, { useState, useEffect, useRef } from 'react';
import { generateImage } from './utils/helper';
import './App.css';

function App() {
  const inputRef = useRef(null);
  const [generatedImages, setGeneratedImages] = useState(
    JSON.parse(localStorage.getItem('generatedImages')) || []
  );
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('generatedImages', JSON.stringify(generatedImages));
  }, [generatedImages]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (prompt.trim() === '') {
      inputRef.current.focus();
    } else {
      setIsLoading(true);

      try {
        const generatedImageUrl = await generateImage(prompt);
        const createObj = {
          url: generatedImageUrl,
          text: prompt,
        };
        setGeneratedImages([createObj, ...generatedImages]);
        setPrompt('');
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }
  return (
    <div className='app'>
      <h1 className='title'>Image Bek AI</h1>
      <form className='form' onSubmit={handleSubmit}>
        <div className='input-container'>
          <input
            ref={inputRef}
            type='text'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Visualize an extraordinary scene...'
          />
        </div>
        <button type='submit'>
          {isLoading ? (
            <span className='flashing-text'>Creating visual art...</span>
          ) : (
            'Generate'
          )}
        </button>
      </form>
      {generatedImages.length > 0 && (
        <>
          <div className='image-grid'>
            {generatedImages.map((image, index) => (
              <div key={index} className='grid-item'>
                <img src={image.url} alt='Generated' className='grid-image' />
              </div>
            ))}
          </div>
        </>
      )}
      <footer className='footer'>
        <p>Envision Your Masterpiece</p>
        <span>
          &copy; {new Date().getFullYear()}{' '}
          <a href='https://github.com/bekza' target='_blank' rel='noreferrer'>
            My Github Page
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
