import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Globe,
  Key,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    insights: true,
    reports: true
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'data', name: 'Data Management', icon: Database },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'integrations', name: 'Integrations', icon: Globe },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-gray-200"
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                </motion.button>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Kiran Mehta</h3>
                <p className="text-gray-600">Data Analyst</p>
                <p className="text-sm text-gray-500">kiran100112@gmail.com</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  defaultValue="Kiran"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  defaultValue="Mehta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="kiran100112@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  rows={3}
                  defaultValue="Experienced data analyst with expertise in business intelligence and machine learning."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                  { key: 'insights', label: 'AI Insights', description: 'Get notified when new insights are generated' },
                  { key: 'reports', label: 'Report Updates', description: 'Notifications for report completion and sharing' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.label}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Frequency</h3>
              <div className="space-y-2">
                {['Immediately', 'Daily Digest', 'Weekly Summary', 'Never'].map((option) => (
                  <label key={option} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="frequency"
                      defaultChecked={option === 'Daily Digest'}
                      className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-800">2FA Enabled</h4>
                    <p className="text-sm text-green-600">Your account is protected with two-factor authentication</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Manage
                  </motion.button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">API Keys</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Production API Key</h4>
                    <p className="text-sm text-gray-600">sk-prod-••••••••••••••••</p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Key className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Export</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <Download className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-800">Export All Data</h4>
                    <p className="text-sm text-gray-600">Download all your data in CSV format</p>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
                >
                  <Database className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-800">Backup Data</h4>
                    <p className="text-sm text-gray-600">Create a complete backup of your workspace</p>
                  </div>
                </motion.button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Retention</h3>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Automatic Data Cleanup</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Data older than 2 years will be automatically archived. You can change this setting below.
                  </p>
                  <select className="px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    <option>1 year</option>
                    <option selected>2 years</option>
                    <option>3 years</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Danger Zone</h3>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Delete All Data</h4>
                <p className="text-sm text-red-700 mb-3">
                  Permanently delete all your data. This action cannot be undone.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete All Data
                </motion.button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Light', 'Dark', 'Auto'].map((theme) => (
                  <motion.button
                    key={theme}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      theme === 'Light' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className={`w-full h-16 rounded mb-3 ${
                      theme === 'Light' ? 'bg-white border' :
                      theme === 'Dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-white to-gray-800'
                    }`}></div>
                    <h4 className="font-medium text-gray-800">{theme}</h4>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Color Scheme</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  'from-blue-500 to-purple-600',
                  'from-green-500 to-blue-600',
                  'from-purple-500 to-pink-600',
                  'from-orange-500 to-red-600',
                  'from-teal-500 to-cyan-600',
                  'from-indigo-500 to-purple-600',
                  'from-pink-500 to-rose-600',
                  'from-yellow-500 to-orange-600',
                ].map((gradient, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} ${
                      index === 0 ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Display Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">Compact Mode</h4>
                    <p className="text-sm text-gray-600">Reduce spacing and padding for more content</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors"
                  >
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                  </motion.button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">Animations</h4>
                    <p className="text-sm text-gray-600">Enable smooth transitions and animations</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition-colors"
                  >
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Connected Services</h3>
              <div className="space-y-4">
                {[
                  { name: 'Google Analytics', status: 'Connected', color: 'green' },
                  { name: 'Salesforce', status: 'Connected', color: 'green' },
                  { name: 'Slack', status: 'Disconnected', color: 'gray' },
                  { name: 'Microsoft Excel', status: 'Connected', color: 'green' },
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                        service.color === 'green' ? 'from-green-500 to-green-600' : 'from-gray-400 to-gray-500'
                      } flex items-center justify-center`}>
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{service.name}</h4>
                        <p className={`text-sm ${
                          service.status === 'Connected' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {service.status}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        service.status === 'Connected'
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      {service.status === 'Connected' ? 'Disconnect' : 'Connect'}
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Integrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Tableau', 'Power BI', 'Zapier', 'HubSpot', 'Stripe', 'AWS S3'
                ].map((integration) => (
                  <motion.button
                    key={integration}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">{integration}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Copyright Warning in Settings */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white border-l-4 border-red-800"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 pt-1">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">©</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">🚨 LEGAL NOTICE - COPYRIGHT PROTECTION</h3>
            <div className="text-red-100 text-sm space-y-2">
              <p><strong>© 2025 Kiran Mehta (kiran100112@gmail.com)</strong></p>
              <p>This Data Alchemist AI application and all its components, code, designs, and concepts are the exclusive intellectual property of Kiran Mehta.</p>
              <p className="text-yellow-200 font-semibold">
                ⚠️ COMMERCIAL USE STRICTLY PROHIBITED: Any commercial use, reproduction, distribution, or derivative works without explicit written permission will result in immediate legal action.
              </p>
              <p className="text-xs">This project was created as part of a company assignment for evaluation purposes only.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600">Manage your account and application preferences</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <nav className="space-y-2">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.name}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="flex justify-end mt-8 pt-6 border-t border-gray-200"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;