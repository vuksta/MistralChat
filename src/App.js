import React from 'react';
import MistralChat from './MistralChat';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mistral AI Chat Application</h1>
      </header>
      <main>
        <MistralChat />
      </main>
    </div>
  );
}

export default App;
