import React from 'react'
import { Link, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { Route, withRouter } from 'react-router-dom';
import LoginPage from './User/LoginPage';
import RegisterPage from './User/RegisterPage';
import RegisterBossPage from './User/RegisterBossPage';
import RegisterStaffPage from './User/RegisterStaffPage';
import Homepage from './HomePage';
import StaffPage from './Staff/StaffPage';
import SchedulePage from './Staff/SchedulePage';
import TimePage from './Staff/TimePage';
import PayPage from './Staff/PayPage';
import CheckPage from './Staff/CheckPage';


const RouterPage = ({ history }) => {

    // const onLogout = (e) => {
    //     e.preventDefault();
    //     sessionStorage.removeItem("use_login_id");
    //     history.push("/");
    // }

    return (
                <Switch>
                    <Route path="/" component={Homepage} exact={true}/>
                    <Route path="/user/login" component={LoginPage}/>
                    <Route path="/user/register" component={RegisterPage} exact={true}/>
                    <Route path="/user/register/boss" component={RegisterBossPage}/>
                    <Route path="/user/register/staff" component={RegisterStaffPage}/>
                    <Route path="/staff" component={StaffPage} exact={true}/>
                    <Route path="/staff/schedule" component={SchedulePage}/>
                    <Route path="/staff/time" component={TimePage}/>
                    <Route path="/staff/pay" component={PayPage}/>
                    <Route path="/staff/check" component={CheckPage}/>
                </Switch>
    )
}

export default withRouter(RouterPage)