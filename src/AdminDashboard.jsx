import { useEffect, useState } from 'react';
import './AdminDashboard.css';

const emptyForm = {
  id: '',
  title: '',
  publisher: '',
  publishedAt: '',
  category: '',
  summary: '',
  url: '',
};

export default function AdminDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function createAnnouncement(event) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setFormError('');
    setFormMessage('');

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || 'Could not create announcement');
      }

      setAnnouncements((current) => [result, ...current].sort(
        (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id)
      ));
      setStatus('success');
      setForm(emptyForm);
      setFormMessage('Announcement saved successfully.');
    } catch (error) {
      setFormError(error.message || 'Could not create announcement.');
    } finally {
      setSaving(false);
    }
  }

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
            <p>Manage announcements stored in SQLite during local development.</p>
          </div>
          <a className="admin-back" href="/">Back to RUPA ↗</a>
        </header>

        <section className="admin-create" aria-labelledby="admin-create-heading">
          <h2 id="admin-create-heading">Create announcement</h2>
          <p>Add a curated announcement with a link to its original source.</p>
          <form onSubmit={createAnnouncement} className="admin-create-form">
            <div className="admin-form-grid">
              {[
                { name: 'id', label: 'Unique ID', placeholder: 'example-ai-release', maxLength: 100, pattern: '[a-z0-9]+(-[a-z0-9]+)*' },
                { name: 'title', label: 'Title', placeholder: 'Announcement title', maxLength: 200 },
                { name: 'publisher', label: 'Publisher', placeholder: 'Official publisher', maxLength: 120 },
                { name: 'publishedAt', label: 'Publication date', type: 'date' },
                { name: 'category', label: 'Category', placeholder: 'MODEL RELEASE', maxLength: 80 },
                { name: 'url', label: 'Original source URL', type: 'url', placeholder: 'https://example.com/article', maxLength: 2048 },
              ].map((field) => (
                <label className="admin-field" key={field.name}>
                  <span>{field.label}</span>
                  <input
                    name={field.name}
                    type={field.type || 'text'}
                    value={form[field.name]}
                    onChange={updateField}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    pattern={field.pattern}
                    required
                  />
                </label>
              ))}
            </div>
            <label className="admin-field admin-summary-field">
              <span>Summary</span>
              <textarea name="summary" value={form.summary} onChange={updateField} rows={4} maxLength={2000} required placeholder="Briefly explain what was announced." />
            </label>
            <div className="admin-form-actions">
              <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Create announcement'}</button>
              {formMessage && <p className="admin-form-success" role="status">{formMessage}</p>}
              {formError && <p className="admin-form-error" role="alert">{formError}</p>}
            </div>
          </form>
        </section>

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
          Development preview only. This page has no admin authentication. Creation is enabled for local testing only.
          Do not expose management APIs publicly.
        </p>
      </div>
    </main>
  );
}
