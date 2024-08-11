import { motion } from "framer-motion";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

function Signup() {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = (e) => {
    e.preventDefault();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
      }}
      className="max-w-md w-full bg-gray-800  rounded-2xl shadow-xl z-0 bg-opacity-50 backdrop-filter backdrop-blur-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl text-center font-bold  mb-6 text-transparent bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handleSignup}>
          <Input
            icon={User}
            type="text"
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            placeholder="Enter your name"
          />
          <Input
            icon={Mail}
            type="email"
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
            placeholder="Enter your email address"
          />
          <Input
            icon={Lock}
            type="password"
            value={input.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
            placeholder="Enter your password"
          />

          <PasswordStrengthMeter password={input.password} />

          <motion.button
            className="mt-5 w-full bg-green-500 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 font-bold rounded-lg text-white hover:to-emerald-700 hover:ring-2 hover:ring-green-600"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.09 }}
          >
            Sign Up
          </motion.button>
        </form>
      </div>

      <div className="bg-gray-800 p-3">
        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to={"/signin"}
            className="text-green-400 hover:text-green-500 hover:underline transition"
          >
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default Signup;
