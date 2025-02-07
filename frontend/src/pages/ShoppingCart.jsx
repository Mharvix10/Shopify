import {useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import Spinner from '../images/spinnerNew.gif'
import { MdDeleteForever } from "react-icons/md";
import {toast} from 'react-toastify'
import {useNavigate, NavLink} from 'react-router-dom'

function ShoppingCart() {
  const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [cart, setCart] = useState([])
    const user = sessionStorage.getItem('email')


    const fetchCart=async(id)=>{
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`https://haven-of-wisdom-server.onrender.com/api/cart?user=${user}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        const cartItems = response.data.cart
        setCart(cartItems)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }


    const deleteCart=async(id)=>{
      if(window.confirm('Are you sure you wanna delete this item from the cart')){

         try {
          const token = localStorage.getItem('token')
          await axios.delete(`https://haven-of-wisdom-server.onrender.com/api/cart/${user}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          fetchCart()
         } catch (error) {
          console.log(error)
         }
      }
    }


    const placeOrder=async(name, contact)=>{
      try {
        const number = contact.toString().slice(1)
        const internationalNumber = '+234' + number
        const parsedNumber = parseInt(internationalNumber)
        console.log('parsed number: ', parsedNumber)
        const message = encodeURIComponent('I am interested in getting the ' + name)
        window.open(`https://wa.me/+${parsedNumber}?text=I am interested in buying ${name}`, '_blank', 'noopener, noreferrer')
      } catch (error) {
        console.log(error)
      }
    }

    // const sendOrder=async()=>{
    //   try {
    //     await axios.post('https://haven-of-wisdom-server.onrender.com/api/order', {user: user})
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }


    const cartItemVIew = cart.map((item)=>(
        
        <div key={item.productId._id} className='card longCard'>
            <header>
            <img src={item.productId.imageUrl} alt="" />
            </header>
            <main>
                <section>
                  <MdDeleteForever className='deleteIcon' size={20} onClick={()=>{deleteCart(item.productId._id)}}/>
                </section>
                <section>
                    {item.productId.name}
                </section>
                <section>
                    N{item.productId.price}
                </section>
                <section>
                    <button className='btn' onClick={()=>{placeOrder(item.productId.name, item.productId.contact)}}>Place Order</button>
                </section>
            </main>

    </div>
    ))



    useEffect(()=>{
        fetchCart()
    },[])

    if(loading){
        return (
        <div className='centerSpinner'>
          <img src={Spinner} alt="" />
        </div>)
      }
  return (
    <>
        <Navbar/>
        <div className='marginX'>
          <div className='margin1'>
            {cart.length>0 && (<h2 className='textCenter'>CART ITEMS</h2>)}
          </div>

          <div className='gridContainer4'>
              {cartItemVIew}
          </div>

          <div className='flexContainer'>
            {cart.length===0 && (
              <section className='p2'>
                <h2>No Items found in the cart</h2>
                <p className='mt1'>You are seeing this message because you have either not added an item to your cart or signed in.</p>
            
                <NavLink className='successColor' to='/signup'>Create an account instead</NavLink>
                <NavLink className='successColor ml2' to='/signin'>Log In</NavLink>
              </section>
            )}
          </div>
        </div>
        
    </>
  )
}

export default ShoppingCart