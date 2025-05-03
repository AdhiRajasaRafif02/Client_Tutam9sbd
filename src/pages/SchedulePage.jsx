import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const dayOrder = {
  senin: 1,
  selasa: 2,
  rabu: 3,
  kamis: 4,
  jumat: 5,
  sabtu: 6,
  minggu: 7,
};

const dayOptions = [
  "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"
];

function SchedulePage() {
  const { profileId } = useParams();
  const [scheduleList, setScheduleList] = useState([]);
  const [profileName, setProfileName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    day: "",
    subject: "",
    start_time: "",
    end_time: "",
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/schedules/${profileId}`);
      const sorted = res.data.sort((a, b) =>
        (dayOrder[a.day.toLowerCase()] || 99) - (dayOrder[b.day.toLowerCase()] || 99)
      );
      setScheduleList(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfileName = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/profiles`);
      const profile = res.data.find((p) => p.id === parseInt(profileId));
      if (profile) setProfileName(profile.name);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProfileName();
  }, [profileId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      profile_id: parseInt(profileId),
      start_time: form.start_time + ":00",
      end_time: form.end_time + ":00",
    };
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/schedules/${editingId}`, data);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/schedules", data);
      }
      setForm({ day: "", subject: "", start_time: "", end_time: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      day: item.day,
      subject: item.subject,
      start_time: item.start_time.slice(0, 5),
      end_time: item.end_time.slice(0, 5),
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/schedules/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white text-gray-900 rounded-lg shadow-xl p-8">

        {/* ✅ Tombol Kembali */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-block bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            ← Kembali ke Daftar Profil
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">
          Jadwal {profileName || `Profil ID: ${profileId}`}
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <select
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value })}
            required
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="">Pilih Hari</option>
            {dayOptions.map((day) => (
              <option key={day} value={day.toLowerCase()}>{day}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Mata Pelajaran"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="time"
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            required
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="time"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            required
            className="border border-gray-300 rounded px-4 py-2"
          />
          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Simpan Perubahan" : "Tambah Jadwal"}
          </button>
        </form>

        <ul className="space-y-4">
          {scheduleList.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded shadow"
            >
              <span>
                <strong>{item.day}</strong>: {item.subject} ({item.start_time} - {item.end_time})
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
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

export default SchedulePage;
