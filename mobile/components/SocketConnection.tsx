import { View, Text } from 'react-native'
import React , {useEffect} from 'react'
import { useAuth } from '@clerk/expo';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../lib/useSocket';

const SocketConnection = () => {
    const {getToken, isSignedIn} = useAuth();
    const queryClient = useQueryClient();
    const connect = useSocket((state) => state.connect);
    const disconnect = useSocket((state) => state.disconnect);

    useEffect(()=>{
        if(isSignedIn){
            getToken().then((token)=>{
                if(token) connect(token, queryClient);

            })
        }else disconnect();

        return ()=>{
            disconnect();
        }
    }, [isSignedIn])
  return null
}

export default SocketConnection