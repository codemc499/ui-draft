'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/footer/footer';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'task' | 'reminder';
}

export default function CalendarSchedule() {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Sample events data
  const events: Event[] = [
    { id: 1, title: 'Team Meeting', date: '2024-01-15', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Project Deadline', date: '2024-01-15', time: '2:00 PM', type: 'task' },
    { id: 3, title: 'Client Call', date: '2024-01-16', time: '11:30 AM', type: 'meeting' },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === dateString);

      days.push(
        <div
          key={day}
          className="h-24 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50"
          onClick={() => setSelectedDate(date)}
        >
          <div className="font-medium">{day}</div>
          <div className="space-y-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded ${event.type === 'meeting'
                  ? 'bg-blue-100 text-blue-800'
                  : event.type === 'task'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">

      <div className="bg-white rounded-[24px] border border-[#E1E4EA] p-8">
        <div className="flex items-center gap-4 mb-8">
          <button className="px-4 py-2 text-sm font-medium border-b-2 border-black">
            Default
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            In Progress (8)
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            Approaching (4)
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            Timeout (2)
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            Cancelled (1)
          </button>
        </div>
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-medium">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-4">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Today
            </button>
            <div className="flex space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px">
          {renderCalendar()}
        </div>
      </div>

      {/* Event List */}
      <div className="mt-8 bg-white rounded-[24px] border border-[#E1E4EA] p-8">
        <h3 className="text-xl font-medium mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {events.map(event => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-gray-600 text-sm">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${event.type === 'meeting'
                  ? 'bg-blue-100 text-blue-800'
                  : event.type === 'task'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}
              >
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}