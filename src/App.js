import { Route, Routes} from 'react-router-dom';
import "./styles/basestyles.scss";
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import HomePage from './pages/HomePage';
import VideoRoom from './pages/VideoRoom'
import UserProfile from './components/UserProfile';
import ProfileForm from './components/ProfileForm';


 
function App() {
  return (
      <div className="wrapper">
          <NavBar />
          <div className="App">
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/userprofile" element={<UserProfile />} />
                  <Route path="/profileform" element={<ProfileForm/>} />
                  <Route path="/videoroom" element={<VideoRoom />} />
              </Routes>
          </div>
          <Footer />
      </div>
  );
}

export default App;
