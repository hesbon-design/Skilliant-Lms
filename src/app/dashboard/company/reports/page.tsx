"use client";

import React, { useState } from "react";
import { mockCompanyMembers, mockCompanyProfile, CompanyMember } from "@/data/companyData";

export default function CompanyReportsPage() {
  const [members] = useState<CompanyMember[]>(mockCompanyMembers);
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Non-GPA aggregate calculations
  const activeMembers = members.filter((m) => m.status !== "Pending");
  const avgCompetency = Math.round(
    activeMembers.reduce((acc, m) => acc + m.competencyScore, 0) / (activeMembers.length || 1)
  );
  const avgSafety = Math.round(
    activeMembers.reduce((acc, m) => acc + m.safetyScore, 0) / (activeMembers.length || 1)
  );
  const totalPracticalHours = members.reduce((acc, m) => acc + m.loggedPracticalHours, 0);
  const certifiedCount = members.filter((m) => m.status === "Certified").length;
  const certificationRate = Math.round((certifiedCount / (members.length || 1)) * 100);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "TraineeName,Email,AssignedProgram,CompetencyScore,SafetyScore,PracticalHours,Status\n" +
      members
        .map(
          (m) =>
            `"${m.name}","${m.email}","${m.assignedProgram}","${m.competencyScore}%","${m.safetyScore}%","${m.loggedPracticalHours} hrs","${m.status}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apex_compliance_matrix_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Team Compliance &amp; Competency Matrix
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-world performance audits, zero-fault safety adherence, and practical hours logged across {mockCompanyProfile.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors"
          >
            <span>📥 Export Audit CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
          >
            <span>🖨 Print Audit PDF</span>
          </button>
        </div>
      </div>

      {/* Non-GPA Core Competency Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Practical Competency Score */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Practical Competency</span>
            <span className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
              Benchmark ≥85%
            </span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-purple-600">{avgCompetency}%</p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-purple-600" style={{ width: `${avgCompetency}%` }} />
          </div>
          <p className="mt-2 text-sm text-gray-500">Mastery rate across verified hands-on drills</p>
        </div>

        {/* Safety & Compliance Score */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Safety &amp; Compliance</span>
            <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
              Zero-Fault Target
            </span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">{avgSafety}%</p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-green-500" style={{ width: `${avgSafety}%` }} />
          </div>
          <p className="mt-2 text-sm text-gray-500">Procedural accuracy &amp; hazard checklists</p>
        </div>

        {/* Practical Hours Logged */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Logged Practical Hours</span>
            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
              Verified
            </span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">{totalPracticalHours} hrs</p>
          <p className="mt-1 text-sm text-gray-500">Machine operation, road driving &amp; simulator hours</p>
        </div>

        {/* Verified Certification Rate */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Full Certification Rate</span>
            <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
              {certifiedCount} of {members.length}
            </span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-purple-600">{certificationRate}%</p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-purple-600" style={{ width: `${certificationRate}%` }} />
          </div>
          <p className="mt-2 text-sm text-gray-500">Trainees holding tamper-proof digital licenses</p>
        </div>
      </div>

      {/* Program Breakdown Cards */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Curriculum &amp; Program Performance Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mockCompanyProfile.assignedCatalog.map((cat) => {
            const catMembers = members.filter((m) => m.assignedProgram === cat.title);
            const catCertified = catMembers.filter((m) => m.status === "Certified").length;
            const catAvg =
              catMembers.length > 0
                ? Math.round(
                    catMembers.reduce((acc, m) => acc + m.competencyScore, 0) / catMembers.length
                  )
                : 0;

            return (
              <div key={cat.id} className="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 uppercase">
                    {cat.type}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{catCertified} Certified</span>
                </div>
                <h3 className="mt-2 font-bold text-gray-900 text-sm leading-snug">{cat.title}</h3>

                <div className="mt-4 space-y-2 text-sm border-t border-gray-50 pt-3">
                  <div className="flex justify-between text-gray-500">
                    <span>Enrolled Cohort:</span>
                    <strong className="text-gray-900">{catMembers.length} Trainees</strong>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Average Competency:</span>
                    <strong className="text-purple-700 font-extrabold">{catAvg}%</strong>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Safety Benchmark:</span>
                    <strong className="text-green-700">100% Zero-Fault Standard</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Trainee Compliance Audit Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
        <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-bold text-gray-900">
            Trainee Verification &amp; Competency Audit Trail
          </h3>
          <span className="text-sm text-gray-500 font-medium">
            Authorized by Apex Industrial Logistics &bull; Complies with OSHA &amp; ISO 9001 Guidelines
          </span>
        </div>

        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm min-w-[950px]">
            <thead className="border-b border-gray-100 bg-gray-50/40 text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Trainee</th>
                <th className="px-4 py-4 whitespace-nowrap">Assigned Curriculum</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Competency Rating</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Safety Adherence</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Logged Hours</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Verification Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-800">{member.assignedProgram}</span>
                  </td>

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

                  <td className="px-4 py-4 text-center font-bold text-gray-900 whitespace-nowrap">
                    {member.safetyScore}%
                  </td>

                  <td className="px-4 py-4 text-center font-semibold text-gray-700 whitespace-nowrap">
                    {member.loggedPracticalHours} hrs
                  </td>

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
                      {member.status === "Certified" ? "✓ Certified Competent" : member.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => alert(`Generated compliance transcript for ${member.name}`)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-purple-300 transition-colors"
                    >
                      View Logbook
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
