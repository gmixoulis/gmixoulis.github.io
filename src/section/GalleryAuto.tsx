import React, { useState, useCallback } from 'react';
import Gallery from 'react-photo-gallery';
import Carousel, { ModalGateway } from 'react-images';
import type { FC, ReactNode } from 'react';
const Gateway = ModalGateway as unknown as FC<{ children: ReactNode }>;
import { Modal as LightboxModal } from 'react-images';
import Section from '../layout/Section';

const modules = import.meta.glob('../../public/img/renamed/*.{png,jpg,jpeg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const photos = Object.entries(modules).map(([path, src]) => {
  const fileInfo = path.split('/').pop()!.replace(/\.(png|jpe?g)$/, '');
  const [cert, ...rest] = fileInfo.split('_');
  return { src, width: 1, height: 1, title: rest.join(' '), alt: cert };
});

const GalleryAuto: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const openLightbox = useCallback((_: React.MouseEvent, { index }: { index: number }) => { setCurrentImage(index); setViewerIsOpen(true); }, []);
  const closeLightbox = () => { setCurrentImage(0); setViewerIsOpen(false); };
  const Modal = LightboxModal as unknown as React.FC<{ onClose: () => void; children: React.ReactNode }>;
  return (
    <Section id='MyGallery' title='Wall of Certificates' bgImage='/img/background/wall.jpg'>
      <div className='col-md-8 text-center m-auto'>
        <Gallery photos={photos} onClick={openLightbox} />
        <Gateway>
          {viewerIsOpen ? (
            <Modal onClose={closeLightbox}>
              <Carousel currentIndex={currentImage} views={photos.map(x => ({ source: x.src, caption: x.title }))} />
            </Modal>
          ) : null}
        </Gateway>
      </div>
    </Section>
  );
};
export default GalleryAuto;
