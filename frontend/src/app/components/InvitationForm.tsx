import { useState } from 'react';

export default function InvitationForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('TEACHER');
  const [invitationData, setInvitationData] = useState({ token: '', link: '' });
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setInvitationData({ token: '', link: '' });
  setUserCreated(false);
  setLoading(true);

  try {
    if (!email || !firstName || !lastName) {
      throw new Error('All fields are required');
    }

    const token = localStorage.getItem('token');
    const response = await fetch('/api/admin/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, role }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    setInvitationData(data);

    const createResponse = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, fullName: `${firstName} ${lastName}`, password: 'defaultpassword', role }),
    });

    if (!createResponse.ok) throw new Error(`User creation failed! status: ${createResponse.status}`);
    setUserCreated(true);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An unexpected error occurred');
  } finally {
    setLoading(false);
  }
};
}