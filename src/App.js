import { useState } from 'react';
import './App.css';
import AlertModal from './components/AlertModal';
import { AlertContext } from './components/AlertContext';
import RouterPage from './components/RouterPage';



function App() {
    const [box, setBox] = useState({
        show: false,
        message: '',
        action: null
    });

    return (
        <AlertContext.Provider value={{box, setBox}}>
        <div className="App">

            <RouterPage/>

            { box.show && <AlertModal/> }
        </div>
        </AlertContext.Provider>
    );
}

export default App;
