import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, Filter, CreditCard, TrendingUp, Users, DollarSign, Package, ChevronDown, ArrowUpRight, ArrowDownRight, X, RefreshCw } from 'lucide-react';
import './App.css';
import './index.css';
// Sample data - expanded with more months and categories for filtering
const initialSalesData = [
  { month: 'Jan', revenue: 45000, target: 40000, leads: 120, conversion: 28, region: 'North', product: 'Product A', team: 'Team Alpha' },
  { month: 'Feb', revenue: 52000, target: 45000, leads: 145, conversion: 30, region: 'North', product: 'Product B', team: 'Team Beta' },
  { month: 'Mar', revenue: 49000, target: 50000, leads: 160, conversion: 25, region: 'East', product: 'Product A', team: 'Team Gamma' },
  { month: 'Apr', revenue: 63000, target: 55000, leads: 190, conversion: 32, region: 'South', product: 'Product C', team: 'Team Alpha' },
  { month: 'May', revenue: 59000, target: 60000, leads: 210, conversion: 27, region: 'West', product: 'Product B', team: 'Team Beta' },
  { month: 'Jun', revenue: 75000, target: 65000, leads: 230, conversion: 33, region: 'East', product: 'Product A', team: 'Team Gamma' },
  { month: 'Jul', revenue: 69000, target: 70000, leads: 200, conversion: 35, region: 'North', product: 'Product D', team: 'Team Alpha' },
  { month: 'Aug', revenue: 83000, target: 75000, leads: 245, conversion: 36, region: 'West', product: 'Product C', team: 'Team Beta' },
  { month: 'Sep', revenue: 79000, target: 80000, leads: 260, conversion: 31, region: 'South', product: 'Product A', team: 'Team Gamma' },
  { month: 'Oct', revenue: 92000, target: 85000, leads: 280, conversion: 37, region: 'East', product: 'Product D', team: 'Team Alpha' },
  { month: 'Nov', revenue: 88000, target: 90000, leads: 270, conversion: 34, region: 'North', product: 'Product B', team: 'Team Beta' },
  { month: 'Dec', revenue: 105000, target: 95000, leads: 290, conversion: 39, region: 'West', product: 'Product C', team: 'Team Gamma' },
];

