import React from 'react';
import AOS from 'aos';
AOS.init();



const hero = () => {
	return(
		<div className="container">
			<div className="row">
				<div className="col-md-12 text-center">
	                <h2>My Resume</h2>
	                <div className="space-border"></div>
	            </div>
			</div>
			<div className="row gh-5">

				<div className="col-lg-6"
                    data-aos="fade-up"
                        data-aos-once="true"
                    >
                    <div className="p-4">
                        <h3 className="s_border">Experiences</h3>
                        <ul className="d_timeline">
                            <li className="d_timeline-item">
                                <h3 className="d_timeline-title">2022 - now</h3>
                                <p className="d_timeline-text">
                                	<span className="d_title">Blockchain &amp; Full-Stack Developer</span>
                                	<span className="d_company">University of Nicosia / IFF</span>
                                	Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi tempora perferendis vero officia enim impedit voluptatem dignissimos, veniam ratione est alias rerum aperiam, nam aliquam reprehenderit iste dolor.
                                </p>
                            </li>

                            <li className="d_timeline-item">
                                <h3 className="d_timeline-title">2018 - 2021</h3>
                                <p className="d_timeline-text">
                                	<span className="d_title">WordPress Developer</span>
                                   <span className="d_company"> FreeLancer </span> 
                                    
                                   <a href="https://marlab.ode.uom.gr/" target="_blank"> MarLab</a>, <a href="https://celc.web.auth.gr/" target="_blank"> CELC </a>,  <a href="https://eudem.polsci.auth.gr/" target="_blank"> EUDEM </a>
                                    <br></br>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi tempora perferendis vero officia enim impedit voluptatem dignissimos, veniam ratione est alias rerum aperiam, nam aliquam reprehenderit iste dolor.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="col-lg-6" 
                    data-aos="fade-up"
                        data-aos-once="true"
                    >
                    <div className="p-4">
                        <h3 className="s_border">Education</h3>
                        <ul className="d_timeline">
                            <li className="d_timeline-item">
                                <h3 className="d_timeline-title">2020 - 2022</h3>
                                <p className="d_timeline-text">
                                	<span className="d_title">Master in Data and Web Science</span>
                                	<span className="d_company">Aristotle University of Thessaloniki</span>The main topic is the specialization in Data and Web Science. The efficient and effective data management is a critical. Challenges arise at all levels of the Information Technology Stage in terms of infrastructure, management, access, and exploitation of information for knowledge mining that will be provided in a direct way.
                                </p>
                            </li>
                            <li className="d_timeline-item">
                                <h3 className="d_timeline-title">2015 - 2020</h3>
                                <p className="d_timeline-text">
                                	<span className="d_title">Bachelor of Applied Informatics</span>
                                	<span className="d_company">University of Macedonia</span>Information and Communication Technologies can be efficiently implemented if there is sound knowledge not only of the Science of Informatics but also of the scope of its application. Thus, students are required to attend advanced courses in Management Science, Economics, Finance, Business Administration, Quantitative Methods, as well as Computer and Internet Law. 
                                </p>
                            </li>
                    
                        </ul>
                    </div>
                </div>
                <div className="spacer-double"></div>
			</div>
		</div>
	);
}

export default hero;