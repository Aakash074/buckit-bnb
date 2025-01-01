/* eslint-disable @typescript-eslint/ban-ts-comment */
// import { useState, useEffect } from 'react';
import { useEffect, useState } from "react";
// import { Interface } from "ethers"; // Direct import in v6
import bucketAbi from "@/contracts/bucketAbi.json";
import { MagicCard } from '@/components/ui/magic-card';
import { ethers } from "ethers";


// const parseUint256 = (value) => {
//   return toBigInt(value);
// };

//@ts-ignore
function transformToCountryGroupedArray(nftLinks) {
    const countryMap = {};
  
    // Loop through each NFT link
    //@ts-ignore
    nftLinks.forEach((nftLink) => {
      const tokenId = nftLink.tokenId.toString();
  
      // Process each bucket in the NFT link
      //@ts-ignore
      nftLink.selectedBuckets.forEach((bucket) => {
        // Extract country from the place field (assuming last part is country)
        const addressParts = bucket.place.split(", ");
        const country = addressParts[addressParts.length - 1];
  
        // Initialize country array if it doesn't exist
        //@ts-ignore
        if (!countryMap[country]) { //@ts-ignore
          countryMap[country] = [];
        }
  
        // Add location info to the country's array
        //@ts-ignore
        countryMap[country].push({
          nftId: tokenId,
          type: bucket.bucketType,
          name: bucket.name,
          address: bucket.place,
          isCompleted: bucket.isCompleted
        });
      });
    });
  
    // Convert map to array format
    return Object.entries(countryMap).map(([country, locations]) => ({
      country, //@ts-ignore
      locations: locations.sort((a, b) => a.name.localeCompare(b.name))
    }));
  }
// function transformToCountryGroupedArray(data) {
//     const countryMap = {};

//     // Loop over each NFT entry
//     //@ts-ignore
//     data.forEach(nftArray => { //@ts-ignore
//         nftArray.forEach(([nftId, locations]) => {
//             // Loop over each location for the current NFT ID
//             //@ts-ignore
//             locations.forEach(([type, name, address]) => {
//                 // Get the last part of the address as the country name
//                 const country = address.split(", ").pop();
// //@ts-ignore
//                 // Initialize the country array if it doesn't exist in the map
//                 if (!countryMap[country]) {//@ts-ignore
//                     countryMap[country] = [];
//                 }
// //@ts-ignore
//                 // Add the location to the country's array
//                 countryMap[country].push({
//                     type,
//                     name,
//                     nftId,
//                     address
//                 });
//             });
//         });
//     });

//     // Convert the countryMap to an array format
//     const countryArray = Object.keys(countryMap).map(country => ({
//         country, //@ts-ignore
//         locations: countryMap[country]
//     }));

//     return countryArray;
// }

//@ts-ignore
export const Bucket = () => {
  const [countries, setCountries] = useState([]);

async function getBucketList() { //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contractAddress = "0x5b506b9595cf06cea8bb8f2ad71ace221441576c"

    const userAddress = await signer.getAddress();

  const contract = new ethers.Contract(contractAddress, bucketAbi, signer);

  const bucketListData = await contract.getUserBucketList(userAddress);
        console.log(bucketListData)


        const finalResult = transformToCountryGroupedArray(bucketListData);
        console.log(finalResult) //@ts-ignore
        setCountries(finalResult);

}

useEffect(() => {
    getBucketList();
},[])

const handleClick = async () => { //@ts-ignore
    const amount = parseInt(Math.random()*1000);
    console.log("Tx done with amount ", amount);

}

    return (
    <div className="w-full h-full flex flex-col text-left p-4">
        <div className="text-xl font-bold">Buckets</div>
        {countries?.map(item => <div className="flex flex-col">
            {/* @ts-ignore */}
            <MagicCard
        className="cursor-pointer flex-col shadow-2xl  p-2 m-2"
        gradientColor={"#D9D9D955"}
      >
        {/* @ts-ignore */}
            <div className="text-lg font-bold">{item?.country}</div> 
            {/* @ts-ignore */}
            {item?.locations?.map((subItem, index) => <div className="flex flex-col p-2">
                <div>{index + 1}. {subItem?.name} ({subItem?.type})</div>
                <div>{subItem?.address}</div>
            </div>)}
            {/* @ts-ignore */}
            <div>{parseInt(Math.random()*1000)} USD</div>
            <div className="w-full text-right cursor-pointer" onClick={handleClick}>Book Now</div>
            </MagicCard>
        </div>)}
    </div>
    );
};