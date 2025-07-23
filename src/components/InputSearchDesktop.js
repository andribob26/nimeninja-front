import React from "react";

const InputSearchDesktop = () => {
  return (
    <>
      <input
        type="text"
        placeholder="Cari anime..."
        className="w-full px-3 py-2 text-sm rounded-sm border border-white/[0.08] shadow-[inset_2px_4px_16px_0px_#f8f8f80f] backdrop-blur-[20px] bg-[#ffffff14] outline-0 focus:outline-none placeholder-white/60"
      />

      {/* Dropdown hasil pencarian */}
      <div className="absolute left-0 right-0 mt-2">
        <ul className="bg-dark border border-white/[0.1] rounded shadow-lg max-h-64 overflow-y-auto">
          <li className="px-4 py-2 text-sm text-white/80 hover:bg-white/10">
            Naruto
          </li>
          <li className="px-4 py-2 text-sm text-white/80 hover:bg-white/10">
            One Piece
          </li>
          <li className="px-4 py-2 text-sm text-white/80 hover:bg-white/10">
            Jujutsu Kaisen
          </li>
        </ul>
      </div>
    </>
  );
};

export default InputSearchDesktop;
