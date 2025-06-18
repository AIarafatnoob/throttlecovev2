import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { motion } from "framer-motion";

interface Vehicle {
  id: number;
  name: string;
  brand: string;
  year: number;
  engine: string;
  type: string;
  price: string;
  image: string;
  features: string[];
  description: string;
}

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  image: string;
  tags: string[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  features: string[];
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState("vehicles");
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Vehicle form state
  const [vehicleForm, setVehicleForm] = useState({
    name: "",
    brand: "",
    year: new Date().getFullYear(),
    engine: "",
    type: "Sport",
    price: "",
    image: "",
    features: "",
    description: ""
  });

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    image: "",
    tags: ""
  });

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    features: "",
    inStock: true
  });

  // Mock data queries (in real app these would be API calls)
  const { data: vehicles = [] } = useQuery({
    queryKey: ['/api/admin/vehicles'],
    queryFn: () => Promise.resolve([])
  });

  const { data: blogs = [] } = useQuery({
    queryKey: ['/api/admin/blogs'],
    queryFn: () => Promise.resolve([])
  });

  const { data: products = [] } = useQuery({
    queryKey: ['/api/admin/products'],
    queryFn: () => Promise.resolve([])
  });

  // Vehicle mutations
  const addVehicleMutation = useMutation({
    mutationFn: async (vehicle: any) => {
      // In real app, this would be an API call
      return Promise.resolve({ ...vehicle, id: Date.now() });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Vehicle added successfully" });
      setVehicleForm({
        name: "",
        brand: "",
        year: new Date().getFullYear(),
        engine: "",
        type: "Sport",
        price: "",
        image: "",
        features: "",
        description: ""
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vehicles'] });
    }
  });

  const addBlogMutation = useMutation({
    mutationFn: async (blog: any) => {
      return Promise.resolve({ ...blog, id: Date.now(), publishedAt: new Date().toISOString() });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Blog post published successfully" });
      setBlogForm({
        title: "",
        content: "",
        excerpt: "",
        author: "",
        image: "",
        tags: ""
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blogs'] });
    }
  });

  const addProductMutation = useMutation({
    mutationFn: async (product: any) => {
      return Promise.resolve({ ...product, id: Date.now() });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Product added successfully" });
      setProductForm({
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "",
        features: "",
        inStock: true
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
    }
  });

  const handleAddVehicle = () => {
    const vehicle = {
      ...vehicleForm,
      features: vehicleForm.features.split(',').map(f => f.trim()).filter(f => f)
    };
    addVehicleMutation.mutate(vehicle);
  };

  const handleAddBlog = () => {
    const blog = {
      ...blogForm,
      tags: blogForm.tags.split(',').map(t => t.trim()).filter(t => t)
    };
    addBlogMutation.mutate(blog);
  };

  const handleAddProduct = () => {
    const product = {
      ...productForm,
      features: productForm.features.split(',').map(f => f.trim()).filter(f => f)
    };
    addProductMutation.mutate(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Admin Panel</h1>
          <p className="text-gray-600 mb-8">Manage vehicles, blog posts, and products</p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Vehicle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vehicle-name">Vehicle Name</Label>
                      <Input
                        id="vehicle-name"
                        value={vehicleForm.name}
                        onChange={(e) => setVehicleForm({...vehicleForm, name: e.target.value})}
                        placeholder="e.g., Yamaha YZF-R1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicle-brand">Brand</Label>
                      <Input
                        id="vehicle-brand"
                        value={vehicleForm.brand}
                        onChange={(e) => setVehicleForm({...vehicleForm, brand: e.target.value})}
                        placeholder="e.g., Yamaha"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicle-year">Year</Label>
                      <Input
                        id="vehicle-year"
                        type="number"
                        value={vehicleForm.year}
                        onChange={(e) => setVehicleForm({...vehicleForm, year: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicle-engine">Engine</Label>
                      <Input
                        id="vehicle-engine"
                        value={vehicleForm.engine}
                        onChange={(e) => setVehicleForm({...vehicleForm, engine: e.target.value})}
                        placeholder="e.g., 998cc"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicle-type">Type</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={vehicleForm.type}
                        onChange={(e) => setVehicleForm({...vehicleForm, type: e.target.value})}
                      >
                        <option value="Sport">Sport</option>
                        <option value="Touring">Touring</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Cruiser">Cruiser</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="vehicle-price">Price</Label>
                      <Input
                        id="vehicle-price"
                        value={vehicleForm.price}
                        onChange={(e) => setVehicleForm({...vehicleForm, price: e.target.value})}
                        placeholder="e.g., $17,999"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="vehicle-image">Image URL</Label>
                    <Input
                      id="vehicle-image"
                      value={vehicleForm.image}
                      onChange={(e) => setVehicleForm({...vehicleForm, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle-features">Features (comma-separated)</Label>
                    <Input
                      id="vehicle-features"
                      value={vehicleForm.features}
                      onChange={(e) => setVehicleForm({...vehicleForm, features: e.target.value})}
                      placeholder="Track Ready, Quick Shifter, Traction Control"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle-description">Description</Label>
                    <Textarea
                      id="vehicle-description"
                      value={vehicleForm.description}
                      onChange={(e) => setVehicleForm({...vehicleForm, description: e.target.value})}
                      placeholder="Detailed description of the vehicle..."
                    />
                  </div>
                  <Button 
                    onClick={handleAddVehicle}
                    className="bg-[#FF3B30] hover:bg-[#FF3B30]/90"
                    disabled={addVehicleMutation.isPending}
                  >
                    {addVehicleMutation.isPending ? "Adding..." : "Add Vehicle"}
                  </Button>
                </CardContent>
              </Card>

              {/* Vehicle List */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Vehicles ({vehicles.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {vehicles.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No vehicles added yet</p>
                  ) : (
                    <div className="grid gap-4">
                      {vehicles.map((vehicle: Vehicle) => (
                        <div key={vehicle.id} className="border rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{vehicle.name}</h3>
                            <p className="text-sm text-gray-600">{vehicle.brand} • {vehicle.year} • {vehicle.type}</p>
                            <p className="text-lg font-bold text-[#FF3B30]">{vehicle.price}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blog Posts Tab */}
            <TabsContent value="blogs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Blog Post
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="blog-title">Title</Label>
                    <Input
                      id="blog-title"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                      placeholder="Blog post title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="blog-excerpt">Excerpt</Label>
                    <Textarea
                      id="blog-excerpt"
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                      placeholder="Brief description of the blog post..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="blog-content">Content</Label>
                    <Textarea
                      id="blog-content"
                      className="min-h-[200px]"
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                      placeholder="Full blog post content..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="blog-author">Author</Label>
                      <Input
                        id="blog-author"
                        value={blogForm.author}
                        onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                        placeholder="Author name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="blog-image">Featured Image URL</Label>
                      <Input
                        id="blog-image"
                        value={blogForm.image}
                        onChange={(e) => setBlogForm({...blogForm, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="blog-tags">Tags (comma-separated)</Label>
                    <Input
                      id="blog-tags"
                      value={blogForm.tags}
                      onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                      placeholder="motorcycles, racing, maintenance"
                    />
                  </div>
                  <Button 
                    onClick={handleAddBlog}
                    className="bg-[#FF3B30] hover:bg-[#FF3B30]/90"
                    disabled={addBlogMutation.isPending}
                  >
                    {addBlogMutation.isPending ? "Publishing..." : "Publish Blog Post"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Product
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input
                        id="product-name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="e.g., Racing Helmet"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-category">Category</Label>
                      <Input
                        id="product-category"
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        placeholder="e.g., Safety Gear"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-price">Price</Label>
                      <Input
                        id="product-price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                        placeholder="299.99"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="product-inStock"
                        checked={productForm.inStock}
                        onChange={(e) => setProductForm({...productForm, inStock: e.target.checked})}
                      />
                      <Label htmlFor="product-inStock">In Stock</Label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea
                      id="product-description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      placeholder="Product description..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-image">Image URL</Label>
                    <Input
                      id="product-image"
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      placeholder="https://example.com/product-image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-features">Features (comma-separated)</Label>
                    <Input
                      id="product-features"
                      value={productForm.features}
                      onChange={(e) => setProductForm({...productForm, features: e.target.value})}
                      placeholder="Lightweight, DOT Certified, Anti-Fog Visor"
                    />
                  </div>
                  <Button 
                    onClick={handleAddProduct}
                    className="bg-[#FF3B30] hover:bg-[#FF3B30]/90"
                    disabled={addProductMutation.isPending}
                  >
                    {addProductMutation.isPending ? "Adding..." : "Add Product"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;