const { formatLocalDateTime, parseLocalDateTime } = require("./datetime");

const HOURS = {
  CAO: 24,
  TRUNG_BINH: 72,
  THAP: 120
};

function isWorkingDay(date) {
  return date.getDay() !== 0;
}

function addWorkingHours(start, hours) {
  const cursor = new Date(parseLocalDateTime(start));
  let remaining = hours;
  while (remaining > 0) {
    cursor.setHours(cursor.getHours() + 1);
    if (isWorkingDay(cursor)) {
      remaining -= 1;
    }
  }
  return cursor;
}

function computeDueDate(receivedAt, priority) {
  const hours = HOURS[priority];
  if (!hours) {
    return null;
  }
  return addWorkingHours(receivedAt, hours);
}

function computeDueDateIso(receivedAt, priority) {
  const due = computeDueDate(receivedAt, priority);
  return due ? formatLocalDateTime(due) : null;
}

function isOverdue(dueDate, now) {
  if (!dueDate) {
    return false;
  }
  return new Date(dueDate).getTime() <= new Date(now).getTime();
}

module.exports = { HOURS, computeDueDate, computeDueDateIso, isOverdue };
