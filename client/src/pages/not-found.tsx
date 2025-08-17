export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-950 text-white">
      <div className="text-center">
        <p className="text-cyan-400 font-semibold">404</p>
        <h1 className="text-3xl font-bold mt-2">Page not found</h1>
        <a href="/" className="inline-block mt-6 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400">Go home</a>
      </div>
    </div>
  );
}