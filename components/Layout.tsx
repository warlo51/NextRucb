import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

export const Layout: React.FC<any> = ({ children }) => {
  return (
    <>
      <Header />
      <NavBar />
      {children}
      <Footer />
    </>
  );
};
