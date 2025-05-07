import { Route, Routes } from 'react-router-dom';
import MyCanvas from './pages/MyCanvas';
import Home from './pages/Home';

function App() {
  return (
    <div>
      <Routes>
        {/* <Route path='/' element={<Home />} /> */}
        <Route path='/' element={<MyCanvas />} />
      </Routes>
    </div>
  );
}

export default App;
