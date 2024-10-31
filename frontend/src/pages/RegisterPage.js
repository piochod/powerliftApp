import React,{useRef} from 'react'
import './LoginPage.css'

const RegisterPage = () => {

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) =>{
    e.preventDefault();

    const data = {
      username: `${usernameRef.current.value}`,
      password: `${passwordRef.current.value}`,
    };

    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);

  }
  return (
    <div className='container'>

            <form className='form' onSubmit={handleSubmit}>
                <h1>Sign up</h1>
                <input type='text' placeholder='Username' ref={usernameRef}/>
                <input type='password' placeholder='Password' ref={passwordRef}/>
                <button type='submit'>Sign up</button>
            </form>  
    </div>
  )
}

export default RegisterPage
