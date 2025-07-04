import { useEffect, useState } from 'react'

import Upload from './Upload'
import type { PreprocessingData } from './Upload'
import Preprocessing from './Preprocessing'
import Results from './Results'

import './App.css'


function App() {
  const [available, setAvailable] = useState<boolean>(true);
  const [showPreprocessing, setShowPreprocessing] = useState<PreprocessingData | null>(null);
  
  useEffect(() => {
    fetch("/api/math")
      .then(response => {
        if (!response.ok) {
          setAvailable(false);
          throw new Error('The API is available but not responding correctly.');
        }
      })
      .catch(error => {
        console.error('Error fetching API status:', error);
        setAvailable(false);
      });

  }, []);

  const showPreporocessingHandler = (data: { preprocessImage: string, contourImage: string, segmentsImages: string[], latex: string, python: string } | null) => {
    setShowPreprocessing(data);
  }

  return (
    <main className="App">
      <div className='hero center-div' >
        <div className='hero__title center-div'>
          <h1>CNN powered <i style={{color: "var(--crimson)"}}>Math Expression</i> Translator</h1>
          <h2>Convert images of math expressions to LaTeX and Python code</h2>
        </div>
        <p>By inputting images of <i style={{color: "var(--crimson)"}}>math expressions (equations, polynomials, functions, etc)</i> this tool is able to segment and classify each character in the expression, which in return outputs a <i style={{color: "var(--blue)"}}>LaTeX code and Python function code</i> of the expression.</p>
      </div>

      <Upload status={available} showComponentsHandler={showPreporocessingHandler} />

      {showPreprocessing && (
        <Preprocessing preprocessImage={showPreprocessing.preprocessImage}  contourImage={showPreprocessing.contourImage}  segmentsImages={showPreprocessing.segmentsImages} />
      )}

      {showPreprocessing && (
        <Results latex={showPreprocessing.latex} python={showPreprocessing.python} />
      )}

    </main>
  )
}

export default App