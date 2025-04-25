import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JourneyPlans.css';

const JourneyPlans = ({ currentUser }) => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    destination: '',
    plannedDate: ''
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/journey-plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/journey-plans/${editingId}`, newPlan);
      } else {
        await axios.post('/api/journey-plans', newPlan);
      }
      fetchPlans();
      setNewPlan({ title: '', description: '', destination: '', plannedDate: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleEdit = (plan) => {
    setNewPlan(plan);
    setEditingId(plan.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/journey-plans/${id}`);
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  return (
    <div className="journey-plans-container">
      <h1>Journey Plans</h1>
      <p>Welcome, {currentUser?.username}</p>
      
      <form onSubmit={handleSubmit} className="plan-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newPlan.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={newPlan.destination}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="plannedDate"
          value={newPlan.plannedDate}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newPlan.description}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Plan</button>
        {editingId && <button type="button" onClick={() => setEditingId(null)}>Cancel</button>}
      </form>

      <div className="plans-list">
        {plans.map(plan => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.title}</h3>
            <p><strong>Destination:</strong> {plan.destination}</p>
            <p><strong>Planned Date:</strong> {new Date(plan.plannedDate).toLocaleDateString()}</p>
            <p>{plan.description}</p>
            <div className="plan-actions">
              <button onClick={() => handleEdit(plan)}>Edit</button>
              <button onClick={() => handleDelete(plan.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyPlans;