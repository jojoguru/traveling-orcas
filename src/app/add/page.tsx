'use client';

import { Suspense } from 'react';
import EntryForm from '@/components/EntryForm';

function AddEntryForm() {
  return (
    <EntryForm />
  );
}

// Loading fallback component
function AddEntryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add Entry</h1>
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg w-full mb-4"></div>
        <div className="h-32 bg-gray-200 rounded-lg w-full mb-4"></div>
        <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );
}

export default function AddPage() {
  return (
    <Suspense fallback={<AddEntryLoading />}>
      <AddEntryForm />
    </Suspense>
  );
} 