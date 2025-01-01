/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react';
import { useDynamicContext, DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { useNavigate } from 'react-router-dom';
import { TabBar, SideBar } from '@/components';

//@ts-ignore

//@ts-ignore
const ResponsiveLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useDynamicContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function ChainAccount() {
        if (!user) {
            navigate("/")
        } else {
            // if(!localStorage?.getItem('chainAccountData')) {
                // await getOrCreateChainAccount({ user });
            // }
        }
    }
    ChainAccount();

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

  if(isMobile) {
    return (
        <div style={{position: 'relative', display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw'}}>
        <div className='w-full'>
          {children}
        </div>
        <div className="fixed bottom-0 w-full" style={{padding: '0.4rem', backgroundColor: '#bad3ff'}}>
            <TabBar />
        </div>
        <div style={{display: 'none'}}><DynamicWidget/> </div>
        </div>
      );
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw'}}>
    <div style={{display: 'none'}}><DynamicWidget/> </div>
    <div style={{width: '15%', height: '100%', backgroundColor: '#bad3ff'}}><SideBar /></div>
    <div className='overflow-scroll no-scrollbar grow'>
      {children}
    </div>
    </div>
  );
};

export default ResponsiveLayout;