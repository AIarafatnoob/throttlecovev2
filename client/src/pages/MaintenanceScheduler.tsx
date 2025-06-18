import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CalendarDays, Wrench, FileText, Save } from "lucide-react";

const MaintenanceScheduler = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: "",
    description: "",
    cost: "",
    mileage: "",
    notes: ""
  });
  const { toast } = useToast();

  const handleScheduleMaintenance = () => {
    if (!selectedDate || !maintenanceForm.type) {
      toast({
        title: "Missing Information",
        description: "Please select a date and maintenance type.",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    const existingMaintenance = JSON.parse(localStorage.getItem('maintenanceSchedule') || '[]');
    const newMaintenance = {
      id: Date.now(),
      date: selectedDate.toISOString(),
      ...maintenanceForm,
      createdAt: new Date().toISOString()
    };
    
    existingMaintenance.push(newMaintenance);
    localStorage.setItem('maintenanceSchedule', JSON.stringify(existingMaintenance));

    toast({
      title: "Maintenance Scheduled",
      description: `${maintenanceForm.type} scheduled for ${selectedDate.toLocaleDateString()}`,
    });

    // Reset form
    setMaintenanceForm({
      type: "",
      description: "",
      cost: "",
      mileage: "",
      notes: ""
    });
  };

  const maintenanceTypes = [
    "Oil Change",
    "Tire Replacement",
    "Brake Service",
    "Chain Maintenance",
    "Filter Replacement",
    "Spark Plug Replacement",
    "Coolant Service",
    "General Inspection",
    "Custom Service"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#FF3B30] rounded-full">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1A1A1A]">Maintenance Scheduler</h1>
              <p className="text-gray-600">Schedule and track your motorcycle maintenance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Maintenance Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Maintenance Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maintenance-type">Maintenance Type</Label>
                  <select
                    id="maintenance-type"
                    className="flex h-10 w-full rounded-full border border-input bg-background px-3 py-2 text-sm"
                    value={maintenanceForm.type}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, type: e.target.value})}
                  >
                    <option value="">Select maintenance type</option>
                    {maintenanceTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the maintenance work needed..."
                    className="rounded-lg"
                    value={maintenanceForm.description}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cost">Estimated Cost</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="0.00"
                      className="rounded-full"
                      value={maintenanceForm.cost}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, cost: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="12000"
                      className="rounded-full"
                      value={maintenanceForm.mileage}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, mileage: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes or reminders..."
                    className="rounded-lg"
                    value={maintenanceForm.notes}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, notes: e.target.value})}
                  />
                </div>

                <Button 
                  onClick={handleScheduleMaintenance}
                  className="w-full bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Schedule Maintenance
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Maintenance */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No maintenance records found</p>
                <p className="text-sm">Schedule your first maintenance above</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenanceScheduler;