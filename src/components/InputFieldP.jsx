const InputFieldP = ({ label, name, value, onChange, error, type = "text", placeholder }) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-[48%]">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default InputFieldP; 