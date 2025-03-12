import React, { useState } from "react";
import { Carousel, IconButton } from "@material-tailwind/react";
import { useDisclosure } from '@heroui/react'
import ModalRenderImg from "../Components/ModalRenderImg";
import ModalRenderHref from "../Components/ModalRenderHref";
import { Divider } from '@heroui/react'

export default function ImageModalUI() {
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [isImageOpenHB, setIsImageOpenHB] = useState(false);
    const [isimgNovedad, setImgNovedad] = useState("");
    const [isrouteHref, setRouteHref] = useState("");


    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isHrefOpen, onOpen: onHrefOpen, onClose: onHrefClose } = useDisclosure();
    const [size, setSize] = React.useState('md');

    const sizes = ["full"];

    const handleOpen = (size, accion, img = "",route) => {

        if (accion === 0) {
            setSize(size);
            setImgNovedad(img);
            onOpen();
        } else if (accion === 1) {
            setSize(size);
            setImgNovedad(img);
            onOpen();
        } else {
            setSize(size);
            setImgNovedad(img);
            setRouteHref(route)
            onHrefOpen();
        }


    }

    /* const toggleImageModal = (accion, img = "") => {
        if (accion === 0) {
            setIsImageOpen(!isImageOpen);
            if (img) setImgNovedad(img);
        } else if (accion === 1) {
            setIsImageOpen(!isImageOpen);
            if (img) setImgNovedad(img);
        } else {
            setIsImageOpenHB(!isImageOpenHB);
            if (img) setImgNovedad(img);
        }
    }; */


    return (
        <div className="p-5">
            <Divider className='h-[10px]' />
            <p className="mb-5 p-2 bg-[#dcdcdc] w-full sm:w-64 text-center font-bold">Novedades</p>
            
            <div>
                <Carousel
                    className="rounded-xl overflow-hidden w-full h-[400px]"
                    prevArrow={({ handlePrev }) => (
                        <IconButton
                            variant="text"
                            color="#00FFFF"
                            size="lg"
                            onClick={handlePrev}
                            className="!absolute top-2/4 left-4 -translate-y-2/4"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                />
                            </svg>
                        </IconButton>
                    )}
                    nextArrow={({ handleNext }) => (
                        <IconButton
                            variant="text"
                            color="#00FFFF"
                            size="lg"
                            onClick={handleNext}
                            className="!absolute top-2/4 !right-4 -translate-y-2/4"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </IconButton>
                    )}
                >
                    {/* Primer Slide con 3 Imágenes */}
                    {sizes.map((size) => (
                        <div className="flex justify-center gap-4 items-center h-full">
                            <img
                                src="https://lh3.googleusercontent.com/d/1ft1o7iENlfz1rUCmIGQC7bnNBDIe35kb"
                                alt="image 1"
                                className="h-[250px] w-[250px] object-cover rounded-lg cursor-pointer"
                                onClick={() => handleOpen(size, 0, "https://lh3.googleusercontent.com/d/1ft1o7iENlfz1rUCmIGQC7bnNBDIe35kb")}
                            />

                            <img
                                src="https://lh3.googleusercontent.com/d/1B-NyayhYMdJ4_uBaTk8SRWnD6TV3CaIo"
                                alt="image 2"
                                className="h-[250px] w-[250px] object-cover rounded-lg cursor-pointer"
                                onClick={() => handleOpen(size, 1, "https://lh3.googleusercontent.com/d/1B-NyayhYMdJ4_uBaTk8SRWnD6TV3CaIo")}
                            />
                            <img
                                src="https://lh3.googleusercontent.com/d/1-y9NaFkTjYNvCzeNUR0y4qgjk0tyo4mQ"
                                alt="image 3"
                                className="h-[250px] w-[250px] object-cover rounded-lg cursor-pointer"
                                onClick={() => handleOpen(size, 2, "https://lh3.googleusercontent.com/d/1-y9NaFkTjYNvCzeNUR0y4qgjk0tyo4mQ",'resources.modulo.cumpleaños')}
                            />
                        </div>
                    ))}
                    {sizes.map((size) => (
                        <div className="flex justify-center gap-4 items-center h-full">
                            <img
                                src="https://lh3.googleusercontent.com/d/1EdgWZvTyxCdmdi-g2GJjK-cbvVs-cHSw"
                                alt="image 1"
                                className="h-[250px] w-[250px] object-cover rounded-lg cursor-pointer"
                                onClick={() => handleOpen(size, 0, "https://lh3.googleusercontent.com/d/1EdgWZvTyxCdmdi-g2GJjK-cbvVs-cHSw")}
                            />

                        </div>
                    ))}
                </Carousel>
            </div>

            <ModalRenderImg isimgNovedad={isimgNovedad} size={size} open={isOpen} close={onClose} />
            <ModalRenderHref isrouteHref={isrouteHref} isimgNovedad={isimgNovedad} size={size} open={isHrefOpen} close={onHrefClose} />
        </div >
    );
}
