import { Route, Routes} from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import AuthContext from './components/AuthContext';

 
function App() {
  return (
      <div className="wrapper">
          <NavBar />
          <div className="App">
              
                  <Routes>
                      <Route path="/" element={<AuthContext />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/login" element={<Login />} />
                  </Routes>
              
          </div>
          <Footer />
      </div>
  );
}

export default App;
