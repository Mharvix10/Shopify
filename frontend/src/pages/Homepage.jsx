import {useEffect, useState, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import LandingContainer from '../components/LandingContainer'
import Navbar from '../components/Navbar'
import Spinner from '../images/spinnerNew.gif'
import Footer from '../components/Footer'
import {FaHome, FaShoppingCart} from 'react-icons/fa'
import {toast} from 'react-toastify'
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
function Homepage() {
  const navigate = useNavigate()
  const [event, setEvent] = useState([])
  const [page, setPage] = useState(1)  //pagination useState
  const [specialOffer, setSpecialOffer] = useState([{}])
  const [product, setProduct] = useState([{}])
  const [loading, setLoading] = useState(true)
  const [scroll, setScroll] = useState(false)
// remember to set loading back to false

const productViewRef = useRef()

  const fetchProducts=async()=>{
    setLoading(true)
    try {
      const response = await axios.get(`https://haven-of-wisdom-server.onrender.com/api/products?page=${page}`)
      const products = response.data.product
      setProduct(products)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }


  const fetchSpecialProducts=async()=>{
    try {
      const response = await axios.get('https://haven-of-wisdom-server.onrender.com/api/products?specialOffer=true')
      const specialProducts = response.data.product
      setSpecialOffer(specialProducts)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }


  const addCart=async(id)=>{
    const email = sessionStorage.getItem('email')
    if (!email) {
      window.alert('Signing in is required to add item to cart')
      navigate('/signin')
    } else {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post('https://haven-of-wisdom-server.onrender.com/api/cart', {item: id, user: email }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        window.alert('Item added to cart successfully')
      } catch (error) {
        console.log(error)
      }
    }

  }

  const specialProductView = specialOffer.map((item)=>(
    
      <SwiperSlide key={item._id}>
          <div className='card'>
              <header>
              <img src={item.imageUrl} alt="" onClick={()=>{productDetails(item._id)}} />
              <FaShoppingCart size={20} className='cartIcon' onClick={()=>{addCart(item._id)}}/>
              </header>
              <main>
                  <section>
                      {item.name}
                  </section>
                  <section>
                      N{item.price}
                  </section>
              </main>

          </div>
      </SwiperSlide>

  ))


  const productDetails=(id)=>{
    navigate(`/productDetails/${id}`)
  }



  const regularProductView = product.map((item)=>(
    <div key={item._id} className='card' >
        <header>
        <img src={item.imageUrl} alt="" onClick={()=>{productDetails(item._id)}} />
        <FaShoppingCart size={20} className='cartIcon' onClick={()=>{addCart(item._id)}}/>
        </header>
        <main>
            <section>
                {item.name}
            </section>
            <section>
                N{item.price}
            </section>
        </main>

    </div>
))  

// Upcoming event banner
const eventImage = (
  <div className='containerFluid'>
    <h2 className='eventHeader'>UPCOMING EVENT</h2>

    {
      event.map((items)=>(
        <img key={items._id} className='eventCard' src={items.imageUrl} alt="" />
    ))
    }

  </div>
)

// pagination starts here function

  const previousPage=async(e)=>{
    e.preventDefault()
    if(page===1){
      setScroll(true)
      setPage(1)
      
    }else{
      setScroll(true)
      setPage((prev)=>prev - 1)
      
    }

  }

  const nextPage=async(e)=>{
    e.preventDefault()
    setScroll(true)
    setPage((prev)=>prev + 1)
    

  }


  const fetchEvent =async()=>{
    try {
      const response = await axios.get('https://haven-of-wisdom-server.onrender.com/api/event')
      const resp = response.data.event
      setEvent(resp)
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(()=>{
    fetchSpecialProducts()
    fetchProducts()
    fetchEvent()
    const email = sessionStorage.getItem('email')
    
  },[page])


  useEffect(() => {
      setTimeout(() => {
        if (scroll && productViewRef.current) {
          productViewRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 2000);
  }, [scroll,page]); // Runs when 'scroll' changes



  if(loading){
    return (
    <div className='centerSpinner'>
      <img src={Spinner} alt="" />
    </div>)
  }

  return (
  <div>

    <Navbar/>
    <LandingContainer/>

{/* container for uploading upcoming events */}
{/* {event.length==0? ' ': (
  <div className=''>
    {eventImage}
  </div>
)} */}

{/* Below is the container for the special offer */}
    {/* <div className='specialDealGif'>

    </div> */}
    <header className='header'>
        <h2 className='designedHeading'>Special Deals</h2>
    </header>
    
    <div className='container'>
        <Swiper
          // install Swiper modules
          className='productContainer'
          modules={[Navigation, Pagination, A11y, EffectCoverflow]}
          effect='coverflow'
          spaceBetween={40}
          draggable={true}
          slidesPerView={4}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => {}}
          onSlideChange={() => {}}
          breakpoints={{
            320: { slidesPerView: 2 }, // 1 slide on small screens
            640: { slidesPerView: 3 }, // 2 slides on medium screens
            1024: { slidesPerView: 4 }, // 2 slides on larger screens
          }}
          coverflowEffect={{
            rotate: 0, // Rotation angle
            stretch: 0, // Space between slides
            depth: 100, // Depth effect
            modifier: 2.5, // Effect multiplier
            slideShadows: false, // Enable shadows
          }}
        >
          {specialProductView}
        </Swiper>
    </div>



{/* Below is the container for the regular products */}
        <header className='header'>
            <h2 className='designedHeading'>Other Products</h2>
        </header>

    <div ref={productViewRef} className='container'>

        <div className='gridContainer4'>
            {regularProductView}
        </div>

    </div>



    <div className='pageContainer'>
          <button className='pageBtn' onClick={previousPage}>Previous page</button> 
          <span className='pageTxt'>{page}</span> 
          <button className='pageBtn' onClick={nextPage}>Next page</button>
    </div>



    <Footer/>



  </div>
    )
}

export default Homepage