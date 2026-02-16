import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useBackendInquiries, type Inquiry } from "@/hooks/useBackendInquiries";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Trash2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminInquiries() {
  const { inquiries, loading, updateInquiryStatus, deleteInquiry } = useBackendInquiries();
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredInquiries = filter === "all" 
    ? inquiries 
    : inquiries.filter((i) => i.status === filter);

  const handleStatusChange = async (id: string | number, status: Inquiry['status']) => {
    const result = await updateInquiryStatus(id, status);
    if (result.success) {
      toast({ title: "Status Updated", description: `Inquiry marked as ${status}` });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      const result = await deleteInquiry(id);
      if (result.success) {
        toast({ title: "Inquiry Deleted" });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(`Assalam o Alaikum ${name}, regarding your inquiry at Bloodline Motors...`);
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-heading font-bold">Inquiries</h1>
              <p className="text-muted-foreground">
                {inquiries.filter((i) => i.status === "new").length} new inquiries
              </p>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Inquiries</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Loading State */}
          {loading && <p className="text-muted-foreground">Loading inquiries...</p>}

          {/* Inquiries List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredInquiries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-2xl border border-border p-12 text-center"
                >
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No inquiries found</p>
                </motion.div>
              ) : (
                filteredInquiries.map((inquiry, index) => (
                  <motion.div
                    key={inquiry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card rounded-2xl border border-border p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {inquiry.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold">{inquiry.name}</h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  inquiry.status === "new"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : inquiry.status === "contacted"
                                    ? "bg-yellow-500/10 text-yellow-500"
                                    : "bg-green-500/10 text-green-500"
                                }`}
                              >
                                {inquiry.status}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Interested in: <span className="text-foreground font-medium">{inquiry.car_name}</span>
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">{inquiry.message}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {inquiry.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {inquiry.email}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDate(inquiry.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                        <Select
                          value={inquiry.status}
                          onValueChange={(v) => handleStatusChange(inquiry.id, v as Inquiry['status'])}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleWhatsApp(inquiry.phone, inquiry.name)}
                            className="gap-1"
                          >
                            <MessageSquare className="w-4 h-4" />
                            WhatsApp
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(inquiry.id)}
                            className="text-destructive hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
