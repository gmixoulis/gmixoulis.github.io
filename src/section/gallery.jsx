import React, { useState, useCallback } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { Parallax } from "react-parallax";

const image1 ="./img/background/wall.jpg";

const photos = [
    {
        src: './img/certificates/Master.jpg',
        width: 1,
        height: 1,
        title:"Master in Data and Web Science",
        alt:"Master Degree"
      },
      {
        src: './img/certificates/uom.jpg',
        width: 1,
        height: 1,
        title:"Bachelor in Applied Informatics",
        alt:"Bachelor Degree"
      },
    {
        src: './img/certificates/MOOC.jpg',
        width: 1.2,
        height: 1,
        title:"MOOC",
        alt:"MOOC"
      },
      {
        src: './img/certificates/intership.jpg',
        width: 1.2,
        height: 1,
        title:"Intership Volunteer",
        alt:"Intership Volunteer"
      },
      {
        src: './img/certificates/skg-code-1.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Participation",
        alt:"Certificate of Participation"
      },
      {
        src: './img/certificates/CVML.jpg',
        width: 1,
        height: 1,
        title:"CVML Mini Course",
        alt:"CVML Mini Course"
      },
      {
        src: './img/certificates/hour.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Participation",
        alt:"Certificate of Participation"
      },
    {
      src: './img/certificates/curex.jpg',
      width: 1,
      height: 1,
      title:"Certificate of Attendance",
      alt:"Certificate of Attendance"
    },
    
    {
        src: './img/certificates/education.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Attendance",
        alt:"Certificate of Attendance"
      },  {
        src: './img/certificates/grow1.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Attendance",
        alt:"Certificate of Attendance"
      },  {
        src: './img/certificates/grow2.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Attendance",
        alt:"Certificate of Attendance"
      },  {
        src: './img/certificates/ieee.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Attendance",
        alt:"Certificate of Attendance"
      },
     
      {
        src: './img/certificates/legal.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Attendance",
        alt:"Certificate of Attendance"
      },
     
      {
        src: './img/certificates/vechain.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Attendance",
        alt:"Certificate of Attendance"
      },
      {
        src: './img/certificates/rainbow.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Attendance",
        alt:"Certificate of Attendance"
      },
      {
        src: './img/certificates/ccna-1.jpg',
        width: 1,
        height: 1,
        title:"CCNA",
        alt:"CCNA"
      },
      {
        src: './img/certificates/networking-essentials.png',
        width: 1,
        height: 1,
        title:"Cisco Networking Essentials",
        alt:"Certificate Cisco Networking Essentials"
      },
      {
        src: './img/certificates/intracom-1.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Attendance",
        alt:"Certificate of Attendance"
      },
      {
        src: './img/certificates/lyceum.jpg',
        width: 1,
        height: 1,
        title:"Award",
        alt:"Award"
      },
      {
        src: './img/certificates/greeklug-1.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Attendance",
        alt:"Certificate of Attendance"
      },
 
      {
        src: './img/certificates/BEBAIOSI_MICHOULIS.png',
        width: 1,
        height: 1,
        title:"Certificate of Participation",
        alt:"Certificate of Participation"
      },
   
      
      {
        src: './img/certificates/hour1.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Attendance",
        alt:"Certificate of Attendance"
      },
      {
        src: './img/certificates/Hydrobot-1.jpg',
        width: 1,
        height: 1,
        title:"Certificate of Attendance",
        alt:"Certificate of Attendance"
      },
     
      {
        src: './img/certificates/ECPE-1.jpg',
        width: 1,
        height: 1,
        title:"English Certificate",
        alt:"English Certificate"
      },
      {
        src: './img/certificates/to.jpg',
        width: 1,
        height: 1,
        title:"English Certificate",
        alt:"English Certificate"
      },
      
  ];



const MyGallery = function() {
    
        const [currentImage, setCurrentImage] = useState(0);
        const [viewerIsOpen, setViewerIsOpen] = useState(false);
      
        const openLightbox = useCallback((event, { photo, index }) => {
          setCurrentImage(index);
          setViewerIsOpen(true);
        }, []);
      
        const closeLightbox = () => {
          setCurrentImage(0);
          setViewerIsOpen(false);
        };
        return (
            
    <div>
      
    <div className="col-md-8 text-center m-auto">
         <div className="spacer-single"></div>
			<div className="row">
				<div className="col-md-12 text-center">
	                <h2>Wall of Certificates</h2>
	                <div className="space-border"></div>
	            </div>
			</div>
      </div>
      <div className="section py-0 ">
        
      <Parallax className="py-5" bgImage={image1} strength={300}>

    <div className="col-md-8 text-center m-auto">
      
    
      <Gallery photos={photos} onClick={openLightbox} />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={photos.map(x => ({
                ...x,
                srcset: x.srcSet,
                caption: x.title
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
     
    </div>
    </Parallax>
    </div>
    </div>
  );
};

export default MyGallery