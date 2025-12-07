import { Route, Routes } from 'react-router';
import LoginRegister from './LoginRegister';
import * as pathRoute from '@/routes/pathRoutes';

export function AuthPage() {
    return (
        <Routes>
            <Route path={pathRoute.loginPagePath}>
                <LoginRegister />
            </Route>
        </Routes>
    );
}

export default AuthPage;
