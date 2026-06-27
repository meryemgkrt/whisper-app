import { useEffect } from "react";
import  {useAuth, useUser} from "@clerk/clerk-react";
import {useQueryClient} from "@tanstack/react-query";
import { useSocketStore } from "../lib/socket";

export const useSocketConnection = (activeChatId) => {
    const  {getToken , isSignedIn} = useAuth();
    const queryClient = useQueryClient();
    const { socket, connect, disconnect, joinChat, leaveChat } = useSocketStore();

    useEffect(()=>{
        if(!isSignedIn) {
            getToken().then((token)=>{
                if(token) {
                    connect(token, queryClient);
                }
                else {
                    disconnect();
                }
                
            return()=>{
                disconnect();
            }    
            })
        }
    }, [isSignedIn, getToken, connect, disconnect, queryClient]);


    useEffect(()=>{
        if(activeChatId && socket?.connected) {
            joinChat(activeChatId);
        }
        return ()=>{
            if(activeChatId && socket?.connected) {
                leaveChat(activeChatId);
            }
        }
    }, [activeChatId, joinChat, leaveChat, socket]);


}