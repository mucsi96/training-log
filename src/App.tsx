import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { AuthorizeButton } from './AuthorizeButton';
import { listMajors } from './gapi';

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function intializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthorizeButton
          onAuthorized={() => {
            listMajors();
          }}
        />
      </header>
    </div>
  );
}

export default App;
