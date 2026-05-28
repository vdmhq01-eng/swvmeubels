import { NextResponse } from 'next/server';
import { currentWeekTimesheet, previousTimesheets } from '@/lib/mock/timesheets';

// GET /api/timesheets?studentId=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');
  const data = [currentWeekTimesheet, ...previousTimesheets];
  const filtered = studentId ? data.filter((t) => t.studentId === studentId) : data;
  return NextResponse.json({ timesheets: filtered });
}
