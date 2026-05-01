import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MemberDashboard = () => {
  const { token, user } = useContext(AuthContext);
  const [borrows, setBorrows] = useState([]);
  const [fines, setFines] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const borrowRes = await axios.get('https://lms-z8dd.onrender.com/api/borrow/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBorrows(borrowRes.data);

      const fineRes = await axios.get('https://lms-z8dd.onrender.com/api/fines/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFines(fineRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>My Dashboard</h2>

      <div className="dashboard-grid">

        {/* Borrows Section */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Borrow History</h3>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Record ID</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map(b => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 500 }}>{b.book_id?.title || 'Unknown'}</td>
                    <td>{formatDate(b.borrow_date)}</td>
                    <td>{formatDate(b.due_date)}</td>
                    <td>
                      <span className={`badge ${b.status === 'borrowed' ? 'badge-warning' : b.status === 'returned' ? 'badge-success' : 'badge-danger'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{b._id}</td>
                  </tr>
                ))}
                {borrows.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No borrowing history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fines Section */}
        <div className="glass-panel" style={{ padding: '2rem', alignSelf: 'start' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>My Fines</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {fines.map(f => (
              <div key={f._id} style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', borderLeft: `4px solid ${f.paid ? '#22c55e' : '#ef4444'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>${f.amount.toFixed(2)}</span>
                  <span className={`badge ${f.paid ? 'badge-success' : 'badge-danger'}`}>{f.paid ? 'Paid' : 'Unpaid'}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  For book: {f.borrow_id?.book_id?.title || 'Unknown'}
                </div>
              </div>
            ))}
            {fines.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                You have no fines!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
