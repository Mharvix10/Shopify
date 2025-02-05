import {useState, useEffect} from 'react'
import {useNavigate, NavLink} from 'react-router-dom'
import {FaShoppingCart, FaHome, FaUser, FaStore, FaSearch} from 'react-icons/fa'
import { MdCloudUpload } from "react-icons/md";
import { MdSegment, MdCancel } from "react-icons/md";
import Logo from '../images/eLogo.png'
import axios from 'axios';
import Fuse from 'fuse.js'
import { IoPersonAddSharp, IoPerson, IoPersonCircle } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FaCloudUploadAlt } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchWord, setSearchWord] = useState('')
  const [showNav, setShowNav] = useState(false)  // state for handling showing of the nav menu on mobile device  
  
  const profileNavigate=(e)=>{
    e.preventDefault()
    const userEmail = sessionStorage.getItem('email')
    if(userEmail){
      navigate(`/profilePage`)

    }else{
      navigate(`/signin`)
    }
  }

  
  const onChange=async(e)=>{
    setSearchWord(e.target.value)
    }





  const searchResultDisplay = filteredProducts.map((items)=>(
    <li className='list' onClick={()=>{navigate(`/searchPage/${items.name}`)}}>
      {items.name}
    </li>
  ))


  const fetchInput=async(e)=>{
    try {
      const response = await axios.get(`https://haven-of-wisdom-server.onrender.com/api/products/search/items`)
      const result = response.data.products
      setProducts(result);  
      setFilteredProducts(result)
      // setSearchResult(result)
      
      const fuse = new Fuse(result, {  
        keys: ['name', 'brand'],  
        threshold: 0.3, // Adjust as needed  
      });  

      const fuseResults = fuse.search(searchWord);  
      setFilteredProducts(fuseResults.map(result => result.item)); // Get the actual items  
    } catch (error) {
      console.log(error)
    }
  }






  return (
    <>
        <div className='navBar'>

            <div>
                <img src={Logo} alt="Logo" className='logo'/>
            </div>


            <div className='horizontal'>
                <input className='searchItem' type="text" placeholder='Search for products and brands' name="" id="" value={searchWord} onChange={onChange} />
                <FaSearch className='searchIcon' size={20} onClick={()=>{fetchInput()}}/>
            </div>


            <div className='navIcon'>
                <ul className='horizontal'>
                  <li><FaHome className='navBarIcon' onClick={()=>{navigate('/')}} size={30}/></li>
                  <li><FaShoppingCart className='navBarIcon' size={30} onClick={()=>{navigate('/cart')}}/></li>
                  <li><MdCloudUpload className='navBarIcon' onClick={()=>{navigate('/postProduct')}} size={30}/></li>
                  <li><FaStore className='navBarIcon' onClick={()=>{navigate('/store')}} size={30}/></li>
                  <li><FaUser className='navBarIcon' onClick={profileNavigate} size={30}/></li>
                  
                </ul>
            </div>


            <div className='menuIcon'>
              <MdSegment className='menuBtn' size={30} onClick={()=>{setShowNav((prev)=> !prev)}}/>
            </div>


        </div>
        


        <div className={`navMobileMenu ${showNav? 'show':'hidden'}`}>
          <MdCancel size={50} onClick={()=>{setShowNav((prev)=> !prev)}}/>

          <ul>
            <NavLink className='mobileNavLink' to='/'><li ><FaHome size={20}/> Home</li></NavLink>
            <NavLink className='mobileNavLink' to='/signin'><li> <IoPerson size={20}/> Sign in</li></NavLink>
            <NavLink className='mobileNavLink' to='/signup'><li> <IoPersonAddSharp size={20}/> Sign up</li></NavLink>
            <NavLink className='mobileNavLink' to='/profilePage'><li> <IoPersonCircle size={20}/> Profile</li></NavLink>
            <NavLink className='mobileNavLink' to='/cart'><li> <FaCartShopping size={20}/> Cart</li></NavLink>
            <NavLink className='mobileNavLink' to='/postProduct'><li> <FaCloudUploadAlt size={20}/> Upload Product</li></NavLink>
            <NavLink className='mobileNavLink' to='/store'><li> <FaStore size={20}/> My Store</li></NavLink>

          </ul>
        </div>


        <div className='searchList'>
            <ul>
              {searchResultDisplay}
            </ul>
        </div>

    </>
  )
}

export default Navbar