import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type ReviewData = {
  id: number
  title: string
  type: string
  status: string
  assignedTo: string
  startDate: string
  dueDate: string
  priority: string
  compliance: string
  completionRate: number
}

export function SimpleReviewsTable({ data }: { data: ReviewData[] }) {
  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Completion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.title}</TableCell>
                <TableCell>{review.type}</TableCell>
                <TableCell>{review.status}</TableCell>
                <TableCell>{review.assignedTo}</TableCell>
                <TableCell>{review.priority}</TableCell>
                <TableCell>{review.completionRate}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 