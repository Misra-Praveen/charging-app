import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stations, setStations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: "",
    powerOutput: "",
    connectorType: "",
  });

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axiosInstance.get("/stations");
        setStations(res.data);
      } catch (err) {
        setError("Failed to load stations");
      }
    };
    fetchStations();
  }, []);

  const filteredStations = stations.filter((station) => {
    const { status, powerOutput, connectorType } = filters;
    return (
      (!status || station.status === status) &&
      (!powerOutput || station.powerOutput === parseFloat(powerOutput)) &&
      (!connectorType || station.connectorType === connectorType)
    );
  });

  const handleEdit = (station) => {
    setEditId(station._id);
    setEditForm({
      name: station.name,
      status: station.status,
      powerOutput: station.powerOutput,
      connectorType: station.connectorType,
      latitude: station.location.latitude,
      longitude: station.location.longitude,
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditForm({});
    setError(null)
  };

  const handleChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const payload = {
        name: editForm.name,
        status: editForm.status,
        powerOutput: parseFloat(editForm.powerOutput),
        connectorType: editForm.connectorType,
        location: {
          latitude: parseFloat(editForm.latitude),
          longitude: parseFloat(editForm.longitude),
        },
      };
      await axiosInstance.put(`/stations/${id}`, payload);
      const res = await axiosInstance.get("/stations");
      setStations(res.data);
      setEditId(null);
      setEditForm({});
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this station?"))
      return;
    try {
      await axiosInstance.delete(`/stations/${id}`);
      setStations((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setError("Failed to delete");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Sidebar */}
      <div className="md:w-1/4 w-full bg-gray-100 p-6 border-b md:border-b-0 md:border-r">
        <h2 className="text-xl font-bold mb-4">
          Welcome, {user?.username || "User"}
        </h2>
        <button
          onClick={() => navigate("/add-station")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          + Add Station
        </button>

        <button
          onClick={() => navigate("/map")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full mt-3"
        >
          🗺️ View Map
        </button>

        {/* Filters */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Filters</h3>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <input
            type="number"
            name="powerOutput"
            placeholder="Power Output (kW)"
            value={filters.powerOutput}
            onChange={handleFilterChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            name="connectorType"
            placeholder="Connector Type"
            value={filters.connectorType}
            onChange={handleFilterChange}
            className="w-full mb-2 p-2 border rounded"
          />
        </div>
      </div>

      {/* Right Content */}
      <div className="md:w-3/4 w-full p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Charging Stations</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Power</th>
                <th className="border p-2">Connector</th>
                <th className="border p-2">Latitude</th>
                <th className="border p-2">Longitude</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStations.map((station) => (
                <tr key={station._id} className="border">
                  {editId === station._id ? (
                    <>
                      <td className="border p-2">
                        <input
                          name="name"
                          value={editForm.name}
                          onChange={handleChange}
                          className="w-full border px-2 py-1"
                        />
                      </td>
                      <td className="border p-2">
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleChange}
                          className="w-full border px-2 py-1"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="border p-2">
                        <input
                          name="powerOutput"
                          type="number"
                          value={editForm.powerOutput}
                          onChange={handleChange}
                          className="w-full border px-2 py-1"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          name="connectorType"
                          value={editForm.connectorType}
                          onChange={handleChange}
                          className="w-full border px-2 py-1"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          name="latitude"
                          type="number"
                          value={editForm.latitude}
                          onChange={handleChange}
                          className="w-full border px-2 py-1"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          name="longitude"
                          type="number"
                          value={editForm.longitude}
                          onChange={handleChange}
                          className="w-full border px-2 py-1"
                        />
                      </td>
                      <td className="border p-2 flex flex-col gap-2 md:flex-row">
                        <button
                          onClick={() => handleUpdate(station._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border p-2">{station.name}</td>
                      <td className="border p-2">{station.status}</td>
                      <td className="border p-2">{station.powerOutput} kW</td>
                      <td className="border p-2">{station.connectorType}</td>
                      <td className="border p-2">
                        {station.location.latitude}
                      </td>
                      <td className="border p-2">
                        {station.location.longitude}
                      </td>
                      <td className="border p-2 flex flex-col gap-2 md:flex-row">
                        <button
                          onClick={() => handleEdit(station)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(station._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
