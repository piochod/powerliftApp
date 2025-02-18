import React, {useRef, useState} from 'react';
import './LoginPage.css';

const RegisterPage = () => {

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username: `${usernameRef.current.value}`,
      password: `${passwordRef.current.value}`,
    };

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 201) {
        setSuccessMessage("Registration successful! Redirecting to login.");
        setTimeout(() => {
          window.location.href = 'http://localhost:3001/login';
        }, 2000);
      } else {
        setErrorMessage("Username already taken.");
      }
    } catch (error) {
      setErrorMessage("Failed connecting to the server.");
      console.log(error);
    }
  };

  return (
    <div className='loginPage'>
      <div className='container'>
        <form className='form' onSubmit={handleSubmit}>
          <h1>Sign up</h1>
          <input type='text' placeholder='Username' ref={usernameRef} />
          <input type='password' placeholder='Password' ref={passwordRef} />
          {errorMessage && <div className='error-message'>{errorMessage}</div>}
          {successMessage && <div className='success-message'>{successMessage}</div>}
          <button type='submit'>Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;