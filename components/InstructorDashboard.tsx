import React, { useState, useEffect } from 'react';
import { User, Submission, Report } from '../types';
import { getAllStudents, getSubmissionsForUser, getReportsForInstitution } from '../services/localDbService';
import { Users, Activity, FileBadge, Search, Filter, ChevronRight, CheckCircle2, XCircle, Clock, BarChart3, AlertCircle } from 'lucide-react';

const InstructorDashboard: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Assuming instructor is logged in and belongs to 'inst1'
      const institutionId = 'inst1';
      
      const loadedStudents = await getAllStudents(institutionId);
      setStudents(loadedStudents);

      let allSubs: Submission[] = [];
      for (const student of loadedStudents) {
        const subs = await getSubmissionsForUser(student.id);
        allSubs = [...allSubs, ...subs];
      }
      setSubmissions(allSubs);

      const loadedReports = await getReportsForInstitution(institutionId);
      setReports(loadedReports);
      
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentSubmissions = (userId: string) => submissions.filter(s => s.userId === userId);
  const getAverageScore = (userId: string) => {
    const subs = getStudentSubmissions(userId);
    if (subs.length === 0) return 0;
    const total = subs.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return Math.round(total / subs.length);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-vault-muted">
        <Activity className="animate-spin mb-4" size={32} />
        <p>Loading institutional data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-vault-text">Instructor Monitoring Platform</h2>
          <p className="text-vault-muted text-sm">Real-time progress tracking, AI grading reports, and curriculum management.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Assessments Graded', value: submissions.length, icon: FileBadge, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg Cohort Score', value: `${students.length > 0 ? Math.round(submissions.reduce((a,b) => a + (b.score||0), 0) / (submissions.length || 1)) : 0}%`, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending Reviews', value: submissions.filter(s => s.gradedBy === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
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

      {/* Student Roster */}
      <div className="bg-white rounded-xl border border-vault-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-vault-border flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-vault-text">Student Roster & Progress</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search students..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-vault-border text-sm focus:outline-none focus:ring-2 focus:ring-vault-accent/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-vault-border">
                <th className="px-6 py-3 text-xs font-bold text-vault-muted uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-xs font-bold text-vault-muted uppercase tracking-wider">Assessments Completed</th>
                <th className="px-6 py-3 text-xs font-bold text-vault-muted uppercase tracking-wider">Average Score</th>
                <th className="px-6 py-3 text-xs font-bold text-vault-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-vault-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vault-border">
              {filteredStudents.map((student) => {
                const subs = getStudentSubmissions(student.id);
                const avg = getAverageScore(student.id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-vault-text text-sm">{student.name}</span>
                        <span className="text-xs text-vault-muted">{student.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">{subs.length} Quizzes/Exams</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold ${avg >= 80 ? 'text-emerald-600' : avg >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                          {avg}%
                        </span>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${avg >= 80 ? 'bg-emerald-500' : avg >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${avg}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {avg >= 80 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={12} className="mr-1" /> On Track
                        </span>
                      ) : avg > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          <AlertCircle size={12} className="mr-1" /> Needs Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                          <Clock size={12} className="mr-1" /> Not Started
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-vault-accent hover:text-vault-accent/80 text-sm font-medium flex items-center transition-colors">
                        View Report <ChevronRight size={16} className="ml-1" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-vault-muted">
                    No students found.
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

export default InstructorDashboard;
