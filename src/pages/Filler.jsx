import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Filler() {

    const continents = {
        Asia: ['China', 'India', 'Indonesia', 'Pakistan', 'Bangladesh', 'Japan', 'Philippines', 'Vietnam', 'Turkey', 'Iran'],
        Africa: ['Nigeria', 'Ethiopia', 'Egypt', 'DR Congo', 'Tanzania', 'South Africa', 'Kenya', 'Uganda', 'Sudan', 'Algeria'],
        Europe: ['Russia', 'Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Ukraine', 'Poland', 'Romania', 'Netherlands'],
        Americas: ['United States', 'Brazil', 'Mexico', 'Colombia', 'Argentina', 'Canada', 'Peru', 'Venezuela', 'Chile', 'Ecuador'],
    };

    const images = [
        "https://picsum.photos/200/300",
        "https://picsum.photos/400/500",
        "https://picsum.photos/300/300",
        "https://picsum.photos/600/500",
        "https://picsum.photos/400/400"
    ];

    const [selectedContinent, setSelectedContinent] = useState('Asia');
    const [selectedCountry, setSelectedCountry] = useState(continents.Asia[0]);

    const handleContinentChange = (event) => {
        const continent = event.target.value;
        setSelectedContinent(continent);
        setSelectedCountry(continents[continent][0]);
    };

    const handleCountryChange = (event) => {
        const country = event.target.value;
        setSelectedCountry(country);
    };

    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = (index) => {
        setCurrentIndex(index);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const goToPrev = (e) => {
        e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
    };

    const goToNext = (e) => {
        e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
    };

    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (modalOpen) {
                if (e.key === 'ArrowLeft') {
                    goToPrev(e);
                } else if (e.key === 'ArrowRight') {
                    goToNext(e);
                } else if (e.key === 'Escape') {
                    closeModal();
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }
    , [modalOpen]);


  return (
    <div className="h-[100vh] w-[100vw] overflow-scroll bg-gradient-to-b from-zinc-800 to-zinc-900">
        <div className="m-12 mb-6 text-3xl text-purple-500 font-semibold">
            Filler Page
        </div>
        <div className="w-full h-[1px] bg-zinc-800"/>
        <div className="m-12 text-2xl text-zinc-200">
            Nested list
        </div>
        <ul className="text-xl ml-16">
            <li>
                <ul className="indent-12">
                    <li>item 1.a</li>
                    <li>item 1.b</li>
                    <li>item 1.c</li>
                </ul>
            </li>
            <li>item 2</li>
            <li>item 3</li>
        </ul>

        <div className="m-12 mb-0 text-2xl text-zinc-200">
            Dynamic selectors
        </div>
        <div className="flex flex-row m-6">
            <div className="flex flex-col m-4">
                <label htmlFor="continents">Select a continent</label>
                <select
                    id="continents"
                    name="continents"
                    value={selectedContinent}
                    onChange={handleContinentChange}
                >
                    {Object.keys(continents).map((continent, index) => (
                        <option key={index} value={continent}>
                            {continent}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col m-4">
                <label htmlFor="countries">Select a country</label>
                <select
                    id="countries"
                    name="countries"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                >
                    {continents[selectedContinent].map((country, index) => (
                        <option key={index} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        <div className='m-16 flex flex-row'>
        {
            images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt="random"
                    className="w-32 h-32 m-4"
                    onClick={() => openModal(index)}
                />
            ))
        }
        </div>
        <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-row items-center justify-center backdrop-blur-sm ${modalOpen ? '' : 'hidden'}`} onClick={closeModal}>
            <div className='p-8 justify-center items-center rounded-lg flex flex-row'>
                <button className="fill-white w-8 h-8" onClick={goToPrev}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>    
                </button>
                <img src={images[currentIndex]} className='rounded-lg h-[400px] w-[400px] mx-12' alt="image" onClick={(e) => e.stopPropagation()} />
                <button className="fill-white w-8 h-8" onClick={goToNext}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
                </button>
            </div>
        </div>
        <Link to="/" className="button px-4 py-2 absolute m-8 rounded-lg top-0 right-0 text-xl bg-purple-500 text-zinc-900 font-semibold">
            Back to home
        </Link>
    </div>
  )
}

export default Filler;