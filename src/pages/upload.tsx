/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'; //@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios';
// import { Client, FileCreateTransaction, Hbar, PrivateKey } from '@hashgraph/sdk';
import { ethers } from "ethers";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import nftMintAbi from "../contracts/nftMintAbi.json";


//@ts-ignore
const JWT = import.meta.env.VITE_PINATA_JWT;
// Replace with your Pinata API key and secret
//@ts-ignore
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
//@ts-ignore
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;


const uploadToPinata = async (file: File) => {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${JWT}`,
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
    });
    return response.data; // Adjust this based on the response structure
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw error;
  }
};

const uploadMetadataToPinata = async (ipfsHash, nftData, videoId, recipientAddress) => {
  const metadata = {
    name: nftData?.videoDetails?.channelTitle + " NFT",
    description: nftData?.videoDetails?.title,
    image: "ipfs://" + ipfsHash,
    "properties": {
            "creator": recipientAddress,
            "creatorName": nftData?.videoDetails?.channelTitle,
            "videoId": videoId,
            "buckets": nftData?.result
      }
  };
  const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const formData = new FormData();
          formData.append('file', metadataBlob, 'nft_metadata.json');
  
          const pinataOptions = JSON.stringify({
            cidVersion: 0
        });
        formData.append('pinataOptions', pinataOptions);
  
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, { //@ts-ignore
          maxBodyLength: 'Infinity', // Support for large files
          headers: {
              'Authorization': `Bearer ${JWT}`,
              pinata_api_key: PINATA_API_KEY,
              pinata_secret_api_key: PINATA_SECRET_KEY
          }
      });
  
      // Get the IPFS hash from the response
      const ipfsHashMD = response.data.IpfsHash;
      return `ipfs://${ipfsHashMD}`
}

