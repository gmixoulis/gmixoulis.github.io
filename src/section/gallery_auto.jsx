import React, { useState, useCallback } from "react";
import Gallery from "react-photo-gallery";
import { Parallax } from "react-parallax";
import Carousel, { Modal, ModalGateway } from "react-images";
const image1 = "./img/background/wall.jpg";

const importAllImages = (r) => {
  return r.keys().map((fileName) => ({
    src: fileName.replace("./", "/img/renamed/"),
    fileName: fileName,
  }));
};

const imageContext = require.context(
  "../../public/img/renamed",
  false,
  /\.(png|jpe?g)$/
);
const images = importAllImages(imageContext);

const photos = images.map((image) => {
  const { src, fileName } = image;
  const fileInfo = fileName.replace("./", "").replace(/\.(png|jpe?g)$/, "");
  const [certificateType, ...rest] = fileInfo.split("_");
  const title = rest.join(" ");
  const alt = certificateType;

  const width = 1;
  const height = 1;

  return {
    src,
    width,
    height,
    title,
    alt,
  };
});

const MyGallery = () => {
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
                    views={photos.map((x) => ({
                      ...x,
                      srcset: x.srcSet,
                      caption: x.title,
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

export default MyGallery;
