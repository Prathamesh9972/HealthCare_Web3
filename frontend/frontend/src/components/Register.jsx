import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  UserCog,
  Building2,
  Factory,
  Truck,
  Users,
  Loader2,
  ArrowRight,
  Check,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "enduser"
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });

  const roles = [
    { id: 'admin', icon: <UserCog size={20} />, label: 'Administrator', description: 'Full system access and control' },
    { id: 'supplier', icon: <Building2 size={20} />, label: 'Supplier', description: 'Manage and track supplies' },
    { id: 'manufacturer', icon: <Factory size={20} />, label: 'Manufacturer', description: 'Production and assembly management' },
    { id: 'distributor', icon: <Truck size={20} />, label: 'Distributor', description: 'Handle product distribution' },
    { id: 'enduser', icon: <Users size={20} />, label: 'End User', description: 'Standard user access' }
  ];

  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength({ score, requirements });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleRoleSelect = (roleId) => {
    setFormData({ ...formData, role: roleId });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" });
      return false;
    }
    if (passwordStrength.score < 3) {
      setMessage({ text: "Password does not meet minimum security requirements!", type: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ text: "Registration successful! Please proceed to login.", type: "success" });
      } else {
        setMessage({ text: data.error || "Registration failed.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error connecting to the server.", type: "error" });
    }

    setLoading(false);
  };

  const getStrengthColor = () => {
    const colors = ['bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200', 'bg-green-400'];
    return colors[passwordStrength.score] || colors[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our platform to get started
        </p>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100 height-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md h-12"
                  placeholder="Prathamesh Kapadne"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md h-12"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md h-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex space-x-1 mb-1">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className={`h-1 w-full rounded-full ${
                        index <= passwordStrength.score ? getStrengthColor() : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className={`flex items-center ${passwordStrength.requirements.length ? 'text-green-600' : ''}`}>
                    <Check className={`h-3 w-3 mr-1 ${passwordStrength.requirements.length ? 'text-green-600' : 'text-gray-400'}`} />
                    At least 8 characters
                  </div>
                  <div className={`flex items-center ${passwordStrength.requirements.uppercase ? 'text-green-600' : ''}`}>
                    <Check className={`h-3 w-3 mr-1 ${passwordStrength.requirements.uppercase ? 'text-green-600' : 'text-gray-400'}`} />
                    Uppercase letter
                  </div>
                  <div className={`flex items-center ${passwordStrength.requirements.lowercase ? 'text-green-600' : ''}`}>
                    <Check className={`h-3 w-3 mr-1 ${passwordStrength.requirements.lowercase ? 'text-green-600' : 'text-gray-400'}`} />
                    Lowercase letter
                  </div>
                  <div className={`flex items-center ${passwordStrength.requirements.number ? 'text-green-600' : ''}`}>
                    <Check className={`h-3 w-3 mr-1 ${passwordStrength.requirements.number ? 'text-green-600' : 'text-gray-400'}`} />
                    Number
                  </div>
                  <div className={`flex items-center ${passwordStrength.requirements.special ? 'text-green-600' : ''}`}>
                    <Check className={`h-3 w-3 mr-1 ${passwordStrength.requirements.special ? 'text-green-600' : 'text-gray-400'}`} />
                    Special character
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md h-12"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select your role
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`relative rounded-lg border p-4 cursor-pointer hover:border-indigo-500 transition-colors ${
                      formData.role === role.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`${
                        formData.role === role.id ? 'text-indigo-500' : 'text-gray-400'
                      }`}>
                        {role.icon}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {role.label}
                        </h3>
                        <p className="text-xs text-gray-500">{role.description}</p>
                      </div>
                      {formData.role === role.id && (
                        <Check className="h-5 w-5 text-indigo-500 absolute right-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="flex items-center">
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </button>
            </div>
          </form>

        {/* Previous code remains the same until the message display section */}

        {message.text && (
            <div className={`mt-4 p-3 rounded-md ${
              message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              <div className="flex items-center">
                {message.type === 'error' ? (
                  <AlertCircle className="h-5 w-5 mr-2" />
                ) : (
                  <Check className="h-5 w-5 mr-2" />
                )}
                {message.text}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => window.location.href = '/login'}
                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">GitHub</span>
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs text-center text-gray-500">
              By creating an account, you agree to our{' '}
              <button type="button" className="text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline">
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;