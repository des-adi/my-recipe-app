import React, { useEffect, useState } from 'react';
import { getSummary } from '../api';

const RecipeModal = ({recipeID, onClose}) => {
    const [recipeSummary, setRecipeSummary] = useState('');
    useEffect(()=> {
        const fetchSummary = async() => {
            try {
                const summaryRecipe = await getSummary(recipeID);
                setRecipeSummary(summaryRecipe);
            } catch (err) {
                console.log(err);
            }
        };
        fetchSummary();
    },[recipeID]);
  return (
    <>
    {console.log(recipeSummary)}
    <div className='overlay'>
      <div className="modal">
        <div className="modal-content">
            <div className="modal-header">
                <h2>{recipeSummary.title}</h2>
                <span className='close-btn' onClick={onClose}>
                    &times;
                </span>
            </div>
            <p dangerouslySetInnerHTML={{__html: recipeSummary.summary}}></p>
        </div>
      </div>
    </div>
    </>
  );
};

export default RecipeModal;
