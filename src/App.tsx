import * as React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as ToastPrimitives from '@radix-ui/react-toast'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import LemonLogo from './assets/lemon-logo.png'

// Utility function for class names
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Booking data interface
interface BookingData {
  name: string
  date: Date
  time: string
  guests: number
}

// Custom hook for form state and validation
function useBookingForm() {
  const [formData, setFormData] = React.useState<BookingData>({
    name: '',
    date: new Date(),
                                                              time: '',
                                                              guests: 2,
  })
  const [errors, setErrors] = React.useState<Partial<Record<keyof BookingData, string>>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const validate = () => {
    const newErrors: Partial<Record<keyof BookingData, string>> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
      if (!formData.date) newErrors.date = 'Date is required'
        if (!formData.time) newErrors.time = 'Time is required'
          if (!formData.guests) newErrors.guests = 'Please select number of guests'
            setErrors(newErrors)
            return Object.keys(newErrors).length === 0
  }

  const updateFormData = (field: keyof BookingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return { formData, errors, isSubmitting, setIsSubmitting, updateFormData, validate }
}

// Toast hook
type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>
interface ToastOptions extends Omit<ToastProps, 'open' | 'onOpenChange'> {
  title?: string
  description?: React.ReactNode
  action?: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
}

function useToast() {
  const [toasts, setToasts] = React.useState<ToastOptions[]>([])

  const toast = ({ title, description, action, ...props }: ToastOptions) => {
    setToasts((currentToasts) => [...currentToasts, { title, description, action, ...props }])
  }

  const dismiss = (index: number) => {
    setToasts((currentToasts) => currentToasts.filter((_, i) => i !== index))
  }

  const ToastRenderer = () => (
    <>
    {toasts.map(({ title, description, action, ...props }, index) => (
      <Toast key={index} {...props} open={true} onOpenChange={() => dismiss(index)}>
      {title && <ToastTitle>{title}</ToastTitle>}
      {description && <ToastDescription>{description}</ToastDescription>}
      {action && <ToastAction {...action} />}
      <ToastClose />
      </Toast>
    ))}
    </>
  )

  return { toast, ToastRenderer }
}

// Button component
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full text-base font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lemon/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 transform',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-lemon to-lemon-dark text-white hover:from-lemon-light hover:to-lemon',
          outline: 'border-2 border-lemon bg-transparent text-lemon hover:bg-lemon/10 hover:text-lemon-dark',
      },
      size: {
        default: 'h-12 px-6 py-3',
          sm: 'h-10 px-4 py-2 text-sm',
          lg: 'h-14 px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
      />
    )
  }
)
Button.displayName = 'Button'

// Input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
      className={cn(
        'flex h-12 w-full rounded-lg border-2 border-lemon-light bg-white/90 px-4 py-3 text-base placeholder:text-gray-400/70 focus:outline-none focus:ring-4 focus:ring-lemon/50 focus:border-lemon-dark transition-all duration-300 shadow-md hover:shadow-lg',
        className
      )}
      ref={ref}
      {...props}
      />
    )
  }
)
Input.displayName = 'Input'

