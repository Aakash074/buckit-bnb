/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react';
import { useDynamicContext, DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { useNavigate } from 'react-router-dom';
import { TabBar, SideBar } from '../components';
import {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    Hbar
  } from "@hashgraph/sdk";

// Initialize your Hedera client
const client = Client.forTestnet(); // @ts-ignore
console.log(import.meta.env.VITE_HEDERA_TESTNET_ACCOUNT_ID, import.meta.env.VITE_HEDERA_TESTNET_PRIVATE_KEY, "accounts");
//@ts-ignore
client.setOperator(import.meta.env.VITE_HEDERA_TESTNET_ACCOUNT_ID, import.meta.env.VITE_HEDERA_TESTNET_PRIVATE_KEY);

//@ts-ignore
const getOrCreateHederaAccount = async ({ user }) => {
    try {
        console.log(user)
    //   const accountPrivateKey = PrivateKey.generateECDSA();
    //   console.log(accountPrivateKey, accountPrivateKey?.publicKey, accountPrivateKey?.publicKey?.toEvmAddress())
  
        const accountPrivateKey = PrivateKey.generateED25519();
      const response = await new AccountCreateTransaction()
        .setInitialBalance(new Hbar(50)) // Set initial balance to 5 Hbar
        .setKey(accountPrivateKey)
        .execute(client);
      
      const receipt = await response.getReceipt(client);
      
      // Store accountId and privateKey as a JSON string in local storage
      const accountData = { //@ts-ignore
        accountId: receipt.accountId.toString(),
        accountPvtKey: accountPrivateKey.toString(), // Convert to string for storage
      };
      
      localStorage.setItem('hederaAccountData', JSON.stringify(accountData));
      
    //   return accountData; // Return the account data
    } catch (error) {
      console.error("Error creating Hedera account:", error);
      throw error; // Optional: propagate the error for further handling
    }
  };

//@ts-ignore
const ResponsiveLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useDynamicContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function HederaAccount() {
        if (!user) {
            navigate("/")
        } else {
            if(!localStorage?.getItem('hederaAccountData')) {
                await getOrCreateHederaAccount({ user });
            }
        }
    }
    HederaAccount();

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