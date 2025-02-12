import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'enduser'
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { id: 'admin', label: 'Admin', description: 'Full system access and control', path: '/admin' },
    { id: 'supplier', label: 'Supplier', description: 'Manage inventory and supplies', path: '/supplier' },
    { id: 'manufacturer', label: 'Manufacturer', description: 'Production and assembly', path: '/manufacturer' },
    { id: 'distributor', label: 'Distributor', description: 'Handle product distribution', path: '/distributor' },
    { id: 'enduser', label: 'End User', description: 'Access and use products', path: '/dashboard' }
  ];

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      // Store token and user role
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', formData.role);
      
      // Find the matching role and get its path
      const selectedRole = roles.find(role => role.id === formData.role);
      if (selectedRole) {
        // Navigate to the role-specific page
        navigate(selectedRole.path);
      }
      
    } catch (error) {
      setErrors({
        submit: error.message
      });
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* ... existing JSX ... */}
    </div>
  );
};

export default Login;