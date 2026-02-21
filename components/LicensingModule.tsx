import React, { useState } from 'react';
import { MOCK_INSTITUTIONS, MOCK_LICENSES, CERTIFICATION_TRACKS } from '../constants';
import { Institution, License, Track } from '../types';
import { Key, Calendar, Building2, UserCheck, ShieldCheck, AlertCircle, Plus, Search, Filter, MoreVertical, ExternalLink, Mail, MapPin, CheckCircle2, XCircle, Clock } from 'lucide-react';

const LicensingModule: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>(MOCK_LICENSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'pending'>('all');

  const getInstitutionName = (id: string) => MOCK_INSTITUTIONS.find(i => i.id === id)?.name || 'Unknown Institution';
  const getTrackTitle = (id: string) => CERTIFICATION_TRACKS.find(t => t.id === id)?.title || 'Unknown Track';

  const filteredLicenses = licenses.filter(license => {
    const institutionName = getInstitutionName(license.institutionId).toLowerCase();
    const trackTitle = getTrackTitle(license.trackId).toLowerCase();
    const key = license.licenseKey.toLowerCase();
    const matchesSearch = institutionName.includes(searchTerm.toLowerCase()) || 
                         trackTitle.includes(searchTerm.toLowerCase()) || 
                         key.includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || license.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 size={14} className="mr-1" />;
      case 'expired': return <XCircle size={14} className="mr-1" />;
      case 'pending': return <Clock size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-vault-text">License Management</h2>
          <p className="text-vault-muted text-sm">Manage institutional access, license keys, and renewal cycles.</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-vault-accent text-white rounded-lg font-bold shadow-md hover:bg-vault-accent/90 transition-all">
          <Plus size={18} className="mr-2" />
          Issue New License
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Licenses', value: licenses.length, icon: Key, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Seats', value: licenses.reduce((acc, curr) => acc + curr.seatsUsed, 0), icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Expiring Soon', value: 1, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Compliance Rate', value: '98%', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-vault-border shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-vault-muted uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-vault-text">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-vault-border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search by institution, track, or key..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-vault-border focus:outline-none focus:ring-2 focus:ring-vault-accent/20 focus:border-vault-accent transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter size={18} className="text-vault-muted" />
          <select 
            className="flex-1 md:flex-none px-3 py-2 rounded-lg border border-vault-border text-sm focus:outline-none focus:ring-2 focus:ring-vault-accent/20"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* License Table */}
      <div className="bg-white rounded-xl border border-vault-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-bottom border-vault-border">
                <th className="px-6 py-4 text-xs font-bold text-vault-muted uppercase tracking-wider">Institution & Track</th>
                <th className="px-6 py-4 text-xs font-bold text-vault-muted uppercase tracking-wider">License Key</th>
                <th className="px-6 py-4 text-xs font-bold text-vault-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-vault-muted uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-xs font-bold text-vault-muted uppercase tracking-wider">Expiration</th>
                <th className="px-6 py-4 text-xs font-bold text-vault-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vault-border">
              {filteredLicenses.map((license) => (
                <tr key={license.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-vault-text text-sm">{getInstitutionName(license.institutionId)}</span>
                      <span className="text-xs text-vault-muted flex items-center mt-1">
                        <Building2 size={12} className="mr-1" />
                        {getTrackTitle(license.trackId)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-vault-accent border border-slate-200">
                      {license.licenseKey}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(license.status)}`}>
                      {getStatusIcon(license.status)}
                      {license.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col w-32">
                      <div className="flex justify-between text-[10px] font-bold text-vault-muted mb-1 uppercase">
                        <span>{license.seatsUsed} / {license.seatsTotal} Seats</span>
                        <span>{Math.round((license.seatsUsed / license.seatsTotal) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${license.status === 'expired' ? 'bg-slate-300' : 'bg-vault-accent'}`}
                          style={{ width: `${(license.seatsUsed / license.seatsTotal) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-vault-text">{license.expiryDate}</span>
                      <span className="text-[10px] text-vault-muted uppercase font-bold mt-0.5">
                        Issued: {license.issuedDate}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-vault-muted hover:text-vault-accent hover:bg-white rounded-md transition-all border border-transparent hover:border-vault-border">
                        <Mail size={16} />
                      </button>
                      <button className="p-1.5 text-vault-muted hover:text-vault-accent hover:bg-white rounded-md transition-all border border-transparent hover:border-vault-border">
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-1.5 text-vault-muted hover:text-red-600 hover:bg-white rounded-md transition-all border border-transparent hover:border-vault-border">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLicenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-vault-muted">
                    <div className="flex flex-col items-center">
                      <AlertCircle size={40} className="mb-2 opacity-20" />
                      <p>No licenses found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LicensingModule;
