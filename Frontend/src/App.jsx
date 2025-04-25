import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LocationManagementApp from './pages/LocationManagement';
function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <LocationManagementApp />} />
        <Route path='/location' element={ <LocationManagementApp openModal={true} />} />
        <Route path='/graphique' element={ <LocationManagementApp openGraphic={true} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
