import { AlarmProvider } from './context/AlarmContext';
import AlarmModal from './components/common/AlarmModal';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';
import AnimatedBackground from './components/layout/AnimatedBackground';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <ThemeProvider>
            <AlarmProvider>
                <BrowserRouter>
                    <AnimatedBackground />
                    <AlarmModal />
                    <AppRoutes />
                </BrowserRouter>
            </AlarmProvider>
        </ThemeProvider>
    );
}

export default App;
