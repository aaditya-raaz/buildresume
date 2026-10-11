import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationItem, ApplicationStatus } from '../../types';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  FileText,
  Trash2,
  Edit2,
  ExternalLink,
  CheckCircle,
  Clock,
  Check,
} from 'lucide-react';

export const ApplicationTrackerView: React.FC = () => {
  const {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    resumeVersions,
    navigateTo,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formResumeId, setFormResumeId] = useState(resumeVersions[0]?.id || '');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStatus, setFormStatus] = useState<ApplicationStatus>('Applied');
  const [formSalary, setFormSalary] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formInterviewDate, setFormInterviewDate] = useState('');

  const statuses: ApplicationStatus[] = [
    'Interested',
    'Applied',
    'Interview',
    'Offer',
    'Rejected',
    'Withdrawn',
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormCompany('');
    setFormRole('');
    setFormResumeId(resumeVersions[0]?.id || '');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStatus('Applied');
    setFormSalary('');
    setFormNotes('');
    setFormInterviewDate('');
    setModalOpen(true);
  };

  const handleOpenEdit = (app: ApplicationItem) => {
    setEditingId(app.id);
    setFormCompany(app.company);
    setFormRole(app.role);
    setFormResumeId(app.resumeVersionId);
    setFormDate(app.applicationDate);
    setFormStatus(app.status);
    setFormSalary(app.salary || '');
    setFormNotes(app.notes || '');
    setFormInterviewDate(app.interviewDate || '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim() || !formRole.trim()) return;

    if (editingId) {
      updateApplication(editingId, {
        company: formCompany,
        role: formRole,
        resumeVersionId: formResumeId,
        applicationDate: formDate,
        status: formStatus,
        salary: formSalary,
        notes: formNotes,
        interviewDate: formInterviewDate,
      });
    } else {
      addApplication({
        company: formCompany,
        role: formRole,
        resumeVersionId: formResumeId,
        applicationDate: formDate,
        status: formStatus,
        salary: formSalary,
        notes: formNotes,
        interviewDate: formInterviewDate,
      });
    }
    setModalOpen(false);
  };

  const filteredApps = applications.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Offer':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Interview':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Interested':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-950 tracking-tight">
                Job Application Tracker
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Opportunity Management
              </span>
            </div>
            <p className="text-xs text-gray-600 max-w-2xl">
              Track companies, interview stages, and tie every submission back to the exact tailored
              resume version you used.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Track New Opportunity
          </button>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Applications ({applications.length})
          </button>
          {statuses.map((st) => {
            const count = applications.filter((a) => a.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications Table / Cards */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">No Applications Tracked Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Log your submissions and connect them to your tailored resumes to stay organized.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
          >
            Log First Application
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Company & Target Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Resume Version</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Notes & Interview Details</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.map((app) => {
                  const linkedResume = resumeVersions.find((r) => r.id === app.resumeVersionId);
                  return (
                    <tr key={app.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-950 text-sm block">{app.company}</span>
                        <span className="text-gray-600 font-medium">{app.role}</span>
                        {app.salary && (
                          <span className="text-[11px] text-gray-400 block mt-0.5 font-mono">
                            {app.salary}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {linkedResume ? (
                          <button
                            onClick={() => navigateTo('editor', linkedResume.id)}
                            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline text-xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            {linkedResume.title}
                          </button>
                        ) : (
                          <span className="text-gray-400">Master Profile</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-gray-600">
                        {app.applicationDate}
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 max-w-xs">
                        {app.interviewDate && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 mb-1">
                            <Calendar className="w-3 h-3" /> Interview: {app.interviewDate}
                          </span>
                        )}
                        <p className="line-clamp-2">{app.notes || 'No notes added.'}</p>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(app)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Opportunity"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove application to ${app.company}?`)) {
                                deleteApplication(app.id);
                              }
                            }}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-950 text-base">
                {editingId ? 'Edit Application' : 'Log New Application'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Stripe"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Backend Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Resume Version Used</label>
                  <select
                    value={formResumeId}
                    onChange={(e) => setFormResumeId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                  >
                    {resumeVersions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ApplicationStatus)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Application Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Interview Date (optional)</label>
                  <input
                    type="date"
                    value={formInterviewDate}
                    onChange={(e) => setFormInterviewDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Salary Range / Compensation</label>
                <input
                  type="text"
                  value={formSalary}
                  onChange={(e) => setFormSalary(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="e.g. $160,000 - $180,000"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Notes & Follow-up Details</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Referral name, interview notes, questions asked..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  {editingId ? 'Update Opportunity' : 'Save Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
