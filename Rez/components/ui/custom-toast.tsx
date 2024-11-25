import { Toast, ToastProps } from "@/components/ui/toast"
import { X } from 'lucide-react'

export function CustomToast({ className, ...props }: ToastProps) {
  return (
    <Toast className={`${className} p-0 w-full h-full bg-transparent`} {...props}>
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <h2 className="text-4xl font-bold mb-4">{props.title}</h2>
        <p className="text-2xl">{props.description}</p>
      </div>
    </Toast>
  )
}

