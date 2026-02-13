import { useState, useEffect, useCallback } from 'react';
import useBackendOrders from '@/hooks/useBackendOrders';
import { OrderWithDetails } from '@/hooks/useBackendOrders';
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
import { AlertCircle, Trash2, Eye } from 'lucide-react';

export default function OrdersManager() {
  const { getAllOrders, updateOrderStatus, deleteOrder, loading, error } = useBackendOrders();

  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);

  const loadOrders = useCallback(async () => {
    setLocalError(null);
    const data = await getAllOrders(filterStatus);
    setOrders(data);
  }, [getAllOrders, filterStatus]);

  // Load orders on mount and when filters change
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId: string, newStatus: 'pending' | 'approved' | 'rejected' | 'completed') => {
    setLocalError(null);
    const result = await updateOrderStatus(orderId, newStatus);

    if (result) {
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } else {
      setLocalError('Failed to update order status');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    setLocalError(null);
    const success = await deleteOrder(orderId);

    if (success) {
      setOrders(orders.filter(order => order.id !== orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } else {
      setLocalError('Failed to delete order');
    }
  };

  const handleFilterChange = async (status: string | undefined) => {
    setFilterStatus(status);
    setSelectedOrder(null);
    await getAllOrders(status);
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  const typeColors = {
    purchase: 'bg-purple-100 text-purple-800',
    financing: 'bg-orange-100 text-orange-800',
    booking: 'bg-cyan-100 text-cyan-800',
    null: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Track and manage all customer orders</CardDescription>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => loadOrders()} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        {order.vehicle ? (
                          <div>
                            <div className="font-medium">{order.vehicle.title}</div>
                            <div className="text-xs text-gray-500">
                              {order.vehicle.brand} {order.vehicle.model}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.user ? (
                          <div>
                            <div className="font-medium">{order.user.full_name}</div>
                            <div className="text-xs text-gray-500">{order.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.order_type && (
                          <Badge className={typeColors[order.order_type as keyof typeof typeColors]}>
                            {order.order_type}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        PKR {order.total_amount?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Select value={order.status} onValueChange={(newStatus) => handleStatusChange(order.id, newStatus as 'pending' | 'approved' | 'rejected' | 'completed')}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(order.id)}
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
          {orders.length > 0 && (
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="font-medium text-yellow-900">
                  {orders.filter(o => o.status === 'pending').length}
                </div>
                <div className="text-xs text-yellow-600">Pending</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-medium text-green-900">
                  {orders.filter(o => o.status === 'approved').length}
                </div>
                <div className="text-xs text-green-600">Approved</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="font-medium text-red-900">
                  {orders.filter(o => o.status === 'rejected').length}
                </div>
                <div className="text-xs text-red-600">Rejected</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-medium text-blue-900">
                  {orders.filter(o => o.status === 'completed').length}
                </div>
                <div className="text-xs text-blue-600">Completed</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details */}
      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)} className="absolute right-4 top-4">
              ✕
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Order ID</label>
                <p className="text-sm text-gray-600 font-mono">{selectedOrder.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Badge className={statusColors[selectedOrder.status]}>
                  {selectedOrder.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Total Amount</label>
                <p className="text-sm text-gray-600">PKR {selectedOrder.total_amount?.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Down Payment</label>
                <p className="text-sm text-gray-600">
                  {selectedOrder.down_payment ? `PKR ${selectedOrder.down_payment.toLocaleString()}` : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Order Type</label>
                <p className="text-sm text-gray-600">{selectedOrder.order_type || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <p className="text-sm text-gray-600">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
            </div>

            {selectedOrder.notes && (
              <div>
                <label className="text-sm font-medium">Notes</label>
                <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
              </div>
            )}

            {selectedOrder.user && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Name</label>
                    <p>{selectedOrder.user.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Email</label>
                    <p>{selectedOrder.user.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Phone</label>
                    <p>{selectedOrder.user.phone_number || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedOrder.vehicle && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Vehicle Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Title</label>
                    <p>{selectedOrder.vehicle.title}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Model</label>
                    <p>{selectedOrder.vehicle.brand} {selectedOrder.vehicle.model}</p>
                  </div>
                  <div colSpan={2}>
                    <label className="block text-xs font-medium text-gray-600">Listed Price</label>
                    <p>PKR {selectedOrder.vehicle.price?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
