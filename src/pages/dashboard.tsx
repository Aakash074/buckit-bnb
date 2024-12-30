/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react';
import { fetchMintedNFTs } from "@/lib/fetchNFT";
import YouTubeEmbed from "../components/youtubePlayer";

//@ts-ignore
export const Dashboard = () => {
//   const [showProfile, setShowProfile] = useState(false);
const [pageToken, setPageToken] = useState("")
const [content, setContent] = useState([]);

async function fetchingNFT() {
    const result = await fetchMintedNFTs(pageToken); //@ts-ignore
    setPageToken(result?.next) //@ts-ignore
    if(result?.nfts?.length) { //@ts-ignore
        setContent(prevContent => [...prevContent, ...result?.nfts]);
    }
}

useEffect(() => {
    fetchingNFT()
}, [])

  return (
    <div className='w-full'>
        <div className='w-full' style={{ overflowY: 'auto', height: '100vh' }}>
        {content?.map((item, index) => {
            console.log(item)
            return <div key={index} className='w-full' style={{ height: '100vh', overflow: 'hidden' }}>
                <YouTubeEmbed //@ts-ignore
                    videoId={item?.metadata?.properties?.videoId} //@ts-ignore
                    buckets={item?.metadata?.properties?.buckets}//@ts-ignore
                    creator={item?.metadata?.properties?.creator} //@ts-ignore
                    description={item?.metadata?.description} //@ts-ignore
                    nftAddress={item?.token_id}
                />
            </div>
        })}
        <button onClick={() => fetchingNFT()}>Fetch More</button>
        </div>
        <div className='p-8' />
    </div>
  );
};