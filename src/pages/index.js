import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";

export default function CandidateForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    skills: "",
    experience: "",
    resume: null,
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    console.log("🔍 Updated UI Results:", results);
  }, [results]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("📤 Submitting Form...");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      console.log("📄 Resume Text Extracted:", result.text);
      setPopupMessage("Submission Successful!");
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      setPopupMessage("Submission Failed!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg relative">
      {/* Popup Notification */}
      {popupMessage && (
        <div className="absolute top-5 right-5 bg-green-500 text-white p-3 rounded shadow-lg">
          {popupMessage}
        </div>
      )}
      
      {/* ✅ Candidate Form */}
      <h2 className="text-2xl font-bold mb-4">Candidate Application Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="linkedin"
          placeholder="LinkedIn URL"
          className="w-full p-2 border rounded"
          value={formData.linkedin}
          onChange={handleChange}
          required
        />
        <textarea
          name="skills"
          placeholder="Skills (e.g., JavaScript, React, Node.js)"
          className="w-full p-2 border rounded"
          value={formData.skills}
          onChange={handleChange}
          required
        ></textarea>
        <textarea
          name="experience"
          placeholder="Experience (Years of work experience)"
          className="w-full p-2 border rounded"
          value={formData.experience}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="file"
          name="resume"
          accept=".pdf"
          className="w-full p-2 border rounded"
          onChange={handleFileChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* ✅ Candidate Search */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Candidate Search</h2>
        <SearchBar onSearch={setResults} />

        {loading ? (
          <p className="text-blue-500 mt-4">Loading...</p>
        ) : Array.isArray(results) && results.length > 0 ? (
          <div className="mt-5">
            <h2 className="text-xl font-semibold">Matching Candidates</h2>
            <ul className="mt-3 space-y-3">
              {results.map((candidate, index) => {
                console.log("📌 Candidate UI Data:", candidate);
                const metadata = candidate.metadata || {};

                return (
                  <li key={candidate.id || index} className="p-4 border rounded shadow">
                    <strong className="block text-lg">{metadata.name || "Unknown Candidate"}</strong>
                    <p>Email: {metadata.email || "Not Provided"}</p>
                    <p>
                      LinkedIn: {" "}
                      <a
                        href={metadata.linkedin || "#"}
                        className="text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {metadata.linkedin || "Not Provided"}
                      </a>
                    </p>
                    <p>Skills: {metadata.skills || "Not Provided"}</p>
                    <p>Experience: {metadata.experience || "Not Provided"} years</p>
                    <p className="text-sm text-gray-500">
                      Match Score: {candidate.score ? Number(candidate.score).toFixed(2) : "N/A"}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No matching candidates found.</p>
        )}
      </div>
    </div>
  );
}
