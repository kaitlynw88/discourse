import './App.css';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/AuthDetails';
import Footer from './components/Footer';
import NavBar from './components/NavBar';


function App() {
  return (
    <div className="App">
      <div className='wrapper'> 
        <NavBar/>
        <Login/>
        <SignUp/>
        <AuthDetails/>
        <Footer/>
      </div>
    </div>
  );
}

export default App;
