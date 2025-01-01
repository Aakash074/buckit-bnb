/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";
// import nftMintAbi from "../contracts/bucketAbi.json";
import bucketAbi from "../contracts/bucketAbi.json";


//@ts-ignore
const YouTubeEmbed = ({ videoId, buckets, nftAddress, creator, description }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showBucket, setShowBucket] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  console.log(buckets)

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isVisible ? 1 : 0}&controls=0&modestbranding=1&loop=1&playlist=${videoId}&mute=0`;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  async function addToBucketList() {
    console.log(nftAddress, typeof nftAddress);

    const bucketDetails = {
      bucketTypes: [],
      names: [],
      places: []
    };

    selectedItems?.forEach(item => {
      // Add type to bucketTypes if it's not already included
      // if (!bucketDetails?.places?.includes(item?.mapData?.placePrediction?.placeId)) { 
      //@ts-ignore
          bucketDetails?.bucketTypes?.push(item?.type);
          // Add name to names
          //@ts-ignore
          bucketDetails?.names?.push(item?.name);
          // Add place to places
          //@ts-ignore
          bucketDetails?.places?.push(item?.mapData?.placePrediction?.text?.text);
      // }
  });

  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  // const contractAddress = "0xfd590B760B58733488513e5E4b75130D54Cdc9f8";
  const contractAddressNFTMint = "0x71d75177f0e105ddcf8628f352981d8e50a0136a"

  const contractAddress = "0x5b506b9595cf06cea8bb8f2ad71ace221441576c"

  const contract = new ethers.Contract(contractAddress, bucketAbi, signer);

  // const userAddress = await signer.getAddress();

  const tx = await contract.linkNFTToBuckets(
    contractAddressNFTMint,
    nftAddress,
    bucketDetails?.bucketTypes,
    bucketDetails?.names,
    bucketDetails?.places
  );

    await tx.wait();



}

  // Handle select all
  //@ts-ignore
  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      // Add all item ids to the selectedItems array
      const allIds = buckets;
      setSelectedItems(allIds);
    } else {
      // Clear all items from selectedItems array
      setSelectedItems([]);
    }
  };

  // Handle individual item selection
  // Handle individual item selection/deselection
  //@ts-ignore
  const handleItemChange = (item) => { //@ts-ignore
    setSelectedItems(prevSelectedItems => { //@ts-ignore
      if (prevSelectedItems.includes(item)) {
        // If already selected, remove it
        //@ts-ignore
        return prevSelectedItems.filter(im => im.name !== item.name);
      } else {
        // If not selected, add it
        return [...prevSelectedItems, item];
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={videoRef}
      className='flex flex-row justify-center relative'
      style={{
        width: '100%',
        height: '100%',
      }}
    >
        <div
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Disable interactions if needed
        maxWidth: '420px'
      }}
    >
      <iframe
        src={embedUrl}
        title="YouTube Video"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{
          width: '100%',
          height: '100%',
        }}
      >
      </iframe>
      </div>
      <div className={`absolute bg-opacity-40 flex flex-row justify-between bg-black rounded-md ${isMobile ? ' flex flex-row w-[98%] mx-4 bottom-16' : 'bottom-8 flex flex-row w-[95%] max-w-[380px]'}`}>
        <div className='flex flex-col w-[70%] text-left text-white p-4'>
          <div className='flex flex-row gap-2 items-center cursor-pointer' onClick={() => navigate('/' + creator)}><div><UserCircleIcon className="size-4 text-blue-500" /></div><div className='font-bold'>{creator}</div></div>
          <div>{description}</div>
        </div>
        <button onClick={() => setShowBucket(!showBucket)}>BuckIt</button>
      </div>
    {showBucket && <div className={`absolute ${isMobile ? 'm-4 w-[95%] bottom-40' : 'bottom-32 m-4 w-[95%] max-w-[380px]' } z-100 bg-white p-4 rounded-md`}>
      {/* <div>
        <label>
          <input
            type="checkbox"
            checked={selectedItems.every(item => item)}
            onChange={handleSelectAll}
          />
          Select All
        </label>
      </div> */}
      {/* @ts-ignore */}
      {buckets?.map((item, index) => { //@ts-ignore
        const isSelected = selectedItems.find(selectedItem => selectedItem.name === item.name) || false;

        return (
          <div key={index} className='flex flex-col text-left'>
            <label className='flex flex-row'>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleItemChange(item)}
                className='mr-2'
              />
              <div>
              {index + 1}. {item.name}
              </div>
            </label>
            <div>{item.mapData?.placePrediction?.text?.text}</div>
          </div>
        );
      })}
      <button onClick={() => addToBucketList()}>Add to Bucket</button>
      </div>}
    </div>
  );
};

export default YouTubeEmbed;
