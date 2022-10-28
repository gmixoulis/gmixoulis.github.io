import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../src/pages/home";

window.onload=function(){
    let frameElement= document.getElementById('myiframe');
    let doc =frameElement.contentDocument;
    doc.body.innerHTML = doc.body.innerHTML + '<style> body .sk-ww-linkedin-profile-post {background-color:black!important;} </style>'
}
function App() {
  return (
  	<div>
	  <BrowserRouter>
	    <Routes>
		    <Route path = "/" element={< Home/>}/>
		    
		</Routes>
	  </BrowserRouter>
    </div>
  );
}

export default App;