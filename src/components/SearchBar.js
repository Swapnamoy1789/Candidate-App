import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query) return alert("Please enter a job description");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: query }),
      });

      const data = await response.json();
      console.log("🔍 Candidates from API:", data.candidates); // ✅ Debug log

      onSearch(data.candidates); // ✅ Ensure correct field is used
    } catch (error) {
      console.error("❌ Error fetching candidates:", error);
      onSearch([]); // Ensure UI updates properly even on error
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <textarea
        className="p-2 border rounded"
        placeholder="Enter job description..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 rounded" onClick={handleSearch}>
        Search Candidates
      </button>
    </div>
  );
};

export default SearchBar;
