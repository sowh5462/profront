import React from 'react'
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { Route, withRouter } from 'react-router-dom';
import LoginPage from './User/LoginPage2';
import RegisterPage from './User/RegisterPage2';
import RegisterBossPage from './User/RegisterBossPage';
import RegisterStaffPage from './User/RegisterStaffPage';
import Homepage from './HomePage';
import PayRollPage from './Master/PayRollPage';
import WorkplaceMenu from './WorkPlaceMenu';
import StaffMenu from './StaffMenu';
import SchedulePage from './Staff/SchedulePage';
import TimePage from './Staff/TimePage';
import PayPage from './Staff/PayPage';
import CheckPage from './Staff/CheckPage';

import MasterListPage from './Master/MasterListPage';


import BossMyPage from './User/BossMyPage';
import MyPage from './User/MyPage';



const RouterPage = ({ history }) => {


    return (
                <Switch>
                    <Route path="/" component={Homepage} exact={true}/>
                    <Route path="/user/login" component={LoginPage}/>
                    <Route path="/user/register" component={RegisterPage} exact={true}/>
                    <Route path="/user/register/boss" component={RegisterBossPage}/>
                    <Route path="/user/register/staff" component={RegisterStaffPage}/>
                    <Route path="/workplace/payroll" component={PayRollPage}/>

                    <Route path="/user/staff" component={MyPage}/>
                    <Route path="/user/boss" component={BossMyPage}/>

                    <Route path="/workplace" component={WorkplaceMenu} exact={true}/>
                    <Route path="/staff" component={StaffMenu} exact={true}/>
                    <Route path="/staff/schedule" component={SchedulePage}/>
                    <Route path="/staff/time" component={TimePage}/>
                    <Route path="/staff/pay" component={PayPage}/>
                    <Route path="/staff/check" component={CheckPage}/>
                    <Route path="/master/list" component={MasterListPage}/>
                </Switch>
    )
}

export default withRouter(RouterPage)