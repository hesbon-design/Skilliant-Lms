"use client";

import React, { useState } from "react";
import {
  mockCompanyProfile,
  mockCompanyMembers,
  CompanyMember,
} from "@/data/companyData";

export default function CompanyTeamPage() {
  const [profile] = useState(mockCompanyProfile);
  const [members, setMembers] = useState<CompanyMember[]>(mockCompanyMembers);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Invite Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteProgram, setInviteProgram] = useState(profile.assignedCatalog[0].title);
  const [sendVoucher, setSendVoucher] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram =
      selectedProgram === "all" || m.assignedProgram === selectedProgram;
    const matchesStatus =
      selectedStatus === "all" || m.status === selectedStatus;
    return matchesSearch && matchesProgram && matchesStatus;
  });

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteProgram) return;

    const newMember: CompanyMember = {
      id: `mem-${Date.now()}`,
      name: inviteName || inviteEmail.split("@")[0],
      email: inviteEmail,
      role: "Learner",
      assignedProgram: inviteProgram,
      programType: inviteProgram.includes("Track") ? "track" : "course",
      progressPercent: 0,
      competencyScore: 0,
      safetyScore: 100,
      loggedPracticalHours: 0,
      status: "Pending",
      joinedDate: new Date().toISOString().split("T")[0],
      lastActive: "Invitation Sent",
    };

    setMembers([newMember, ...members]);
    setIsInviteModalOpen(false);
    setInviteEmail("");
    setInviteName("");
    setToastMessage(`Invitation dispatched to ${inviteEmail} for ${inviteProgram}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const percentUsed = Math.round(
    (profile.seatCapacity.used / profile.seatCapacity.total) * 100
  );

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">
          <span className="flex size-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
            ✓
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Company Identity & Seat Allocation Banner */}
      <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-white via-purple-50/30 to-purple-50/60 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-purple-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700">
                {profile.tier}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                Admin: <strong className="text-gray-900">{profile.primaryAdmin.email}</strong>
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Corporate workforce management, seat allocation, and invitation dispatch.
            </p>

            {/* Assigned Catalog Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Allocated Programs:</span>
              {profile.assignedCatalog.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3 py-1 text-sm font-medium text-gray-800 shadow-2xs"
                >
                  <span className="size-1.5 rounded-full bg-purple-600" />
                  {cat.title} ({cat.activeLearners}/{cat.allocatedSeats} seats)
                </span>
              ))}
            </div>
          </div>

          {/* Seat Capacity Gauge Card */}
          <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs shrink-0 w-full lg:w-80">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-gray-600">Seat Capacity Utilization</span>
              <span className="text-purple-700 font-extrabold">{percentUsed}%</span>
            </div>
            <div className="mt-2 h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-600 transition-all"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
              <span>
                <strong className="text-gray-900 font-bold">{profile.seatCapacity.used}</strong> / {profile.seatCapacity.total} Seats Utilized
              </span>
              <span className="text-purple-600 font-semibold">
                {profile.seatCapacity.available} Available
              </span>
            </div>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
            >
              <span>+ Invite Student to Program</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roster Controls: Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Allocated Programs</option>
            {profile.assignedCatalog.map((cat) => (
              <option key={cat.id} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Certified">Certified</option>
            <option value="Pending">Pending Invite</option>
            <option value="Remediation Required">Remediation Required</option>
          </select>
        </div>

        <div className="text-sm text-gray-500 font-medium">
          Showing <strong>{filteredMembers.length}</strong> of {members.length} team members
        </div>
      </div>

      {/* Team Members Roster Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm min-w-[950px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Trainee</th>
                <th className="px-4 py-4 whitespace-nowrap">Enrolled Program</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Progress</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Competency Score</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Safety Rating</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Practical Hours</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Trainee Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white text-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Program */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-800">{member.assignedProgram}</span>
                    <span className="block text-sm text-gray-500 capitalize">{member.programType}</span>
                  </td>

                  {/* Progress Bar */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-bold text-gray-900">{member.progressPercent}%</span>
                      <div className="mt-1 h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-600"
                          style={{ width: `${member.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Non-GPA Practical Competency */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 font-bold ${
                        member.competencyScore >= 90
                          ? "bg-green-50 text-green-700"
                          : member.competencyScore >= 80
                          ? "bg-purple-50 text-purple-700"
                          : member.competencyScore === 0
                          ? "bg-gray-100 text-gray-500"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {member.competencyScore > 0 ? `${member.competencyScore}%` : "—"}
                    </span>
                  </td>

                  {/* Safety Score */}
                  <td className="px-4 py-4 text-center font-bold text-gray-800 whitespace-nowrap">
                    {member.safetyScore}%
                  </td>

                  {/* Practical Hours Logged */}
                  <td className="px-4 py-4 text-center font-semibold text-gray-700 whitespace-nowrap">
                    {member.loggedPracticalHours} hrs
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        member.status === "Certified"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : member.status === "Active"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : member.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => alert(`Resent invitation credentials to ${member.email}`)}
                        className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Resend
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${member.name} from ${profile.name}?`)) {
                            setMembers(members.filter((m) => m.id !== member.id));
                          }
                        }}
                        className="rounded-lg p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove member"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Student Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setIsInviteModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-7 shadow-2xl z-10">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Invite Student to {profile.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Select an allocated course or track to automatically enroll this trainee.
                </p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="mt-5 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Student Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="trainee@company.com"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Student Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Designated Course / Track Allocation *
                </label>
                <select
                  required
                  value={inviteProgram}
                  onChange={(e) => setInviteProgram(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                >
                  {profile.assignedCatalog.map((cat) => (
                    <option key={cat.id} value={cat.title}>
                      {cat.title} ({cat.allocatedSeats - cat.activeLearners} seats remaining)
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  The student will be bound to this specific training curriculum upon invite redemption.
                </p>
              </div>

              <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-3.5">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendVoucher}
                    onChange={(e) => setSendVoucher(e.target.checked)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="font-bold text-gray-900">
                      Issue Single-Use Voucher Code
                    </span>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Automatically generates and includes a 100% discount voucher in the invitation email.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-bold text-white hover:bg-purple-700 shadow-xs transition-colors"
                >
                  Send Invitation Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
