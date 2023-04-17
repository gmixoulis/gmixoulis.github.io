const fs = require("fs");
const path = require("path");

const photos = [
  {
    src: "./certificates/Master.jpg",
    width: 1,
    height: 1,
    title: "Master in Data and Web Science",
    alt: "Master Degree",
  },
  {
    src: "./certificates/uom.jpg",
    width: 1,
    height: 1,
    title: "Bachelor in Applied Informatics",
    alt: "Bachelor Degree",
  },
  {
    src: "./certificates/MOOC.jpg",
    width: 1.2,
    height: 1,
    title: "MOOC",
    alt: "MOOC",
  },
  {
    src: "./certificates/intership.jpg",
    width: 1.2,
    height: 1,
    title: "Intership Volunteer",
    alt: "Intership Volunteer",
  },
  {
    src: "./certificates/skg-code-1.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Participation",
    alt: "Certificate of Participation",
  },
  {
    src: "./certificates/CVML.jpg",
    width: 1,
    height: 1,
    title: "CVML Mini Course",
    alt: "CVML Mini Course",
  },
  {
    src: "./certificates/hour.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Participation",
    alt: "Certificate of Participation",
  },
  {
    src: "./certificates/curex.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Attendance",
    alt: "Certificate of Attendance",
  },

  {
    src: "./certificates/education.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Attendance",
    alt: "Certificate of Attendance",
  },
  {
    src: "./certificates/grow1.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Attendance",
    alt: "Certificate of Attendance",
  },
  {
    src: "./certificates/grow2.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Attendance",
    alt: "Certificate of Attendance",
  },
  {
    src: "./certificates/ieee.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Attendance",
    alt: "Certificate of Attendance",
  },

  {
    src: "./certificates/legal.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Attendance",
    alt: "Certificate of Attendance",
  },

  {
    src: "./certificates/vechain.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Attendance",
    alt: "Certificate of Attendance",
  },
  {
    src: "./certificates/rainbow.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Attendance",
    alt: "Certificate of Attendance",
  },
  {
    src: "./certificates/ccna-1.jpg",
    width: 1,
    height: 1,
    title: "CCNA",
    alt: "CCNA",
  },
  {
    src: "./certificates/networking-essentials.png",
    width: 1,
    height: 1,
    title: "Cisco Networking Essentials",
    alt: "Certificate Cisco Networking Essentials",
  },
  {
    src: "./certificates/intracom-1.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Attendance",
    alt: "Certificate of Attendance",
  },
  {
    src: "./certificates/lyceum.jpg",
    width: 1,
    height: 1,
    title: "Award",
    alt: "Award",
  },
  {
    src: "./certificates/greeklug-1.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Attendance",
    alt: "Certificate of Attendance",
  },

  {
    src: "./certificates/BEBAIOSI_MICHOULIS.png",
    width: 1,
    height: 1,
    title: "Certificate of Participation",
    alt: "Certificate of Participation",
  },

  {
    src: "./certificates/hour1.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Attendance",
    alt: "Certificate of Attendance",
  },
  {
    src: "./certificates/Hydrobot-1.jpg",
    width: 1,
    height: 1,
    title: "Certificate of Attendance",
    alt: "Certificate of Attendance",
  },

  {
    src: "./certificates/ECPE-1.jpg",
    width: 1,
    height: 1,
    title: "English Certificate",
    alt: "English Certificate",
  },
  {
    src: "./certificates/to.jpg",
    width: 1,
    height: 1,
    title: "English Certificate",
    alt: "English Certificate",
  },
];

const originalImagesFolder = "./certificates/";
const renamedImagesFolder = "./renamed/";

photos.forEach((photo) => {
  const { src, alt } = photo;

  const originalFilePath = path.join(
    __dirname,
    originalImagesFolder,
    path.basename(src)
  );
  const extension = path.extname(src);
  const newFileName = `${alt.replace(/ /g, "-")}_${path.basename(
    src,
    extension
  )}.jpg`;
  const renamedFilePath = path.join(
    __dirname,
    renamedImagesFolder,
    newFileName
  );

  fs.copyFileSync(originalFilePath, renamedFilePath);
});
