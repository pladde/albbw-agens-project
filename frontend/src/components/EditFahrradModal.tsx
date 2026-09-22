import React from 'react';
import { type Fahrrad } from '../types/Fahrrad';
import { FahrradForm } from './FahrradForm';

interface EditFahrradModalProps {
  fahrrad: Fahrrad | null;
  onClose: () => void;
  onSave: (updatedData: Fahrrad) => void;
}

export const EditFahrradModal: React.FC<EditFahrradModalProps> = ({ fahrrad, onClose, onSave }) => {
  if (!fahrrad) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '25px',
          borderRadius: '8px',
          width: '450px',
          maxWidth: '90%',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
          Fahrrad ID {fahrrad.id} bearbeiten
        </h2>

        <FahrradForm
          initialData={fahrrad}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};