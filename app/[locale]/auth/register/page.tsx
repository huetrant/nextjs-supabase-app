"use client";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Đăng ký tài khoản
          </CardTitle>
          <CardDescription className="text-center">
            Tạo tài khoản mới để sử dụng hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Tối thiểu 6 ký tự"
              required
            />

            <Input
              label="Xác nhận mật khẩu"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword && password !== confirmPassword ? "Mật khẩu không khớp" : undefined}
              required
            />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={password !== confirmPassword}
            >
              Đăng ký
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}