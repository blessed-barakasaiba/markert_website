import { useState } from 'react'
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { Divide } from 'lucide';

const Login = () => {
    const [feedback, setFeedback] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username:"",
        password:"",
    });

    const handleLogin = async (e) =>{
        e.preventDefault();
        setisLoading(true);
        setFeedback("");
        localStorage.removeItem('token');
        try{
            const res = await login(formData);
            localStorage.setItem("token", res.data.key);
            console.log(res.data.key);
            setFormData({
                username:"",
                password:"",
            });
            navigate("/");
        }
        catch(e){
            console.log(e);
            setFeedback(e.response?.data?.error || "Upload failed. Please try again.")
        }
        finally{
            setisLoading(false);
        }
    }

    const handleFormChange =(e)=>{
        const {name, value} = e.target;
        setFormData((prev)=>({
            ...prev,
            [name]:value,
        }));
    }

  return (
    <div className='bg-white'>
        <div className='max-w-7xl m-auto px-4 md:px-6 lg:px-8'>
            <div className=''>
                <form action="" onSubmit={handleLogin}
                className='max-w-md mx-auto mt-24 p-6 bg-gray-50 rounded-md shadow-md'>

                <h2 className='text-center font-medium text-2xl text-gray-900'>Login</h2>
                <div className='mb-3'>
                    <label htmlFor="username">Username</label>
                    <input type="text"
                    name='username'
                    onChange={handleFormChange}
                    value={formData.username}
                    className='w-full px-4 py-2 border border-gray-500 rounded-md focus:border-transparent' />
                </div>
                <div className='mb-3'>
                    <label htmlFor="username">Password</label>
                    <input type="text"
                    name='password'
                    value={formData.password}
                    onChange={handleFormChange}
                    disabled={isLoading}
                    className='w-full px-4 py-2 border border-gray-500 rounded-md focus:border-transparent ' />
                </div>

                <button type='submit'
                className='w-full mb-3 flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:bg-blue-100 transition-colors duration-200'>{isLoading ? <div className='w-6 h-6 border-2 border-white rounded-full border-dashed animate-spin mr-2'></div>: "Sign In"}</button>

                {feedback && (
                    <div className={`px-4 py-2 w-full rounded-md font-medium text-center bg-red-50 text-red-800 border border-red-200`}>
                                {feedback}
                    </div>
                )}

                </form>
                
            </div>
        </div>
    </div>
  )
}

export default Login;