import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TravelLogs.css';

const TravelLogs = ({ currentUser }) => {
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState({
    title: '',
    description: '',
    location: '',
    visitDate: ''
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/api/travel-logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLog(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/travel-logs/${editingId}`, newLog);
      } else {
        await axios.post('/api/travel-logs', newLog);
      }
      fetchLogs();
      setNewLog({ title: '', description: '', location: '', visitDate: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving log:', error);
    }
  };

  const handleEdit = (log) => {
    setNewLog(log);
    setEditingId(log.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/travel-logs/${id}`);
      fetchLogs();
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  return (
    <div className="travel-logs-container">
      <h1>Travel Logs</h1>
      <p>Welcome, {currentUser?.username}</p>
      
      <form onSubmit={handleSubmit} className="log-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newLog.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newLog.location}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="visitDate"
          value={newLog.visitDate}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newLog.description}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Log</button>
        {editingId && <button type="button" onClick={() => setEditingId(null)}>Cancel</button>}
      </form>

      <div className="logs-list">
        {logs.map(log => (
          <div key={log.id} className="log-card">
            <h3>{log.title}</h3>
            <p><strong>Location:</strong> {log.location}</p>
            <p><strong>Date:</strong> {new Date(log.visitDate).toLocaleDateString()}</p>
            <p>{log.description}</p>
            <div className="log-actions">
              <button onClick={() => handleEdit(log)}>Edit</button>
              <button onClick={() => handleDelete(log.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelLogs;