import logo from "../assets/discourse.svg"
import "../styles/navbar.scss"

const NavBar =()=>{

    return (
        <>
            <nav>
                <div>
                    <h1>DISCOURSE</h1>
                    <p>No likes, no fluff, just community</p>
                </div>
                
                <img src={logo} alt="logo" />
            </nav>
        </>
    );
}

export default NavBar;