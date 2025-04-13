import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  MaintenanceRecord, 
  Motorcycle,
  MaintenanceSchedule
} from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MaintenanceCard from "@/components/ui/maintenance/MaintenanceCard";
import ServiceDialog from "@/components/ui/maintenance/ServiceDialog";
import MetricCard from "@/components/ui/dashboard/MetricCard";
import { 
  Wrench, 
  Calendar,
  Check, 
  CalendarDays,
  Plus,
  Bike,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FilterX
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";

const Maintenance = () => {
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<string>("all");
  const [selectedServiceType, setSelectedServiceType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState<number | null>(null);
  const recordsPerPage = 5;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: motorcycles, isLoading: motorcyclesLoading } = useQuery<Motorcycle[]>({
    queryKey: ['/api/motorcycles'],
  });
  
  // Fetch all maintenance records
  const { data: maintenanceRecords, isLoading: recordsLoading } = useQuery<MaintenanceRecord[]>({
    queryKey: ['/api/motorcycles/maintenance-all'],
    queryFn: async () => {
      if (!motorcycles || motorcycles.length === 0) return [];
      
      // Fetch maintenance records for each motorcycle
      const promises = motorcycles.map(motorcycle => 
        fetch(`/api/motorcycles/${motorcycle.id}/maintenance`, { credentials: 'include' })
          .then(res => res.ok ? res.json() : [])
      );
      
      const allRecords = await Promise.all(promises);
      return allRecords.flat();
    },
    enabled: !!motorcycles && motorcycles.length > 0,
  });
  
  // Show loading state while fetching data
  const isLoading = motorcyclesLoading || recordsLoading;
  
  // Filter records based on selected filters
  const filteredRecords = maintenanceRecords?.filter(record => {
    if (selectedMotorcycle !== "all" && record.motorcycleId !== parseInt(selectedMotorcycle)) {
      return false;
    }
    
    if (selectedServiceType !== "all" && record.serviceType !== selectedServiceType) {
      return false;
    }
    
    return true;
  }) || [];
  
  // Sort records by date (newest first)
  const sortedRecords = [...filteredRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  
  // Calculate upcoming maintenance tasks
  const upcomingMaintenance = maintenanceRecords?.filter(record => 
    !record.completed && new Date(record.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
  
  // Get service types for filter
  const serviceTypes = Array.from(new Set(maintenanceRecords?.map(record => record.serviceType) || []));
  
  // Get total and completed services
  const totalServices = maintenanceRecords?.length || 0;
  const completedServices = maintenanceRecords?.filter(record => record.completed).length || 0;
  
  // Handle add service for specific motorcycle
  const handleAddService = (motorcycleId: number) => {
    setSelectedMotorcycleId(motorcycleId);
    setIsServiceDialogOpen(true);
  };
  
  // Handle generic add service
  const handleAddGenericService = () => {
    if (!motorcycles || motorcycles.length === 0) {
      toast({
        title: "No Motorcycles",
        description: "Please add a motorcycle to your garage first.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedMotorcycleId(motorcycles[0].id);
    setIsServiceDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold font-header text-[#1A1A1A]">Maintenance Tracker</h2>
          <p className="text-gray-600">Keep your motorcycles in peak condition</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white"
            onClick={handleAddGenericService}
          >
            <Plus className="h-4 w-4 mr-2" />
            ADD SERVICE RECORD
          </Button>
        </div>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Services"
          value={totalServices}
          icon={<Wrench className="h-5 w-5" />}
          subtextHighlight={`${completedServices}`}
          subtext="completed records"
        />
        
        <MetricCard
          title="Upcoming Maintenance"
          value={upcomingMaintenance.length}
          icon={<Calendar className="h-5 w-5" />}
          iconColor="bg-[#FF3B30]/10 text-[#FF3B30]"
          subtextHighlight={upcomingMaintenance.length > 0 ? "Next:" : "None"}
          subtext={upcomingMaintenance.length > 0 
            ? ` ${upcomingMaintenance[0].serviceType} on ${format(new Date(upcomingMaintenance[0].date), 'MMM d')}`
            : " scheduled"}
        />
        
        <MetricCard
          title="Completion Rate"
          value={totalServices > 0 ? `${Math.round((completedServices / totalServices) * 100)}%` : "0%"}
          icon={<Check className="h-5 w-5" />}
          iconColor="bg-green-100 text-green-600"
          subtext="maintenance completion rate"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Service History */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <CardTitle className="text-xl font-bold font-header">Service History</CardTitle>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0 w-full sm:w-auto">
                <Select value={selectedMotorcycle} onValueChange={setSelectedMotorcycle}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Motorcycles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Motorcycles</SelectItem>
                    {motorcycles?.map(motorcycle => (
                      <SelectItem key={motorcycle.id} value={motorcycle.id.toString()}>
                        {motorcycle.name || `${motorcycle.make} ${motorcycle.model}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {serviceTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {(selectedMotorcycle !== "all" || selectedServiceType !== "all") && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedMotorcycle("all");
                      setSelectedServiceType("all");
                    }}
                    className="hidden sm:flex"
                  >
                    <FilterX className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            
            {isLoading ? (
              <CardContent className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-8 w-8 text-[#007AFF] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-500">Loading service records...</p>
                </div>
              </CardContent>
            ) : paginatedRecords.length === 0 ? (
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wrench className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Service Records Found</h3>
                <p className="text-gray-500 text-center mb-4">
                  {selectedMotorcycle !== "all" || selectedServiceType !== "all" 
                    ? "Try adjusting your filters to see more records"
                    : "Start by adding your first service record"}
                </p>
                {selectedMotorcycle !== "all" || selectedServiceType !== "all" ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedMotorcycle("all");
                      setSelectedServiceType("all");
                    }}
                  >
                    <FilterX className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                ) : (
                  <Button 
                    className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white"
                    onClick={handleAddGenericService}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service Record
                  </Button>
                )}
              </CardContent>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left bg-gray-50">
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Motorcycle</th>
                        <th className="px-6 py-3 font-medium">Service</th>
                        <th className="px-6 py-3 font-medium">Odometer</th>
                        <th className="px-6 py-3 font-medium">Cost</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRecords.map(record => {
                        const motorcycle = motorcycles?.find(m => m.id === record.motorcycleId);
                        return (
                          <tr key={record.id} className="border-b border-gray-200">
                            <td className="px-6 py-4">{format(new Date(record.date), 'MMM d, yyyy')}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded overflow-hidden bg-gray-100">
                                  <img 
                                    src={motorcycle?.imageUrl || `https://source.unsplash.com/random/100x100/?motorcycle,${motorcycle?.make}`} 
                                    alt={motorcycle?.make || "Motorcycle"} 
                                    className="h-full w-full object-cover" 
                                  />
                                </div>
                                <span>{motorcycle ? (motorcycle.name || `${motorcycle.make} ${motorcycle.model}`) : "Unknown"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">{record.serviceType}</td>
                            <td className="px-6 py-4">{record.mileage} miles</td>
                            <td className="px-6 py-4">
                              {record.cost ? `$${(record.cost / 100).toFixed(2)}` : "-"}
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={record.completed 
                                ? "bg-green-100 text-green-700" 
                                : new Date(record.date) < new Date() 
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }>
                                {record.completed 
                                  ? "Completed" 
                                  : new Date(record.date) < new Date() 
                                    ? "Overdue"
                                    : "Scheduled"
                                }
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-gray-500"
                                  onClick={() => {
                                    toast({
                                      title: "View Details",
                                      description: "This feature will be available soon!",
                                    });
                                  }}
                                >
                                  <Calendar className="h-4 w-4" />
                                </Button>
                                {!record.completed && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-green-600"
                                    onClick={() => {
                                      // Mark as complete logic
                                      queryClient.invalidateQueries({ queryKey: ['/api/motorcycles/maintenance-all'] });
                                      toast({
                                        title: "Service Completed",
                                        description: "This service has been marked as complete.",
                                      });
                                    }}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <CardContent className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-500">
                    Showing {paginatedRecords.length} of {filteredRecords.length} records
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        // Simple pagination with always visible first, current, and last page
                        let pageNum;
                        if (totalPages <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage === 1) {
                          pageNum = i + 1;
                        } else if (currentPage === totalPages) {
                          pageNum = totalPages - 2 + i;
                        } else {
                          pageNum = currentPage - 1 + i;
                        }
                        
                        if (pageNum > 0 && pageNum <= totalPages) {
                          return (
                            <Button 
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              className={currentPage === pageNum ? "bg-[#1A1A1A]" : ""}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                        return null;
                      })}
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </>
            )}
          </Card>
        </div>

        {/* Right Column: Upcoming Services and Service Schedule */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold font-header">Upcoming Services</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <svg className="animate-spin h-8 w-8 text-[#007AFF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : upcomingMaintenance.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <CalendarDays className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Services</h3>
                  <p className="text-gray-500 text-center mb-4">
                    You don't have any scheduled maintenance tasks
                  </p>
                  <Button 
                    className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white"
                    onClick={handleAddGenericService}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Service
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {upcomingMaintenance.slice(0, 3).map(record => {
                    const motorcycle = motorcycles?.find(m => m.id === record.motorcycleId);
                    const today = new Date();
                    const recordDate = new Date(record.date);
                    const daysDiff = Math.floor((recordDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
                    
                    return (
                      <div key={record.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{record.serviceType}</h4>
                            <p className="text-sm text-gray-500">
                              {motorcycle ? (motorcycle.name || `${motorcycle.make} ${motorcycle.model}`) : "Unknown"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${
                              daysDiff <= 7 ? "text-[#FF3B30]" : "text-[#007AFF]"
                            }`}>
                              {daysDiff <= 0 
                                ? "Due today" 
                                : daysDiff === 1 
                                  ? "Due tomorrow" 
                                  : `Due in ${daysDiff} days`
                              }
                            </p>
                            <p className="text-xs text-gray-500">{format(recordDate, 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between">
                          <span className="text-sm">
                            {record.cost ? `Estimated cost: $${(record.cost / 100).toFixed(2)}` : ""}
                          </span>
                          <Button 
                            variant="link" 
                            className="text-[#007AFF] p-0 h-auto"
                            onClick={() => {
                              toast({
                                title: "Schedule Service",
                                description: "This feature will be available soon!",
                              });
                            }}
                          >
                            Schedule
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {upcomingMaintenance.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    className="w-full text-[#007AFF]"
                    onClick={() => {
                      toast({
                        title: "View All",
                        description: "Full service calendar coming soon!",
                      });
                    }}
                  >
                    View All Upcoming Services
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold font-header">Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {motorcycles && motorcycles.length > 0 ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Motorcycle</label>
                    <Select value={selectedMotorcycle === "all" ? (motorcycles[0]?.id.toString() || "") : selectedMotorcycle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select motorcycle" />
                      </SelectTrigger>
                      <SelectContent>
                        {motorcycles.map(motorcycle => (
                          <SelectItem key={motorcycle.id} value={motorcycle.id.toString()}>
                            {motorcycle.name || `${motorcycle.make} ${motorcycle.model}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Oil Change</p>
                        <p className="text-xs text-gray-500">Every 3,000 miles or 6 months</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#FF3B30] text-sm">Due soon</p>
                        <p className="text-xs">233 miles left</p>
                      </div>
                    </div>

                    <div className="flex justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Air Filter</p>
                        <p className="text-xs text-gray-500">Every 12,000 miles</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 text-sm">Good</p>
                        <p className="text-xs">9,233 miles left</p>
                      </div>
                    </div>

                    <div className="flex justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Valve Check</p>
                        <p className="text-xs text-gray-500">Every 15,000 miles</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 text-sm">Good</p>
                        <p className="text-xs">12,233 miles left</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <Button 
                    className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white"
                    onClick={() => {
                      toast({
                        title: "Customize Schedule",
                        description: "This feature will be available soon!",
                      });
                    }}
                  >
                    Customize Maintenance Schedule
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Bike className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Motorcycles</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Add a motorcycle to manage its maintenance schedule
                  </p>
                  <Link href="/garage">
                    <Button 
                      className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white"
                    >
                      Go to Garage
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Service Dialog */}
      {selectedMotorcycleId && (
        <ServiceDialog 
          open={isServiceDialogOpen}
          onOpenChange={setIsServiceDialogOpen}
          motorcycleId={selectedMotorcycleId}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['/api/motorcycles/maintenance-all'] });
          }}
        />
      )}
    </div>
  );
};

export default Maintenance;
