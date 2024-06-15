import { useDispatch, useSelector } from 'react-redux';
import { setName, setAge, setAddress, setBirthday, setSex } from '../Redux/UserInfoSlice';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


export default function LandingPage() {
    
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Hello there</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                    {/* <button className="btn btn-primary"
                        onClick={() => { navigate('/login')}}
                    >Get Started</button> */}
                </div>
            </div>
        </div>
    )
}
