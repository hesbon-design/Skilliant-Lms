"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { initialCertificates, AdminCertificate } from "@/data/adminCertificatesData";
import {
  ClassicBorderSvg,
  ModernBorderSvg,
  CorporateBorderSvg,
  TechnicalBorderSvg,
  OfficialSealSvg,
  GoldMedallionSvg,
  QrCodeSvg,
  AuthorizedSignatureSvg,
  OrnateDividerSvg,
  GuillocheWatermarkSvg,
} from "@/components/certificates/CertificateSvgs";

function CertificateVerifyContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [inputCode, setInputCode] = useState(initialCode);
  const [searchedCode, setSearchedCode] = useState(initialCode);
  const [matchedCert, setMatchedCert] = useState<AdminCertificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleLookup(initialCode);
    }
  }, [initialCode]);

  const handleLookup = (codeToSearch: string) => {
    const trimmed = codeToSearch.trim().toUpperCase();
    setSearchedCode(trimmed);
    setHasSearched(true);

    if (!trimmed) {
      setMatchedCert(null);
      return;
    }

    const found = initialCertificates.find(
      (c) => c.code.toUpperCase() === trimmed || c.id.toLowerCase() === trimmed.toLowerCase()
    );
    setMatchedCert(found || null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(inputCode);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 hover:text-purple-700 transition-colors"
          >
            <span>← Return to Skilliant Academy</span>
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3.5 py-1 text-xs font-bold text-purple-700 border border-purple-100">
            <span className="size-2 rounded-full bg-purple-600" />
            Official Credential Verification Hub
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Verify Certificate Authenticity
          </h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Validate verified micro-credentials, executive specializations, and professional diplomas issued by Skilliant Global Academy.
          </p>
        </div>

        {/* Search Box */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Credential ID (e.g. SKL-CERT-WD01)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3 pl-4 pr-10 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none uppercase"
              />
              {inputCode && (
                <button
                  type="button"
                  onClick={() => {
                    setInputCode("");
                    setMatchedCert(null);
                    setHasSearched(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-bold"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-[#7D52F4] px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
            >
              Verify Credential
            </button>
          </form>

          {/* Quick test credentials */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="font-semibold">Sample Credentials:</span>
            {["SKL-CERT-WD01", "SKL-CERT-PDS02", "SKL-CERT-FKL03"].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setInputCode(sample);
                  handleLookup(sample);
                }}
                className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono font-semibold text-gray-700 hover:border-purple-300 hover:text-purple-700 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Result Area */}
        {hasSearched && matchedCert && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Verification Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-emerald-900 text-base">
                    Official Verified Credential
                  </h3>
                  <p className="text-xs text-emerald-700">
                    This certification record is registered, authentic, and securely validated in the Skilliant registry.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0"
                >
                  🖨️ Print / Save PDF
                </button>
              </div>
            </div>

            {/* Credential Attributes Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
                <span className="text-xs font-semibold uppercase text-gray-400">Recipient</span>
                <p className="mt-1 font-bold text-gray-900 text-sm">Alex Taylor</p>
                <span className="text-[11px] text-gray-500">Student ID: SKL-ST-9281</span>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
                <span className="text-xs font-semibold uppercase text-gray-400">Credential ID</span>
                <p className="mt-1 font-mono font-bold text-purple-700 text-sm">{matchedCert.code}</p>
                <span className="text-[11px] text-gray-500">Issued: {matchedCert.createdAt}</span>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
                <span className="text-xs font-semibold uppercase text-gray-400">Course / Program</span>
                <p className="mt-1 font-bold text-gray-900 text-sm line-clamp-1">{matchedCert.courseTitle}</p>
                <span className="text-[11px] text-emerald-600 font-semibold">Passing: {matchedCert.passingScore}% min</span>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
                <span className="text-xs font-semibold uppercase text-gray-400">Head of Institution</span>
                <p className="mt-1 font-bold text-gray-900 text-sm">{matchedCert.signatoryName}</p>
                <span className="text-[11px] text-gray-500">{matchedCert.organization}</span>
              </div>
            </div>

            {/* Live Visual Certificate Simulation */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
              {/* Central Guilloche Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <GuillocheWatermarkSvg className="size-96 text-purple-400" />
              </div>

              {/* Template Border SVG */}
              <div className="absolute inset-4 pointer-events-none">
                {matchedCert.templateStyle === "Classic Border" && (
                  <ClassicBorderSvg className="size-full text-amber-500/80" />
                )}
                {matchedCert.templateStyle === "Modern Geometric" && (
                  <ModernBorderSvg className="size-full text-purple-600/80" />
                )}
                {matchedCert.templateStyle === "Technical Excellence" && (
                  <TechnicalBorderSvg className="size-full text-teal-600/80" />
                )}
                {matchedCert.templateStyle === "Corporate Crest" && (
                  <CorporateBorderSvg className="size-full text-indigo-900/80" />
                )}
              </div>

              {/* Certificate Typography & Content */}
              <div className="relative z-10 text-center py-8 sm:py-12 px-6 sm:px-14 space-y-6">
                {/* Organization Branding */}
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold tracking-[0.25em] text-purple-700 uppercase block">
                    {matchedCert.organization}
                  </span>
                  <p className="text-xs font-serif text-gray-500 italic">
                    Faculty of Continuing Education & Professional Certification
                  </p>
                </div>

                {/* Certificate Main Title */}
                <div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
                    Certificate of Excellence
                  </h2>
                  <div className="flex justify-center mt-2">
                    <OrnateDividerSvg className="w-56 h-5 text-amber-500" />
                  </div>
                </div>

                {/* Recipient */}
                <div className="space-y-1 pt-2">
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
                    This Diploma is proudly conferred upon
                  </p>
                  <p className="text-2xl sm:text-3xl font-serif font-extrabold text-gray-900 tracking-wide">
                    Alex Taylor
                  </p>
                  <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed pt-1">
                    for verified mastery, rigorous coursework completion, and fulfilling all institutional graduation requirements for:
                  </p>
                  <p className="text-base sm:text-lg font-bold text-[#7D52F4] pt-1">
                    {matchedCert.courseTitle}
                  </p>
                </div>

                {/* Footer Signatures, Medallion, Seal & QR Code */}
                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
                  {/* Authorized Signatory */}
                  <div className="text-center sm:text-left space-y-1">
                    <AuthorizedSignatureSvg className="w-40 h-12 text-gray-800" />
                    <div className="w-44 border-t border-gray-300 pt-1">
                      <p className="font-bold text-xs text-gray-900">{matchedCert.signatoryName}</p>
                      <p className="text-[10px] text-gray-500">{matchedCert.signatoryTitle}</p>
                      <p className="text-[9px] text-gray-400">{matchedCert.organization}</p>
                    </div>
                  </div>

                  {/* Center Medallion & Seal */}
                  <div className="flex items-center gap-4">
                    <GoldMedallionSvg className="size-16" />
                    <OfficialSealSvg className="size-16 text-purple-700" />
                  </div>

                  {/* QR Code & Credential Code */}
                  <div className="text-center sm:text-right space-y-1 flex flex-col items-center sm:items-end">
                    <QrCodeSvg className="size-14 text-gray-800" />
                    <div className="pt-1">
                      <p className="font-mono text-xs font-bold text-gray-800">{matchedCert.code}</p>
                      <p className="text-[10px] text-gray-500">Validity: {matchedCert.validity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fallback Not Found State */}
        {hasSearched && !matchedCert && (
          <div className="rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-xs space-y-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 font-bold text-xl mx-auto">
              ✕
            </div>
            <h3 className="text-lg font-bold text-gray-900">Credential Not Found</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              No matching certificate record was found for ID <span className="font-mono font-bold text-rose-600">"{searchedCode}"</span>. Please check for typos or contact the issuing authority.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CertificateVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-sm font-medium text-gray-500">Loading Certificate Registry...</div>}>
      <CertificateVerifyContent />
    </Suspense>
  );
}
