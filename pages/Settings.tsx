import React from 'react';
import { Save, Bell, Cloud, Database } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings & Integrations</h2>
        <p className="text-gray-400 text-sm">Configure cloud exports and reporting</p>
      </div>

      {/* Cloud Integrations */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700 bg-gray-900/30">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Cloud size={18} className="text-primary-400" />
            Cloud Export
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Jira Host URL</label>
                <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="https://company.atlassian.net" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Jira Project Key</label>
                <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="SEC" />
             </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">AWS S3 Bucket</label>
            <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="s3://reports-bucket" />
          </div>

          <div className="flex items-center gap-3">
             <input type="checkbox" id="auto-upload" className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-primary-600 focus:ring-primary-600" />
             <label htmlFor="auto-upload" className="text-sm text-gray-300">Automatically upload reports after scan completion</label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700 bg-gray-900/30">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Bell size={18} className="text-amber-400" />
            Notifications (Slack/Teams)
          </h3>
        </div>
        <div className="p-6 space-y-4">
           <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Webhook URL</label>
              <input type="password" value="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500" readOnly />
           </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
         <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors">
            <Save size={18} />
            Save Configuration
         </button>
      </div>
    </div>
  );
};

export default Settings;