//@ts-ignore
function extractYoutubeVideoId(url) {
    if (!url) return null;
  
    // Regular expression patterns for different YouTube URL formats
    const patterns = {
      // Regular video URLs
      standard: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      // Shorts URLs
      shorts: /youtube\.com\/shorts\/([^"&?\/\s]{11})/i,
    };
  
    // Try shorts pattern first
    const shortsMatch = url.match(patterns.shorts);
    if (shortsMatch) return shortsMatch[1];
  
    // Try standard pattern
    const standardMatch = url.match(patterns.standard);
    if (standardMatch) return standardMatch[1];
  
    return null;
  }

export const Upload = () => {
      const [value, setValue] = useState("");
      const [extractedData, setExtractedData] = useState();
      const [isMobile, setIsMobile] = useState(false);



      // const [file, setFile] = useState(null);

      
    
      //@ts-ignore
        const handleChange = (e) => {
            setValue(e.target.value);
        };

        //@ts-ignore
        // const handleFileChange = (event) => {
        //   setFile(event.target.files[0]);
        // };


        const handleFetch = async () => {
            if(value) {
                const videoId = extractYoutubeVideoId(value);
                const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                  params: {
                      part: 'snippet',
                      id: videoId,
                      key: "AIzaSyBNx9nQY2nMg8GA9Q7K4xMcwpYQ68Gwc3A"
                  }
              });
          
              const videoDetails = response.data.items[0].snippet;
                let result = await axios.get("http://localhost:3001/reels/ytShorts?url=" + videoId)
                result = result.data
                // const result = {
                //     "result": [
                //         {
                //             "type": "activity",
                //             "name": "Fly from Mumbai to Germany",
                //             "mapData": {
                //                 "placePrediction": {
                //                     "place": "places/ChIJwe1EZjDG5zsRaYxkjY_tpF0",
                //                     "placeId": "ChIJwe1EZjDG5zsRaYxkjY_tpF0",
                //                     "text": {
                //                         "text": "Mumbai, Maharashtra, India",
                //                         "matches": [
                //                             {
                //                                 "endOffset": 6
                //                             },
                //                             {
                //                                 "startOffset": 8,
                //                                 "endOffset": 19
                //                             },
                //                             {
                //                                 "startOffset": 21,
                //                                 "endOffset": 26
                //                             }
                //                         ]
                //                     },
                //                     "structuredFormat": {
                //                         "mainText": {
                //                             "text": "Mumbai",
                //                             "matches": [
                //                                 {
                //                                     "endOffset": 6
                //                                 }
                //                             ]
                //                         },
                //                         "secondaryText": {
                //                             "text": "Maharashtra, India",
                //                             "matches": [
                //                                 {
                //                                     "endOffset": 11
                //                                 },
                //                                 {
                //                                     "startOffset": 13,
                //                                     "endOffset": 18
                //                                 }
                //                             ]
                //                         }
                //                     },
                //                     "types": [
                //                         "political",
                //                         "geocode",
                //                         "locality"
                //                     ]
                //                 }
                //             }
                //         },
                //         {
                //             "type": "activity",
                //             "name": "Fly from Germany to Oslo",
                //             "mapData": {
                //                 "placePrediction": {
                //                     "place": "places/ChIJa76xwh5ymkcRW-WRjmtd6HU",
                //                     "placeId": "ChIJa76xwh5ymkcRW-WRjmtd6HU",
                //                     "text": {
                //                         "text": "Germany",
                //                         "matches": [
                //                             {
                //                                 "endOffset": 7
                //                             }
                //                         ]
                //                     },
                //                     "structuredFormat": {
                //                         "mainText": {
                //                             "text": "Germany",
                //                             "matches": [
                //                                 {
                //                                     "endOffset": 7
                //                                 }
                //                             ]
                //                         }
                //                     },
                //                     "types": [
                //                         "geocode",
                //                         "country",
                //                         "political"
                //                     ]
                //                 }
                //             }
                //         },
                //         {
                //             "type": "activity",
                //             "name": "Spend the night at Oslo Airport",
                //             "mapData": {
                //                 "placePrediction": {
                //                     "place": "places/ChIJc-6p05J7QUYR9XUtuHWVm_8",
                //                     "placeId": "ChIJc-6p05J7QUYR9XUtuHWVm_8",
                //                     "text": {
                //                         "text": "Oslo airport cab, Odvar Solbergs vei, Oslo, Norway",
                //                         "matches": [
                //                             {
                //                                 "endOffset": 12
                //                             },
                //                             {
                //                                 "startOffset": 38,
                //                                 "endOffset": 42
                //                             },
                //                             {
                //                                 "startOffset": 44,
                //                                 "endOffset": 50
                //                             }
                //                         ]
                //                     },
                //                     "structuredFormat": {
                //                         "mainText": {
                //                             "text": "Oslo airport cab",
                //                             "matches": [
                //                                 {
                //                                     "endOffset": 12
                //                                 }
                //                             ]
                //                         },
                //                         "secondaryText": {
                //                             "text": "Odvar Solbergs vei, Oslo, Norway",
                //                             "matches": [
                //                                 {
                //                                     "startOffset": 20,
                //                                     "endOffset": 24
                //                                 },
                //                                 {
                //                                     "startOffset": 26,
                //                                     "endOffset": 32
                //                                 }
                //                             ]
                //                         }
                //                     },
                //                     "types": [
                //                         "point_of_interest",
                //                         "establishment"
                //                     ]
                //                 }
                //             }
                //         },
                //         {
                //             "type": "activity",
                //             "name": "Take a 3-hour flight from Oslo",
                //             "mapData": {
                //                 "placePrediction": {
                //                     "place": "places/ChIJc-6p05J7QUYR9XUtuHWVm_8",
                //                     "placeId": "ChIJc-6p05J7QUYR9XUtuHWVm_8",
                //                     "text": {
                //                         "text": "Oslo airport cab, Odvar Solbergs vei, Oslo, Norway",
                //                         "matches": [
                //                             {
                //                                 "endOffset": 12
                //                             },
                //                             {
                //                                 "startOffset": 38,
                //                                 "endOffset": 42
                //                             },
                //                             {
                //                                 "startOffset": 44,
                //                                 "endOffset": 50
                //                             }
                //                         ]
                //                     },
                //                     "structuredFormat": {
                //                         "mainText": {
                //                             "text": "Oslo airport cab",
                //                             "matches": [
                //                                 {
                //                                     "endOffset": 12
                //                                 }
                //                             ]
                //                         },
                //                         "secondaryText": {
                //                             "text": "Odvar Solbergs vei, Oslo, Norway",
                //                             "matches": [
                //                                 {
                //                                     "startOffset": 20,
                //                                     "endOffset": 24
                //                                 },
                //                                 {
                //                                     "startOffset": 26,
                //                                     "endOffset": 32
                //                                 }
                //                             ]
                //                         }
                //                     },
                //                     "types": [
                //                         "point_of_interest",
                //                         "establishment"
                //                     ]
                //                 }
                //             }
                //         },
                //         {
                //             "type": "activity",
                //             "name": "Walk for half an hour and navigate through storms",
                //             "mapData": {
                //                 "placePrediction": {
                //                     "place": "places/ChIJ7cHA7X9LeEUR2PpTYnK_m4E",
                //                     "placeId": "ChIJ7cHA7X9LeEUR2PpTYnK_m4E",
                //                     "text": {
                //                         "text": "Norways, Svalbard, Svalbard and Jan Mayen",
                //                         "matches": [
                //                             {
                //                                 "endOffset": 6
                //                             },
                //                             {
                //                                 "startOffset": 9,
                //                                 "endOffset": 17
                //                             }
                //                         ]
                //                     },
                //                     "structuredFormat": {
                //                         "mainText": {
                //                             "text": "Norways",
                //                             "matches": [
                //                                 {
                //                                     "endOffset": 6
                //                                 }
                //                             ]
                //                         },
                //                         "secondaryText": {
                //                             "text": "Svalbard, Svalbard and Jan Mayen",
                //                             "matches": [
                //                                 {
                //                                     "endOffset": 8
                //                                 }
                //                             ]
                //                         }
                //                     },
                //                     "types": [
                //                         "establishment",
                //                         "natural_feature"
                //                     ]
                //                 }
                //             }
                //         },
                //         {
                //             "type": "visit",
                //             "name": "Visit the World's Northernmost Settlement",
                //             "mapData": {
                //                 "placePrediction": {
                //                     "place": "places/ChIJ7cHA7X9LeEUR2PpTYnK_m4E",
                //                     "placeId": "ChIJ7cHA7X9LeEUR2PpTYnK_m4E",
                //                     "text": {
                //                         "text": "Norways, Svalbard, Svalbard and Jan Mayen",
                //                         "matches": [
                //                             {
                //                                 "endOffset": 6
                //                             },
                //                             {
                //                                 "startOffset": 9,
                //                                 "endOffset": 17
                //                             }
                //                         ]
                //                     },
                //                     "structuredFormat": {
                //                         "mainText": {
                //                             "text": "Norways",
                //                             "matches": [
                //                                 {
                //                                     "endOffset": 6
                //                                 }
                //                             ]
                //                         },
                //                         "secondaryText": {
                //                             "text": "Svalbard, Svalbard and Jan Mayen",
                //                             "matches": [
                //                                 {
                //                                     "endOffset": 8
                //                                 }
                //                             ]
                //                         }
                //                     },
                //                     "types": [
                //                         "natural_feature",
                //                         "establishment"
                //                     ]
                //                 }
                //             }
                //         }
                //     ],
                //     "videoDetails": {
                //         "publishedAt": "2024-10-16T12:00:13Z",
                //         "channelId": "UCmA5vZTzv8WuymjhM5EOWSg",
                //         "title": "I am near North Pole: World’s Northmost Settlement",
                //         "description": "",
                //         "thumbnails": {
                //             "default": {
                //                 "url": "https://i.ytimg.com/vi/80aOWCoUfAs/default.jpg",
                //                 "width": 120,
                //                 "height": 90
                //             },
                //             "medium": {
                //                 "url": "https://i.ytimg.com/vi/80aOWCoUfAs/mqdefault.jpg",
                //                 "width": 320,
                //                 "height": 180
                //             },
                //             "high": {
                //                 "url": "https://i.ytimg.com/vi/80aOWCoUfAs/hqdefault.jpg",
                //                 "width": 480,
                //                 "height": 360
                //             },
                //             "standard": {
                //                 "url": "https://i.ytimg.com/vi/80aOWCoUfAs/sddefault.jpg",
                //                 "width": 640,
                //                 "height": 480
                //             },
                //             "maxres": {
                //                 "url": "https://i.ytimg.com/vi/80aOWCoUfAs/maxresdefault.jpg",
                //                 "width": 1280,
                //                 "height": 720
                //             }
                //         },
                //         "channelTitle": "The Virgo Compass",
                //         "categoryId": "19",
                //         "liveBroadcastContent": "none",
                //         "localized": {
                //             "title": "I am near North Pole: World’s Northmost Settlement",
                //             "description": ""
                //         },
                //         "defaultAudioLanguage": "en-IN"
                //     }
                // } 
                //@ts-ignore
                setExtractedData({result, videoDetails});
        
            }
        }

        const handleUpload = async () => {
            // const response = await axios.post(extractedData?.videoDetails?.thumbnails?.high?.url, { responseType: 'arraybuffer' });
            // const imageBuffer = Buffer.from(response.data, 'binary');
            const response = await axios.post('http://localhost:3001/proxy', { //@ts-ignore
                url: extractedData?.videoDetails?.thumbnails?.high?.url
            })
            console.log(response)
            //@ts-ignore
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            // const signer = await primaryWallet?.getSigner();

            // const contractAddress = "0xfd590B760B58733488513e5E4b75130D54Cdc9f8";
            const contractAddress = "0xd8cf9a5f6cd7b518e75427b779e4cc0b5353ba47"
      
            const contract = new ethers.Contract(contractAddress, nftMintAbi, signer);
            const recipientAddress = await signer.getAddress();
            const arrayBufferData = new Uint8Array(response.data.imageBuffer.data);
            const blob = new Blob([arrayBufferData], { type: response.data.contentType });
            const file =  new File([blob], extractYoutubeVideoId(value) + '.' + response.data.contentType.slice(6), { type: response.data.contentType });
            const result = await uploadToPinata(file)
            console.log(result.IpfsHash, result, "result") //@ts-ignore
            // const userAccount = JSON.parse(localStorage.getItem('hederaAccountData'))
            const metadata = await uploadMetadataToPinata(result?.IpfsHash, extractedData, extractYoutubeVideoId(value), recipientAddress);
            const tx = await contract.mintNFT(recipientAddress, metadata);
            console.log(tx)
        }

    
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

      return (
        <div className='w-full relative'>
            <div className={`flex flex-row justify-between items-center p-2 fixed top-0 ${isMobile ? 'w-full' : 'gap-2 w-[85%]'} bg-white`}>
            <input placeholder="Enter Youtube Shorts Link" className='grow p-2 outline outline-1 outline-black rounded-lg' value={value} onChange={handleChange} />
            <button className='outline outline-1 outline-black' onClick={handleFetch}>Fetch</button>
            </div>
            {extractedData && <div className='mt-20 flex flex-col justify-center items-center'> 
                {/* @ts-ignore */}
                <img src={extractedData?.videoDetails?.thumbnails?.high?.url} alt={extractedData?.videoDetails?.title} className={isMobile ? 'w-full' : 'max-w-[450px]'} />
                <div className='flex flex-col text-left p-4'>
                    {/* @ts-ignore */}
                    {extractedData?.result?.length && extractedData?.result?.map((item, index) => {
                        return <div className='flex flex-col p-2' key={index}>
                            <div className='font-bold text-lg'>{index +1}. {item?.name}</div>
                            <div>{item?.mapData?.placePrediction?.text?.text}</div>
                        </div>
                    })}
                </div>
                <button onClick={() => handleUpload()}>Upload & Mint NFT</button>
                </div>}
                {!extractedData && <div style={{ marginTop: "80px" }}>
                  {/* <div>Or</div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className='m-2'
      />
      <button onClick={handleFileUpload} style={{ padding: "5px 15px" }}>
        Upload
      </button> */}
      {/* @ts-ignore */}
      {/* {file && <p>Selected File: {file.name}</p>} */}
    </div>}
                <div className='p-8' />
        </div>
      );
    };