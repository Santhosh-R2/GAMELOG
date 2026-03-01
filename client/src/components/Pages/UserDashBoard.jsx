import React, { useState, useEffect } from 'react';
import './UserDashBoard.css';
import api from '../../api'; // Assuming you have an api instance configured
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area
} from 'recharts';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

function UserDashBoard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Using the configured axios instance which should include the token
        const response = await api.get('/dashboard-stats');
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          setError('Failed to fetch stats');
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError('An error occurred while fetching dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Initializing System Metrics...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 style={{ color: '#ff003c' }}>System Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Cyberpunk colors for charts
  const COLORS = ['#00f3ff', '#ff003c', '#9d00ff', '#fcee0a', '#b026ff'];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Command Center</h1>
        <p>Real-time system statistics and engagement metrics</p>
      </div>

      <div className="kpi-cards">
        <div className="kpi-card">
          <div className="kpi-icon">
            <PersonIcon fontSize="inherit" />
          </div>
          <div className="kpi-content">
            <h3>Total Operators</h3>
            <p>{stats?.summary?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <ArticleIcon fontSize="inherit" />
          </div>
          <div className="kpi-content">
            <h3>Active Transmissions</h3>
            <p>{stats?.summary?.totalBlogs || 0}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* User Categories - Pie Chart */}
        <div className="chart-card">
          <h3>Operator Classifications</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.usersByCategory || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(stats?.usersByCategory || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #00f3ff', borderRadius: '4px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blogs per Game Category - Bar Chart */}
        <div className="chart-card">
          <h3>Top Engaged Protocol Categories</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.blogsByCategory || []}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                <XAxis dataKey="name" stroke="#8892b0" />
                <YAxis stroke="#8892b0" allowDecimals={false} />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ff003c', borderRadius: '4px' }}
                />
                <Bar dataKey="count" name="Posts" fill="#ff003c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blogs Trend Last 7 days - Area Chart */}
        <div className="chart-card" style={{ gridColumn: 'span 2 / span 2' }}>
          <h3>Transmission Frequency (Last 7 Days)</h3>
          <div className="chart-container" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats?.blogsByDate || []}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#8892b0" />
                <YAxis stroke="#8892b0" allowDecimals={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #00f3ff', borderRadius: '4px' }}
                />
                <Area type="monotone" dataKey="count" name="New Transmissions" stroke="#00f3ff" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most liked blogs List */}
        <div className="top-blogs-card">
          <h3>Highest Rated Transmissions</h3>
          <div className="blog-list">
            {stats?.topBlogs && stats.topBlogs.length > 0 ? (
              stats.topBlogs.map((blog, idx) => (
                <div key={idx} className="blog-item">
                  <div className="blog-title">{blog.title}</div>
                  <div className="blog-likes">
                    <LocalFireDepartmentIcon fontSize="small" />
                    <span>{blog.likesCount}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#8892b0' }}>No transmissions fully authenticated yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default UserDashBoard;