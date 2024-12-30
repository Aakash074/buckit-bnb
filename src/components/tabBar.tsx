/* eslint-disable @typescript-eslint/ban-ts-comment */
// import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { useNavigate } from 'react-router-dom';
import { BellAlertIcon, HomeIcon, PlusCircleIcon, QueueListIcon, UserIcon } from '@heroicons/react/24/solid';

//@ts-ignore
export const TabBar = () => {
//   const [showProfile, setShowProfile] = useState(false);
  const { setShowDynamicUserProfile, showDynamicUserProfile } = useDynamicContext();
  const navigate = useNavigate();

  return (
    <div className='flex flex-row justify-evenly items-center gap-1 py-2'>
        <div onClick={() => navigate("/dashboard")}><HomeIcon className="size-6 text-blue-500" /></div>
        <div onClick={() => navigate("/bucket")}><QueueListIcon className="size-6 text-blue-500" /></div>
        <div onClick={() => navigate("/upload")}><PlusCircleIcon className="size-8 text-blue-500" /></div>
        <div onClick={() => navigate("/alerts")}><BellAlertIcon className="size-6 text-blue-500" /></div>
        <div onClick={() => setShowDynamicUserProfile(!showDynamicUserProfile)}><UserIcon className="size-6 text-blue-500" /></div>
    </div>
  );
};