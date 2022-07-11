import Head from "next/head";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Container,
  Dropdown,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { Router } from "@mui/icons-material";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

export const Layout: React.FC<any> = ({ children }) => {

  return (
    <>
      <Header/>
      <NavBar/>
      {children}
      <Footer/>
    </>
  );
};