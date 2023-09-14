import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

export const Layout: React.FC<any> = ({ children }) => {

  const [currentLocation,setCurrentLocation] = useState("init");

  React.useEffect(()=>{
    window.location.href ? setCurrentLocation(window.location.href.split("/")[3]) : setCurrentLocation("null");
  },[])

if(currentLocation.length === 0){
  return (
    <>
      <Header/>
      <NavBar colorText="black"/>
      {children}
      <Footer/>
    </>
  );
}else{
  return (
    <>
      <Header/>
      <NavBar colorText="black"/>
      {children}
      <Footer/>
    </>
  );
}

};
