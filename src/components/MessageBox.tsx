type MessageBoxProps = {
  messages: string[] | null;
  type?: "error" | "success";
};

export function MessageBox({ messages, type = "error" }: MessageBoxProps) {
  if (!messages || messages.length === 0) return null;

  const baseStyle = "border px-4 py-3 rounded mb-4 text-sm";

  const typeStyle =
    type === "error"
      ? "bg-red-100 border-red-400 text-red-700"
      : "bg-green-100 border-green-400 text-green-700";

  return (
    <div className={`${baseStyle} ${typeStyle}`} role="alert">
      <ul className="list-disc list-inside">
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
