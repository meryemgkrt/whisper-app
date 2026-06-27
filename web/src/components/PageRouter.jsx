import React from 'react'
import {LoaderIcon} from "lucide-react";
const PageRouter = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <LoaderIcon className="animate-spin size-12 text-orange-500" />
    </div>
  )
}

export default PageRouter
