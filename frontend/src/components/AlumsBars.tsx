


import  { useState } from 'react';
import { Search, Filter, Edit2, Trash2, Plus, DollarSign, Package, Ruler } from 'lucide-react';

interface Product {
  profile: number;
  profile_name: string;
  name: string;
  unit_type: string;
  unit_price: string;
  reference: string;
  length: string;
  created_at: string;
}

function AlumsBars() {
  const [products, setProducts] = useState<Product[]>([
    {
      profile: 25,
      profile_name: "op",
      name: "Aluminum pctbc",
      unit_type: "meter",
      unit_price: "24.99",
      reference: "1002",
      length: "2.50",
      created_at: "2025-08-07T11:47:00.629617Z"
    },
    {
      profile: 26,
      profile_name: "premium",
      name: "Steel Frame ABC",
      unit_type: "piece",
      unit_price: "45.50",
      reference: "1003",
      length: "3.00",
      created_at: "2025-08-06T09:30:00.629617Z"
    },
    {
      profile: 27,
      profile_name: "standard",
      name: "Copper Wire XYZ",
      unit_type: "meter",
      unit_price: "12.75",
      reference: "1004",
      length: "10.00",
      created_at: "2025-08-05T14:15:00.629617Z"
    }
  ]);

 
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [unitTypeFilter, setUnitTypeFilter] = useState<string>('all');
  const [profileNameFilter, setProfileNameFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState<boolean>(false);

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
  const uniqueProfileNames = [...new Set(products.map(p => p.profile_name))];

 
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

  return (
    <div
      className="min-h-screen p-6 relative overflow-hidden"
      style={{ backgroundColor: '#0B1739' }}
    >
    
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
      
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            Products Management
          </h1>
          <p className="text-gray-400 text-lg">Manage your product catalog with advanced filtering</p>
        </div>

       
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
              
              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>

         
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
                      {formatDate(product.created_at)}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25">
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
                  {formatPrice((products.reduce((sum, p) => sum + parseFloat(p.unit_price), 0) / products.length).toString())}
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
    </div>
  );
};


export default AlumsBars
