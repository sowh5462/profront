import { useState } from 'react';
import './App.css';
import AlertModal from './components/AlertModal';
import { AlertContext } from './components/AlertContext';

import RouterPage from './components/RouterPage';

import RegisterPage from './components/User/RegisterPage';
import RegisterBossPage from './components/User/RegisterBossPage';
import RegisterStaffPage from './components/User/RegisterStaffPage';
import MasterListPage from './components/Master/MasterListPage';


function App() {
    const [box, setBox] = useState({
        show: false,
        message: '',
        action: null
    });

    return (
        <AlertContext.Provider value={{ box, setBox }}>
            <div className="App">
                <RouterPage />
                <Switch>
                    <Route path="/" component={HomePage} exact={true} />
                    <Route path="/user/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} exact={true} />
                    <Route path="/register/boss" component={RegisterBossPage} />
                    <Route path="/register/staff" component={RegisterStaffPage} />
                    <Route path="/master/list" component={MasterListPage} />
                </Switch>

                {box.show && <AlertModal />}
            </div>
        </AlertContext.Provider>
    );
}
// 



export default App;
