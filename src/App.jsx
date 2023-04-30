import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { generateImage } from './utils/helper';
import { RiDeleteBin2Fill, RiFileCopy2Line } from 'react-icons/ri';
import { Modal, Button } from 'antd';

const initialState = [
  {
    id: 'default-1',
    url: 'https://img.freepik.com/free-vector/landscape-sketch-mountains-pines_23-2147606023.jpg?w=2000',
    prompt: 'nature sketch images',
  },
  {
    id: 'default-2',
    url: 'https://images.nightcafe.studio/jobs/dOmBUOJnc3ZELp0nzZiv/dOmBUOJnc3ZELp0nzZiv--1--4i839.jpg?tr=w-1600,c-at_max',
    prompt: 'squirrel artwork',
  },
];
const clearLocalStorage = () => {
  setTimeout(() => {
    localStorage.removeItem('generatedImages');
  }, 60 * 60 * 1000); // 1 hour in milliseconds
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

function App() {
  const inputRef = useRef(null);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [generatedImages, setGeneratedImages] = useState(
    JSON.parse(localStorage.getItem('generatedImages')) || initialState
  );
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePromptClick = (prompt) => {
    setPrompt(prompt);
    scrollToTop();
    inputRef.current.focus();
  };

  const resetFocus = () => {
    inputRef.current.blur();
  };

  useEffect(() => {
    localStorage.setItem('generatedImages', JSON.stringify(generatedImages));
    clearLocalStorage();
  }, [generatedImages]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (prompt.trim() === '') {
      inputRef.current.focus();
    } else {
      setIsLoading(true);

      try {
        const generatedImageUrl = await generateImage(prompt);
        const createImg = {
          id: prompt.trim().split(' ').join('-'),
          url: generatedImageUrl,
          prompt: prompt,
        };
        setGeneratedImages([createImg, ...generatedImages]);
        setPrompt('');
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        resetFocus();
      }
    }
  }
  const handleRemove = () => {
    const updateImgList = generatedImages.filter(
      (item) => item.id !== selectedImage
    );

    setGeneratedImages(updateImgList);
    setIsDelete(false);
  };
  return (
    <div className='app'>
      <main>
        <form className='form' onSubmit={handleSubmit}>
          <h1 className='title'>Generate AI Images</h1>
          <div className='input-container'>
            <input
              ref={inputRef}
              type='text'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Visualize an extraordinary scene...'
            />
          </div>
          <Button type='primary' onClick={handleSubmit}>
            {isLoading ? (
              <span className='flashing-text'>Creating visual art...</span>
            ) : (
              'Generate'
            )}
          </Button>
        </form>

        {generatedImages.length > 0 && (
          <>
            <div className='grid-container'>
              {generatedImages.map((image) => (
                <div key={image.id} className='grid-item'>
                  <img
                    src={image.url}
                    alt='Image expired'
                    style={{ height: '512px' }}
                  />
                  <div className='img-description'>
                    <p>{image.prompt}</p>
                    <p className='icon-actions'>
                      <RiFileCopy2Line
                        style={{ fontSize: '22px', cursor: 'pointer' }}
                        onClick={() => handlePromptClick(image.prompt)}
                      />
                      <RiDeleteBin2Fill
                        style={{ fontSize: '22px', cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedImage(image.id);
                          setIsDelete(true);
                        }}
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      {isDelete && (
        <Modal
          title='Confirm'
          open={true}
          onOk={handleRemove}
          onCancel={() => setIsDelete(false)}
          okText='Delete'
          cancelText='Cancel'
        >
          <p>Are you sure you want to delete this image?</p>
        </Modal>
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
