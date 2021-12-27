import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

function App() {
    const location = useLocation();

    return (
        <Fragment>
            <Route path="/" component={HomePage} exact />
            <Route path={"/(.+)"} render={() => (
                <Fragment>
                    <NavBar />
                    <Container style={{marginTop: "7em"}}>
                        <Route path="/activities" component={ActivityDashboard} exact />
                        <Route path="/activities/:id" component={ActivityDetails} />
                        <Route path={["/createActivity", "/manage/:id"]} component={ActivityForm} key={location.key} />
                    </Container>
                </Fragment>
            )} />
        </Fragment>
    );
}

export default observer(App);
