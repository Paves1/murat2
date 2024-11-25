"use client"

import React, { useState } from 'react'
import { addMonths, subMonths, format, isSameDay, isWithinInterval } from 'date-fns'
import { tr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useReservationStore } from '../../store/reservationStore'

interface ReservationCalendarProps {
  selectedRange: { start?: Date; end?: Date }
  onRangeChange: (range: { start?: Date; end?: Date }) => void
  disabledDates: Date[]
}

export function ReservationCalendar({
  selectedRange,
  onRangeChange,
  disabledDates,
}: ReservationCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { getPriceForDate } = useReservationStore()

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1))
  }

  const handleDateClick = (date: Date) => {
    if (!selectedRange.start) {
      onRangeChange({ start: date, end: undefined })
    } else if (!selectedRange.end && date > selectedRange.start) {
      onRangeChange({ ...selectedRange, end: date })
    } else {
      onRangeChange({ start: date, end: undefined })
    }
  }

  const isDateDisabled = (date: Date) => {
    return disabledDates.some(disabledDate => isSameDay(date, disabledDate))
  }

  const isDateSelected = (date: Date) => {
    if (selectedRange.start && selectedRange.end) {
      return isWithinInterval(date, { start: selectedRange.start, end: selectedRange.end })
    }
    return selectedRange.start && isSameDay(date, selectedRange.start)
  }

  const renderCalendar = () => {
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const days = []

    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
      const currentDay = new Date(day)
      const isDisabled = isDateDisabled(currentDay)
      const isSelected = isDateSelected(currentDay)
      const isToday = isSameDay(currentDay, new Date())
      const dailyPrice = getPriceForDate(currentDay)

      days.push(
        <Button
          key={currentDay.toISOString()}
          variant={isSelected ? "default" : "outline"}
          className={`h-16 w-16 p-0 font-normal ${
            isDisabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            isSelected
              ? 'bg-violet-600 text-white hover:bg-violet-700'
              : isToday
              ? 'border-violet-400 text-violet-700'
              : 'hover:bg-violet-100'
          }`}
          onClick={() => !isDisabled && handleDateClick(currentDay)}
          disabled={isDisabled}
        >
          <div className="flex flex-col items-center justify-center">
            <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-700'}`}>
              {format(currentDay, 'd')}
            </span>
            {!isDisabled && (
              <span className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                {dailyPrice.toLocaleString('tr-TR')}₺
              </span>
            )}
          </div>
        </Button>
      )
    }

    return days
  }

  return (
    <Card className="p-4 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={handlePreviousMonth} className="text-violet-600 hover:text-violet-700 hover:bg-violet-100">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold text-violet-800">
          {format(currentDate, 'MMMM yyyy', { locale: tr })}
        </h2>
        <Button variant="outline" onClick={handleNextMonth} className="text-violet-600 hover:text-violet-700 hover:bg-violet-100">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
          <div key={day} className="text-center font-medium text-violet-600">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>
    </Card>
  )
}

