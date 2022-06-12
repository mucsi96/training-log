import './App.css';
import { AuthorizeButton } from './AuthorizeButton';
import { listMajors } from './gapi';
import { DataButton } from './DataButton';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthorizeButton
          onAuthorized={() => {
            listMajors();
          }}
        />
        <DataButton />
      </header>
    </div>
  );
}

export default App;
