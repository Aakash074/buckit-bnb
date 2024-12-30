/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Client, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, PrivateKey, TopicMessageSubmitTransaction } from '@hashgraph/sdk';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Interface } from 'ethers';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BucketAbi from "../contracts/BucketAbi.json";

const contractId = "0.0.5138175";
const topicId = "0.0.5138179";

//@ts-ignore
export const User = () => {
    const [isMobile, setIsMobile] = useState(false);
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
        const client = Client.forTestnet(); //@ts-ignore
        const userAccount = JSON.parse(localStorage.getItem('hederaAccountData'));
        client.setOperator(userAccount?.accountId, PrivateKey.fromStringDer(userAccount?.accountPvtKey));

        const params = new ContractFunctionParameters() //@ts-ignore
                    .addString(user?.toString())
                    .addString(userAccount?.accountId?.toString());

                    const query = new ContractCallQuery() 
                    .setContractId(contractId)
                    .setGas(100000) 
                    .setFunction(
                        "doesUserFollow",
                        params
                      );

                      const result = await query.execute(client);
                      console.log(result)
                      const contractInterface = new Interface(BucketAbi);
                      const decodedResult = contractInterface.decodeFunctionResult(
                          "doesUserFollow", // Function name
                          result.bytes // Byte array result from Hedera contract call
                        );
                        setFollowing(decodedResult[0])
                    
      }

      async function getFollowingUsers() {
        const client = Client.forTestnet(); //@ts-ignore
        const userAccount = JSON.parse(localStorage.getItem('hederaAccountData'));
        client.setOperator(userAccount?.accountId, PrivateKey.fromStringDer(userAccount?.accountPvtKey));

        const params = new ContractFunctionParameters() //@ts-ignore
                    .addString(userAccount?.accountId?.toString());

                    const query = new ContractCallQuery() 
                    .setContractId(contractId)
                    .setGas(100000) 
                    .setFunction(
                        "getFollowedUsers",
                        params
                      );

                      const result = await query.execute(client);
                      console.log(result)
                      const contractInterface = new Interface(BucketAbi);
                      const decodedResult = contractInterface.decodeFunctionResult(
                          "getFollowedUsers", // Function name
                          result.bytes // Byte array result from Hedera contract call
                        );
                    console.log(decodedResult)
      }

      useEffect(() => {
        checkFollowStatus();
        getFollowingUsers();
      },[])

      async function addRemoveFollower() {
        const client = Client.forTestnet(); //@ts-ignore
        const userAccount = JSON.parse(localStorage.getItem('hederaAccountData'));
        client.setOperator(userAccount?.accountId, PrivateKey.fromStringDer(userAccount?.accountPvtKey));

        const params = new ContractFunctionParameters() //@ts-ignore
                    .addString(user?.toString())
                    .addString(userAccount?.accountId?.toString());

        const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100_000) // Set gas limit appropriately
        .setFunction(
          "followUser",
          params
        ); // Use addString instead of addUint256
            
        console.log(transaction)
            
        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);
        console.log(`Transaction status: ${receipt.status}`);
        const sendResponse = await new TopicMessageSubmitTransaction({
          topicId: topicId,
          message: `${user} is ${following ? 'removed from the' : 'added to'} following list`,
        }).execute(client);
        const getReceipt = await sendResponse.getReceipt(client);
            
        // Get the status of the transaction
        const transactionStatus = getReceipt.status
        console.log("The message transaction status " + transactionStatus.toString())
        setFollowing(!following);
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