import React from 'react'
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { Route, withRouter } from 'react-router-dom';
import LoginPage from './User/LoginPage2';
import RegisterPage from './User/RegisterPage2';
import RegisterBossPage2 from './User/RegisterBossPage2';
import Homepage from './HomePage';
import WorkplaceMenu from './WorkPlaceMenu';
import StaffMenu from './StaffMenu';
import SchedulePage from './Staff/SchedulePage';

import PayPage from './Staff/PayPage';
import CheckPage from './Staff/CheckPage';
import PayRollPage from './Master/PayRollPage';
import MasterListPage from './Master/MasterListPage';
import BossMyPage from './User/BossMyPage';
import MyPage from './User/MyPage';
import {Form , Nav, Navbar, Container} from 'react-bootstrap'
import RegisterStaff from './User/RegisterStaff';
import WorkplaceInfotPage from './Master/WorkplaceInfotPage';
import WorkTimePage from './Staff/WorkTimePage';
import FindPage from './User/FindPage';





const RouterPage = ({ history }) => {

    return (
            <>
            <Switch>
                <Route path="/" component={Homepage} exact={true}/>
                <Route path="/user/login" component={LoginPage}/>
                <Route path="/user/register" component={RegisterPage} exact={true}/>
                <Route path="/user/register/boss" component={RegisterBossPage2}/>
                <Route path="/user/register/staff" component={RegisterStaff}/>
                <Route path="/staff/mypage" component={MyPage}/>
                <Route path="/boss/mypage" component={BossMyPage}/>
                <Route path="/workplace" component={WorkplaceMenu} exact={true}/>
                <Route path="/workplace/payroll" component={PayRollPage}/>
                <Route path="/staff" component={StaffMenu} exact={true}/>
                <Route path="/staff/schedule" component={SchedulePage}/>
    
                <Route path="/staff/pay" component={PayPage}/>
                <Route path="/staff/check" component={CheckPage}/>
                <Route path="/master/list" component={MasterListPage}/>
                <Route path="/time" component={WorkTimePage}/>
                <Route path="/find/id" component={FindPage}/>
            </Switch>
            </>
    )
}

export default withRouter(RouterPage)