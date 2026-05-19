import { View, Text } from 'react-native'
import React from 'react'
import { Message } from '../types'

type MessageBubbleProps = {
  message: Message
  isFromMe: boolean
}

const MessageBubble = ({ message, isFromMe }: MessageBubbleProps) => {
  const time = new Date(message.createdAt).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <View className={`max-w-[78%] mb-1 ${isFromMe ? "self-end items-end" : "self-start items-start"}`}>

      <View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        }}
        className={`px-4 py-3 ${
          isFromMe
            ? "bg-primary rounded-t-2xl rounded-bl-2xl rounded-br-md"
            : "bg-surface-card rounded-t-2xl rounded-br-2xl rounded-bl-md"
        }`}
      >
        <Text
          className={`text-sm leading-[22px] ${
            isFromMe ? "text-primary-foreground" : "text-foreground"
          }`}
        >
          {message.text}
        </Text>

        <Text
          className={`text-[10px] mt-1 text-right ${
            isFromMe ? "text-primary-foreground/60" : "text-muted-foreground"
          }`}
        >
          {time}
        </Text>
      </View>
    </View>
  )
}

export default MessageBubble