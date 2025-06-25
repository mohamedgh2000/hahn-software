import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Trash2, Edit, Plus, Search, Package, Home } from 'lucide-react'
import './App.css'

const API_BASE_URL = 'http://localhost:8080/api'

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

// Header Component
function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hahn Software</h1>
              <p className="text-sm text-muted-foreground">Product Management System</p>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/products">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Products</span>
              </Button>
            </Link>
            <Link to="/products/new">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

// Product List Component
function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [products, searchTerm])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/products`)
      if (response.data.success) {
        setProducts(response.data.data)
        setError('')
      } else {
        setError('Failed to fetch products')
      }
    } catch (err) {
      setError('Error connecting to server. Please make sure the backend is running.')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${id}`)
      if (response.data.success) {
        setProducts(products.filter(p => p.id !== id))
      } else {
        setError('Failed to delete product')
      }
    } catch (err) {
      setError('Error deleting product')
      console.error('Error deleting product:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Product Inventory</h2>
        <Link to="/products/new">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Button>
        </Link>
      </div>

      {error && (
        <Alert className="border-destructive">
          <AlertDescription className="text-destructive">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {product.category && (
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${product.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Stock: {product.quantity}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {product.description || 'No description available'}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Added: {new Date(product.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <Link to={`/products/edit/${product.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchTerm ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first product'
            }
          </p>
          {!searchTerm && (
            <Link to="/products/new">
              <Button>Add Your First Product</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

// Product Form Component
function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (isEditing) {
      fetchProduct()
    }
  }, [id, isEditing])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/products/${id}`)
      if (response.data.success) {
        const product = response.data.data
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          quantity: product.quantity?.toString() || '',
          category: product.category || ''
        })
        setError('')
      } else {
        setError('Product not found')
      }
    } catch (err) {
      setError('Error fetching product')
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required'
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0'
    }
    
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      errors.quantity = 'Quantity cannot be negative'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category.trim()
      }

      let response
      if (isEditing) {
        response = await axios.put(`${API_BASE_URL}/products/${id}`, productData)
      } else {
        response = await axios.post(`${API_BASE_URL}/products`, productData)
      }

      if (response.data.success) {
        navigate('/products')
      } else {
        setError(response.data.message || 'Failed to save product')
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      } else {
        setError(err.response?.data?.message || 'Error saving product')
      }
      console.error('Error saving product:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading product...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
        <p className="text-muted-foreground">
          {isEditing ? 'Update product information' : 'Fill in the details to add a new product'}
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-destructive">
          <AlertDescription className="text-destructive">{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Product Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={validationErrors.name ? 'border-destructive' : ''}
                placeholder="Enter product name"
              />
              {validationErrors.name && (
                <p className="text-sm text-destructive mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                  Price ($) *
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={validationErrors.price ? 'border-destructive' : ''}
                  placeholder="0.00"
                />
                {validationErrors.price && (
                  <p className="text-sm text-destructive mt-1">{validationErrors.price}</p>
                )}
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-foreground mb-2">
                  Quantity *
                </label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className={validationErrors.quantity ? 'border-destructive' : ''}
                  placeholder="0"
                />
                {validationErrors.quantity && (
                  <p className="text-sm text-destructive mt-1">{validationErrors.quantity}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <Input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Enter product category"
              />
            </div>

            <div className="flex items-center justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/products')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default App

