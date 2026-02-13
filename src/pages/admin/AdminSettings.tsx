import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveSiteSettings } from "@/lib/siteSettings";

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    businessName: "Wajdan Motors",
    phone: "+92-324-7718001",
    email: "sales@wajdanmotors.com",
    address: "Canal Road, Near McDonald's, Faisalabad, Pakistan",
    whatsappNumber: "923247718001",
    workingHours: "Mon-Sat: 10AM-8PM, Sun: 12PM-6PM",
  });

  // Load saved settings from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wajdan_motors_settings");
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const handleSave = () => {
    saveSiteSettings(settings);
    // notify other components to refresh their view
    try {
      window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { detail: settings }));
    } catch (e) {}
    toast({ title: "Settings Saved", description: "Your changes have been saved." });
  };

  const handleReset = () => {
    if (confirm("This will reset all cars and inquiries data. Are you sure?")) {
      localStorage.removeItem("wajdan_motors_cars");
      localStorage.removeItem("wajdan_motors_inquiries");
      toast({ title: "Data Reset", description: "All data has been reset to defaults." });
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-heading font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your business information</p>
          </motion.div>

          {/* Settings Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 space-y-6"
          >
            <div>
              <Label>Business Name</Label>
              <Input
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>

            <div>
              <Label>WhatsApp Number (without +)</Label>
                <Input
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="923247718001"
              />
            </div>

            <div>
              <Label>Address</Label>
              <Input
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>

            <div>
              <Label>Working Hours</Label>
              <Input
                value={settings.workingHours}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 gap-2">
                <Save className="w-4 h-4" />
                Save Settings
              </Button>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-destructive/5 rounded-2xl border border-destructive/20 p-6"
          >
            <h2 className="font-heading font-bold text-destructive mb-2">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently delete all cars and inquiries data. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All Data
            </Button>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-secondary/30 rounded-2xl border border-border p-6"
          >
            <h2 className="font-heading font-bold mb-2">About This Admin Panel</h2>
            <p className="text-sm text-muted-foreground">
              This is a frontend-only admin panel. All data is stored in your browser's localStorage.
              To make this production-ready with persistent data, you would need to connect a backend database.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