const productData = [
  { name: 'Product A', value: 35 },
  { name: 'Product B', value: 25 },
  { name: 'Product C', value: 20 },
  { name: 'Product D', value: 15 },
  { name: 'Other', value: 5 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SalesDashboard = () => {
  // State for filters
  const [timeFilter, setTimeFilter] = useState('6M');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedProduct, setSelectedProduct] = useState('All Products');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);

  // Get unique values for filters
  const regions = ['All Regions', ...new Set(initialSalesData.map(item => item.region))].filter(region => region);
  const products = ['All Products', ...new Set(initialSalesData.map(item => item.product))];
  const teams = ['All Teams', ...new Set(initialSalesData.map(item => item.team))];
  const timeOptions = ['3M', '6M', 'YTD', '1Y'];

  // Filter data based on selections
  useEffect(() => {
    let filteredData = [...initialSalesData];
    
    // Apply time filter
    if (timeFilter === '3M') {
      filteredData = filteredData.slice(-3);
    } else if (timeFilter === '6M') {
      filteredData = filteredData.slice(-6);
    } else if (timeFilter === 'YTD') {
      filteredData = filteredData.slice(0, new Date().getMonth() + 1);
    } else if (timeFilter === '1Y') {
      filteredData = filteredData;
    }
    
    // Apply region filter
    if (selectedRegion !== 'All Regions') {
      filteredData = filteredData.filter(item => item.region === selectedRegion);
    }
    
    // Apply product filter
    if (selectedProduct !== 'All Products') {
      filteredData = filteredData.filter(item => item.product === selectedProduct);
    }
    
    // Apply team filter
    if (selectedTeam !== 'All Teams') {
      filteredData = filteredData.filter(item => item.team === selectedTeam);
    }
    
    setSalesData(filteredData);
  }, [timeFilter, selectedRegion, selectedProduct, selectedTeam]);

  // Close any open dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setTimeDropdownOpen(false);
      setRegionDropdownOpen(false);
      setProductDropdownOpen(false);
      setTeamDropdownOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Calculated metrics
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const avgConversion = salesData.length > 0 ? Math.round(salesData.reduce((sum, item) => sum + item.conversion, 0) / salesData.length) : 0;
  const totalLeads = salesData.reduce((sum, item) => sum + item.leads, 0);
  const lastMonthRevenue = salesData.length > 0 ? salesData[salesData.length - 1].revenue : 0;
  const previousMonthRevenue = salesData.length > 1 ? salesData[salesData.length - 2].revenue : 0;
  const revenueChange = previousMonthRevenue > 0 ? Math.round((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100) : 0;
  
  // Calculate team data from filtered sales data
  const calculatedTeamData = teams
    .filter(team => team !== 'All Teams')
    .map(team => {
      const teamItems = salesData.filter(item => item.team === team);
      const revenue = teamItems.reduce((sum, item) => sum + item.revenue, 0);
      const deals = teamItems.length;
      return { name: team, deals, revenue };
    })
    .sort((a, b) => b.revenue - a.revenue);
  
  // Custom click handler for bar chart
  const handleBarClick = (data) => {
    setSelectedDataPoint({
      month: data.month,
      revenue: data.revenue,
      target: data.target,
      delta: data.revenue - data.target,
      percentOfTarget: Math.round((data.revenue / data.target) * 100)
    });
  };
  
  // Reset all filters
  const resetFilters = (e) => {
    e.stopPropagation();
    setTimeFilter('6M');
    setSelectedRegion('All Regions');
    setSelectedProduct('All Products');
    setSelectedTeam('All Teams');
    setSelectedDataPoint(null);
  };
  
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Sales Performance Dashboard</h1>
        
        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time period filter */}
          <div className="relative" onClick={stopPropagation}>
            <button 
              className="px-4 py-2 bg-white border rounded-md flex items-center text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {timeFilter}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {timeDropdownOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                {timeOptions.map(option => (
                  <button
                    key={option}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${timeFilter === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    onClick={() => {
                      setTimeFilter(option);
                      setTimeDropdownOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Region filter */}
          <div className="relative" onClick={stopPropagation}>
            <button 
              className="px-4 py-2 bg-white border rounded-md flex items-center text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {selectedRegion}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {regionDropdownOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                {regions.map(region => (
                  <button
                    key={region}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${selectedRegion === region ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    onClick={() => {
                      setSelectedRegion(region);
                      setRegionDropdownOpen(false);
                    }}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product filter */}
          <div className="relative" onClick={stopPropagation}>
            <button 
              className="px-4 py-2 bg-white border rounded-md flex items-center text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setProductDropdownOpen(!productDropdownOpen)}
            >
              <Package className="w-4 h-4 mr-2" />
              {selectedProduct}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {productDropdownOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                {products.map(product => (
                  <button
                    key={product}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${selectedProduct === product ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    onClick={() => {
                      setSelectedProduct(product);
                      setProductDropdownOpen(false);
                    }}
                  >
                    {product}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Team filter */}
          <div className="relative" onClick={stopPropagation}>
            <button 
              className="px-4 py-2 bg-white border rounded-md flex items-center text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
            >
              <Users className="w-4 h-4 mr-2" />
              {selectedTeam}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {teamDropdownOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                {teams.map(team => (
                  <button
                    key={team}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${selectedTeam === team ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    onClick={() => {
                      setSelectedTeam(team);
                      setTeamDropdownOpen(false);
                    }}
                  >
                    {team}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Reset filters button */}
          <button 
            className="px-4 py-2 bg-white border rounded-md flex items-center text-sm text-gray-700 hover:bg-gray-50"
            onClick={resetFilters}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>
      
      {/* Applied filters display */}
      {(selectedRegion !== 'All Regions' || selectedProduct !== 'All Products' || selectedTeam !== 'All Teams') && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-500">Active filters:</span>
          {selectedRegion !== 'All Regions' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
              Region: {selectedRegion}
              <button onClick={() => setSelectedRegion('All Regions')} className="ml-1 hover:text-blue-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedProduct !== 'All Products' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
              Product: {selectedProduct}
              <button onClick={() => setSelectedProduct('All Products')} className="ml-1 hover:text-blue-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedTeam !== 'All Teams' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
              Team: {selectedTeam}
              <button onClick={() => setSelectedTeam('All Teams')} className="ml-1 hover:text-blue-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
      
      {/* Selected data point details */}
      {selectedDataPoint && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 relative">
          <button 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setSelectedDataPoint(null)}
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-medium text-blue-800">Details for {selectedDataPoint.month}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
            <div>
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="font-semibold">${selectedDataPoint.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Target</p>
              <p className="font-semibold">${selectedDataPoint.target.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Difference</p>
              <p className={`font-semibold ${selectedDataPoint.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(selectedDataPoint.delta).toLocaleString()} {selectedDataPoint.delta >= 0 ? 'over' : 'under'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">% of Target</p>
              <p className={`font-semibold ${selectedDataPoint.percentOfTarget >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedDataPoint.percentOfTarget}%
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* KPI summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">${(totalRevenue/1000).toFixed(1)}k</p>
            </div>
            <div className={`flex items-center ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {revenueChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(revenueChange)}%</span>
            </div>
          </div>
          <div className="mt-2">
            <DollarSign className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg. Conversion Rate</p>
              <p className="text-2xl font-bold">{avgConversion}%</p>
            </div>
            <div className="flex items-center text-green-500">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">2%</span>
            </div>
          </div>
          <div className="mt-2">
            <TrendingUp className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Leads</p>
              <p className="text-2xl font-bold">{totalLeads}</p>
            </div>
            <div className="flex items-center text-green-500">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">8%</span>
            </div>
          </div>
          <div className="mt-2">
            <Users className="w-8 h-8 text-purple-500 opacity-20" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg. Deal Size</p>
              <p className="text-2xl font-bold">$2,450</p>
            </div>
            <div className="flex items-center text-red-500">
              <ArrowDownRight className="w-4 h-4" />
              <span className="text-sm font-medium">3%</span>
            </div>
          </div>
          <div className="mt-2">
            <CreditCard className="w-8 h-8 text-indigo-500 opacity-20" />
          </div>
        </div>
      </div>
      
      {/* First row of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Revenue vs Target</h2>
          {salesData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={salesData} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  onClick={(data) => data && data.activePayload && handleBarClick(data.activePayload[0].payload)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => ['$' + value.toLocaleString(), '']} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#0088FE" name="Revenue" cursor="pointer" />
                  <Bar dataKey="target" fill="#8884d8" name="Target" cursor="pointer" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-center text-gray-500 mt-2">Click on any bar to see detailed information</p>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No data available for the selected filters</p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Conversion Rate Trend</h2>
          {salesData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 'dataMax + 5']} />
                  <Tooltip formatter={(value) => [value + '%', 'Conversion Rate']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="conversion" 
                    stroke="#00C49F" 
                    activeDot={{ r: 8 }} 
                    name="Conversion Rate (%)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No data available for the selected filters</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Second row of charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Product Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      opacity={selectedProduct !== 'All Products' && selectedProduct !== entry.name ? 0.3 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Regional Performance</h2>
          {salesData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={regions.filter(r => r !== 'All Regions').map(region => {
                    const regionData = salesData.filter(item => item.region === region);
                    return {
                      name: region,
                      revenue: regionData.reduce((sum, item) => sum + item.revenue, 0)
                    };
                  })} 
                  layout="vertical" 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Revenue']} />
                  <Bar 
                    dataKey="revenue" 
                    fill="#FFBB28"
                    onClick={(data) => setSelectedRegion(data.name)}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-center text-gray-500 mt-2">Click on any bar to filter by region</p>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No data available for the selected filters</p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Team Performance</h2>
          {calculatedTeamData.length > 0 ? (
            <div className="space-y-4">
              {calculatedTeamData.map((team, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between mb-1">
                    <button 
                      className="font-medium hover:text-blue-600 cursor-pointer"
                      onClick={() => setSelectedTeam(team.name)}
                    >
                      {team.name}
                    </button>
                    <span className="text-gray-500">${(team.revenue/1000).toFixed(0)}k</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-500" 
                      style={{
                        width: `${(team.revenue / Math.max(...calculatedTeamData.map(t => t.revenue))) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{team.deals} deals</span>
                    <span>${team.deals > 0 ? Math.round(team.revenue/team.deals).toLocaleString() : 0} avg</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No data available for the selected filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;


// Note: This code is a simplified version of a sales dashboard and may require additional styling and functionality to match your specific requirements.
// You can further enhance the dashboard by adding more features like exporting data, customizing charts, etc.
// Make sure to install the required dependencies:
// npm install recharts lucide-react
// and import the necessary CSS styles for your project.
// You can also consider using a CSS framework like Tailwind CSS for better styling and responsiveness.
// Don't forget to test the dashboard thoroughly to ensure all functionalities work as expected.
// Happy coding!
// You can also consider using a CSS framework like Tailwind CSS for better styling and responsiveness.
// Don't forget to test the dashboard thoroughly to ensure all functionalities work as expected.
// Happy coding!