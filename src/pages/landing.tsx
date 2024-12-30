/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react';
import { useDynamicContext, DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { useNavigate } from 'react-router-dom';
import BuckLogo from '../assets/buckit.jpg'
import RetroGrid from '@/components/ui/retro-grid';
import ShimmerButton from '@/components/ui/shimmer-button';

//@ts-ignore
export const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useDynamicContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
        navigate("/dashboard")
    } else {
        localStorage.removeItem('hederaAccountData');
    }
  }, [user])

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

  console.log(isMobile)

//   if(isMobile) {
//     return (
//         <div style={{position: 'relative', display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw'}}>
//         <div>
//           {children}
//         </div>
//         <div style={{position: 'absolute', bottom: 0, width: '100%', padding: '1rem', backgroundColor: '#bad3ff'}}>
//             Bottoms Tab
//         </div>
//         </div>
//       );
//   }

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}} className='justify-center w-screen items-center relative'>
        <img src={BuckLogo} alt="buck" className='w-full md:max-w-80' />
        <div className='text-xl font-bold'>BUCKIT</div>
        <div className='text-md'>Bucketlist of Travel Inspiration</div>
        <div className='justify-center'>
        <DynamicWidget innerButtonComponent={<ShimmerButton>
        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
          Login / Signup
        </span>
      </ShimmerButton>} />
        </div>
        <RetroGrid />
    </div>
  );
};