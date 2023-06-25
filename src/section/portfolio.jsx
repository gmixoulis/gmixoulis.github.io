import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

const responsive = {
  0: {
    items: 1,
  },
  568: {
    items: 2,
  },
  1024: {
    items: 3,
    itemsFit: "contain",
  },
};

const Portfolio = () => {
  const importAllImages = (r) => {
    return r.keys().map((fileName) => ({
      src: fileName.replace("./", "/img/portfolio/"),
      fileName: fileName,
    }));
  };

  const imageContext = require.context(
    "../../public/img/portfolio",
    false,
    /\.(png|gif|PNG|jpe?g)$/
  );
  const images = importAllImages(imageContext);

  const photos = images.map((image) => {
    const { src, fileName } = image;
    const fileInfo = fileName.replace("./", "").replace(/\.(png|gif|PNG|jpe?g)$/, "");

    const alt = fileInfo;

    console.log(String(fileInfo));

    return { src, fileInfo, alt };
  });
  const items = [];
  photos.map((photo) => {
    const href = "https://" + photo.fileInfo;
    items.push(
      <div className="item" data-value={photo.fileInfo} alt={photo.alt}>
        <a
          href={href}
          target="_blank"
          alt={photo.alt}
          rel="noopener noreferrer"
        >
          <img src={photo.src} alt={photo.alt} width={"450px"} height="350" />
        </a>
      </div>
    );
    return null;
  });

  return (
    <div>
      <div className="col-md-8 text-center m-auto">
        <div className="spacer-single"></div>
        <div className="row">
          <div className="col-md-12 text-center">
            <h2>Web Apps Portfolio</h2>
            <div className="space-border"></div>
          </div>
        </div>
      </div>
      <div className="section py-0 ">
        <div className="col-md-8 text-center m-auto">
          <AliceCarousel
            autoPlay
            autoPlayInterval={2000}
            animationDuration={2000}
            animationType="fadeout"
            infinite
            items={items}
            responsive={responsive}
          />
        </div>
      </div>
    </div>
  );
};
export default Portfolio;
