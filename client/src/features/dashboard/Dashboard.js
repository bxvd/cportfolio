import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import TopNav from '../layout/TopNav';
import SideNavBar from '../layout/SideNavbar';

import { getProfile } from '../profile/profileSlice';
import { privateRoutes } from '../../common/routes';

export default function Dashboard() {
  
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const routes = privateRoutes.filter(route => 'dashboard' in route);

  useEffect(() => {

    async function fetch() {
      dispatch(getProfile(user.profile));
    }
    fetch();
  });

  return(
    <>
      <TopNav/>
      <Container fluid>
        <Row>
          <SideNavBar/>
          <main role="main" className="dashboard-main col-sm-9 col-lg-10 ml-sm-auto px-4">
            <Switch>
              {routes.map((route, index) =>
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  children={route.dashboard}
                />
              )}
            </Switch>
          </main>
        </Row>
      </Container>
    </>
  );
}
