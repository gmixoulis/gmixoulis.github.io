import React from 'react';
import { Parallax } from "react-parallax";
import AOS from 'aos';
AOS.init();

const image1 ="./img/background/tokyo3.jpg";

const Mblockquote = () => {
    return(


        
        <div className="section  bg-bottom py-0">
            <div className="spacer-single"></div>
			<div className="row">
				<div className="col-md-12 text-center">
	                <h2>Recent Blog</h2>
	                <div className="space-border"></div>
	            </div>
			</div>
          <Parallax className="py-5" bgImage={image1} strength={300}>  
          <div className="py-5 position-relative">
                <div className="container">
                    <div className="row">
                        
                            <div className="de_count text-center">
                            <iframe src='https://widgets.sociablekit.com/linkedin-profile-posts/iframe/97069' frameborder='0' width='100%' height='1000'></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </Parallax>
        </div>
    );
}

export default Mblockquote;