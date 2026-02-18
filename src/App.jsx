import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import AvatarCreation from './pages/AvatarCreation';
import Simulator from './pages/Simulator';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/avatar" element={<AvatarCreation />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
