import React from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import SLider1 from '../images/1.jpg'
import SLider2 from '../images/2.jpg'
import SLider3 from '../images/3.jpg'


function LandingContainer() {
    const navigate = useNavigate()

  return (
    <div className='landingContainer'>
        <div className='navSection'>
          <h2 className='textCenter'>Categories</h2>
            <ul>
                <li className='navLink' onClick={()=>{navigate(`/categoryPage/electronics`)}}>Electronics</li>
                <li className='navLink' onClick={()=>{navigate(`/categoryPage/laptop`)}}>Laptop</li>
                <li className='navLink' onClick={()=>{navigate(`/categoryPage/tv`)}}>Television</li>
                <li className='navLink' onClick={()=>{navigate(`/categoryPage/smartwatch`)}}>Smart Watch</li>
                <li className='navLink' onClick={()=>{navigate(`/categoryPage/tablet`)}}>Tablet</li>
                <li className='navLink' onClick={()=>{navigate('/categoryPage/phone')}}>Phones</li>
                <li className='navLink' onClick={()=>{navigate('/categoryPage/fashion')}}>Fashion and Beauty</li>
                <li className='navLink' onClick={()=>{navigate('/categoryPage/toys')}}>Babies and Toys</li>
                <li className='navLink' onClick={()=>{navigate('/categoryPage/equipments')}}>Equipments</li>
                <li className='navLink' onClick={()=>{navigate('/categoryPage/others')}}>Others</li>
            </ul>
        </div>
        <Swiper
          className='swiper'
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => {}}
          onSlideChange={() => {}}
          >
            <SwiperSlide><img className="sliderImg" src={SLider1} alt="" /></SwiperSlide>
            <SwiperSlide><img className="sliderImg" src={SLider2} alt="" /></SwiperSlide>
            <SwiperSlide><img className="sliderImg" src={SLider3} alt="" /></SwiperSlide>
        </Swiper>
        <div className='mobileCategory'>
          <h2>Categories</h2>
          <button className='navBtn' onClick={()=>{navigate(`/categoryPage/electronics`)}}>Electronics</button> <button className='navBtn' onClick={()=>{navigate(`/categoryPage/laptop`)}}>Laptop</button>
          <button className='navBtn' onClick={()=>{navigate(`/categoryPage/tv`)}}>Television</button> <button className='navBtn' onClick={()=>{navigate(`/categoryPage/smartwatch`)}}>Smart watch</button>
          <button className='navBtn' onClick={()=>{navigate(`/categoryPage/tablet`)}}>Tablet</button> <button className='navBtn' onClick={()=>{navigate(`/categoryPage/phone`)}}>Phone</button>
          <button className='navBtn' onClick={()=>{navigate(`/categoryPage/toys`)}}>Babies</button> <button className='navBtn' onClick={()=>{navigate(`/categoryPage/fashion`)}}>Fashion</button>
          <button className='navBtn' onClick={()=>{navigate(`/categoryPage/equipments`)}}>Equipments</button> <button className='navBtn' onClick={()=>{navigate(`/categoryPage/others`)}}>Others</button>
        </div>
    </div>
  )
}

export default LandingContainer