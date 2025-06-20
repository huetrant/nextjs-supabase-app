"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) setError(error.message);
    else setSuccess("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");
    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister} className="max-w-sm mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Đăng ký</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Đang đăng ký..." : "Đăng ký"}
      </button>
    </form>
  );
}
