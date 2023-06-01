import React from 'react'
import { Link, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { Route, withRouter } from 'react-router-dom';
import LoginPage from './User/LoginPage';
import RegisterPage from './User/RegisterPage';
import RegisterBossPage from './User/RegisterBossPage';
import RegisterStaffPage from './User/RegisterStaffPage';
import Homepage from './HomePage';
import MyPage from './User/MyPage';
import BossMyPage from './User/BossMyPage';


const RouterPage = ({ history }) => {
    // const { setBox } = useContext(AlertContext);

    // const onLogout = (e) => {
    //     e.preventDefault();
    //     setBox({
    //         show: true,
    //         message: '로그아웃을 하시겠습니까?',
    //         action: ()=>{
    //             sessionStorage.removeItem('use_login_id');
    //             history.push('/');
    //         }
    //     });
    // }

    return (
                <Switch>
                    <Route path="/" component={Homepage} exact={true}/>
                    <Route path="/user/login" component={LoginPage}/>
                    <Route path="/user/register" component={RegisterPage} exact={true}/>
                    <Route path="/user/register/boss" component={RegisterBossPage}/>
                    <Route path="/user/register/staff" component={RegisterStaffPage}/>
                    <Route path="/user/staff/mypage" component={MyPage}/>
                    <Route path="/user/boss/mypage" component={BossMyPage}/>
                    
                </Switch>
    )
}

export default withRouter(RouterPage)