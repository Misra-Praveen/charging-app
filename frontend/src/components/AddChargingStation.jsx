import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const AddChargingStation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    status: 'Active', // default to Active
    powerOutput: '',
    connectorType: '',
    latitude: '',
    longitude: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    
    const payload = {
      name: formData.name,
      status: formData.status,
      powerOutput: parseFloat(formData.powerOutput),
      connectorType: formData.connectorType,
      location: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      },
    };

    try {
      await axiosInstance.post('/stations', payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add station');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Add Charging Station</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Station Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input
          type="number"
          name="powerOutput"
          placeholder="Power Output (kW)"
          value={formData.powerOutput}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="connectorType"
          placeholder="Connector Type"
          value={formData.connectorType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="latitude"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="longitude"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Station
        </button>
      </form>
    </div>
  );
};

export default AddChargingStation;
