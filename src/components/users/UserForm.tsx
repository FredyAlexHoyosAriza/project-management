'use client';

import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@/graphql/mutations/createUser';
import { useState } from 'react';

export default function UserForm() {
  const [createUser] = useMutation(CREATE_USER);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser({ variables: { input: formData } });
    setFormData({ name: '', email: '' }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button type="submit">Crear Usuario</button>
    </form>
  );
}
