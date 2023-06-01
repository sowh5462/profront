import React from 'react'
import { Link, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { Route, withRouter } from 'react-router-dom';
import LoginPage from './User/LoginPage';
import RegisterPage from './User/RegisterPage';
import RegisterBossPage from './User/RegisterBossPage';
import RegisterStaffPage from './User/RegisterStaffPage';
import Homepage from './HomePage';
import WorkplaceInfotPage from './Master/WorkplaceInfotPage';
import WorkplaceMenu from './WorkPlaceMenu';


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
                    <Route path="/workplace" component={WorkplaceMenu} exact={true}></Route>
                </Switch>
    )
}

export default withRouter(RouterPage)