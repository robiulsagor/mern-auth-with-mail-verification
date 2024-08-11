import { motion } from "framer-motion";
import { Loader, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";

function SignIn() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignin = (e) => {
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
          Welcome Back!
        </h2>

        <form onSubmit={handleSignin}>
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

          <motion.button
            className="mt-5 w-full bg-green-500 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 font-bold rounded-lg text-white hover:to-emerald-700 hover:ring-2 hover:ring-green-600 disabled:ring-0 disabled:cursor-not-allowed disabled:bg-opacity-45"
            whileTap={!isLoading && { scale: 0.9 }}
            whileHover={!isLoading && { scale: 1.09 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="size-5 animate-spin mx-auto" />
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>
      </div>

      <div className="bg-gray-800 p-3">
        <p className="text-center text-gray-400">
          Don't have an account
          <Link
            to={"/signup"}
            className="text-green-400 hover:text-green-500 hover:underline transition"
          >
            Sign Ip
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default SignIn;
