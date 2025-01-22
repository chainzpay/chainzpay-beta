import ChainzPayMVP from './components/ChainzPayMVP'
import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center" style={{width:"100vw"}}>
      <div className="w-full max-w-4xl">
  

        <div style={{ margin: "0 auto", display: "block", width: "fit-content" }}>
          <ChainzPayMVP />
        </div>



      </div>
    </div>
  );
};

export default App;
