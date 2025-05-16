import { Route, Routes } from 'react-router-dom';
import MyCanvas from './pages/MyCanvas';
import { PodsProvider } from './context/PodsContext';

function App() {
  return (
    <div>
      <PodsProvider>
        <Routes>
          <Route path='/' element={<MyCanvas />} />
        </Routes>
      </PodsProvider>
    </div>
  );
}

export default App;
