import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Download, Edit, Trash2, AlertTriangle, CheckCircle } from "lucide-react";

export default function DocumentViewer() {
  const [, setLocation] = useLocation();
  const params = useParams<{ type: string }>();
  const documentType = params?.type || 'all';

  // Mock document data - in real app this would come from API
  const documents = {
    license: [
      {
        id: 1,
        name: "Driver's License",
        type: "license",
        fileName: "drivers_license.pdf",
        uploadDate: "2024-01-15",
        expirationDate: "2024-12-31",
        isExpired: true,
        size: "2.1 MB",
        vehicle: "All Vehicles"
      }
    ],
    insurance: [
      {
        id: 2,
        name: "Insurance Policy",
        type: "insurance",
        fileName: "insurance_policy.pdf",
        uploadDate: "2024-02-01",
        expirationDate: "2025-02-01",
        isExpired: false,
        size: "1.8 MB",
        vehicle: "2021 Yamaha MT-07"
      }
    ],
    registration: [
      {
        id: 3,
        name: "Vehicle Registration",
        type: "registration",
        fileName: "vehicle_registration.pdf",
        uploadDate: "2024-03-10",
        expirationDate: "2025-03-10",
        isExpired: false,
        size: "1.2 MB",
        vehicle: "2021 Yamaha MT-07"
      }
    ],
    service: [
      {
        id: 4,
        name: "Last Service Record",
        type: "service",
        fileName: "service_record_2024.pdf",
        uploadDate: "2024-11-15",
        expirationDate: null,
        isExpired: false,
        size: "3.4 MB",
        vehicle: "2021 Yamaha MT-07"
      }
    ]
  };

  const allDocuments = Object.values(documents).flat();
  const filteredDocuments = documentType === 'all' ? allDocuments : documents[documentType as keyof typeof documents] || [];

  const getDocumentIcon = (type: string) => {
    const icons = {
      license: "📋",
      insurance: "🛡️",
      registration: "📋",
      service: "🔧"
    };
    return icons[type as keyof typeof icons] || "📄";
  };

  const getTypeColor = (type: string) => {
    const colors = {
      license: "bg-blue-100 text-blue-800",
      insurance: "bg-green-100 text-green-800",
      registration: "bg-purple-100 text-purple-800",
      service: "bg-orange-100 text-orange-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation("/garage")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">
              {documentType === 'all' ? 'All Documents' : `${documentType.charAt(0).toUpperCase() + documentType.slice(1)} Documents`}
            </h1>
            <p className="text-gray-600">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setLocation("/documents/upload")}
            className="bg-[#FF3B30] hover:bg-[#FF3B30]/90"
          >
            <FileText className="h-4 w-4 mr-2" />
            Upload New Document
          </Button>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600 mb-4">
                  You haven't uploaded any {documentType === 'all' ? '' : documentType} documents yet.
                </p>
                <Button 
                  onClick={() => setLocation("/documents/upload")}
                  className="bg-[#FF3B30] hover:bg-[#FF3B30]/90"
                >
                  Upload Your First Document
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((doc) => (
              <Card key={doc.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getDocumentIcon(doc.type)}</div>
                      <div>
                        <CardTitle className="text-lg">{doc.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={getTypeColor(doc.type)}>
                            {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                          </Badge>
                          <span>•</span>
                          <span>{doc.vehicle}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.expirationDate && (
                        <div className="flex items-center gap-1">
                          {doc.isExpired ? (
                            <>
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <span className="text-red-600 text-sm font-medium">Expired</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 text-sm font-medium">Valid</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">File Name</p>
                      <p className="font-medium">{doc.fileName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Upload Date</p>
                      <p className="font-medium">{new Date(doc.uploadDate).toLocaleDateString()}</p>
                    </div>
                    {doc.expirationDate && (
                      <div>
                        <p className="text-gray-500">Expires</p>
                        <p className={`font-medium ${doc.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                          {new Date(doc.expirationDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500">File Size</p>
                      <p className="font-medium">{doc.size}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}