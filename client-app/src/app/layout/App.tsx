import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import LoginForm from '../../features/users/LoginForm';

function App() {
    const location = useLocation();

    return (
        <Fragment>
            <ToastContainer position='bottom-right' hideProgressBar />

            <Route path="/" component={HomePage} exact />
            <Route path={"/(.+)"} render={() => (
                <Fragment>
                    <NavBar />
                    <Container style={{marginTop: "7em"}}>
                        <Switch>
                            <Route path="/activities" component={ActivityDashboard} exact />
                            <Route path="/activities/:id" component={ActivityDetails} />
                            <Route path={["/createActivity", "/manage/:id"]} component={ActivityForm} key={location.key} />
                            <Route path="/errors" component={TestErrors} />
                            <Route path="/server-error" component={ServerError} />
                            <Route path="/login" component={LoginForm} />
                            <Route component={NotFound} />
                        </Switch>
                    </Container>
                </Fragment>
            )} />
        </Fragment>
    );
}

export default observer(App);
