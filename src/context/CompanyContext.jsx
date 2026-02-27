import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState({
    name: 'AgriMarket',
    logo: null,
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const fetchCompanySettings = async () => {
    try {
      const response = await axios.get('/api/admin/settings');
      setCompany(response.data.settings);
    } catch (error) {
      console.error('Fetch company settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompanySettings = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      });

      const response = await axios.put('/api/admin/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setCompany(response.data.settings);
      return { success: true };
    } catch (error) {
      console.error('Update company settings error:', error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const value = {
    company,
    loading,
    updateCompanySettings,
    refreshCompany: fetchCompanySettings
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};