"use client";

import { useState } from "react";
import { useUser } from "./context/usercontext";
import React from "react";
import Image from "next/image";
import drait from "@/app/assets/full_logo-wide.png";
import { useRouter } from "next/navigation"; 
import buddha from "./assets/buddha.jpg";
import ImageWithAltCenter from './components/image_with_center';

const LoginPage = () => {
  const { setUser } = useUser();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password }),
    });
    const data = await response.json();

    if (data.success) {
      setUser({ name: data.name, role: data.role, department: data.department });
      
      // Redirect based on the department
      if (data.department === 'Admission') {
        router.push("/admission/adm_home");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (   
    <div className="min-h-screen flex flex-col items-center justify-start pt-24 bg-gray-50">
      <header className="bg-gradient-to-r fixed from-white from-25% via-blue-500 to-purple-600 flex items-center justify-between px-4 py-2 top-0 left-0 z-50 w-full">
        <Image src={drait} width={400} height={500} alt="drait logo wide" />
      </header>

      <div className="flex flex-col items-center  space-y-6">
        {/* Centered Image */}
        <ImageWithAltCenter   src={buddha} alt="Image Not Available" />

        {/* Centered Heading */}
        <h2 className="text-2xl font-bold text-center">Management Information System</h2>

        {/* Centered Form */}
        <div className="w-full max-w-md p-6 bg-white rounded shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button 
            onClick={handleLogin} 
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
