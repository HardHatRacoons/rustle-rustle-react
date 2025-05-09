import { Routes, Route } from 'react-router';

import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import FileLayout from './layouts/FileLayout';
import BPView from './pages/BPView';
import TableView from './pages/TableView';
import MetricView from './pages/MetricView';
import NoPage from './pages/NoPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

/*
 * Controls the routing of the app.
 *
 * @component
 * @returns {React.ReactElement} the app routes.
 */
export default function App() {
    return (
        <Routes>
            <Route path="/" element={<RootLayout />}>
                <Route
                    index
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route path="login" element={<LoginPage />} />
                <Route
                    path="file/:id"
                    element={
                        <ProtectedRoute>
                            <FileLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="blueprint" element={<BPView />} />
                    <Route path="table" element={<TableView />} />
                    <Route path="metrics" element={<MetricView />} />
                </Route>
                <Route path="*" element={<NoPage />} />
            </Route>
        </Routes>
    );
}
