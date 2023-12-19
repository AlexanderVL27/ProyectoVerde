import {React,Component} from "react";
import '../../assets/css/App.css';

const Header = () => {
    return(
        <header className="rounded-lg flex flex-col flex-nowrap h-9 mx-4 my-1
        bg-[linear-gradient(#a3ffac,white)]">
               <h2 className="text-2xl font-bold my-0.5 h-auto text-center
               [text-shadow:_0.1em_0.15em_0.25em_green] ">
                   SISTEMA DE MONITOREO DE HUMEDAD
               </h2>
        </header>
       );
}

export default Header;