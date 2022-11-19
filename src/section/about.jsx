import React from 'react';
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import AnimatedProgressProvider from "../layout/AnimatedProgressProvider";

import AOS from 'aos';
AOS.init();


const hero = () => {
	return(
		<div className="v-center">
		<div className="container">
			<div className="row">
				<div className="col-md-12 text-center">
	                <h2 data-aos="fade-up"
                        data-aos-delay="0"
                        data-aos-duration="1000"
                        data-aos-easing="ease"
                        data-aos-once="true">About Me</h2>
	                <div className="space-border"
	                	data-aos="fade-up"
                        data-aos-delay="20"
                        data-aos-duration="1000"
                        data-aos-easing="ease"
                        data-aos-once="true"
	                	></div>
	            </div>
	            <div className="col-md-8 text-center m-auto"
	            	data-aos="fade-up"
                    data-aos-delay="60"
                    data-aos-duration="1000"
                    data-aos-easing="ease"
                    data-aos-once="true"
	            	>
	            	<p>I am a blockchain developer and Deep Learning enthusiast from Thessaloniki, Greece, 
					with a strong focus in Web3 design, resrarch, and development. 
	                I love to get new experiences and always learn from my surroundings, with interest on lifelong learning. 
	                I hold a BSc Degree in Applied Informatics from the University of Macedonia, with thesis on web3 application on 
					verification of academic qualifications, utilizing Ethereum blockchain. Also I have graduated from MSc in Data and Web Science from
					Aristotle University of Thessaloniki with thesis title: "Graph Embedding and Node Features for Drug-Target Interaction Prediction".
					MSc studies were conducted under the fully funded scholarship from DeepMind Technologies Limited.
					I am looking forward to any opportunities and challenges. 
                     </p>
	            </div>
			</div>
			<div className="row">
				<div className="col-lg-3 p-5 text-center"
					data-aos="fade"
                    data-aos-delay="300"
                    data-aos-duration="1000"
                    data-aos-easing="ease"
                    data-aos-once="true"
					>
                    <AnimatedProgressProvider
				        valueStart={0}
				        valueEnd={90}>
				        {value => {
				          const roundedValue = Math.round(value);
				          return (
				            <CircularProgressbar
				              value={value}
				              strokeWidth={3}
				              text={`${roundedValue}.0%`}
				              styles={buildStyles({
				              		pathTransition: "none",
							          textColor: "white",
							          textSize: "8px",
							          pathColor: "#cf1f1f",
							          trailColor: "#2f3134"
							        })}
											            />
				          );
				        }}
				      </AnimatedProgressProvider>
				      <h4 className="mt-2">HTML/CSS/Javascript</h4>
                </div>
                <div className="col-lg-3 p-5 text-center"
                	data-aos="fade"
                    data-aos-delay="400"
                    data-aos-duration="1000"
                    data-aos-easing="ease"
                    data-aos-once="true"
                	>
                    <AnimatedProgressProvider
				        valueStart={0}
				        valueEnd={75}>
				        {value => {
				          const roundedValue = Math.round(value);
				          return (
				            <CircularProgressbar
				              value={value}
				              strokeWidth={3}
				              text={`${roundedValue}.0%`}
				              styles={buildStyles({
				              		pathTransition: "none",
							          textColor: "white",
							          textSize: "8px",
							          pathColor: "#cf1f1f",
							          trailColor: "#2f3134"
							        })}
											            />
				          );
				        }}
				      </AnimatedProgressProvider>
				      <h4 className="mt-2">Docker</h4>
                </div>
                <div className="col-lg-3 p-5 text-center"
                	data-aos="fade"
                    data-aos-delay="500"
                    data-aos-duration="1000"
                    data-aos-easing="ease"
                    data-aos-once="true"
                	>
                    <AnimatedProgressProvider
				        valueStart={0}
				        valueEnd={85}>
				        {value => {
				          const roundedValue = Math.round(value);
				          return (
				            <CircularProgressbar
				              value={value}
				              strokeWidth={3}
				              text={`${roundedValue}.0%`}
				              styles={buildStyles({
				              		pathTransition: "none",
							          textColor: "white",
							          textSize: "8px",
							          pathColor: "#cf1f1f",
							          trailColor: "#2f3134"
							        })}
											            />
				          );
				        }}
				      </AnimatedProgressProvider>
				      <h4 className="mt-2">Solidity</h4>
                </div>
                <div className="col-lg-3 p-5 text-center"
                	data-aos="fade"
                    data-aos-delay="600"
                    data-aos-duration="1000"
                    data-aos-easing="ease"
                    data-aos-once="true"
                	>
                    <AnimatedProgressProvider
				        valueStart={0}
				        valueEnd={70}>
				        {value => {
				          const roundedValue = Math.round(value);
				          return (
				            <CircularProgressbar
				              value={value}
				              strokeWidth={3}
				              text={`${roundedValue}.0%`}
				              styles={buildStyles({
				              		pathTransition: "none",
							          textColor: "white",
							          textSize: "8px",
							          pathColor: "#cf1f1f",
							          trailColor: "#2f3134"
							        })}
											            />
				          );
				        }}
				      </AnimatedProgressProvider>
				      <h4 className="mt-2">Bash Scripting</h4>
                </div>
			</div>
			<div className="row">
				<div className="col-lg-3 p-5 text-center"
					data-aos="fade"
                    data-aos-delay="300"
                    data-aos-duration="1000"
                    data-aos-easing="ease"
                    data-aos-once="true"
					>
                    <AnimatedProgressProvider
				        valueStart={0}
				        valueEnd={87}>
				        {value => {
				          const roundedValue = Math.round(value);
				          return (
				            <CircularProgressbar
				              value={value}
				              strokeWidth={3}
				              text={`${roundedValue}.0%`}
				              styles={buildStyles({
				              		pathTransition: "none",
							          textColor: "white",
							          textSize: "8px",
							          pathColor: "#cf1f1f",
							          trailColor: "#2f3134"
							        })}
											            />
				          );
				        }}
				      </AnimatedProgressProvider>
				      <h4 className="mt-2">Python</h4>
                </div>
                <div className="col-lg-3 p-5 text-center"
                	data-aos="fade"
                    data-aos-delay="400"
                    data-aos-duration="1000"
                    data-aos-easing="ease"
                    data-aos-once="true"
                	>
                    <AnimatedProgressProvider
				        valueStart={0}
				        valueEnd={70}>
				        {value => {
				          const roundedValue = Math.round(value);
				          return (
				            <CircularProgressbar
				              value={value}
				              strokeWidth={3}
				              text={`${roundedValue}.0%`}
				              styles={buildStyles({
				              		pathTransition: "none",
							          textColor: "white",
							          textSize: "8px",
							          pathColor: "#cf1f1f",
							          trailColor: "#2f3134"
							        })}
											            />
				          );
				        }}
				      </AnimatedProgressProvider>
				      <h4 className="mt-2">Machine Learning</h4>
                </div>
                <div className="col-lg-3 p-5 text-center"
                	data-aos="fade"
                    data-aos-delay="500"
                    data-aos-duration="1000"
                    data-aos-easing="ease"
                    data-aos-once="true"
                	>
                    <AnimatedProgressProvider
				        valueStart={0}
				        valueEnd={80}>
				        {value => {
				          const roundedValue = Math.round(value);
				          return (
				            <CircularProgressbar
				              value={value}
				              strokeWidth={3}
				              text={`${roundedValue}.0%`}
				              styles={buildStyles({
				              		pathTransition: "none",
							          textColor: "white",
							          textSize: "8px",
							          pathColor: "#cf1f1f",
							          trailColor: "#2f3134"
							        })}
											            />
				          );
				        }}
				      </AnimatedProgressProvider>
				      <h4 className="mt-2">WordPress</h4>
                </div>
                <div className="col-lg-3 p-5 text-center"
                	data-aos="fade"
                    data-aos-delay="600"
                    data-aos-duration="1000"
                    data-aos-easing="ease"
                    data-aos-once="true"
                	>
                    <AnimatedProgressProvider
				        valueStart={0}
				        valueEnd={95}>
				        {value => {
				          const roundedValue = Math.round(value);
				          return (
				            <CircularProgressbar
				              value={value}
				              strokeWidth={3}
				              text={`${roundedValue}.0%`}
				              styles={buildStyles({
				              		pathTransition: "none",
							          textColor: "white",
							          textSize: "8px",
							          pathColor: "#cf1f1f",
							          trailColor: "#2f3134"
							        })}
											            />
				          );
				        }}
				      </AnimatedProgressProvider>
				      <h4 className="mt-2">Scientific Research</h4>
                </div>
			</div>
			
		</div>
		</div>
	);
}

export default hero;