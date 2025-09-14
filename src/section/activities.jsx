import React from 'react';
import { Parallax } from "react-parallax";
import ReactCardSlider from 'react-card-slider-component';
import AOS from 'aos';
AOS.init();

const image1 ="./img/background/5.jpg";

const slides = [
    {image:"./img/gallery/gym.png",title:"Workout"},
    {image:"./img/gallery/news.png",title:"Keep updated with the latest news"},
    {image:"./img/gallery/languages.png",title:"Learn Foreign Languages"},
    {image:"./img/gallery/anime.png",title:"Watch Anime"},
	{image:"./img/gallery/theatre.png",title:"Theatre Acting and Watching Theatre"},
	{image:"./img/gallery/protest.png",title:"Active Citizen / Politiized"}
]

const Activites = () => {
    return(


        
        <div className="section  bg-bottom py-0">
            <div className="spacer-single"></div>
			<div className="row">
				<div className="col-md-12 text-center">
	                <h2>Extracurricular Activities</h2>
	                <div className="space-border"></div>
	            </div>
			</div>
            <div className="section bg-top bg-bottom py-0">

          <Parallax className="py-5" bgImage={image1} strength={300}>  
          <div className="py-5 position-relative">
                <div className="container">
                    <div className="row">
                    <div className="col-md-10 text-center m-auto"   >
                    <ReactCardSlider slides={slides}/>
                    </div>
                    </div>
                </div>
            </div>
        </Parallax>
        </div>
        </div>
    );
}

export default Activites;
