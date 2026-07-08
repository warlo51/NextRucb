import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";
import SeasonalDecor from "./SeasonalDecor";
import { useSeasonalTheme } from "../lib/useSeasonalTheme";

export const Layout: React.FC<any> = ({ children }) => {
  const { theme, animations } = useSeasonalTheme();
  return (
    <>
      <Header />
      <NavBar />
      {children}
      <Footer />
      <SeasonalDecor theme={theme} animations={animations} />
    </>
  );
};
