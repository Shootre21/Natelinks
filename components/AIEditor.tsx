
import React, { useState } from 'react';
import { updateProfileWithAI } from '../services/geminiService';
import { ProfileData } from '../types';

interface AIEditorProps {
  profile: ProfileData;
  onUpdate: (newProfile: ProfileData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AIEditor: React.FC<AIEditorProps> = ({ profile, onUpdate, isOpen, onClose }) => {
  const [instruction, setInstruction] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;

    setIsUpdating(true);
    setError(null);
    try {
      const updatedProfile = await updateProfileWithAI(profile, instruction);
      onUpdate(updatedProfile);
      setInstruction('');
      onClose();
    } catch (err) {
      setError("AI update failed. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-700 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-purple-400">✨</span> Edit with Shootre AI
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-400">
            Tell Shootre what to change. E.g., "Change background to ocean blue", "Add a link to my GitHub", "Update my bio to talk about photography".
          </p>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Type your changes here..."
            disabled={isUpdating}
          />
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={isUpdating || !instruction.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isUpdating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Working magic...
              </>
            ) : (
              'Apply Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