// Label component
const Label = React.forwardRef<
React.ElementRef<typeof LabelPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
  ref={ref}
  className={cn('text-lg font-bold text-gray-900 tracking-tight', className)}
  {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

// Toast components
const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Viewport>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
  ref={ref}
  className={cn(
    'fixed top-4 right-4 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-3 p-4 sm:bottom-4 sm:right-4 sm:top-auto md:max-w-md',
    className
  )}
  {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border-2 border-lemon bg-gradient-to-br from-white to-lemon-light/20 p-6 pr-8 shadow-2xl transition-all duration-500 transform data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full hover:scale-105',
                          {
                            variants: {
                              variant: {
                                default: 'border-lemon bg-gradient-to-br from-white to-lemon-light/20 text-gray-900',
                                  destructive: 'border-red-500 bg-red-500/90 text-white',
                              },
                            },
                            defaultVariants: {
                              variant: 'default',
                            },
                          }
)

const Toast = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Root>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Action>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
  ref={ref}
  className={cn(
    'inline-flex h-10 shrink-0 items-center justify-center rounded-lg border-2 border-lemon-light bg-lemon text-white px-4 text-base font-bold transition-all duration-300 hover:bg-lemon-dark hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-lemon/50 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-red-300 group-[.destructive]:bg-red-600 group-[.destructive]:hover:bg-red-700 group-[.destructive]:focus:ring-red-500',
    className
  )}
  {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Close>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
  ref={ref}
  className={cn(
    'absolute right-3 top-3 rounded-full p-1 text-gray-600 opacity-0 transition-all duration-300 hover:text-gray-900 hover:bg-lemon/20 focus:opacity-100 focus:outline-none focus:ring-4 focus:ring-lemon/50 group-hover:opacity-100 group-[.destructive]:text-red-200 group-[.destructive]:hover:text-red-100 group-[.destructive]:hover:bg-red-500/20 group-[.destructive]:focus:ring-red-500',
    className
  )}
  toast-close=""
  {...props}
  >
  <X className="h-6 w-6" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Title>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
  ref={ref}
  className={cn('text-xl font-bold text-gray-900 tracking-tight', className)}
  {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Description>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
  ref={ref}
  className={cn('text-lg opacity-90 text-gray-800', className)}
  {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

// Toaster component
function Toaster() {
  return (
    <ToastProvider>
    <ToastViewport />
    </ToastProvider>
  )
}

// FormInput component
interface FormInputProps {
  label: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  disabled?: boolean
}

function FormInput({ label, id, value, onChange, error, disabled }: FormInputProps) {
  return (
    <div className="space-y-3">
    <Label htmlFor={id} className="text-lg font-bold text-gray-900">
    {label}
    </Label>
    <Input
    id={id}
    value={value}
    onChange={onChange}
    className={cn(
      'border-2',
      error ? 'border-red-500' : 'border-lemon/50 hover:border-lemon',
      'rounded-lg p-3 bg-gradient-to-r from-white to-lemon-light/10 focus:ring-4 focus:ring-lemon/50 focus:border-lemon-dark transition-all duration-300 shadow-md hover:shadow-xl'
    )}
    aria-invalid={!!error}
    aria-describedby={error ? `${id}-error` : undefined}
    disabled={disabled}
    placeholder={`Enter your ${label.toLowerCase()}`}
    />
    {error && (
      <p id={`${id}-error`} className="text-base text-red-600 font-semibold tracking-tight" role="alert">
      {error}
      </p>
    )}
    </div>
  )
}

// DatePicker component
interface DatePickerProps {
  selectedDate: Date
  onChange: (date: Date) => void
  error?: string
  disabled?: boolean
}

function DatePicker({ selectedDate, onChange, error, disabled }: DatePickerProps) {
  const [dateString, setDateString] = React.useState(selectedDate.toISOString().split('T')[0])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    if (!isNaN(newDate.getTime())) {
      setDateString(e.target.value)
      onChange(newDate)
    }
  }

  return (
    <div className="space-y-3">
    <Label htmlFor="date" className="text-lg font-bold text-gray-900">
    Select Date
    </Label>
    <Input
    id="date"
    type="date"
    value={dateString}
    onChange={handleChange}
    className={cn(
      'border-2',
      error ? 'border-red-500' : 'border-lemon/50 hover:border-lemon',
      'rounded-lg p-3 bg-gradient-to-r from-white to-lemon-light/10 focus:ring-4 focus:ring-lemon/50 focus:border-lemon-dark transition-all duration-300 shadow-md hover:shadow-xl'
    )}
    min={new Date().toISOString().split('T')[0]}
    aria-invalid={!!error}
    aria-describedby={error ? 'date-error' : undefined}
    disabled={disabled}
    />
    {error && (
      <p id="date-error" className="text-base text-red-600 font-semibold tracking-tight" role="alert">
      {error}
      </p>
    )}
    </div>
  )
}

// TimeSlotSelector component
interface TimeSlotSelectorProps {
  selectedTime: string
  onSelect: (time: string) => void
  error?: string
  disabled?: boolean
}

function TimeSlotSelector({ selectedTime, onSelect, error, disabled }: TimeSlotSelectorProps) {
  const timeSlots = Array.from({ length: 25 }, (_, i) => {
    const hour = Math.floor(i / 2) + 10
    const minute = i % 2 === 0 ? '00' : '30'
  return `${hour.toString().padStart(2, '0')}:${minute}`
  })

  return (
    <div className="space-y-3">
    <label className="text-lg font-bold text-gray-900">Select Time</label>
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
    {timeSlots.map((time) => (
      <Button
      key={time}
      variant={selectedTime === time ? 'default' : 'outline'}
      className={cn(
        selectedTime === time
        ? 'bg-gradient-to-r from-lemon to-lemon-dark text-white'
        : 'text-lemon hover:bg-lemon/10 hover:text-lemon-dark border-lemon',
        'rounded-full transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105'
      )}
      onClick={() => onSelect(time)}
      disabled={disabled}
      aria-pressed={selectedTime === time}
      >
      {time}
      </Button>
    ))}
    </div>
    {error && (
      <p className="text-base text-red-600 font-semibold tracking-tight" role="alert">
      {error}
      </p>
    )}
    </div>
  )
}

// GuestSelector component
interface GuestSelectorProps {
  selectedGuests: number
  onSelect: (guests: number) => void
  error?: string
  disabled?: boolean
}

function GuestSelector({ selectedGuests, onSelect, error, disabled }: GuestSelectorProps) {
  const guestOptions = [2, 3, 4, 5, '6+']

  return (
    <div className="space-y-3">
    <label className="text-lg font-bold text-gray-900">Number of Guests</label>
    <div className="flex flex-wrap gap-2">
    {guestOptions.map((option) => (
      <Button
      key={option}
      variant={selectedGuests === option ? 'default' : 'outline'}
      className={cn(
        selectedGuests === option
        ? 'bg-gradient-to-r from-lemon to-lemon-dark text-white'
        : 'text-lemon hover:bg-lemon/10 hover:text-lemon-dark border-lemon',
        'rounded-full transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105'
      )}
      onClick={() => onSelect(typeof option === 'string' ? 6 : option)}
      disabled={disabled}
      aria-pressed={selectedGuests === option}
      >
      {option}
      </Button>
    ))}
    </div>
    {error && (
      <p className="text-base text-red-600 font-semibold tracking-tight" role="alert">
      {error}
      </p>
    )}
    </div>
  )
}

// SubmitButton component
interface SubmitButtonProps {
  isSubmitting: boolean
  disabled?: boolean
}

function SubmitButton({ isSubmitting, disabled }: SubmitButtonProps) {
  return (
    <Button
    type="submit"
    className="w-full bg-gradient-to-r from-lemon to-lemon-dark text-white font-bold py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 text-lg"
    disabled={isSubmitting || disabled}
    aria-label="Submit booking request"
    >
    {isSubmitting ? (
      <span className="flex items-center justify-center">
      <svg className="animate-spin h-6 w-6 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      Submitting...
      </span>
    ) : (
      'Book Now'
    )}
    </Button>
  )
}

// BookingForm component
function BookingForm() {
  const { formData, errors, isSubmitting, setIsSubmitting, updateFormData, validate } = useBookingForm()
  const { toast, ToastRenderer } = useToast()
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (validate()) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: 'Booking Confirmed!',
        description: (
          <div className="space-y-3">
          <p className="text-lg">Name: {formData.name}</p>
          <p className="text-lg">Date: {formData.date.toLocaleDateString()}</p>
          <p className="text-lg">Time: {formData.time}</p>
          <p className="text-lg">Guests: {formData.guests}</p>
          </div>
        ),
      })
      setIsSubmitted(true)
    }
    setIsSubmitting(false)
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-8 bg-gradient-to-br from-white to-lemon-light/20 p-8 rounded-2xl shadow-2xl transform transition-all duration-500 hover:shadow-3xl" aria-label="Restaurant booking form">
    <FormInput
    label="Name"
    id="name"
    value={formData.name}
    onChange={(e) => updateFormData('name', e.target.value)}
    error={errors.name}
    disabled={isSubmitted}
    />
    <DatePicker
    selectedDate={formData.date}
    onChange={(date) => updateFormData('date', date)}
    error={errors.date}
    disabled={isSubmitted}
    />
    <TimeSlotSelector
    selectedTime={formData.time}
    onSelect={(time) => updateFormData('time', time)}
    error={errors.time}
    disabled={isSubmitted}
    />
    <GuestSelector
    selectedGuests={formData.guests}
    onSelect={(guests) => updateFormData('guests', guests)}
    error={errors.guests}
    disabled={isSubmitted}
    />
    <SubmitButton isSubmitting={isSubmitting} disabled={isSubmitted} />
    </form>
    <ToastRenderer />
    </>
  )
}

// LogoHeader component
function LogoHeader() {
  return (
    <header className="py-6">
    <img
    src={LemonLogo}
    alt="Little Lemon Restaurant Logo"
    className="w-20 h-20 mx-auto object-contain rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
    />
    </header>
  )
}

// Main App component
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lemon-light/30 via-lemon/10 to-white flex flex-col items-center justify-start">
    <LogoHeader />
    <main className="w-full max-w-md px-4">
    <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8 tracking-tight drop-shadow-md">Reserve at Little Lemon</h1>
    <BookingForm />
    </main>
    <Toaster />
    </div>
  )
}

export default App
