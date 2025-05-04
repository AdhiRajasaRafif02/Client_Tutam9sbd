import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ name: "", status: "" });

  const fetchProfiles = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/profiles`);
      setProfiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/profiles`, form);
      setForm({ name: "", status: "" });
      fetchProfiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/profiles/${id}`);
      fetchProfiles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Tambah Profil Baru</h1>
        <form onSubmit={handleAdd} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Nama"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            required
            className="border px-4 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Tambah Profil
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-4 text-center">Daftar Profil</h2>
        <ul className="space-y-4">
          {profiles.map((profile) => (
            <li
              key={profile.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded shadow"
            >
              <div>
                <p className="font-bold text-gray-800">{profile.name}</p>
                <p className="text-sm text-gray-600">{profile.status}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/schedule/${profile.id}`}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 hover:text-white text-sm transition font-medium"
                >
                  Lihat Jadwal
                </Link>
                <button
                  onClick={() => handleDelete(profile.id)}
                  className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfileList;
