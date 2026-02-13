import { useState, useEffect } from 'react';
import { useBackendInquiries, type Inquiry } from '@/hooks/useBackendInquiries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Trash2, Mail, Phone } from 'lucide-react';

export default function InquiriesManager() {
  const { inquiries, loading, error, updateInquiryStatus, deleteInquiry } = useBackendInquiries();
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [localError, setLocalError] = useState<string | null>(null);

  const filteredInquiries = filterStatus
    ? inquiries.filter(inq => inq.status === filterStatus)
    : inquiries;

  const handleStatusChange = async (inquiryId: string | number, newStatus: Inquiry['status']) => {
    setLocalError(null);
    const result = await updateInquiryStatus(inquiryId, newStatus);

    if (result.success) {
      // The hook automatically refreshes the inquiries
    } else {
      setLocalError(result.error || 'Failed to update inquiry status');
    }
  };

  const handleDelete = async (inquiryId: string | number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    setLocalError(null);
    const result = await deleteInquiry(inquiryId);

    if (result.success) {
      // The hook automatically refreshes the inquiries
    } else {
      setLocalError(result.error || 'Failed to delete inquiry');
    }
  };

  const handleFilterChange = (status: string | undefined) => {
    setFilterStatus(status);
  };

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  const sourceColors = {
    website: 'bg-green-100 text-green-800',
    whatsapp: 'bg-teal-100 text-teal-800',
    phone: 'bg-orange-100 text-orange-800',
    email: 'bg-blue-100 text-blue-800',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Inquiries</CardTitle>
        <CardDescription>Manage customer inquiries and track interactions</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Errors */}
        {(error || localError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || localError}</AlertDescription>
          </Alert>
        )}

        {/* Filter */}
        <div className="flex gap-2">
          <Select value={filterStatus || ''} onValueChange={(val) => handleFilterChange(val || undefined)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => loadInquiries()} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    No inquiries found
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map(inquiry => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>
                      <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                        <Phone className="w-4 h-4" />
                        {inquiry.phone}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                        <Mail className="w-4 h-4" />
                        {inquiry.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge className={sourceColors[inquiry.source]}>
                        {inquiry.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select value={inquiry.status} onValueChange={(newStatus) => handleStatusChange(inquiry.id, newStatus as Inquiry['status'])}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                      {inquiry.message}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(inquiry.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Statistics */}
        {inquiries.length > 0 && (
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="font-medium text-blue-900">
                {inquiries.filter(i => i.status === 'new').length}
              </div>
              <div className="text-xs text-blue-600">New</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="font-medium text-yellow-900">
                {inquiries.filter(i => i.status === 'contacted').length}
              </div>
              <div className="text-xs text-yellow-600">Contacted</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="font-medium text-purple-900">
                {inquiries.filter(i => i.status === 'qualified').length}
              </div>
              <div className="text-xs text-purple-600">Qualified</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">
                {inquiries.filter(i => i.status === 'closed').length}
              </div>
              <div className="text-xs text-gray-600">Closed</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
