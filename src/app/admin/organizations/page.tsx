"use client";

import React, { useState } from "react";
import { mockOrganizations, OrganizationRecord } from "@/data/adminGovernanceData";

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>(mockOrganizations);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationRecord | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    adminName: "",
    adminEmail: "",
    seatsAllocated: 25,
    assignedCourses: ["Industrial Machine Operator Track"],
    status: "Active" as "Active" | "Trial" | "Suspended",
    mrr: 2000,
  });

  const availableCourses = [
    "Industrial Machine Operator Track",
    "Forklift Safety & Zero-Fault Inspection",
    "Commercial Fleet Defensive Driving",
    "Hazardous Materials Transport Compliance",
    "Complete React Developer Course",
    "Next.js Full Stack Bootcamp",
    "JavaScript Mastery",
  ];

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.adminEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSeats = organizations.reduce((acc, o) => acc + o.seatsAllocated, 0);
  const usedSeats = organizations.reduce((acc, o) => acc + o.seatsUsed, 0);
  const totalMRR = organizations.reduce((acc, o) => acc + o.mrr, 0);

  const handleOpenCreateModal = () => {
    setEditingOrg(null);
    setFormData({
      name: "",
      domain: "",
      adminName: "",
      adminEmail: "",
      seatsAllocated: 25,
      assignedCourses: ["Industrial Machine Operator Track"],
      status: "Active",
      mrr: 2250,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (org: OrganizationRecord) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      domain: org.domain,
      adminName: org.adminName,
      adminEmail: org.adminEmail,
      seatsAllocated: org.seatsAllocated,
      assignedCourses: org.assignedCourses,
      status: org.status,
      mrr: org.mrr,
    });
    setIsModalOpen(true);
  };

  const handleSaveOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.adminEmail) return;

    if (editingOrg) {
      setOrganizations((prev) =>
        prev.map((o) =>
          o.id === editingOrg.id
            ? {
                ...o,
                name: formData.name,
                domain: formData.domain,
                adminName: formData.adminName,
                adminEmail: formData.adminEmail,
                seatsAllocated: formData.seatsAllocated,
                assignedCourses: formData.assignedCourses,
                status: formData.status,
                mrr: formData.mrr,
              }
            : o
        )
      );
    } else {
      const newOrg: OrganizationRecord = {
        id: `org-${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        domain: formData.domain || `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        seatsAllocated: formData.seatsAllocated,
        seatsUsed: 0,
        status: formData.status,
        assignedCourses: formData.assignedCourses,
        contractRenewal: "2027-09-01",
        mrr: formData.mrr,
      };
      setOrganizations([newOrg, ...organizations]);
    }
    setIsModalOpen(false);
  };

  const handleToggleCourse = (course: string) => {
    setFormData((prev) => {
      const exists = prev.assignedCourses.includes(course);
      return {
        ...prev,
        assignedCourses: exists
          ? prev.assignedCourses.filter((c) => c !== course)
          : [...prev.assignedCourses, course],
      };
    });
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Organization &amp; B2B Company Management
          </h1>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
        >
          <span className="whitespace-nowrap">+ Provision New Company</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Enterprise Accounts</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">{organizations.length}</p>
          <p className="mt-1 text-sm text-green-700 font-medium">100% active retention rate</p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Total Contracted Seats</p>
          <p className="mt-2 text-3xl font-extrabold text-purple-600">{totalSeats}</p>
          <p className="mt-1 text-sm text-gray-500">{usedSeats} active learner seats utilized</p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Seat Utilization</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">
            {Math.round((usedSeats / (totalSeats || 1)) * 100)}%
          </p>
          <p className="mt-1 text-sm text-gray-500">{totalSeats - usedSeats} open seats across all companies</p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">B2B Monthly Revenue</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">${totalMRR.toLocaleString()}</p>
          <p className="mt-1 text-sm text-gray-500">Contracted recurring invoiced volume</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search companies by name, domain, or admin email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses ({organizations.length})</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <div className="text-sm text-gray-500 font-medium">
          Showing <strong>{filteredOrgs.length}</strong> organizations
        </div>
      </div>

      {/* Organizations Directory Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm min-w-[950px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Company Name &amp; Domain</th>
                <th className="px-4 py-4 whitespace-nowrap">Primary Admin</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Seat Capacity</th>
                <th className="px-4 py-4 whitespace-nowrap">Assigned Courses &amp; Tracks</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Renewal</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredOrgs.map((org) => {
                const util = Math.round((org.seatsUsed / org.seatsAllocated) * 100);
                return (
                  <tr key={org.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Company info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-gray-900 text-sm">{org.name}</p>
                      <p className="text-sm text-gray-500">{org.domain}</p>
                    </td>

                    {/* Admin */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="font-semibold text-gray-900">{org.adminName}</p>
                      <p className="text-sm text-gray-500">{org.adminEmail}</p>
                    </td>

                    {/* Capacity */}
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-bold text-gray-900">
                          {org.seatsUsed} / {org.seatsAllocated}
                        </span>
                        <div className="mt-1 h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-purple-600"
                            style={{ width: `${util}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 mt-0.5">{util}% filled</span>
                      </div>
                    </td>

                    {/* Catalog */}
                    <td className="px-4 py-4 min-w-[200px] whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {org.assignedCourses.map((c, i) => (
                          <span
                            key={i}
                            className="inline-block rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 border border-purple-100 whitespace-nowrap"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Renewal */}
                    <td className="px-4 py-4 text-center font-medium text-gray-600 whitespace-nowrap">
                      {org.contractRenewal}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${
                          org.status === "Active"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : org.status === "Trial"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {org.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(org)}
                          className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-purple-300 transition-colors whitespace-nowrap shrink-0"
                        >
                          <span className="whitespace-nowrap">Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Suspend access for ${org.name}?`)) {
                              setOrganizations(
                                organizations.map((o) =>
                                  o.id === org.id
                                    ? { ...o, status: o.status === "Suspended" ? "Active" : "Suspended" }
                                    : o
                                )
                              );
                            }
                          }}
                          className="rounded-xl p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap shrink-0"
                          title="Toggle status"
                        >
                          <span className="whitespace-nowrap">{org.status === "Suspended" ? "Activate" : "Suspend"}</span>
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

      {/* Provision / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-xl rounded-3xl border border-gray-100 bg-white p-7 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold text-gray-900">
                {editingOrg ? `Edit ${editingOrg.name}` : "Provision New B2B Organization"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOrganization} className="mt-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Company Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="e.g. Apex Industrial Logistics"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Corporate Domain</label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="e.g. apexlogistics.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Admin Contact Name</label>
                  <input
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="e.g. Hesbon Ombati"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Admin Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="admin@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Seat Capacity Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.seatsAllocated}
                    onChange={(e) => setFormData({ ...formData, seatsAllocated: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Trial" | "Suspended" })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Trial">Trial</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Course Allocation Selector */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Allocated Training Catalog (Select Programs this company can access)
                </label>
                <div className="space-y-2 rounded-2xl border border-gray-200 bg-gray-50/50 p-4 max-h-40 overflow-y-auto">
                  {availableCourses.map((c) => {
                    const isSelected = formData.assignedCourses.includes(c);
                    return (
                      <label key={c} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleCourse(c)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className={`text-sm ${isSelected ? "font-bold text-purple-900" : "text-gray-700"}`}>
                          {c}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-600 whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Cancel</span>
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 font-bold text-white hover:bg-purple-700 shadow-xs whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">{editingOrg ? "Update Organization" : "Provision Company"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
