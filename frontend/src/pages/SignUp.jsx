import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import {toast} from 'react-toastify'
function SignUp() {
    const navigate = useNavigate()
    const [userData, setData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const {userName, email, password, confirmPassword} = userData


    const onChange=(e)=>{
        e.preventDefault()
        setData((prev)=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }


    const submitData=async(e)=>{
        e.preventDefault()
        try {
            if(password!==confirmPassword){
                window.alert('Your password does not match')
            }
            else if(userName && email && password && confirmPassword){
                const response = await axios.post('https://haven-of-wisdom-server.onrender.com/api/register',{username: userName, email: email, password: password, confirmPassword: confirmPassword})
                const status = response.data.message
                const emailResp = response.data.email
                sessionStorage.setItem('email', emailResp)
                window.alert('User created successfully')
                navigate('/')
            }else{
                window.alert('Please fill in all the required information')
            }

        } catch (error) {
            console.log(error)
        }
    }
  return (
    <>
        <Navbar/>
        <div className="container grey">
        <div className='header'>
            <h1 className='designedHeading'>REGISTER</h1>
        </div>
        <div>
            <input type="text" placeholder='Username' name='userName' value={userName} onChange={onChange} /> <br />
            <input type="text" placeholder='Email' name='email' value={email} onChange={onChange}/> <br />
            <input type="password" placeholder='Password' name='password' value={password} onChange={onChange} /> <br />
            <input type="password" placeholder='Confirm password' name='confirmPassword'value={confirmPassword} onChange={onChange} /> <br />
            <button className='btn' onClick={submitData}>Sign Up</button>
        </div>
        </div>
    </>
  )
}

export default SignUp