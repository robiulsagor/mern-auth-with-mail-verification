const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 pl-3 left-0 flex items-center pointer-events-none">
        <Icon className="size-5 text-green-500" />
      </div>

      <input
        {...props}
        className="w-full  pl-10 pr-3 py-2 rounded-lg  bg-gray-800 bg-opacity-50 border border-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-200 placeholder:text-gray-400 transition duration-200"
      />
    </div>
  );
};

export default Input;
