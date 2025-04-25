import React from 'react';
import { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
// Use relative path for the toast hook
import { useToast } from '../hooks/use-toast';

interface AppointmentDialogProps {
  doctorName: string;
  consultationMode: ('Video Consult' | 'In Clinic')[];
}

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({ doctorName, consultationMode }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const handleBooking = () => {
    if (!date) {
      toast({
        variant: 'destructive',
        title: 'Please select a date',
        description: 'You need to select a date for your appointment',
      });
      return;
    }

    toast({
      title: 'Appointment Booked!',
      description: `Your appointment with Dr. ${doctorName} is scheduled for ${format(date, 'PPP')}`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment with Dr. {doctorName}</DialogTitle>
          <DialogDescription>
            Select your preferred date for the appointment.<br />
            Available modes: {consultationMode.join(', ')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border mx-auto"
            disabled={(currentDate) => currentDate < new Date()}
          />
        </div>
        <Button onClick={handleBooking} className="w-full">
          Confirm Booking
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
