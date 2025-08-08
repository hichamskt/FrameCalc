


import { useEffect, useState } from 'react';
import { Search, Filter, Edit2, Trash2, Plus, DollarSign, Package, Ruler, X, Save, AlertTriangle } from 'lucide-react';
import { useGetAlumBars } from '../hooks/alumBar/useGetAlumBars';
import type { AlumBar } from '../types/app';
import { useAlumProfil } from '../hooks/profilesAlum/useAlumProfil';
import { useUpdateAlumBar } from '../hooks/alumBar/useUpdateAlumBar';

// Mock type definition based on your component


function AlumsBars() {
  // Mock data for demonstration
  

  const [products, setProducts] = useState<AlumBar[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [unitTypeFilter, setUnitTypeFilter] = useState<string>('all');
  const [profileNameFilter, setProfileNameFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const {alumBars}=useGetAlumBars();
  const [selectedId,setSelectedId]=useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<AlumBar | null>(null);
  const {allprofiles} = useAlumProfil();
  const {handleUpdate} = useUpdateAlumBar();

  const [formData, setFormData] = useState<AlumBar>({
    profile_material_id:"",
    profile: '',
    name: '',
    reference: '',
    unit_type: 'meter',
    unit_price: '',
    length: '',
    profile_name: '',
    created_at:""
  });


useEffect(() => {
 if (alumBars) {
   const uniqueBars = alumBars.filter(
     (bar, index, self) =>
       index === self.findIndex((b) => b.profile_material_id === bar.profile_material_id)
   );
   setProducts(uniqueBars);
 }
}, [alumBars]);


  
 

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: string): string => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const uniqueUnitTypes = [...new Set(products.map(p => p.unit_type))];
  const uniqueProfileNames = [...new Set(allprofiles.map(p => p.name))];
 
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.profile_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUnitType = unitTypeFilter === 'all' || product.unit_type === unitTypeFilter;
    const matchesProfileName = profileNameFilter === 'all' || product.profile_name === profileNameFilter;

    const price = parseFloat(product.unit_price);
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchesPriceRange = price >= minPrice && price <= maxPrice;

    return matchesSearch && matchesUnitType && matchesProfileName && matchesPriceRange;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setUnitTypeFilter('all');
    setProfileNameFilter('all');
    setPriceRange({ min: '', max: '' });
  };

  const handleDelete = (product: AlumBar) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.profile_material_id !== selectedProduct.profile_material_id));
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };

  const handleEdit = (product: AlumBar) => {
    setSelectedProduct(product);
    setSelectedId(Number(product.profile_material_id))
    setFormData(product);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setFormData({
        profile_material_id:"",
      profile: '',
      name: '',
      reference: '',
      unit_type: 'meter',
      unit_price: '',
      length: '',
      profile_name: '',
      created_at:""
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (isEdit: boolean) => {
    if (isEdit && selectedProduct) {
      setProducts(products.map(p => 
        p.profile_material_id === selectedProduct.profile_material_id 
          ? { ...p, ...formData } as AlumBar
          : p
      ));
      setShowEditModal(false);
      const selectedProfile = allprofiles.find(
  (item) => item.name === formData.profile_name
);

      handleUpdate({
          profile: selectedProfile?.profile_id,
          profile_name: formData.profile_name,
          name: formData.name,
          unit_type: formData.unit_type,
          unit_price: formData.unit_price,
          reference: formData.reference,
          length: formData.length,     
      },selectedId);
    } else {
    
    //   setProducts([...products, newProduct]);
    


      setShowAddModal(false);
    }
    setSelectedProduct(null);
  };

  const closeModals = () => {
    setShowDeleteModal(false);
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  
  const Modal = ({ isOpen, onClose, title, children }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

 
  const ProductForm = ({ onSubmit, isEdit }: { onSubmit: () => void; isEdit: boolean }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Profile</label>
        <input
          type="text"
          value={formData.profile || ''}
          onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          placeholder="Enter profile code"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Reference</label>
        <input
          type="text"
          value={formData.reference || ''}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          placeholder="Enter reference code"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Profile Name</label>
        <select
          value={formData.profile_name || ''}
          onChange={(e) => setFormData({ ...formData, profile_name: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select profile name</option>
          {uniqueProfileNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Unit Type</label>
        <select
          value={formData.unit_type || 'meter'}
          onChange={(e) => setFormData({ ...formData, unit_type: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="meter">Meter</option>
          <option value="piece">Piece</option>
          <option value="kg">Kilogram</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Unit Price</label>
        <input
          type="number"
          step="0.01"
          value={formData.unit_price || ''}
          onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Length</label>
        <input
          type="text"
          value={formData.length || ''}
          onChange={(e) => setFormData({ ...formData, length: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          placeholder="Enter length (e.g., 6m)"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onSubmit}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300"
        >
          <Save className="w-4 h-4 mr-2" />
          {isEdit ? 'Update' : 'Create'}
        </button>
        <button
          onClick={closeModals}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen p-6 relative overflow-hidden"
      style={{ backgroundColor: '#0B1739' }}
    >
     

      <div className="max-w-7xl mx-auto relative z-10">
       
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            Products Management
          </h1>
          <p className="text-gray-400 text-lg">Manage your product catalog with advanced filtering</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, references..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:bg-gray-800/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-3 font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  showFilters 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
              
              <button 
                onClick={handleAdd}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Unit Type</label>
                  <select
                    value={unitTypeFilter}
                    onChange={(e) => setUnitTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all duration-300"
                  >
                    <option value="all">All Types</option>
                    {uniqueUnitTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Profile Name</label>
                  <select
                    value={profileNameFilter}
                    onChange={(e) => setProfileNameFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all duration-300"
                  >
                    <option value="all">All Profiles</option>
                    {uniqueProfileNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Price</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Price</label>
                  <input
                    type="number"
                    placeholder="999.99"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm border-b border-gray-600/50">
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">Profile</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">Unit Type</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">Length</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {filteredProducts.map((product, index) => (
                  <tr 
                    key={product.profile} 
                    className="group hover:bg-gray-800/30 transition-all duration-300 hover:shadow-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {product.profile}
                        </div>
                        <div className="ml-3">
                          <div className="text-xs text-gray-400">Profile</div>
                          <div className="text-sm font-medium text-white">{product.profile_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-sm font-semibold text-white">{product.name}</div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                        {product.reference}
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        product.unit_type === 'meter' 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {product.unit_type}
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-green-400 font-semibold">{formatPrice(product.unit_price)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center text-gray-300">
                        <Ruler className="w-4 h-4 mr-1" />
                        {product.length}
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-400">
                      {product.created_at && formatDate(product.created_at)}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product)}
                          className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-400 text-xl font-medium mb-2">No products found</p>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Products</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Avg Price</p>
                <p className="text-2xl font-bold text-white">
                  {products.length > 0 ? formatPrice((products.reduce((sum, p) => sum + parseFloat(p.unit_price), 0) / products.length).toString()) : '$0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Unit Types</p>
                <p className="text-2xl font-bold text-white">{uniqueUnitTypes.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Ruler className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Filtered Results</p>
                <p className="text-2xl font-bold text-white">{filteredProducts.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Filter className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeModals}
        title="Confirm Delete"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Delete Product</h3>
          <p className="text-gray-400 mb-6">
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              Delete
            </button>
            <button
              onClick={closeModals}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={closeModals}
        title="Add New Product"
      >
        <ProductForm onSubmit={() => handleFormSubmit(false)} isEdit={false} />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeModals}
        title="Edit Product"
      >
        <ProductForm onSubmit={() => handleFormSubmit(true)} isEdit={true} />
      </Modal>
    </div>
  );
}

export default AlumsBars;