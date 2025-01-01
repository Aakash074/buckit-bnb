/* eslint-disable @typescript-eslint/ban-ts-comment */
import { UserCircleIcon } from '@heroicons/react/24/solid';
// import { Interface } from 'ethers';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import bucketAbi from "../contracts/bucketAbi.json";

//@ts-ignore
export const User = () => {
    const [isMobile, setIsMobile] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [following, setFollowing] = useState(false)
    const { user } = useParams();
    console.log(isMobile)

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

      async function checkFollowStatus() {

                    
      }

      async function getFollowingUsers() {

      }

      useEffect(() => {
        checkFollowStatus();
        getFollowingUsers();
      },[])

      async function addRemoveFollower() {
      
        //@ts-ignore
    }

    return (<div className='w-full'>
        <div className='flex flex-row justify-between p-4'>
            <UserCircleIcon  className="size-20 text-blue-500" />
            <div className='flex flex-col grow items-center justify-center'>
                <div className='font-bold'>{user}</div>
                <div onClick={addRemoveFollower}>{following ? 'Unfollow' : 'Follow'}</div>
            </div>
        </div>
        
    </div>)
}