import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, BookUp, CornerDownLeft, Users, Library, Edit, Trash2, X } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('addBook');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  // Add Book State
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', genre: '', total_copies: 1 });

  // Issue Book State
  const [issueData, setIssueData] = useState({ membership_no: '', isbn: '', due_date: '' });

  // Return Book State
  const [returnId, setReturnId] = useState('');

  const fetchMembers = async () => {
    try {
      const res = await axios.get('https://lms-z8dd.onrender.com/api/members', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch members', err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get('https://lms-z8dd.onrender.com/api/books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'members') fetchMembers();
    if (tab === 'manageBooks') fetchBooks();
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://lms-z8dd.onrender.com/api/books', newBook, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg({ text: 'Book added successfully', type: 'success' });
      setNewBook({ title: '', author: '', isbn: '', genre: '', total_copies: 1 });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Error adding book', type: 'error' });
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://lms-z8dd.onrender.com/api/borrow', issueData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg({ text: 'Book issued successfully', type: 'success' });
      setIssueData({ membership_no: '', isbn: '', due_date: '' });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Error issuing book', type: 'error' });
    }
  };

  const handleReturnBook = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://lms-z8dd.onrender.com/api/borrow/${returnId}/return`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg({ text: `Book returned. Fine: $${res.data.fineAmount}`, type: 'success' });
      setReturnId('');
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Error returning book', type: 'error' });
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://lms-z8dd.onrender.com/api/books/${editingBook._id}`, editingBook, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg({ text: 'Book updated successfully', type: 'success' });
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Error updating book', type: 'error' });
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await axios.delete(`https://lms-z8dd.onrender.com/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg({ text: 'Book deleted successfully', type: 'success' });
      fetchBooks();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Error deleting book', type: 'error' });
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>

      {msg.text && (
        <div style={{ padding: '1rem', marginBottom: '2rem', borderRadius: '8px', background: msg.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: msg.type === 'success' ? '#4ade80' : '#f87171' }}>
          {msg.text}
        </div>
      )}

      <div className="tab-buttons">
        <button className={`btn ${activeTab === 'addBook' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleTabChange('addBook')}><Plus size={18} /> Add Book</button>
        <button className={`btn ${activeTab === 'manageBooks' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleTabChange('manageBooks')}><Library size={18} /> Manage Books</button>
        <button className={`btn ${activeTab === 'issueBook' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleTabChange('issueBook')}><BookUp size={18} /> Issue Book</button>
        <button className={`btn ${activeTab === 'returnBook' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleTabChange('returnBook')}><CornerDownLeft size={18} /> Return Book</button>
        <button className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleTabChange('members')}><Users size={18} /> Members</button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px' }}>
        {activeTab === 'addBook' && (
          <form onSubmit={handleAddBook}>
            <h3>Add New Book to Catalog</h3>
            <div className="input-group" style={{ marginTop: '1.5rem' }}>
              <label>Title</label>
              <input type="text" value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Author</label>
              <input type="text" value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} required />
            </div>
            <div className="flex-row-mobile-stack">
              <div className="input-group" style={{ flex: 1 }}>
                <label>ISBN</label>
                <input type="text" value={newBook.isbn} onChange={e => setNewBook({ ...newBook, isbn: e.target.value })} required />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Genre</label>
                <input type="text" value={newBook.genre} onChange={e => setNewBook({ ...newBook, genre: e.target.value })} />
              </div>
              <div className="input-group" style={{ width: '100px' }}>
                <label>Copies</label>
                <input type="number" min="1" value={newBook.total_copies} onChange={e => setNewBook({ ...newBook, total_copies: parseInt(e.target.value) })} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Book</button>
          </form>
        )}

        {activeTab === 'issueBook' && (
          <form onSubmit={handleIssueBook}>
            <h3>Issue Book to Member</h3>
            <div className="input-group" style={{ marginTop: '1.5rem' }}>
              <label>Member ID (Membership No)</label>
              <input type="text" value={issueData.membership_no} onChange={e => setIssueData({ ...issueData, membership_no: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Book ISBN</label>
              <input type="text" value={issueData.isbn} onChange={e => setIssueData({ ...issueData, isbn: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Due Date</label>
              <input type="date" value={issueData.due_date} onChange={e => setIssueData({ ...issueData, due_date: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary">Issue Book</button>
          </form>
        )}

        {activeTab === 'returnBook' && (
          <form onSubmit={handleReturnBook}>
            <h3>Process Book Return</h3>
            <div className="input-group" style={{ marginTop: '1.5rem' }}>
              <label>Borrow Record ID</label>
              <input type="text" value={returnId} onChange={e => setReturnId(e.target.value)} required placeholder="e.g. 64d9f..." />
              <small style={{ color: 'var(--text-muted)' }}>Found in member's dashboard</small>
            </div>
            <button type="submit" className="btn btn-success">Confirm Return</button>
          </form>
        )}
      </div>

      {activeTab === 'members' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>Library Members</h3>
          <div className="table-container" style={{ marginTop: '1.5rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Membership No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m._id}>
                    <td style={{ fontWeight: 600 }}>{m.membership_no}</td>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.phone}</td>
                    <td>{new Date(m.membership_expiry).toLocaleDateString()}</td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>No members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'manageBooks' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Manage Books</h3>
          </div>

          {editingBook && (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--surface-light)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0 }}>Edit Book</h4>
                <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => setEditingBook(null)}><X size={16} /></button>
              </div>
              <form onSubmit={handleUpdateBook}>
                <div className="flex-row-mobile-stack">
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Title</label>
                    <input type="text" value={editingBook.title} onChange={e => setEditingBook({ ...editingBook, title: e.target.value })} required />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Author</label>
                    <input type="text" value={editingBook.author} onChange={e => setEditingBook({ ...editingBook, author: e.target.value })} required />
                  </div>
                </div>
                <div className="flex-row-mobile-stack">
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>ISBN</label>
                    <input type="text" value={editingBook.isbn} onChange={e => setEditingBook({ ...editingBook, isbn: e.target.value })} required />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Genre</label>
                    <input type="text" value={editingBook.genre} onChange={e => setEditingBook({ ...editingBook, genre: e.target.value })} />
                  </div>
                  <div className="input-group" style={{ width: '100px' }}>
                    <label>Total Copies</label>
                    <input type="number" min="1" value={editingBook.total_copies} onChange={e => setEditingBook({ ...editingBook, total_copies: parseInt(e.target.value) })} required />
                  </div>
                  <div className="input-group" style={{ width: '100px' }}>
                    <label>Available</label>
                    <input type="number" min="0" value={editingBook.available_copies} onChange={e => setEditingBook({ ...editingBook, available_copies: parseInt(e.target.value) })} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Update Book</button>
              </form>
            </div>
          )}

          <div className="table-container" style={{ marginTop: '1.5rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Genre</th>
                  <th>Copies (Total/Avail)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 600 }}>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.isbn}</td>
                    <td>{b.genre}</td>
                    <td>{b.total_copies} / {b.available_copies}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => setEditingBook(b)} title="Edit"><Edit size={16} /></button>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.2)' }} onClick={() => handleDeleteBook(b._id)} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>No books found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
