import { useEffect, useState } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch('/api/announcements', { signal: controller.signal });
        if (!response.ok) throw new Error('Unable to fetch announcements');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Unexpected API response');
        setAnnouncements(data);
        setStatus('success');
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Admin announcements request failed:', error);
          setStatus('error');
        }
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <main className="admin-dashboard">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">RUPA / LOCAL DEVELOPMENT</p>
            <h1>Announcements dashboard</h1>
            <p>Read-only overview of the announcements currently stored in SQLite.</p>
          </div>
          <a className="admin-back" href="/">Back to RUPA ↗</a>
        </header>

        {status === 'loading' && <p className="admin-message" role="status">Loading announcements…</p>}
        {status === 'error' && (
          <p className="admin-message" role="alert">
            Could not load announcements. Check that Flask is running on port 5000 and refresh.
          </p>
        )}
        {status === 'success' && (
          <>
            <div className="admin-summary">
              <span>Stored announcements</span>
              <strong>{announcements.length}</strong>
            </div>
            {announcements.length === 0 ? (
              <p className="admin-message">No announcements are stored yet.</p>
            ) : (
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Publisher</th>
                      <th scope="col">Category</th>
                      <th scope="col">Published</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map((item) => (
                      <tr key={item.id}>
                        <td><strong>{item.title}</strong><small>{item.id}</small></td>
                        <td>{item.publisher}</td>
                        <td>{item.category}</td>
                        <td><time dateTime={item.publishedAt}>{item.dateLabel}</time></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        <p className="admin-note">
          Development preview only. This page has no admin authentication or editing controls.
          Do not expose management APIs publicly.
        </p>
      </div>
    </main>
  );
}
