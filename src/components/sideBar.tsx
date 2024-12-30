/* eslint-disable @typescript-eslint/ban-ts-comment */
// import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { useNavigate } from 'react-router-dom';
import { BellAlertIcon, HomeIcon, PlusCircleIcon, QueueListIcon, UserIcon } from '@heroicons/react/24/solid';

//@ts-ignore
export const SideBar = () => {
//   const [showProfile, setShowProfile] = useState(false);
  const { setShowDynamicUserProfile, showDynamicUserProfile } = useDynamicContext();
  const navigate = useNavigate();

  return (
    <div className='divide-y-[1px] divide-blue-500 justify-center' style={{display: 'flex', flexDirection: 'column',}}>
        <div onClick={() => navigate("/dashboard")} className='flex flex-row items-center gap-2 p-4 cursor-pointer'><HomeIcon className="size-6 text-blue-500" /><div>Home</div></div>
        <div onClick={() => navigate("/bucket")} className='flex flex-row items-center gap-2 p-4 cursor-pointer'><QueueListIcon className="size-6 text-blue-500" /><div>Bucket</div></div>
        <div onClick={() => navigate("/upload")} className='flex flex-row items-center gap-2 p-4 cursor-pointer'><PlusCircleIcon className="size-6 text-blue-500" /><div>Upload</div></div>
        <div onClick={() => navigate("/alerts")} className='flex flex-row items-center gap-2 p-4 cursor-pointer'><BellAlertIcon className="size-6 text-blue-500" /><div>Alerts</div></div>
        <div onClick={() => setShowDynamicUserProfile(!showDynamicUserProfile)} className='flex flex-row items-center gap-2 p-4 cursor-pointer'><UserIcon className="size-6 text-blue-500" /><div>Profile</div></div>
    </div>
  );
};