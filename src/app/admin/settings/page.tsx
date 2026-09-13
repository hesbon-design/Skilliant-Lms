"use client";

import React, { useState } from "react";
import { initialPlatformSettings, PlatformSettingsState } from "@/data/adminGovernanceData";

type SettingsTab = "general" | "governance" | "payments" | "security" | "ai" | "media";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [settings, setSettings] = useState<PlatformSettingsState>(initialPlatformSettings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Platform settings updated successfully!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">
          <span className="flex size-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
            ✓
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Super Admin Platform Settings
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
        {[
          { id: "general", label: "General & Branding" },
          { id: "governance", label: "Course Governance" },
          { id: "payments", label: "Payments & Tax" },
          { id: "security", label: "Security & Sessions" },
          { id: "ai", label: "AI Studio Engine" },
          { id: "media", label: "Media Storage & APIs" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {/* TAB 1: GENERAL & BRANDING */}
        {activeTab === "general" && (
          <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-xs space-y-6 text-sm">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Platform Identity &amp; Tenant Branding
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Platform Display Name</label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Support Email Address</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={settings.brandTagline}
                  onChange={(e) => setSettings({ ...settings, brandTagline: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Platform Maintenance Mode</h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    When enabled, restricts public and student access with a maintenance banner while keeping the Studio (/admin) operational.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {settings.maintenanceMode && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Maintenance Notice Text</label>
                  <textarea
                    rows={2}
                    value={settings.maintenanceNotice}
                    onChange={(e) => setSettings({ ...settings, maintenanceNotice: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COURSE GOVERNANCE */}
        {activeTab === "governance" && (
          <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-xs space-y-6 text-sm">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Instructor Publishing &amp; Retake Governance
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                <div>
                  <h4 className="font-bold text-gray-900">Require Super Admin Approval for Course Publishing</h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    When active, courses created by instructors enter a &ldquo;Pending Review&rdquo; queue before going live on the catalog.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireAdminApproval}
                  onChange={(e) => setSettings({ ...settings, requireAdminApproval: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 size-4"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                <div>
                  <h4 className="font-bold text-gray-900">Allow Instructors to Reset Learner Attempts</h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Permits instructors to grant additional quiz and practical submission retakes to individual students.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowInstructorResetProgress}
                  onChange={(e) => setSettings({ ...settings, allowInstructorResetProgress: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 size-4"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                <div>
                  <h4 className="font-bold text-gray-900">Global Course Retake Policy</h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Enables learners who completed a course to retake drills to improve their competency score rating.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.courseRetakePolicy}
                  onChange={(e) => setSettings({ ...settings, courseRetakePolicy: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 size-4"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENTS & TAX */}
        {activeTab === "payments" && (
          <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-xs space-y-6 text-sm">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Payment Gateways &amp; Offline Billing Controls
            </h3>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Stripe Publishable Key</label>
                <input
                  type="text"
                  value={settings.stripePublishableKey}
                  onChange={(e) => setSettings({ ...settings, stripePublishableKey: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Stripe Secret Key</label>
                <input
                  type="password"
                  value={settings.stripeSecretKey}
                  onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-purple-100 bg-purple-50/40 p-4">
              <div>
                <h4 className="font-bold text-gray-900">Enable Manual / Pay Later (Invoice &amp; PO Option)</h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  Allows institutional and enterprise clients to checkout with purchase orders, bank wires, or offline billing.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.manualPaymentEnabled}
                onChange={(e) => setSettings({ ...settings, manualPaymentEnabled: e.target.checked })}
                className="rounded text-purple-600 focus:ring-purple-500 size-4"
              />
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & SESSIONS */}
        {activeTab === "security" && (
          <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-xs space-y-6 text-sm">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Session Security &amp; Content Copy Protection
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                <div>
                  <h4 className="font-bold text-gray-900">Enforce Concurrent Session Limiting (1 Active Login)</h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Strictly limits each account to 1 concurrent active browser session, preventing employee password sharing.
                  </p>
                </div>
                <span className="rounded-md bg-purple-100 px-2.5 py-1 font-semibold text-purple-700 text-xs">
                  Enforced (1 Session)
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                <div>
                  <h4 className="font-bold text-gray-900">Proprietary Content Copy Protection</h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Disables text highlighting, right-click context menus, and inspect-element keyboard shortcuts on course materials.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.contentCopyProtection}
                  onChange={(e) => setSettings({ ...settings, contentCopyProtection: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 size-4"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                <div>
                  <h4 className="font-bold text-gray-900">Mandatory Email Verification Before Access</h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Requires trainees to confirm their corporate email address before starting lesson player playback.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailVerificationRequired}
                  onChange={(e) => setSettings({ ...settings, emailVerificationRequired: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 size-4"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AI STUDIO ENGINE */}
        {activeTab === "ai" && (
          <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-xs space-y-6 text-sm">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Google Gemini API &amp; AI Studio Integration
            </h3>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">AI Provider Engine</label>
                <select
                  value={settings.aiProvider}
                  onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value as "gemini" | "openai" })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                >
                  <option value="gemini">Google Gemini API (Recommended)</option>
                  <option value="openai">OpenAI GPT-4o</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">AI API Key</label>
                <input
                  type="password"
                  value={settings.aiApiKey}
                  onChange={(e) => setSettings({ ...settings, aiApiKey: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.aiAutoDraftQuizzes}
                  onChange={(e) => setSettings({ ...settings, aiAutoDraftQuizzes: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="font-semibold text-gray-800">
                  Enable AI Quiz Question Generator (Generates randomized banks from lesson transcripts)
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.aiLessonSummaries}
                  onChange={(e) => setSettings({ ...settings, aiLessonSummaries: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="font-semibold text-gray-800">
                  Enable AI Lesson Key Takeaways &amp; Executive Summary generation
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.aiTutorAssistant}
                  onChange={(e) => setSettings({ ...settings, aiTutorAssistant: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="font-semibold text-gray-800">
                  Enable Learner Interactive AI Tutor in player HUD
                </span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 6: MEDIA STORAGE & APIS */}
        {activeTab === "media" && (
          <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-xs space-y-6 text-sm">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              High-Throughput Enterprise Video &amp; Cloud Storage
            </h3>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Cloud Storage Provider</label>
                <select
                  value={settings.storageProvider}
                  onChange={(e) => setSettings({ ...settings, storageProvider: e.target.value as "r2" | "s3" | "bunny" })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                >
                  <option value="r2">Cloudflare R2 (Zero Egress Fees)</option>
                  <option value="s3">Amazon Web Services (AWS S3)</option>
                  <option value="bunny">BunnyCDN Stream Storage</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Storage Bucket Name</label>
                <input
                  type="text"
                  value={settings.storageBucketName}
                  onChange={(e) => setSettings({ ...settings, storageBucketName: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">YouTube Data API Key (Optional)</label>
                <input
                  type="password"
                  value={settings.youtubeApiKey}
                  onChange={(e) => setSettings({ ...settings, youtubeApiKey: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                  placeholder="For automated video duration detection"
                />
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-purple-600 px-7 py-3 text-sm font-bold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">Save All Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
