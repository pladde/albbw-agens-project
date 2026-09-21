import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { type Fahrrad } from '../types/Fahrrad';

interface FahrradFormProps {
  initialData?: Fahrrad | null;
  onSubmit: (data: Fahrrad) => void;
  onCancel?: () => void;
}

export const FahrradForm: React.FC<FahrradFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Fahrrad>({
    marke: '',
    rahmennummer: '',
    farbe: '',
    bearbeitungsstatus: '',
    kundeId: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        marke: initialData.marke || '',
        rahmennummer: initialData.rahmennummer || '',
        farbe: initialData.farbe || '',
        bearbeitungsstatus: initialData.bearbeitungsstatus || '',
        kundeId: initialData.kundeId || ''
      });
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '5px' }}>Marke</label>
        <input
          type="text"
          name="marke"
          placeholder="z.B. Canyon"
          value={formData.marke}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '5px' }}>Rahmennummer</label>
        <input
          type="text"
          name="rahmennummer"
          placeholder="z.B. RH-0815"
          value={formData.rahmennummer}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '5px' }}>Farbe</label>
        <input
          type="text"
          name="farbe"
          placeholder="z.B. rot"
          value={formData.farbe}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '5px' }}>Bearbeitungsstatus</label>
        <select
          name="bearbeitungsstatus"
          value={formData.bearbeitungsstatus}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Status wählen...</option>
          <option value="angenommen">angenommen</option>
          <option value="in Bearbeitung">in Bearbeitung</option>
          <option value="fertiggestellt">fertiggestellt</option>
          <option value="ausgegeben">ausgegeben</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '5px' }}>Kunde/Einrichtung</label>
        <select
          name="kundeId"
          value={formData.kundeId}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Musterkunde</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
          type="submit"
          style={{
            backgroundColor: '#4e73df',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {initialData ? 'Änderungen speichern' : 'senden'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              backgroundColor: '#858796',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Abbrechen
          </button>
        )}
      </div>
    </form>
  );
};