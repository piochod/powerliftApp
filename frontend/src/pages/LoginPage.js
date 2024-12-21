import React, {useRef} from 'react';
import './LoginPage.css';
import Cookies from 'js-cookie';


const LoginPage = () => {

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) =>{
    e.preventDefault();

    const data = {
      username: `${usernameRef.current.value}`,
      password: `${passwordRef.current.value}`,
    };

    try{
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(data),
      });
      
      if(response.status === 200){
        const result = await response.json();
        const token = result.token;
        Cookies.set('accessToken', token, {expires: 1});
        window.location.href = 'http://localhost:3001/home'
      }
      else{
        throw Error;
      }
    } catch(error){
    }   
  }


  return (
    <div className='loginPage'>
      <div className='container'>

              <form className='form' onSubmit={handleSubmit}>
                  <h1>Sign in</h1>
                  <input type='e-mail' placeholder='Username' ref={usernameRef}/>
                  <input type='password' placeholder='Password' ref={passwordRef}/>
                  <button type='submit'>Log in</button>
              </form>  
      </div>
    </div>
  )
}

export default LoginPage
