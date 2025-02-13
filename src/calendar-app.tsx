import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, Trash } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { Textarea } from "@/components/ui/textarea";

const CalendarApp = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<
    { date: Date; title: string; description: string }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    if (selectedDate && newEventTitle) {
      setEvents([
        ...events,
        {
          date: selectedDate,
          title: newEventTitle,
          description: newEventDescription,
        },
      ]);
      setSelectedDate(null);
      setNewEventTitle("");
      setNewEventDescription("");
    }
  };

  const handleDeleteEvent = (eventIndex: number) => {
    setEvents(events.filter((_, index) => index !== eventIndex));
  };

  return (
    <div className="p-4 flex justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-between">
            <Button variant="ghost" onClick={handlePrevMonth}>
              <CalendarIcon className="mr-2" />
              Prev
            </Button>
            <div>{format(currentMonth, "MMMM yyyy")}</div>
            <Button variant="ghost" onClick={handleNextMonth}>
              Next
              <CalendarIcon className="ml-2" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-bold">
              {day}
            </div>
          ))}
          {daysInMonth.map((day) => (
            <div
              key={day.toString()}
              className={`p-2 border rounded ${
                isSameDay(day, new Date()) ? "bg-blue-100" : ""
              } ${isSameDay(day, selectedDate) ? "bg-gray-100" : ""}`}
              onClick={() => handleDateClick(day)}
            >
              {format(day, "d")}
              {events
                .filter((event) => isSameDay(event.date, day))
                .map((event, index) => (
                  <div key={index} className="mt-1 text-sm">
                    {event.title}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          ))}
        </CardContent>
      </Card>
      {selectedDate && (
        <Dialog
          open={!!selectedDate}
          onOpenChange={() => setSelectedDate(null)}
        >
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
              <DialogDescription>
                Add an event for {format(selectedDate, "MMMM d, yyyy")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CalendarApp;
