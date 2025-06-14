import { redirect } from 'react-router';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function authAction({request, params}) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const mode = searchParams.get('mode');
  
    if (mode !== 'login' && mode !== 'signup') {
      return new Response(JSON.stringify({message: 'Wrong user input'}), {status: 422});
    }
  
    const data = await request.formData();
  
    const authData = {
      email: data.get('email'),
      password: data.get('password')
    };
    console.log('authdata=====', authData);
  
    const url = `http://localhost:8080/${mode}`;
    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
      });
    } catch (error) {
      console.log('error====1', error);
    }

    if (response.status === 422 || response.status === 401) {
      return response;
    }
  
    if(!response.ok) {
      return new Response(JSON.stringify({message: 'Authentication failed'}), {status: 500});
    }

    const res = await response.json();
  
    localStorage.setItem('token', res.token);
    const time = new Date();
    time.setHours(time.getHours() + 1);
    localStorage.setItem('expirationTime', time.toISOString());
    return redirect('/');
  } catch (error) {
    console.log('error====', error);
  }
}