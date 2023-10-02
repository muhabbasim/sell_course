import { ourFileRouter } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@/lib/uploadthing';
import React from 'react'
import toast from 'react-hot-toast';

interface FileUploadProps {
  onChange: (url?: string) => void
  endpoint: keyof typeof ourFileRouter
}

export default function FileUpload({ onChange, endpoint }: FileUploadProps) {
  return (

    <div>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url)
        }}

        onUploadError={(error: Error) => {
          toast.error(`ERROR! ${error?.message}`);
        }}
      />
    </div>
  )
}
