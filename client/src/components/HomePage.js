import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

function HomePage(props) {
  const navigate = useNavigate();
  const [id, setId] = useState();

  const findDoc = () => {
    navigate(`/docs/${id}`);
  }

  const makeDoc = () => {
    const nid = uuid();
    navigate(`/docs/${nid}`);
  }

  return (
    <div className='home'>
      <div className='card' >
        <div className='intro'>
          <img 
            src={process.env.PUBLIC_URL + '/documents.png'} 
            alt='MyDocs'
            className='logo'
          />
          <h2 className='title'>Welcome to MyDocs</h2>
          <p className='text'>Multiple users can work on single Document</p>
        </div>

        <div className='findDoc'>
          <input 
            type="text" 
            placeholder='Enter Document-Id Here' 
            value={id} 
            onChange={e => setId(e.target.value)} 
          />
          <button className='btn' onClick={findDoc}>
            Find Document
          </button>
        </div>

        <div className='makeDoc'>
          <button className='btn' onClick={makeDoc}>
            New Document
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;